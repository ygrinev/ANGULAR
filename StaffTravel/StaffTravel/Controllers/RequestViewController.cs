using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using StaffTravel.Models;
using log4net;

namespace StaffTravel.Controllers
{
    [Authorize]
    [RoutePrefix("api/RequestView")]
    public class RequestViewController : ApiController
    {

        private static readonly ILog Log = LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);

        [HttpGet]
        [Route("RequestView/{employeenumber}/{forWhom}")]
        public IHttpActionResult RequestView(string employeenumber, string forWhom)
        {
            using (STAutomationEntities ste = new STAutomationEntities())
            {
                var requestList = ste.spGetAllRequestByEmployeeNumber(employeenumber, forWhom).ToList<spGetAllRequestByEmployeeNumber_Result>();

                return Ok(requestList);
            }
        }

        //[HttpGet]
        //[Route("PayloadRequest")]
        //public IHttpActionResult PayloadRequest()
        //{
        //    string errorMsg = null;
        //    try
        //    {
        //        using (STAutomationEntities ste = new STAutomationEntities())
        //        {
        //            var flightList = ste.spGetAllFlightsForPayload().ToList<spGetAllFlightsForPayload_Result>();
        //            if (flightList != null)
        //            {
        //                List<string> tickets = flightList.Select(x => x.ticketid).ToList<string>();
        //                string ticketIds = string.Join(",", tickets);
        //                List<PayloadList> flightListView = new List<PayloadList>();

        //                ZendeskCommunicator zc = new ZendeskCommunicator();
        //                string returnValue = zc.SendRequestToZendesk(null, "/api/v2/tickets/show_many.json?ids=" + ticketIds, "GET");

        //                //foreach (var flight in flightList)
        //                foreach (var flight in flightList)
        //                {
        //                    PayloadList payloadList = new PayloadList();

        //                    payloadList.TicketId = flight.ticketid;
        //                    payloadList.FlightTicketIds = flight.flightTicket;
        //                    payloadList.TicketIdParent = flight.TicketIdParent;
        //                    payloadList.DepartingFrom = zc.GetCustomFieldValueFromZendesk(returnValue, flight.ticketid, FieldIdTranslator.GetFieldId(CustomFieldsList.FlightDepartingFrom));
        //                    payloadList.GoingTo = zc.GetCustomFieldValueFromZendesk(returnValue, flight.ticketid, FieldIdTranslator.GetFieldId(CustomFieldsList.FlightGoingto));
        //                    payloadList.CreateDate = flight.CreateDate;
        //                    payloadList.TypeOfPass = flight.typeOfPass;
        //                    payloadList.Status = flight.Status;

        //                    flightListView.Add(payloadList);
        //                }
        //                return Ok(flightListView);

        //            }
        //            else
        //            {
        //                return Ok("No data found");
        //            }
        //            return Ok(flightList);
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        errorMsg = "Error on retriving data for payload request with Zendesk - " + ex.Message;
        //        Log.Error(errorMsg);
        //        return Ok(errorMsg);
        //    }

        //}

        //[HttpGet]
        //[Route("PayloadRequestDetail/{flightTickets}")]
        //public IHttpActionResult PayloadRequestDetail(string flightTickets)
        //{
        //    string errorMsg = null;
        //    try
        //    {
        //        ZendeskCommunicator zc = new ZendeskCommunicator();
        //        List<Payload> FlightRequestDetail = new List<Payload>();

