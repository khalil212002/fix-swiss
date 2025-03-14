"use client";
import Link from "next/link";
import { RefObject, useRef } from "react";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const drawerToggle: RefObject<HTMLInputElement | null> = useRef(null);
  return (
    <>
      <div className="drawer lg:drawer-open">
        <input
          id="my-drawer-2"
          ref={drawerToggle}
          type="checkbox"
          className="drawer-toggle"
        />

        <div className="drawer-content">
          <div className="navbar bg-base-100 shadow-lg">
            <div className="flex-none">
              <button
                className="btn btn-square btn-ghost lg:hidden"
                onClick={() => {
                  if (drawerToggle.current)
                    drawerToggle.current.checked =
                      !drawerToggle.current.checked;
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="inline-block h-5 w-5 stroke-current"
                >
                  {" "}
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  ></path>{" "}
                </svg>
              </button>
            </div>
            <div className="flex-1">
              <Link href={"/dashboard"} className="btn btn-ghost text-xl">
                Fix Swiss
              </Link>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center">
            {children}
          </div>
        </div>
        <div className="drawer-side">
          <label
            htmlFor="my-drawer-2"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
            <li>
              <Link href={"/dashboard/players"}>Players</Link>
            </li>
            <li>
              <Link href={"/dashboard/games"}>Games</Link>
            </li>
            <li>
              <Link href={"#"}>Users</Link>
            </li>
            <div className="divider"></div>
            <li>
              <Link href={"/auth/logout"}>Logout</Link>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
