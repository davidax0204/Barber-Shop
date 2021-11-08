using System;
using System.ComponentModel.DataAnnotations;

namespace API.DTOs
{
    public class UpdateDto
    {
        [Required]
        public string UserName { get; set; }

        [Required]
        public string Email { get; set; }
        public string Password { get; set; }
        [Required]
        public string CurrentPassword { get; set; }
        [Required]
        public string Token { get; set; }
    }
}
