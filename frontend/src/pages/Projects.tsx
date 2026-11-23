
import ListingPage from "../components/ListingPage";
import SearchBar from "../components/SearchBar";
import AdsSlider from "../components/AdsSlider";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function ProjectsPage() {
  return (
    <>    
      <SearchBar />
      <AdsSlider />
      <ListingPage
        title="Our Partners"
        apiUrl={`${API_BASE_URL}api/clinics/allprojects`}
        viewId={1}
        getLink={(item) => `/projects/${item.id}/clinics`}
        emptyMessage="No projects found."
      />
    </>
  );
}
