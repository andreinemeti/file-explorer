export function toKB(bytes?: number): string {
  if (bytes == null) return '';
  if (bytes < 1024) return `${bytes} bytes`;
  const kb = Math.round(bytes / 1024);
  return `${kb} KB`;
}