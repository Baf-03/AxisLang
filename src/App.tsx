import React from 'react';
import Documentation from './components/Documentation';
import Compiler from './components/Compiler';
import styles from './App.module.css';

const App: React.FC = () => (
    <div className={styles.appContainer}>
        <Documentation />
        <Compiler />
    </div>
);

export default App;
