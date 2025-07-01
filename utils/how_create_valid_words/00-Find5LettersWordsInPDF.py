import PyPDF2
import json
import re

# Lo ejecute dos veces, una con el PDF en español y otro con el PDF en inglés.
ruta_pdf = "./00-VocabularioBásicodelEspañol.pdf"

def extraer_palabras_de_pdf(ruta):
    palabras_5 = set()
    
    with open(ruta, 'rb') as f:
        lector = PyPDF2.PdfReader(f)
        
        for pagina in lector.pages:
            texto = pagina.extract_text()
            if texto:
                # Buscar palabras de 5 letras (solo letras, sin acentos ni números)
                palabras = re.findall(r'\b[a-zA-ZáéíóúñÁÉÍÓÚÑ]{5}\b', texto)
                palabras_5.update(palabra.lower() for palabra in palabras)
    
    return sorted(list(palabras_5))

# Guardar en JSON
def guardar_en_json(palabras, nombre_archivo="01-Spanish5LWords.json"):
    with open(nombre_archivo, "w", encoding="utf-8") as f:
        json.dump(palabras, f, ensure_ascii=False, indent=2)

# Ejecutar
palabras = extraer_palabras_de_pdf(ruta_pdf)
guardar_en_json(palabras)

print(f"Se guardaron {len(palabras)} palabras de 5 letras en 'palabras_5_letras.json'")
