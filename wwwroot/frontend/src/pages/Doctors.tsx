
import { useParams } from "react-router-dom";
import ListingPage from "../components/ListingPage";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
 
export default function Doctors() {
  const { ClId } = useParams();
  const { SpId } = useParams();
  if (!ClId || !SpId) {
    return ;
  }

  return (
  
<ListingPage
  title="Doctors"
  apiUrl={`${API_BASE_URL}api/Doctors/all/${ClId}/${SpId}`}
  viewId={4}
  getLink={(item) =>
    `/DoctorsTimes/${item.id}?firstName=${encodeURIComponent(item.firstName ?? "")}&lastName=${encodeURIComponent(item.lastName ?? "")}&clinicName=${encodeURIComponent(item.clinicName ?? "")}&specialtyName=${encodeURIComponent(item.specialtyName ?? "")}&imageUrl=${encodeURIComponent(item.imageUrl ?? "")}`
  }
  emptyMessage="No doctors found."
/>

  );
}
