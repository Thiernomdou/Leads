export type FormVariant = 'A' | 'B' | 'C';

const STORAGE_KEY = 'tca_form_variant';

export function getVariant(): FormVariant {
  if (typeof window === 'undefined') return 'A';

  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'A' || stored === 'B' || stored === 'C') {
    return stored;
  }

  const rand = Math.random();
  const variant: FormVariant = rand < 0.33 ? 'A' : rand < 0.66 ? 'B' : 'C';
  localStorage.setItem(STORAGE_KEY, variant);
  return variant;
}
