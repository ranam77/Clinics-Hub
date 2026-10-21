
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();

  const [username, setUsername] = useState(
    () => sessionStorage.getItem("username")
  );

  useEffect(() => {
    const updateAuth = () => {
      setUsername(sessionStorage.getItem("username"));
    };

    window.addEventListener("auth-change", updateAuth);

    return () => {
      window.removeEventListener("auth-change", updateAuth);
    };
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("access_token");
    sessionStorage.removeItem("username");
    window.dispatchEvent(new Event("auth-change"));
    navigate("/");
  };

  return (
    <header className="header">
      <Link to="/" className="logo">
        <span className="logo-icon">+</span>
        <span>Clinics Box</span>
      </Link>

      <nav className="header-buttons">
        {username ? (
          <>
            <span className="welcome-user">
              Welcome, {username}
            </span>

            <button
              type="button"
              className="login-button"
              onClick={handleLogout}
            >
              Log Out
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="login-button">
              Login
            </Link>

            <Link to="/signup" className="login-button">
              Sign up
            </Link>
          </>
        )}

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
