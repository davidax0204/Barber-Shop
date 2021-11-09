using System;
using System.ComponentModel.DataAnnotations;

namespace API.Models
{
    public class Appointment
    {
        public int Id { get; set; }
        [Required]
        public DateTime AppointmentnDate { get; set; }

        [Required]
        public DateTime AppointmentCreationDate { get; set; } = DateTime.Now;
        public AppUser AppUser { get; set; }

        [Required]
        public string AppUserId { get; set; }
    }
}
