import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { User, Lock, Mail, ArrowRight, Eye, EyeOff } from "lucide-react";
import { authAPI } from "../services/api"; // Import the API service

const AuthPage = () => {
  const [showLogin, setShowLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleLoginChange = (e) =>
    setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
  const handleRegisterChange = (e) =>
    setRegisterForm({ ...registerForm, [e.target.name]: e.target.value });

  const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await authAPI.login(loginForm.email, loginForm.password);

      if (data._id) {
        localStorage.setItem("user", JSON.stringify(data));
        navigate("/dashboard");
      } else {
        alert(data.message || "Login failed");
      }
    } catch (err) {
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await authAPI.register(
        registerForm.name,
        registerForm.email,
        registerForm.password
      );

      if (data.success) {
        alert("Registration successful!");
        setShowLogin(true);
        setRegisterForm({ name: "", email: "", password: "" });
      } else {
        alert(data.message || "Registration failed");
      }
    } catch (err) {
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  const switchToRegister = () => setShowLogin(false);
  const switchToLogin = () => setShowLogin(true);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-blue-50 relative overflow-hidden">
      <div className="relative w-full max-w-md bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
        {/* Brand Logo Header */}
        <div className="pt-8 px-8 flex flex-col items-center">
          <div className="flex items-center gap-3">
            <img
              src="/logo 2.png"
              alt="Brand Logo"
              className="w-12 h-12 object-contain"
            />
            <div className="flex flex-col">
              <span className="text-lg font-semibold text-[#023E8A]">
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
              <div className="bg-gradient-to-br from-blue-100 to-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-blue-600" />
              </div>
              <h1 className="text-2xl font-bold bg-[#023E8A] bg-clip-text text-transparent mb-2">
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
                className="group/submit relative w-full bg-[#023E8A] text-white py-4 rounded-xl font-semibold hover transition-all duration-300 shadow-lg hover:shadow-blue-500/25 hover:shadow-xl transform hover:scale-[1.02] overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Sign In
                  <ArrowRight className="w-5 h-5 transition-transform group-hover/submit:translate-x-1" />
                </span>
                <div className="absolute inset-0 bg-[#023E8A] transform scale-x-0 group-hover/submit:scale-x-100 transition-transform duration-300 origin-left"></div>
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-gray-600 mb-4">Don't have an account?</p>
              <button
                onClick={switchToRegister}
                className="group/switch relative text-[#023E8A] hover:text-blue-700 font-semibold transition-all duration-300 hover:scale-105"
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
              <div className="bg-gradient-to-br from-blue-100 to-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-blue-600" />
              </div>
              <h1 className="text-2xl font-bold bg-[#023E8A] bg-clip-text text-transparent mb-2">
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
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500 transition-colors group-hover/input:text-blue-600"
                    size={20}
                  />
                  <input
                    name="name"
                    type="text"
                    value={registerForm.name}
                    onChange={handleRegisterChange}
                    required
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-gray-900 placeholder-gray-500 hover:bg-white hover:border-blue-400"
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
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500 transition-colors group-hover/input:text-blue-600"
                    size={20}
                  />
                  <input
                    name="email"
                    type="email"
                    value={registerForm.email}
                    onChange={handleRegisterChange}
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
                    type={showRegPassword ? "text" : "password"}
                    value={registerForm.password}
                    onChange={handleRegisterChange}
                    required
                    className="w-full pl-12 pr-12 py-4 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-gray-900 placeholder-gray-500 hover:bg-white hover:border-blue-400"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegPassword(!showRegPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-500 transition-colors"
                  >
                    {showRegPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="group/submit relative w-full bg-[#023E8A] text-white py-4 rounded-xl font-semibold hover transition-all duration-300 shadow-lg hover:shadow-blue-500/25 hover:shadow-xl transform hover:scale-[1.02] overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Register
                  <ArrowRight className="w-5 h-5 transition-transform group-hover/submit:translate-x-1" />
                </span>
                <div className="absolute inset-0 bg-[#023E8A] group-hover/submit:scale-x-100 transition-transform duration-300 origin-left"></div>
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-gray-600 mb-4">Already have an account?</p>
              <button
                onClick={switchToLogin}
                className="group/switch relative text-[#023E8A] hover:text-blue-700 font-semibold transition-all duration-300 hover:scale-105"
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
      
            {/* add mock data to login align data in right side */}
            <div className="absolute bottom-10 right-6 text-sm text-gray-500 text-right">
              <p>Mock Login Data:</p>
              <p>Email:testaccount@gmail.com</p>
              <p>Password:testaccount123</p>
            </div>
    </div>
    
  );
};

export default AuthPage;
