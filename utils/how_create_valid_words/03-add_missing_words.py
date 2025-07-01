#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script para agregar palabras de 5letters.json a validGuesses.json
que no estén ya presentes en validGuesses.json
"""

import json
import os

def load_json_file(file_path):
    """Cargar un archivo JSON y retornar su contenido"""
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            return json.load(file)
    except FileNotFoundError:
        print(f"Error: No se encontró el archivo {file_path}")
        return None
    except json.JSONDecodeError:
        print(f"Error: El archivo {file_path} no tiene un formato JSON válido")
        return None

def save_json_file(file_path, data):
    """Guardar datos en un archivo JSON"""
    try:
        with open(file_path, 'w', encoding='utf-8') as file:
            json.dump(data, file, ensure_ascii=False, indent=2)
        return True
    except Exception as e:
        print(f"Error al guardar el archivo {file_path}: {e}")
        return False

def main():
    # Rutas de los archivos
    script_dir = os.path.dirname(os.path.abspath(__file__))
    five_letters_path = os.path.join(script_dir, '03- 5letters.json')
    valid_guesses_path = os.path.join(script_dir, '03- validGuesses.json')
    output_path = os.path.join(script_dir, 'validGuesses.json')
    
    print("Cargando archivos...")
    
    # Cargar archivo 5letters.json
    five_letters_words = load_json_file(five_letters_path)
    if five_letters_words is None:
        return
    
    # Cargar archivo validGuesses.json
    valid_guesses_words = load_json_file(valid_guesses_path)
    if valid_guesses_words is None:
        return
    
    print(f"Palabras en 5letters.json: {len(five_letters_words)}")
    print(f"Palabras en validGuesses.json: {len(valid_guesses_words)}")
    
    # Convertir a sets para operaciones más eficientes
    five_letters_set = set(five_letters_words)
    valid_guesses_set = set(valid_guesses_words)
    
    # Encontrar palabras que están en 5letters pero no en validGuesses
    missing_words = five_letters_set - valid_guesses_set
    
    print(f"Palabras faltantes encontradas: {len(missing_words)}")
    
    if missing_words:
        print("\nPalabras que se agregarán:")
        sorted_missing = sorted(missing_words)
        for i, word in enumerate(sorted_missing, 1):
            print(f"{i:3d}. {word}")
        
        # Agregar las palabras faltantes a validGuesses
        updated_valid_guesses = valid_guesses_words + sorted_missing
        
        # Guardar el archivo actualizado como validGuesses.json
        if save_json_file(output_path, updated_valid_guesses):
            print(f"\nArchivo creado exitosamente: {output_path}")
            print(f"Total de palabras en el nuevo archivo: {len(updated_valid_guesses)}")
        else:
            print(f"\nError al crear el archivo {output_path}")
    else:
        print("\nNo se encontraron palabras faltantes.")
        # Aún así, crear el archivo validGuesses.json con las palabras existentes
        if save_json_file(output_path, sorted(valid_guesses_words)):
            print(f"Archivo creado: {output_path}")
            print(f"Total de palabras: {len(valid_guesses_words)}")
        else:
            print(f"Error al crear el archivo {output_path}")
    
    # Verificar si hay palabras en validGuesses que no están en 5letters
    extra_words = valid_guesses_set - five_letters_set
    if extra_words:
        print(f"\nNota: Hay {len(extra_words)} palabras en validGuesses.json que no están en 5letters.json")
        if len(extra_words) <= 20:  # Mostrar solo si no son demasiadas
            print("Palabras adicionales:", sorted(extra_words))

if __name__ == "__main__":
    main()