/**
 * A circle whose edge breathes: a few low-frequency waves keep it reading as
 * round, while a fine ripple gives the hand-cut, wavy outline.
 */
export function blobPath(cx: number, cy: number, r: number, phase: number, points = 40) {
 const p = Array.from({ length: points }, (_, i) => {
  const a = (i / points) * Math.PI * 2;
  const k = 1 + .032 * Math.sin(3 * a + phase) + .022 * Math.sin(5 * a - phase * 1.35) + .014 * Math.sin(2 * a + phase * .7) + .011 * Math.sin(11 * a + phase * 2.1);
  return [cx + Math.cos(a) * r * k, cy + Math.sin(a) * r * k];
 });
 // Closed Catmull-Rom spline through the samples, written as cubic Béziers.
 let d = `M${p[0][0].toFixed(1)} ${p[0][1].toFixed(1)}`;
 for (let i = 0; i < points; i++) {
  const [p0, p1, p2, p3] = [p[(i - 1 + points) % points], p[i], p[(i + 1) % points], p[(i + 2) % points]];
  d += `C${(p1[0] + (p2[0] - p0[0]) / 6).toFixed(1)} ${(p1[1] + (p2[1] - p0[1]) / 6).toFixed(1)} ${(p2[0] - (p3[0] - p1[0]) / 6).toFixed(1)} ${(p2[1] - (p3[1] - p1[1]) / 6).toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
 }
 return d + "Z";
}
