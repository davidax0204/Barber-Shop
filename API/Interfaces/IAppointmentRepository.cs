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
        List<Appointment> GetAllAppointments();
        Appointment GetAppointmentById(int id);
        void DeleteAppointment(Appointment appointment);
        void EditAppointment(Appointment appointment, DateTime newAppointment);
        bool AppointmentExist(DateTime appointment);
        List<Appointment> GetSortedAppointments(string orderByName, DateTime fromDate, DateTime toDate);
        // void Update(AppUser user);
        // Task<bool> SaveAllAsync();
        // Task<AppUser> GetUserByIdAsync(string id);
        // Task<AppUser> GetUserByIdAsync(string id);
        // Task<AppUser> GetUserByEmailAsync(string email);
        // Task<AppUser> GetUserByUserNameAsync(string userName);
        // Task<bool> UserExists(string email);
    }
}
