using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using static StaffTravel.Models.Enums;

namespace StaffTravel.Models
{
    public class AllRequestList
    {
        public int RequestId { get; set; }
        public DateTime RequestDate { get; set; }
        public string EmployeeNumber { get; set; }
        public string Department { get; set; }
        public DateTime DepartureDate { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public int? Status { get; set; }
        public string TypeOfPasses { get; set; }
        public int? FlightStatus { get; set; }
        public int? HotelStatus { get; set; }
        public int? EmployeeStatus { get; set; }
    }
}