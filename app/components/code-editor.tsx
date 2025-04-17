import { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import type { EditorProps, OnMount } from '@monaco-editor/react';
import { useTheme } from 'next-themes';
import {
  darkPurpleTheme,
  PURPLE_THEME_NAME,
  purpleTheme,
} from './editor-theme';
import { DARK_PURPLE_THEME_NAME } from './editor-theme';
import { ClientOnly } from 'remix-utils/client-only';

interface CodeEditorProps extends Partial<EditorProps> {
  initialValue?: string;
  onChange?: (value: string | undefined) => void;
  language?: string;
  height?: string | number;
  readOnly?: boolean;
}

const defaultEditorOptions: EditorProps['options'] = {
  folding: true,
  lineNumbers: 'on',
  lineDecorationsWidth: 0,
  minimap: { enabled: false },
  overviewRulerBorder: false,
  hideCursorInOverviewRuler: true,
  overviewRulerLanes: 0,
  scrollbar: {
    vertical: 'visible',
    horizontal: 'visible',
    verticalScrollbarSize: 10,
    horizontalScrollbarSize: 10,
  },
  scrollBeyondLastLine: false,
  renderLineHighlight: 'line',
  selectionHighlight: false,
  guides: { indentation: false },
  roundedSelection: false,
  padding: { top: 25, bottom: 25 },
} as const;

// Import diagnostic codes to ignore across languages
const IMPORT_DIAGNOSTIC_CODES = [
  2304, // Cannot find name 'X'
  2503, // Cannot find namespace 'X'
  2792, // Cannot find module 'X'
  1192, // Module 'X' has no default export
  1259, // Module 'X' has no exported member 'Y'
  1343, // The 'import.meta' meta-property is only allowed when targeting ES2020 or higher
  // Add more codes as needed
];

export function CodeEditor({
  initialValue = '',
  onChange,
  language,
  height = '100%',
  readOnly = false,
  options = {},
  ...props
}: CodeEditorProps) {
  const { resolvedTheme } = useTheme();
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const handleEditorChange = (value: string | undefined) => {
    setValue(value || '');
    onChange?.(value);
  };

  const editorOptions = {
    ...defaultEditorOptions,
    ...options,
    readOnly,
  };

  return (
    <div className="h-full w-full overflow-hidden">
      <ClientOnly>
        {() => (
          <Editor
            height={height}
            language={language}
            value={value}
            beforeMount={(monaco) => {
              // Define themes
              monaco.editor.defineTheme(PURPLE_THEME_NAME, purpleTheme);
              monaco.editor.defineTheme(
                DARK_PURPLE_THEME_NAME,
                darkPurpleTheme
              );

              // Configure language diagnostics to ignore import issues
              configureLanguageDiagnostics(monaco);
            }}
            onChange={handleEditorChange}
            options={editorOptions}
            className="w-full"
            theme={
              resolvedTheme === 'dark'
                ? DARK_PURPLE_THEME_NAME
                : PURPLE_THEME_NAME
            }
            loading={<></>}
            {...props}
          />
        )}
      </ClientOnly>
    </div>
  );
}

// Helper function to configure diagnostics for all supported languages
function configureLanguageDiagnostics(monaco: any) {
  // TypeScript/JavaScript configuration
  if (monaco.languages.typescript) {
    const diagnosticsOptions = {
      noSemanticValidation: true,
      noSyntaxValidation: true,
      // Keeping the diagnostic codes to ignore just in case some validation still occurs
      diagnosticCodesToIgnore: IMPORT_DIAGNOSTIC_CODES,
    };

    monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions(
      diagnosticsOptions
    );
    monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions(
      diagnosticsOptions
    );
  }
}
