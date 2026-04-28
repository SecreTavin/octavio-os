"use client";

export default function ShutdownScreen() {
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      background: 'radial-gradient(circle, #5a7edc 0%, #234791 100%)',
      color: '#fff', zIndex: 999999, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', 
      
      fontFamily: "'Pixelated MS Sans Serif', 'W95FA', 'MS Sans Serif', Tahoma, sans-serif",
      WebkitFontSmoothing: 'none',
      MozOsxFontSmoothing: 'grayscale',
      letterSpacing: '0.5px'
    }}>
      
      <img src="https://win98icons.alexmeub.com/icons/png/windows-0.png" 
           style={{ width: '80px', marginBottom: '20px', filter: 'drop-shadow(2px 2px 2px rgba(0,0,0,0.5))' }} alt="Win Logo" />
      
      <h1 style={{ fontWeight: 'normal', fontSize: '22px', textShadow: '1px 1px 0px #000', margin: '0 0 20px 0' }}>
        O computador já pode ser desligado com segurança.
      </h1>
      
      <p style={{ margin: '0', color: '#ccc', fontSize: '13px' }}>OctávioOS 2.0 - Remastered</p>
      
      <button 
        onClick={() => window.location.reload()}
        style={{ 
          marginTop: '30px', 
          padding: '5px 15px', 
          cursor: 'pointer', 
          fontFamily: 'inherit', /* Puxa a fonte pixelada do container pai */
          fontSize: '12px',
          fontWeight: 'bold'
        }}>
        Reiniciar Sistema
      </button>
      
    </div>
  );
}