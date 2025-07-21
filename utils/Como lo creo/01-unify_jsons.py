import sys
import json
import os
import unicodedata

def quitar_tildes(palabra):
    """
    Devuelve la palabra sin tildes, útil para comparar.
    """
    return ''.join(
        c for c in unicodedata.normalize('NFD', palabra)
        if unicodedata.category(c) != 'Mn'
    )

def unificar_jsons(json_paths, output_path='01-unify5letters.json'):
    normalizado_a_original = {}

    for path in json_paths:
        if not os.path.isfile(path):
            print(f"Advertencia: archivo no encontrado '{path}', se omite.")
            continue

        try:
            with open(path, 'r', encoding='utf-8') as f:
                palabras = json.load(f)

            for palabra in palabras:
                palabra = palabra.strip().lower()
                clave_normalizada = quitar_tildes(palabra)

                # Prioriza versiones con tilde
                anterior = normalizado_a_original.get(clave_normalizada)
                if (anterior is None) or (quitar_tildes(anterior) == clave_normalizada and palabra != quitar_tildes(palabra)):
                    normalizado_a_original[clave_normalizada] = palabra

        except Exception as e:
            print(f"Error al procesar '{path}': {e}")

    palabras_unificadas = sorted(set(normalizado_a_original.values()))

    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(palabras_unificadas, f, ensure_ascii=False, indent=4)

    print(f"\n✅ Unificación completada. Total de palabras: {len(palabras_unificadas)}")
    print(f"📄 Archivo generado: {output_path}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Uso: python unify_jsons.py archivo1.json archivo2.json ...")
        sys.exit(1)

    json_files = sys.argv[1:]
    unificar_jsons(json_files)
