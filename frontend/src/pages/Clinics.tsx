
import { useParams } from "react-router-dom";
import ListingPage from "../components/ListingPage";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function ClinicsPage() {
  const { projectId } = useParams();

  if (!projectId) {
    return <p>Project ID is missing.</p>;
  }

  return (
    <ListingPage
      title="Clinic Branches"
      apiUrl={`${API_BASE_URL}api/clinics/relatedclinics/${projectId}`}
      viewId={2}      
      getLink={(item) => `/Specialty/${item.id}`}
      emptyMessage="No clinics found."
    />
  );
}
