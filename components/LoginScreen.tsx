"use client";

import { useState } from "react";

export default function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState("");
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const handleLogin = () => {
    setIsAuthenticating(true);
    
    // Simula o tempo de um HD antigo lendo os dados do perfil (1.5 segundos)
    setTimeout(() => {
      onLogin();
    }, 1500);
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      backgroundImage: 'url("/windows-xp.jpg")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 999999
    }}>
      
      <div className="window" style={{ width: '380px', boxShadow: '2px 2px 10px rgba(0,0,0,0.5)' }}>
        
        <div className="title-bar">
          <div className="title-bar-text">Bem-vindo ao OctávioOS 2.0</div>
          <div className="title-bar-controls">
            <button aria-label="Close"></button>
          </div>
        </div>
        
        <div className="window-body" style={{ padding: '15px' }}>
          
          {isAuthenticating ? (
            /* TELA DE CARREGAMENTO (Enquanto valida o login) */
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '120px', gap: '15px' }}>
              <div style={{ fontSize: '30px' }}><img src={'https://win98icons.alexmeub.com/icons/png/user_card_view.png'} alt="User" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>
              <p style={{ fontWeight: 'bold' }}>Carregando suas configurações pessoais...</p>
            </div>
          ) : (
            /* FORMULÁRIO DE LOGIN NORMAL */
            <>
              <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                
                {/* O seu User Profile - AGORA CENTRALIZADO */}
                <div style={{ 
                  width: '60px', height: '60px', border: 'inset 0.2px', background: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' 
                }}>
                  <img 
                    src="/sailor-moon-pose.gif" 
                    alt="User" 
                    style={{ 
                      width: '100%', height: '100%', objectFit: 'cover', 
                      transform: 'scale(1.15)', transformOrigin: 'center' 
                    }} 
                  />
                </div>
                
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <p style={{ margin: 0, fontWeight: 'bold', fontSize: '12px' }}>
                    Digite uma senha para fazer logon.<br/>
                    <span style={{ fontWeight: 'normal', color: '#555', fontSize: '11px' }}>(Dica: Qualquer senha é válida)</span>
                  </p>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <label style={{ width: '60px', fontSize: '12px' }}>Usuário:</label>
                    <input type="text" value="Octávio Augusto" readOnly style={{ flex: 1, color: '#000', padding: '2px 4px' }} />
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <label style={{ width: '60px', fontSize: '12px' }}>Senha:</label>
                    {/* INPUT REAL DE SENHA! */}
                    <input 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleLogin()} // Permite logar apertando Enter!
                      autoFocus // O cursor já nasce piscando aqui
                      style={{ flex: 1, padding: '2px 4px' }} 
                    />
                  </div>
                </div>

              </div>

              {/* BOTÕES */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button onClick={handleLogin} style={{ width: '80px', fontWeight: 'bold' }}>OK</button>
                <button onClick={handleLogin} style={{ width: '80px' }}>Cancelar</button>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
}