
import { Link } from "react-router-dom";
type CardItem = {
  id: number;
  name: string;
  image?: string;
  viewid: number;
  link: string;
};

type Props = {item: CardItem;};

export default function ClinicCard({ item }: Props) {
  return ( 
    <article className="project-card">
      <img src={item.image || "/placeholder-clinic.svg"} alt={item.name}  className="project-image" />
      <p>{item.name}  </p>
      <Link className="project-button" to={item.link}>
        {item.viewid === 2 ? "Specialized Clinics →" : "Branches →"}
      </Link>
    </article>
  );
}
