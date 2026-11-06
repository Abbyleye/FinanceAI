
import { useEffect, useState } from "react";

function PWAInstallPrompt() {
  const [installPrompt, setInstallPrompt] = useState(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);

  useEffect(() => {
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true;

    setIsInstalled(standalone);

    const ios =
      /iphone|ipad|ipod/i.test(window.navigator.userAgent);

    setIsIOS(ios);

    function handleInstallAvailable(event) {
      event.preventDefault();
      setInstallPrompt(event);
    }

    function handleInstalled() {
      setIsInstalled(true);
      setInstallPrompt(null);
    }

    window.addEventListener(
      "beforeinstallprompt",
      handleInstallAvailable
    );

    window.addEventListener("appinstalled", handleInstalled);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleInstallAvailable
      );

      window.removeEventListener("appinstalled", handleInstalled);
    };
  }, []);

  async function handleInstall() {
    if (!installPrompt) return;

    installPrompt.prompt();

    const result = await installPrompt.userChoice;

    if (result.outcome === "accepted") {
      setInstallPrompt(null);
    }
  }

  if (isInstalled) return null;

  if (isIOS) {
    return (
      <div className="fixed bottom-4 left-4 right-4 z-[90] mx-auto max-w-md rounded-2xl border border-emerald-100 bg-white p-4 shadow-xl">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-slate-900">
              Install FinanceAI
            </h3>
            <p className="mt-1 text-sm text-slate-600">
              Add FinanceAI to your iPhone home screen.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              setShowIOSInstructions(!showIOSInstructions)
            }
            className="shrink-0 rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white"
          >
            How?
          </button>
        </div>

        {showIOSInstructions && (
          <p className="mt-3 text-sm leading-6 text-slate-700">
            Open FinanceAI in Safari, tap the Share icon,
            select "Add to Home Screen", and follow the instructions.
          </p>
        )}
      </div>
    );
  }

  if (!installPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-[90] mx-auto max-w-md rounded-2xl border border-emerald-100 bg-white p-4 shadow-xl">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="font-bold text-slate-900">
            Take FinanceAI with you
          </h3>
          <p className="mt-1 text-sm text-slate-600">
            Install the app for quick access from your device.
          </p>
        </div>

        <button
          type="button"
          onClick={handleInstall}
          className="shrink-0 rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800"
        >
          Install
        </button>
      </div>
    </div>
  );
}

export default PWAInstallPrompt;