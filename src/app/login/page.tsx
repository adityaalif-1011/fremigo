'use client';

import Link from 'next/link';
import '@/styles/auth.css';

export default function Login() {
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
            pri<span>mogo</span>.id
          </div>


          {/* =================================
               LOGIN / SIGN UP SWITCH
          ================================== */}

          <div className="switch">

            {/* Tombol Login */}
            <button
              className="active"
              onClick={() => {}}
            >
              Login
            </button>


            {/* Tombol Sign Up */}
            <button
              onClick={() => {}}
            >
              Sign Up
            </button>

          </div>


          {/* =================================
               LOGIN FORM
          ================================== */}

          {/* TODO: wire to Supabase Auth */}
          <form id="loginForm">

            {/* Email */}
            <div className="field">

              <label>
                Email
              </label>

              <input
                type="email"
                required
                placeholder="nama@email.com"
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
              />

            </div>


            {/* Login Button */}
            <button
              className="btn btn-primary"
              style={{ width: '100%' }}
            >
              Login
            </button>


            {/* Demo Information */}
            <p
              className="muted"
              style={{ textAlign: 'center' }}
            >
              Demo UI — belum terhubung database.
            </p>

          </form>


          {/* =================================
               SIGN UP FORM
          ================================== */}

          {/* TODO: wire to Supabase Auth */}
          <form
            id="signupForm"
            style={{ display: 'none' }}
          >

            {/* Nama */}
            <div className="field">

              <label>
                Nama
              </label>

              <input
                required
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
              />

            </div>


            {/* Buat Akun Button */}
            <button
              className="btn btn-pink"
              style={{ width: '100%' }}
            >
              Buat Akun
            </button>

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
