using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;

namespace API.Models
{
    public class AppRole : IdentityRole
    {
        public ICollection<AppUserRole> UserRoles { get; set; }
    }
}
