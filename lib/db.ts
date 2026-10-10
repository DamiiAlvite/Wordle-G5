import AsyncStorage from '@react-native-async-storage/async-storage';

// Backend local: guarda usuarios, palabras y partidas en AsyncStorage del dispositivo.
// Imita la parte de la API de supabase-js que usa la app (auth + from().select/insert/update/delete).

export type User = { id: string; email: string; created_at: string };
export type Session = { access_token: string; user: User };
export type DbError = { message: string; code?: string };
type Result<T = any> = { data: T; error: DbError | null };

type Row = Record<string, any>;
type TableName = 'user' | 'word' | 'game';
type StoredUser = User & { password: string };
type Store = {
  users: StoredUser[];
  tables: Record<TableName, Row[]>;
  seq: Record<TableName, number>;
};

const DB_KEY = '@wordle-g5/db';
const SESSION_KEY = '@wordle-g5/session';

// Clave primaria de cada tabla y restricciones de unicidad
const UNIQUE: Record<TableName, string[][]> = {
  user: [['user_id']],
  word: [['id'], ['date', 'mode']],
  game: [['id']],
};
const AUTO_ID: Record<TableName, boolean> = { user: false, word: true, game: true };

const emptyStore = (): Store => ({
  users: [],
  tables: { user: [], word: [], game: [] },
  seq: { user: 0, word: 0, game: 0 },
});

let storePromise: Promise<Store> | null = null;

const loadStore = () => {
  if (!storePromise) {
    storePromise = AsyncStorage.getItem(DB_KEY)
      .then(raw => (raw ? { ...emptyStore(), ...JSON.parse(raw) } : emptyStore()))
      .catch(() => emptyStore());
  }
  return storePromise;
};

const saveStore = (store: Store) => AsyncStorage.setItem(DB_KEY, JSON.stringify(store));

const uuid = () =>
  'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });

const ok = <T,>(data: T): Result<T> => ({ data, error: null });
const fail = (message: string, code?: string): Result<null> => ({ data: null, error: { message, code } });

/* ----------------------------- Consultas ----------------------------- */

type Filter = (row: Row) => boolean;

class QueryBuilder<T = any[]> implements PromiseLike<Result<T>> {
  private action: 'select' | 'insert' | 'update' | 'delete' = 'select';
  private columns: string[] | null = null;
  private returning = false;
  private payload: Row[] | Row | null = null;
  private filters: Filter[] = [];
  private mode: 'many' | 'single' | 'maybeSingle' = 'many';

  constructor(private table: TableName) {}

  select(columns = '*') {
    if (this.action === 'select') {
      this.columns = parseColumns(columns);
    } else {
      this.returning = true;
      this.columns = parseColumns(columns);
    }
    return this;
  }

  insert(rows: Row | Row[]) {
    this.action = 'insert';
    this.payload = Array.isArray(rows) ? rows : [rows];
    return this;
  }

  update(values: Row) {
    this.action = 'update';
    this.payload = values;
    return this;
  }

  delete() {
    this.action = 'delete';
    return this;
  }

  eq(column: string, value: any) {
    this.filters.push(row => row[column] === value);
    return this;
  }

  in(column: string, values: any[]) {
    this.filters.push(row => values.includes(row[column]));
    return this;
  }

  single() {
    this.mode = 'single';
    return this as unknown as QueryBuilder<any>;
  }

  maybeSingle() {
    this.mode = 'maybeSingle';
    return this as unknown as QueryBuilder<any>;
  }

  then<R1 = Result<T>, R2 = never>(
    onfulfilled?: ((value: Result<T>) => R1 | PromiseLike<R1>) | null,
    onrejected?: ((reason: any) => R2 | PromiseLike<R2>) | null
  ): PromiseLike<R1 | R2> {
    return (this.execute() as Promise<Result<T>>).then(onfulfilled, onrejected);
  }

