
import { apiFetch, API_BASE_URL } from "./api";
import type { BookSlotRequest, BookSlotResponse } from "../types/AppointmentSlot";

export async function bookSlot(
  request: BookSlotRequest,
  signal?: AbortSignal
): Promise<BookSlotResponse> {

  const response = await apiFetch(
    `${API_BASE_URL}/api/bookings/new`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
      signal,
    }
  );

  console.log("bookSlot", JSON.stringify(request));

  if (response.status === 400) {
    throw new Error("No appointments available.");
  }

  if (!response.ok) {
    throw new Error("Failed to book appointment.");
  }

  const data: BookSlotResponse = await response.json();

  return data;
}
