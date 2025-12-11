import React, { useState } from "react";
import "../css/AuthPage.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Background3D from "../components/Background3D";
import { X, Mail, Lock, User, ArrowRight } from "lucide-react";

export default function Register({ setUser, onClose }) {
  // Views: 'login', 'signup', 'forgot'
  const [view, setView] = useState("login");
  const [loading, setLoading] = useState(false);

  // Auth States
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [signupData, setSignupData] = useState({ name: "", email: "", password: "" });

  // Forgot Password State
  const [resetStep, setResetStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [resetEmail, setResetEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const backendURL = import.meta.env.VITE_BACKEND_URL || "https://planbackend-2.onrender.com";

  // Shared Styles
  const inputClass = "w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all";
  const labelClass = "block text-sm font-medium text-gray-300 mb-1 ml-1";

  // ============================================
  // HANDLERS
  // ============================================

  // LOGIN
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${backendURL}/api/login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("🎉 Welcome back!", { theme: "colored" });
        if (typeof setUser === "function") setUser(data.user);
        setTimeout(() => onClose(), 800);
      } else {
        toast.error(data.message || "Login failed", { theme: "colored" });
      }
    } catch (err) {
      toast.error("Network error.", { theme: "colored" });
    } finally {
      setLoading(false);
    }
  };

  // SIGNUP
  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${backendURL}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(signupData),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("🎉 Account created!", { theme: "colored" });
        setView("login");
      } else {
        toast.error(data.message || "Signup failed", { theme: "colored" });
      }
    } catch (err) {
      toast.error("Network error", { theme: "colored" });
    } finally {
      setLoading(false);
    }
  };

  // FORGOT: 1. Send OTP
  const sendOtp = async (e) => {
    e.preventDefault();
    if (!resetEmail) return toast.warning("Enter email");
    setLoading(true);
    try {
      const res = await fetch(`${backendURL}/api/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resetEmail }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("OTP Sent to " + resetEmail, { theme: "colored" });
        setResetStep(2);
      } else {
        toast.error(data.message, { theme: "colored" });
      }
    } catch (err) {
      toast.error("Error sending OTP", { theme: "colored" });
    } finally {
      setLoading(false);
    }
  };

  // FORGOT: 2. Verify OTP
  const verifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${backendURL}/api/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resetEmail, otp }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("OTP Verified!", { theme: "colored" });
        setResetStep(3);
      } else {
        toast.error(data.message, { theme: "colored" });
      }
    } catch (err) {
      toast.error("Error verifying OTP", { theme: "colored" });
    } finally {
      setLoading(false);
    }
  };

  // FORGOT: 3. Reset Password
  const resetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${backendURL}/api/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resetEmail, otp: otp, newPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Password Changed! Please Login.", { theme: "colored" });
        setView("login");
        setResetStep(1);
        setResetEmail("");
        setOtp("");
        setNewPassword("");
      } else {
        toast.error(data.message, { theme: "colored" });
      }
    } catch (err) {
      toast.error("Error resetting password", { theme: "colored" });
    } finally {
      setLoading(false);
    }
  };


  // ============================================
  // RENDER
  // ============================================

  const isSignup = view === "signup";
  const isForgot = view === "forgot";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={onClose} />

      {/* 3D Background Wrapper (Scoped) */}
      <div className="absolute inset-0 z-0 opacity-50 pointer-events-none overflow-hidden">
        <Background3D />
      </div>

      <ToastContainer position="top-center" autoClose={2000} theme="dark" />

      {/* CARD */}
      <div className="relative z-10 w-full max-w-4xl h-[600px] bg-slate-900/60 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden animate-scale-in flex">

        <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full bg-black/20 text-white/70 hover:bg-white/20 hover:text-white transition-all z-30">
          <X size={20} />
        </button>

        {/* ------------------------------------------------------------------
            LEFT PANEL (FORMS: Login / Forgot)
           ------------------------------------------------------------------- */}
        <div className={`absolute top-0 h-full w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center transition-all duration-700 ease-in-out z-10 ${isSignup ? "md:translate-x-full opacity-0 pointer-events-none md:opacity-100 md:pointer-events-auto" : "opacity-100" // simpler logic for overlap
          }`}>

          {/* If Forgot mode */}
          {isForgot ? (
            <div className="animate-fade-in space-y-6">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
                {resetStep === 1 ? "Forgot Password?" : resetStep === 2 ? "Enter OTP" : "Reset Password"}
              </h2>
              <p className="text-gray-400 mb-6">
                {resetStep === 1 ? "Don't worry, we'll send you a code." : resetStep === 2 ? `Code sent to ${resetEmail}` : "Secure your account with a new password."}
              </p>

              {/* STEP 1: EMAIL */}
              {resetStep === 1 && (
                <form onSubmit={sendOtp} className="space-y-4">
                  <div className="relative">
                    <Mail className="absolute left-3 top-3.5 text-white/40" size={18} />
                    <input type="email" required className={inputClass} placeholder="Enter your email" value={resetEmail} onChange={(e) => setResetEmail(e.target.value)} />
                  </div>
                  <button type="submit" disabled={loading} className="submit-btn">{loading ? "Sending..." : "Send OTP"}</button>
                </form>
              )}

              {/* STEP 2: OTP */}
              {resetStep === 2 && (
                <form onSubmit={verifyOtp} className="space-y-4">
                  <div className="flex justify-center gap-2 mb-4">
                    <input type="text" maxLength="6" className="w-full text-center tracking-[1em] text-2xl font-bold rounded-xl py-3 bg-white/10 border border-white/20 text-white outline-none focus:border-blue-500" placeholder="000000" value={otp} onChange={(e) => setOtp(e.target.value)} />
                  </div>
                  <button type="submit" disabled={loading} className="submit-btn">{loading ? "Verifying..." : "Verify OTP"}</button>
                </form>
              )}

              {/* STEP 3: NEW PASS */}
              {resetStep === 3 && (
                <form onSubmit={resetPassword} className="space-y-4">
                  <div className="relative">
                    <Lock className="absolute left-3 top-3.5 text-white/40" size={18} />
                    <input type="password" required className={inputClass} placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                  </div>
                  <button type="submit" disabled={loading} className="submit-btn">{loading ? "Saving..." : "Reset Password"}</button>
                </form>
              )}

              <button onClick={() => { setView("login"); setResetStep(1); }} className="w-full text-center text-sm text-gray-400 hover:text-white mt-4">
                Back to Login
              </button>
            </div>

          ) : (
            /* LOGIN FORM */
            !isSignup && (
              <form onSubmit={handleLogin} className="space-y-5 animate-fade-in">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">Welcome Back</h2>
                <p className="text-gray-400 mb-6">Sign in to continue planning.</p>

                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 text-white/40" size={18} />
                  <input type="email" required className={inputClass} placeholder="Email" value={loginData.email} onChange={(e) => setLoginData({ ...loginData, email: e.target.value })} />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="invisible">Label</span>
                    <button type="button" onClick={() => setView("forgot")} className="text-xs text-blue-400 hover:text-blue-300">Forgot Password?</button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3.5 text-white/40" size={18} />
                    <input type="password" required className={inputClass} placeholder="Password" value={loginData.password} onChange={(e) => setLoginData({ ...loginData, password: e.target.value })} />
                  </div>
                </div>

                <button type="submit" disabled={loading} className="submit-btn flex items-center justify-center gap-2">
                  {loading ? "Signing In..." : "Sign In"} <ArrowRight size={18} />
                </button>

                {/* Mobile Switcher */}
                <div className="mt-8 text-center text-sm text-gray-400 md:hidden">
                  Don&apos;t have an account? <button type="button" onClick={() => setView("signup")} className="text-white font-bold hover:underline">Sign Up</button>
                </div>
              </form>
            )
          )}

          {/* Overlapping SIGNUP form for Desktop Slide effect */}
          {isSignup && (
            <form onSubmit={handleSignup} className="space-y-4 animate-fade-in absolute w-full px-8 md:px-12 left-0">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">Create Account</h2>
              <p className="text-gray-400 mb-6">Join us to plan your next adventure!</p>

              <div className="relative">
                <User className="absolute left-3 top-3.5 text-white/40" size={18} />
                <input type="text" required className={inputClass} placeholder="Full Name" value={signupData.name} onChange={(e) => setSignupData({ ...signupData, name: e.target.value })} />
              </div>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 text-white/40" size={18} />
                <input type="email" required className={inputClass} placeholder="Email" value={signupData.email} onChange={(e) => setSignupData({ ...signupData, email: e.target.value })} />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 text-white/40" size={18} />
                <input type="password" required className={inputClass} placeholder="Password" value={signupData.password} onChange={(e) => setSignupData({ ...signupData, password: e.target.value })} />
              </div>

              <button type="submit" disabled={loading} className="submit-btn flex items-center justify-center gap-2">
                {loading ? "Creating..." : "Sign Up"} <ArrowRight size={18} />
              </button>
              {/* Mobile Switcher */}
              <div className="mt-8 text-center text-sm text-gray-400 md:hidden">
                Already have an account? <button type="button" onClick={() => setView("login")} className="text-white font-bold hover:underline">Sign In</button>
              </div>
            </form>
          )}

        </div>

        {/* ------------------------------------------------------------------
            OVERLAY PANEL (SLIDING 3D)
           ------------------------------------------------------------------- */}
        <div className={`hidden md:block absolute top-0 left-1/2 w-1/2 h-full overflow-hidden transition-transform duration-700 ease-in-out z-20 rounded-l-[100px] ${isSignup ? "-translate-x-full rounded-l-none rounded-r-[100px]" : ""
          }`}>
          <div className={`bg-gradient-to-br from-blue-900 via-slate-900 to-black w-[200%] h-full text-white relative -left-full transition-transform duration-700 ease-in-out flex items-center justify-center ${isSignup ? "translate-x-1/2" : "translate-x-0"
            }`}>
            {/* 3D SCENE */}
            <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none opacity-60">
              <div className="scene-3d">
                <div className="planet"></div>
                <div className="island-upgraded">
                  <div className="island-base"></div>
                  <div className="tree3d" style={{ left: '60px', bottom: '50px', transform: 'scale(1.2)' }}><div className="leaf"></div><div className="trunk"></div></div>
                  <div className="tree3d" style={{ left: '160px', bottom: '70px', transform: 'scale(0.9) rotateY(45deg)' }}><div className="leaf"></div><div className="trunk"></div></div>
                  <div className="tree3d" style={{ left: '200px', bottom: '40px', transform: 'scale(1.1) rotateY(-20deg)' }}><div className="leaf"></div><div className="trunk"></div></div>
                  <div className="cloud3d c1"></div><div className="cloud3d c2"></div><div className="cloud3d c3"></div>
                </div>
                <div className="airplane3d">✈️</div>
              </div>
            </div>

            {/* OVERLAY PANEL: RIGHT (For Login/Forgot View) */}
            <div className={`absolute top-0 right-0 w-1/2 h-full flex flex-col items-center justify-center p-12 text-center transform transition-transform duration-700 z-10 ${isSignup ? "translate-x-[20%]" : "translate-x-0"}`}>
              <div className="w-24 h-24 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6 text-4xl shadow-xl animate-float">👋</div>
              <h2 className="text-3xl font-bold mb-4 drop-shadow-md">New Here?</h2>
              <p className="text-white/80 mb-8 leading-relaxed drop-shadow-sm">Join us to plan your next adventure!</p>
              <button onClick={() => setView("signup")} className="px-8 py-3 rounded-full border-2 border-white text-white font-bold hover:bg-white hover:text-blue-900 transition-all shadow-lg hover:shadow-white/20">Sign Up</button>
            </div>

            {/* OVERLAY PANEL: LEFT (For Signup View) */}
            <div className={`absolute top-0 left-0 w-1/2 h-full flex flex-col items-center justify-center p-12 text-center transform transition-transform duration-700 z-10 ${isSignup ? "translate-x-0" : "-translate-x-[20%]"}`}>
              <div className="w-24 h-24 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6 text-4xl shadow-xl animate-float" style={{ animationDelay: '1s' }}>🔐</div>
              <h2 className="text-3xl font-bold mb-4 drop-shadow-md">Welcome Back!</h2>
              <p className="text-white/80 mb-8 leading-relaxed drop-shadow-sm">Sign in to acccess your account.</p>
              <button onClick={() => setView("login")} className="px-8 py-3 rounded-full border-2 border-white text-white font-bold hover:bg-white hover:text-blue-900 transition-all shadow-lg hover:shadow-white/20">Sign In</button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
