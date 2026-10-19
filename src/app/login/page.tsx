'use client';

import { useEffect, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import '@/styles/auth.css';

export default function Login() {
  const router = useRouter();
  const supabase = createClient();

  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupNama, setSignupNama] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('error') === 'oauth_failed') {
      setError('Login Google gagal. Silakan coba lagi.');
    }
  }, []);

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      setError(error.message);
      setGoogleLoading(false);
    }
  };

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
               GOOGLE OAUTH LOGIN
          ================================== */}

          <div
            style={{
              display: mode === 'login' ? 'block' : 'none',
            }}
          >

            <button
              className="btn btn-outline"
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
              }}
              onClick={handleGoogleLogin}
              disabled={googleLoading}
            >
              <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
                <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/>
                <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"/>
                <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/>
                <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"/>
              </svg>
              {googleLoading ? 'Loading...' : 'Login dengan Google'}
            </button>


            {/* Divider */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                margin: '16px 0',
                color: '#888',
                fontSize: 13,
              }}
            >
              <div style={{ flex: 1, height: 1, background: 'var(--line, #e5e7eb)' }} />
              atau
              <div style={{ flex: 1, height: 1, background: 'var(--line, #e5e7eb)' }} />
            </div>

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
