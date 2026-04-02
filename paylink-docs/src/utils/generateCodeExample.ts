import type { Endpoint } from '../types';

type CodeLang = 'curl' | 'js' | 'python';

function buildPath(path: string, values: Record<string, string>): string {
  return path.replace(/:([a-zA-Z]+)/g, (_, key: string) => values[key] ?? `:${key}`);
}

function buildBody(bodyParams: Endpoint['bodyParams'], values: Record<string, string>): Record<string, unknown> | null {
  if (!bodyParams?.length) return null;
  const body: Record<string, unknown> = {};
  for (const p of bodyParams) {
    const val = values[`body_${p.name}`];
    if (val !== undefined && val !== '') {
      body[p.name] = p.type === 'number' ? Number(val) : val;
    } else if (p.example !== undefined) {
      body[p.name] = p.example;
    }
  }
  return Object.keys(body).length ? body : null;
}

export function generateCodeExample(
  endpoint: Endpoint,
  baseUrl: string,
  token: string,
  values: Record<string, string>,
  lang: CodeLang,
): string {
  const resolvedPath = buildPath(endpoint.path, values);
  const url = `${baseUrl}${resolvedPath}`;
  const body = buildBody(endpoint.bodyParams, values);
  const bodyStr = body ? JSON.stringify(body, null, 2) : null;

  const authHeader = endpoint.auth && token ? `Bearer ${token}` : null;

  if (lang === 'curl') {
    const lines: string[] = [`curl -X ${endpoint.method} '${url}'`];
    lines.push(`  -H 'Content-Type: application/json'`);
    if (authHeader) lines.push(`  -H 'Authorization: ${authHeader}'`);
    if (bodyStr) lines.push(`  -d '${bodyStr.replace(/\n/g, '\n  ')}'`);
    return lines.join(' \\\n');
  }

  if (lang === 'js') {
    const lines: string[] = [];
    lines.push(`const response = await fetch('${url}', {`);
    lines.push(`  method: '${endpoint.method}',`);
    lines.push(`  headers: {`);
    lines.push(`    'Content-Type': 'application/json',`);
    if (authHeader) lines.push(`    'Authorization': '${authHeader}',`);
    lines.push(`  },`);
    if (bodyStr) {
      lines.push(`  body: JSON.stringify(${bodyStr.replace(/\n/g, '\n  ')}),`);
    }
    lines.push(`});`);
    lines.push(``);
    lines.push(`const data = await response.json();`);
    lines.push(`console.log(data);`);
    return lines.join('\n');
  }

  // python
  const lines: string[] = [];
  lines.push(`import requests`);
  lines.push(``);
  lines.push(`url = "${url}"`);
  lines.push(`headers = {`);
  lines.push(`    "Content-Type": "application/json",`);
  if (authHeader) lines.push(`    "Authorization": "${authHeader}",`);
  lines.push(`}`);
  if (bodyStr) {
    lines.push(`payload = ${bodyStr.replace(/\n/g, '\n').replace(/true/g, 'True').replace(/false/g, 'False').replace(/null/g, 'None')}`);
    lines.push(``);
    lines.push(`response = requests.${endpoint.method.toLowerCase()}(url, json=payload, headers=headers)`);
  } else {
    lines.push(``);
    lines.push(`response = requests.${endpoint.method.toLowerCase()}(url, headers=headers)`);
  }
  lines.push(`print(response.json())`);
  return lines.join('\n');
}
