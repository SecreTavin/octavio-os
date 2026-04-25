"use client";

import { useRef } from "react";

interface ProjectVideoProps {
  title: string;
  src: string;
}

export default function ProjectVideo({ title, src }: ProjectVideoProps) {
  // O useRef é a forma do React "agarrar" o elemento de vídeo no HTML
  const videoRef = useRef<HTMLVideoElement>(null);

  // Função para forçar a Tela Cheia cruzando compatibilidade de navegadores
  const toggleFullScreen = () => {
    const video = videoRef.current;
    if (video) {
      if (video.requestFullscreen) {
        video.requestFullscreen();
      } else if ((video as any).webkitRequestFullscreen) { /* Safari */
        (video as any).webkitRequestFullscreen();
      }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '20px', width: '100%', border: '2px solid #dfdfdf', borderRightColor: '#0a0a0a', borderBottomColor: '#0a0a0a', background: '#c0c0c0', padding: '5px' }}>
      
      {/* Título do Projeto */}
      <div style={{ fontWeight: 'bold', marginBottom: '5px', background: '#000080', color: 'white', padding: '4px 8px', display: 'flex', alignItems: 'center', gap: '5px' }}>
        <span>🎥</span> {title}
      </div>

      {/* Container do Vídeo */}
      <div style={{ position: 'relative', width: '100%', border: 'inset 2px', background: 'black' }}>
        <video
          ref={videoRef}
          src={src}
          autoPlay
          loop
          muted
          playsInline
          style={{ width: '100%', display: 'block' }}
        />
      </div>

      {/* Botão de Tela Cheia clássico */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '5px' }}>
        <button onClick={toggleFullScreen} style={{ fontWeight: 'bold' }}>
          ⛶ Tela Cheia
        </button>
      </div>

    </div>
  );
}