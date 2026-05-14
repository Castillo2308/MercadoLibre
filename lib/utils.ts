/**
 * utils.ts
 * 
 * Utilidades generales para el proyecto.
 * Contiene funciones helper comúnmente usadas como cn() para combinar clases Tailwind.
 */

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// Combina clases de Tailwind CSS evitando conflictos
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
