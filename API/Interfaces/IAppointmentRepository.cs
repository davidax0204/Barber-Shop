using System;
using System.Collections;
using System.Collections.Generic;
using System.Threading.Tasks;
using API.Models;

namespace API.Interfaces
{
    public interface IAppointmentRepository
    {
        Appointment CreateAppointment(DateTime appointment, AppUser user);
        List<Appointment> GetAppointmentsByDay(DateTime day);
        bool AppointmentExist(DateTime appointment);
        // void Update(AppUser user);
        // Task<bool> SaveAllAsync();
        // Task<AppUser> GetUserByIdAsync(string id);
        // Task<AppUser> GetUserByIdAsync(string id);
        // Task<AppUser> GetUserByEmailAsync(string email);
        // Task<AppUser> GetUserByUserNameAsync(string userName);
        // Task<bool> UserExists(string email);
    }
}
