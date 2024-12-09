import React, { useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { EditorView } from "@codemirror/view";
import {
  autocompletion,
  CompletionContext,
  CompletionResult,
} from "@codemirror/autocomplete";
import styles from "./Compiler.module.css";

const blackTheme = EditorView.theme(
  {
    "&": {
      color: "#f8f8f2",
      backgroundColor: "#000000",
    },
    ".cm-content": {
      backgroundColor: "#000000",
      color: "#f8f8f2",
      caretColor: "#ffffff",
    },
    ".cm-gutters": {
      backgroundColor: "#0d0d0d",
      color: "#666666",
      border: "none",
    },
    ".cm-activeLine": {
      backgroundColor: "#1a1a1a",
    },
    ".cm-tooltip": {
      backgroundColor: "#1a1a1a",
      color: "#f8f8f2",
    },
    ".cm-selectionMatch": {
      backgroundColor: "#333333",
    },
  },
  { dark: true }
);

const Compiler: React.FC = () => {
  const [code, setCode] = useState<string>(`
mutate helloWorld = () => {
    speakOut("Hello, World!");
};
helloWorld();
    `);
  const [output, setOutput] = useState<string>("");
  const [tokens, setTokens] = useState<any[]>([]);

  const axisLangKeywords = [
    {
      label: "whatIf",
      type: "keyword",
      detail: "if statement",
      info: "Equivalent to JavaScript 'if'.",
    },
    {
      label: "howAbout",
      type: "keyword",
      detail: "else if statement",
      info: "Equivalent to JavaScript 'else if'.",
    },
    {
      label: "otherwise",
      type: "keyword",
      detail: "else statement",
      info: "Equivalent to JavaScript 'else'.",
    },
    {
      label: "keepLooping",
      type: "keyword",
      detail: "while loop",
      info: "Equivalent to JavaScript 'while'.",
    },
    {
      label: "loopTimes",
      type: "keyword",
      detail: "for loop",
      info: "Equivalent to JavaScript 'for' loop.",
    },
    {
      label: "speakOut",
      type: "function",
      detail: "console.log",
      info: "Equivalent to JavaScript 'console.log'.",
    },
    {
      label: "listenIn",
      type: "function",
      detail: "prompt",
      info: "Equivalent to JavaScript 'prompt'.",
    },
    {
      label: "mutate",
      type: "keyword",
      detail: "let variable",
      info: "Equivalent to JavaScript 'let'.",
    },
    {
      label: "immutable",
      type: "keyword",
      detail: "const variable",
      info: "Equivalent to JavaScript 'const'.",
    },
    {
      label: "absolutely",
      type: "constant",
      detail: "true",
      info: "Equivalent to JavaScript 'true'.",
    },
    {
      label: "noWay",
      type: "constant",
      detail: "false",
      info: "Equivalent to JavaScript 'false'.",
    },
  ];

  const axisLangCompletion = (
    context: CompletionContext
  ): CompletionResult | null => {
    const word = context.matchBefore(/\w*/);
    if (!word || word.from === word.to) return null;
    return {
      from: word.from,
      options: axisLangKeywords.map((keyword) => ({
        label: keyword.label,
        type: keyword.type,
        detail: keyword.detail,
        info: keyword.info,
      })),
      validFor: /^\w*$/,
    };
  };

  const tokenizeCode = (inputCode: string): any[] => {
    const lines = inputCode.split("\n");
    const tokenList: any[] = [];
    const regex = /\b(\w+)\b/g;

    lines.forEach((line, index) => {
      let match;
      while ((match = regex.exec(line)) !== null) {
        const value = match[0];
        const keyword = axisLangKeywords.find((k) => k.label === value);
        const token = {
          class: keyword ? keyword.type : "identifier",
          value,
          line: index + 1,
        };
        tokenList.push(token);
      }
    });

    return tokenList;
  };

  const translateAndExecute = () => {
    try {
      const translatedCode = code
        .replace(/\bwhatIf\b/g, "if")
        .replace(/\bhowAbout\b/g, "else if")
        .replace(/\botherwise\b/g, "else")
        .replace(/\bkeepLooping\b/g, "while")
        .replace(/\bloopTimes\b/g, "for")
        .replace(/\bspeakOut\b/g, "console.log")
        .replace(/\blistenIn\b/g, "prompt")
        .replace(/\bmutate\b/g, "let")
        .replace(/\bimmutable\b/g, "const")
        .replace(/\babsolutely\b/g, "true")
        .replace(/\bnoWay\b/g, "false");

      // Wrap the entire code in a single try-catch block
      const wrappedCode = `
                try {
                    ${translatedCode}
                } catch (error) {
                    throw new Error('Error: ' + error.message);
                }
            `;

      const log: string[] = [];
      const originalConsoleLog = console.log;
      console.log = (message: any) => log.push(message);

      // Execute the wrapped code
      new Function(wrappedCode)();
      setOutput(log.join("\n"));

      console.log = originalConsoleLog;

      // Tokenize the original AxisLang code
      setTokens(tokenizeCode(code));
    } catch (error) {
      setOutput((error as Error).message);
    }
  };

  return (
    <div className={styles.compiler}>
      <h2>AxisLang Compiler</h2>
      <CodeMirror
        value={code}
        extensions={[
          javascript(),
          blackTheme,
          autocompletion({ override: [axisLangCompletion] }),
        ]}
        onChange={(value: string) => setCode(value)}
        className={styles.editor}
      />
      <button className={styles.button} onClick={translateAndExecute}>
        Execute
      </button>
      <h3>Output:</h3>
      <pre className={styles.output}>{output}</pre>
      <h3>Tokens:</h3>
      <pre className={styles.output}>
        {tokens
          .map(
            (token) =>
              `Class: ${token.class}, Value: ${token.value}, Line: ${token.line}`
          )
          .join("\n")}
      </pre>
    </div>
  );
};

export default Compiler;
