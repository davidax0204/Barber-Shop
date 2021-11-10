using System;
using API.DTOs;
using API.Models;
using AutoMapper;

namespace API.Helpers
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap<RegisterDto, AppUser>();
            CreateMap<UpdateDto, UserDto>();
            CreateMap<TakenDateDto, Appointment>();
            CreateMap<Appointment, TakenDateDto>();
        }
    }
}
