'use client';
import Image from 'next/image';

interface HeaderProps {
  onToggleSidebar: () => void;
  sidebarHidden: boolean;
  username?: string;
}

export default function Header({ onToggleSidebar, sidebarHidden, username }: HeaderProps) {
  return (
    <header style={{
      position: 'fixed',
      top: 0, left: 0, right: 0,
      zIndex: 100,
      background: 'rgba(250,250,250,0.94)',
      backdropFilter: 'blur(20px) saturate(180%)',
      WebkitBackdropFilter: 'blur(20px) saturate(180%)',
      borderBottom: '1px solid var(--border-color)',
      height: '56px',
    }}>
      <div style={{
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        paddingLeft: '16px',
        paddingRight: '24px',
      }}>

        {/* Logo — occupies same width as sidebar so chat content stays aligned */}
        <div style={{
          width: '188px',
          minWidth: '188px',
          display: 'flex',
          alignItems: 'center',
          gap: '9px',
          flexShrink: 0,
        }}>
          <div style={{ width: '30px', height: '30px', borderRadius: '9px', overflow: 'hidden', flexShrink: 0 }}>
            <Image src="/images/serene.png" alt="Serene" width={30} height={30} style={{ objectFit: 'contain' }} />
          </div>
          <div>
            <span style={{
              fontFamily: "'DM Serif Display', Georgia, serif",
              fontSize: '17px', fontWeight: 400,
              color: 'var(--text-primary)',
              letterSpacing: '-0.02em', lineHeight: 1,
              display: 'block',
            }}>Serene</span>
            <span style={{
              fontSize: '8px', color: 'var(--text-muted)',
              letterSpacing: '0.14em', textTransform: 'uppercase',
              display: 'block', marginTop: '2px',
            }}>The Living Sanctuary</span>
          </div>
        </div>

        {/* Divider */}
        <div style={{ width: '1px', height: '24px', background: 'var(--border-color)', marginRight: '14px', flexShrink: 0 }} />

        

        <div style={{ flex: 1 }} />

        {/* AI Online pill */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          padding: '5px 13px', borderRadius: '20px',
          background: 'rgba(45,90,61,0.07)',
          border: '1px solid rgba(45,90,61,0.13)',
          fontSize: '11.5px', fontWeight: 500,
          color: 'var(--accent-primary)',
          marginRight: '10px',
        }}>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--success)', animation: 'pulseDot 2s ease-in-out infinite' }} />
          AI Online
        </div>

        {/* User avatar — purely decorative, no dropdown */}
        {username && (
          <div style={{
            width: '30px', height: '30px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #2d5a3d, #4a7c59)',
            color: '#fff', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: '12px', fontWeight: 700,
            flexShrink: 0, cursor: 'default',
          }}>
            {username[0].toUpperCase()}
          </div>
        )}
      </div>
    </header>
  );
}