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
  const [symbolTable, setSymbolTable] = useState<any[]>([]);
  const [tokenList, setTokenList] = useState<any[]>([]);

  const axisLangKeywords = [
    { label: "whatIf", type: "keyword" },
    { label: "howAbout", type: "keyword" },
    { label: "otherwise", type: "keyword" },
    { label: "keepLooping", type: "keyword" },
    { label: "loopTimes", type: "keyword" },
    { label: "speakOut", type: "function" },
    { label: "listenIn", type: "function" },
    { label: "mutate", type: "keyword" },
    { label: "immutable", type: "keyword" },
    { label: "absolutely", type: "constant" },
    { label: "noWay", type: "constant" },
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
      })),
      validFor: /^\w*$/,
    };
  };

  const tokenizeCode = (inputCode: string): { symbolTable: any[]; tokenList: any[] } => {
    const lines = inputCode.split("\n");
    const symbolTable: any[] = [];
    const tokenList: any[] = [];
    const regex = /\b(\w+)\b|(["'].+?["'])|([=,;{}()+\-*/])/g;

    lines.forEach((line, lineNumber) => {
      let match;
      const lineTokens: any[] = [];
      while ((match = regex.exec(line)) !== null) {
        const value = match[0];
        let classPart = "identifier";

        if (/["'].*["']/.test(value)) {
          classPart = "string"; // Strings
        } else if (/[(),;{}]/.test(value)) {
          classPart = "symbol"; // Symbols
        } else if (axisLangKeywords.some((k) => k.label === value)) {
          classPart = axisLangKeywords.find((k) => k.label === value)!.type; // Keywords/Identifiers
        }

        const token = {
          class: classPart,
          value,
          line: lineNumber + 1,
        };

        lineTokens.push(token);
        symbolTable.push({
          line: lineNumber + 1,
          classPart: token.class,
          valuePart: token.value,
        });
      }
      if (lineTokens.length > 0) {
        tokenList.push({ line: lineNumber + 1, tokens: lineTokens });
      }
    });

    return { symbolTable, tokenList };
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

      const log: string[] = [];
      const originalConsoleLog = console.log;
      console.log = (message: any) => log.push(message);

      new Function(translatedCode)();
      setOutput(log.join("\n"));

      console.log = originalConsoleLog;

      const { symbolTable, tokenList } = tokenizeCode(code);
      setSymbolTable(symbolTable);
      setTokenList(tokenList);
    } catch (error) {
      setOutput((error as Error).message);
    }
  };

  return (
    <div className={styles.compiler}>
      <h2>AxisLang Compiler</h2>

      <CodeMirror
        value={code}
        extensions={[javascript(), blackTheme, autocompletion({ override: [axisLangCompletion] })]}
        onChange={(value: string) => setCode(value)}
        className={styles.editor}
      />

      <button className={styles.button} onClick={translateAndExecute}>
        Execute
      </button>

      <h3>Output:</h3>
      <pre className={styles.output}>{output}</pre>

      <h3>Symbol Table:</h3>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Line</th>
            <th>Class</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {symbolTable.map((row, index) => (
            <tr key={index}>
              <td>{row.line}</td>
              <td>{row.classPart}</td>
              <td>{row.valuePart}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Token List:</h3>
      <ul className={styles.tokenList}>
        {tokenList.map((line, index) => (
          <li key={index}>
            <strong>Line {line.line}:</strong>{" "}
            {line.tokens.map((token: any) => `(${token.class}, ${token.value})`).join(", ")}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Compiler;
