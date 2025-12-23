"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

export default function Navigation() {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is logged in by checking localStorage
    if (typeof window !== "undefined") {
      const token = window.localStorage.getItem("es_auth_token");
      const name = window.localStorage.getItem("es_user_name");
      setIsLoggedIn(!!token);
      setUserName(name);
    }
  }, [pathname]); // Re-check on route change

  function handleLogout() {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("es_auth_token");
      window.localStorage.removeItem("es_user_name");
      setIsLoggedIn(false);
      setUserName(null);
      // Redirect to login page
      router.push("/login");
      // Refresh to ensure all components update
      router.refresh();
    }
  }

  return (
    <nav className="flex items-center gap-4 text-base font-semibold">
      <Link
        href="/knowledge-base"
        className="rounded-full px-3 py-1.5 text-slate-900 hover:bg-slate-100 cursor-pointer"
      >
        Knowledge Base
      </Link>
      {isLoggedIn ? (
        <>
          {userName && (
            <span className="text-sm font-medium text-slate-700">
              {userName}
            </span>
          )}
          <button
            onClick={handleLogout}
            className="rounded-full px-3 py-1.5 text-slate-900 hover:bg-slate-100 cursor-pointer"
          >
            Logout
          </button>
        </>
      ) : (
        <Link
          href="/login"
          className="rounded-full px-3 py-1.5 text-slate-900 hover:bg-slate-100 cursor-pointer"
        >
          Login
        </Link>
      )}
      <Link
        href="/risk-detector"
        className="rounded-full bg-blue-600 px-4 py-1.5 font-bold text-white shadow-sm hover:bg-blue-700 cursor-pointer"
      >
        Risk Detector
      </Link>
    </nav>
  );
}