  private async execute(): Promise<Result> {
    const store = await loadStore();
    const rows = store.tables[this.table];
    const matches = (row: Row) => this.filters.every(f => f(row));
    let result: Row[] = [];

    switch (this.action) {
      case 'select':
        result = rows.filter(matches);
        break;

      case 'insert': {
        const inserted: Row[] = [];
        for (const input of this.payload as Row[]) {
          const row: Row = { ...input, created_at: new Date().toISOString() };
          if (AUTO_ID[this.table]) row.id = ++store.seq[this.table];
          const conflict = UNIQUE[this.table].find(keys =>
            [...rows, ...inserted].some(existing => keys.every(k => existing[k] === row[k]))
          );
          if (conflict) {
            return fail(`duplicate key value violates unique constraint (${conflict.join(', ')})`, '23505');
          }
          inserted.push(row);
        }
        rows.push(...inserted);
        await saveStore(store);
        result = inserted;
        if (!this.returning) return ok(null);
        break;
      }

      case 'update': {
        result = rows.filter(matches);
        result.forEach(row => Object.assign(row, this.payload));
        await saveStore(store);
        if (!this.returning) return ok(null);
        break;
      }

      case 'delete': {
        result = rows.filter(matches);
        store.tables[this.table] = rows.filter(row => !matches(row));
        await saveStore(store);
        if (!this.returning) return ok(null);
        break;
      }
    }

    const projected = result.map(row => project(row, this.columns));

    if (this.mode === 'many') return ok(projected);
    if (projected.length > 1) return fail('JSON object requested, multiple rows returned', 'PGRST116');
    if (projected.length === 0) {
      return this.mode === 'maybeSingle' ? ok(null) : fail('JSON object requested, no rows returned', 'PGRST116');
    }
    return ok(projected[0]);
  }
}

const parseColumns = (columns: string) =>
  columns.trim() === '*' ? null : columns.split(',').map(c => c.trim()).filter(Boolean);

const project = (row: Row, columns: string[] | null) =>
  columns ? Object.fromEntries(columns.map(c => [c, row[c]])) : { ...row };

/* -------------------------------- Auth -------------------------------- */

type AuthEvent = 'SIGNED_IN' | 'SIGNED_OUT' | 'USER_UPDATED';
type AuthListener = (event: AuthEvent, session: Session | null) => void;

const listeners = new Set<AuthListener>();
let currentSession: Session | null | undefined;

const publicUser = ({ password, ...user }: StoredUser): User => user;

const getStoredSession = async () => {
  if (currentSession === undefined) {
    const raw = await AsyncStorage.getItem(SESSION_KEY).catch(() => null);
    currentSession = raw ? JSON.parse(raw) : null;
  }
  return currentSession ?? null;
};

const setSession = async (session: Session | null, event: AuthEvent) => {
  currentSession = session;
  if (session) await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(session));
  else await AsyncStorage.removeItem(SESSION_KEY);
  listeners.forEach(listener => listener(event, session));
};

const auth = {
  async signUp({ email, password }: { email: string; password: string }) {
    const store = await loadStore();
    const normalized = email.trim().toLowerCase();
    if (store.users.some(u => u.email === normalized)) {
      return { data: { user: null, session: null }, error: { message: 'User already registered' } };
    }
    const stored: StoredUser = { id: uuid(), email: normalized, password, created_at: new Date().toISOString() };
    store.users.push(stored);
    await saveStore(store);
    const user = publicUser(stored);
    const session: Session = { access_token: uuid(), user };
    await setSession(session, 'SIGNED_IN');
    return { data: { user, session }, error: null };
  },

  async signInWithPassword({ email, password }: { email: string; password: string }) {
    const store = await loadStore();
    const stored = store.users.find(u => u.email === email.trim().toLowerCase());
    if (!stored || stored.password !== password) {
      return { data: { user: null, session: null }, error: { message: 'Invalid login credentials' } };
    }
    const user = publicUser(stored);
    const session: Session = { access_token: uuid(), user };
    await setSession(session, 'SIGNED_IN');
    return { data: { user, session }, error: null };
  },

  async signOut() {
    await setSession(null, 'SIGNED_OUT');
    return { error: null };
  },

  async getSession() {
    return { data: { session: await getStoredSession() }, error: null };
  },

  async getUser() {
    const session = await getStoredSession();
    if (!session) return { data: { user: null }, error: { message: 'Auth session missing!' } };
    return { data: { user: session.user }, error: null };
  },

  async updateUser({ password }: { password?: string }) {
    const session = await getStoredSession();
    const store = await loadStore();
    const stored = session && store.users.find(u => u.id === session.user.id);
    if (!stored) return { data: { user: null }, error: { message: 'Auth session missing!' } };
    if (password) stored.password = password;
    await saveStore(store);
    listeners.forEach(listener => listener('USER_UPDATED', session));
    return { data: { user: publicUser(stored) }, error: null };
  },

  onAuthStateChange(listener: AuthListener) {
    listeners.add(listener);
    return { data: { subscription: { unsubscribe: () => listeners.delete(listener) } } };
  },
};

export const db = {
  auth,
  from: (table: TableName) => new QueryBuilder(table),
};
