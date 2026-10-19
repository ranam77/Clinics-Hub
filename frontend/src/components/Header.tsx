import { Link, useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();

  return (
    <header className="header">
      <Link to="/" className="logo">
        <span className="logo-icon">+</span>
        <span>Clinics Box</span>
      </Link>

      <nav className="header-buttons">
        <Link to="/login" className="login-button">
          Login
        </Link>

        <button
          type="button"
          className="login-button"
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>
      </nav>
    </header>
  );
}

export default Header;