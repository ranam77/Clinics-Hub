
const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL as string
).replace(/\/$/, ""); 
export interface Project {
  id: number;
  businessname: string;
  imageUrl: string | null;
}

export interface Clinic {
  id: number;
  name: string;
  imageUrl: string | null;
}

async function fetchData<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`);
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export function getImageUrl(imageUrl: string | null): string {
  if (!imageUrl) return "/images/clinics.jfif";

  if (/^https?:\/\//i.test(imageUrl)) {
    return imageUrl;
  }

  return `${API_BASE_URL}/${imageUrl.replace(/^\/+/, "")}`;
}

export function getProjects(): Promise<Project[]> {
  return fetchData<Project[]>("/api/clinics/allprojects");
}

export function getClinics(projectId: number): Promise<Clinic[]> {
  return fetchData<Clinic[]>(
    `/api/clinics/relatedclinics/${projectId}`
  );
}
