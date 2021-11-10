using System;
using System.Collections.Generic;
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


        [HttpGet]
        public async Task<ActionResult> GetAppointments()
        {
            var appointments = _appointmentRepository.GetAllAppointments();

            return Ok(appointments);
        }


        [HttpGet("edit/{id}")]
        public async Task<ActionResult> GetAppointment(int id)
        {
            var appointment = _appointmentRepository.GetAppointmentById(id);

            return Ok(appointment);
        }

        [HttpGet("{day}")]
        public async Task<ActionResult> GetSelectedDayAppointments(DateTime day)
        {
            var Appointments = _appointmentRepository.GetAppointmentsByDay(day);

            var AppointmentsDto = _mapper.Map<IList<Appointment>, IList<TakenDateDto>>(Appointments);

            return Ok(AppointmentsDto);
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

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteAppointment(int id)
        {
            var appointment = _appointmentRepository.GetAppointmentById(id);

            _appointmentRepository.DeleteAppointment(appointment);

            if (await _userRepository.SaveAllAsync()) { return Ok(_appointmentRepository.GetAllAppointments()); }

            return BadRequest("Failed to remove an appointment");
        }


        [HttpPut("edit/{id}/{appointment}")]
        public async Task<ActionResult> EditAppointment(int id, DateTime appointment)
        {
            var appointmentInDb = _appointmentRepository.GetAppointmentById(id);

            _appointmentRepository.EditAppointment(appointmentInDb, appointment);

            if (await _userRepository.SaveAllAsync()) { return Ok(_appointmentRepository.GetAllAppointments()); }

            return BadRequest("Failed to remove an appointment");
        }


        private Task<AppUser> GetActiveUser()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var user = this._userRepository.GetUserByIdAsync(userId);

            return user;
        }
    }

}
