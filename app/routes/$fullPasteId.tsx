import { CodeEditor } from '@/components/code-editor';
import { FileActions, useFileSave } from '@/components/file-actions';
import { useLanguageDetection } from '@/hooks/use-language-detection';
import { redirect, useNavigate } from 'react-router';
import { useState } from 'react';
import type { Route } from './+types/$fullPasteId';
import { getPaste } from '@/lib/pastes.server';
import { LANGUAGE_MAP } from '@/lib/language';
import { SettingsBar } from '@/components/settings-bar';

export function meta({ params }: Route.MetaArgs) {
  return [
    { title: 'paste.chunks.space' },
    {
      name: 'description',
      content:
        'View, edit and share code snippets with syntax highlighting. Features include language detection, multiple themes, and easy sharing options.',
    },
  ];
}

export async function loader({ params }: Route.LoaderArgs) {
  if (!params.fullPasteId) {
    throw redirect('/');
  }

  const pasteId = params.fullPasteId.split('.')[0];
  const extension = params.fullPasteId.split('.')[1];

  if (!pasteId) {
    throw redirect('/');
  }

  const paste = await getPaste(pasteId);

  return { paste, extension };
}

export default function RouteComponent({ loaderData }: Route.ComponentProps) {
  const { paste, extension } = loaderData;
  const { handleSave } = useFileSave();
  const navigate = useNavigate();

  const [code, setCode] = useState(paste.data);
  const [isEditing, setIsEditing] = useState(false);
  const [manualLanguage, setManualLanguage] = useState<string | undefined>();

  const detectedLanguage = useLanguageDetection(paste.data, isEditing);

  // Get the correct language ID for Monaco editor
  const editorLanguageId = isEditing
    ? manualLanguage || detectedLanguage?.id
    : LANGUAGE_MAP[extension]?.id || extension;

  const onSave = async () => {
    const success = await handleSave(
      code,
      manualLanguage || detectedLanguage?.id
    );
    if (success) {
      setIsEditing(false);
    }
  };

  const handleCodeChange = (value: string | undefined) => {
    setCode(value || '');
  };

  const handleLanguageChange = (newLanguage: string | undefined) => {
    if (!isEditing) {
      // Find the extension for the new language
      let newExtension = 'txt';
      if (newLanguage) {
        for (const [ext, lang] of Object.entries(LANGUAGE_MAP)) {
          if (lang.id === newLanguage) {
            newExtension = lang.slug;
            break;
          }
        }
      } else {
        // If auto-detect, use the detected language's extension
        if (detectedLanguage) {
          for (const [ext, lang] of Object.entries(LANGUAGE_MAP)) {
            if (lang.id === detectedLanguage.id) {
              newExtension = lang.slug;
              break;
            }
          }
        }
      }
      // Navigate to the new URL with the updated extension
      navigate(`/${paste.id}.${newExtension}`);
    } else {
      setManualLanguage(newLanguage);
    }
  };

  return (
    <div className="bg-sidebar-accent h-screen min-h-screen p-4">
      <div className="bg-card outline-border relative flex h-full w-full flex-col overflow-hidden rounded-lg outline-1">
        <div className="absolute top-0 right-0 z-50">
          <FileActions
            isNewItem={isEditing}
            onSave={onSave}
            onEdit={() => setIsEditing(true)}
            paste={paste}
          />
        </div>

        <div className="flex-1 overflow-hidden rounded-lg [&_.monaco-editor]:!border-none [&_.monaco-editor]:!outline-none [&_.monaco-editor_.focused]:!outline-none [&_.monaco-editor-background]:!outline-none">
          <CodeEditor
            language={editorLanguageId}
            value={code}
            onChange={handleCodeChange}
            readOnly={!isEditing}
          />
        </div>

        <SettingsBar
          language={editorLanguageId}
          onLanguageChange={handleLanguageChange}
          date={new Date(paste.createdAt)}
        />
      </div>
    </div>
  );
}
