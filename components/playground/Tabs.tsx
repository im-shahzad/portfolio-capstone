'use client';

import { useState, useRef, KeyboardEvent } from 'react';

interface TabData {
  id: string;
  label: string;
  content: string;
}

const TABS: TabData[] = [
  { id: 'tab-1', label: 'Overview', content: 'This is the Overview panel content.' },
  { id: 'tab-2', label: 'Settings', content: 'Manage your settings and preferences here.' },
  { id: 'tab-3', label: 'Profile', content: 'View and edit your personal profile information.' },
];

export default function Tabs() {
  const [activeIndex, setActiveIndex] = useState(0);
  
  // Store an array of DOM references for each tab button
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;

    e.preventDefault(); // Prevent default scroll behavior
    let nextIndex = activeIndex;

    if (e.key === 'ArrowRight') {
      // Move right, wrapping back to index 0 at the end
      nextIndex = (activeIndex + 1) % TABS.length;
    } else if (e.key === 'ArrowLeft') {
      // Move left, wrapping back to the last index at the start
      nextIndex = (activeIndex - 1 + TABS.length) % TABS.length;
    }

    setActiveIndex(nextIndex);
    
    // Explicitly move DOM focus to the newly active tab button
    buttonRefs.current[nextIndex]?.focus();
  };

  return (
    <div style={{ maxWidth: '600px', margin: '1rem 0' }}>
      {/* 1. Tablist Container */}
      <div 
        role="tablist" 
        aria-label="Sample Tabs"
        onKeyDown={handleKeyDown}
        style={{ display: 'flex', gap: '0.5rem', borderBottom: '2px solid #ccc' }}
      >
        {TABS.map((tab, index) => {
          const isSelected = index === activeIndex;
          return (
            <button
              key={tab.id}
              ref={(el) => { buttonRefs.current[index] = el; }}
              role="tab"
              aria-selected={isSelected}
              aria-controls={`panel-${tab.id}`}
              id={`tab-${tab.id}`}
              tabIndex={isSelected ? 0 : -1} // Roving tabIndex
              onClick={() => setActiveIndex(index)}
              style={{
                padding: '0.5rem 1rem',
                cursor: 'pointer',
                fontWeight: isSelected ? 'bold' : 'normal',
                borderBottom: isSelected ? '3px solid #0066cc' : 'none',
                background: 'none',
                border: 'none',
                outline: 'none',
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* 2. Active Tab Panel */}
      {TABS.map((tab, index) => {
        const isSelected = index === activeIndex;
        if (!isSelected) return null;

        return (
          <div
            key={tab.id}
            id={`panel-${tab.id}`}
            role="tabpanel"
            aria-labelledby={`tab-${tab.id}`}
            tabIndex={0}
            style={{ padding: '1rem 0' }}
          >
            <p>{tab.content}</p>
          </div>
        );
      })}
    </div>
  );
}