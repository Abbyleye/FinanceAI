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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function fetchUserProfile() {
      try {
        const response = await fetch(`${API_URL}/profile`);
        if (!response.ok) {
          throw new Error("Could not load user profile.");
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
    setSuccess("");

    try {
      const response = await fetch(`${API_URL}/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      if (!response.ok) {
        throw new Error("Could not update profile.");
      }

      setSuccess("Profile updated successfully!");
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
      {success && (
        <div className="mt-4 rounded-xl border border-green-400/30 bg-green-500/10 p-4 text-green-200">
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
            onChange={handleChange}
            required
            className={inputStyle}
            placeholder="Enter your name"
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
            required
            className={inputStyle}
            placeholder="Enter your email"
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
            className={inputStyle}
            placeholder="Enter your password"
          />
        </div>
        <button type="submit" className={buttonStyle}>
          Update Profile
        </button>
      </form>
    </div>
  );
}

export default Profile;
```

### Explanation

1. **State Management**: The component uses `useState` to manage the user's profile data, loading state, error messages, and success messages.

2. **Fetching User Profile**: The `useEffect` hook fetches the user's profile data from the backend when the component mounts. The API endpoint is assumed to be `/profile`.

3. **Form Handling**: The form allows users to update their name, email, and password. The `handleChange` function updates the state as the user types.

4. **Submitting the Form**: The `handleSubmit` function sends a PUT request to update the user's profile. It handles success and error messages accordingly.

5. **Styling**: The component uses similar styling to the `Dashboard` component for consistency.

### Integration

To integrate this new profile page into your application, you would typically add a route in your main application file (e.g., `App.js` or `index.js`) to render the `Profile` component when the user navigates to the profile page.

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

This setup will allow users to navigate to the profile page and manage their personal information effectively.