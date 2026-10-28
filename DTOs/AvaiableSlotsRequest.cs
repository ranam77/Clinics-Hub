using System.ComponentModel.DataAnnotations;

namespace BookingApi.DTOs
{
    public class AvaiableSlotsRequest
    {
        [Required]
        public DateTime FromDate { get; set; }
        public long? DoctorId   { get; set; }        
        public DateTime ToDate { get; set; }
        public int? Cl_Sp_Id  { get; set; }
    }
}