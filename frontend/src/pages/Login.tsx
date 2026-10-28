import {useState,type ChangeEvent,type SyntheticEvent,} from "react";
import { Link, useNavigate, useLocation , useSearchParams } from "react-router-dom";
import "../styles/Auth.css";
import type { LoginResponse , patientSession ,  } from "../services/api";
 
function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });


const [searchParams] = useSearchParams();
const sessionEnded = searchParams.get("sessionEnded") === "true";
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (
    e: SyntheticEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}api/Auth/token/patients`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            username: formData.username.trim(),
            password: formData.password,
          }),
        }
      );

const result: LoginResponse = await response.json();
if (!response.ok) {
  setError(result.error?.message || "Login failed. Please try again.");
  return;
}
  
if (!result?.access_token) {
  setError("Access token was not returned by the API.");
  return;
}
const currentsession : patientSession =
{
  id: result.p?.id,
  f_name: result.p?.firstName,
  l_name: result.p?.lastName,
  username: result.p?.userName,
  access_token: result.access_token,
  isAuthenticated: true,
} 
sessionStorage.setItem("patientSession", JSON.stringify(currentsession));
window.dispatchEvent(new Event("auth-change"));
const destination = location.state?.from || "/";
navigate(destination, { replace: true });
   } catch (err) {
      console.error("Login error:", err);
      setError("Unable to connect to the server. Please check the API URL.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page-container">
      <section className="page-heading">
        <h1>Welcome Back</h1>
        <p className="auth-subtitle">
          Log in to manage your clinic appointments.
        </p>
      </section>

      <section className="projects-grid">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
              autoComplete="username"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              autoComplete="current-password"
              required
            />
          </div>
          {sessionEnded && (
            <p>Your session has expired. Please log in again.</p>
          )}
          {error && (
            <p className="auth-error" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="auth-button"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        <p className="auth-footer">
          Don't have an account?{" "}
          <Link to="/signup">Create Account</Link>
        </p>
      </section>
    </main>
  );
}

export default LoginPage; 