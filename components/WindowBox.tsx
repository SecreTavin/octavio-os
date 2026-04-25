"use client";

import { useState, useEffect } from "react";
import { Rnd } from "react-rnd";

interface WindowBoxProps {
  title: string;
  icon?: string;
  onClose: () => void;
  children: React.ReactNode;
  defaultPosition?: { x: number; y: number };
  zIndex?: number;
  onFocus?: () => void;
}

export default function WindowBox({ title, icon = "📁", onClose, children, defaultPosition = { x: 50, y: 50 }, zIndex = 100, onFocus }: WindowBoxProps) {
  const [isMaximized, setIsMaximized] = useState(false);
  const [rndState, setRndState] = useState({ x: defaultPosition.x, y: defaultPosition.y, width: 600, height: 450 });
  const [winSize, setWinSize] = useState({ width: 800, height: 600 });

  // Pega o tamanho EXATO da tela em pixels para a tela cheia não bugar
  useEffect(() => {
    setWinSize({ width: window.innerWidth, height: window.innerHeight - 35 });
    const handleResize = () => setWinSize({ width: window.innerWidth, height: window.innerHeight - 35 });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <Rnd
      size={isMaximized ? { width: winSize.width, height: winSize.height } : { width: rndState.width, height: rndState.height }}
      position={isMaximized ? { x: 0, y: 0 } : { x: rndState.x, y: rndState.y }}
      onDragStop={(e, d) => { if (!isMaximized) setRndState({ ...rndState, x: d.x, y: d.y }) }}
      onResizeStop={(e, direction, ref, delta, position) => {
        if (!isMaximized) setRndState({ width: parseInt(ref.style.width), height: parseInt(ref.style.height), ...position });
      }}
      disableDragging={isMaximized}
      bounds="parent"
      dragHandleClassName="title-bar"
      onMouseDown={onFocus}
      style={{ zIndex }}
    >
      <div className="window" style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', boxShadow: '2px 2px 10px rgba(0,0,0,0.5)', boxSizing: 'border-box' }}>
        <div className="title-bar" onDoubleClick={() => setIsMaximized(!isMaximized)}>
          <div className="title-bar-text" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '14px' }}>{icon}</span> {title}
          </div>
          <div className="title-bar-controls">
            <button aria-label="Minimize"></button>
            <button aria-label="Maximize" onClick={() => setIsMaximized(!isMaximized)}></button>
            <button aria-label="Close" onClick={onClose}></button>
          </div>
        </div>
        <div className="window-body" style={{ flexGrow: 1, margin: 0, backgroundColor: '#fff', overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
          {children}
        </div>
      </div>
    </Rnd>
  );
}