import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { User, Lock, Mail, ArrowRight, Eye, EyeOff } from "lucide-react";

const AuthPage = () => {
  const [showLogin, setShowLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showRegPassword, setShowRegPassword] = useState(false);

  // Form states
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  // Handlers
  const handleLoginChange = (e) =>
    setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
  const handleRegisterChange = (e) =>
    setRegisterForm({ ...registerForm, [e.target.name]: e.target.value });

  const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${import.meta.env.REACT_APP_BACKEND_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginForm),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("user", JSON.stringify(data)); // Save user info
        navigate("/dashboard");
      } else {
        alert(data.message || "Login failed");
      }
    } catch (err) {
      alert("Server error");
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${import.meta.env.REACT_APP_BACKEND_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: registerForm.name,
          email: registerForm.email,
          password: registerForm.password,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        alert("Registration successful!");
        setShowLogin(true); // Show login form after registration
      } else {
        alert(data.message || "Registration failed");
      }
    } catch (err) {
      alert("Server error");
    }
  };

  const switchToRegister = () => setShowLogin(false);
  const switchToLogin = () => setShowLogin(true);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:20px_20px]"></div>

      <div className="relative w-full max-w-md bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
        {/* Subtle Tech Grid Lines */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.05)_1px,transparent_1px)] bg-[size:40px_40px] opacity-30"></div>

        {/* Brand Logo Header */}
        <div className="pt-8 px-8 flex flex-col items-center">
          <div className="flex items-center gap-3">
            <img
              src="/logo 2.png"
              alt="Brand Logo"
              className="w-12 h-12 object-contain"
            />
            <div className="flex flex-col">
              <span className="text-lg font-semibold text-gray-800">
                Marketing Management
              </span>
              <span className="text-xs text-gray-500 -mt-1">System</span>
            </div>
          </div>
        </div>

        {/* Login Page */}
        {showLogin && (
          <div className="p-8 transition-all duration-700 ease-in-out transform relative z-10">
            <div className="text-center mb-6">
              <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-blue-600" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent mb-2">
                Welcome Back
              </h1>
              <p className="text-gray-600">
                Sign in to your account to continue
              </p>
            </div>

            <form className="space-y-6" onSubmit={handleLoginSubmit}>
              <div className="group/input">
                <label className="block text-gray-700 mb-2 font-medium">
                  Email Address
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500 transition-colors group-hover/input:text-blue-600"
                    size={20}
                  />
                  <input
                    name="email"
                    type="email"
                    value={loginForm.email}
                    onChange={handleLoginChange}
                    required
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-gray-900 placeholder-gray-500 hover:bg-white hover:border-blue-400"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div className="group/input">
                <label className="block text-gray-700 mb-2 font-medium">
                  Password
                </label>
                <div className="relative">
                  <Lock
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500 transition-colors group-hover/input:text-blue-600"
                    size={20}
                  />
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={loginForm.password}
                    onChange={handleLoginChange}
                    required
                    className="w-full pl-12 pr-12 py-4 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-gray-900 placeholder-gray-500 hover:bg-white hover:border-blue-400"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-500 transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="group/submit relative w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-blue-500/25 hover:shadow-xl transform hover:scale-[1.02] overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Sign In
                  <ArrowRight className="w-5 h-5 transition-transform group-hover/submit:translate-x-1" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 transform scale-x-0 group-hover/submit:scale-x-100 transition-transform duration-300 origin-left"></div>
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-gray-600 mb-4">Don't have an account?</p>
              <button
                onClick={switchToRegister}
                className="group/switch relative text-blue-600 hover:text-blue-700 font-semibold transition-all duration-300 hover:scale-105"
              >
                <span className="flex items-center justify-center gap-2">
                  Create Account
                  <ArrowRight className="w-4 h-4 transition-transform group-hover/switch:translate-x-1" />
                </span>
              </button>
            </div>
          </div>
        )}

        {/* Register Page */}
        {!showLogin && (
          <div className="p-8 transition-all duration-700 ease-in-out transform relative z-10">
            <div className="text-center mb-6">
              <div className="bg-gradient-to-br from-purple-100 to-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-purple-600" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-purple-800 bg-clip-text text-transparent mb-2">
                Join Us Today
              </h1>
              <p className="text-gray-600">
                Create your account to get started
              </p>
            </div>

            <form className="space-y-6" onSubmit={handleRegisterSubmit}>
              <div className="group/input">
                <label className="block text-gray-700 mb-2 font-medium">
                  Full Name
                </label>
                <div className="relative">
                  <User
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-500 transition-colors group-hover/input:text-purple-600"
                    size={20}
                  />
                  <input
                    name="name"
                    type="text"
                    value={registerForm.name}
                    onChange={handleRegisterChange}
                    required
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-gray-900 placeholder-gray-500 hover:bg-white hover:border-purple-400"
                    placeholder="Your full name"
                  />
                </div>
              </div>

              <div className="group/input">
                <label className="block text-gray-700 mb-2 font-medium">
                  Email Address
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-500 transition-colors group-hover/input:text-purple-600"
                    size={20}
                  />
                  <input
                    name="email"
                    type="email"
                    value={registerForm.email}
                    onChange={handleRegisterChange}
                    required
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-gray-900 placeholder-gray-500 hover:bg-white hover:border-purple-400"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div className="group/input">
                <label className="block text-gray-700 mb-2 font-medium">
                  Password
                </label>
                <div className="relative">
                  <Lock
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-500 transition-colors group-hover/input:text-purple-600"
                    size={20}
                  />
                  <input
                    name="password"
                    type={showRegPassword ? "text" : "password"}
                    value={registerForm.password}
                    onChange={handleRegisterChange}
                    required
                    className="w-full pl-12 pr-12 py-4 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-gray-900 placeholder-gray-500 hover:bg-white hover:border-purple-400"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegPassword(!showRegPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-purple-500 transition-colors"
                  >
                    {showRegPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="group/submit relative w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-purple-500/25 hover:shadow-xl transform hover:scale-[1.02] overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Register
                  <ArrowRight className="w-5 h-5 transition-transform group-hover/submit:translate-x-1" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 transform scale-x-0 group-hover/submit:scale-x-100 transition-transform duration-300 origin-left"></div>
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-gray-600 mb-4">Already have an account?</p>
              <button
                onClick={switchToLogin}
                className="group/switch relative text-purple-600 hover:text-purple-700 font-semibold transition-all duration-300 hover:scale-105"
              >
                <span className="flex items-center justify-center gap-2">
                  Sign In
                  <ArrowRight className="w-4 h-4 transition-transform group-hover/switch:translate-x-1" />
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthPage;
