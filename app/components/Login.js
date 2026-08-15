import Link from "next/link";
export default function Login() {
  return (
    <div className="bg-gray-100 flex flex-col h-screen w-full items-center justify-center">
      <img src="/Logo/ToothPeakLogo.jpg" className="w-66 rounded-lg" />
      <p className="text-gray-400 text-sm">Secure Clinic Portal access</p>
      <div className="flex flex-col gap-2 bg-white border border-gray-300 border-t-4 border-t-[#00685F] rounded-lg p-8 w-96 mt-4">
        <p className="text-sm text-gray-600 items-center">Email or Staff ID</p>
        <input
          type="email"
          placeholder="user@toothpeaked.com"
          className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:border-[#00685F]"
        />
        <div className="flex justify-between mt-4">
          <p className="text-sm text-gray-600 items-center">Password</p>
        </div>
        <input
          type="password"
          placeholder="••••••••"
          className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:border-[#00685F]"
        />
        <div className="flex items-center gap-2">
          <input type="checkbox" id="remember" />
          <label htmlFor="remember" className="text-sm text-gray-600">
            Remember me on this device
          </label>
        </div>
        <Link href="/dashboard">
          <button className="w-full bg-[#00685F] text-white py-2 rounded-lg transition-all duration-100 active:scale-95 active:brightness-90 cursor-pointer">
            Secure Login
          </button>
        </Link>

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
