import { customAlphabet } from 'nanoid';
import { lowercase } from 'nanoid-dictionary';

export default function generateSlug(text: string, limit: number): string {
  const baseSlug = text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');

  const generateId = customAlphabet(lowercase, limit);
  const uniqueId = generateId();

  return `${baseSlug}-${uniqueId}`;
}
