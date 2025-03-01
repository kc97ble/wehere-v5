export function postProcessEnv<T extends Record<string, string | undefined>>(
  env: T
): T {
  Object.entries(env).forEach(([key, value]) => {
    if (value == null) return;
    if (!/^[A-Za-z0-9\-_.!~*'()%:]*$/.test(value)) {
      console.warn("Env should be percent-encoded:", key);
    }
    (env as any)[key] = decodeURIComponent(value);
  });
  return env;
}
