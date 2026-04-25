"use client";

// 1. AVISAMOS O TYPESCRIPT AQUI: O Menu agora exige a função de desligar
interface StartMenuProps {
  onShutdown: () => void;
}

// 2. RECEBEMOS A FUNÇÃO AQUI NOS PARÊNTESES
export default function StartMenu({ onShutdown }: StartMenuProps) {
  return (
    <div style={{
      position: 'absolute', bottom: '35px', left: '2px', width: '280px',
      background: '#c0c0c0', border: '2px solid #dfdfdf',
      borderRightColor: '#0a0a0a', borderBottomColor: '#0a0a0a',
      boxShadow: '2px 2px 5px rgba(0,0,0,0.5)', display: 'flex',
      flexDirection: 'column', zIndex: 10000,
    }}>
         {/* Cabeçalho do Menu */}  
      <div style={{ display: 'flex', alignItems: 'center', background: '#000080', padding: '10px', borderBottom: '2px groove #dfdfdf' }}>
        <div style={{ width: '45px', height: '45px', border: 'inset 2px', overflow: 'hidden', background: '#fff' }}>
          <img 
            src="/sailor-moon-pose.gif" 
            alt="Profile" 
            style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scale(1.15)', display: 'block' }} 
          />
        </div>
        <div style={{ marginLeft: '12px', color: 'white' }}>
          <div style={{ fontWeight: 'bold', fontSize: '18px' }}>Octávio Augusto</div>
          <div style={{ fontSize: '12px', color: '#c0c0c0' }}>Software Engineer</div>
        </div>
      </div>

      {/* Lista de Opções do Menu */}
      <ul className="tree-view" style={{ margin: 0, border: 'none', background: 'transparent', padding: '5px' }}>
        <a href="https://github.com/SecreTavin" target="_blank" style={{ textDecoration: 'none', color: 'black' }}>
          <li style={{ padding: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img src="https://win98icons.alexmeub.com/icons/png/world-1.png" alt="GitHub" style={{ width: '16px', height: '16px' }} />
            Meu Perfil no GitHub
          </li>
        </a>
        <a href="https://www.linkedin.com/in/octavio-prazeres/" target="_blank" style={{ textDecoration: 'none', color: 'black' }}>
          <li style={{ padding: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img src="https://win98icons.alexmeub.com/icons/png/recycle_bin_full-0.png" alt="LinkedIn" style={{ width: '16px', height: '16px' }} />
            Conectar no LinkedIn
          </li>
        </a>
        
        <hr style={{ margin: '5px 0' }}/>
        
        {/* 3. COLOCAMOS O "onClick" AQUI PARA O BOTÃO FUNCIONAR */}
        <li onClick={onShutdown} style={{ padding: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 'bold' }}>
          <img src="https://win98icons.alexmeub.com/icons/png/shut_down_cool-3.png" alt="Desligar" style={{ width: '16px', height: '16px' }} />
          Desligar Sistema...
        </li>
      </ul>

    </div>
  );
}