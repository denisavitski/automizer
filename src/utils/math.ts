export function clamp(number: number, min: number = 0, max: number = 0) {
  return Math.max(min, Math.min(number, max))
}
