using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using API.Models;
using Microsoft.AspNetCore.Identity;

namespace API.Data
{
    public class Roles
    {
        public static async Task RoleInitalizer(RoleManager<AppRole> roleManager)
        {
            var roles = new List<AppRole>
            {
                new AppRole{Name="Client"}
            };
            foreach (var role in roles)
            {
                await roleManager.CreateAsync(role);
            }
        }
    }
}
