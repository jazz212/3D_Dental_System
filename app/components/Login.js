"use client";
import Link from "next/link";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      setErrorMsg(error.message);

      return;
    }
    setErrorMsg("");
    router.push("/dashboard");
  };
  return (
    <div className="bg-gray-100 flex flex-col h-screen w-full items-center justify-center">
      <img src="/Logo/ToothPeakLogo.jpg" className="w-66 rounded-lg" />
      <p className="text-gray-400 text-sm">Secure Clinic Portal access</p>
      <div className="flex flex-col gap-2 bg-white border border-gray-300 border-t-4 border-t-[#00685F] rounded-lg p-8 w-96 mt-4">
        <p className="text-sm text-gray-600 items-center">Email or Staff ID</p>
        <input
          type="email"
          placeholder="user@toothpeaked.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:border-[#00685F]"
        />
        <div className="flex justify-between mt-4">
          <p className="text-sm text-gray-600 items-center">Password</p>
        </div>
        <input
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:border-[#00685F]"
        />
        <div className="flex items-center gap-2">
          <input type="checkbox" id="remember" />
          <label htmlFor="remember" className="text-sm text-gray-600">
            Remember me on this device
          </label>
        </div>
        {errorMsg && (
          <p className="text-sm text-red-600 text-center animate-pulse ">
            {errorMsg}
          </p>
        )}
        <button
          onClick={handleLogin}
          className="w-full bg-[#00685F] text-white py-2 rounded-lg transition-all duration-100 active:scale-95 active:brightness-90 cursor-pointer"
        >
          Secure Login
        </button>

        <Link
          href="/forgotpass"
          className="flex text-sm text-gray-600 items-center justify-center"
        >
          Forgot-Password?
        </Link>
        <div className="border-t border-gray-200 pt-4 text-center">
          <p className="text-sm text-gray-500">
            Need system support? Contact{" "}
            <Link href="/helpdesk">
              <span className="text-[#00685F]">IT Helpdesk</span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
