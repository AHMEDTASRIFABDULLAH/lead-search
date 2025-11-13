"use client";
import React, { useState, useContext } from "react";
import { User, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Context } from "@/shared/Context";

export default function Login({ showNotification }) {
  const router = useRouter();

  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginForm),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        const payload = JSON.parse(atob(data.token.split(".")[1]));
        setUserRole(payload.role);
        setIsLoggedIn(true);

        showNotification(`Logged in as ${payload.role}`, "success");
        router.push("/");
      } else {
        setError(data.error || "Invalid credentials");
        setLoginForm({ email: "", password: "" });
      }
    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  };
  const auth = useContext(Context);
  if (!auth) return null;
  const { setIsLoggedIn, setUserRole } = auth;
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-8 w-full max-w-md shadow-sm">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mx-auto mb-4">
            <User className="w-6 h-6 text-zinc-900 dark:text-zinc-100" />
          </div>
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
            Lead Search
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Sign in to access the database
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Email
            </label>
            <input
              type="email"
              value={loginForm.email}
              onChange={(e) =>
                setLoginForm({ ...loginForm, email: e.target.value })
              }
              className="w-full h-10 px-3 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-md text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 focus:ring-offset-0 transition-all disabled:opacity-50"
              placeholder="Enter email"
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Password
            </label>
            <input
              type="password"
              value={loginForm.password}
              onChange={(e) =>
                setLoginForm({ ...loginForm, password: e.target.value })
              }
              className="w-full h-10 px-3 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-md text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 focus:ring-offset-0 transition-all disabled:opacity-50"
              placeholder="Enter password"
              required
              disabled={loading}
            />
          </div>

          {error && (
            <div className="p-3 rounded-md bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800">
              <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
            </div>
          )}

          <button
            type="submit"
            className="w-full h-10 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-md text-sm font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
