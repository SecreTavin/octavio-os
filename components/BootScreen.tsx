"use client";
import { useState, useEffect } from "react";

export default function BootScreen({ onFinished }: { onFinished: () => void }) {
  // Estado para controlar qual linha está aparecendo
  const [loadingStep, setLoadingStep] = useState(0);

  useEffect(() => {
    // Sequência de carregamento
    const timers = [
      setTimeout(() => setLoadingStep(1), 600),
      setTimeout(() => setLoadingStep(2), 1400),
      setTimeout(() => setLoadingStep(3), 2200),
      setTimeout(() => setLoadingStep(4), 2800),
      setTimeout(() => onFinished(), 4000) // Termina e chama o Desktop
    ];
    return () => timers.forEach(clearTimeout);
  }, [onFinished]);

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      backgroundColor: '#000', color: '#00FF00', zIndex: 999999,
      fontFamily: "'Courier New', Courier, monospace", padding: '20px',
      fontSize: '16px', boxSizing: 'border-box'
    }}>
      <p style={{ margin: '5px 0' }}>OctávioOS (C) Copyright 2026</p>
      <p style={{ margin: '5px 0' }}>BIOS Date 04/19/26 18:28:45 Ver 1.0</p>
      <br />
      <p style={{ margin: '5px 0' }}>CPU: Engenheiro de Software Processor</p>
      <p style={{ margin: '5px 0' }}>Speed: Ultra Fast</p>
      <p style={{ margin: '5px 0' }}>Memory Test: 32768K OK</p>
      <br />
      <br />
      
      {loadingStep >= 1 && <p style={{ margin: '5px 0' }}>&gt; Carregando Drivers do Kernel... [OK]</p>}
      {loadingStep >= 2 && <p style={{ margin: '5px 0' }}>&gt; Inicializando Banco de Dados MySQL... [OK]</p>}
      {loadingStep >= 3 && <p style={{ margin: '5px 0' }}>&gt; Configurando Ambiente Python &amp; Swift... [OK]</p>}
      {loadingStep >= 4 && <p style={{ margin: '5px 0' }}>&gt; Iniciando Interface Gráfica...</p>}
    </div>
  );
}