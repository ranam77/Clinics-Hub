import type { ListingItem } from "./ListingItem";


export interface AppointmentSlotRequest {
  Cl_Sp_Id?: number;
  DoctorID?: number;
  fromDate: string;
  toDate?: string | null;
}

export interface AppointmentSlot {
  id: number;
  code: string | null;
  startsAt: string;
  endsAt: string;
  booking: unknown[];
}

export interface BookSlotRequest {
  slotId: number;
  patientId: number; 
}
 
export interface BookSlotResponse {
  id: number;
  code: string | null;
  startsAt: string;
  endsAt: string;
  booking: unknown[];
}

  export interface Booking {
  id:number;
  bookingRef: string;
  clinic:ListingItem;
  doctor:ListingItem;
  speciality:ListingItem;
  status:number;
  slot:AppointmentSlot;
}

 