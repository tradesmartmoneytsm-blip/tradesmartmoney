import React from 'react';

interface ContentFormatterProps {
  content: string;
}

export function ContentFormatter({ content }: ContentFormatterProps) {
  // Parse and format the raw text content
  const formatContent = (text: string) => {
    const lines = text.split('\n');
    const formatted: React.ReactElement[] = [];
    let listItems: string[] = [];
    let inList = false;

    const flushList = () => {
      if (listItems.length > 0) {
        formatted.push(
          <ul key={`list-${formatted.length}`} className="my-4 ml-4 space-y-3">
            {listItems.map((item, idx) => (
              <li key={idx} className="flex items-start gap-3 group">
                <span className="text-blue-600 dark:text-blue-400 font-bold mt-0.5 group-hover:scale-125 transition-transform">•</span>
                <span className="flex-1 text-gray-700 dark:text-gray-300 leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        );
        listItems = [];
        inList = false;
      }
    };

    lines.forEach((line, index) => {
      const trimmed = line.trim();
      
      // Skip empty lines in lists
      if (!trimmed && inList) {
        flushList();
        return;
      }
      
      // Empty line
      if (!trimmed) {
        formatted.push(<div key={`space-${index}`} className="h-4"></div>);
        return;
      }

      // Main chapter heading (starts with numbers like "1.1" or just chapter number)
      if (/^(Chapter \d+|^\d+\.\d+\s)/.test(trimmed)) {
        flushList();
        const sectionNumber = trimmed.match(/^\d+\.\d+/)?.[0];
        const cleanTitle = trimmed.replace(/^(Chapter \d+\s*—\s*|^\d+\.\d+\s*)/, '');
        formatted.push(
          <div key={`h2-${index}`} className="mt-10 mb-6">
            {sectionNumber && (
              <div className="inline-block px-3 py-1 bg-blue-600 text-white text-sm font-bold rounded-full mb-2">
                {sectionNumber}
              </div>
            )}
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white border-b-2 border-blue-600 pb-3">
              {cleanTitle || trimmed}
            </h2>
          </div>
        );
        return;
      }

      // Subheadings (lines ending with colon or starting with ## or standalone emphasis)
      if ((trimmed.endsWith(':') && trimmed.length < 80 && !/^[\t•\-]/.test(line)) || trimmed.startsWith('##')) {
        flushList();
        const cleanTitle = trimmed.replace(/^##\s*/, '');
        
        // Check if it's a label (like "Important clarifications:")
        if (/^[A-Z]/.test(cleanTitle) && cleanTitle.endsWith(':')) {
          formatted.push(
            <h3 key={`h3-${index}`} className="text-lg md:text-xl font-bold text-blue-900 dark:text-blue-300 mt-6 mb-3 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-blue-600 rounded"></span>
              {cleanTitle}
            </h3>
          );
        } else {
          formatted.push(
            <h3 key={`h3-${index}`} className="text-xl font-semibold text-gray-800 dark:text-gray-200 mt-6 mb-3">
              {cleanTitle}
            </h3>
          );
        }
        return;
      }

      // Bold sections (Important, Key, Note, etc.)
      if (/^(Important|Key|Note|Warning|Remember|Tip|Example|Checklist|Steps|Red flags|Signals|Practices|Objectives|Principles):/i.test(trimmed)) {
        flushList();
        const parts = trimmed.split(':');
        const label = parts[0];
        const bgColors: {[key: string]: string} = {
          'Warning': 'bg-red-50 dark:bg-red-900/20 border-red-600',
          'Tip': 'bg-green-50 dark:bg-green-900/20 border-green-600',
          'Example': 'bg-purple-50 dark:bg-purple-900/20 border-purple-600',
          'Checklist': 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-600',
        };
        const colorClass = bgColors[label] || 'bg-blue-50 dark:bg-blue-900/20 border-blue-600';
        
        formatted.push(
          <div key={`note-${index}`} className={`my-4 p-4 ${colorClass} border-l-4 rounded-r`}>
            <span className="font-bold text-gray-900 dark:text-white text-lg">{parts[0]}:</span>
            <span className="text-gray-700 dark:text-gray-300"> {parts.slice(1).join(':')}</span>
          </div>
        );
        return;
      }

      // List items (starts with • or bullet point or - or tab or numbered)
      if (/^[\t•\-]\s*/.test(line) || trimmed.startsWith('•') || /^\d+\.\s/.test(trimmed)) {
        inList = true;
        const cleanItem = trimmed.replace(/^[\t•\-\d+\.\s]*/, '');
        listItems.push(cleanItem);
        return;
      }

      // Formulas or mathematical expressions
      if (/^(Quick formulas|Sanity checks|Formulas|Calculation)/i.test(trimmed)) {
        flushList();
        formatted.push(
          <div key={`formula-label-${index}`} className="mt-6 mb-3 px-4 py-2 bg-purple-100 dark:bg-purple-900/30 border-l-4 border-purple-600 rounded-r">
            <span className="font-bold text-purple-900 dark:text-purple-300 text-lg">{trimmed}</span>
          </div>
        );
        return;
      }

      // Code or formula line (contains =, arrows, or mathematical symbols)
      if (/[=÷×→≈≥≤]/.test(trimmed) && !trimmed.endsWith(':')) {
        flushList();
        formatted.push(
          <div key={`code-${index}`} className="my-3 p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg font-mono text-sm text-gray-900 dark:text-gray-100 overflow-x-auto shadow-sm">
            {trimmed}
          </div>
        );
        return;
      }

      // Regular paragraph - check for bold text within
      if (!inList && trimmed) {
        flushList();
        // Process inline formatting
        const processInlineFormatting = (text: string) => {
          const elements: (string | React.ReactElement)[] = [];
          
          // Split by potential bold markers or key terms
          const segments = text.split(/(\*\*[^*]+\*\*|__[^_]+__|[A-Z][A-Za-z\s&]+ —|"[^"]+"|'[^']+'|\([^)]+\))/g);
          
          segments.forEach((segment, i) => {
            if (!segment) return;
            
            // Bold text between ** or __
            if (segment.startsWith('**') || segment.startsWith('__')) {
              const cleaned = segment.replace(/^\*\*|\*\*$|^__|__$/g, '');
              elements.push(
                <strong key={`bold-${i}`} className="font-bold text-gray-900 dark:text-white">
                  {cleaned}
                </strong>
              );
            }
            // Quoted text
            else if ((segment.startsWith('"') && segment.endsWith('"')) || (segment.startsWith("'") && segment.endsWith("'"))) {
              elements.push(
                <span key={`quote-${i}`} className="italic text-blue-700 dark:text-blue-400">
                  {segment}
                </span>
              );
            }
            // Terms in parentheses
            else if (segment.startsWith('(') && segment.endsWith(')')) {
              elements.push(
                <span key={`paren-${i}`} className="text-sm text-gray-600 dark:text-gray-400">
                  {segment}
                </span>
              );
            }
            // Label with em dash
            else if (segment.endsWith(' —') && /^[A-Z]/.test(segment)) {
              elements.push(
                <strong key={`label-${i}`} className="font-semibold text-gray-900 dark:text-white">
                  {segment}
                </strong>
              );
            }
            else {
              elements.push(segment);
            }
          });
          
          return elements;
        };

        formatted.push(
          <p key={`p-${index}`} className="my-4 text-base md:text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
            {processInlineFormatting(trimmed)}
          </p>
        );
      }
    });

    flushList(); // Flush any remaining list items
    return formatted;
  };

  return (
    <div className="formatted-content">
      {formatContent(content)}
    </div>
  );
}

