import os
import json
import zipfile
import requests
from bs4 import BeautifulSoup

# === CONFIGURACIÓN ===
JSON_INPUT = '06-onlySpanishMoreRefined.json'
JSON_VALID = '07-validGuesses.json'
JSON_INVALID = '07-invalidWordsBySources.json'

# === PASO 1: Encontrar archivo .oxt y descomprimir ===
def extraer_diccionario_desde_oxt():
    archivos_oxt = [f for f in os.listdir() if f.endswith('.oxt')]
    if not archivos_oxt:
        raise FileNotFoundError("No se encontró ningún archivo .oxt en la carpeta.")
    oxt = archivos_oxt[0]
    print(f"📦 Encontrado archivo OXT: {oxt}")

    with zipfile.ZipFile(oxt, 'r') as zip_ref:
        zip_ref.extractall('diccionario_extraido')

    dic_path = None
    for root, _, files in os.walk('diccionario_extraido'):
        for f in files:
            if f.endswith('.dic'):
                dic_path = os.path.join(root, f)
                break
    if not dic_path:
        raise FileNotFoundError("No se encontró archivo .dic dentro del .oxt")

    print(f"📘 Archivo .dic extraído: {dic_path}")
    return dic_path

# === PASO 2: Cargar diccionario hunspell (.dic) ===
def cargar_diccionario(dic_path):
    with open(dic_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    dic_palabras = set()
    for line in lines[1:]:
        palabra = line.strip().split('/')[0].lower()
        if len(palabra) == 5:
            dic_palabras.add(palabra)
    print(f"✅ Palabras cargadas del diccionario: {len(dic_palabras)}")
    return dic_palabras

# === PASO 3: Validar con Wikcionario ===
def existe_en_wikcionario(palabra):
    url = f"https://es.wiktionary.org/wiki/{palabra}"
    try:
        res = requests.get(url, timeout=5)
        if res.status_code == 200:
            soup = BeautifulSoup(res.text, 'html.parser')
            title = soup.find('h1', {'id': 'firstHeading'})
            return title and palabra in title.text.lower()
        return False
    except Exception as e:
        print(f"⚠️ Error al consultar Wikcionario para '{palabra}': {e}")
        return False

# === PASO 4: Cargar JSON y validar palabras con feedback ===
def validar_palabras(palabras, diccionario):
    validas = []
    invalidas = []

    total = len(palabras)
    for i, palabra in enumerate(palabras, 1):
        en_diccionario = palabra in diccionario
        en_wikcionario = existe_en_wikcionario(palabra)

        # Feedback por consola
        print(f"[{i:04}/{total}] 📝 '{palabra}': "
              f"{'📘 en .dic' if en_diccionario else '❌ no .dic'} | "
              f"{'📖 en Wikcionario' if en_wikcionario else '❌ no Wiki'}", end=" ")

        if en_diccionario or en_wikcionario:
            print("✅ Aceptada")
            validas.append(palabra)
        else:
            print("❌ Rechazada")
            invalidas.append({
                "palabra": palabra,
                "fuentes_detectadas": {
                    "wikcionario": en_wikcionario,
                    "hunspell_dic": en_diccionario,
                    "wikidata_probable": False  # Futuro uso
                }
            })

    return validas, invalidas

# === MAIN ===
if __name__ == '__main__':
    print("🔍 Iniciando validación avanzada de palabras Wordle...\n")

    # Extraer y cargar diccionario
    dic_path = extraer_diccionario_desde_oxt()
    diccionario = cargar_diccionario(dic_path)

    # Cargar palabras desde JSON
    with open(JSON_INPUT, 'r', encoding='utf-8') as f:
        palabras = json.load(f)

    print(f"\n🔤 Palabras a validar: {len(palabras)}\n")

    # Validar palabras con feedback en tiempo real
    validas, invalidas = validar_palabras(palabras, diccionario)

    # Guardar resultados
    with open(JSON_VALID, 'w', encoding='utf-8') as f:
        json.dump(validas, f, indent=2, ensure_ascii=False)

    with open(JSON_INVALID, 'w', encoding='utf-8') as f:
        json.dump(invalidas, f, indent=2, ensure_ascii=False)

    print("\n🟢 Palabras válidas guardadas en:", JSON_VALID)
    print("🔴 Palabras inválidas guardadas en:", JSON_INVALID)
    print(f"\n✅ Finalizado: {len(validas)} válidas | {len(invalidas)} inválidas")
