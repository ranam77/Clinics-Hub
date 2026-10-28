import "../styles/DoctorsTimes.css";
import { getAvailableSlots, type AppointmentSlotRequest, type AppointmentSlot } from "../services/api";
import { useEffect, useState } from "react";
import { getCurrentSession }  from "../services/api";
import { Link ,useNavigate, useParams, useSearchParams } from "react-router-dom";
import ConfirmDialog from "../components/ConfirmDialog";
import AvailableSlots from "../components/AvailableSlots";
function DoctorsTimes() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { Id: doctorId } = useParams();
  const firstName = searchParams.get("firstName") || "";
  const lastName = searchParams.get("lastName") || "";
  const clinicName = searchParams.get("clinicName") || "";
  const specialtyName = searchParams.get("specialtyName") || "";
  const imageUrl = searchParams.get("imageUrl") || ""; 
  const [slots, setSlots] = useState<AppointmentSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
 const [showDialog, setShowDialog] = useState(false);
 const [selectedSlot, setSelectedSlot] =  useState<AppointmentSlot | null>(null);

 
useEffect(() => {
  const controller = new AbortController();
  async function fetchSlots() {
    if (!getCurrentSession() || !getCurrentSession()?.isAuthenticated || !doctorId) {
      setSlots([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const request: AppointmentSlotRequest = {
        DoctorID: 27,
        fromDate: "2030-01-09T00:00:00",
        toDate: "2030-01-16T00:00:00",
      };

      const data = await getAvailableSlots(
        request,
        controller.signal
      );

      if (!controller.signal.aborted) {
        setSlots(data);
      }
    } catch (err: unknown) {
      if (!controller.signal.aborted && err instanceof Error) {
        setError(err.message);
      }
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
      }
    }
  }

  fetchSlots();

  return () => controller.abort();
}, [doctorId]);







const handleBooking = (slot: AppointmentSlot) => {
  setSelectedSlot(slot);
  setShowDialog(true);
};

const confirmBooking = async () => {
  if (!selectedSlot) return;
console.log("Selected Slot" , selectedSlot)
  setShowDialog(false);
  //todo
};

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
              src={`/images/${imageUrl}`}
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

     {!getCurrentSession()?.isAuthenticated ? (
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
      ) : 
      (
      
<section className="booking-notice">
  <div className="booking-notice-text">
    {loading ? (
      <p>Loading appointments...</p>
    ) : error ? (
      <p>{error}</p>
    ) : (
      <>
        <AvailableSlots
          slots={slots}
          onBook={handleBooking}
        />

        <ConfirmDialog
          isOpen={showDialog}
          title="Confirm Appointment"
          message={
            selectedSlot
              ? `Are you sure you want to book ${new Date(
                  selectedSlot.startsAt
                ).toLocaleString()}?`
              : "Are you sure you want to book this appointment?"
          }
          confirmText="Confirm Booking"
          cancelText="Cancel"
          onConfirm={confirmBooking}
          onCancel={() => {
            setShowDialog(false);
            setSelectedSlot(null);
          }}
        />
      </>
    )}
  </div>
</section>

      )

        }
    </main>
  );
}

export default DoctorsTimes;
