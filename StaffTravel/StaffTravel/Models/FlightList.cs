using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace StaffTravel.Models
{
    public class FlightList
    {
        public FlightList()
        {
            int a = 0;
            a= a + 2;
        }
        public int RequestId { get; set; }
        public DateTime RequestDate { get; set; }
        public DateTime? DepartOn { get; set; }
        public string DepartFrom { get; set; }
        public string DeaprtTo { get; set; }
        public string NumberOfPass { get; set; }
        public int? Status { get; set; }
        public string LastUpdatedBy { get; set; }
    }
}