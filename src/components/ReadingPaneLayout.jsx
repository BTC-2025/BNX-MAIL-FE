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

  if (mode === 'no_split' || !hasSelection) {
    return (
      <div className="flex flex-col h-full overflow-hidden bg-transparent relative">
        <div className={`flex flex-col h-full overflow-hidden ${hasSelection && mode === 'no_split' ? 'hidden' : 'flex'}`}>
          {headerComponent}
          {listComponent}
        </div>
        {hasSelection && mode === 'no_split' && detailsComponent}
      </div>
    );
  }

  const isRight = mode === 'right';

  return (
    <div 
      className={`flex h-full w-full overflow-hidden bg-transparent relative ${isRight ? 'flex-row' : 'flex-col'}`}
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
        {detailsComponent}
      </div>
    </div>
  );
};

export default ReadingPaneLayout;
