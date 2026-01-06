// app/suscribite/page.tsx
// Next.js (App Router) + TypeScript
// Página intermedia (interstitial) para redirigir al Newsletter (Substack).
// Incluye:
//  - dos tonos de texto: "Institucional" y "Periodístico"
//  - animación / loader visual
//  - integración estética pensada para "Radio Empresarial"
//  - fallback "Ir ahora" y contador con barra de progreso
// Cómo usar:
//  - Copiar este archivo a /app/suscribite/page.tsx
//  - Cambiar SUBSTACK_URL si corresponde
//  - Ajustar DELAY_SECONDS si querés 10 / 20 s por defecto

'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

const SUBSTACK_URL = 'https://substack.com/@fundacionprobuenosaires?utm_source=global-search'; // <- cambia esto
const DELAY_SECONDS = 15; // <- puedes cambiar a 10 o 20

export default function SuscribitePage(): React.ReactElement {
  const [secondsLeft, setSecondsLeft] = useState<number>(DELAY_SECONDS);
  const [tone, setTone] = useState<'institucional' | 'periodistico'>('institucional');
  const [isRedirecting, setIsRedirecting] = useState<boolean>(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    // Hide common site headers/navbars to make this page truly full-screen.
    // We'll attempt several common selectors and restore the original display on cleanup.
    const selectors = ['#navbar', 'header', '.site-header', '.main-nav', '.topbar', '.navbar', '.Header', '.header', '#topnav'];
    const prevStyles: Array<{ el: HTMLElement; display: string | null; overflow: string | null }> = [];

    selectors.forEach((sel) => {
      document.querySelectorAll(sel).forEach((node) => {
        const el = node as HTMLElement;
        prevStyles.push({ el, display: el.style.display || null, overflow: el.style.overflow || null });
        el.style.display = 'none';
      });
    });

    // Also prevent body scrolling while interstitial is active
    const prevBodyOverflow = document.body.style.overflow || '';
    document.body.style.overflow = 'hidden';

    // Start countdown
    timerRef.current = window.setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          // final
          if (timerRef.current) window.clearInterval(timerRef.current);
          setIsRedirecting(true);
          // final redirect
          window.location.href = SUBSTACK_URL;
          return 0;
        }
        return s - 1;
      });
    }, 1000);

    // Analytic placeholder: dispatch event that the interstitial was shown
    if ((window as any).dataLayer) {
      (window as any).dataLayer.push({ event: 'newsletter_interstitial_shown' });
    }

    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
      // restore previously hidden elements
      prevStyles.forEach(({ el, display, overflow }) => {
        el.style.display = display ?? '';
        if (overflow != null) el.style.overflow = overflow;
      });
      document.body.style.overflow = prevBodyOverflow;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const goNow = () => {
    if (timerRef.current) window.clearInterval(timerRef.current);
    setIsRedirecting(true);
    // analytic placeholder
    if ((window as any).dataLayer) {
      (window as any).dataLayer.push({ event: 'newsletter_interstitial_click_now' });
    }
    window.location.href = SUBSTACK_URL;
  };

  const progress = Math.round(((DELAY_SECONDS - secondsLeft) / DELAY_SECONDS) * 100);

  const texts = {
    institucional: {
      title: 'Bienvenido al canal de difusión de Radio Empresarial',
      lead:
        'Nuestro Newsletter es el espacio donde compartimos análisis, agenda y novedades pensadas para el sector PYME. Suscribiéndote, apoyás directamente el trabajo de la fundación y nos ayudás a mantener este servicio de difusión.',
      cta: 'Serás redirigido en breve a la página de suscripción oficial.'
    },
    periodistico: {
      title: 'Suscribite al Newsletter de Radio Empresarial',
      lead:
        'Recibí lo último: crónicas, entrevistas, reportes y material exclusivo sobre el ecosistema emprendedor. Nuestro boletín es la forma más directa de no perderte nada.',
      cta: 'En unos segundos te llevamos a la página de suscripción.'
    }
  } as const;

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 via-slate-900 to-black text-gray-100 p-6">
      <div className="max-w-3xl w-full rounded-2xl shadow-xl bg-gradient-to-tr from-white/3 to-white/5 backdrop-blur border border-white/6 overflow-hidden">
        <div className="flex items-center gap-4 px-6 py-4 border-b border-white/6">
          {/* Logo area - si tenés un logo, reemplazá el div por <Image> */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-red-600 text-white font-bold text-lg shadow-md">RE</div>
            <div>
              <div className="text-sm font-semibold">Radio Empresarial</div>
              <div className="text-[11px] opacity-80">Canal de difusión oficial</div>
            </div>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <span className="px-2 py-1 text-xs bg-black/40 border border-white/8 rounded-full">Newsletter</span>
            <span className="px-2 py-1 text-xs bg-red-600 rounded-full font-semibold">Suscribite</span>
          </div>
        </div>

        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          {/* Left: Texto y controles */}
          <div className="space-y-4">
            <h1 className="text-xl md:text-2xl font-bold leading-tight">{texts[tone].title}</h1>
            <p className="text-sm md:text-base opacity-90">{texts[tone].lead}</p>
            <p className="text-sm opacity-70">{texts[tone].cta}</p>

            <div className="flex items-center gap-3 mt-4">
              <button
                onClick={goNow}
                className="px-4 py-2 rounded-lg bg-red-600 text-white font-semibold hover:brightness-95 shadow-md"
                aria-label="Ir ahora al Newsletter"
              >
                Ir ahora
              </button>

              <Link href="/">
                <button className="px-4 py-2 rounded-lg bg-white/5 text-white border border-white/6 hover:bg-white/6">
                  Volver al sitio
                </button>
              </Link>

              <div className="ml-auto flex items-center gap-2 text-xs opacity-85">
                <span>{secondsLeft}s</span>
                <div className="w-32 h-2 bg-white/6 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-red-500 to-yellow-400 transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="mt-3 flex items-center gap-2 text-xs opacity-80">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="tone"
                  checked={tone === 'institucional'}
                  onChange={() => setTone('institucional')}
                  className="w-4 h-4"
                />
                <span>Institucional</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="tone"
                  checked={tone === 'periodistico'}
                  onChange={() => setTone('periodistico')}
                  className="w-4 h-4"
                />
                <span>Periodístico</span>
              </label>
            </div>

            <div className="mt-4 text-xs opacity-70">
              <strong>Nota:</strong> la redirección se activará automáticamente cuando el contador llegue a cero. Podés ir ahora haciendo clic en <em>Ir ahora</em>.
            </div>
          </div>

          {/* Right: Animación / Loader */}
          <div className="flex flex-col items-center justify-center">
            <div className="relative flex items-center justify-center w-56 h-56">
              {/* Radio pulse */}
              <div className="absolute w-56 h-56 rounded-full animate-pulse-slow opacity-20 bg-gradient-to-r from-red-500 to-yellow-400" />

              <div className="w-40 h-40 bg-gradient-to-br from-black/60 to-white/5 border border-white/8 rounded-2xl flex items-center justify-center flex-col shadow-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center text-white font-bold">▶</div>
                  <div className="text-left">
                    <div className="text-sm font-semibold">Radio Empresarial</div>
                    <div className="text-[11px] opacity-80">Newsletter · Contenido exclusivo</div>
                  </div>
                </div>

                <div className="mt-4 w-24 h-24 relative">
                  {/* stylized mascot / equalizer */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-white/6 flex items-center justify-center text-sm">RE</div>
                  </div>

                  <svg viewBox="0 0 120 40" className="w-full h-full" preserveAspectRatio="none" aria-hidden>
                    <rect width="120" height="40" fill="transparent" />
                    <g stroke="url(#g)" strokeWidth={3} strokeLinecap="round">
                      <line x1="10" y1="25" x2="10" y2="15" className="eq-bar animate-eq-1" />
                      <line x1="30" y1="25" x2="30" y2="10" className="eq-bar animate-eq-2" />
                      <line x1="50" y1="25" x2="50" y2="20" className="eq-bar animate-eq-3" />
                      <line x1="70" y1="25" x2="70" y2="8" className="eq-bar animate-eq-4" />
                      <line x1="90" y1="25" x2="90" y2="18" className="eq-bar animate-eq-5" />
                    </g>
                    <defs>
                      <linearGradient id="g" x1="0" x2="1">
                        <stop offset="0%" stopColor="#ff5f6d" />
                        <stop offset="100%" stopColor="#ffc371" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>
            </div>

            <div className="mt-4 text-xs opacity-80">Redirigiendo en <strong>{secondsLeft}s</strong>…</div>
          </div>
        </div>

        {/* Tiny footer */}
        <div className="px-6 py-3 border-t border-white/6 text-xs text-gray-300/80 flex items-center justify-between">
          <div>Apoyá a la fundación — Gracias por ser parte.</div>
          <div>
            <a href={SUBSTACK_URL} onClick={(e) => e.stopPropagation()} className="underline">
              Ir a Substack (enlace directo)
            </a>
          </div>
        </div>
      </div>

      {/* Styles adicionales para animaciones - usa Tailwind + estas utilidades */}
      <style jsx>{`
        .animate-pulse-slow {
          animation: pulse 2.6s ease-in-out infinite;
        }
        @keyframes pulse {
          0% { transform: scale(0.9); opacity: 0.14; }
          50% { transform: scale(1.05); opacity: 0.32; }
          100% { transform: scale(0.9); opacity: 0.14; }
        }

        .eq-bar { transform-origin: center bottom; }
        .animate-eq-1 { animation: eq 1200ms ease-in-out infinite; }
        .animate-eq-2 { animation: eq 1100ms ease-in-out .1s infinite; }
        .animate-eq-3 { animation: eq 900ms ease-in-out .2s infinite; }
        .animate-eq-4 { animation: eq 1000ms ease-in-out .05s infinite; }
        .animate-eq-5 { animation: eq 1300ms ease-in-out .15s infinite; }
        @keyframes eq {
          0% { transform: scaleY(0.3); }
          50% { transform: scaleY(1.0); }
          100% { transform: scaleY(0.3); }
        }
      `}</style>
    </main>
  );
}
