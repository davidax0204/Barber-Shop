using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Controllers;
using API.Interfaces;
using API.Models;
using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace API.Data.Repositories
{
    public class AppointmentRepository : BaseApiController, IAppointmentRepository
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        public AppointmentRepository(DataContext context, IMapper mapper)

        {
            _mapper = mapper;
            _context = context;

        }

        public bool AppointmentExist(DateTime appointment)
        {
            var existingAppointments = _context.Appointments
                                                .Where(a => a.AppointmentnDate == appointment)
                                                .ToList();

            if (existingAppointments.Count != 0)
            {
                return true;
            }

            return false;
        }



        public Appointment CreateAppointment(DateTime appointment, AppUser user)
        {
            var Appointment = new Appointment
            {
                AppUserId = user.Id,
                AppointmentnDate = appointment
            };

            return Appointment;
        }

        public void DeleteAppointment(Appointment appointment)
        {
            _context.Appointments.Remove(appointment);
        }

        public void EditAppointment(Appointment appointment, DateTime newAppointment)
        {
            appointment.AppointmentnDate = newAppointment;
        }

        public List<Appointment> GetAllAppointments()
        {
            var appointments = _context.Appointments.Include(x => x.AppUser).ToList();

            return appointments;
        }

        public Appointment GetAppointmentById(int id)
        {
            return _context.Appointments.Where(a => a.Id == id).FirstOrDefault();
        }

        public List<Appointment> GetAppointmentsByDay(DateTime day)
        {
            TimeSpan from = new TimeSpan(1, 00, 0);
            TimeSpan to = new TimeSpan(23, 00, 0);

            var dateFrom = day.Date + from;
            var dateTo = day.Date + to;

            var appointments = _context.Appointments
                                .Where(a => a.AppointmentnDate > dateFrom &&
                                            a.AppointmentnDate < dateTo)
                                .ToList();

            return appointments;
        }

        public List<Appointment> GetSortedAppointments(string orderByName, DateTime fromDate, DateTime toDate)
        {
            var query = _context.Appointments.Include(x => x.AppUser).AsQueryable();

            if (orderByName != "all")
            {
                query = query.Where(a => a.AppUser.UserName == orderByName);
            }

            query = query.Where(a => a.AppointmentnDate > fromDate && a.AppointmentnDate < toDate);

            return query.ToList();
        }
    }
}
