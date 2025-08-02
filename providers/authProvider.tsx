import { createContext, useState, useEffect, useContext } from "react";
import { Session } from "@supabase/supabase-js";
import { router } from "expo-router";
import { supabase } from "../lib/supabase";

type AuthData = {
    loading: boolean;
    session: Session | null;
    userId: string | null;
    username: string | null;
    refreshUserData: () => Promise<void>;
};

const AuthContext = createContext<AuthData>({
    loading: true,
    session: null,
    userId: null,
    username: null,
    refreshUserData: async () => { },
});

interface Props {
    children: React.ReactNode;
}

export default function AuthProvider(props: Props) {
    const [loading, setLoading] = useState(true);
    const [session, setSession] = useState<Session | null>(null);
    const [username, setUsername] = useState<string | null>(null);
    
    const refreshUserData = async (id: string | null) => {
        if (!id) return;
        
        // Retry logic para manejar casos donde el usuario aún no está en la BD
        let retries = 3;
        while (retries > 0) {
            const { data, error } = await supabase
                .from("user")
                .select("name")
                .eq("user_id", id)
                .single();

            if (error) {
                if (error.code === "PGRST116" && retries > 1) {
                    // Si no se encuentra el usuario, esperar y reintentar
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    retries--;
                    continue;
                }
                console.error("Error fetching user name:", error);
                return;
            }
            
            setUsername(data?.name ?? null);
            break;
        }
    };

    useEffect(() => {
        async function fetchSession() {
            const { error, data } = await supabase.auth.getSession();
            if (error) {
                console.error("Error fetching session:", error);
            }
            if (data.session) {
                setSession(data.session);
            } else {
                router.replace("/signin");
            }
            setLoading(false);
        }

        fetchSession();

        const { data: authListener } = supabase.auth.onAuthStateChange(async (_, session) => {
            setSession(session);
            setLoading(false);
            if (session) {
                router.replace("/");
            } else {
                router.replace("/signin");
            }
        });

        return () => {
            authListener?.subscription.unsubscribe();
        }
    }, [])

    useEffect(() => {
        if (session?.user?.id) {
            refreshUserData(session.user.id);
        } else {
            // Limpiar el username cuando no hay sesión
            setUsername(null);
        }
    }, [session]);

    return (
        <AuthContext.Provider value={{ 
            loading, 
            session, 
            userId: session?.user?.id ?? null, 
            username, 
            refreshUserData: () => refreshUserData(session?.user?.id ?? null) 
        }}>
            {props.children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);