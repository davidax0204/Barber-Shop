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

        // public Task<IEnumerable> GetAppointmentsByDay(DateTime day)
        // {
        //     // var date = new DateTime(
        //     //   day.Year,
        //     //   day.Month,
        //     //   day.Day
        //     // );

        //     TimeSpan from = new TimeSpan(1, 00, 0);
        //     TimeSpan to = new TimeSpan(23, 00, 0);

        //     var dateFrom = day.Date + from;
        //     var dateTo = day.Date + to;


        //     var appointments = _context.Appointments.Where(a => a.AppointmentnDate == day).ToList();

        //     return appointments;
        // }

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

    }
}
