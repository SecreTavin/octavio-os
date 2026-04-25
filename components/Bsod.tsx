"use client";

import { useEffect } from "react";

export default function BSOD({ onClose }: { onClose: () => void }) {
  // Permite fechar a tela azul apertando qualquer tecla
  useEffect(() => {
    const handleKeyDown = () => onClose();
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div 
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: '#0000AA',
        color: '#FFFFFF',
        fontFamily: "'Courier New', Courier, monospace",
        zIndex: 999999,
        padding: '50px 10%',
        boxSizing: 'border-box',
        cursor: 'pointer',
        fontSize: '18px'
      }}
    >
      <div style={{ backgroundColor: '#AAAAAA', color: '#0000AA', display: 'inline-block', padding: '2px 8px', fontWeight: 'bold', marginBottom: '40px' }}>
        Windows
      </div>
      
      <p style={{ marginBottom: '20px' }}>Ocorreu um erro fatal em 0028:C0011E36 no VXD VMM(01).</p>
      
      <p style={{ marginBottom: '40px' }}>Aviso: O nível de habilidade e lógica deste candidato excedeu o limite máximo da memória RAM.</p>
      
      <p style={{ marginBottom: '20px' }}>* Pressione qualquer tecla (ou clique na tela) para reiniciar o sistema e contratar o desenvolvedor.</p>
      
      <p>* Se o problema persistir, envie um email com uma proposta de emprego imediatamente.</p>
    </div>
  );
}