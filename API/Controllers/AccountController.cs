using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using API.DTOs;
using API.Interfaces;
using API.Models;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class AccountController : BaseApiController
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly IMapper _mapper;
        private readonly SignInManager<AppUser> _signInManager;
        private readonly ITokenService _tokenService;
        private readonly IUserRepository _userRepository;

        public AccountController(UserManager<AppUser> userManager, IMapper mapper,
                                SignInManager<AppUser> signInManager, IUserRepository userRepository,
                                ITokenService tokenService)
        {
            _mapper = mapper;
            _userManager = userManager;
            _signInManager = signInManager;
            _userRepository = userRepository;
            _tokenService = tokenService;
        }

        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
        {
            if (await _userRepository.UserExists(registerDto.Email)) { return BadRequest("The Email is already in use"); }

            var user = _mapper.Map<AppUser>(registerDto);

            var result = await _userManager.CreateAsync(user, registerDto.Password);

            if (!result.Succeeded) return BadRequest(result.Errors);

            var roleResult = await _userManager.AddToRoleAsync(user, "Client");

            if (!roleResult.Succeeded) return BadRequest(result.Errors);

            var userDto = new UserDto
            {
                UserName = user.UserName,
                Token = await _tokenService.CreateToken(user),
                Email = user.Email
            };

            return Ok(userDto);
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            var user = await _userRepository.GetUserByEmailAsync(loginDto.Email);

            if (user == null)
            {
                return BadRequest("Wrong credentials");
            }

            var result = await _signInManager.CheckPasswordSignInAsync(user, loginDto.Password, false);

            if (!result.Succeeded)
            {
                return BadRequest("Wrong credentials");
            }

            return new UserDto
            {
                UserName = user.UserName,
                Token = await _tokenService.CreateToken(user),
                Email = user.Email
            };
        }

        [Authorize(Policy = "RequireClientRole")]
        [HttpPut("{update}")]
        public async Task<ActionResult> UpdateUser(UpdateDto userUpdateDto)
        {
            var user = await _userRepository.GetUserByUserNameAsync(userUpdateDto.UserName);

            var verified = await _userManager.CheckPasswordAsync(user, userUpdateDto.CurrentPassword);

            if (verified == false)
            {
                return BadRequest("You password is incorrect");
            }

            if (user.Email != userUpdateDto.Email.ToLower())
            {
                if (await _userRepository.UserExists(userUpdateDto.Email))
                {
                    return BadRequest("Email is taken");
                }
            }
            if (userUpdateDto.Password != "" && userUpdateDto.Password != null)
            {
                var result = await _userManager.ChangePasswordAsync(user, userUpdateDto.CurrentPassword, userUpdateDto.Password);

                if (result.Succeeded == false)
                {
                    return BadRequest("You password is incorrect");
                }
            }

            user.Email = userUpdateDto.Email;
            _userRepository.Update(user);
            await _userRepository.SaveAllAsync();

            var userDto = _mapper.Map<UpdateDto, UserDto>(userUpdateDto);

            return Ok(userDto);
        }
    }
}
