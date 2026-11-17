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
import ProjectCard from "../components/ProjectCard";
import { ANUNCIOS, VIRUS, type PopupConteudo } from "../components/popupConteudos";

interface PopupInstancia {
  id: number;
  x: number;
  y: number;
  conteudo: PopupConteudo;
  tipo: "anuncio" | "virus";
}

const REPLICAS_ONDA_VIRUS = 3;
const URL_METAL_RUSH = "https://metal-rush.secretavin.workers.dev";

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

  // Durante uma partida de Metal Rush os anúncios ficam suspensos: o jogo não pausa sozinho.
  const jogandoMetalRush = janelasAbertas.includes("MetalRush");

  // Pop-ups de anúncio aparecendo sozinhos de tempos em tempos, como se o sistema já estivesse infectado.
  useEffect(() => {
    if (!isLoggedIn || isLoggingOff || jogandoMetalRush) return;
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
  }, [isLoggedIn, isLoggingOff, jogandoMetalRush]);

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
            <DesktopIcon imgSrc="https://win98icons.alexmeub.com/icons/png/write_file-1.png" label="ConversorDocs" isDarkText isSelected={iconeSelecionado === "ConversorDocs"} onClick={() => setIconeSelecionado("ConversorDocs")} onDoubleClick={() => abrirJanela("ConversorDocs")} />
            <DesktopIcon imgSrc="https://win98icons.alexmeub.com/icons/png/joystick-2.png" label="MetalRush" isDarkText isSelected={iconeSelecionado === "MetalRush"} onClick={() => setIconeSelecionado("MetalRush")} onDoubleClick={() => abrirJanela("MetalRush")} />
            <DesktopIcon imgSrc="https://win98icons.alexmeub.com/icons/png/users-1.png" label="EuDuvido" isDarkText isSelected={iconeSelecionado === "EuDuvido"} onClick={() => setIconeSelecionado("EuDuvido")} onDoubleClick={() => abrirJanela("EuDuvido")} />
            <DesktopIcon imgSrc="https://win98icons.alexmeub.com/icons/png/tree-0.png" label="Gardenia" isDarkText isSelected={iconeSelecionado === "Gardenia"} onClick={() => setIconeSelecionado("Gardenia")} onDoubleClick={() => abrirJanela("Gardenia")} />
            <DesktopIcon imgSrc="https://win98icons.alexmeub.com/icons/png/chart1-0.png" label="AcidentesPRF" isDarkText isSelected={iconeSelecionado === "AcidentesPRF"} onClick={() => setIconeSelecionado("AcidentesPRF")} onDoubleClick={() => abrirJanela("AcidentesPRF")} />
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

      {/* 4.6 CARDS DE PROJETO (projetos sem vídeo de demo) */}
      {janelasAbertas.includes("ConversorDocs") && (
        <WindowBox title="Conversor de Documentos" icon="🔄" onClose={() => fecharJanela("ConversorDocs")} defaultPosition={{ x: 120, y: 70 }} defaultSize={{ width: 420, height: 500 }} zIndex={focoZIndex["ConversorDocs"]} onFocus={() => trazerParaFrente("ConversorDocs")}>
          <ProjectCard
            icone="https://win98icons.alexmeub.com/icons/png/write_file-1.png"
            titulo="Conversor de Documentos"
            subtitulo="App desktop · Python"
            descricao="Ferramenta 100% offline pra converter e manipular arquivos sem depender de sites como o iLovePDF — nenhum documento sai do computador, o que importa quando o arquivo tem dado sensível."
            tituloDestaques="O que faz:"
            destaques={[
              "PDF ⇄ Word, Excel e PowerPoint (via LibreOffice headless)",
              "Imagens ⇄ PDF — juntar em PDF ou extrair páginas como imagem",
              "Juntar, dividir, comprimir e rotacionar PDFs",
              "Proteger/remover senha e adicionar marca d'água",
              "OCR em PDFs escaneados (gera PDF pesquisável ou Word)",
              "Conversão entre JPG, PNG, WEBP e BMP",
              "Arrastar e soltar, com conversão em lote",
            ]}
            stack="Python · CustomTkinter · LibreOffice headless · Tesseract OCR"
            links={[{ rotulo: "Ver Código no GitHub", url: "https://github.com/SecreTavin/document-converter", tipo: "github" }]}
          />
        </WindowBox>
      )}

      {janelasAbertas.includes("EuDuvido") && (
        <WindowBox title="Eu Duvido!" icon="🤝" onClose={() => fecharJanela("EuDuvido")} defaultPosition={{ x: 140, y: 60 }} defaultSize={{ width: 440, height: 480 }} zIndex={focoZIndex["EuDuvido"]} onFocus={() => trazerParaFrente("EuDuvido")}>
          <ProjectCard
            icone="https://win98icons.alexmeub.com/icons/png/users-1.png"
            titulo="Eu Duvido!"
            subtitulo="Web app · projeto acadêmico em grupo (A3 de Banco de Dados)"
            descricao="Plataforma de desafios entre amigos: alguém propõe um desafio, o grupo coloca CP (a moeda do app) no pote e, quando a prova chega, um júri de amigos vota se ela vale. A nota da disciplina vem do banco — modelagem, constraints, transações e consultas."
            tituloDestaques="Destaques do banco:"
            destaques={[
              "Apuração do júri e liquidação do pote numa única transação, dentro de procedure PostgreSQL",
              "Ledger de CP append-only: trigger bloqueia UPDATE/DELETE, estorno é lançamento novo",
              "Views de reconciliação que precisam ficar sempre vazias — se retornam linha, há bug contábil",
              "CQRS: EF Core escreve, Dapper lê com SQL escrito à mão",
              "Votação ao vivo via SignalR, disparada só depois do commit",
              "Moderação dos desafios por IA (Groq)",
            ]}
            stack=".NET 10 · PostgreSQL · React + TypeScript · SignalR · MinIO · Docker"
            links={[
              { rotulo: "Abrir o Site", url: "https://euduvido.falveshub.com", tipo: "site" },
              { rotulo: "Ver Código no GitHub", url: "https://github.com/SecreTavin/A3-banco-de-dados", tipo: "github" },
            ]}
          />
        </WindowBox>
      )}

      {janelasAbertas.includes("Gardenia") && (
        <WindowBox title="Gardenia" icon="🗡️" onClose={() => fecharJanela("Gardenia")} defaultPosition={{ x: 160, y: 80 }} defaultSize={{ width: 430, height: 450 }} zIndex={focoZIndex["Gardenia"]} onFocus={() => trazerParaFrente("Gardenia")}>
          <ProjectCard
            icone="https://win98icons.alexmeub.com/icons/png/tree-0.png"
            titulo="Gardenia"
            subtitulo="Jogo 3D · Godot 4.7"
            selo="🚧 Em desenvolvimento · repositório privado"
            descricao="Soulslike 3D com estética de PS2. Uma camponesa acorda meio vampira no fundo de um castelo e luta pra voltar ao vilarejo — só pra descobrir que os monstros são o próprio povo. É o meu primeiro jogo."
            tituloDestaques="Já implementado:"
            destaques={[
              "Combate de postura estilo Sekiro: atacar gasta postura e o bloqueio converte dano de vida em postura",
              "Parry com janela de 0,15 s e penalidade pra quem tenta no chute",
              "Recurso de Sangue com recuperação no modelo Dark Souls (uma chance só)",
              "Mapa das Criptas e o primeiro chefe, O Coveiro",
              "Save e menus",
              "Renderização interna em 854×480 pra segurar 60 fps num MacBook Air M1",
            ]}
            stack="Godot 4.7 · GDScript · Jolt Physics · GUT · Blender"
          />
        </WindowBox>
      )}

      {janelasAbertas.includes("AcidentesPRF") && (
        <WindowBox title="Acidentes em Rodovias Federais" icon="📊" onClose={() => fecharJanela("AcidentesPRF")} defaultPosition={{ x: 180, y: 70 }} defaultSize={{ width: 440, height: 480 }} zIndex={focoZIndex["AcidentesPRF"]} onFocus={() => trazerParaFrente("AcidentesPRF")}>
          <ProjectCard
            icone="https://win98icons.alexmeub.com/icons/png/chart1-0.png"
            titulo="Acidentes em Rodovias Federais"
            subtitulo="Machine Learning · Python"
            descricao="Risco de morte em acidentes e previsão do volume semanal, só com dados abertos da PRF: 687 mil acidentes, de 2017 a set/2026. É a v3, refeita do zero depois que descobri que o AUC de 0,98 da versão anterior vinha de vazamento de dados."
            tituloDestaques="Como foi feito:"
            destaques={[
              "Só features disponíveis no momento em que o acidente é comunicado — colunas proibidas checadas por teste",
              "Divisão temporal: treino 2017–2023, limiar escolhido em 2024, teste em 2025–2026",
              "PR-AUC de 0,342 contra 0,072 do acaso, estável entre 2025 e 2026",
              "Previsão semanal comparada com \"repetir a semana passada\" em 52 backtests",
              "Diagnóstico do vazamento da v2 documentado no repositório",
            ]}
            stack="Python · pandas · scikit-learn · Parquet · pytest · uv"
            links={[{ rotulo: "Ver Código (v3) no GitHub", url: "https://github.com/SecreTavin/analise-preditiva-acidentes-transito-V2/tree/v3-refacao", tipo: "github" }]}
          />
        </WindowBox>
      )}

      {/* 4.7 METAL RUSH — jogável dentro da janela */}
      {janelasAbertas.includes("MetalRush") && (
        <WindowBox title="Metal Rush" icon="🎮" onClose={() => fecharJanela("MetalRush")} defaultPosition={{ x: 90, y: 40 }} defaultSize={{ width: 660, height: 450 }} zIndex={focoZIndex["MetalRush"]} onFocus={() => trazerParaFrente("MetalRush")}>
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#000' }}>
            <iframe src={URL_METAL_RUSH} title="Metal Rush" allow="autoplay; fullscreen; gamepad" style={{ flex: 1, minHeight: 0, width: '100%', border: 'none' }} />
            <div style={{ flexShrink: 0, padding: '6px 8px', background: '#c0c0c0', borderTop: '2px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '11px' }}>Clique no jogo · Setas/WASD movem · J atira · K pula</span>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button onClick={() => window.open(URL_METAL_RUSH, '_blank')} style={{ fontWeight: 'bold' }}><img src={'https://win98icons.alexmeub.com/icons/png/world-1.png'} width="14" height="14" alt="" /> Abrir em Nova Aba</button>
                <button onClick={() => window.open('https://github.com/SecreTavin/metal-rush', '_blank')} style={{ fontWeight: 'bold' }}><img src={'https://win98icons.alexmeub.com/icons/png/recycle_bin_full_cool-5.png'} width="14" height="14" alt="GitHub" /> Ver Código no GitHub</button>
              </div>
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