import React, { useState } from "react";
import { User } from "../../types";
import { storageService } from "../../services/storageService";
import { Bug, Users } from "lucide-react";

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [selectedRole, setSelectedRole] = useState<
    "admin" | "developer" | null
  >(null);
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setError("Please enter your name");
      return;
    }

    if (!selectedRole) {
      setError("Please select a role");
      return;
    }

    // Create a user object
    const user: User = {
      id: Date.now().toString(),
      name: name.trim(),
      role: selectedRole,
    };

    // Add user to storage if doesn't exist already
    const users = storageService.getUsers();
    const existingUser = users.find(
      (u) =>
        u.name.toLowerCase() === name.toLowerCase() && u.role === selectedRole
    );

    if (existingUser) {
      // Use existing user
      storageService.setCurrentUser(existingUser);
      onLogin(existingUser);
    } else {
      // Add new user
      users.push(user);
      storageService.saveUsers(users);
      storageService.setCurrentUser(user);
      onLogin(user);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <div className="flex justify-center">
            <Bug className="h-16 w-16 text-blue-600" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Bug Tracker
          </h2>
          <p className="mt-2 text-sm text-gray-600">Sign in to continue</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Your Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your name"
            />
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              Select Role
            </label>

            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setSelectedRole("developer")}
                className={`flex flex-col items-center justify-center p-4 border rounded-lg transition-all duration-200 
                  ${
                    selectedRole === "developer"
                      ? "bg-blue-50 border-blue-500 text-blue-700"
                      : "border-gray-300 hover:border-blue-400 hover:bg-blue-50"
                  }`}
              >
                <Users className="h-8 w-8 mb-2" />
                <span className="font-medium">Developer</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedRole("admin")}
                className={`flex flex-col items-center justify-center p-4 border rounded-lg transition-all duration-200 
                  ${
                    selectedRole === "admin"
                      ? "bg-blue-50 border-blue-500 text-blue-700"
                      : "border-gray-300 hover:border-blue-400 hover:bg-blue-50"
                  }`}
              >
                <Users className="h-8 w-8 mb-2" />
                <span className="font-medium">Admin</span>
              </button>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
