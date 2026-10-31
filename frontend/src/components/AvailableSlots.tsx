import "../styles/AvailableSlots.css"; 
import type { AppointmentSlot } from "../types/AppointmentSlot";

interface AvailableSlotsProps {
  slots: AppointmentSlot[];
  onBook: (slot: AppointmentSlot) => void;
}
export default function AvailableSlots({
  slots = [],
  onBook,
}: AvailableSlotsProps) {
  const groupedSlots = slots.reduce<Record<string, typeof slots>>(
    (groups, slot) => {
      const date = new Date(slot.startsAt);      
      const dayKey = [
        date.getFullYear(),
        String(date.getMonth() + 1).padStart(2, "0"),
        String(date.getDate()).padStart(2, "0"),
      ].join("-");

      if (!groups[dayKey]) {
        groups[dayKey] = [];
      }

      groups[dayKey].push(slot);
      return groups;
    },
    {});

  const days = Object.entries(groupedSlots).sort(
    ([a], [b]) => a.localeCompare(b)
  );
const formatDay = (dayKey: string) : string =>   {
 return  new Date(`${dayKey}T12:00:00`).toLocaleDateString("en-GB", {
      weekday: "long",
      day:  "2-digit",
      month: "long",
      year: "numeric",
    });
};
 

  const formatTime = (startsAt :string) =>
    new Date(startsAt).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

  if (slots.length === 0) {
    return (
      <div className="slots-empty">
        No available appointments found.
      </div>
    );
  }

  return (
    <section className="available-slots">
      <h2>Available Appointments</h2>

      <div className="days-container">
        {days.map(([day, daySlots]) => (
          <article className="day-card" key={day}>
            <div className="day-card-header">
              <span className="calendar-icon" aria-hidden="true">
                📅
              </span>

              <div>
                <h3>{formatDay(day)}</h3>
                <p>
                  {daySlots.length} available time
                  {daySlots.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>

            <div className="time-slots">
              {daySlots.map((slot) => (
              <button
                  type="button"
                  className="time-slot"
                  key={slot.id}
                  onClick={() => onBook?.(slot)}
                  aria-label={`Book appointment at ${formatTime(
                    slot.startsAt
                  )} on ${formatDay(day)}`}
                >
                  {formatTime(slot.startsAt)}
                </button>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
