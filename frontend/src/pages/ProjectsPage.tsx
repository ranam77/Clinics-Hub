
import ListingPage from "../components/ListingPage";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function ProjectsPage() {
  return (
    <ListingPage
      title="Our Partners"
      apiUrl={`${API_BASE_URL}api/clinics/allprojects`}
      viewId={1}
      getLink={(id) => `/projects/${id}/clinics`}
      emptyMessage="No projects found."
    />
  );
}
