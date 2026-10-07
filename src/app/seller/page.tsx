'use client';

import Link from 'next/link';
import '@/styles/seller.css';

export default function Seller() {
  return (
    <>
      <header className="topbar">

        <Link className="logo" href="/">
          pri<span>mogo</span>.id
        </Link>

        <div className="top-actions">

          <button
            className="icon-btn"
            onClick={() => {}}
          >
            🏠
          </button>

        </div>

      </header>


      <main
        className="main"
        style={{
          marginLeft: 0,
          width: '100%',
        }}
      >

        <div className="container">


          <section className="seller-banner">

            <div style={{ color: '#e5f7ee' }}>
              SELLER CENTER
            </div>

            <h1 style={{ margin: '6px 0' }}>
              Kelola produk aplikasi premium
            </h1>

            <p>
              Seller dapat mengajukan produk, mengatur stok,
              harga, paket, dan informasi lisensi.
              Produk baru masuk proses verifikasi admin.
            </p>

          </section>


          <section className="section seller-grid">

            <div className="stat">
              Produk aktif

              <strong>
                12
              </strong>
            </div>

            <div className="stat">
              Pesanan

              <strong>
                86
              </strong>
            </div>

            <div className="stat">
              Menunggu verifikasi

              <strong>
                2
              </strong>
            </div>

          </section>


          <section className="section panel">

            <h2>
              Input Produk
            </h2>

            {/* TODO: replace with Supabase seller data */}
            <form id="addProduct">


              <div className="account-grid">

                <div className="field">

                  <label>
                    Nama aplikasi
                  </label>

                  <input
                    required
                    placeholder="Contoh: Canva Pro"
                  />

                </div>


                <div className="field">

                  <label>
                    Kategori
                  </label>

                  <select>

                    <option>
                      Desain
                    </option>

                    <option>
                      Education
                    </option>

                    <option>
                      Music
                    </option>

                    <option>
                      Produktivitas
                    </option>

                    <option>
                      Entertainment
                    </option>

                  </select>

                </div>


                <div className="field">

                  <label>
                    Harga
                  </label>

                  <input
                    type="number"
                    required
                  />

                </div>


                <div className="field">

                  <label>
                    Durasi
                  </label>

                  <input
                    placeholder="30 hari"
                    required
                  />

                </div>

              </div>


              <div className="field">

                <label>
                  Deskripsi & fitur
                </label>

                <textarea
                  placeholder="Tuliskan fitur, cara aktivasi, garansi, dan ketentuan penggunaan..."
                />

              </div>


              <button
                className="btn btn-primary"
              >
                Ajukan untuk Verifikasi
              </button>

            </form>

          </section>

        </div>

      </main>


      <div
        id="toast"
        className="toast"
      />
    </>
  );
}
