using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace StaffTravel.Models
{
    public class MyRequestList
    {
        public int RequestId { get; set; }
        public DateTime RequestDate { get; set; }
        public string TypeOfPasses { get; set; }
        public string NumberOfPasses { get; set; }
        public int? Status { get; set; }
    }
}