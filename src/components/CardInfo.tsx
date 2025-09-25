export default function CardInfo() {
  return (
    <section className="info-section">
      <h1 className="welcome-title">Welcome to Readscape</h1> {/* Ова е над картичките */}
      <div className="info-cards-container">
        <div className="info-card">
          <h3>Discover and Explore</h3> {/* Ова е првата картичка со нов наслов */}
          <p>Discover your next favorite book here. Browse categories, trending books, and much more.</p>
        </div>
        <div className="info-card">
          <h3>Explore and Enjoy</h3>
          <p>Find books across various genres and subjects tailored for you.</p>
        </div>
        <div className="info-card">
          <h3>Manage Your Shelf</h3>
          <p>You can organize your books in a personal shelf and keep track of your reading journey.</p>
        </div>
      </div>
    </section>
  );
}