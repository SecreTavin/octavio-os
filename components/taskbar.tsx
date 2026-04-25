"use client";

import { useState, useEffect } from "react";
import StartMenu from "./startmenu";

// AVISANDO O TYPESCRIPT: A Taskbar agora aceita a função onShutdown
interface TaskbarProps {
  onShutdown: () => void;
}

export default function Taskbar({ onShutdown }: TaskbarProps) {
  const [time, setTime] = useState("00:00 AM");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const atualizarRelogio = () => {
      const agora = new Date();
      let horas = agora.getHours();
      let minutos = agora.getMinutes();
      const ampm = horas >= 12 ? 'PM' : 'AM';
      
      horas = horas % 12;
      horas = horas ? horas : 12; 
      const minFormatado = minutos < 10 ? '0' + minutos : minutos; 
      
      setTime(`${horas}:${minFormatado} ${ampm}`);
    };

    atualizarRelogio();
    const intervalo = setInterval(atualizarRelogio, 1000);
    return () => clearInterval(intervalo); 
  }, []);

  return (
    <>
      {/* Repassamos a função para o Menu Iniciar */}
      {isMenuOpen && <StartMenu onShutdown={onShutdown} />}

      <div style={{
        position: 'absolute', bottom: 0, width: '100%', height: '35px',
        background: '#c0c0c0', borderTop: '2px solid #dfdfdf',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 5px', boxSizing: 'border-box', zIndex: 9999
      }}>
        
        <button 
          className={isMenuOpen ? "active" : ""} 
          onClick={() => setIsMenuOpen(!isMenuOpen)} 
          style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px' }}
        >
          <img src="https://win98icons.alexmeub.com/icons/png/windows_slanted-1.png" alt="Windows" style={{ width: '16px', height: '16px' }} />
          OctávioOS
        </button>

        <div style={{ border: 'inset 2px', padding: '2px 8px', fontSize: '12px' }}>
          {time}
        </div>
        
      </div>
    </>
  );
}