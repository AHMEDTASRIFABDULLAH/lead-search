"use client";
import { useState } from "react";
import { UserPlus, Mail, X, Lock, Loader2 } from "lucide-react";

export default function CreateUserModal({ isOpen, onClose }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    if (!email || !password) {
      setMessage("Email and password are required!");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("Authentication token not found. Please log in again.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/create-user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email,
          password,
          role: role.toLowerCase(),
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("User created successfully!");
        setEmail("");
        setPassword("");
        setRole("user");
      } else {
        setMessage(data.error || "Something went wrong");
      }
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-3 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-2 cursor-pointer">
            <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-zinc-900 dark:text-zinc-100" />
            </div>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              Create new users
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-2 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-500 dark:text-zinc-400 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-180px)] p-6 space-y-6">
          <div className="space-y-3">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input
                  type="email"
                  placeholder="user@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-10 pl-10 pr-3 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-md text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 focus:ring-offset-0"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-10 pl-10 pr-3 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-md text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 focus:ring-offset-0"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full h-10 px-3 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-md text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 focus:ring-offset-0"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {message && (
              <div
                className={`text-sm p-3 rounded-md ${
                  message.includes("successfully")
                    ? "bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800"
                    : "bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800"
                }`}
              >
                {message}
              </div>
            )}

            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="w-full h-10 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-md text-sm font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4 cursor-pointer" />
                  Create User
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
