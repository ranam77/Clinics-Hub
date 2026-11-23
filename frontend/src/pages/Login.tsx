
import {
  useState,
  type ChangeEvent,
  type SyntheticEvent,
} from "react";

import { Link, useNavigate, useLocation, useSearchParams } from "react-router-dom";
import "../styles/Auth.css";

import type { patientSession, Patient } from "../types/Patient";
import { useLanguage } from "../context/useLanguage";
import { translations } from "../context/translations";

interface LoginResponse {
  error?: {
    message?: string;
  };
  access_token?: string;
  p?: Patient;
}

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const { language } = useLanguage();
  const t = translations[language];

  const [searchParams] = useSearchParams();
  const sessionEnded = searchParams.get("sessionEnded") === "true";

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

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
        setError(result.error?.message || t.loginFailed);
        return;
      }

      if (!result?.access_token) {
        setError(t.tokenMissing);
        return;
      }

      const currentsession: patientSession = {
        id: result.p?.id ? result.p.id : 0,
        f_name: result.p?.firstName,
        l_name: result.p?.lastName,
        username: result.p?.userName,
        access_token: result.access_token,
        isAuthenticated: true,
      };

      sessionStorage.setItem(
        "patientSession",
        JSON.stringify(currentsession)
      );

      window.dispatchEvent(new Event("auth-change"));

      const destination = location.state?.from || "/";
      navigate(destination, { replace: true });

    } catch (err) {
      console.error("Login error:", err);
      setError(t.connectionError);

    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page-container" dir={t.dir}>

      <section className="page-heading">
        <h1>{t.welcomeBack}</h1>

        <p className="auth-subtitle">
          {t.loginSubtitle}
        </p>
      </section>

      <section className="projects-grid">

        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label htmlFor="username">
              {t.username}
            </label>

            <input
              id="username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              placeholder={t.enterUsername}
              autoComplete="username"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">
              {t.password}
            </label>

            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder={t.enterPassword}
              autoComplete="current-password"
              required
            />
          </div>

          {sessionEnded && (
            <p>
              {t.sessionExpired}
            </p>
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
            {loading ? t.loggingIn : t.login}
          </button>

        </form>

        <p className="auth-footer">
          {t.dontHaveAccount}{" "}
          <Link to="/signup">
            {t.createAcc}
          </Link>
        </p>

      </section>
    </main>
  );
}

export default LoginPage;
