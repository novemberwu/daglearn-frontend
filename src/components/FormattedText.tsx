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
          // It's text, which could contain inline code blocks split by a single backtick
          const subParts = part.split('`');
          return (
            <span key={index}>
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
                    <span key={subIndex} className="whitespace-pre-line">
                      {subPart}
                    </span>
                  );
                }
              })}
            </span>
          );
        }
      })}
    </div>
  );
}
