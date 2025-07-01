import json

# Archivos de entrada
archivo_es = "01-Spanish5LWords.json"
archivo_en = "01-English5LWords.json"
archivo_salida = "OnlySpanish5LWords.json"

# Cargar archivos JSON
with open(archivo_es, "r", encoding="utf-8") as f:
    palabras_es = set(json.load(f))

with open(archivo_en, "r", encoding="utf-8") as f:
    palabras_en = set(json.load(f))

# Filtrar: eliminar las que están también en inglés
palabras_filtradas = sorted(palabras_es - palabras_en)

# Guardar resultado
with open(archivo_salida, "w", encoding="utf-8") as f:
    json.dump(palabras_filtradas, f, ensure_ascii=False, indent=2)

print(f"Se guardaron {len(palabras_filtradas)} palabras filtradas en '{archivo_salida}'")
