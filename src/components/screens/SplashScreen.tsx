// src/components/screens/SplashScreen.tsx
import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

type Props = {
  onFinish?: () => void;
};

const TRANSITION_MS = 400; // CSS transition duration (must match below)
const AUTO_HIDE_AFTER_LOAD_MS = 600; // wait after image load before starting exit
const FALLBACK_TIMEOUT_MS = 4000; // force hide if something goes wrong

const SplashScreen: React.FC<Props> = ({ onFinish }) => {
  const [exiting, setExiting] = useState(false);
  const fallbackTimer = useRef<number | null>(null);
  const finishedCalled = useRef(false);

  useEffect(() => {
    // safety: auto-start exit after fallback timeout
    fallbackTimer.current = window.setTimeout(() => startExit(), FALLBACK_TIMEOUT_MS);
    return () => {
      if (fallbackTimer.current) {
        clearTimeout(fallbackTimer.current);
        fallbackTimer.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function notifyParent() {
    if (finishedCalled.current) return;
    finishedCalled.current = true;
    if (typeof onFinish === 'function') onFinish();
  }

  function startExit() {
    if (exiting) return;
    setExiting(true);
    // after CSS transition, notify parent to hide the overlay
    window.setTimeout(() => {
      notifyParent();
    }, TRANSITION_MS + 20);
  }

  return (
    <>
      <style jsx global>{`
        @keyframes fadeInScaleUp {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }

        .splash-overlay {
          position: fixed;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          background: var(--splash-bg, rgba(243,232,255,1)); /* change to rgba(...) if you want translucency */
          transition: opacity ${TRANSITION_MS}ms ease, visibility ${TRANSITION_MS}ms ease;
          opacity: 1;
          visibility: visible;
          pointer-events: auto;
        }
        .splash-overlay.exiting {
          opacity: 0;
          visibility: hidden;
          pointer-events: none;
        }

        .splash-inner {
          animation: fadeInScaleUp 1.5s cubic-bezier(0.25, 1, 0.5, 1) forwards;
        }
      `}</style>

      <div
        className={`splash-overlay ${exiting ? 'exiting' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-hidden={exiting ? 'true' : 'false'}
        onClick={() => startExit()}
      >
        <div className="splash-inner" aria-hidden="false">
          <Image
            src="/raw-removebg-preview.png"
            alt="JETLAY Logo"
            width={256}
            height={256}
            className="rounded-xl"
            priority
            loading="eager"
            onLoad={() => {
              // clear fallback and start exit after a short delay so animation finishes
              if (fallbackTimer.current) {
                clearTimeout(fallbackTimer.current);
                fallbackTimer.current = null;
              }
              window.setTimeout(() => startExit(), AUTO_HIDE_AFTER_LOAD_MS);
            }}
            onError={() => {
              // if image fails, still hide soon
              if (fallbackTimer.current) {
                clearTimeout(fallbackTimer.current);
                fallbackTimer.current = null;
              }
              window.setTimeout(() => startExit(), 300);
            }}
          />
        </div>
      </div>
    </>
  );
};

export default SplashScreen;
