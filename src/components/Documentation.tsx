// src/components/Documentation.tsx
import React from 'react';
import styles from './Documentation.module.css';

const Documentation: React.FC = () => (
    <div className={styles.documentation}>
        <h1>AxisLang Documentation</h1>
        <p>Learn about each keyword in AxisLang, with its JavaScript equivalent and examples.</p>
        <ul className={styles.keywordList}>
            <li>
                <strong>whatIf</strong>: Equivalent to JavaScript <code>if</code>.
                <br />
                <em>Example:</em> <code>whatIf (condition) &#123; /* code */ &#125;</code>
                <br />
                <em>JavaScript Equivalent:</em> <code>if (condition) &#123; /* code */ &#125;</code>
            </li>
            <li>
                <strong>howAbout</strong>: Equivalent to JavaScript <code>else if</code>.
                <br />
                <em>Example:</em> <code>howAbout (condition) &#123; /* code */ &#125;</code>
                <br />
                <em>JavaScript Equivalent:</em> <code>else if (condition) &#123; /* code */ &#125;</code>
            </li>
            <li>
                <strong>otherwise</strong>: Equivalent to JavaScript <code>else</code>.
                <br />
                <em>Example:</em> <code>otherwise &#123; /* code */ &#125;</code>
                <br />
                <em>JavaScript Equivalent:</em> <code>else &#123; /* code */ &#125;</code>
            </li>
            <li>
                <strong>keepLooping</strong>: Equivalent to JavaScript <code>while</code>.
                <br />
                <em>Example:</em> <code>keepLooping (condition) &#123; /* code */ &#125;</code>
                <br />
                <em>JavaScript Equivalent:</em> <code>while (condition) &#123; /* code */ &#125;</code>
            </li>
            <li>
                <strong>loopTimes</strong>: Equivalent to JavaScript <code>for</code> loop.
                <br />
                <em>Example:</em> <code>loopTimes (let i = 0; i &lt; 10; i++) &#123; /* code */ &#125;</code>
                <br />
                <em>JavaScript Equivalent:</em> <code>for (let i = 0; i &lt; 10; i++) &#123; /* code */ &#125;</code>
            </li>
            <li>
                <strong>speakOut</strong>: Equivalent to <code>console.log</code> in JavaScript.
                <br />
                <em>Example:</em> <code>speakOut("Hello, World!");</code>
                <br />
                <em>JavaScript Equivalent:</em> <code>console.log("Hello, World!");</code>
            </li>
            <li>
                <strong>listenIn</strong>: Equivalent to JavaScript <code>prompt</code>.
                <br />
                <em>Example:</em> <code>listenIn("Enter your name:");</code>
                <br />
                <em>JavaScript Equivalent:</em> <code>prompt("Enter your name:");</code>
            </li>
            <li>
                <strong>mutate</strong>: Equivalent to JavaScript <code>let</code> for mutable variables.
                <br />
                <em>Example:</em> <code>mutate x = 5;</code>
                <br />
                <em>JavaScript Equivalent:</em> <code>let x = 5;</code>
            </li>
            <li>
                <strong>immutable</strong>: Equivalent to JavaScript <code>const</code> for constant variables.
                <br />
                <em>Example:</em> <code>immutable y = 10;</code>
                <br />
                <em>JavaScript Equivalent:</em> <code>const y = 10;</code>
            </li>
            <li>
                <strong>absolutely</strong>: Equivalent to <code>true</code> in JavaScript.
                <br />
                <em>Example:</em> <code>absolutely</code>
                <br />
                <em>JavaScript Equivalent:</em> <code>true</code>
            </li>
            <li>
                <strong>noWay</strong>: Equivalent to <code>false</code> in JavaScript.
                <br />
                <em>Example:</em> <code>noWay</code>
                <br />
                <em>JavaScript Equivalent:</em> <code>false</code>
            </li>
        </ul>
    </div>
);

export default Documentation;
