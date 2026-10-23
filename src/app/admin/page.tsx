export default function AdminOverviewPage() {
  return (
    <div className="section">

      {/* ==============================
           PAGE HEADING
      =============================== */}
      <div className="section-head">
        <h2>Overview Dashboard</h2>
      </div>


      {/* ==============================
           STAT CARDS (PLACEHOLDER)
      =============================== */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 18,
        }}
      >
        <div className="stat" style={{ minHeight: 140 }} />
        <div className="stat" style={{ minHeight: 140 }} />
        <div className="stat" style={{ minHeight: 140 }} />
      </div>

    </div>
  );
}
