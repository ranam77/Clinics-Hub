
import { Link } from "react-router-dom";
type CardItem = {
  id: number;
  name: string;
  image?: string;
  viewid: number;
  link: string;
  firstName?: string;
  lastName?: string;
  clinicName?: string;
  specialtyName?: string;
  imageUrl?: string;
};

type Props = {item: CardItem;};  
export default function ClinicCard({ item }: Props) {
  const viewNames: Record<number, string> = {
    1: "Branches →",
    2: "Specializations →",
    3: "Doctors →",
    4: `${item.firstName ?? ""} ${item.lastName ?? ""}\nBook Appointment →`,
  };
 
  return (
    <article className="project-card">
      <img
        src= { "/images/" + item.image  || "/placeholder-clinic.svg"}
        alt={item.name}
        className="project-image"
  style={{
    width: item.viewid === 4 ? "100px" : "300px",
    height: item.viewid === 4 ? "100px" : "300px",
    objectFit: "cover",
  }}
/>

      <p>{item.name}</p>

      <Link className="project-button" to={item.link}>
        {viewNames[item.viewid] || "View Details →"}
      </Link>
    </article>
  );
}

 

