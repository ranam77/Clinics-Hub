
import { Link, useNavigate,  useSearchParams } from "react-router-dom";
import "../styles/DoctorsTimes.css";

function DoctorsTimes() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const firstName = searchParams.get("firstName") || "";
  const lastName = searchParams.get("lastName") || "";
  const clinicName = searchParams.get("cLinicName") || "";
  const specialtyName = searchParams.get("specialtyName") || "";
  const imageUrl = searchParams.get("imageUrl") || "";
  const username = sessionStorage.getItem("username");
  return (
    <main className="doctor-page">
      <section className="doctor-profile">
        <div className="doctor-cover">
          <span className="doctor-cover-icon">✚</span>
          <span>Professional Healthcare</span>
        </div>

        <div className="doctor-profile-content">
          <div className="doctor-avatar">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={`${firstName} ${lastName}`}
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            ) : (
              <span>
                {firstName.charAt(0)}
                {lastName.charAt(0)}
              </span>
            )}
          </div>

          <div className="doctor-info">
            <span className="doctor-label">DOCTOR PROFILE</span>
            <h1>
              Dr. {firstName} {lastName}
            </h1>

            <p className="doctor-specialty">
              {specialtyName || "Specialty not available"}
            </p>
            <p className="doctor-specialty">
             {clinicName || "Clinic not available"}
            </p>
          </div>
        </div>
      </section>

      {!username ? (
        <section className="booking-notice">
          <div className="booking-notice-icon">🔒</div>

          <div className="booking-notice-text">
            <h2>Login Required</h2>
            <p>
              Please log in to your account before booking an
              appointment with this doctor.
            </p>

            <div className="booking-actions">
              <button
                type="button"
                className="doctor-login-button"
                onClick={() => navigate("/login")}
              >
                Log In to Book
                <span> →</span>
              </button>

              <Link to="/signup" className="doctor-signup-link">
                Create an account
              </Link>
            </div>
          </div>
        </section>
      ) : (
        <section className="appointments-placeholder">
          <h2>Available Appointments</h2>
          <p>
            Choose an available time to book your appointment.
          </p>
          {/* Available appointment slots will be displayed here. */}
        </section>
      )}
    </main>
  );
}

export default DoctorsTimes;
