"use client";

import { redirect } from "next/navigation";
import { logout } from "./actions";
import { useEffect } from "react";

export default async function logoutPage() {
  useEffect(() => {
    logout();
  }, []);
  return (
    <>
      <p>Loging out</p>
    </>
  );
}
