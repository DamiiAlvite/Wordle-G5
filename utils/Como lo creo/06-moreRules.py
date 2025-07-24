import json
import re

# Cargar palabras del paso anterior
with open('05-onlySpanishRefined.json', 'r', encoding='utf-8') as f:
    palabras = json.load(f)

# Lista de excepciones permitidas
excepciones = {
    "koala", "crack", "tokio", "vodka", "póker", "pekín", "tizne", "venus", "bonus", "vidas", "ñoqui", "blusa","mayor",
    "mayas", "cavan", "lavan", "vivan", "nivel", "drama", "ladra", "pudra", "sidra", "nadie", "serie", "calle", "valle", "talle"
}

# Reglas adicionales de filtrado
patrones_invalidos = [
    r'ohe', r'mf', r'sy', r'ly', r'nn', r'ahi', r'k', r'ts', r'ain', r'ienda', r'iendo', r'aha', r'eha', r'iha', r'oha',
    r'iente', r'iento', r'dj', r'gog', r'hea', r'lli', r'cd', r'xie', r'ou', r'zn', r'lal', r'gis', r'sr',
    r'ayn', r'oyn', r'sme', r'nus', r'ved', r'vad', r'vid', r'gay', r'van', r'gy', r'dra', r'jie',
    r'y$', r'll$', r'ag$', r'eg$', r'ig$', r'og$', r'ug$', r'blu$', r'cill$',
    r'fus(?![aeiouáéíóú])',  # "fus" no seguido de vocal
    r'haz[aeiouáéíóú]',      # "haz" seguida de vocal
    r'^ñ',                    # empieza con ñ
    r'^bl',                   # empieza con bl
    r'^may',                   # empieza con may
    r'^mb',                # empieza con mb
    r'^st',                # empieza con st
    r'vel$',           # termina con vel
    r'fos$',           # termina con fos
    r'ie$',            # termina con ie
    r'cuo$',            # termina con cuo
    r'lle$',            # termina con lle
]

# Compilar las expresiones regulares
regex_invalidos = [(pat, re.compile(pat)) for pat in patrones_invalidos]

palabras_validas = []
palabras_eliminadas = []

for palabra in palabras:
    if palabra in excepciones:
        palabras_validas.append(palabra)
        continue

    violaciones = [pat for pat, regex in regex_invalidos if regex.search(palabra)]

    if violaciones:
        palabras_eliminadas.append({
            "palabra": palabra,
            "reglas_violadas": violaciones
        })
    else:
        palabras_validas.append(palabra)

# Guardar resultados
with open('06-onlySpanishMoreRefined.json', 'w', encoding='utf-8') as f:
    json.dump(palabras_validas, f, indent=2, ensure_ascii=False)

with open('06-invalidWords.json', 'w', encoding='utf-8') as f:
    json.dump(palabras_eliminadas, f, indent=2, ensure_ascii=False)

# Resumen
print(f"✅ Palabras finales válidas: {len(palabras_validas)}")
print(f"❌ Palabras eliminadas en esta etapa: {len(palabras_eliminadas)}")
