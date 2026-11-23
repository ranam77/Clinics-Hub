
import "../styles/Auth.css";
import { Link, useNavigate } from "react-router-dom";
import { useState, type ChangeEvent, type SyntheticEvent } from "react";

import { useLanguage } from "../context/useLanguage";
import { translations } from "../context/translations";

type SignupResponse = {
  message?: string;
  Message?: string;
  success?: boolean;
  Success?: boolean;
  Id?: number;
};

function Signup() {
  const navigate = useNavigate();

  const { language } = useLanguage();
  const t = translations[language];

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    username: "",
    password: "",
    confirmPassword: "",
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

    if (formData.password !== formData.confirmPassword) {
      setError(t.passwordMismatch);
      return;
    }

    if (formData.password.length < 8) {
      setError(t.passwordTooShort);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}api/Patients/new`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firstName: formData.firstName.trim(),
            lastName: formData.lastName.trim(),
            username: formData.username.trim(),
            password: formData.password,
            email: formData.email.trim(),
            phone: formData.phone.trim(),
          }),
        }
      );

      const result: SignupResponse = await response.json();

      if (
        !response.ok ||
        result.success === false ||
        result.Success === false
      ) {
        setError(
          result.message ||
          result.Message ||
          t.registrationFailed
        );
        return;
      }

      navigate("/login", {
        state: {
          message:
            result.message ||
            result.Message ||
            (language === "ar"
              ? "تم إنشاء الحساب بنجاح."
              : "Registration successful."),
        },
      });

    } catch (err) {
      console.error("Registration error:", err);
      setError(t.registrationError);

    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page-container" dir={t.dir}>

      <div className="construction-flag">
        🚧 {t.underConstruction}
      </div>

      <section className="page-heading">
        <h1>{t.signupTitle}</h1>

        <p className="auth-subtitle">
          {t.signupSubtitle}
        </p>
      </section>

      <section className="projects-grid">
        <form onSubmit={handleSubmit}>

          <div className="form-row">

            <div className="form-group">
              <label htmlFor="firstName">
                {t.firstName}
              </label>

              <input
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder={t.enterFirstName}
                autoComplete="given-name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="lastName">
                {t.lastName}
              </label>

              <input
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder={t.enterLastName}
                autoComplete="family-name"
                required
              />
            </div>

          </div>

          <div className="form-group">
            <label htmlFor="email">
              {t.email}
            </label>

            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder={t.enterEmail}
              autoComplete="email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">
              {t.phone}
            </label>

            <input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder={t.enterPhone}
              autoComplete="tel"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="username">
              {t.username}
            </label>

            <input
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder={t.chooseUsername}
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
              placeholder={t.passwordMinLength}
              autoComplete="new-password"
              minLength={8}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">
              {t.confirmPassword}
            </label>

            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder={t.repeatPassword}
              autoComplete="new-password"
              minLength={8}
              required
            />
          </div>

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
            {loading ? t.creatingAccount : t.createAcc}
          </button>

          <p className="auth-footer">
            {t.alreadyHaveAccount}{" "}
            <Link to="/login">
              {t.login}
            </Link>
          </p>

        </form>
      </section>
    </main>
  );
}

export default Signup;
