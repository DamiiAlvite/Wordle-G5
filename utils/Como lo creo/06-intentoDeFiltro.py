import json
import requests
import time
import re
from urllib.parse import quote

def cargar_palabras():
    """Carga las palabras del archivo JSON"""
    try:
        with open('05-onlySpanishRefined.json', 'r', encoding='utf-8') as file:
            return json.load(file)
    except FileNotFoundError:
        print("Error: No se encontró el archivo 05-onlySpanishRefined.json")
        return []
    except json.JSONDecodeError:
        print("Error: El archivo JSON no es válido")
        return []

def consultar_wiktionary(palabra):
    """
    Consulta Wiktionary en español - fuente confiable y gratuita
    """
    url = f"https://es.wiktionary.org/wiki/{quote(palabra)}"
    
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
        
        response = requests.get(url, headers=headers, timeout=10)
        
        if response.status_code == 200:
            # Buscar indicadores de que es una palabra válida en español
            content = response.text.lower()
            
            # Verificar que tenga sección de español
            if 'español</span>' in content or 'castellano</span>' in content:
                # Verificar que no sea solo una redirección o página de desambiguación
                if 'sustantivo' in content or 'adjetivo' in content or 'verbo' in content or 'adverbio' in content:
                    return True
            
            return False
            
        elif response.status_code == 404:
            return False
        else:
            return None
            
    except Exception as e:
        print(f"Error Wiktionary: {e}")
        return None

def consultar_dicionarios_com(palabra):
    """
    Consulta dicionarios.com - diccionario en línea
    """
    url = f"https://www.dicionarios.com/spanish/{quote(palabra)}"
    
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
        
        response = requests.get(url, headers=headers, timeout=10)
        
        if response.status_code == 200:
            content = response.text
            # Buscar indicadores de definición válida
            if 'definition' in content.lower() or 'significado' in content.lower():
                if 'not found' not in content.lower() and 'no encontrada' not in content.lower():
                    return True
            return False
        elif response.status_code == 404:
            return False
        else:
            return None
            
    except Exception as e:
        print(f"Error dicionarios.com: {e}")
        return None

def consultar_wordreference(palabra):
    """
    Consulta WordReference - diccionario español
    """
    url = f"https://www.wordreference.com/definicion/{quote(palabra)}"
    
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
        
        response = requests.get(url, headers=headers, timeout=10)
        
        if response.status_code == 200:
            content = response.text
            # Buscar indicadores de definición válida
            if 'WRD' in content and 'spanish definition' in content.lower():
                if 'no se ha encontrado' not in content.lower():
                    return True
            return False
        elif response.status_code == 404:
            return False
        else:
            return None
            
    except Exception as e:
        print(f"Error WordReference: {e}")
        return None

def usar_diccionario_local():
    """
    Opción para usar un diccionario local descargado
    """
    print("\n¿Desea descargar un diccionario local? (recomendado)")
    print("Esto descargará una lista de palabras válidas en español")
    
    respuesta = input("Descargar diccionario local? (s/n): ").lower().strip()
    
    if respuesta in ['s', 'si', 'sí', 'y', 'yes']:
        return descargar_diccionario_local()
    return None

def descargar_diccionario_local():
    """
    Descarga un diccionario de palabras en español
    """
    print("Descargando diccionario español...")
    
    # URL de un diccionario público de palabras en español
    url = "https://raw.githubusercontent.com/JorgeDuenasLerin/diccionario-espanol-txt/master/0_palabras_todas.txt"
    
    try:
        response = requests.get(url, timeout=30)
        if response.status_code == 200:
            palabras = set()
            for linea in response.text.split('\n'):
                palabra = linea.strip().lower()
                if len(palabra) == 5:  # Solo palabras de 5 letras
                    palabras.add(palabra)
            
            print(f"Diccionario descargado: {len(palabras)} palabras de 5 letras")
            return palabras
        else:
            print("Error descargando diccionario")
            return None
    except Exception as e:
        print(f"Error: {e}")
        return None

def consultar_palabra(palabra, metodo, diccionario_local=None):
    """
    Consulta una palabra usando el método seleccionado
    """
    print(f"Consultando: {palabra:<15}", end=" ")
    
    if metodo == 'local' and diccionario_local:
        return palabra.lower() in diccionario_local
    elif metodo == 'wiktionary':
        return consultar_wiktionary(palabra)
    elif metodo == 'wordreference':
        return consultar_wordreference(palabra)
    elif metodo == 'dicionarios':
        return consultar_dicionarios_com(palabra)
    elif metodo == 'multiple':
        # Probar múltiples fuentes
        resultado_wikt = consultar_wiktionary(palabra)
        if resultado_wikt is not None:
            return resultado_wikt
        
        print("(Wikt falló, probando WordRef) ", end="")
        resultado_wr = consultar_wordreference(palabra)
        if resultado_wr is not None:
            return resultado_wr
        
        print("(WR falló, probando Dicionarios) ", end="")
        return consultar_dicionarios_com(palabra)
    
    return None

