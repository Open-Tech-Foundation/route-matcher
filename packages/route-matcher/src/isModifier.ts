export default function isModifier(c: string) {
  return ['*', '+', '?'].includes(c);
}
