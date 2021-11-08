using System.Linq;
using System.Threading.Tasks;
using API.Models;
using API.Interfaces;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using API.Controllers;

namespace API.Data.Repositories
{
    public class UserRepository : BaseApiController, IUserRepository
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        private readonly UserManager<AppUser> _userManager;
        public UserRepository(DataContext context, IMapper mapper,
                              UserManager<AppUser> userManager)
        {
            _mapper = mapper;
            _context = context;
            _userManager = userManager;
        }

        public async Task<AppUser> GetUserByEmailAsync(string email)
        {
            return await _userManager.Users
               .SingleOrDefaultAsync(x => x.Email == email.ToLower());
        }

        public async Task<AppUser> GetUserByIdAsync(string id)
        {
            return await _context.Users
                    .Where(x => x.Id == id)
                    // .Include(h => h.Heroes)
                    .SingleOrDefaultAsync();
        }

        public async Task<AppUser> GetUserByUserNameAsync(string userName)
        {
            return await _userManager.Users
                .SingleOrDefaultAsync(x => x.UserName == userName.ToLower());
        }

        public async Task<bool> SaveAllAsync()
        {
            return await _context.SaveChangesAsync() > 0;
        }

        public void Update(AppUser user)
        {
            _context.Entry(user).State = EntityState.Modified;
        }


        public async Task<bool> UserExists(string email)
        {
            return await _userManager.Users.AnyAsync(x => x.Email == email.ToLower());
        }

    }
}
