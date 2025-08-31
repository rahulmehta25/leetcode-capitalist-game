import { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { PlayIcon, RotateCcwIcon, Code2, Terminal, Sparkles, Copy, Check } from 'lucide-react';
import Editor from '@monaco-editor/react';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';

interface CodeEditorProps {
  starterCode: {
    javascript: string;
    python?: string;
    java?: string;
  };
  onRun: (code: string, language: string) => void;
  isRunning?: boolean;
}

export const CodeEditor = ({ starterCode, onRun, isRunning = false }: CodeEditorProps) => {
  const [language, setLanguage] = useState<'javascript' | 'python' | 'java'>('javascript');
  const [code, setCode] = useState({
    javascript: starterCode.javascript,
    python: starterCode.python || '',
    java: starterCode.java || '',
  });
  const [copiedCode, setCopiedCode] = useState(false);
  const editorRef = useRef<any>(null);

  const handleReset = () => {
    setCode({
      javascript: starterCode.javascript,
      python: starterCode.python || '',
      java: starterCode.java || '',
    });
  };

  const handleRun = () => {
    onRun(code[language], language);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code[language]);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
  };

  const getLanguageId = (lang: string) => {
    switch (lang) {
      case 'python': return 'python';
      case 'java': return 'java';
      default: return 'javascript';
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-muted/50 p-4 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Terminal className="w-5 h-5 text-blue-500" />
            Stage 3: Code Challenge
          </h3>
          <Badge variant="outline" className="flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            Final Stage
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          Write your complete solution. All test cases must pass!
        </p>
      </div>

      <Tabs value={language} onValueChange={(v) => setLanguage(v as any)}>
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="javascript" className="flex items-center gap-1">
              <Code2 className="w-3 h-3" />
              JavaScript
            </TabsTrigger>
            {starterCode.python && (
              <TabsTrigger value="python" className="flex items-center gap-1">
                <Code2 className="w-3 h-3" />
                Python
              </TabsTrigger>
            )}
            {starterCode.java && (
              <TabsTrigger value="java" className="flex items-center gap-1">
                <Code2 className="w-3 h-3" />
                Java
              </TabsTrigger>
            )}
          </TabsList>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyCode}
              disabled={isRunning}
            >
              {copiedCode ? (
                <>
                  <Check className="w-4 h-4 mr-1" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-1" />
                  Copy
                </>
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              disabled={isRunning}
            >
              <RotateCcwIcon className="w-4 h-4 mr-1" />
              Reset
            </Button>
            <Button
              size="sm"
              onClick={handleRun}
              disabled={isRunning}
              className="bg-green-600 hover:bg-green-700"
            >
              <PlayIcon className="w-4 h-4 mr-1" />
              {isRunning ? 'Running...' : 'Run Code'}
            </Button>
          </div>
        </div>
        
        <TabsContent value="javascript" className="mt-4">
          <div className="border rounded-lg overflow-hidden">
            <Editor
              height="400px"
              language="javascript"
              value={code.javascript}
              onChange={(value) => setCode({ ...code, javascript: value || '' })}
              onMount={handleEditorDidMount}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: 'on',
                roundedSelection: false,
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 2,
                wordWrap: 'on',
                readOnly: isRunning,
              }}
            />
          </div>
        </TabsContent>
        
        {starterCode.python && (
          <TabsContent value="python" className="mt-4">
            <div className="border rounded-lg overflow-hidden">
              <Editor
                height="400px"
                language="python"
                value={code.python}
                onChange={(value) => setCode({ ...code, python: value || '' })}
                onMount={handleEditorDidMount}
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: 'on',
                  roundedSelection: false,
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  tabSize: 4,
                  wordWrap: 'on',
                  readOnly: isRunning,
                }}
              />
            </div>
          </TabsContent>
        )}
        
        {starterCode.java && (
          <TabsContent value="java" className="mt-4">
            <div className="border rounded-lg overflow-hidden">
              <Editor
                height="400px"
                language="java"
                value={code.java}
                onChange={(value) => setCode({ ...code, java: value || '' })}
                onMount={handleEditorDidMount}
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: 'on',
                  roundedSelection: false,
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  tabSize: 4,
                  wordWrap: 'on',
                  readOnly: isRunning,
                }}
              />
            </div>
          </TabsContent>
        )}
      </Tabs>

      <Alert>
        <Terminal className="h-4 w-4" />
        <AlertDescription>
          <div className="flex flex-wrap gap-4 text-xs">
            <div><kbd>Ctrl</kbd>+<kbd>Enter</kbd> Run code</div>
            <div><kbd>Ctrl</kbd>+<kbd>Z</kbd> Undo</div>
            <div><kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>Z</kbd> Redo</div>
            <div><kbd>Ctrl</kbd>+<kbd>F</kbd> Find</div>
            <div><kbd>Ctrl</kbd>+<kbd>H</kbd> Replace</div>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
};