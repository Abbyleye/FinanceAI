
import { useState } from "react";
import { Link } from "react-router-dom";

const inputStyle =
  "w-full rounded-xl border border-emerald-900/15 bg-white px-4 py-3 text-slate-800 outline-none focus:border-[#087F5B] focus:ring-2 focus:ring-emerald-600/15";

const buttonStyle =
  "rounded-xl bg-[#087F5B] px-5 py-3 font-semibold text-white transition hover:bg-[#066749]";

function Settings() {
  const [budget, setBudget] = useState(
    () => localStorage.getItem("financeai_budget") || "100000"
  );

  const [currency, setCurrency] = useState(
    () => localStorage.getItem("financeai_currency") || "NGN"
  );

  const [notifications, setNotifications] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem("financeai_notifications") ||
          '{"weekly":true,"monthly":true,"budgetAlerts":true}'
      );
    } catch {
      return { weekly: true, monthly: true, budgetAlerts: true };
    }
  });

  const [appearance, setAppearance] = useState(
    () => localStorage.getItem("financeai_appearance") || "light"
  );

  const [message, setMessage] = useState("");

  function handleSave(event) {
    event.preventDefault();

    if (budget.trim() === "" || !Number.isFinite(Number(budget)) || Number(budget) < 0) {
      setMessage("Please enter a valid monthly budget.");
      return;
    }

    localStorage.setItem("financeai_budget", String(Number(budget)));
    localStorage.setItem("financeai_currency", currency);
    localStorage.setItem(
      "financeai_notifications",
      JSON.stringify(notifications)
    );
    localStorage.setItem("financeai_appearance", appearance);

    setMessage("Your settings have been saved successfully.");
  }

  function updateNotification(key, checked) {
    setNotifications((current) => ({
      ...current,
      [key]: checked,
    }));
  }

  const checkboxStyle =
    "h-5 w-5 accent-[#087F5B]";

  return (
    <div className="min-h-screen bg-[#FAF9F4] px-4 py-8 text-slate-800 sm:px-8">
      <div className="mx-auto max-w-3xl">
        <Link
          to="/dashboard"
          className="font-semibold text-[#087F5B] hover:underline"
        >
          ← Back to Dashboard
        </Link>

        <header className="mt-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-[#087F5B]">
            Personalise your experience
          </p>
          <h1 className="mt-2 text-3xl font-extrabold text-slate-900">
            Settings
          </h1>
          <p className="mt-2 text-slate-600">
            Manage your budget, preferences, and notification choices.
          </p>
        </header>

        {message && (
          <div
            role="status"
            className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-[#087F5B]"
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSave} className="mt-8 space-y-6">
          <section className="rounded-2xl border border-emerald-900/10 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-xl font-bold text-slate-900">
              Budget preferences
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Set the spending limit you want to follow each month.
            </p>

            <label
              htmlFor="settings-budget"
              className="mb-2 mt-5 block text-sm font-semibold"
            >
              Monthly budget
            </label>
            <input
              id="settings-budget"
              type="number"
              min="0"
              step="any"
              value={budget}
              onChange={(event) => setBudget(event.target.value)}
              className={inputStyle}
              required
            />

            <label
              htmlFor="settings-currency"
              className="mb-2 mt-5 block text-sm font-semibold"
            >
              Currency
            </label>
            <select
              id="settings-currency"
              value={currency}
              onChange={(event) => setCurrency(event.target.value)}
              className={inputStyle}
            >
              <option value="NGN">Nigerian Naira (₦ NGN)</option>
              <option value="USD">US Dollar ($ USD)</option>
              <option value="GBP">British Pound (£ GBP)</option>
            </select>

            <p className="mt-2 text-xs leading-5 text-slate-500">
              The dashboard currently displays amounts in naira. Choosing
              another currency saves your preference, but does not convert
              amounts or change the dashboard display yet.
            </p>
          </section>

          <section className="rounded-2xl border border-emerald-900/10 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-xl font-bold text-slate-900">
              Notifications
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Choose the reminders you would like FinanceAI to support.
            </p>

            <div className="mt-5 space-y-5">
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={notifications.weekly}
                  onChange={(event) =>
                    updateNotification("weekly", event.target.checked)
                  }
                  className={checkboxStyle}
                />
                <span>
                  <span className="block font-semibold">
                    Weekly spending summary
                  </span>
                  <span className="mt-1 block text-sm text-slate-500">
                    A summary of your spending for the week.
                  </span>
                </span>
              </label>

              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={notifications.monthly}
                  onChange={(event) =>
                    updateNotification("monthly", event.target.checked)
                  }
                  className={checkboxStyle}
                />
                <span>
                  <span className="block font-semibold">
                    Month-end report
                  </span>
                  <span className="mt-1 block text-sm text-slate-500">
                    Review category totals and monthly budget progress.
                  </span>
                </span>
              </label>

              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={notifications.budgetAlerts}
                  onChange={(event) =>
                    updateNotification("budgetAlerts", event.target.checked)
                  }
                  className={checkboxStyle}
                />
                <span>
                  <span className="block font-semibold">
                    Budget alerts
                  </span>
                  <span className="mt-1 block text-sm text-slate-500">
                    Enable your preference for alerts when approaching
                    your budget limit.
                  </span>
                </span>
              </label>
            </div>

            <p className="mt-5 rounded-xl bg-amber-50 p-3 text-sm leading-5 text-amber-800">
              These choices are saved, but automatic scheduled messages and
              alerts still need to be connected to a notification service.
            </p>
          </section>

          <section className="rounded-2xl border border-emerald-900/10 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-xl font-bold text-slate-900">
              Appearance
            </h2>

            <label
              htmlFor="settings-appearance"
              className="mb-2 mt-5 block text-sm font-semibold"
            >
              Theme preference
            </label>
            <select
              id="settings-appearance"
              value={appearance}
              onChange={(event) => setAppearance(event.target.value)}
              className={inputStyle}
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>

            <p className="mt-2 text-xs leading-5 text-slate-500">
              Your preference will be saved. Applying a full dark theme
              across the app is a separate implementation step.
            </p>
          </section>

          <button type="submit" className={`${buttonStyle} w-full`}>
            Save Settings
          </button>
        </form>
      </div>
    </div>
  );
}

export default Settings;