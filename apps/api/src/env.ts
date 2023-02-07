function env<T>(varName: string, fallback: T) {
  return process.env[varName] || fallback;
}

export default env;
