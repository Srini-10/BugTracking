import React, { useState, useEffect } from "react";
import Login from "./components/Auth/Login";
import AdminDashboard from "./components/Admin/AdminDashboard";
import DeveloperDashboard from "./components/Developer/DeveloperDashboard";
import { User } from "./types";
import { storageService } from "./services/storageService";

function App() {
  const [user, setUser] = useState<User | null>(null);

  // Check for existing user session
  useEffect(() => {
    // Initialize sample data
    storageService.initializeStorage();

    // Check if user is already logged in
    const currentUser = storageService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
  }, []);

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
  };

  const handleLogout = () => {
    storageService.clearCurrentUser();
    setUser(null);
  };

  // Determine which dashboard to show based on user role
  const renderDashboard = () => {
    if (!user) return null;

    switch (user.role) {
      case "admin":
        return <AdminDashboard user={user} onLogout={handleLogout} />;
      case "developer":
        return <DeveloperDashboard user={user} onLogout={handleLogout} />;
      default:
        return null;
    }
  };

  return (
    <div className="app">
      {user ? renderDashboard() : <Login onLogin={handleLogin} />}
    </div>
  );
}

export default App;
