import type { Route } from './+types/_index';
import { FileActions, useFileSave } from '@/components/file-actions';
import { CodeEditor } from '@/components/code-editor';
import { useState } from 'react';
import { useLanguageDetection } from '@/hooks/use-language-detection';
import { SettingsBar } from '@/components/settings-bar';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'paste.chunks.space' },
    {
      name: 'description',
      content:
        'Create and share code snippets instantly. A fast, simple, and elegant paste service with syntax highlighting and language detection.',
    },
  ];
}

export default function Home() {
  const { handleSave } = useFileSave();
  const [code, setCode] = useState(``);
  const [manualLanguage, setManualLanguage] = useState<string | undefined>();
  const detectedLanguage = useLanguageDetection(code);

  const onSave = async () => {
    await handleSave(code, manualLanguage || detectedLanguage?.id);
  };

  const handleCodeChange = (value: string | undefined) => {
    setCode(value || '');
  };

  return (
    <div className="bg-sidebar-accent h-screen min-h-screen p-4">
      <div className="bg-card outline-border relative flex h-full w-full flex-col overflow-hidden rounded-lg outline-1">
        <div className="absolute top-0 right-0 z-50">
          <FileActions isNewItem={true} onSave={onSave} />
        </div>

        <div className="flex-1 overflow-hidden rounded-lg [&_.monaco-editor]:!border-none [&_.monaco-editor]:!outline-none [&_.monaco-editor_.focused]:!outline-none [&_.monaco-editor-background]:!outline-none">
          <CodeEditor
            initialValue={code}
            language={manualLanguage || detectedLanguage?.id}
            onChange={handleCodeChange}
            onMount={(editor) => {
              editor.focus();
            }}
          />
        </div>

        <SettingsBar
          language={manualLanguage || detectedLanguage?.id}
          onLanguageChange={setManualLanguage}
          date={new Date()}
        />
      </div>
    </div>
  );
}
