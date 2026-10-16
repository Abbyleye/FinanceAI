import { useState } from "react";
import { Link } from "react-router-dom";

const inputStyle =
  "w-full rounded-xl border border-emerald-900/15 bg-white px-4 py-3 text-slate-800 outline-none focus:border-[#087F5B] focus:ring-2 focus:ring-emerald-600/15";

const buttonStyle =
  "rounded-xl bg-[#087F5B] px-5 py-3 font-semibold text-white transition hover:bg-[#066749]";

function getSavedProfile() {
  try {
    const savedProfile = localStorage.getItem("financeai_profile");
    const loginUser = JSON.parse(
      sessionStorage.getItem("financeai_user") || "{}"
    );

    const saved = savedProfile ? JSON.parse(savedProfile) : {};

    return {
      name: saved.name || loginUser.full_name || loginUser.name || "",
      email: saved.email || loginUser.email || "",
    };
  } catch {
    return { name: "", email: "" };
  }
}

function Profile() {
  const [profile, setProfile] = useState(getSavedProfile);
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState("");

  function handleSave(event) {
    event.preventDefault();

    const updatedProfile = {
      name: name.trim(),
      email: email.trim(),
    };

    localStorage.setItem(
      "financeai_profile",
      JSON.stringify(updatedProfile)
    );

    setProfile(updatedProfile);
    setEditing(false);
    setMessage("Your profile details have been saved in this browser.");
  }

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
            Your account
          </p>
          <h1 className="mt-2 text-3xl font-extrabold text-slate-900">
            My Profile
          </h1>
          <p className="mt-2 text-slate-600">
            View and manage your FinanceAI profile information.
          </p>
        </header>

        <section className="mt-8 rounded-2xl border border-emerald-900/10 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-wrap items-center gap-4 border-b border-slate-100 pb-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-2xl font-bold text-[#087F5B]">
              {(profile.name || profile.email || "U")
                .charAt(0)
                .toUpperCase()}
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900">
                {profile.name || "FinanceAI User"}
              </h2>
              <p className="text-sm text-slate-500">
                {profile.email || "No email available"}
              </p>
            </div>
          </div>

          {message && (
            <p
              role="status"
              className="mt-5 rounded-xl bg-emerald-50 p-3 text-sm text-[#087F5B]"
            >
              {message}
            </p>
          )}

          {editing ? (
            <form onSubmit={handleSave} className="mt-6 space-y-5">
              <div>
                <label
                  htmlFor="profile-name"
                  className="mb-2 block text-sm font-semibold"
                >
                  Full name
                </label>
                <input
                  id="profile-name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  maxLength={100}
                  required
                  className={inputStyle}
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <label
                  htmlFor="profile-email"
                  className="mb-2 block text-sm font-semibold"
                >
                  Email address
                </label>
                <input
                  id="profile-email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  maxLength={254}
                  required
                  className={inputStyle}
                  placeholder="Enter your email"
                />
                <p className="mt-2 text-xs text-slate-500">
                  This changes the profile display only, not your login
                  credentials.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button type="submit" className={buttonStyle}>
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setName(profile.name);
                    setEmail(profile.email);
                    setEditing(false);
                    setMessage("");
                  }}
                  className="rounded-xl border border-slate-200 px-5 py-3 font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="mt-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-slate-500">Full name</p>
                  <p className="mt-1 font-semibold">
                    {profile.name || "Not provided"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Email address</p>
                  <p className="mt-1 break-words font-semibold">
                    {profile.email || "Not provided"}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setName(profile.name);
                  setEmail(profile.email);
                  setEditing(true);
                  setMessage("");
                }}
                className={`${buttonStyle} mt-6`}
              >
                Edit Profile
              </button>
            </div>
          )}
        </section>

        <section className="mt-6 rounded-2xl border border-emerald-900/10 bg-white p-6">
          <h2 className="font-bold text-slate-900">Account security</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Keep your login credentials private. Password changes should be
            handled through a secure backend password-change feature.
          </p>
          <Link
            to="/forgot-password"
            className="mt-4 inline-block font-semibold text-[#087F5B] hover:underline"
          >
            Go to password recovery →
          </Link>
        </section>
      </div>
    </div>
  );
}

export default Profile;