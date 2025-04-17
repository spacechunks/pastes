export const LANGUAGE_MAP: Record<
  string,
  { name: string; id: string; slug: string }
> = {
  ts: { name: 'TypeScript', id: 'typescript', slug: 'ts' },
  js: { name: 'JavaScript', id: 'javascript', slug: 'js' },
  py: { name: 'Python', id: 'python', slug: 'py' },
  java: { name: 'Java', id: 'java', slug: 'java' },
  cpp: { name: 'C++', id: 'cpp', slug: 'cpp' },
  c: { name: 'C', id: 'c', slug: 'c' },
  cs: { name: 'C#', id: 'csharp', slug: 'cs' },
  go: { name: 'Go', id: 'go', slug: 'go' },
  rs: { name: 'Rust', id: 'rust', slug: 'rs' },
  rb: { name: 'Ruby', id: 'ruby', slug: 'rb' },
  php: { name: 'PHP', id: 'php', slug: 'php' },
  swift: { name: 'Swift', id: 'swift', slug: 'swift' },
  kt: { name: 'Kotlin', id: 'kotlin', slug: 'kt' },
  scala: { name: 'Scala', id: 'scala', slug: 'scala' },
  dart: { name: 'Dart', id: 'dart', slug: 'dart' },
  lua: { name: 'Lua', id: 'lua', slug: 'lua' },
  r: { name: 'R', id: 'r', slug: 'r' },
  sql: { name: 'SQL', id: 'sql', slug: 'sql' },
  html: { name: 'HTML', id: 'html', slug: 'html' },
  css: { name: 'CSS', id: 'css', slug: 'css' },
  sh: { name: 'Shell', id: 'shell', slug: 'sh' },
  ps1: { name: 'PowerShell', id: 'powershell', slug: 'ps1' },
  yaml: { name: 'YAML', id: 'yaml', slug: 'yaml' },
  json: { name: 'JSON', id: 'json', slug: 'json' },
  md: { name: 'Markdown', id: 'markdown', slug: 'md' },
  xml: { name: 'XML', id: 'xml', slug: 'xml' },
  dockerfile: { name: 'Dockerfile', id: 'dockerfile', slug: 'dockerfile' },
  txt: { name: 'Text', id: 'text', slug: 'txt' },
  plaintext: { name: 'Plaintext', id: 'plaintext', slug: 'plaintext' },
};

export interface LanguageInfo {
  name: string;
  id: string;
  confidence: number;
}
