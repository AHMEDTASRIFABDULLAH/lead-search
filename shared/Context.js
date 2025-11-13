"use client";
import React, { createContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

export const Context = createContext();

export const Provider = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [checkedToken, setCheckedToken] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUserRole(payload.role);
        setIsLoggedIn(true);
      } catch (err) {
        console.error("Invalid token:", err);
        localStorage.removeItem("token");
        setIsLoggedIn(false);
      }
    } else {
      setIsLoggedIn(false);
    }
    setCheckedToken(true);
  }, []);

  useEffect(() => {
    if (!checkedToken) return;

    if (isLoggedIn && pathname === "/login") {
      router.push("/");
      return;
    }

    const adminRoutes = ["/admin", "/admin/users", "/admin/settings"];
    if (adminRoutes.includes(pathname) && userRole !== "admin") {
      router.push("/access-denied");
      return;
    }
  }, [checkedToken, isLoggedIn, userRole, pathname, router]);

  const logout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setUserRole(null);
    router.push("/login");
  };

  if (isLoggedIn === null)
    return <div className="text-center mt-20">Loading...</div>;

  return (
    <Context.Provider
      value={{ isLoggedIn, setIsLoggedIn, userRole, setUserRole, logout }}
    >
      {children}
    </Context.Provider>
  );
};
