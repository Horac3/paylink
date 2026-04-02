export function formatJson(value: unknown): string {
  return JSON.stringify(value, null, 2);
}

export function tryParseJson(str: string): unknown {
  try {
    return JSON.parse(str);
  } catch {
    return str;
  }
}
