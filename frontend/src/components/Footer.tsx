
import { Link } from "react-router-dom";
import logo from "../assets/logo.jfif";
import "../styles/Footer.css";
import { useLanguage } from "../context/useLanguage";
import { translations } from "../context/translations";

function Footer() {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <footer className="footer" dir={t.dir}>
      <div className="footer-container">

        <div className="footer-column footer-brand">
          <Link to="/" className="footer-logo">
            <img src={logo} alt="Clinics Hub" />
          </Link>

          <p>{t.footerquote}</p>
        </div>

        <div className="footer-column">
          <h3>{t.about}</h3>
          <Link to="/">{t.whoweare}</Link>
          <Link to="/">{t.vision}</Link>
          <Link to="/">{t.callus}</Link>
        </div>

        <div className="footer-column">
          <h3>{t.findby}</h3>
          <Link to="/">{t.specializations}</Link>
          <Link to="/">{t.clinics}</Link>
          <Link to="/">{t.doctors}</Link>
          <Link to="/">{t.location}</Link>
        </div>

        <div className="footer-column">
          <h3>{t.yourAcc}</h3>
          <Link to="/login">{t.login}</Link>
          <Link to="/signup">{t.createAcc}</Link>
          <Link to="/UsersAppointments">
            {t.myAppointments}
          </Link>
        </div>

        <div className="footer-column">
          <h3>{t.needHelp}</h3>
          <a href="mailto:info@clinicshub.com">
            {t.contactSupport}
          </a>
          <Link to="/">{t.terms}</Link>
          <Link to="/">{t.policy}</Link>
        </div>

      </div>

      <div className="footer-bottom">
        <div className="footer-social">
          <a href="#" aria-label="Facebook">Facebook</a>
          <a href="#" aria-label="Instagram">Instagram</a>
          <a href="#" aria-label="LinkedIn">LinkedIn</a>
        </div>

        <p>
          © {new Date().getFullYear()} Clinics Hub. {t.rights}
        </p>
      </div>
    </footer>
  );
}

export default Footer;
