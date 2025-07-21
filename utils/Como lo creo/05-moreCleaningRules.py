import json
import re

# Cargar palabras filtradas del paso anterior
with open('04-onlySpanishFiltred.json', 'r', encoding='utf-8') as f:
    palabras = json.load(f)

# Definiciones
vocales = 'aeiouáéíóú'
consonantes = 'bcdfghjklmnñpqrstvwxyz'

# Reglas de limpieza avanzada
reglas_avanzadas = {
    "Termina en letra poco común (t, c, v, x, m, j)": lambda w: w[-1] in ['t', 'c', 'v', 'x', 'm', 'j'],
    "Contiene combinación inusual (dh, gh, aa, ee, ii, oo, uu)": lambda w: any(c in w for c in ['dh', 'gh', 'aa', 'ee', 'ii', 'oo', 'uu']),
    "Empieza con k, w, x, z": lambda w: w[0] in ['k', 'w', 'x', 'z'],
    "Termina con k, w, x, z": lambda w: w[-1] in ['k', 'w', 'x', 'z'],
    "Tiene H al final": lambda w: w.endswith('h'),
    "Tiene más de 2 letras poco frecuentes (k, w, x, z, j, ñ, q, y)": lambda w: sum(1 for c in w if c in 'kwxzjqyñ') > 2,
    "Tiene vocales separadas solo por H más de una vez": lambda w: len(re.findall(r'[aeiouáéíóú]h[aeiouáéíóú]', w)) > 1,
    "Termina en combinaciones no finales en español (nt, mp, ct, sk)": lambda w: any(w.endswith(c) for c in ['nt', 'mp', 'ct', 'sk']),
}

palabras_validas = []
palabras_eliminadas = []

for palabra in palabras:
    palabra = palabra.lower()
    violaciones = [nombre for nombre, check in reglas_avanzadas.items() if check(palabra)]

    if violaciones:
        palabras_eliminadas.append({
            "palabra": palabra,
            "reglas_violadas": violaciones
        })
    else:
        palabras_validas.append(palabra)

# Guardar resultados
with open('05-onlySpanishRefined.json', 'w', encoding='utf-8') as f:
    json.dump(palabras_validas, f, indent=2, ensure_ascii=False)

with open('05-eliminatedWordsRefined.json', 'w', encoding='utf-8') as f:
    json.dump(palabras_eliminadas, f, indent=2, ensure_ascii=False)

# Resumen
print(f"🟢 Palabras válidas: {len(palabras_validas)}")
print(f"🔴 Palabras eliminadas: {len(palabras_eliminadas)}")
