'use client';
import { useState } from 'react';
export default function Disclosure() {
  // 1. Memory (State) initialized to false (closed)
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div style={{ padding: '1rem', border: '1px solid #ccc', borderRadius: '8px' }}>
      {/* 2. Semantic button that flips the current state */}
      <button 
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        style={{
          padding: '0.5rem 1rem',
          cursor: 'pointer',
          fontWeight: 'bold',
        }}
      >
        {isOpen ? 'Show less' : 'Show more'}
      </button>
      {/* 3. Conditional content that only exists in the DOM when open */}
      {isOpen && (
        <p style={{ marginTop: '0.75rem', color: '#444' }}>
          This content only renders on the page when the state is set to open. 
          When closed, it is completely removed from the DOM.
        </p>
      )}
    </div>
  );
}