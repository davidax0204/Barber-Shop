using System;

namespace API.DTOs
{
    public class UserParams
    {
        public string orderByName { get; set; } = "";
        public DateTime fromDate { get; set; }
        public DateTime toDate { get; set; }
    }
}
