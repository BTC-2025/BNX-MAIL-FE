import React, { useState, useEffect, useRef } from 'react';

const ReadingPaneLayout = ({ 
  mode = 'no_split', // 'no_split', 'right', 'below'
  hasSelection = false,
  listComponent,
  detailsComponent,
  headerComponent
}) => {
  const [listFlex, setListFlex] = useState(mode === 'right' ? 40 : 50); // percentage
  const containerRef = useRef(null);
  const isResizing = useRef(false);

  // Reset flex when mode changes
  useEffect(() => {
    if (mode === 'right') setListFlex(40);
    else if (mode === 'below') setListFlex(50);
  }, [mode]);

  const handleMouseDown = (e) => {
    e.preventDefault();
    isResizing.current = true;
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.body.style.cursor = mode === 'right' ? 'col-resize' : 'row-resize';
  };

  const handleMouseMove = (e) => {
    if (!isResizing.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    
    if (mode === 'right') {
      const newPercentage = ((e.clientX - rect.left) / rect.width) * 100;
      if (newPercentage > 20 && newPercentage < 80) {
        setListFlex(newPercentage);
      }
    } else if (mode === 'below') {
      const newPercentage = ((e.clientY - rect.top) / rect.height) * 100;
      if (newPercentage > 20 && newPercentage < 80) {
        setListFlex(newPercentage);
      }
    }
  };

  const handleMouseUp = () => {
    isResizing.current = false;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    document.body.style.cursor = 'default';
  };

  if (mode === 'no_split') {
    return (
      <div className="flex flex-col h-full overflow-hidden bg-transparent">
        {hasSelection ? detailsComponent : (
          <>
            {headerComponent}
            {listComponent}
          </>
        )}
      </div>
    );
  }

  const isRight = mode === 'right';

  return (
    <div 
      className={`flex h-full w-full overflow-hidden bg-transparent ${isRight ? 'flex-row' : 'flex-col'}`}
      ref={containerRef}
    >
      {/* Master View (List) */}
      <div 
        className="flex flex-col overflow-hidden bg-transparent shrink-0 relative"
        style={{ 
          flexBasis: `${listFlex}%`,
          borderRight: isRight ? '1px solid rgba(150, 150, 150, 0.2)' : 'none',
          borderBottom: !isRight ? '1px solid rgba(150, 150, 150, 0.2)' : 'none',
        }}
      >
        {headerComponent}
        {listComponent}
      </div>

      {/* Resizer Handle */}
      <div
        className={`hover:bg-primary/20 hover:opacity-100 transition-all z-10 shrink-0 ${
          isRight 
            ? 'w-1 cursor-col-resize h-full -ml-[2px]' 
            : 'h-1 cursor-row-resize w-full -mt-[2px]'
        }`}
        onMouseDown={handleMouseDown}
        style={{
          backgroundColor: 'transparent'
        }}
      />

      {/* Detail View (Email content) */}
      <div className="flex-1 overflow-hidden bg-transparent">
        {hasSelection ? detailsComponent : (
          <div className="flex items-center justify-center h-full w-full bg-black/5 dark:bg-white/5">
            <div className="flex flex-col items-center opacity-50">
              <span className="text-4xl mb-4">📭</span>
              <p className="font-medium text-gray-500">Select an item to read</p>
              <p className="text-xs text-gray-400 mt-1">Nothing is selected</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReadingPaneLayout;
