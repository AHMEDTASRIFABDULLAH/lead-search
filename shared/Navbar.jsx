"use client";
import { LogOut } from "lucide-react";
import { Context } from "./Context";
import { useContext } from "react";
import Link from "next/link";

export default function Navbar() {
  const auth = useContext(Context);
  if(!auth) return null;
  const { userRole, logout } = auth;
  
  return (
    <header className="bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
              Lead Search
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-zinc-500 dark:text-zinc-400  sm:block hidden">
                Logged in as
              </span>
              
              {userRole?.toLowerCase() === "user" && (
                <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100 capitalize">
                  {userRole}
                </span>
              )}

              {userRole?.toLowerCase() === "admin" && (
                <Link
                  href="/admin"
                  className="text-sm font-medium underline text-zinc-900 dark:text-zinc-100 hover:text-zinc-700 dark:hover:text-zinc-300 capitalize transition-colors"
                >
                  {userRole}
                </Link>
              )}
            </div>
            
            <button
              onClick={logout}
              className="inline-flex items-center gap-2 h-9 px-4 rounded-md text-sm font-medium text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}