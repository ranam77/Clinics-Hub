
import { useParams } from "react-router-dom";
import ListingPage from "../components/ListingPage";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Specialty() {
const { ClId } = useParams();
  if (!ClId) {
    return <p>ClId  is missing.</p>;
  }

  return (
    <ListingPage
      title="Specializations"
      apiUrl={`${API_BASE_URL}api/clinics/relatedspeciality/${ClId}`}
      viewId={3}
      getLink={(item) => `/Doctors/${ClId}/${item.id}/`}
      emptyMessage="No clinics found."
    />
  );
}
