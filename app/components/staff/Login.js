"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState("");
  const [signingIn, setSigningIn] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setSigningIn(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      // One message for every failure: Supabase's own text (e.g. "Email not
      // confirmed") would tell a stranger which accounts exist.
      console.error("Sign-in failed:", error.message);
      setErrorMsg("Incorrect email or password.");
      setSigningIn(false);
      return;
    }
    setErrorMsg("");
    router.push("/dashboard");
  };
  return (
    // min-h-dvh + py: on short phone screens the card can scroll instead of
    // being cut off; px-4 keeps it off the screen edges.
    <div className="bg-gray-100 flex flex-col min-h-dvh w-full items-center justify-center px-4 py-8">
      <img
        src="/Logo/ToothPeakLogo.jpg"
        alt="ToothPeak Dental Clinic"
        className="w-66 max-w-full rounded-lg"
      />
      <p className="text-gray-400 text-sm">Secure Clinic Portal access</p>
      {/* A real form: Enter submits once, and password managers recognise it */}
      <form
        onSubmit={handleLogin}
        className="flex flex-col gap-2 bg-white border border-gray-300 border-t-4 border-t-[#00685F] rounded-lg p-6 sm:p-8 w-full max-w-96 mt-4"
      >
        <label htmlFor="login-email" className="text-sm text-gray-600 items-center">
          Email or Staff ID
        </label>
        <input
          id="login-email"
          type="email"
          autoComplete="username"
          placeholder="user@toothpeaked.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:border-[#00685F]"
        />
        <div className="flex justify-between mt-4">
          <label htmlFor="login-password" className="text-sm text-gray-600 items-center">
            Password
          </label>
        </div>
        <input
          id="login-password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:border-[#00685F]"
        />
        {errorMsg && (
          <p role="alert" className="text-sm text-red-600 text-center animate-pulse ">
            {errorMsg}
          </p>
        )}
        <button
          type="submit"
          disabled={signingIn}
          className="w-full bg-[#00685F] text-white py-2 rounded-lg transition-all duration-100 active:scale-95 active:brightness-90 cursor-pointer disabled:opacity-70 disabled:cursor-wait"
        >
          {signingIn ? "Signing in..." : "Secure Login"}
        </button>

      </form>
    </div>
  );
}
