'use client';

import Link from 'next/link';
import '@/styles/account.css';

export default function Riwayat() {
  return (
    <>
      <header className="topbar">

        <Link className="logo" href="/">
          pre<span>migo</span>.id
        </Link>

        <div className="top-actions">

          <button
            className="icon-btn"
            onClick={() => {}}
          >
            🔔
          </button>

          <button
            className="icon-btn"
            onClick={() => {}}
          >
            🏠
          </button>

        </div>

      </header>


      <div className="layout">

        <aside className="sidebar">

          <Link
            className="side-link"
            href="/"
          >
            🏠
            <span>
              Beranda
            </span>
          </Link>

          <Link
            className="side-link"
            href="/katalog"
          >
            🛍️
            <span>
              Katalog
            </span>
          </Link>

          <Link
            className="side-link"
            href="/compare"
          >
            ⚖️
            <span>
              Bandingkan
            </span>
          </Link>

          <Link
            className="side-link active"
            href="/riwayat"
          >
            🧾
            <span>
              Riwayat
            </span>
          </Link>

          <Link
            className="side-link"
            href="/notifications"
          >
            🔔
            <span>
              Notifikasi
            </span>
          </Link>

          <Link
            className="side-link"
            href="/reward"
          >
            🎁
            <span>
              Poin Reward
            </span>
          </Link>

        </aside>


        <main className="main">

          <div className="container">

            <h1>
              Riwayat Pesanan
            </h1>


            <div className="stats">

              <div className="stat">
                Pesanan
                <strong>
                  3
                </strong>
              </div>

              <div className="stat">
                Aktif
                <strong>
                  2
                </strong>
              </div>

              <div className="stat">
                Poin
                <strong>
                  1.240
                </strong>
              </div>

              <div className="stat">
                Berakhir terdekat
                <strong>
                  3 hari
                </strong>
              </div>

            </div>


            <section className="section">

              <div className="table-wrap">

                <table className="table">

                  <thead>

                    <tr>
                      <th>
                        ID
                      </th>

                      <th>
                        Produk
                      </th>

                      <th>
                        Durasi
                      </th>

                      <th>
                        Tanggal
                      </th>

                      <th>
                        Status
                      </th>
                    </tr>

                  </thead>


                  {/* TODO: replace with Supabase purchase history */}
                  <tbody id="orders">

                    <tr>
                      <td>
                        #PM-28174
                      </td>

                      <td>
                        Canva Pro
                      </td>

                      <td>
                        30 hari
                      </td>

                      <td>
                        1 Okt 2026
                      </td>

                      <td>
                        Aktif · 3 hari lagi
                      </td>
                    </tr>

                    <tr>
                      <td>
                        #PM-28102
                      </td>

                      <td>
                        Spotify Premium
                      </td>

                      <td>
                        30 hari
                      </td>

                      <td>
                        15 Sep 2026
                      </td>

                      <td>
                        Aktif
                      </td>
                    </tr>

                    <tr>
                      <td>
                        #PM-27988
                      </td>

                      <td>
                        Duolingo Super
                      </td>

                      <td>
                        30 hari
                      </td>

                      <td>
                        20 Agu 2026
                      </td>

                      <td>
                        Berakhir
                      </td>
                    </tr>

                  </tbody>

                </table>

              </div>

            </section>


            <section className="section">

              <div className="notice">
                🔔 Sistem akan mengirim pengingat H-3 sebelum masa premium berakhir.
              </div>

            </section>

          </div>

        </main>

      </div>
    </>
  );
}
