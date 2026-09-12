"use client";

import { useState, useCallback, useEffect } from "react";

const LINHAS = 9;
const COLUNAS = 9;
const MINAS = 10;

interface Celula {
  temMina: boolean;
  revelada: boolean;
  marcada: boolean;
  minasVizinhas: number;
}

type EstadoJogo = "aguardando" | "jogando" | "ganhou" | "perdeu";

const CORES_NUMEROS: Record<number, string> = {
  1: "#0000FF", 2: "#008000", 3: "#FF0000", 4: "#000080",
  5: "#800000", 6: "#008080", 7: "#000000", 8: "#808080",
};

function criarGradeVazia(): Celula[][] {
  return Array.from({ length: LINHAS }, () =>
    Array.from({ length: COLUNAS }, () => ({
      temMina: false,
      revelada: false,
      marcada: false,
      minasVizinhas: 0,
    }))
  );
}

function vizinhos(linha: number, coluna: number): [number, number][] {
  const resultado: [number, number][] = [];
  for (let dl = -1; dl <= 1; dl++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dl === 0 && dc === 0) continue;
      const l = linha + dl;
      const c = coluna + dc;
      if (l >= 0 && l < LINHAS && c >= 0 && c < COLUNAS) resultado.push([l, c]);
    }
  }
  return resultado;
}

// A primeira jogada nunca pode ser mina: as minas só são sorteadas depois do 1º clique.
function semearMinas(linhaSegura: number, colunaSegura: number): Celula[][] {
  const grade = criarGradeVazia();
  const proibidas = new Set([
    `${linhaSegura},${colunaSegura}`,
    ...vizinhos(linhaSegura, colunaSegura).map(([l, c]) => `${l},${c}`),
  ]);

  let colocadas = 0;
  while (colocadas < MINAS) {
    const l = Math.floor(Math.random() * LINHAS);
    const c = Math.floor(Math.random() * COLUNAS);
    if (proibidas.has(`${l},${c}`) || grade[l][c].temMina) continue;
    grade[l][c].temMina = true;
    colocadas++;
  }

  for (let l = 0; l < LINHAS; l++) {
    for (let c = 0; c < COLUNAS; c++) {
      if (!grade[l][c].temMina) {
        grade[l][c].minasVizinhas = vizinhos(l, c).filter(([vl, vc]) => grade[vl][vc].temMina).length;
      }
    }
  }
  return grade;
}

function revelarEmCascata(grade: Celula[][], linha: number, coluna: number) {
  const pilha: [number, number][] = [[linha, coluna]];
  while (pilha.length > 0) {
    const [l, c] = pilha.pop()!;
    const celula = grade[l][c];
    if (celula.revelada || celula.marcada) continue;
    celula.revelada = true;
    if (celula.minasVizinhas === 0 && !celula.temMina) {
      for (const [vl, vc] of vizinhos(l, c)) {
        if (!grade[vl][vc].revelada && !grade[vl][vc].marcada) pilha.push([vl, vc]);
      }
    }
  }
}

function clonarGrade(grade: Celula[][]): Celula[][] {
  return grade.map((linha) => linha.map((celula) => ({ ...celula })));
}

function Display({ valor }: { valor: number }) {
  const texto = Math.max(0, Math.min(999, valor)).toString().padStart(3, "0");
  return (
    <div
      style={{
        background: "#000", color: "#FF0000", fontFamily: "'Courier New', monospace",
        fontWeight: "bold", fontSize: "18px", padding: "2px 6px", letterSpacing: "2px",
        border: "1px inset #7b7b7b", minWidth: "42px", textAlign: "center", boxSizing: "border-box",
      }}
    >
      {texto}
    </div>
  );
}

