// src/components/Compiler.tsx
import React, { useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { EditorView } from '@codemirror/view';
import { autocompletion, CompletionContext, CompletionResult } from '@codemirror/autocomplete';
import styles from './Compiler.module.css';

// Define a custom black theme
// Define a custom pure black theme for the CodeMirror editor
const blackTheme = EditorView.theme({
    "&": {
        color: "#f8f8f2",             // Light text color
        backgroundColor: "#000000",   // Pure black background for the entire editor
    },
    ".cm-content": {
        backgroundColor: "#000000",   // Pure black for the main content area
        color: "#f8f8f2",             // Light text color for readability
        caretColor: "#ffffff",        // White cursor color for contrast
    },
    ".cm-gutters": {
        backgroundColor: "#0d0d0d",   // Slightly lighter black for gutters (line numbers)
        color: "#666666",             // Medium gray for line numbers
        border: "none",
    },
    ".cm-activeLine": {
        backgroundColor: "#1a1a1a",   // Dark gray to highlight the active line
    },
    ".cm-tooltip": {
        backgroundColor: "#1a1a1a",   // Dark gray background for autocomplete tooltips
        color: "#f8f8f2",             // Light text color for tooltips
    },
    ".cm-selectionMatch": {
        backgroundColor: "#333333",   // Slightly lighter gray for selected text
    },
}, { dark: true });

const Compiler: React.FC = () => {
    const [code, setCode] = useState<string>(`
mutate helloWorld = () => {
    speakOut("Hello, World!");
};
helloWorld();
    `);
    const [output, setOutput] = useState<string>('');

    const axisLangKeywords = [
        { label: "whatIf", type: "keyword", detail: "if statement", info: "Equivalent to JavaScript 'if'." },
        { label: "howAbout", type: "keyword", detail: "else if statement", info: "Equivalent to JavaScript 'else if'." },
        { label: "otherwise", type: "keyword", detail: "else statement", info: "Equivalent to JavaScript 'else'." },
        { label: "keepLooping", type: "keyword", detail: "while loop", info: "Equivalent to JavaScript 'while'." },
        { label: "loopTimes", type: "keyword", detail: "for loop", info: "Equivalent to JavaScript 'for' loop." },
        { label: "speakOut", type: "function", detail: "console.log", info: "Equivalent to JavaScript 'console.log'." },
        { label: "listenIn", type: "function", detail: "prompt", info: "Equivalent to JavaScript 'prompt'." },
        { label: "mutate", type: "keyword", detail: "let variable", info: "Equivalent to JavaScript 'let'." },
        { label: "immutable", type: "keyword", detail: "const variable", info: "Equivalent to JavaScript 'const'." },
        { label: "absolutely", type: "constant", detail: "true", info: "Equivalent to JavaScript 'true'." },
        { label: "noWay", type: "constant", detail: "false", info: "Equivalent to JavaScript 'false'." }
    ];

    const axisLangCompletion = (context: CompletionContext): CompletionResult | null => {
        const word = context.matchBefore(/\w*/);
        if (!word || word.from === word.to) return null;
        return {
            from: word.from,
            options: axisLangKeywords.map(keyword => ({
                label: keyword.label,
                type: keyword.type,
                detail: keyword.detail,
                info: keyword.info
            })),
            validFor: /^\w*$/
        };
    };

    const translateAndExecute = () => {
        const translatedCode = code
            .replace(/\bwhatIf\b/g, 'if')
            .replace(/\bhowAbout\b/g, 'else if')
            .replace(/\botherwise\b/g, 'else')
            .replace(/\bkeepLooping\b/g, 'while')
            .replace(/\bloopTimes\b/g, 'for')
            .replace(/\bspeakOut\b/g, 'console.log')
            .replace(/\blistenIn\b/g, 'prompt')
            .replace(/\bmutate\b/g, 'let')
            .replace(/\bimmutable\b/g, 'const')
            .replace(/\babsolutely\b/g, 'true')
            .replace(/\bnoWay\b/g, 'false');

        const wrappedCode = `(function() {\n${translatedCode}\n})();`;

        try {
            const log: string[] = [];
            const originalConsoleLog = console.log;
            console.log = (message: any) => log.push(message);

            eval(wrappedCode); // Execute the translated code
            setOutput(log.join('\n'));

            console.log = originalConsoleLog;
        } catch (error) {
            setOutput(`Error: ${(error as Error).message}`);
        }
    };

    return (
        <div className={styles.compiler}>
            <h2>AxisLang Compiler</h2>
            <CodeMirror
                value={code}
                extensions={[
                    javascript(),
                    blackTheme, // Apply the custom black theme
                    autocompletion({ override: [axisLangCompletion] })
                ]}
                onChange={(value: string) => setCode(value)}
                className={styles.editor}
            />
            <button className={styles.button} onClick={translateAndExecute}>Execute</button>
            <h3>Output:</h3>
            <pre className={styles.output}>{output}</pre>
        </div>
    );
};

export default Compiler;