def procesar_palabras():
    """Función principal que procesa todas las palabras"""
    print("Cargando palabras...")
    palabras = cargar_palabras()
    
    if not palabras:
        print("No se pudieron cargar las palabras. Terminando...")
        return
    
    # Seleccionar método
    print("\nMétodos disponibles:")
    print("1. Diccionario local (más rápido y confiable)")
    print("2. Wiktionary (confiable, requiere internet)")
    print("3. WordReference (bueno para español)")
    print("4. Dicionarios.com (alternativa)")
    print("5. Múltiples fuentes (más lento pero más preciso)")
    
    while True:
        try:
            opcion = input("Seleccione método (1-5): ").strip()
            if opcion == '1':
                metodo = 'local'
                diccionario_local = descargar_diccionario_local()
                if not diccionario_local:
                    print("No se pudo descargar el diccionario. Seleccione otro método.")
                    continue
                break
            elif opcion == '2':
                metodo = 'wiktionary'
                diccionario_local = None
                break
            elif opcion == '3':
                metodo = 'wordreference'
                diccionario_local = None
                break
            elif opcion == '4':
                metodo = 'dicionarios'
                diccionario_local = None
                break
            elif opcion == '5':
                metodo = 'multiple'
                diccionario_local = None
                break
            else:
                print("Por favor ingrese un número del 1 al 5")
        except KeyboardInterrupt:
            print("\nProceso cancelado.")
            return
    
    palabras_validas = []
    palabras_invalidas = []
    palabras_error = []
    
    total = len(palabras)
    print(f"\nProcesando {total} palabras usando {metodo.upper()}...")
    print("=" * 70)
    
    for i, palabra in enumerate(palabras, 1):
        print(f"[{i:4d}/{total}] ", end="")
        
        resultado = consultar_palabra(palabra, metodo, diccionario_local)
        
        if resultado is True:
            palabras_validas.append(palabra)
            print("✓ VÁLIDA")
        elif resultado is False:
            palabras_invalidas.append(palabra)
            print("✗ INVÁLIDA")
        else:  # resultado is None (error)
            palabras_error.append(palabra)
            print("? ERROR")
        
        # Pausa solo para métodos online
        if metodo != 'local':
            time.sleep(0.5)
        
        # Guardar progreso cada 25 palabras
        if i % 25 == 0:
            guardar_resultados_temporales(palabras_validas, palabras_invalidas, palabras_error, i)
    
    # Guardar resultados finales
    guardar_resultados_finales(palabras_validas, palabras_invalidas, palabras_error)
    
    # Mostrar estadísticas
    mostrar_estadisticas(palabras_validas, palabras_invalidas, palabras_error, total)

def guardar_resultados_temporales(validas, invalidas, errores, progreso):
    """Guarda el progreso temporalmente"""
    try:
        with open(f'progreso-{progreso}.json', 'w', encoding='utf-8') as f:
            json.dump({
                'validas': validas,
                'invalidas': invalidas,
                'errores': errores,
                'progreso': progreso
            }, f, ensure_ascii=False, indent=2)
        print(f"    → Progreso guardado en progreso-{progreso}.json")
    except Exception as e:
        print(f"    → Error guardando progreso: {e}")

def guardar_resultados_finales(validas, invalidas, errores):
    """Guarda los resultados finales en archivos separados"""
    try:
        # Palabras válidas
        with open('palabras-validas.json', 'w', encoding='utf-8') as f:
            json.dump(validas, f, ensure_ascii=False, indent=2)
        
        # Palabras inválidas
        with open('palabras-invalidas.json', 'w', encoding='utf-8') as f:
            json.dump(invalidas, f, ensure_ascii=False, indent=2)
        
        # Palabras con error (para revisión manual)
        if errores:
            with open('palabras-error.json', 'w', encoding='utf-8') as f:
                json.dump(errores, f, ensure_ascii=False, indent=2)
        
        print("\n" + "=" * 50)
        print("✓ Resultados guardados exitosamente:")
        print(f"  - palabras-validas.json ({len(validas)} palabras)")
        print(f"  - palabras-invalidas.json ({len(invalidas)} palabras)")
        if errores:
            print(f"  - palabras-error.json ({len(errores)} palabras)")
        
    except Exception as e:
        print(f"\n✗ Error guardando resultados: {e}")

def mostrar_estadisticas(validas, invalidas, errores, total):
    """Muestra las estadísticas finales"""
    print("\n" + "=" * 50)
    print("ESTADÍSTICAS FINALES")
    print("=" * 50)
    print(f"Total de palabras procesadas: {total}")
    print(f"Palabras válidas:             {len(validas):4d} ({len(validas)/total*100:.1f}%)")
    print(f"Palabras inválidas:           {len(invalidas):4d} ({len(invalidas)/total*100:.1f}%)")
    if errores:
        print(f"Errores de conexión:          {len(errores):4d} ({len(errores)/total*100:.1f}%)")
    print("=" * 50)
    
    # Mostrar algunas palabras de ejemplo
    if validas:
        print(f"\nEjemplos de palabras válidas: {', '.join(validas[:10])}")
    if invalidas:
        print(f"Ejemplos de palabras inválidas: {', '.join(invalidas[:10])}")

def main():
    """Función principal"""
    print("VALIDADOR DE PALABRAS ESPAÑOLAS")
    print("=" * 50)
    print("Este script validará palabras usando fuentes confiables:")
    print("- Diccionario local (recomendado)")
    print("- Wiktionary")
    print("- WordReference")
    print("- Múltiples fuentes")
    print()
    
    respuesta = input("¿Desea continuar? (s/n): ").lower().strip()
    
    if respuesta in ['s', 'si', 'sí', 'y', 'yes']:
        procesar_palabras()
    else:
        print("Proceso cancelado.")

if __name__ == "__main__":
    main()