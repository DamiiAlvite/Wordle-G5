import json
import requests
from bs4 import BeautifulSoup
import time

INPUT_FILE = '11-5lettersV2.json'
OUTPUT_FILE_VALID = '12-5lettersV3.json'
OUTPUT_FILE_REMOVED = '12-Eliminated.json'

HEADERS = {
    "User-Agent": "Mozilla/5.0 (compatible; WordleBot/1.0)"
}

def verificar_tipo_wikcionario(palabra):
    url = f"https://es.wiktionary.org/wiki/{palabra}"
    try:
        res = requests.get(url, headers=HEADERS, timeout=10)
        if res.status_code != 200:
            return None  # No se encontró

        soup = BeautifulSoup(res.text, 'html.parser')
        texto = soup.get_text().lower()

        if "forma verbal" in texto or "forma del verbo" in texto or "forma conjugada" in texto:
            return "verbo"
        if "plural de" in texto:
            return "plural"

    except Exception as e:
        print(f"⚠️ Error al verificar {palabra}: {e}")
        return None

    return None

def cargar_palabras(path):
    with open(path, 'r', encoding='utf-8') as f:
        return json.load(f)

def guardar_json(path, data):
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

def filtrar_palabras(palabras):
    validas = []
    eliminadas = []

    for i, palabra in enumerate(palabras, 1):
        tipo = verificar_tipo_wikcionario(palabra)

        if tipo:
            eliminadas.append({
                "palabra": palabra,
                "motivo": f"Es una forma de {tipo}"
            })
            print(f"[{i}/{len(palabras)}] Verificando: \"{palabra}\"... ❌ Es una forma de {tipo}")
        else:
            validas.append(palabra)
            print(f"[{i}/{len(palabras)}] Verificando: \"{palabra}\"... ✅ Aceptada")

        time.sleep(1.2)  # Evitar bloqueo por parte del servidor

    return validas, eliminadas

if __name__ == "__main__":
    print("🔄 Cargando palabras...")
    palabras = cargar_palabras(INPUT_FILE)

    print("🔍 Filtrando con Wikcionario...")
    validas, eliminadas = filtrar_palabras(palabras)

    print(f"\n✅ Palabras válidas: {len(validas)}")
    print(f"🗑️ Palabras eliminadas: {len(eliminadas)}")

    guardar_json(OUTPUT_FILE_VALID, validas)
    guardar_json(OUTPUT_FILE_REMOVED, eliminadas)

    print("\n💾 Archivos guardados.")
