import PyPDF2
import re
import sys
import os
import json

def extract_five_letter_words_from_pdf(pdf_path):
    """
    Extrae palabras de 5 letras de un archivo PDF, conservando tildes y la 'ñ'.
    """
    five_letter_words = set()

    try:
        with open(pdf_path, 'rb') as file:
            reader = PyPDF2.PdfReader(file)
            print(f"Procesando PDF: {pdf_path} con {len(reader.pages)} páginas...")

            for page_num in range(len(reader.pages)):
                page = reader.pages[page_num]
                text = page.extract_text()

                if text:
                    words = re.findall(r'[a-záéíóúüñ]+', text.lower())
                    for word in words:
                        if len(word) == 5:
                            five_letter_words.add(word)

                print(f"Página {page_num + 1}/{len(reader.pages)} procesada. Palabras encontradas hasta ahora: {len(five_letter_words)}")

    except FileNotFoundError:
        print(f"Error: El archivo '{pdf_path}' no fue encontrado.")
        return []
    except Exception as e:
        print(f"Ocurrió un error al procesar el PDF: {e}")
        return []

    return sorted(list(five_letter_words))

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Uso: python script.py ruta_al_pdf")
        sys.exit(1)

    pdf_file_path = sys.argv[1]

    if not os.path.isfile(pdf_file_path):
        print(f"Error: No se encontró el archivo '{pdf_file_path}'")
        sys.exit(1)

    print("Iniciando la extracción de palabras...")
    words = extract_five_letter_words_from_pdf(pdf_file_path)

    if words:
        print("\n--- Palabras de 5 letras encontradas (sin duplicados) ---")
        for word in words:
            print(word)
        print(f"\nTotal de palabras únicas de 5 letras encontradas: {len(words)}")

        # Guardar en JSON con el mismo nombre del PDF
        base_name = os.path.splitext(os.path.basename(pdf_file_path))[0]
        dir_name = os.path.dirname(pdf_file_path)
        output_json_path = os.path.join(dir_name, f"{base_name}.json")

        try:
            with open(output_json_path, 'w', encoding='utf-8') as f:
                json.dump(words, f, ensure_ascii=False, indent=4)
            print(f"\nLas palabras se han guardado en: {output_json_path}")
        except Exception as e:
            print(f"Error al guardar el archivo JSON: {e}")

    else:
        print("No se encontraron palabras de 5 letras o hubo un error.")
