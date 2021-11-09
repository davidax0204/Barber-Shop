using System;
using System.Security.Claims;
using System.Threading.Tasks;
using API.Data;
using API.Data.Repositories;
using API.DTOs;
using API.Interfaces;
using API.Models;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class BarberController : BaseApiController
    {
        private readonly IUserRepository _userRepository;
        public readonly IMapper _mapper;
        private readonly IAppointmentRepository _appointmentRepository;

        public BarberController(IUserRepository userRepository, IMapper mapper,
                                IAppointmentRepository appointmentRepository)
        {
            _userRepository = userRepository;
            _mapper = mapper;
            _appointmentRepository = appointmentRepository;
        }

        [HttpPost("{appointment}")]
        public async Task<ActionResult> SetAppointment(DateTime appointment)
        {
            var user = await this.GetActiveUser();

            if (user == null) { return NotFound(); }

            var existingAppointments = _appointmentRepository.AppointmentExist(appointment);

            if (existingAppointments == true) { return BadRequest("The appointment time is already taken"); }

            var Appointment = _appointmentRepository.CreateAppointment(appointment, user);

            user.Appointments.Add(Appointment);

            if (await _userRepository.SaveAllAsync()) { return Ok(); }

            return BadRequest("Failed to set an appointmen");
        }


        private Task<AppUser> GetActiveUser()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var user = this._userRepository.GetUserByIdAsync(userId);

            return user;
        }
    }

}
