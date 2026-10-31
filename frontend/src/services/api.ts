import type { patientSession, } from "../types/Patient";
import type { AppointmentSlotRequest , AppointmentSlot } from "../types/AppointmentSlot";
const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL as string
).replace(/\/$/, "");

export function getCurrentSession(): patientSession | null {
  const storedPatient = sessionStorage.getItem("patientSession");
  return storedPatient
    ? (JSON.parse(storedPatient) as patientSession)
    : null;
}
 
export function getImageUrl(imageUrl: string | null): string {
  if (!imageUrl) return "/images/clinics.jfif";
  if (/^https?:\/\//i.test(imageUrl)) {
    return imageUrl;
  }
  return `${API_BASE_URL}/${imageUrl.replace(/^\/+/, "")}`;
}

interface ApiFetchOptions extends RequestInit {
  skipUnauthorizedRedirect?: boolean;
}

export async function apiFetch(
  url: string,
  options: ApiFetchOptions = {}
): Promise<Response> {
  const {
    skipUnauthorizedRedirect = false,
    headers: customHeaders,
    ...fetchOptions
  } = options;

  const headers = new Headers(customHeaders);
  const session = getCurrentSession();
  if (session) {
    if (!session.access_token) {
      logout();
      window.location.replace("/login?sessionEnded=true");
      throw new Error("Your session has ended.");
    }
    headers.set("Authorization", `Bearer ${session.access_token}`);
  }

  const response = await fetch(url, {
    ...fetchOptions,
    headers,
  });

  if (response.status === 401 && session && !skipUnauthorizedRedirect) {
    logout();
    window.location.replace("/login?sessionEnded=true");
    throw new Error("Your session has ended.");
  }
  return response;
}

 export function logout() {
  sessionStorage.removeItem("patientSession");
  sessionStorage.removeItem("patientSession");
  sessionStorage.removeItem("access_token");
  sessionStorage.removeItem("Id");
  sessionStorage.removeItem("username");
  sessionStorage.removeItem("f_name");
  sessionStorage.removeItem("l_name");
  window.location.replace("/login?sessionEnded=true");
  window.dispatchEvent(new Event("auth-change"));
}

export async function getAvailableSlots(
  request: AppointmentSlotRequest,
  signal?: AbortSignal
): Promise<AppointmentSlot[]> {
  const response = await apiFetch(
    `${API_BASE_URL}/api/Slots/validSlotes`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
      signal,
    }
  ); 
  console.log("getAvailableSlots" ,  JSON.stringify(request));
 if (response.status == 400) {
    throw new Error("No Appointments Available soon.");
  }else if (!response.ok) {
    throw new Error("Failed to load appointments.");
  }
  const data = await response.json();
  return Array.isArray(data) ? data : data.slots ?? [];
}
export { API_BASE_URL };
