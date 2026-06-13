import React, { useEffect, useState } from 'react';
import { Pin } from 'lucide-react';

export default function InstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [canInstall, setCanInstall] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setCanInstall(true);
    };

    const onInstalled = () => {
      setCanInstall(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handler);
    window.addEventListener('appinstalled', onInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setCanInstall(false);
    }
    setDeferredPrompt(null);
  };

  if (!canInstall) return null;

  return (
    <button
      type="button"
      onClick={handleInstall}
      className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-primary"
    >
      <Pin className="h-3 w-3" />
      Ghim trang này
    </button>
  );
}
