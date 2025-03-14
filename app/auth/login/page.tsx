"use client";
import { useActionState } from "react";
import Login from "./actions";

export default function Login_page() {
  const [state, formAction] = useActionState(Login, "");

  return (
    <>
      <form action={formAction} className="flex h-screen">
        <div className="card w-96 bg-neutral shadow-sm m-auto">
          <div className="card-body">
            <h2 className="text-3xl text-center mb-3">Judge Login</h2>
            <input
              type="text"
              placeholder="Username"
              name="username"
              className="input w-full"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="input w-full"
            />
            <div className="mt-6">
              <button type="submit" className="btn btn-primary btn-block">
                login
              </button>
            </div>

            {state != "" && (
              <div role="alert" className="alert alert-error">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 shrink-0 stroke-current"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>Failed to login!</span>
              </div>
            )}
          </div>
        </div>
      </form>
    </>
  );
}
