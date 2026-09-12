export interface PopupConteudo {
  titulo: string;
  icone: string;
  corBarra: string;
  corFundo: string;
  mensagem: string;
  botao: string;
}

export const ANUNCIOS: PopupConteudo[] = [
  {
    titulo: "PARABÉNS!!!",
    icone: "🎉",
    corBarra: "#008000",
    corFundo: "#ffff99",
    mensagem: "Você é o visitante de número 1.000.000!\nResgate seu prêmio agora!",
    botao: "🎁 RESGATAR PRÊMIO",
  },
  {
    titulo: "Oportunidade Única",
    icone: "💰",
    corBarra: "#800080",
    corFundo: "#e6ccff",
    mensagem: "Trabalhe 2h por dia em casa e ganhe até R$5.000/mês!",
    botao: "QUERO GANHAR",
  },
  {
    titulo: "Nova Mensagem",
    icone: "📧",
    corBarra: "#000080",
    corFundo: "#cce5ff",
    mensagem: "Você tem 1 nova mensagem no Mensageiro Instantâneo!",
    botao: "ABRIR MENSAGEM",
  },
  {
    titulo: "Cavalo-Malhado Toolbar",
    icone: "🐴",
    corBarra: "#804000",
    corFundo: "#ffe0b3",
    mensagem: "Instale a barra de ferramentas mais rápida da internet!",
    botao: "INSTALAR AGORA",
  },
  {
    titulo: "Roleta da Sorte",
    icone: "🎰",
    corBarra: "#cc0000",
    corFundo: "#ffcccc",
    mensagem: "Gire a roleta e ganhe um prêmio GRÁTIS!",
    botao: "GIRAR AGORA",
  },
  {
    titulo: "TurboClean Pro",
    icone: "💿",
    corBarra: "#404040",
    corFundo: "#e0e0e0",
    mensagem: "Seu PC está 98% mais lento que o normal!",
    botao: "BAIXAR GRÁTIS",
  },
];

export const VIRUS: PopupConteudo[] = [
  {
    titulo: "VÍRUS DETECTADO",
    icone: "🦠",
    corBarra: "#990000",
    corFundo: "#ffcccc",
    mensagem: "W32.CascataDoTerror encontrado em C:\\System32.",
    botao: "REMOVER AGORA",
  },
  {
    titulo: "ERRO CRÍTICO",
    icone: "⚠️",
    corBarra: "#996600",
    corFundo: "#fff0cc",
    mensagem: "system.dll corrompido. Reinicie imediatamente.",
    botao: "REINICIAR",
  },
  {
    titulo: "SISTEMA INFECTADO",
    icone: "💀",
    corBarra: "#000000",
    corFundo: "#d9d9d9",
    mensagem: "847 ameaças encontradas. Quarentena falhou.",
    botao: "ESCANEAR",
  },
  {
    titulo: "ACESSO NÃO AUTORIZADO",
    icone: "🔓",
    corBarra: "#990099",
    corFundo: "#f0ccff",
    mensagem: "Alguém está controlando seu mouse remotamente.",
    botao: "BLOQUEAR",
  },
  {
    titulo: "MEMÓRIA CRÍTICA",
    icone: "📉",
    corBarra: "#333333",
    corFundo: "#e6e6e6",
    mensagem: "RAM disponível: -12%. Isso não deveria ser possível.",
    botao: "LIBERAR RAM",
  },
];
