import React, { useEffect, useState } from 'react';
import './App.css';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { monokaiSublime } from 'react-syntax-highlighter/dist/esm/styles/hljs';

const code = `let pierwsze = 12111;
pierwsze+=Math.random();
let costam = \`fgsg\${pierwsze}sss\`;
console.log(costam + pierwsze);
`;

const App: React.FC = () => {
  const [stateCode, doChange] = useState(code);
  const [stateHighlights, doChangeHighlights] = useState<number[]>([]);
  useEffect(() => {
    const readCode = window.localStorage.getItem('editor_code');
    if (readCode) {
      doChange(JSON.parse(readCode));
    }
    const readLines = window.localStorage.getItem('editor_lines');
    if (readLines) {
      doChangeHighlights(JSON.parse(readLines));
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        doChangeHighlights([]);
      }
    });
  }, []);
  const handleClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    let currentElement = event.target as HTMLElement;
    while (currentElement) {
      if (currentElement.classList.contains('js-editor-line')) {
        for (const k of currentElement.classList.values()) {
          if (k.indexOf('js-editor-line-') === 0) {
            const lineStart = k.substr(('js-editor-line-').length);
            const lineStartNumber = parseInt(lineStart, 10);
            if (!stateHighlights.includes(lineStartNumber)) {
              doChangeHighlights([...stateHighlights, lineStartNumber]);
            } else {
              doChangeHighlights(stateHighlights.filter(a => a !== lineStartNumber));
            }
          }
        }
      }
      if (currentElement.parentElement) {
        currentElement = currentElement.parentElement;
      } else {
        return;
      }
    }
  };
  useEffect(() => {
    window.localStorage.setItem('editor_code', JSON.stringify(stateCode));
  }, [stateCode]);
  useEffect(() => {
    window.localStorage.setItem('editor_lines', JSON.stringify(stateHighlights));
  }, [stateHighlights]);
  return (
    <div className="App">
      <div className="hl" onClick={handleClick}>
        <SyntaxHighlighter
          language="typescript"
          style={monokaiSublime}
          showLineNumbers
          wrapLines
          // @ts-ignore
          lineProps={(lineNumber: number) => {
            let className = `js-editor-line js-editor-line-${lineNumber}`;
            if (stateHighlights.length) {

              if (stateHighlights.includes(lineNumber)) {
                className = `${className} highlighted`;
              } else {
                className = `${className} reduced`;
              }
            }

            return {
              'class': className
            };
          }}
        >
          {stateCode}
        </SyntaxHighlighter>
      </div>
      <div className="editor">
        <div className="editor-top">
          <textarea onChange={(e) => doChange(e.currentTarget.value)} value={stateCode} />
        </div>
        <div className="editor-bottom">
        </div>
      </div>
    </div>
  );
}

export default App;
