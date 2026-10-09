'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import '@/styles/auth.css';

export default function Login() {
  const router = useRouter();
  const supabase = createClient();

  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupNama, setSignupNama] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email: loginEmail,
      password: loginPassword,
    });

    if (error) {
      setError(error.message);
    } else {
      router.push('/');
      router.refresh();
    }

    setLoading(false);
  };

  const handleSignup = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signUp({
      email: signupEmail,
      password: signupPassword,
      options: {
        data: {
          username: signupNama,
          full_name: signupNama,
        },
      },
    });

    if (error) {
      setError(error.message);
    } else {
      setSuccess('Akun berhasil dibuat. Cek email kamu untuk verifikasi.');
    }

    setLoading(false);
  };

  return (
    <>
      {/* =================================
           AUTHENTICATION PAGE
      ================================== */}

      <main className="auth-page">

        <div className="auth-card">


          {/* =================================
               LOGO
          ================================== */}

          <div className="auth-logo">
            pre<span>migo</span>.id
          </div>


          {/* =================================
               LOGIN / SIGN UP SWITCH
          ================================== */}

          <div className="switch">

            {/* Tombol Login */}
            <button
              className={mode === 'login' ? 'active' : undefined}
              onClick={() => {
                setMode('login');
                setError(null);
                setSuccess(null);
              }}
            >
              Login
            </button>


            {/* Tombol Sign Up */}
            <button
              className={mode === 'signup' ? 'active' : undefined}
              onClick={() => {
                setMode('signup');
                setError(null);
                setSuccess(null);
              }}
            >
              Sign Up
            </button>

          </div>


          {/* =================================
               LOGIN FORM
          ================================== */}

          <form
            id="loginForm"
            onSubmit={handleLogin}
            style={{
              display: mode === 'login' ? 'block' : 'none',
            }}
          >

            {/* Email */}
            <div className="field">

              <label>
                Email
              </label>

              <input
                type="email"
                required
                placeholder="nama@email.com"
                value={loginEmail}
                onChange={e => setLoginEmail(e.target.value)}
              />

            </div>


            {/* Password */}
            <div className="field">

              <label>
                Password
              </label>

              <input
                type="password"
                required
                placeholder="••••••••"
                value={loginPassword}
                onChange={e => setLoginPassword(e.target.value)}
              />

            </div>


            {/* Login Button */}
            <button
              className="btn btn-primary"
              style={{ width: '100%' }}
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Login'}
            </button>


            {/* Error / Success */}
            {error && (
              <p style={{ color: '#d33', textAlign: 'center', marginTop: 12 }}>
                {error}
              </p>
            )}

            {success && (
              <p style={{ color: '#2a7', textAlign: 'center', marginTop: 12 }}>
                {success}
              </p>
            )}

          </form>


          {/* =================================
               SIGN UP FORM
          ================================== */}

          <form
            id="signupForm"
            onSubmit={handleSignup}
            style={{
              display: mode === 'signup' ? 'block' : 'none',
            }}
          >

            {/* Nama */}
            <div className="field">

              <label>
                Nama
              </label>

              <input
                required
                value={signupNama}
                onChange={e => setSignupNama(e.target.value)}
              />

            </div>


            {/* Email */}
            <div className="field">

              <label>
                Email
              </label>

              <input
                type="email"
                required
                value={signupEmail}
                onChange={e => setSignupEmail(e.target.value)}
              />

            </div>


            {/* Password */}
            <div className="field">

              <label>
                Password
              </label>

              <input
                type="password"
                required
                value={signupPassword}
                onChange={e => setSignupPassword(e.target.value)}
              />

            </div>


            {/* Buat Akun Button */}
            <button
              className="btn btn-pink"
              style={{ width: '100%' }}
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Buat Akun'}
            </button>


            {/* Error / Success */}
            {error && (
              <p style={{ color: '#d33', textAlign: 'center', marginTop: 12 }}>
                {error}
              </p>
            )}

            {success && (
              <p style={{ color: '#2a7', textAlign: 'center', marginTop: 12 }}>
                {success}
              </p>
            )}

          </form>


          {/* =================================
               BACK TO HOME
          ================================== */}

          <p
            style={{
              textAlign: 'center',
              marginTop: '20px',
            }}
          >

            <Link
              className="muted"
              href="/"
            >
              ← Kembali ke beranda
            </Link>

          </p>

        </div>

      </main>


      {/* =================================
           TOAST NOTIFICATION
      ================================== */}

      <div
        id="toast"
        className="toast"
      />
    </>
  );
}
