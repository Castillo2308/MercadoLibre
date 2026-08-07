'use client';

/**
 * PhoneCountryInput.tsx
 *
 * Campo de teléfono con selector de código de país (bandera + código, ej. 🇨🇷 +506).
 * Al hacer clic se despliega una lista buscable de todos los países; al elegir uno,
 * su código se antepone al número. El valor combinado (ej. "+506 8000 0000") se
 * entrega vía onChange como un solo string, compatible con el campo `phone` existente.
 */

import { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import { COUNTRIES, DEFAULT_COUNTRY, flagEmoji, type Country } from '@/lib/countries';

interface PhoneCountryInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

/** Quita tildes/diacríticos para que la búsqueda funcione sin importar acentos. */
const DIACRITICS_RE = /[̀-ͯ]/g;

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(DIACRITICS_RE, '');
}

function parseValue(value: string): { country: Country; local: string } {
  const trimmed = value.trim();
  if (trimmed.startsWith('+')) {
    const byLongestCode = [...COUNTRIES].sort((a, b) => b.dialCode.length - a.dialCode.length);
    for (const c of byLongestCode) {
      if (trimmed.slice(1).startsWith(c.dialCode)) {
        return { country: c, local: trimmed.slice(1 + c.dialCode.length).trim() };
      }
    }
  }
  return { country: DEFAULT_COUNTRY, local: trimmed };
}

export default function PhoneCountryInput({ value, onChange, placeholder }: PhoneCountryInputProps) {
  // Solo se parsea el valor inicial al montar; el componente se remonta
  // cada vez que el formulario de registro vuelve a aparecer.
  const initial = useMemo(() => parseValue(value), []); // eslint-disable-line react-hooks/exhaustive-deps
  const [country, setCountry] = useState<Country>(initial.country);
  const [localNumber, setLocalNumber] = useState(initial.local);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch('');
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    onChange(localNumber ? `+${country.dialCode} ${localNumber}` : '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [country, localNumber]);

  const filtered = useMemo(() => {
    const q = normalize(search.trim());
    if (!q) return COUNTRIES;
    return COUNTRIES.filter(
      (c) => normalize(c.name).includes(q) || c.dialCode.includes(q)
    );
  }, [search]);

  return (
    <div ref={containerRef} className="relative flex">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex shrink-0 items-center gap-1.5 rounded-l-xl border border-r-0 border-white/20 bg-white/5 px-3 py-3 text-white transition-all duration-300 hover:bg-white/10 focus:outline-none focus:border-primary"
      >
        <span className="text-lg leading-none">{flagEmoji(country.iso2)}</span>
        <span className="text-sm font-semibold">+{country.dialCode}</span>
        <ChevronDown size={14} className={`text-white/60 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      <input
        type="tel"
        value={localNumber}
        onChange={(e) => setLocalNumber(e.target.value.replace(/[^\d\s-]/g, ''))}
        placeholder={placeholder}
        className="w-full min-w-0 rounded-r-xl border border-white/20 bg-white/5 px-3 py-3 text-white placeholder:text-white/45 transition-all duration-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
      />

      {open && (
        <div className="absolute left-0 top-[calc(100%+6px)] z-50 max-h-72 w-72 overflow-hidden rounded-xl border border-white/15 bg-[#0c1d31] shadow-[0_20px_48px_rgba(0,0,0,0.5)] animate-fadeInDown">
          <div className="border-b border-white/10 p-2">
            <div className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2">
              <Search size={16} className="text-white/45 shrink-0" />
              <input
                autoFocus
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar país o código..."
                className="w-full bg-transparent text-sm text-white placeholder:text-white/40 outline-none"
              />
            </div>
          </div>
          <ul className="max-h-56 overflow-y-auto py-1">
            {filtered.length === 0 && (
              <li className="px-4 py-3 text-sm text-white/50">Sin resultados</li>
            )}
            {filtered.map((c) => (
              <li key={c.iso2}>
                <button
                  type="button"
                  onClick={() => {
                    setCountry(c);
                    setOpen(false);
                    setSearch('');
                  }}
                  className={`flex w-full items-center gap-3 px-4 py-2 text-left text-sm transition-colors hover:bg-white/10 ${
                    c.iso2 === country.iso2 ? 'bg-primary/15 text-primary' : 'text-white/85'
                  }`}
                >
                  <span className="text-lg leading-none">{flagEmoji(c.iso2)}</span>
                  <span className="flex-1 truncate">{c.name}</span>
                  <span className="text-white/50">+{c.dialCode}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
