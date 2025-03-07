export function compose<T2, T1, T0>(
  f1: (input: T1) => T2,
  f0: (input: T0) => T1
): (input: T0) => T2;

export function compose<T3, T2, T1, T0>(
  f2: (input: T2) => T3,
  f1: (input: T1) => T2,
  f0: (input: T0) => T1
): (input: T0) => T3;

export function compose<T4, T3, T2, T1, T0>(
  f3: (input: T3) => T4,
  f2: (input: T2) => T3,
  f1: (input: T1) => T2,
  f0: (input: T0) => T1
): (input: T0) => T4;

export function compose(...fn: Array<(input: unknown) => unknown>): (input: unknown) => unknown {
  const reversed = [...fn].reverse();
  return function (input: unknown): unknown {
    let output = input;
    for (const f of reversed) {
      output = f(output);
    }
    return output;
  };
}
