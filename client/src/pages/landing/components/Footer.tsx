import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer
      className="px-6 md:px-10 py-12"
      style={{
        borderTop: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Main row */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          {/* Logo + tagline */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2.5">
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: '#7C3AED', boxShadow: '0 0 6px rgba(124,58,237,0.6)' }}
              />
              <span
                className="font-bold text-white"
                style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 16 }}
              >
                CITE
              </span>
            </div>
            <p
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: 12,
                color: 'rgba(255,255,255,0.3)',
                maxWidth: 240,
                lineHeight: 1.5,
              }}
            >
              Cognitive &amp; Interpersonal Translation Engine
            </p>
          </div>

          {/* Center links */}
          <div className="flex items-center gap-6">
            {['Privacy', 'Terms', 'Contact'].map((label) => (
              <a
                key={label}
                href="#"
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: 13,
                  color: 'rgba(255,255,255,0.4)',
                  textDecoration: 'none',
                  transition: 'color 0.15s',
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.8)')}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.4)')}
              >
                {label}
              </a>
            ))}
          </div>

          {/* Right: Claude attribution */}
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-full border"
            style={{
              background: 'rgba(255,255,255,0.03)',
              borderColor: 'rgba(255,255,255,0.08)',
            }}
          >
            <span style={{ fontSize: 14 }}>🏛️</span>
            <span
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: 12,
                color: 'rgba(255,255,255,0.4)',
              }}
            >
              Built by{' '}
              <a
                href="https://houseofnamus.com"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#A78BFA', textDecoration: 'none' }}
              >
                House of Namus
              </a>
            </span>
          </div>
        </div>

        {/* Bottom row */}
        <div
          className="mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3"
          style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}
        >
          <p
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 12,
              color: 'rgba(255,255,255,0.25)',
            }}
          >
            © 2025 CITE. All rights reserved.
          </p>
          <div className="flex items-center gap-1.5">
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: '#10B981', boxShadow: '0 0 4px rgba(16,185,129,0.6)' }}
            />
            <span
              style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: 10,
                color: 'rgba(255,255,255,0.25)',
                letterSpacing: '0.06em',
              }}
            >
              All systems operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
