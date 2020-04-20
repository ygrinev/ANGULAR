using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json.Serialization;

namespace StaffTravel.BL
{
    public class RequestViewList
    {
        public string RequestedDate { get; set; }
        public string EmployeeNameNumber { get; set; }
        public string Department { get; set; }
        public List<typeofpass> TypeOfPass { get; set; }
        public string Status { get; set; }
        public string ticketId { get; set; }

        public class typeofpass
        {
            public string NameOfType { get; set; }
            public int NumberOfPass { get; set; }
        }

        public string employeenumberNname(string employeeNumber, string firstname, string lastname)
        {
            return employeeNumber + " " + firstname + " " + lastname;
        }
    }


}
