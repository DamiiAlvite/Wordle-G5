import json
import argparse
import os

def filter_words_from_json(input_json_path, english_words_json_path):
    """
    Filtra palabras de un archivo JSON principal, eliminando las que existen
    en un archivo JSON de palabras en inglés. Muestra las palabras eliminadas.

    Args:
        input_json_path (str): La ruta al archivo JSON de entrada (tu diccionario principal).
        english_words_json_path (str): La ruta al archivo JSON con las palabras en inglés.

    Returns:
        tuple: Una tupla que contiene:
            - list: Una lista ordenada de palabras filtradas.
            - list: Una lista ordenada de palabras que fueron eliminadas.
    """
    
    # 1. Cargar palabras en inglés
    english_words = set()
    try:
        with open(english_words_json_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
            if isinstance(data, list):
                english_words.update(word.lower() for word in data)
            else:
                print(f"Advertencia: El archivo '{english_words_json_path}' no contiene una lista JSON. Verifique su formato.")
                return [], []
        print(f"Cargadas {len(english_words)} palabras del diccionario de inglés.")
    except FileNotFoundError:
        print(f"Error: El archivo de palabras en inglés '{english_words_json_path}' no fue encontrado.")
        return [], []
    except json.JSONDecodeError:
        print(f"Error: No se pudo decodificar el JSON de palabras en inglés en '{english_words_json_path}'. Verifique su formato.")
        return [], []
    except Exception as e:
        print(f"Ocurrió un error al cargar el archivo de palabras en inglés: {e}")
        return [], []

    # 2. Cargar palabras del JSON principal
    main_words = set()
    try:
        with open(input_json_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
            if isinstance(data, list):
                main_words.update(word.lower() for word in data)
            else:
                print(f"Advertencia: El archivo '{input_json_path}' no contiene una lista JSON. Verifique su formato.")
                return [], []
        print(f"Cargadas {len(main_words)} palabras del diccionario principal.")
    except FileNotFoundError:
        print(f"Error: El archivo de entrada '{input_json_path}' no fue encontrado.")
        return [], []
    except json.JSONDecodeError:
        print(f"Error: No se pudo decodificar el JSON de entrada en '{input_json_path}'. Verifique su formato.")
        return [], []
    except Exception as e:
        print(f"Ocurrió un error al cargar el archivo de entrada: {e}")
        return [], []

    # 3. Filtrar palabras y registrar las eliminadas
    filtered_words = []
    removed_words = []
    
    for word in main_words:
        if word not in english_words:
            filtered_words.append(word)
        else:
            removed_words.append(word)

    print(f"Palabras después de filtrar (eliminadas las de inglés): {len(filtered_words)}")

    return sorted(list(filtered_words)), sorted(list(removed_words))

# --- Cómo usar el script desde la línea de comandos ---
if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Elimina palabras de un JSON principal que existan en un JSON de palabras en inglés y muestra las eliminadas."
    )
    parser.add_argument(
        "input_json",
        help="Ruta al archivo JSON de entrada (tu diccionario principal, ej: 5letters.json)"
    )
    parser.add_argument(
        "--english_json",
        default="02-1000PalabrasEnIngles.json",
        help="Ruta al archivo JSON con las palabras en inglés (por defecto: 02-1000PalabrasEnIngles.json)"
    )
    parser.add_argument(
        "--output_json",
        default="03-onlySpanish.json",
        help="Nombre del archivo de salida para las palabras filtradas (por defecto: 03-onlySpanish.json)"
    )

    args = parser.parse_args()

    print(f"Filtrando palabras de '{args.input_json}' usando '{args.english_json}'...")
    filtered_list, removed_list = filter_words_from_json(args.input_json, args.english_json)

    if filtered_list:
        try:
            with open(args.output_json, 'w', encoding='utf-8') as f:
                json.dump(filtered_list, f, ensure_ascii=False, indent=4)
            print(f"Palabras filtradas guardadas en '{args.output_json}'.")
        except Exception as e:
            print(f"Error al guardar el archivo de salida: {e}")
    else:
        print("No se pudieron filtrar palabras o la lista resultante está vacía.")

    if removed_list:
        print("\n--- Palabras Eliminadas (por estar en el diccionario de inglés) ---")
        for word in removed_list:
            print(word)
        print(f"Total de palabras eliminadas: {len(removed_list)}")
    else:
        print("\nNo se eliminaron palabras (ninguna palabra del diccionario principal se encontró en el diccionario de inglés).")