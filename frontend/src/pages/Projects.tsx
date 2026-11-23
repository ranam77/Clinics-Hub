
import ListingPage from "../components/ListingPage";
import SearchBar from "../components/SearchBar";
import AdsSlider from "../components/AdsSlider";
import { useLanguage } from "../context/useLanguage";
import { translations } from "../context/translations";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function ProjectsPage() {
    const { language } = useLanguage();
  const t = translations[language];
  return (
    <>    
      <SearchBar />
      <AdsSlider />
      <ListingPage
        title={t.partners}
        apiUrl={`${API_BASE_URL}api/clinics/allprojects`}
        viewId={1}
        getLink={(item) => `/projects/${item.id}/clinics`}
        emptyMessage={t.nodate} 
      />
    </>
  );
}
