import { useEffect, useRef, useState } from 'react';

const DISMISS_KEY = 'exit-intent-popup-dismissed-at';
const DISMISS_WINDOW_MS = 24 * 60 * 60 * 1000;

function hasRecentDismissal() {
  try {
    const raw = window.localStorage.getItem(DISMISS_KEY);
    if (!raw) return false;
    const timestamp = Number(raw);
    return Number.isFinite(timestamp) && Date.now() - timestamp < DISMISS_WINDOW_MS;
  } catch {
    return false;
  }
}

function rememberDismissal() {
  try {
    window.localStorage.setItem(DISMISS_KEY, String(Date.now()));
  } catch {
    // Ignore localStorage failures in private mode.
  }
}

function isTouchLikeDevice() {
  if (typeof window === 'undefined') return false;
  if (window.matchMedia?.('(hover: none), (pointer: coarse)').matches) return true;
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

export default function useExitIntent({ enabled }) {
  const [isOpen, setIsOpen] = useState(false);
  const triggeredRef = useRef(false);
  const mobileStateRef = useRef({
    armed: false,
    lastY: 0,
    lastAt: 0,
  });

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') {
      return undefined;
    }

    if (hasRecentDismissal()) {
      return undefined;
    }

    const mobile = isTouchLikeDevice();
    mobileStateRef.current.lastY = window.scrollY;
    mobileStateRef.current.lastAt = Date.now();

    const openPopup = () => {
      if (triggeredRef.current || hasRecentDismissal()) {
        return;
      }
      triggeredRef.current = true;
      setIsOpen(true);
    };

    const handleMouseOut = (event) => {
      if (mobile) return;
      if (event.clientY > 0) return;
      if (event.relatedTarget || event.toElement) return;
      openPopup();
    };

    const handleScroll = () => {
      if (!mobile) return;

      const now = Date.now();
      const currentY = window.scrollY;
      const viewportHeight = window.innerHeight || 1;
      const scrollableHeight = Math.max(
        1,
        document.documentElement.scrollHeight - viewportHeight,
      );
      const ratio = currentY / scrollableHeight;
      const deltaY = currentY - mobileStateRef.current.lastY;
      const deltaT = now - mobileStateRef.current.lastAt;

      if (ratio >= 0.6) {
        mobileStateRef.current.armed = true;
      }

      if (
        mobileStateRef.current.armed
        && deltaY <= -120
        && deltaT > 0
        && deltaT <= 200
      ) {
        openPopup();
      }

      mobileStateRef.current.lastY = currentY;
      mobileStateRef.current.lastAt = now;
    };

    document.addEventListener('mouseout', handleMouseOut);
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      document.removeEventListener('mouseout', handleMouseOut);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [enabled]);

  const dismiss = () => {
    rememberDismissal();
    setIsOpen(false);
  };

  return {
    isOpen,
    dismiss,
  };
}
