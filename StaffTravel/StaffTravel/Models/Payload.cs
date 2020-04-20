using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace StaffTravel.Models
{
    public class Payload
    {
        public string DateSubmitted { get; set; }
        public string DepartureFrom { get; set; }
        public string GoingTo { get; set; }
        public string DepartingOn { get; set; }
        public string DepartFlight { get; set; }
        public string ReturnFrom { get; set; }
        public string ReturnTo { get; set; }
        public string ReturnOn { get; set; }
        public string ReturnFlight { get; set; }
        public string RequestStatus { get; set; }
    }
    public class PayloadList
    {
        public string TicketId { get; set; }
        public string FlightTicketIds { get; set; }
        public string TicketIdParent { get; set; }
        public string DepartingFrom { get; set; }
        public string GoingTo { get; set; }
        public string CreateDate { get; set; }
        public string TypeOfPass { get; set; }
        public string Status { get; set; }
    }
    public class PayloadNote
    {
        public string ticketid { get; set; }
        public string employeenote { get; set; }
        public string payloadnote { get; set; }
        public string email { get; set; }
    }
}