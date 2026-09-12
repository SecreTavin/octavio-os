"use client";

import { useEffect, useRef, useState } from "react";
import Taskbar from "../components/taskbar";
import DesktopIcon from "../components/DesktopIcon";
import WindowBox from "../components/WindowBox";
import BSOD from "../components/Bsod";
import BootScreen from "../components/BootScreen";
import ShutdownScreen from "../components/ShutdownScreen";
import LoginScreen from "../components/LoginScreen";
import Minesweeper from "../components/Minesweeper";
import AdPopup from "../components/AdPopup";
import { ANUNCIOS, VIRUS, type PopupConteudo } from "../components/popupConteudos";

interface PopupInstancia {
  id: number;
  x: number;
  y: number;
  conteudo: PopupConteudo;
  tipo: "anuncio" | "virus";
}

const REPLICAS_ONDA_VIRUS = 3;

// Posição aleatória na tela, longe da taskbar.
function posicaoAleatoria() {
  return {
    x: 20 + Math.random() * Math.max(0, window.innerWidth - 300),
    y: 20 + Math.random() * Math.max(0, window.innerHeight - 250),
  };
}

export default function Home() {
  const [isBooting, setIsBooting] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoggingOff, setIsLoggingOff] = useState(false);

  const [iconeSelecionado, setIconeSelecionado] = useState<string | null>(null);
  const [janelasAbertas, setJanelasAbertas] = useState<string[]>([]);
  const [focoZIndex, setFocoZIndex] = useState<{ [key: string]: number }>({});
  const [proximoZ, setProximoZ] = useState(100);

  const [popups, setPopups] = useState<PopupInstancia[]>([]);
  const proximoPopupId = useRef(0);
  const replicasVirusRestantes = useRef(0);

  const abrirJanela = (nome: string) => {
    if (!janelasAbertas.includes(nome)) setJanelasAbertas([...janelasAbertas, nome]);
    setFocoZIndex({ ...focoZIndex, [nome]: proximoZ });
    setProximoZ(proximoZ + 1);
    setIconeSelecionado(null);
  };

  const fecharJanela = (nome: string) => {
    setJanelasAbertas(janelasAbertas.filter(j => j !== nome));
    if (nome === "Virus") {
      setPopups([]);
      replicasVirusRestantes.current = 0;
    }
  };

  const trazerParaFrente = (nome: string) => {
    setFocoZIndex({ ...focoZIndex, [nome]: proximoZ });
    setProximoZ(proximoZ + 1);
  };

  const abrirPopup = (conteudo: PopupConteudo, tipo: "anuncio" | "virus") => {
    const { x, y } = posicaoAleatoria();
    setPopups((atual) => [...atual, { id: proximoPopupId.current++, x, y, conteudo, tipo }]);
  };

  const fecharPopup = (id: number, tipo: "anuncio" | "virus") => {
    setPopups((atual) => atual.filter((p) => p.id !== id));
    // Durante a onda de "infecção", fechar um pop-up de vírus pode abrir outro no lugar.
    if (tipo === "virus" && replicasVirusRestantes.current > 0) {
      replicasVirusRestantes.current -= 1;
      setTimeout(() => abrirPopup(VIRUS[Math.floor(Math.random() * VIRUS.length)], "virus"), 400);
    }
  };

  // "Infecção": uma rajada de pop-ups de vírus seguida da tela azul.
  const iniciarInfeccao = () => {
    replicasVirusRestantes.current = REPLICAS_ONDA_VIRUS;
    for (let i = 0; i < 4; i++) {
      setTimeout(() => abrirPopup(VIRUS[Math.floor(Math.random() * VIRUS.length)], "virus"), i * 200);
    }
    setTimeout(() => abrirJanela("Virus"), 2600);
  };

  // Pop-ups de anúncio aparecendo sozinhos de tempos em tempos, como se o sistema já estivesse infectado.
  useEffect(() => {
    if (!isLoggedIn || isLoggingOff) return;
    let cancelado = false;
    let timerId: ReturnType<typeof setTimeout>;

    const agendarProximo = () => {
      const atraso = 25000 + Math.random() * 20000;
      timerId = setTimeout(() => {
        if (cancelado) return;
        setPopups((atual) => {
          if (atual.length >= 2) return atual;
          const { x, y } = posicaoAleatoria();
          return [...atual, { id: proximoPopupId.current++, x, y, conteudo: ANUNCIOS[Math.floor(Math.random() * ANUNCIOS.length)], tipo: "anuncio" }];
        });
        agendarProximo();
      }, atraso);
    };

    agendarProximo();
    return () => { cancelado = true; clearTimeout(timerId); };
  }, [isLoggedIn, isLoggingOff]);

  if (isBooting) return <BootScreen onFinished={() => setIsBooting(false)} />;
  
  /* 2. ROTEADOR DE LOGIN */
  if (!isLoggedIn) return <LoginScreen onLogin={() => setIsLoggedIn(true)} />; 
  
  if (isLoggingOff) return <ShutdownScreen />;

  return (
    <main className="w-full h-screen relative overflow-hidden" onClick={() => setIconeSelecionado(null)}>
      
      {/* 1. ÍCONES DA ÁREA DE TRABALHO */}
      <div style={{ display: 'flex', flexDirection: 'column', padding: '10px', height: 'calc(100vh - 35px)', flexWrap: 'wrap', alignContent: 'flex-start' }}>
        <DesktopIcon imgSrc="https://win98icons.alexmeub.com/icons/png/directory_closed-4.png" label="Meus Projetos" isSelected={iconeSelecionado === "Projetos"} onClick={() => setIconeSelecionado("Projetos")} onDoubleClick={() => abrirJanela("Projetos")} />
        <DesktopIcon imgSrc="https://win98icons.alexmeub.com/icons/png/html-0.png" label="curriculo.html" isSelected={iconeSelecionado === "Currículo"} onClick={() => setIconeSelecionado("Currículo")} onDoubleClick={() => abrirJanela("CurriculoHTML")} />
        <DesktopIcon imgSrc="https://win98icons.alexmeub.com/icons/png/msg_error-0.png" label="Nao_Abra.exe" isSelected={iconeSelecionado === "Virus"} onClick={() => setIconeSelecionado("Virus")} onDoubleClick={() => iniciarInfeccao()} />
        <DesktopIcon imgSrc="https://win98icons.alexmeub.com/icons/png/minesweeper-0.png" label="Campo Minado" isSelected={iconeSelecionado === "CampoMinado"} onClick={() => setIconeSelecionado("CampoMinado")} onDoubleClick={() => abrirJanela("CampoMinado")} />
      </div>

      {/* 2. JANELA DO CURRÍCULO */}
      {janelasAbertas.includes("CurriculoHTML") && (
        <WindowBox title="Visualizador - curriculo.html" icon="📄" onClose={() => fecharJanela("CurriculoHTML")} zIndex={focoZIndex["CurriculoHTML"]} onFocus={() => trazerParaFrente("CurriculoHTML")}>
          <iframe src="/curriculo.html" style={{ width: '100%', height: '100%', border: 'none', background: '#fff' }} />
        </WindowBox>
      )}

      {/* 3. JANELA DA PASTA DE PROJETOS */}
      {janelasAbertas.includes("Projetos") && (
        <WindowBox title="Meus Projetos" icon="📁" onClose={() => fecharJanela("Projetos")} zIndex={focoZIndex["Projetos"]} onFocus={() => trazerParaFrente("Projetos")}>
          <div style={{ background: '#dfdfdf', padding: '4px 8px', borderBottom: '1px solid #888', fontSize: '12px', color: 'black' }}>
            Endereço: <b>C:\Users\Visitante\Projetos</b>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', padding: '10px' }} onClick={(e) => { e.stopPropagation(); setIconeSelecionado(null); }}>
            <DesktopIcon imgSrc="https://win98icons.alexmeub.com/icons/png/network_internet_pcs_installer-2.png" label="Monitoramento" isDarkText isSelected={iconeSelecionado === "Monitoramento"} onClick={() => setIconeSelecionado("Monitoramento")} onDoubleClick={() => abrirJanela("MonitoramentoVideo")} />
            <DesktopIcon imgSrc="https://win98icons.alexmeub.com/icons/png/catalog_excl-1.png" label="SystemPulse" isDarkText isSelected={iconeSelecionado === "SystemPulse"} onClick={() => setIconeSelecionado("SystemPulse")} onDoubleClick={() => abrirJanela("SystemPulseVideo")} />
            <DesktopIcon imgSrc="https://win98icons.alexmeub.com/icons/png/joystick-0.png" label="GameDesvio" isDarkText isSelected={iconeSelecionado === "GameDesvio"} onClick={() => setIconeSelecionado("GameDesvio")} onDoubleClick={() => abrirJanela("GameDesvioVideo")} />
            <DesktopIcon imgSrc="https://win98icons.alexmeub.com/icons/png/address_book_pad_users.png" label="CancelOps" isDarkText isSelected={iconeSelecionado === "CancelOps"} onClick={() => setIconeSelecionado("CancelOps")} onDoubleClick={() => abrirJanela("CancelOps")} />
          </div>
        </WindowBox>
      )}

      {/* 4. JANELAS DOS VÍDEOS */}
      {janelasAbertas.includes("MonitoramentoVideo") && (
        <WindowBox title="Sistema de Monitoramento" icon="🖥️" onClose={() => fecharJanela("MonitoramentoVideo")} zIndex={focoZIndex["MonitoramentoVideo"]} onFocus={() => trazerParaFrente("MonitoramentoVideo")}>
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#000' }}>
            <video src="/Monitoramento.mp4" autoPlay loop muted playsInline style={{ flex: 1, minHeight: 0, width: '100%', objectFit: 'contain' }} />
            <div style={{ flexShrink: 0, padding: '8px', background: '#c0c0c0', borderTop: '2px solid #fff', textAlign: 'center' }}>
              <button onClick={() => window.open('https://github.com/SecreTavin/Sistema-de-monitoramento-de-filtros-de-manga-industriais', '_blank')} style={{ fontWeight: 'bold' }}><img src={'https://win98icons.alexmeub.com/icons/png/recycle_bin_full_cool-5.png'} width="14" height="14" alt="GitHub" /> Ver Código no GitHub</button>
            </div>
          </div>
        </WindowBox>
      )}

      {janelasAbertas.includes("SystemPulseVideo") && (
        <WindowBox title="System Pulse" icon="⚙️" onClose={() => fecharJanela("SystemPulseVideo")} defaultPosition={{ x: 100, y: 100 }} zIndex={focoZIndex["SystemPulseVideo"]} onFocus={() => trazerParaFrente("SystemPulseVideo")}>
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#000' }}>
            <video src="/system-pulse.mp4" autoPlay loop muted playsInline style={{ flex: 1, minHeight: 0, width: '100%', objectFit: 'contain' }} />
            <div style={{ flexShrink: 0, padding: '8px', background: '#c0c0c0', borderTop: '2px solid #fff', textAlign: 'center' }}>
              <button onClick={() => window.open('https://github.com/SecreTavin/System-Pulse', '_blank')} style={{ fontWeight: 'bold' }}><img src={'https://win98icons.alexmeub.com/icons/png/recycle_bin_full_cool-5.png'} width="14" height="14" alt="GitHub" /> Ver Código no GitHub</button>
            </div>
          </div>
        </WindowBox>
      )}

      {janelasAbertas.includes("GameDesvioVideo") && (
        <WindowBox title="Game Desvio" icon="🕹️" onClose={() => fecharJanela("GameDesvioVideo")} defaultPosition={{ x: 150, y: 150 }} zIndex={focoZIndex["GameDesvioVideo"]} onFocus={() => trazerParaFrente("GameDesvioVideo")}>
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#000' }}>
            <video src="/gamepython.mp4" autoPlay loop muted playsInline style={{ flex: 1, minHeight: 0, width: '100%', objectFit: 'contain' }} />
            <div style={{ flexShrink: 0, padding: '8px', background: '#c0c0c0', borderTop: '2px solid #fff', textAlign: 'center' }}>
              <button onClick={() => window.open('https://github.com/SecreTavin/Game_desvio_python', '_blank')} style={{ fontWeight: 'bold' }}><img src={'https://win98icons.alexmeub.com/icons/png/recycle_bin_full_cool-5.png'} width="14" height="14" alt="GitHub" /> Ver Código no GitHub</button>
            </div>
          </div>
        </WindowBox>
      )}

      {janelasAbertas.includes("CancelOps") && (
        <WindowBox title="CancelOps" icon="💡" onClose={() => fecharJanela("CancelOps")} zIndex={focoZIndex["CancelOps"]} onFocus={() => trazerParaFrente("CancelOps")}>
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#000' }}>
            <video src="/Cancel-ops.mp4" autoPlay loop muted playsInline style={{ flex: 1, minHeight: 0, width: '100%', objectFit: 'contain' }} />
            <div style={{ flexShrink: 0, padding: '8px', background: '#c0c0c0', borderTop: '2px solid #fff', textAlign: 'center' }}>
              <button onClick={() => window.open('https://github.com/SecreTavin/CancelOps', '_blank')} style={{ fontWeight: 'bold' }}><img src={'https://win98icons.alexmeub.com/icons/png/recycle_bin_full_cool-5.png'} width="14" height="14" alt="GitHub" /> Ver Código no GitHub</button>
            </div>
          </div>
        </WindowBox>
      )}

      {/* 5. TELA AZUL DO BUG */}
      {janelasAbertas.includes("Virus") && <BSOD onClose={() => fecharJanela("Virus")} />}

      {/* 4.5 JANELA DO CAMPO MINADO */}
      {janelasAbertas.includes("CampoMinado") && (
        <WindowBox title="Campo Minado" icon="💣" onClose={() => fecharJanela("CampoMinado")} defaultPosition={{ x: 200, y: 60 }} defaultSize={{ width: 260, height: 400 }} zIndex={focoZIndex["CampoMinado"]} onFocus={() => trazerParaFrente("CampoMinado")}>
          <Minesweeper />
        </WindowBox>
      )}

      {/* 6. BARRA DE TAREFAS */}
      <Taskbar onShutdown={() => setIsLoggingOff(true)} />

      {/* 7. POP-UPS DE ANÚNCIO / VÍRUS */}
      {popups.map((p) => (
        <AdPopup key={p.id} conteudo={p.conteudo} x={p.x} y={p.y} onClose={() => fecharPopup(p.id, p.tipo)} />
      ))}

    </main>
  );
}