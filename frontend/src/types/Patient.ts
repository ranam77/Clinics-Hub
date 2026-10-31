export interface Patient {
  id: number;
  firstName: string;
  lastName: string;
  userName: string;
  passName: string;
  phone: string;
  email: string;
  bookings: unknown[];
}
export interface patientSession {
  id: number;
  f_name? : string;
  l_name? : string;
  username? : string;
  access_token?  : string;
  isAuthenticated: boolean;
}