"use client";

import { useState } from "react";
import type { PopupConteudo } from "./popupConteudos";

const FUGAS_MAXIMAS = 2;

interface AdPopupProps {
  conteudo: PopupConteudo;
  x: number;
  y: number;
  onClose: () => void;
}

export default function AdPopup({ conteudo, x, y, onClose }: AdPopupProps) {
  const [fugas, setFugas] = useState(0);
  const [posXBotao, setPosXBotao] = useState(88);

  // O botão de fechar foge do clique algumas vezes antes de deixar fechar de verdade.
  const aoTentarFechar = () => {
    if (fugas < FUGAS_MAXIMAS) {
      let novoX = 10 + Math.random() * 78;
      while (Math.abs(novoX - posXBotao) < 25) novoX = 10 + Math.random() * 78;
      setPosXBotao(novoX);
      setFugas((f) => f + 1);
      return;
    }
    onClose();
  };

  return (
    <div
      style={{
        position: "fixed", left: x, top: y, width: "260px",
        border: "2px solid #000", boxShadow: "3px 3px 0 rgba(0,0,0,0.6)",
        zIndex: 500000, fontFamily: "Tahoma, Arial, sans-serif", userSelect: "none",
      }}
    >
      <div style={{ position: "relative", height: "22px", background: conteudo.corBarra, display: "flex", alignItems: "center", padding: "0 24px 0 4px", overflow: "hidden", boxSizing: "border-box" }}>
        <span style={{ color: "#fff", fontSize: "11px", fontWeight: "bold", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {conteudo.icone} {conteudo.titulo}
        </span>
        <button
          onClick={aoTentarFechar}
          aria-label="Fechar"
          style={{
            position: "absolute", left: `${posXBotao}%`, top: "2px", transform: "translateX(-50%)",
            width: "18px", height: "18px", minWidth: 0, minHeight: 0, padding: 0,
            fontSize: "11px", fontWeight: "bold", lineHeight: "16px",
            background: "#c0c0c0", border: "2px outset #c0c0c0", cursor: "pointer",
            transition: "left 0.15s ease",
          }}
        >
          ✕
        </button>
      </div>
      <div style={{ background: conteudo.corFundo, padding: "14px 12px", textAlign: "center" }}>
        <p style={{ margin: "0 0 10px 0", fontSize: "13px", fontWeight: "bold", color: "#000", whiteSpace: "pre-line" }}>
          {conteudo.mensagem}
        </p>
        <button
          style={{
            padding: "6px 14px", fontWeight: "bold", fontSize: "12px",
            background: "linear-gradient(#fff566, #ffd500)", border: "2px outset #ffd500",
            cursor: "pointer", animation: "piscar-anuncio 0.9s infinite",
          }}
        >
          {conteudo.botao}
        </button>
      </div>
    </div>
  );
}
