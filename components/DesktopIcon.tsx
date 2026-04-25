"use client";

interface DesktopIconProps {
  imgSrc?: string; // NOVO: Caminho da imagem
  icon?: string;   // Fallback para emoji
  label: string;
  isSelected: boolean;
  onClick: () => void;
  onDoubleClick: () => void;
  isDarkText?: boolean;
}

export default function DesktopIcon({ imgSrc, icon, label, isSelected, onClick, onDoubleClick, isDarkText = false }: DesktopIconProps) {
  return (
    <div 
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      onDoubleClick={onDoubleClick}
      style={{ width: '85px', display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '10px', cursor: 'pointer', textAlign: 'center' }}
    >
      <div style={{ marginBottom: '4px', filter: isSelected ? 'drop-shadow(0px 0px 5px #000080)' : 'none' }}>
        {imgSrc ? (
          <img src={imgSrc} style={{ width: '45px', height: '45px', objectFit: 'contain' }} alt={label} />
        ) : (
          <span style={{ fontSize: '32px' }}>{icon}</span>
        )}
      </div>
      
      <div style={{ 
        color: isDarkText ? (isSelected ? 'white' : 'black') : 'white', 
        fontSize: '11px', fontWeight: '500',
        textShadow: isDarkText || isSelected ? 'none' : '1px 1px 2px black', 
        background: isSelected ? '#000080' : 'transparent',
        padding: '2px 4px', borderRadius: '2px'
      }}>
        {label}
      </div>
    </div>
  );
}