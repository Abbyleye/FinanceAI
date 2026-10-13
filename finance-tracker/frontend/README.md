### Profile.jsx

```jsx
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
  const [success, setSuccess] = useState("");

  useEffect(() => {
    // Load user data from API
    const loadUserData = async () => {
      try {
        const response = await fetch(`${API_URL}/user`);
        if (!response.ok) {
          throw new Error("Failed to load user data.");
        }
        const data = await response.json();
        setUser(data);
      } catch (err) {
        setError(err.message);
      }
    };

    loadUserData();
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`${API_URL}/user`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      if (!response.ok) {
        throw new Error("Failed to update user data.");
      }

      setSuccess("Profile updated successfully!");
      setEditing(false);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-[#171338] to-slate-950 text-white p-6">
      <h2 className="text-3xl font-extrabold tracking-tight text-white">
        Profile<span className="text-purple-400">.</span>
      </h2>

      {error && (
        <div
          role="alert"
          className="mt-6 rounded-xl border border-red-400/30 bg-red-500/10 p-4 text-red-200"
        >
          {error}
        </div>
      )}

      {success && (
        <div
          role="alert"
          className="mt-6 rounded-xl border border-green-400/30 bg-green-500/10 p-4 text-green-200"
        >
          {success}
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
            onChange={handleInputChange}
            disabled={!editing}
            required
            className={inputStyle}
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
            onChange={handleInputChange}
            disabled={!editing}
            required
            className={inputStyle}
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
            onChange={handleInputChange}
            disabled={!editing}
            required={editing}
            className={inputStyle}
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
```

### Explanation

1. **State Management**: The component uses `useState` to manage the user's profile data, editing state, and error/success messages.

2. **Data Fetching**: The `useEffect` hook fetches user data from the API when the component mounts.

3. **Form Handling**: The form allows users to edit their name, email, and password. The `handleInputChange` function updates the state as the user types.

4. **Submission**: The `handleSubmit` function sends a PUT request to update the user data on the server.

5. **Conditional Rendering**: The component conditionally renders the form fields as editable or read-only based on the `editing` state.

### Integration

To integrate this new profile page into your application, you would typically add a route for it in your main application file (e.g., `App.js` or `index.js`) and provide a link to navigate to the profile page from the dashboard or sidebar.

### Example Route Integration

```jsx
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/profile" component={Profile} />
        {/* Add other routes as needed */}
      </Switch>
    </Router>
  );
}

export default App;
```

### Navigation Link

You can add a link to the profile page in the sidebar of the `Dashboard.jsx`:

```jsx
<a
  href="/profile"
  className="flex items-center gap-3 rounded-xl px-4 py-3 text-slate-300 transition hover:bg-white/5 hover:text-white"
>
  <span>👤</span> Profile
</a>
```

This will allow users to navigate to their profile page easily.