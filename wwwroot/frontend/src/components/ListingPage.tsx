
import { useEffect, useState } from "react";
import ClinicCard from "./ClinicCard";
import type {ListingItem} from "../types/ListingItem";

interface Props {
  title: string;
  apiUrl: string;
  viewId: number;
  getLink: (item: ListingItem) => string;
  emptyMessage?: string;
}

export default function ListingPage({
  title,
  apiUrl,
  viewId,
  getLink,
  emptyMessage = "No items found.",
}: Props) {
  const [items, setItems] = useState<ListingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(""); 
  useEffect(() => {
    const controller = new AbortController();
    fetch(apiUrl, { signal: controller.signal })
      .then(async (response) => {
        if (response.status === 404) 
          {
            throw new Error("No Data Found");
          }
          if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
          }
        const contentType =
          response.headers.get("content-type") || "";
        if (!contentType.includes("application/json")) {
          throw new Error("The API did not return JSON.");
        }
       return await response.json();
      })
      .then((data) => {
        setItems(Array.isArray(data) ? data : []);
      })
      .catch((err: Error) => {
        if (err.name !== "AbortError") {
          setError(err.message);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, [apiUrl]);

  return (
    <main className="page-container">       
        <div className="construction-flag"> 🚧 Under Construction </div>
      <section className="page-heading">
        <h1>{title}</h1>
      </section>
      {loading && <p>Loading...</p>}
      {error && (<p>{error}</p>)}
      {!loading && !error && items.length === 0 && (<p>{emptyMessage}</p>)}
      <section className="projects-grid">
        {items.map((item) => (
          <ClinicCard
            key={item.id}
            item={{
              id: item.id,
              name: item.name || `${item.firstName} ${item.lastName}`,
              imageUrl: item.imageUrl,
              viewid: viewId,
              link: getLink(item) ,             
            }}
          />
        ))}
      </section>
    </main>
  );
}