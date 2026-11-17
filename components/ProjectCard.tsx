"use client";

const ICONE_GITHUB = "https://win98icons.alexmeub.com/icons/png/recycle_bin_full_cool-5.png";
const ICONE_SITE = "https://win98icons.alexmeub.com/icons/png/world-1.png";

export interface LinkProjeto {
  rotulo: string;
  url: string;
  tipo: "github" | "site";
}

interface ProjectCardProps {
  icone: string;
  titulo: string;
  subtitulo: string;
  selo?: string;
  descricao: string;
  tituloDestaques: string;
  destaques: string[];
  stack: string;
  links?: LinkProjeto[];
}

export default function ProjectCard({ icone, titulo, subtitulo, selo, descricao, tituloDestaques, destaques, stack, links = [] }: ProjectCardProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#fff', padding: '16px', boxSizing: 'border-box', overflow: 'auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
        <img src={icone} width="32" height="32" alt={titulo} />
        <div>
          <div style={{ fontWeight: 'bold', fontSize: '15px' }}>{titulo}</div>
          <div style={{ fontSize: '11px', color: '#555' }}>{subtitulo}</div>
        </div>
      </div>

      {selo && (
        <div style={{ alignSelf: 'flex-start', background: '#ffffcc', border: '1px solid #c9b800', fontSize: '11px', fontWeight: 'bold', padding: '2px 8px', marginBottom: '12px' }}>
          {selo}
        </div>
      )}

      <p style={{ fontSize: '12px', lineHeight: '1.5', margin: '0 0 12px 0' }}>{descricao}</p>

      <div style={{ background: '#f0f0f0', border: '1px solid #ccc', padding: '10px 12px', marginBottom: '12px' }}>
        <div style={{ fontWeight: 'bold', fontSize: '11px', marginBottom: '6px' }}>{tituloDestaques}</div>
        <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '11px', lineHeight: '1.6' }}>
          {destaques.map((d) => <li key={d}>{d}</li>)}
        </ul>
      </div>

      <p style={{ fontSize: '11px', color: '#555', margin: '0 0 16px 0' }}>
        <b>Stack:</b> {stack}
      </p>

      {links.length > 0 && (
        <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {links.map((l) => (
            <button key={l.url} onClick={() => window.open(l.url, '_blank')} style={{ fontWeight: 'bold' }}>
              <img src={l.tipo === "github" ? ICONE_GITHUB : ICONE_SITE} width="14" height="14" alt="" /> {l.rotulo}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
