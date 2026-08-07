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

const crcFormatter = new Intl.NumberFormat('es-CR', {
  style: 'currency',
  currency: 'CRC',
  maximumFractionDigits: 0,
});

/**
 * Formatea un monto (guardado en la base de datos como colones) como
 * colones costarricenses, ej. formatCRC(676000) -> "₡676 000".
 */
export function formatCRC(value: number | string | null | undefined): string {
  const num = typeof value === 'string' ? Number(value) : value;
  if (num === null || num === undefined || Number.isNaN(num)) return crcFormatter.format(0);
  return crcFormatter.format(num);
}
