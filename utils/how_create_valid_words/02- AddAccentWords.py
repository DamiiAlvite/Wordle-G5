import json
import unicodedata

# Función para remover tildes
def quitar_tildes(palabra):
    return ''.join(
        c for c in unicodedata.normalize('NFD', palabra)
        if unicodedata.category(c) != 'Mn'
    )

# Cargar JSONs
with open('02-OnlySpanish5LWords.json', 'r', encoding='utf-8') as f:
    sin_tilde = json.load(f)

with open('02-SpanishAccent5LWords.json', 'r', encoding='utf-8') as f:
    con_tilde = json.load(f)

# Convertir a sets
set_sin_tilde = set(sin_tilde)
set_con_tilde = set(con_tilde)

# Crear un diccionario con versiones sin tilde de las palabras tildadas
mapa_tildadas = {quitar_tildes(p): p for p in set_con_tilde}

# Resultado final
resultado = set()

# Paso 1: Agregar palabras tildadas, si su forma sin tilde está en el otro JSON
for palabra in set_sin_tilde:
    if palabra in mapa_tildadas:
        resultado.add(mapa_tildadas[palabra])  # Agrega la versión con tilde
    else:
        resultado.add(palabra)  # No hay versión con tilde, agrega normal

# Paso 2: Agregar palabras con tilde que no están en el otro JSON
for palabra in set_con_tilde:
    resultado.add(palabra)

# Guardar resultado
with open('03- 5letters.json', 'w', encoding='utf-8') as f:
    json.dump(sorted(resultado), f, ensure_ascii=False, indent=2)

print("✅ Archivo 'palabras_unificadas.json' generado correctamente.")
