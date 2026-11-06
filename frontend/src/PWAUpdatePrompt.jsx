
import { useRegisterSW } from "virtual:pwa-register/react";

function PWAUpdatePrompt() {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    immediate: true,
    onRegisterError(error) {
      console.error("FinanceAI service worker registration failed:", error);
    },
  });

  function closePrompt() {
    setOfflineReady(false);
    setNeedRefresh(false);
  }

  if (!offlineReady && !needRefresh) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-[100] w-[calc(100%-2rem)] max-w-sm">
      <div className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-2xl">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              {needRefresh
                ? "A new FinanceAI update is available"
                : "FinanceAI is ready"}
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              {needRefresh
                ? "We've improved FinanceAI. Update now to enjoy the latest experience."
                : "App resources are ready for offline loading. Your financial records still require an internet connection."}
            </p>
          </div>

          <button
            type="button"
            onClick={closePrompt}
            aria-label="Close notification"
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            ✕
          </button>
        </div>

        <div className="mt-4 flex items-center justify-end gap-3">
          {needRefresh && (
            <button
              type="button"
              onClick={closePrompt}
              className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100"
            >
              Later
            </button>
          )}

          <button
            type="button"
            onClick={() =>
              needRefresh
                ? updateServiceWorker(true)
                : closePrompt()
            }
            className="rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800"
          >
            {needRefresh ? "Update now" : "Got it"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default PWAUpdatePrompt;