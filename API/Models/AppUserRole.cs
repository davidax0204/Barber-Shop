using System;
using Microsoft.AspNetCore.Identity;

namespace API.Models
{
    public class AppUserRole : IdentityUserRole<string>
    {
        public AppUser User { get; set; }
        public AppRole Role { get; set; }
    }
}
