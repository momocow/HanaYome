/**
 * @see https://stackoverflow.com/a/36481059/8579025
 */

/**
 * Standard Normal variate
 */
// Standard Normal variate using Box-Muller transform.
export function normalVariate(): number {
  var u = 0, v = 0;
  while (u === 0) u = Math.random(); //Converting [0,1) to (0,1)
  while (v === 0) v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

export function normal(sigma: number, mu: number): number {
  return sigma + mu * normalVariate()
}
