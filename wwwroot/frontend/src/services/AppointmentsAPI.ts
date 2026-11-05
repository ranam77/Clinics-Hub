
import { apiFetch, API_BASE_URL } from "./api";
import type { Booking } from "../types/AppointmentSlot";

export async function GetAppointments(
  request:{patientId: number; }, signal?: AbortSignal
): Promise<Booking[]> {
  const response = await apiFetch(
    `${API_BASE_URL}/api/Patients/bookings`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
      signal,
    }
  );
  if (response.status === 400) {
    throw new Error("No Appointments Available.");
  }
  if (!response.ok) {
    throw new Error("Failed to Load Appointment.");
  }
  const data = await response.json();
 // console.log("Appointments", JSON.stringify(data));
return data as Booking[];
}

export async function CancelAppointment(ref: string, signal?: AbortSignal): Promise<number> {
  const response = await apiFetch(
    `${API_BASE_URL}/api/bookings/${ref}/cancel`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },     
      signal,
    }
  );
  return response.status;
}


