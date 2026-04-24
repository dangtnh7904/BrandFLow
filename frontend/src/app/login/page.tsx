"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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

      // Lưu trữ token và user_id
      localStorage.setItem('brandflow_token', data.access_token);
      localStorage.setItem('brandflow_user_id', data.user_id);
      localStorage.setItem('brandflow_email', data.email);

      // Quét sạch sẽ rác tiến độ cũ của acc khác bị kẹt nếu user lỡ tắt trình duyệt mà không nhấn Đăng Xuất
      localStorage.removeItem('bf_ws_stage');
      localStorage.removeItem('bf_phase1_screen');
      localStorage.removeItem('bf_doc_text');

      // Chuyển hướng vào trang chính bằng Hard Reload (đảm bảo xóa trắng bộ nhớ đệm RAM của Zustand React)
      window.location.href = '/planning';
    } catch (err) {
      setError('Lỗi kết nối máy chủ');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg border border-slate-100">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900">
            {isRegister ? 'Tạo tài khoản mới' : 'Đăng nhập BrandFlow'}
          </h2>
          <p className="mt-2 text-center text-sm text-slate-600">
            {isRegister ? 'Đăng ký để tạo dự án marketing' : 'Đăng nhập vào tài khoản của bạn'}
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-rose-50 text-rose-500 p-3 rounded text-sm text-center">
              {error}
            </div>
          )}
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <input
                id="email-address"
                name="email"
                type="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-slate-300 placeholder-slate-500 text-slate-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Địa chỉ Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-slate-300 placeholder-slate-500 text-slate-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-md"
            >
              {loading ? 'Đang xử lý...' : (isRegister ? 'Đăng ký' : 'Đăng nhập')}
            </button>
          </div>
          
          <div className="text-center">
            <button
              type="button"
              className="text-indigo-600 text-sm hover:underline"
              onClick={() => setIsRegister(!isRegister)}
            >
              {isRegister ? 'Đã có tài khoản? Đăng nhập ngay' : 'Chưa có tài khoản? Đăng ký mới'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
