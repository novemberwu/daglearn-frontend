'use client';

import React from 'react';

interface FormattedTextProps {
  text: string;
  className?: string;
}

export default function FormattedText({ text, className }: FormattedTextProps) {
  if (!text) return null;

  // Split by triple backticks first for multi-line code blocks
  const parts = text.split('```');
  
  return (
    <div className={className}>
      {parts.map((part, index) => {
        const isCodeBlock = index % 2 === 1;
        
        if (isCodeBlock) {
          // It's a multiline code block. Let's parse language and content.
          const lines = part.split('\n');
          let language = '';
          let code = part;
          
          if (lines.length > 0) {
            const possibleLang = lines[0].trim();
            // A valid language identifier contains alphanumeric chars, +, #, or -
            if (possibleLang && /^[a-zA-Z0-9+#\-]+$/.test(possibleLang)) {
              language = possibleLang;
              code = lines.slice(1).join('\n');
            }
          }
          
          // Trim leading/trailing whitespace of code for clean alignment
          const trimmedCode = code.trim();
          
          return (
            <div 
              key={index} 
              className="my-3 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 font-mono text-sm shadow-xs"
            >
              {language && (
                <div className="bg-gray-100 dark:bg-gray-800 px-3 py-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-200 dark:border-gray-800 flex justify-between items-center select-none">
                  <span>{language}</span>
                </div>
              )}
              <pre className="p-4 overflow-x-auto text-gray-800 dark:text-gray-200 leading-relaxed font-mono">
                <code style={{ fontVariantLigatures: 'none', fontFeatureSettings: '"liga" 0, "clig" 0' }}>{trimmedCode}</code>
              </pre>
            </div>
          );
        } else {
          // Split non-code-blocks by line breaks to check for bullet points and format paragraphs
          const lines = part.split('\n');
          return (
            <div key={index} className="space-y-1 my-1">
              {lines.map((line, lineIndex) => {
                const isBullet = line.trimStart().startsWith('* ');
                if (isBullet) {
                  const content = line.trimStart().slice(2);
                  return (
                    <li key={lineIndex} className="list-disc ml-6 my-1 pl-1 text-gray-800 dark:text-gray-200 text-base">
                      {renderLineContent(content)}
                    </li>
                  );
                } else {
                  return (
                    <div key={lineIndex} className="min-h-[1.5rem]">
                      {renderLineContent(line)}
                    </div>
                  );
                }
              })}
            </div>
          );
        }
      })}
    </div>
  );
}

function renderLineContent(text: string): React.ReactNode {
  // It's text, which could contain inline code blocks split by a single backtick
  const subParts = text.split('`');
  return (
    <>
      {subParts.map((subPart, subIndex) => {
        const isInlineCode = subIndex % 2 === 1;
        if (isInlineCode) {
          return (
            <code
              key={subIndex}
              style={{ fontVariantLigatures: 'none', fontFeatureSettings: '"liga" 0, "clig" 0' }}
              className="px-1.5 py-0.5 mx-0.5 rounded font-mono text-[0.9em] bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-pink-600 dark:text-pink-400 font-semibold whitespace-nowrap"
            >
              {subPart}
            </code>
          );
        } else {
          return (
            <React.Fragment key={subIndex}>
              {renderTextWithMath(subPart)}
            </React.Fragment>
          );
        }
      })}
    </>
  );
}

function renderMathFormula(formula: string): React.ReactNode[] {
  const processed = formula
    .replace(/\\le/g, '≤')
    .replace(/\\ge/g, '≥')
    .replace(/\\ne/g, '≠')
    .replace(/\\times/g, '×')
    .replace(/\\cdot/g, '·')
    .replace(/\\approx/g, '≈')
    .replace(/\\infty/g, '∞')
    .replace(/\\minus/g, '−')
    .replace(/-/g, '−');

  const regex = /(\^\{([^}]+)\}|\^([a-zA-Z0-9\-+]+)|_\{([^}]+)\}|_([a-zA-Z0-9\-+]+))/g;
  const nodes: React.ReactNode[] = [];
  let lastIndex = 0;
  let match;
  
  while ((match = regex.exec(processed)) !== null) {
    const matchIndex = match.index;
    if (matchIndex > lastIndex) {
      nodes.push(processed.slice(lastIndex, matchIndex));
    }
    
    const isSup = match[1].startsWith('^');
    const content = isSup 
      ? (match[2] || match[3])
      : (match[4] || match[5]);
      
    if (isSup) {
      nodes.push(<sup key={matchIndex} className="text-[0.75em] leading-none ml-0.5">{content}</sup>);
    } else {
      nodes.push(<sub key={matchIndex} className="text-[0.75em] leading-none ml-0.5">{content}</sub>);
    }
    lastIndex = regex.lastIndex;
  }
  
  if (lastIndex < processed.length) {
    nodes.push(processed.slice(lastIndex));
  }
  
  return nodes;
}

function renderTextWithMath(text: string): React.ReactNode {
  if (!text) return "";
  const parts = text.split('$');
  
  return (
    <>
      {parts.map((part, index) => {
        const isMath = index % 2 === 1;
        if (isMath) {
          return (
            <span 
              key={index} 
              className="font-serif italic text-gray-900 dark:text-gray-100 px-0.5 select-all"
              style={{ fontVariantLigatures: 'none' }}
            >
              {renderMathFormula(part)}
            </span>
          );
        } else {
          return (
            <React.Fragment key={index}>
              {renderBoldText(part)}
            </React.Fragment>
          );
        }
      })}
    </>
  );
}

function renderBoldText(text: string): React.ReactNode {
  if (!text) return "";
  const parts = text.split('**');
  
  return (
    <>
      {parts.map((part, index) => {
        const isBold = index % 2 === 1;
        if (isBold) {
          return (
            <strong key={index} className="font-bold text-gray-950 dark:text-white">
              {part}
            </strong>
          );
        } else {
          return (
            <React.Fragment key={index}>
              {part}
            </React.Fragment>
          );
        }
      })}
    </>
  );
}