'use client';

import Link from 'next/link';
import '@/styles/account.css';

export default function Reward() {
  return (
    <>
      {/* =================================
           HEADER / TOPBAR
      ================================== */}

      <header className="topbar">

        {/* Logo */}
        <Link className="logo" href="/">
          pre<span>migo</span>.id
        </Link>


        {/* Top Actions */}
        <div className="top-actions">

          {/* Tombol Beranda */}
          <button
            className="icon-btn"
            onClick={() => {}}
          >
            🏠
          </button>

        </div>

      </header>


      {/* =================================
           MAIN CONTENT
      ================================== */}

      <main
        className="main"
        style={{
          marginLeft: 0,
          width: '100%',
        }}
      >

        <div className="container">


          {/* =================================
               PAGE TITLE
          ================================== */}

          <h1>
            Poin Reward
          </h1>


          {/* =================================
               POINTS BALANCE
          ================================== */}

          <div className="points">

            <div className="muted">
              Saldo poin kamu
            </div>

            {/* TODO: replace with Supabase realtime */}
            <h2
              style={{
                fontSize: '42px',
                margin: '5px 0',
              }}
            >
              1.250 poin
            </h2>

            <p>
              260 poin lagi menuju voucher premium.
            </p>


            {/* Progress Bar */}
            <div className="progress">

              <span />

            </div>

          </div>


          {/* =================================
               REWARD SECTION
          ================================== */}

          <section className="section">

            <h2>
              Tukar Reward
            </h2>


            <div className="grid">


              {/* =================================
                   REWARD 1
              ================================== */}

              <div className="card">

                <div className="card-body">

                  <h3>
                    Voucher Rp10.000
                  </h3>

                  <p className="muted">
                    1.000 poin
                  </p>

                  <button
                    className="btn btn-primary redeem"
                  >
                    Tukar Poin
                  </button>

                </div>

              </div>


              {/* =================================
                   REWARD 2
              ================================== */}

              <div className="card">

                <div className="card-body">

                  <h3>
                    1 Bulan Music
                  </h3>

                  <p className="muted">
                    1.500 poin
                  </p>

                  <button
                    className="btn btn-primary redeem"
                  >
                    Tukar Poin
                  </button>

                </div>

              </div>


              {/* =================================
                   REWARD 3
              ================================== */}

              <div className="card">

                <div className="card-body">

                  <h3>
                    1 Bulan Education
                  </h3>

                  <p className="muted">
                    1.800 poin
                  </p>

                  <button
                    className="btn btn-primary redeem"
                  >
                    Tukar Poin
                  </button>

                </div>

              </div>

            </div>

          </section>


          {/* =================================
               REWARD NOTICE
          ================================== */}

          <div className="notice section">

            🎁 Poin diperoleh setelah transaksi selesai dan
            dapat ditukarkan dengan aplikasi premium tertentu
            sesuai syarat & ketentuan.

          </div>

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
