"use client";

import { Logout } from "./actions";
import { useEffect } from "react";

export default function LogoutPage() {
  useEffect(() => {
    Logout();
  });
  return (
    <>
      <p>Loging out</p>
    </>
  );
}
