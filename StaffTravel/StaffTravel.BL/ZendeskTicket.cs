using System;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using System.Collections.Generic;

namespace StaffTravel.BL
{
    public class ZendeskTicket
    {
        public Ticket ticket { get; set; }

        public class CustomField
        {
            public string id { get; set; }
            public string value { get; set; }
        }

        public class comment
        {
            public string body { get; set; }  //body            
            [JsonProperty(PropertyName = "public")]
            public bool IsPublic { get; set; }  //body            
        }

        public class Ticket
        {
            //public int id { get; set; }

            public string subject { get; set; }
            public bool ShouldSerializesubject()     //If the field has some value then is going to show into the json after JsonConvert.SerializeObject
            {
                return !string.IsNullOrEmpty(subject);
            }
            public string status { get; set; }

            public bool ShouldSerializestatus()    //If the field has some value then is going to show into the json after JsonConvert.SerializeObject
            {
                return !string.IsNullOrEmpty(status);
            }

            public string type { get; set; }
            public bool ShouldSerializetype()      //If the field has some value then is going to show into the json after JsonConvert.SerializeObject
            {
                return !string.IsNullOrEmpty(type);
            }

            public string priority { get; set; }
            public bool ShouldSerializepriority()   //If the field has some value then is going to show into the json after JsonConvert.SerializeObject
            {
                return !string.IsNullOrEmpty(priority);
            }
            public string requester_id { get; set; }
            public string problem_id { get; set; }
            public bool ShouldSerializerequester_id()   //If the field has some value then is going to show into the json after JsonConvert.SerializeObject
            {
                return !string.IsNullOrEmpty(requester_id);
            }


            public List<CustomField> custom_fields { get; set; }
            public comment comment { get; set; }
        }

        /// <summary>
        /// Main ticket subject
        /// </summary>
        /// <param name="employeeName"></param>
        /// <param name="departureDateOfFlight1"></param>
        /// <param name="numberOfPassengers"></param>
        /// <returns></returns>
        public string GetMainTicketSubject(string employeeName, string departureDateOfFlight1, int numberOfPassengers)
        {
            string returnString = String.Format("Staff Travel Request: {0} | Departure date: {1} | {2}", employeeName, departureDateOfFlight1, numberOfPassengers.ToString());
            return returnString;
        }

        /// <summary>
        /// Flight ticket subject
        /// </summary>
        /// <param name="employeeName"></param>
        /// <param name="departureDateOfFlight1"></param>
        /// <param name="destinationOfFlight1"></param>
        /// <returns></returns>
        public string GetFlightTicketSubject(string employeeName, string departureDateOfFlight1, string destinationOfFlight1)
        {
            string returnString = String.Format("Staff Travel Flight Request: {0} | Departure date: {1} | Destination : {2}", employeeName, departureDateOfFlight1, destinationOfFlight1);
            return returnString;
        }

        /// <summary>
        /// Hotel ticket subject
        /// </summary>
        /// <param name="employeeName"></param>
        /// <param name="departurdepartureDateOfHotel1eDateOfFlight1"></param>
        /// <param name="hotelNameOfFirstOption"></param>
        /// <returns></returns>
        public string GetHotelTicketSubject(string employeeName, string departureDateOfHotel1, string hotelNameOfFirstOption)
        {
            string returnString = String.Format("Staff Travel Hotel Request: {0} | Departure date: {1} | Hotel : {2}", employeeName, departureDateOfHotel1, hotelNameOfFirstOption);
            return returnString;
        }
        /// <summary>
        /// Ancillary ticket subject
        /// </summary>
        /// <param name="employeeName"></param>
        /// <param name="departureDateOfHotel1"></param>
        /// <param name="hotelNameOfFirstOption"></param>
        /// <returns></returns>
        public string GetAncillaryTicketSubject(string employeeName, string ancillaryProduct)
        {
            string returnString = String.Format("Staff Travel Ancillary Request: {0} | {1} ", employeeName, ancillaryProduct);
            return returnString;
        }

    }

}