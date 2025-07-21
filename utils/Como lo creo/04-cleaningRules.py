import json
import re

# Cargar palabras desde el archivo original
with open('03-onlySpanish.json', 'r', encoding='utf-8') as f:
    palabras = json.load(f)

# Vocales incluyendo acentuadas
vocales = 'aeiouáéíóú'
consonantes = 'bcdfghjklmnñpqrstvwxyz'

# Combinaciones inválidas en español
comb_invalidas = [
    'sh', 'th', 'ph', 'ck', 'rh', 'bb', 'dd', 'ff', 'gg', 'hh', 'jj', 'kk', 'mm',
    'pp', 'qq', 'ss', 'tt', 'vv', 'yy', 'zz', 'ww', 'xx', 'nb', 'mv', 'vr', 'vl',
    'lh', 'nh', 'tz', 'gn', 'bt', 'bd', 'lk', 'zx', 'xq', 'kz'
]

# Reglas de filtrado
reglas = {
    "Empieza con 3 consonantes": lambda w: bool(re.match(r'^[^aeiouáéíóú]{3}', w)),
    "Termina con 3 consonantes": lambda w: bool(re.search(r'[^aeiouáéíóú]{3}$', w)),
    "Tiene 4 o más consonantes": lambda w: sum(1 for c in w if c in consonantes) >= 4,
    "Tiene 1 vocal o menos": lambda w: sum(1 for c in w if c in vocales) <= 1,
    "Contiene W": lambda w: 'w' in w,
    "H no seguida por vocal": lambda w: bool(re.search(r'h(?![aeiouáéíóú])', w)),
    "Empieza con H y luego una consonante": lambda w: bool(re.match(r'h[^aeiouáéíóú]', w)),
    "Q no seguida por U": lambda w: bool(re.search(r'q(?!u)', w)),
    "Tiene 3 vocales seguidas": lambda w: bool(re.search(r'[aeiouáéíóú]{3,}', w)),
    "Contiene combinación inválida": lambda w: any(invalida in w for invalida in comb_invalidas),
}

palabras_validas = []
palabras_eliminadas = []

for palabra in palabras:
    palabra = palabra.lower()
    violaciones = [nombre for nombre, funcion in reglas.items() if funcion(palabra)]

    if violaciones:
        palabras_eliminadas.append({
            "palabra": palabra,
            "reglas_violadas": violaciones
        })
    else:
        palabras_validas.append(palabra)

# Guardar resultados
with open('04-onlySpanishFiltred.json', 'w', encoding='utf-8') as f:
    json.dump(palabras_validas, f, indent=2, ensure_ascii=False)

with open('04-eliminatedWords.json', 'w', encoding='utf-8') as f:
    json.dump(palabras_eliminadas, f, indent=2, ensure_ascii=False)

# Reporte
print(f"✅ Palabras válidas: {len(palabras_validas)}")
print(f"❌ Palabras eliminadas: {len(palabras_eliminadas)}")
