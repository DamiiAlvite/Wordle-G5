import json

# === CONFIGURACIÓN ===
INPUT_JSON = '10-5lettersV1.json'
OUTPUT_VALID = '11-5lettersV2.json'
OUTPUT_ELIMINADOS = '11-EliminatedVerbs.json'

# === Lista de excepciones válidas que deben conservarse incluso si parecen verbos ===
excepciones_validas = {
    "usted", "pared", "orgía", "mitad", "manía", "jamás",
    "espía", "bujía", "bahía", "atrás", "arpía", "nomás", "bando",
}

# === Reglas simples de verbos conjugados ===
terminaciones_verbales = [
    "ió", "ás", "ís", "ó", "ía", "ad", "ed", "id", "dle","dme", "dte",
    "ando", "aste", "iste",
]

def es_verbo_conjugado(palabra):
    return any(palabra.endswith(t) for t in terminaciones_verbales)

# === Cargar palabras ===
with open(INPUT_JSON, 'r', encoding='utf-8') as f:
    palabras = json.load(f)

# === Clasificación ===
palabras_validas = []
palabras_eliminadas = []

for palabra in palabras:
    palabra = palabra.lower()

    if palabra in excepciones_validas:
        palabras_validas.append(palabra)
    elif es_verbo_conjugado(palabra):
        palabras_eliminadas.append({
            "palabra": palabra,
            "reglas_violadas": ["Parece verbo conjugado"]
        })
    else:
        palabras_validas.append(palabra)

# === Guardar resultados ===
with open(OUTPUT_VALID, 'w', encoding='utf-8') as f:
    json.dump(palabras_validas, f, indent=2, ensure_ascii=False)

with open(OUTPUT_ELIMINADOS, 'w', encoding='utf-8') as f:
    json.dump(palabras_eliminadas, f, indent=2, ensure_ascii=False)

# === Resumen ===
print(f"🟢 Palabras válidas (no verbos o excepciones): {len(palabras_validas)}")
print(f"🔴 Posibles verbos eliminados: {len(palabras_eliminadas)}")
