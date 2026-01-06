// app/suscribite/page.tsx
'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

const SUBSTACK_URL = 'https://substack.com/@fundacionprobuenosaires?utm_source=global-search'; // <- reemplaza
const DELAY_SECONDS = 15; // <- ajustar si querés 10/20

export default function SuscribitePage(): React.ReactElement {
  const [secondsLeft, setSecondsLeft] = useState<number>(DELAY_SECONDS);
  const [tone, setTone] = useState<'institucional' | 'periodistico'>('institucional');
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    // Bloqueo scroll del body mientras está el overlay
    const prevOverflow = document.body.style.overflow || '';
    document.body.style.overflow = 'hidden';

    // Inicia contador
    timerRef.current = window.setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          if (timerRef.current) window.clearInterval(timerRef.current);
          window.location.href = SUBSTACK_URL;
          return 0;
        }
        return s - 1;
      });
    }, 1000);

    // evento analytics opcional
    if ((window as any).dataLayer) (window as any).dataLayer.push({ event: 'newsletter_interstitial_shown' });

    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
      // restaura scroll
      document.body.style.overflow = prevOverflow;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const goNow = () => {
    if (timerRef.current) window.clearInterval(timerRef.current);
    if ((window as any).dataLayer) (window as any).dataLayer.push({ event: 'newsletter_interstitial_click_now' });
    window.location.href = SUBSTACK_URL;
  };

  const progress = Math.round(((DELAY_SECONDS - secondsLeft) / DELAY_SECONDS) * 100);

  const texts = {
    institucional: {
      title: 'Bienvenido al canal de difusión de Radio Empresarial',
      lead:
        'Nuestro Newsletter es el espacio donde compartimos análisis, agenda y novedades pensadas para el sector PYME. Suscribiéndote, apoyás directamente el trabajo de la fundación y nos ayudás a mantener este servicio de difusión.',
      cta: 'Serás redirigido en breve a la página de suscripción oficial.',
    },
    periodistico: {
      title: 'Suscribite al Newsletter de Radio Empresarial',
      lead:
        'Recibí lo último: crónicas, entrevistas, reportes y material exclusivo sobre el ecosistema emprendedor. Nuestro boletín es la forma más directa de no perderte nada.',
      cta: 'En unos segundos te llevamos a la página de suscripción.',
    },
  } as const;

  return (
    // OVERLAY FIJO que cubre TODO el viewport
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 999999, // muy por encima de la navbar/footer
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(180deg, rgba(2,6,23,0.95), rgba(4,8,20,0.92))',
        padding: 24,
      }}
    >
      {/* Contenedor centrado (card) */}
      <div
        style={{
          width: '100%',
          maxWidth: 1100,
          borderRadius: 16,
          padding: 22,
          boxSizing: 'border-box',
          background: 'linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))',
          border: '1px solid rgba(255,255,255,0.04)',
          color: '#f8fafc',
          boxShadow: '0 12px 40px rgba(2,6,23,0.7)',
        }}
      >
        {/* CABECERA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 12,
              background: '#ef4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontWeight: 800,
              fontSize: 18,
            }}
          >
            RE
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700 }}>Radio Empresarial</div>
            <div style={{ fontSize: 12, opacity: 0.9 }}>Canal de difusión oficial</div>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
            <div style={{ fontSize: 12, padding: '6px 10px', borderRadius: 999, background: 'rgba(0,0,0,0.35)' }}>
              Newsletter
            </div>
            <div style={{ fontSize: 12, padding: '6px 10px', borderRadius: 999, background: '#ef4444', color: 'white' }}>
              Suscribite
            </div>
          </div>
        </div>

        {/* BODY: texto + loader */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 24, alignItems: 'center' }}>
          {/* Izquierda: texto y controles */}
          <div>
            <h1 style={{ margin: 0, fontSize: 24, lineHeight: 1.12, fontWeight: 800 }}>{texts[tone].title}</h1>
            <p style={{ marginTop: 12, marginBottom: 12, color: 'rgba(248,250,252,0.9)', lineHeight: 1.6 }}>{texts[tone].lead}</p>
            <p style={{ marginTop: 8, marginBottom: 4, color: 'rgba(248,250,252,0.72)' }}>{texts[tone].cta}</p>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 18 }}>
              <button
                onClick={goNow}
                style={{
                  padding: '10px 18px',
                  borderRadius: 10,
                  background: '#ef4444',
                  color: 'white',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Ir ahora
              </button>

              <Link href="/">
                <button
                  style={{
                    padding: '10px 18px',
                    borderRadius: 10,
                    background: 'transparent',
                    color: 'white',
                    border: '1px solid rgba(255,255,255,0.06)',
                    cursor: 'pointer',
                  }}
                >
                  Volver al sitio
                </button>
              </Link>

              <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ fontSize: 14, minWidth: 36, textAlign: 'right' }}>{secondsLeft}s</div>
                <div style={{ width: 160, height: 10, background: 'rgba(255,255,255,0.06)', borderRadius: 999, overflow: 'hidden' }}>
                  <div style={{ width: `${progress}%`, height: '100%', transition: 'width 220ms linear', background: 'linear-gradient(90deg,#ef4444,#f59e0b)' }} />
                </div>
              </div>
            </div>

            <div style={{ marginTop: 14, display: 'flex', gap: 20, alignItems: 'center' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14 }}>
                <input type="radio" name="tone" checked={tone === 'institucional'} onChange={() => setTone('institucional')} />
                <span>Institucional</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14 }}>
                <input type="radio" name="tone" checked={tone === 'periodistico'} onChange={() => setTone('periodistico')} />
                <span>Periodístico</span>
              </label>
            </div>

            <div style={{ marginTop: 12, fontSize: 13, color: 'rgba(255,255,255,0.75)' }}>
              <strong>Nota:</strong> la redirección se activará automáticamente cuando el contador llegue a cero. Podés ir ahora haciendo clic en <em>Ir ahora</em>.
            </div>
          </div>

          {/* Derecha: animación/loader */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: 300, height: 300, borderRadius: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', background: 'radial-gradient(closest-side, rgba(239,68,68,0.06), rgba(0,0,0,0.18))', border: '1px solid rgba(255,255,255,0.03)' }}>
              <div style={{ position: 'absolute', top: 18, left: 18, width: 52, height: 52, borderRadius: 999, background: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: 20 }}>▶</div>

              <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.92)' }}>
                <div style={{ fontSize: 14, fontWeight: 800 }}>Radio Empresarial</div>
                <div style={{ fontSize: 12, opacity: 0.85 }}>Newsletter · Contenido exclusivo</div>
                <div style={{ marginTop: 36, fontSize: 22, opacity: 0.85, fontWeight: 800 }}>RE</div>
              </div>

              <svg viewBox="0 0 120 40" style={{ position: 'absolute', bottom: 18, left: 18, right: 18, height: 40 }} preserveAspectRatio="none" aria-hidden>
                <g strokeWidth={3} strokeLinecap="round">
                  <line x1="10" y1="25" x2="10" y2="15" stroke="url(#g)" style={{ transformOrigin: 'center bottom', animation: 'eq 1.2s ease-in-out infinite' }} />
                  <line x1="30" y1="25" x2="30" y2="10" stroke="url(#g)" style={{ transformOrigin: 'center bottom', animation: 'eq 1.1s ease-in-out .1s infinite' }} />
                  <line x1="50" y1="25" x2="50" y2="20" stroke="url(#g)" style={{ transformOrigin: 'center bottom', animation: 'eq .9s ease-in-out .2s infinite' }} />
                  <line x1="70" y1="25" x2="70" y2="8" stroke="url(#g)" style={{ transformOrigin: 'center bottom', animation: 'eq 1s ease-in-out .05s infinite' }} />
                  <line x1="90" y1="25" x2="90" y2="18" stroke="url(#g)" style={{ transformOrigin: 'center bottom', animation: 'eq 1.3s ease-in-out .15s infinite' }} />
                </g>
                <defs>
                  <linearGradient id="g" x1="0" x2="1">
                    <stop offset="0%" stopColor="#ff5f6d" />
                    <stop offset="100%" stopColor="#ffc371" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            <div style={{ marginTop: 12, fontSize: 14, color: 'rgba(255,255,255,0.85)' }}>Redirigiendo en <strong>{secondsLeft}s</strong>…</div>
          </div>
        </div>

        {/* footer chico en la card */}
        <div style={{ marginTop: 18, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13, color: 'rgba(255,255,255,0.75)' }}>
          <div>Apoyá a la fundación — Gracias por ser parte.</div>
          <div>
            <a href={SUBSTACK_URL} onClick={(e) => e.stopPropagation()} style={{ textDecoration: 'underline', color: 'inherit' }}>
              Ir a Substack (enlace directo)
            </a>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes eq {
          0% { transform: scaleY(0.35); }
          50% { transform: scaleY(1); }
          100% { transform: scaleY(0.35); }
        }
      `}</style>
    </div>
  );
}
