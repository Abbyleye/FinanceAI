import { useEffect, useState } from "react";

const API_URL = "http://127.0.0.1:8000";

const inputStyle =
  "w-full rounded-xl border border-slate-600 bg-slate-800 px-4 py-3 text-white outline-none placeholder:text-slate-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20";

const buttonStyle =
  "rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-3 font-semibold text-white shadow-lg shadow-purple-950/30 transition hover:from-purple-500 hover:to-indigo-500 disabled:cursor-not-allowed disabled:opacity-60";

function Profile() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    async function fetchUserProfile() {
      try {
        const response = await fetch(`${API_URL}/profile`);
        if (!response.ok) {
          throw new Error("Failed to load user profile.");
        }
        const data = await response.json();
        setUser(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchUserProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    try {
      const response = await fetch(`${API_URL}/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile.");
      }

      setSuccessMessage("Profile updated successfully!");
      setEditing(false);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-[#171338] to-slate-950 text-white p-6">
      <h1 className="text-3xl font-extrabold">Profile</h1>
      {error && (
        <div className="mt-4 rounded-xl border border-red-400/30 bg-red-500/10 p-4 text-red-200">
          {error}
        </div>
      )}
      {successMessage && (
        <div className="mt-4 rounded-xl border border-green-400/30 bg-green-500/10 p-4 text-green-200">
          {successMessage}
        </div>
      )}
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-200">
            Name
          </label>
          <input
            type="text"
            name="name"
            value={user.name}
            onChange={handleChange}
            disabled={!editing}
            className={inputStyle}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-200">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={user.email}
            onChange={handleChange}
            disabled={!editing}
            className={inputStyle}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-200">
            Password
          </label>
          <input
            type="password"
            name="password"
            value={user.password}
            onChange={handleChange}
            disabled={!editing}
            className={inputStyle}
            required
          />
        </div>
        <div className="flex gap-4">
          {editing ? (
            <>
              <button type="submit" className={buttonStyle}>
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="rounded-xl border border-slate-600 px-4 py-3 font-semibold text-slate-200 transition hover:bg-slate-700"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setEditing(true)}
              className={buttonStyle}
            >
              Edit Profile
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default Profile;