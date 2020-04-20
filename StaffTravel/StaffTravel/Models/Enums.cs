using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace StaffTravel.Models
{
    public class Enums
    {
        public enum AncillaryProductEnum
        {
            Excursion, Transfer, Insurance, CarRental
        }

        public enum TransferTypeEnum
        {
            Shared, Private
        }

        public enum InsuranceTypeEnum
        {
            InsuranceType1, InsuranceType2
        }

        public enum StatusEnum
        {
            Pending, Approved, Denied
        }

        public enum TypeOfPassEnum
        {
            YCP, BCP, LMCP, NONE, IP
        }

        public enum NoteSectionEnum
        {
            Passengers, Flights, Hotels, Ancillaries, Booking, Reject, BalanceChanged
        }

        public enum NoteTypeEnum
        {
            Employee, Admin, Payload
        }

        public enum ActiveStatus
        {
            Inactive, Active
        }
        public enum Eligibility
        {
            No, Yes
        }

        public enum ActivityLogUpdateTypeEnum
        {
            Status, Data, Price, AccessGrant, AccessRevoke
        }

        public enum ActivityLogSectionTypeEnum
        {
            Passengers, Flights, Hotels, Ancillaries, Booking, Reject
        }

        public enum ActivityLogUserTypeEnum
        {
            Employee, Admin, Payload, SuperAdmin
        }
    }
}