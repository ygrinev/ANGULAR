//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace StaffTravel.Models
{
    using System;
    using System.Collections.Generic;
    
    public partial class Hotels
    {
        public int id { get; set; }
        public Nullable<System.DateTime> checkInDate { get; set; }
        public Nullable<int> duration { get; set; }
        public string destination { get; set; }
        public string name { get; set; }
        public string roomType { get; set; }
        public Nullable<int> status { get; set; }
        public Nullable<int> approvalStatus { get; set; }
        public Nullable<decimal> price { get; set; }
        public int requestId { get; set; }
    
        public virtual Requests Requests { get; set; }
    }
}
