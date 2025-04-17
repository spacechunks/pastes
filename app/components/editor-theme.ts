import type { editor } from 'monaco-editor';

const purpleThemeColors = {
  comments: '#8996b8',
  strings: '#4e9f9f',
  numbers: '#8b6cc9',
  keywords: '#7c4dff',
  types: '#6a65d6',
  classes: '#6e56cf',
  functions: '#5b7ec5',
  variables: '#526294',
  operators: '#8e8eaa',
  parameters: '#6a7291',
};

// Define dark theme colors
const darkThemeColors = {
  comments: '#6272a4',
  strings: '#8be9fd',
  numbers: '#bd93f9',
  keywords: '#ff79c6',
  types: '#8be9fd',
  classes: '#50fa7b',
  functions: '#a679ec',
  variables: '#b5a5ff',
  operators: '#a9b1d6',
  parameters: '#9580ff',
};

export const purpleTheme: editor.IStandaloneThemeData = {
  base: 'vs',
  inherit: true,
  rules: [
    { token: 'comment', foreground: purpleThemeColors.comments },
    { token: 'comment.js', foreground: purpleThemeColors.comments },
    { token: 'comment.ts', foreground: purpleThemeColors.comments },

    { token: 'string', foreground: purpleThemeColors.strings },
    { token: 'string.js', foreground: purpleThemeColors.strings },
    { token: 'string.ts', foreground: purpleThemeColors.strings },

    { token: 'keyword', foreground: purpleThemeColors.keywords },
    { token: 'keyword.js', foreground: purpleThemeColors.keywords },
    { token: 'keyword.ts', foreground: purpleThemeColors.keywords },

    { token: 'type', foreground: purpleThemeColors.types },
    { token: 'type.js', foreground: purpleThemeColors.types },
    { token: 'type.ts', foreground: purpleThemeColors.types },

    { token: 'number', foreground: purpleThemeColors.numbers },
    { token: 'number.js', foreground: purpleThemeColors.numbers },
    { token: 'number.ts', foreground: purpleThemeColors.numbers },

    { token: 'delimiter', foreground: purpleThemeColors.operators },
    { token: 'delimiter.js', foreground: purpleThemeColors.operators },
    { token: 'delimiter.ts', foreground: purpleThemeColors.operators },

    { token: 'variable', foreground: purpleThemeColors.variables },
    { token: 'variable.js', foreground: purpleThemeColors.variables },
    { token: 'variable.ts', foreground: purpleThemeColors.variables },

    { token: 'function', foreground: purpleThemeColors.functions },
    { token: 'function.js', foreground: purpleThemeColors.functions },
    { token: 'function.ts', foreground: purpleThemeColors.functions },
  ],
  colors: {
    'editor.background': '#faf5ff',
    'editor.foreground': '#3c3c5e',
    'editorLineNumber.foreground': '#a0a0c0',
    'editorLineNumber.activeForeground': '#7c7ca0',
    'editor.selectionBackground': '#e2defc',
    'editor.inactiveSelectionBackground': '#e8e5f7',
    'editor.lineHighlightBackground': '#f0edfb',
    'editorCursor.foreground': '#7963d2',
    'editorWhitespace.foreground': '#d8d5f0',
    'editorIndentGuide.background': '#e0ddee',
    'editorIndentGuide.activeBackground': '#c4c0dd',
  },
};

// Define dark purple theme
export const darkPurpleTheme: editor.IStandaloneThemeData = {
  base: 'vs-dark',
  inherit: true,
  rules: [
    { token: 'comment', foreground: darkThemeColors.comments },
    { token: 'comment.js', foreground: darkThemeColors.comments },
    { token: 'comment.ts', foreground: darkThemeColors.comments },

    { token: 'string', foreground: darkThemeColors.strings },
    { token: 'string.js', foreground: darkThemeColors.strings },
    { token: 'string.ts', foreground: darkThemeColors.strings },

    { token: 'keyword', foreground: darkThemeColors.keywords },
    { token: 'keyword.js', foreground: darkThemeColors.keywords },
    { token: 'keyword.ts', foreground: darkThemeColors.keywords },

    { token: 'type', foreground: darkThemeColors.types },
    { token: 'type.js', foreground: darkThemeColors.types },
    { token: 'type.ts', foreground: darkThemeColors.types },

    { token: 'number', foreground: darkThemeColors.numbers },
    { token: 'number.js', foreground: darkThemeColors.numbers },
    { token: 'number.ts', foreground: darkThemeColors.numbers },

    { token: 'delimiter', foreground: darkThemeColors.operators },
    { token: 'delimiter.js', foreground: darkThemeColors.operators },
    { token: 'delimiter.ts', foreground: darkThemeColors.operators },

    { token: 'variable', foreground: darkThemeColors.variables },
    { token: 'variable.js', foreground: darkThemeColors.variables },
    { token: 'variable.ts', foreground: darkThemeColors.variables },

    { token: 'function', foreground: darkThemeColors.functions },
    { token: 'function.js', foreground: darkThemeColors.functions },
    { token: 'function.ts', foreground: darkThemeColors.functions },
  ],
  colors: {
    'editor.background': '#1a1b26',
    'editor.foreground': '#c5c9e6',
    'editorLineNumber.foreground': '#565f89',
    'editorLineNumber.activeForeground': '#737aa2',
    'editor.selectionBackground': '#3d59a1',
    'editor.inactiveSelectionBackground': '#292e42',
    'editor.lineHighlightBackground': '#1f2335',
    'editorCursor.foreground': '#c5c9e6',
    'editorWhitespace.foreground': '#3b3b4d',
    'editorIndentGuide.background': '#292e42',
    'editorIndentGuide.activeBackground': '#3b3d57',
  },
};

// Theme names to register with Monaco
export const PURPLE_THEME_NAME = 'codepad-purple';
export const DARK_PURPLE_THEME_NAME = 'codepad-dark-purple';
export const DEFAULT_THEME_NAME = PURPLE_THEME_NAME;
