using System;
using System.Threading.Tasks;
using API.Models;
using Microsoft.AspNetCore.Mvc;

namespace API.Interfaces
{
    public interface IUserRepository
    {
        void Update(AppUser user);
        Task<bool> SaveAllAsync();
        Task<AppUser> GetUserByIdAsync(string id);
        Task<AppUser> GetUserByEmailAsync(string email);
        Task<AppUser> GetUserByUserNameAsync(string userName);
        // Task<AppUser> GetActiveUser();
        Task<bool> UserExists(string email);
    }
}
