import { useEffect, useState } from "react";
import "../styles/UsersAppointments.css";
import {GetAppointments,CancelAppointment} from "../services/AppointmentsAPI";
import { getCurrentSession } from "../services/api";
import type { Booking } from "../types/AppointmentSlot";

function UsersAppointments() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [appointments, setAppointments] = useState<Booking[]>([]);
    useEffect(() => {
        const controller = new AbortController();
        async function fetchInitialData() {
            setLoading(true);
            try {
                const session = getCurrentSession();
                if (!session?.id) {
                    throw new Error("Patient session not found.");
                }

                const data = await GetAppointments(
                    { patientId: session.id },
                    controller.signal
                );
 
                if (!controller.signal.aborted) {
                    setAppointments(data);
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

        fetchInitialData();
        return () => controller.abort();
    }, []);

   async function cancelAppointment(ref: string) {
    setLoading(true);
    setError("");
    try {
        const response = await CancelAppointment(ref);
        if (response === 200) {
            setAppointments(prev =>
                prev.map(appointment =>
                    appointment.bookingRef === ref ? { ...appointment, status: 1 }: appointment
                )
            );
        }
    } catch (err: unknown) {
        if (err instanceof Error) {
            setError(err.message);
        }
    } finally {
        setLoading(false);
    }
}
     return (
    <div className="appointments-container">
      <h2>My Appointments</h2>
      {error && <p className="error-message">{error}</p>}
      {loading ? (<p>Loading appointments...</p>) : appointments.length === 0 ? (<p>No appointments found.</p>)   : 
      (
        <table className="appointments-table">
          <thead>
            <tr>
                <th>Refrance</th>
                <th>Doctor</th>
                <th>Specialize</th>
                <th>Clinic</th>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
                <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment) => (
              <tr key={appointment.id}>
                <td>{appointment.bookingRef}</td>
                <td>Dr. {appointment.doctor.firstName} {appointment.doctor.lastName}</td>                
                <td>{appointment.speciality.name}</td>
                <td>{appointment.clinic.name}</td>
                <td>
                  { new Date(appointment.slot.startsAt).toLocaleDateString() }
                </td>
                <td>
                  { new Date(appointment.slot.startsAt).toLocaleTimeString([],{ hour: "2-digit", minute: "2-digit" }) }
                </td>
                <td>{appointment.status === 1 ? "Canceled" : "Confirmed"}</td>
                <td>
                  <button
                    className="cancel-button"                    
                    disabled={appointment.status === 1}
                    onClick={() => cancelAppointment(appointment.bookingRef)} >
                    Cancel
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default UsersAppointments;