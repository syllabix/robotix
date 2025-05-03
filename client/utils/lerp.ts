/**
 * Linear interpolation between two values
 * @param start Starting value
 * @param end Target value
 * @param t Interpolation factor (0-1)
 * @returns Interpolated value
 */
export const lerp = (start: number, end: number, t: number): number => {
    return start * (1 - t) + end * t;
}; 