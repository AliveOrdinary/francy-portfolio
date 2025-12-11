'use client';

import { useState, useMemo } from 'react';

interface ExpandableSummaryProps {
  shortSummary: string;
  mainSummaryHtml: string;
}

export default function ExpandableSummary({ shortSummary, mainSummaryHtml }: ExpandableSummaryProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Basic HTML sanitization - removes script tags and dangerous attributes
  const sanitizedHtml = useMemo(() => {
    if (!mainSummaryHtml) return '';
    
    // Remove script tags and their content
    let cleaned = mainSummaryHtml.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
    
    // Remove dangerous attributes
    cleaned = cleaned.replace(/\s(on\w+|javascript:)[^\s>]*/gi, '');
    
    // Remove dangerous tags but keep content
    cleaned = cleaned.replace(/<\/?(?:iframe|object|embed|form|input|meta|link)[^>]*>/gi, '');
    
    return cleaned;
  }, [mainSummaryHtml]);

  return (
    <div className="mb-12">
      <p className="text-lg leading-relaxed mb-4">
        {shortSummary}
      </p>
      
      {isExpanded && (
        <div 
          className="text-lg mb-4 prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: sanitizedHtml }} 
        />
      )}

      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="text-lg font-medium text-black hover:underline focus:outline-none"
      >
        {isExpanded ? 'Read less' : 'Read more'}
      </button>
    </div>
  );
} 