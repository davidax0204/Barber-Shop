using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;

namespace API.Models
{
    public class AppUser : IdentityUser
    {
        public ICollection<AppUserRole> UserRoles { get; set; }
        public ICollection<Appointment> Appointments { get; set; }
    }
}
