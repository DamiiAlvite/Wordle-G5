import os
import json

# === CONFIGURACIÓN ===
DIC_PATH = 'diccionario_extraido/es_AR.dic'
JSON_INPUT = '07-validGuesses.json'
JSON_VALID = '10-5lettersV1.json'
JSON_INVALID = '10-invalidWordsByDic.json'

# === PASO 1: Cargar diccionario Hunspell ===
def cargar_diccionario(dic_path):
    with open(dic_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    dic_palabras = set()
    for line in lines[1:]:  # La primera línea indica cantidad de entradas
        palabra = line.strip().split('/')[0].lower()
        if len(palabra) == 5:
            dic_palabras.add(palabra)
    print(f"✅ Palabras cargadas del diccionario: {len(dic_palabras)}")
    return dic_palabras

# === PASO 2: Validar palabras contra el diccionario ===
def validar_con_diccionario(palabras, diccionario):
    validas = []
    invalidas = []

    total = len(palabras)
    for i, palabra in enumerate(palabras, 1):
        en_diccionario = palabra in diccionario

        # Feedback en consola
        print(f"[{i:04}/{total}] 📝 '{palabra}': "
              f"{'✅ Aceptada' if en_diccionario else '❌ Rechazada'}")

        if en_diccionario:
            validas.append(palabra)
        else:
            invalidas.append({
                "palabra": palabra,
                "fuentes_detectadas": {
                    "hunspell_dic": False
                }
            })

    return validas, invalidas

# === MAIN ===
if __name__ == '__main__':
    print("🔍 Iniciando validación contra diccionario local...\n")

    # Cargar diccionario
    diccionario = cargar_diccionario(DIC_PATH)

    # Cargar palabras desde JSON
    with open(JSON_INPUT, 'r', encoding='utf-8') as f:
        palabras = json.load(f)

    print(f"\n🔤 Palabras a validar: {len(palabras)}\n")

    # Validar palabras solo con diccionario
    validas, invalidas = validar_con_diccionario(palabras, diccionario)

    # Guardar resultados
    with open(JSON_VALID, 'w', encoding='utf-8') as f:
        json.dump(validas, f, indent=2, ensure_ascii=False)

    with open(JSON_INVALID, 'w', encoding='utf-8') as f:
        json.dump(invalidas, f, indent=2, ensure_ascii=False)

    print("\n🟢 Palabras válidas guardadas en:", JSON_VALID)
    print("🔴 Palabras inválidas guardadas en:", JSON_INVALID)
    print(f"\n✅ Finalizado: {len(validas)} válidas | {len(invalidas)} inválidas")