        //        string returnValue = zc.SendRequestToZendesk(null, "/api/v2/tickets/show_many.json?ids=" + flightTickets, "GET");
        //        var FlightTickets = flightTickets.Split(',');
        //        foreach (string flight in FlightTickets)
        //        {
        //            Payload p = new Payload();
        //            p.DepartureFrom = zc.GetCustomFieldValueFromZendesk(returnValue, flight, FieldIdTranslator.GetFieldId(CustomFieldsList.FlightDepartingFrom));
        //            p.GoingTo = zc.GetCustomFieldValueFromZendesk(returnValue, flight, FieldIdTranslator.GetFieldId(CustomFieldsList.FlightGoingto));
        //            p.DepartingOn = zc.GetCustomFieldValueFromZendesk(returnValue, flight, FieldIdTranslator.GetFieldId(CustomFieldsList.FlightDepartureDate));
        //            p.DepartFlight = zc.GetCustomFieldValueFromZendesk(returnValue, flight, FieldIdTranslator.GetFieldId(CustomFieldsList.FlightDepartingFlightNumber));
        //            p.ReturnFrom = zc.GetCustomFieldValueFromZendesk(returnValue, flight, FieldIdTranslator.GetFieldId(CustomFieldsList.FlightReturningfrom));
        //            p.ReturnTo = zc.GetCustomFieldValueFromZendesk(returnValue, flight, FieldIdTranslator.GetFieldId(CustomFieldsList.FlightReturningto));
        //            p.ReturnOn = zc.GetCustomFieldValueFromZendesk(returnValue, flight, FieldIdTranslator.GetFieldId(CustomFieldsList.FlightReturndate));
        //            p.ReturnFlight = zc.GetCustomFieldValueFromZendesk(returnValue, flight, FieldIdTranslator.GetFieldId(CustomFieldsList.FlightReturnflight));
        //            p.RequestStatus = zc.GetCustomFieldValueFromZendesk(returnValue, flight, FieldIdTranslator.GetFieldId(CustomFieldsList.RequestStatus));
        //            FlightRequestDetail.Add(p);
        //        }

        //        return Ok(FlightRequestDetail);

        //    }
        //    catch (Exception ex)
        //    {
        //        errorMsg = "Error on retriving data for payload request detail with Zendesk - " + ex.Message;
        //        Log.Error(errorMsg);
        //        return Ok(errorMsg);
        //    }

        //}

        //[HttpGet]
        //[Route("PayloadRequestDetailForNotes/{ticketid}")]
        //public IHttpActionResult PayloadRequestDetailForNote(string ticketid)
        //{
        //    string errorMsg = null;
        //    try
        //    {
        //        using (STAutomationEntities ste = new STAutomationEntities())
        //        {
        //            ZendeskCommunicator zc = new ZendeskCommunicator();
        //            PayloadNote FlightRequestNote = new PayloadNote();
        //            string returnValue = zc.SendRequestToZendesk(null, "/api/v2/tickets/show_many.json?ids=" + ticketid, "GET");

        //            FlightRequestNote.ticketid = ticketid;
        //            FlightRequestNote.employeenote = zc.GetCustomFieldValueFromZendesk(returnValue, ticketid, FieldIdTranslator.GetFieldId(CustomFieldsList.FlightEmployeeNotes));
        //            FlightRequestNote.payloadnote = zc.GetCustomFieldValueFromZendesk(returnValue, ticketid, FieldIdTranslator.GetFieldId(CustomFieldsList.FlightPayloadnotes));

        //            return Ok(FlightRequestNote);
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        errorMsg = "Error on retriving data for payload request detail note with Zendesk - " + ex.Message;
        //        Log.Error(errorMsg);
        //        return Ok(errorMsg);
        //    }
        //}

        //[HttpPost]
        //[Route("PayloadNotesUpdate")]
        //public IHttpActionResult PayloadNotesUpdate(PayloadNote pn)
        //{
        //    string errorMsg = null;

        //    try
        //    {
        //        if (pn != null)
        //        {
        //            if (pn.payloadnote != null)
        //            {
        //                using (STAutomationEntities ste = new STAutomationEntities())
        //                {
        //                    ZendeskCommunicator zc = new ZendeskCommunicator();
        //                    PayloadNote FlightRequestNote = new PayloadNote();

        //                    ZendeskTicket zendeskTicket = new ZendeskTicket();

        //                    string requestId = zc.GetRequesterIdFromZendesk(pn.email);
        //                    requestId = "114705925231";

        //                    //TODO:update status

        //                    return Ok("Successfully updated");
        //                }
        //            }
        //        }
        //        return Ok("");
        //    }
        //    catch (Exception ex)
        //    {
        //        errorMsg = "Error on updating notes to Zendesk for flight detail - " + ex.Message;
        //        Log.Error(errorMsg);
        //        return Ok(errorMsg);
        //    }
        //}
    }
}
