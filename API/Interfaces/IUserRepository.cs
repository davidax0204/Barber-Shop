using System;
using System.Threading.Tasks;
using API.Models;

namespace API.Interfaces
{
    public interface IUserRepository
    {
        void Update(AppUser user);
        Task<bool> SaveAllAsync();
        Task<AppUser> GetUserByIdAsync(string id);
    }
}
