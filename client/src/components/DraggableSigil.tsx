import { useState, useEffect, useRef, useCallback } from "react";
import { adjustPosition } from "@/lib/canvas";
import type { SigilPosition } from "@/lib/canvas";

interface DraggableSigilProps {
  position: SigilPosition;
  onPositionChange: (position: SigilPosition) => void;
  isSelected: boolean;
  onSelect: () => void;
}

export function DraggableSigil({
  position,
  onPositionChange,
  isSelected,
  onSelect,
}: DraggableSigilProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
    onSelect();
  }, [position, onSelect]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;

    onPositionChange({
      ...position,
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  }, [isDragging, dragStart, position, onPositionChange]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isSelected) return;

      const moveAmount = e.shiftKey ? 1 : 5;
      if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', '[', ']'].includes(e.key)) {
        e.preventDefault();
        const newPosition = adjustPosition(position, e.key, moveAmount);
        onPositionChange(newPosition);
      }
    };

    if (isSelected) {
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isSelected, position, onPositionChange]);

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        transform: `translate(-50%, -50%) rotate(${position.rotation}deg)`,
        cursor: 'move',
        userSelect: 'none',
        border: isSelected ? '2px solid #0066cc' : 'none',
        borderRadius: '4px',
        padding: '4px',
        zIndex: 10,
      }}
    >
      <div
        style={{
          width: '20px',
          height: '20px',
          backgroundColor: isSelected ? '#0066cc' : '#666',
          borderRadius: '50%',
          opacity: 0.5,
        }}
      />
    </div>
  );
}