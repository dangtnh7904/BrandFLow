"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, Hexagon, Loader2 } from 'lucide-react';
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID";
const FACEBOOK_APP_ID = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || "YOUR_FACEBOOK_APP_ID";

function LoginForm() {
  const [email, setEmail] = useState('admin@brandflow.ai');
  const [password, setPassword] = useState('admin');
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<'google' | 'facebook' | null>(null);
  const router = useRouter();

  const handleSocialBackendAuth = async (token: string, provider: 'google' | 'facebook') => {
    try {
      const res = await fetch('/api/v1/auth/social', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, provider })
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.detail || `Lỗi xác thực ${provider}`);
        setSocialLoading(null);
        return;
      }

      localStorage.setItem('brandflow_token', data.access_token);
      localStorage.setItem('brandflow_user_id', data.user_id);
      localStorage.setItem('brandflow_email', data.email);
      localStorage.removeItem('bf_ws_stage');
      
      window.location.href = '/planning';
    } catch (err) {
      setError(`Lỗi kết nối máy chủ khi đăng nhập ${provider}`);
      setSocialLoading(null);
    }
  };

  const loginWithGoogle = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      setSocialLoading('google');
      handleSocialBackendAuth(tokenResponse.access_token, 'google');
    },
    onError: () => {
      setError('Đăng nhập Google thất bại');
      setSocialLoading(null);
    }
  });

  const responseFacebook = (response: any) => {
    if (response.accessToken) {
       setSocialLoading('facebook');
       handleSocialBackendAuth(response.accessToken, 'facebook');
    } else {
       setError('Đăng nhập Facebook thất bại');
       setSocialLoading(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const endpoint = isRegister ? '/api/v1/auth/register' : '/api/v1/auth/login';
    
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.detail || 'Có lỗi xảy ra');
        setLoading(false);
        return;
      }

      // Lưu trữ token
      localStorage.setItem('brandflow_token', data.access_token);
      localStorage.setItem('brandflow_user_id', data.user_id);
      localStorage.setItem('brandflow_email', data.email);

      // Xóa cache rác
      localStorage.removeItem('bf_ws_stage');
      localStorage.removeItem('bf_phase1_screen');
      localStorage.removeItem('bf_doc_text');

      window.location.href = '/planning';
    } catch (err) {
      setError('Lỗi kết nối máy chủ');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafafa] dark:bg-[#0B1120] p-4 relative overflow-hidden font-sans">
      {/* Background Orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-cyan-400/10 dark:bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[800px] h-[800px] bg-indigo-500/10 dark:bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-[420px] relative z-10"
      >
        {/* Logo/Brand Area */}
        <div className="text-center mb-10 flex flex-col items-center">
          <motion.div 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="w-14 h-14 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl flex items-center justify-center mb-5 shadow-xl shadow-blue-500/20 ring-1 ring-white/10"
          >
            <Hexagon className="w-7 h-7 text-white fill-white/20" />
          </motion.div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
            Welcome to BrandFlow
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            {isRegister ? 'Tạo tài khoản mới để bắt đầu' : 'Đăng nhập để tiếp tục vào Workspace'}
          </p>
        </div>

        {/* Card */}
        <div className="bg-white/80 dark:bg-[#111827]/80 backdrop-blur-2xl p-8 rounded-[2rem] border border-slate-200/60 dark:border-slate-800/60 shadow-[0_8px_40px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_40px_rgba(0,0,0,0.4)]">
          
          {/* Social Logins */}
          <div className="space-y-3 mb-8">
            <button
              type="button"
              onClick={() => loginWithGoogle()}
              disabled={socialLoading !== null}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white dark:bg-[#1f2937] border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 transition-all focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-700 disabled:opacity-70"
            >
              {socialLoading === 'google' ? <Loader2 className="w-5 h-5 animate-spin text-slate-500" /> : (
                <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
                  <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                    <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/>
                    <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/>
                    <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/>
                    <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/>
                  </g>
                </svg>
              )}
              Tiếp tục với Google
            </button>
            
            <FacebookLogin
              appId={FACEBOOK_APP_ID}
              callback={responseFacebook}
              fields="name,email,picture"
              render={(renderProps: any) => (
                <button
                  type="button"
                  onClick={renderProps.onClick}
                  disabled={socialLoading !== null}
                  className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white dark:bg-[#1f2937] border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 transition-all focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-700 disabled:opacity-70"
                >
                  {socialLoading === 'facebook' ? <Loader2 className="w-5 h-5 animate-spin text-slate-500" /> : (
                    <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
                      <path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  )}
                  Tiếp tục với Facebook
                </button>
              )}
            />
          </div>

          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase tracking-widest font-semibold">
              <span className="px-3 bg-white dark:bg-[#111827] text-slate-400">Hoặc email</span>
            </div>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 text-red-600 dark:text-red-400 p-3 rounded-xl text-sm flex items-center gap-2"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                {error}
              </motion.div>
            )}

            <div className="space-y-4">
              <div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-slate-400" />
                  </div>
                  <input
                    type="email"
                    required
                    className="block w-full pl-11 pr-4 py-3.5 bg-slate-50/50 dark:bg-[#0B1120]/50 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-sm font-medium"
                    placeholder="Địa chỉ Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-slate-400" />
                  </div>
                  <input
                    type="password"
                    required
                    className="block w-full pl-11 pr-4 py-3.5 bg-slate-50/50 dark:bg-[#0B1120]/50 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-sm font-medium"
                    placeholder="Mật khẩu"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center items-center py-3.5 px-4 text-sm font-bold rounded-xl text-white bg-slate-900 dark:bg-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Đang xử lý...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  {isRegister ? 'Đăng ký ngay' : 'Đăng nhập'}
                </div>
              )}
            </button>

            <div className="text-center mt-6 pt-2">
              <button
                type="button"
                className="text-sm font-medium text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 transition-colors"
                onClick={() => {
                  setIsRegister(!isRegister);
                  setError('');
                }}
              >
                {isRegister ? 'Đã có tài khoản? Đăng nhập' : 'Chưa có tài khoản? Tạo mới'}
              </button>
            </div>
          </form>
        </div>
        
        {/* Footer */}
        <p className="text-center text-xs text-slate-400 dark:text-slate-500 mt-8 font-medium">
          © 2026 BrandFlow AI. Protected by Advanced SSL.
        </p>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <LoginForm />
    </GoogleOAuthProvider>
  );
}
