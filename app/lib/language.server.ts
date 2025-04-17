import pkg from '@vscode/vscode-languagedetection';
import { LANGUAGE_MAP } from './language';
const { ModelOperations } = pkg;
import type { LanguageInfo } from './language';

export async function detectLanguage(
  code: string
): Promise<LanguageInfo | undefined> {
  if (typeof code !== 'string') {
    throw new Error('Code must be a string');
  }

  const modelOperations = new ModelOperations();
  const result = await modelOperations.runModel(code);

  const detectedLang = result[0];
  if (!detectedLang) return undefined;

  const mappedLang = LANGUAGE_MAP[detectedLang.languageId];
  if (!mappedLang) return undefined;

  return {
    ...mappedLang,
    confidence: detectedLang.confidence,
  };
}