export default function Minesweeper() {
  const [grade, setGrade] = useState<Celula[][]>(criarGradeVazia);
  const [estado, setEstado] = useState<EstadoJogo>("aguardando");
  const [segundos, setSegundos] = useState(0);
  const [modoBandeira, setModoBandeira] = useState(false);
  const [celulaExplodida, setCelulaExplodida] = useState<[number, number] | null>(null);

  useEffect(() => {
    if (estado !== "jogando") return;
    const intervalo = setInterval(() => setSegundos((s) => Math.min(s + 1, 999)), 1000);
    return () => clearInterval(intervalo);
  }, [estado]);

  const minasRestantes = MINAS - grade.flat().filter((c) => c.marcada).length;
  const jogoEncerrado = estado === "ganhou" || estado === "perdeu";

  const reiniciar = useCallback(() => {
    setGrade(criarGradeVazia());
    setEstado("aguardando");
    setSegundos(0);
    setCelulaExplodida(null);
  }, []);

  const alternarBandeira = (linha: number, coluna: number) => {
    if (jogoEncerrado || grade[linha][coluna].revelada) return;
    const novaGrade = clonarGrade(grade);
    novaGrade[linha][coluna].marcada = !novaGrade[linha][coluna].marcada;
    setGrade(novaGrade);
  };

  const revelarCelula = (linha: number, coluna: number) => {
    if (jogoEncerrado) return;

    if (modoBandeira) {
      alternarBandeira(linha, coluna);
      return;
    }

    if (grade[linha][coluna].marcada || grade[linha][coluna].revelada) return;

    const novaGrade = estado === "aguardando" ? semearMinas(linha, coluna) : clonarGrade(grade);
    let novoEstado: EstadoJogo = "jogando";

    if (novaGrade[linha][coluna].temMina) {
      novaGrade.forEach((linhaCel) => linhaCel.forEach((cel) => { if (cel.temMina) cel.revelada = true; }));
      setCelulaExplodida([linha, coluna]);
      novoEstado = "perdeu";
    } else {
      revelarEmCascata(novaGrade, linha, coluna);
      const totalSeguras = LINHAS * COLUNAS - MINAS;
      const reveladasSeguras = novaGrade.flat().filter((c) => c.revelada && !c.temMina).length;
      if (reveladasSeguras === totalSeguras) novoEstado = "ganhou";
    }

    setGrade(novaGrade);
    setEstado(novoEstado);
  };

  const rosto = estado === "perdeu" ? "😵" : estado === "ganhou" ? "😎" : "🙂";

  return (
    <div style={{ background: "#c0c0c0", padding: "10px", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", userSelect: "none", boxSizing: "border-box" }}>
      <div style={{ border: "2px inset #c0c0c0", padding: "6px 8px", display: "flex", alignItems: "center", justifyContent: "space-between", width: `${COLUNAS * 24 + 8}px`, boxSizing: "border-box" }}>
        <Display valor={minasRestantes} />
        <button onClick={reiniciar} style={{ width: "28px", height: "28px", minWidth: 0, minHeight: 0, padding: 0, fontSize: "16px", border: "2px outset #c0c0c0", background: "#c0c0c0", cursor: "pointer" }}>
          {rosto}
        </button>
        <Display valor={segundos} />
      </div>

      <div style={{ border: "2px inset #c0c0c0", padding: "4px", background: "#7b7b7b" }}>
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${COLUNAS}, 24px)` }}>
          {grade.map((linhaCel, l) =>
            linhaCel.map((celula, c) => (
              <button
                key={`${l}-${c}`}
                onClick={() => revelarCelula(l, c)}
                onContextMenu={(e) => { e.preventDefault(); alternarBandeira(l, c); }}
                style={{
                  width: "24px", height: "24px", minWidth: 0, minHeight: 0, padding: 0, margin: 0,
                  fontSize: "12px", fontWeight: "bold", lineHeight: "24px",
                  fontFamily: "'Courier New', monospace",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: celulaExplodida?.[0] === l && celulaExplodida?.[1] === c ? "#FF0000" : "#c0c0c0",
                  border: celula.revelada ? "1px solid #7b7b7b" : "2px outset #c0c0c0",
                  cursor: jogoEncerrado ? "default" : "pointer",
                  color: celula.revelada && !celula.temMina ? CORES_NUMEROS[celula.minasVizinhas] : undefined,
                }}
              >
                {celula.revelada
                  ? celula.temMina ? "💣" : celula.minasVizinhas > 0 ? celula.minasVizinhas : ""
                  : celula.marcada ? "🚩" : ""}
              </button>
            ))
          )}
        </div>
      </div>

      <button
        onClick={() => setModoBandeira(!modoBandeira)}
        style={{ fontSize: "11px", padding: "4px 8px", border: modoBandeira ? "2px inset #c0c0c0" : "2px outset #c0c0c0", background: "#c0c0c0", cursor: "pointer" }}
      >
        🚩 Modo Bandeira {modoBandeira ? "(ativo)" : ""}
      </button>

      <p style={{ margin: 0, fontSize: "11px", minHeight: "14px", fontWeight: "bold" }}>
        {estado === "ganhou" && "Você venceu! 🎉"}
        {estado === "perdeu" && "Boom! Tente novamente."}
      </p>
    </div>
  );
}
