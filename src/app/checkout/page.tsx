'use client';

import Link from 'next/link';
import '@/styles/checkout.css';

export default function Checkout() {
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

          <button
            className="icon-btn"
            onClick={() => {}}
          >
            🛍️
          </button>

        </div>

      </header>


      {/* =================================
           MAIN CONTENT
      ================================== */}

      <main
        className="main"
        style={{ marginLeft: 0, width: '100%' }}
      >

        <div className="container">


          {/* =================================
               PAGE TITLE
          ================================== */}

          <h1>
            Checkout
          </h1>


          {/* =================================
               CHECKOUT CONTENT
          ================================== */}

          <div className="checkout">


            {/* =================================
                 DATA PEMBELIAN
            ================================== */}

            <section className="panel">

              <h2>
                Data Pembelian
              </h2>


              {/* Nama */}
              <div className="field">

                <label>
                  Nama
                </label>

                <input
                  defaultValue="Rosa"
                  placeholder="Nama lengkap"
                />

              </div>


              {/* Email */}
              <div className="field">

                <label>
                  Email
                </label>

                <input
                  type="email"
                  defaultValue="rosa@example.com"
                />

              </div>


              {/* Metode Pembayaran */}
              <div className="field">

                <label>
                  Metode Pembayaran
                </label>


                {/* E-Wallet */}
                <div className="pay-option selected">
                  💳 E-Wallet
                </div>


                {/* Virtual Account */}
                <div className="pay-option">
                  🏦 Virtual Account
                </div>


                {/* QRIS */}
                <div className="pay-option">
                  📱 QRIS
                </div>

              </div>


              {/* Notice */}
              <div className="notice">

                🔒 Transaksi demo.
                Sistem nyata perlu payment gateway
                dan verifikasi keamanan.

              </div>

            </section>


            {/* =================================
                 RINGKASAN PEMBELIAN
            ================================== */}

            <aside className="panel">

              <h2>
                Ringkasan
              </h2>


              {/* Summary akan diisi oleh JavaScript */}
              {/* TODO: wire to Supabase purchase + points trigger */}
              <div id="summary">
                <div className="row">
                  <span>🎨 Canva Pro</span>
                  <b>Rp45.000</b>
                </div>

                <p className="muted">
                  Paket 30 hari · Seller PrimeStore
                </p>

                <hr
                  style={{
                    border: 0,
                    borderTop: '1px solid var(--line)',
                  }}
                />

                <div className="row">
                  <b>Total</b>
                  <strong className="price">
                    Rp45.000
                  </strong>
                </div>
              </div>


              {/* Tombol Pembayaran */}
              <button
                id="pay"
                className="btn btn-primary"
                style={{ width: '100%', marginTop: '18px' }}
              >
                Bayar Sekarang
              </button>

            </aside>


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
