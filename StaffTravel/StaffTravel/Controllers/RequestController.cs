// using Microsoft.Ajax.Utilities;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin;
using Newtonsoft.Json;
using StaffTravel.Models;
using StaffTravel.Utils;
using SWG.Common.Utility.Logging;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Drawing.Printing;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Formatting;
using System.Security.Claims;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.ModelBinding;
using System.Web.Script.Serialization;
using System.Web.Security;

namespace StaffTravel.Controllers
{
    [Authorize]
    [RoutePrefix("api/Request")]
    public class RequestController : ApiController
    {
        private static EmailUtility _emailUtility;

        [HttpPost]
        [Route("CreateNewRequest")]
        public async Task<IHttpActionResult> CreateNewRequestAsync([ModelBinder(typeof(ManualProcessingRequestModelBinder))] Requests request)
        {
            if (request == null)
            {
                Logger.Log(LoggingLevel.Error, "Invalid model state. user ID = {userid}. Model state errors = {@modelstate}", User.Identity.Name, ModelState.Values);
                return BadRequest("Invalid Data");
            }

            using (STAutomationEntities ste = new STAutomationEntities())
            {
                try
                {
                    ste.Requests.Add(request);
                    await ste.SaveChangesAsync();
                    await SendNewRequestNotificationsAsync(request, ste);

                    return Ok(request.id);
                }
                catch (Exception e)
                {
                    Logger.Log(LoggingLevel.Error, e, "Failed to submit new request. User Id = " + User.Identity.Name + ". Object = {@object}", request);
                    return InternalServerError(e);
                }
            }
        }

        [HttpGet]
        [Route("GetRequestsList")]
        public IHttpActionResult GetRequestsList()
        {
            try
            {
                using (STAutomationEntities ste = new STAutomationEntities())
                {
                    ste.Configuration.ProxyCreationEnabled = false;
                    var Requests = ste.Requests
                        .Where(r => r.employeeNumber == User.Identity.Name)
                        .OrderByDescending(r => r.requestDate)
                        .ToList();

                    List<MyRequestList> mylist = new List<MyRequestList>();
                    foreach (var m in Requests)
                    {
                        MyRequestList list = new MyRequestList();
                        list.RequestId = m.id;
                        list.RequestDate = m.requestDate;
                        list.TypeOfPasses = returnTypeOfPass(m.id);
                        list.NumberOfPasses = returnNumberOfPass(m.id);
                        list.Status = m.status;
                        mylist.Add(list);
                    }

                    return Json(mylist);
                }
            }
            catch (Exception e)
            {
                Logger.Log(LoggingLevel.Error, e, "Failed to get requests list. User Id = " + User.Identity.Name);
                return InternalServerError(e);
            }
        }

        [HttpGet]
        [Route("GetProgressDetail")]
        public IHttpActionResult GetProgressDetail(int Id)
        {
            using (STAutomationEntities ste = new STAutomationEntities())
            {
                try
                {
                    ste.Configuration.ProxyCreationEnabled = false;
                    var request = ste.Requests
                        .Where(r => r.id == Id)
                        .Select(r => new
                        {
                            r.id,
                            r.requestDate,
                            r.status,
                            r.reviewer,
                            r.bookingNumber,
                            r.employeeNumber,
                            passengers = r.Passengers,
                            flights = r.Flights,
                            hotels = r.Hotels,
                            ancillaries = r.Ancillaries,
                            notes = r.Notes
                        })
                        .FirstOrDefault();

                    if (request.employeeNumber == User.Identity.Name)
                        return Json(request);
                    else
                        return Unauthorized();
                }
                catch (Exception e)
                {
                    Logger.Log(LoggingLevel.Error, e, "Failed to get progress details in function GetProgressDetail. Request Id = {requestid}", Id);
                    return InternalServerError();
                }
            }
        }

        [HttpGet]
        [Route("GetManagerReviewRequest")]
        [Authorize(Roles = "Manager")]
        public IHttpActionResult GetManagerReviewRequest(int Id)
        {
            using (STAutomationEntities ste = new STAutomationEntities())
            {
                try
                {
                    ste.Configuration.ProxyCreationEnabled = false;
                    var request = ste.Requests
                        .Where(r => r.id == Id)
                        .Select(r => new
                        {
                            r.id,
                            r.requestDate,
                            r.status,
                            r.reviewer,
                            r.bookingNumber,
                            r.employeeNumber,
                            passengers = r.Passengers,
                            flights = r.Flights,
                            hotels = r.Hotels,
                            ancillaries = r.Ancillaries,
                            notes = r.Notes
                        })
                        .FirstOrDefault();

                    var employee = ste.Employees.Where(e => e.EmpNumber == request.employeeNumber).FirstOrDefault();

                    if (employee == null)
                        return BadRequest();

                    if (employee.ManagerEmpNumber == User.Identity.Name)
                        return Json(request);
                    else
                        return Unauthorized();
                }
                catch (Exception e)
                {
                    Logger.Log(LoggingLevel.Error, e, "Failed to get request details in function GetManagerReviewRequest. Request Id = {requestid}", Id);
                    return InternalServerError();
                }
            }
        }

        [HttpPost]
        [Route("UpdateApprovalFromEmployee")]
        public async Task<IHttpActionResult> UpdateApprovalfromEmployee(Requests request)
        {
            if (request.employeeNumber != User.Identity.Name)
                return Unauthorized();

            //to show the new (delta) info entered in the email
            Requests deltaRequest = new Requests();
            deltaRequest.id = request.id;
            deltaRequest.Passengers = request.Passengers;

            try
            {
                using (STAutomationEntities ste = new STAutomationEntities())
                {
                    //flight update
                    if (request.Flights != null)
                    {
                        foreach (Flights flight in request.Flights)
                        {
                            Flights dbFlight = ste.Flights.Where(x => x.id == flight.id).FirstOrDefault();

                            if (dbFlight == null)
                            {
                                ste.Flights.Add(flight);
                                deltaRequest.Flights.Add(flight);
                            }
                            else
                                dbFlight.status = flight.status;
                        }
                    }

                    //hotel update
                    if (request.Hotels != null)
                    {
                        foreach (Hotels hotel in request.Hotels)
                        {
                            Hotels dbHotel = ste.Hotels.Where(x => x.id == hotel.id).FirstOrDefault();

                            if (dbHotel == null)
                                ste.Hotels.Add(hotel);
                            else
                                dbHotel.status = hotel.status;
                        }
                    }

                    //ancillaries update
                    if (request.Ancillaries != null)
                    {
                        foreach (Ancillaries ancillary in request.Ancillaries)
                        {
                            Ancillaries dbAncillary = ste.Ancillaries.Where(x => x.id == ancillary.id).FirstOrDefault();
                            if (dbAncillary == null)
                                ste.Ancillaries.Add(ancillary);
                            else
                                dbAncillary.status = ancillary.status;
                        }
                    }

                    if (request.Passengers != null)
                    {
                        foreach (Passengers passenger in request.Passengers)
                        {
                            Passengers dbPassenger = ste.Passengers.Where(x => x.id == passenger.id).FirstOrDefault();
                            dbPassenger.firstName = passenger.firstName;
                            dbPassenger.middleName = passenger.middleName;
                            dbPassenger.lastName = passenger.lastName;
                            dbPassenger.DOB = passenger.DOB;
                            dbPassenger.typeOfPass = passenger.typeOfPass;
                            dbPassenger.phoneNumber = passenger.phoneNumber;
                            dbPassenger.email = passenger.email;
                        }
                    }

                    await ste.SaveChangesAsync();

                    //send emails in parrallel for max performance
                    List<Task> tasks = new List<Task>();

                    //send payload notifications if new flights added to this request
                    if (deltaRequest.Flights.Count > 0)
                    {
                        tasks.AddRange(
                            GetListOfNewFlightNotifications(
                                deltaRequest.Flights.First().departDate.Value.ToString("MMMM dd, yyyy"),
                                deltaRequest.Flights.First().departTo,
                                deltaRequest));
                    }
                    //admins get a notification regardless
                    tasks.Add(SendUpdateNotificationToAdmin(request, ste));

                    await Task.WhenAll(tasks);

                    return Ok("Updated");
                }
            }
            catch (Exception e)
            {
                Logger.Log(LoggingLevel.Error, e, "Failed to update requst in function UpdateApprovalfromEmployee. object = {@object}" + request);
                return InternalServerError(e);
            }

        }


        [HttpGet]
        [Route("GetTeamList")]
        [Authorize(Roles = "Manager")]
        public IHttpActionResult GetTeamList()
        {
            try
            {
                using (STAutomationEntities ste = new STAutomationEntities())
                {
                    ste.Configuration.ProxyCreationEnabled = false;

                    List<string> teamList = ste.Employees.Where(x => x.ManagerEmpNumber.Equals(User.Identity.Name)).Select(x => x.EmpNumber).ToList<string>();

                    var Requests = ste.Requests.Where(x => teamList.Contains(x.employeeNumber)).OrderByDescending(r => r.requestDate).ToList();

                    List<AllRequestList> AllRequestLists = new List<AllRequestList>();
                    foreach (var a in Requests)
                    {
                        AllRequestList al = new AllRequestList();
                        al.RequestId = a.id;
                        al.RequestDate = a.requestDate;
                        al.EmployeeNumber = a.employeeNumber;
                        var employee = ste.Employees.Where(x => x.EmpNumber == al.EmployeeNumber).FirstOrDefault();
                        al.FirstName = employee.FirstName;
                        al.LastName = employee.LastName;
                        al.Department = employee.Organization;
                        al.TypeOfPasses = returnTypeOfPass(a.id);
                        al.Status = a.status;
                        AllRequestLists.Add(al);
                    }
                    return Json(AllRequestLists);
                }

            }
            catch (Exception e)
            {
                Logger.Log(LoggingLevel.Error, e, "Failed to get team list in function GetTeamList. User Id = " + User.Identity.Name);
                return InternalServerError(e);
            }
        }

        [HttpGet]
        [Route("GetPayloadList/{filterStatus?}")]
        [Authorize(Roles = "Payload")]
        public IHttpActionResult GetPayloadList(Enums.StatusEnum? filterStatus = null)
        {
            try
            {
                using (STAutomationEntities ste = new STAutomationEntities())
                {
                    var flights = ste.Flights.Where(f => f.Requests.status != (int)Enums.StatusEnum.Denied);

                    if (filterStatus != null)
                        flights = flights.Where(f => f.approvalStatus == (int)filterStatus);


                    var flightsList =
                        (
                            from flight in flights.ToList()
                            select new FlightList()
                            {
                                RequestId = flight.requestId,
                                RequestDate = flight.Requests.requestDate,
                                DeaprtTo = flight.departTo,
                                DepartFrom = flight.departFrom,
                                DepartOn = flight.departDate,
                                Status = flight.approvalStatus,
                                NumberOfPass = string.Join(",", flight.Requests.Passengers.Select(p => p.typeOfPass.ToString())),
                                LastUpdatedBy = ste.ActivityLogs.Where(l => l.foreignId == flight.id && l.updateType == (int)Enums.ActivityLogUpdateTypeEnum.Status).OrderByDescending(l => l.updatedOn).Select(l => l.empName).FirstOrDefault()
                            }
                        )
                        .ToList()
                        .OrderBy(fl => fl.Status)
                        .ThenBy(fl => fl.DepartOn)
                        .ThenBy(fl => fl.RequestDate);

                    return Json(flightsList);
                }
            }
            catch (Exception e)
            {
                Logger.Log(LoggingLevel.Error, e, "Failed to get payload list in function GetPayloadList. User Id ={user} Filter = {filter}", User.Identity.Name, filterStatus);
                return InternalServerError(e);
            }
        }

        [HttpGet]
        [Route("GetPayloadListFNav")]
        [Authorize(Roles = "Payload")]
        public IHttpActionResult GetPayloadListFNav()
        {
            try
            {
                using (STAutomationEntities ste = new STAutomationEntities())
                {
                    ste.Configuration.ProxyCreationEnabled = false;

                    List<int> onlyFlight = ste.Flights
                                     .Where(x => x.departDate != null)
                                     .Select(x => x.requestId)
                                     .ToList<int>();

                    var Requests = ste.Requests.Where(x => onlyFlight.Contains(x.id)).Select(x => new { x.id, x.requestDate, x.Flights, x.Passengers, x.status }).ToList();

                    List<FlightList> FlightList = new List<FlightList>();
                    foreach (var r in Requests)
                    {
                        FlightList flightlist = new FlightList();
                        flightlist.RequestId = r.id;
                        flightlist.RequestDate = r.requestDate;
                        if (r.Flights != null)
                        {
                            if (r.Flights.FirstOrDefault() != null)
                            {
                                flightlist.DepartFrom = r.Flights.FirstOrDefault().departFrom;
                                flightlist.DeaprtTo = r.Flights.FirstOrDefault().departTo;
                                if (r.Flights.FirstOrDefault().departDate != null)
                                    flightlist.DepartOn = r.Flights.Min(x => x.departDate);
                            }
                        }

                        flightlist.Status = flightStatus(r.id);
                        FlightList.Add(flightlist);
                    }
                    IEnumerable<FlightList> sortedFlightList = FlightList.Where(x => x.DepartOn >= DateTime.Now && x.Status == (int)Enums.StatusEnum.Pending).OrderBy(x => x.DepartOn).ToList();
                    sortedFlightList = sortedFlightList.Concat(FlightList.Where(x => x.DepartOn < DateTime.Now && x.Status == (int)Enums.StatusEnum.Pending).OrderBy(x => x.DepartOn).ToList());
                    sortedFlightList = sortedFlightList.Concat(FlightList.Where(x => x.Status == (int)Enums.StatusEnum.Approved || x.Status == (int)Enums.StatusEnum.Denied).OrderByDescending(x => x.RequestDate).ToList());
                    return Json(sortedFlightList);
                }
            }
            catch (Exception e)
            {
                Logger.Log(LoggingLevel.Error, e, "Failed to get payload list for navigation in function GetPayloadListFNav. User Id = " + User.Identity.Name);
                return InternalServerError(e);
            }
        }

        private int flightStatus(int requestId)
        {
            using (STAutomationEntities ste = new STAutomationEntities())
            {
                try
                {
                    var flightStatus = ste.Flights.Where(x => x.requestId == requestId).ToList();
                    Boolean hasPending = false;
                    Boolean hasApproved = false;
                    Boolean hasDenied = false;

                    foreach (var fs in flightStatus)
                    {
                        if (fs.approvalStatus == (int)Enums.StatusEnum.Pending)
                        {
                            hasPending = true;
                        }
                        else if (fs.approvalStatus == (int)Enums.StatusEnum.Approved)
                        {
                            hasApproved = true;
                        }
                        else if (fs.approvalStatus == (int)Enums.StatusEnum.Denied)
                        {
                            hasDenied = true;
                        }
                    }

                    if (hasPending)
                    {
                        return (int)Enums.StatusEnum.Pending;
                    }
                    else if (hasApproved)
                    {
                        return (int)Enums.StatusEnum.Approved;
                    }
                    else if (hasDenied)
                    {
                        return (int)Enums.StatusEnum.Denied;
                    }
                    else
                    {
                        return (int)Enums.StatusEnum.Pending;
                    }
                }
                catch (Exception e)
                {
                    Logger.Log(LoggingLevel.Error, e, "Failed to get flight status in function flightStatus. Request Id = {requestid}", requestId);
                    throw;
                }
            }
        }


        [HttpGet]
        [Route("GetAdminList/{filterStatus?}")]
        [Authorize(Roles = "Admin")]
        public IHttpActionResult GetAdminList(Enums.StatusEnum? filterStatus = null)
        {
            try
            {
                using (STAutomationEntities ste = new STAutomationEntities())
                {
                    var requestsList =
                    (
                        from request in ste.Requests
                        select request
                    );

                    if (filterStatus != null)
                        requestsList = requestsList.Where(r => r.status == (int)filterStatus);

                    var adminList =
                    (
                        from request in requestsList.ToList()
                        select new AllRequestList()
                        {
                            RequestDate = request.requestDate,
                            RequestId = request.id,
                            DepartureDate = GetRequestDepartureDate(request),
                            FirstName = request.Passengers.FirstOrDefault().firstName,
                            LastName = request.Passengers.FirstOrDefault().lastName,
                            EmployeeNumber = request.employeeNumber,
                            FlightStatus = GetRequestFlightStatus(request.Flights),
                            HotelStatus = GetRequestHotelStatus(request.Hotels),
                            EmployeeStatus = GetRequestEmployeeStatus(request),
                            Status = request.status,
                            TypeOfPasses = string.Join(",", request.Passengers.Select(p => p.typeOfPass.ToString()))
                        }
                    )
                    .OrderBy(l => l.Status)
                    .ThenBy(l => l.DepartureDate)
                    .ThenBy(l => l.RequestDate)
                    .ToList();

                    return Json(adminList);
                }

            }
            catch (Exception e)
            {
                Logger.Log(LoggingLevel.Error, e, "Failed to get admin list in function GetAdminList. User Id = " + User.Identity.Name);
                return InternalServerError(e);
            }
        }

        private DateTime GetRequestDepartureDate(Requests request)
        {
            if (request.Flights.Count > 0 && request.Flights.Min(f => f.departDate).HasValue)
                return request.Flights.Min(f => f.departDate).Value;
            else if (request.Hotels.Count > 0 && request.Hotels.Min(h => h.checkInDate).HasValue)
                return request.Hotels.Min(h => h.checkInDate).Value;
            else if (request.Ancillaries.Count > 0 && request.Ancillaries.Min(a => a.excursionDate).HasValue)
                return request.Ancillaries.Min(a => a.excursionDate).Value;
            else
                return request.requestDate;
        }

        private int GetRequestEmployeeStatus(Requests request)
        {
            if (request.Flights.FirstOrDefault() != null)
                return request.Flights.FirstOrDefault().status.Value;
            else if (request.Hotels.FirstOrDefault() != null)
                return request.Hotels.FirstOrDefault().status.Value;
            else
                return request.status;
        }

        private int? GetRequestFlightStatus(IEnumerable<Flights> flights)
        {
            if (flights == null || flights.Count() == 0)
                return null;

            if (flights.Where(f => f.approvalStatus == (int)Enums.StatusEnum.Approved).Count() > 0)
                return (int)Enums.StatusEnum.Approved;
            else if (flights.Where(f => f.approvalStatus == (int)Enums.StatusEnum.Denied).Count() > 0)
                return (int)Enums.StatusEnum.Denied;
            else
                return (int)Enums.StatusEnum.Pending;
        }

        private int? GetRequestHotelStatus(IEnumerable<Hotels> hotels)
        {
            if (hotels == null || hotels.Count() == 0)
                return null;

            if (hotels.Where(h => h.approvalStatus == (int)Enums.StatusEnum.Approved).Count() > 0)
                return (int)Enums.StatusEnum.Approved;
            else if (hotels.Where(h => h.approvalStatus == (int)Enums.StatusEnum.Denied).Count() > 0)
                return (int)Enums.StatusEnum.Denied;
            else
                return (int)Enums.StatusEnum.Pending;
        }

        [HttpGet]
        [Route("GetFlightsByRequestId")]
        [Authorize(Roles = "Payload")]
        public IHttpActionResult GetFlightsByRequestId(int Id)
        {
            using (STAutomationEntities ste = new STAutomationEntities())
            {
                ste.Configuration.ProxyCreationEnabled = false;

                var request = ste.Requests
                    .Where(r => r.id == Id)
                    .Select(r => new
                    {
                        r.requestDate,
                        r.employeeNumber,
                        r.id,
                        r.status,
                        flights = r.Flights,
                        passengers = r.Passengers,
                        notes = r.Notes.Where(n => n.sectionId == (int)Enums.NoteSectionEnum.Flights && (n.typeId == (int)Enums.NoteTypeEnum.Employee || n.typeId == (int)Enums.NoteTypeEnum.Payload)),
                        activityLogs = r.ActivityLogs.Where(l =>
                            l.sectionType == (int)Enums.ActivityLogSectionTypeEnum.Flights &&
                            l.updateType == (int)Enums.ActivityLogUpdateTypeEnum.Status &&
                            (l.userType == (int)Enums.ActivityLogUserTypeEnum.Payload || l.userType == (int)Enums.ActivityLogUserTypeEnum.Admin))
                            .OrderByDescending(l => l.updatedOn)
                    })
                    .FirstOrDefault();

                return Json(request);
            }
        }

        [HttpGet]
        [Route("GetNote")]
        public IHttpActionResult GetNote(int Id, int sectionId, int typeId)
        {
            using (STAutomationEntities ste = new STAutomationEntities())
            {
                try
                {
                    ste.Configuration.ProxyCreationEnabled = false;
                    var note = ste.Notes
                        .Where(n => n.requestId == Id && n.sectionId == sectionId && n.typeId == typeId)
                        .FirstOrDefault();

                    return Json(note);
                }
                catch (Exception e)
                {
                    Logger.Log(LoggingLevel.Error, e, "Failed to get note in function GetNote. Request Id = {requestid} Section Id = {sectionid} Type Id = {typeid}", Id, sectionId, typeId);
                    return InternalServerError();
                }
            }
        }

        [HttpGet]
        [Route("GetRequest")]
        public IHttpActionResult GetRequest(int Id)
        {
            using (STAutomationEntities ste = new STAutomationEntities())
            {
                try
                {
                    ste.Configuration.ProxyCreationEnabled = false;
                    var request = ste.Requests
                        .Where(r => r.id == Id)
                        .Select(r => new
                        {
                            r.id,
                            r.requestDate,
                            r.status
                        })
                        .FirstOrDefault();

                    return Json(request);
                }
                catch (Exception e)
                {
                    Logger.Log(LoggingLevel.Error, e, "Failed to get request in function GetRequest. Request Id = {requestid}", Id);
                    return InternalServerError();
                }
            }
        }

        [HttpGet]
        [Route("GetRequestDetails")]
        [Authorize(Roles = "Admin")]
        public IHttpActionResult GetRequestDetails(int Id)
        {
            using (STAutomationEntities ste = new STAutomationEntities())
            {
                try
                {
                    ste.Configuration.ProxyCreationEnabled = false;
                    var request = ste.Requests
                        .Where(r => r.id == Id)
                        .Select(r => new
                        {
                            r.id,
                            r.requestDate,
                            r.status,
                            r.reviewer,
                            r.bookingNumber,
                            r.employeeNumber,
                            passengers = r.Passengers,
                            flights = r.Flights,
                            hotels = r.Hotels,
                            ancillaries = r.Ancillaries,
                            notes = r.Notes,
                            activityLogs = r.ActivityLogs.Where(l =>
                                l.sectionType == (int)Enums.ActivityLogSectionTypeEnum.Flights &&
                                (l.userType == (int)Enums.ActivityLogUserTypeEnum.Payload ||
                                l.userType == (int)Enums.ActivityLogUserTypeEnum.Admin))
                                .OrderByDescending(l => l.updatedOn)
                        })
                        .FirstOrDefault();

                    return Json(request);
                }
                catch (Exception e)
                {
                    Logger.Log(LoggingLevel.Error, e, "Failed to get request in function GetRequestDetails. Request Id = {requestid}", Id);
                    return InternalServerError();
                }
            }
        }

        [HttpPost]
        [Route("UpdateRequest")]
        [Authorize(Roles = "Admin")]
        public async Task<IHttpActionResult> UpdateRequestAsync(Requests request)
        {
            if (request == null)
            {
                return BadRequest();
            }

            using (STAutomationEntities ste = new STAutomationEntities())
            {
                ste.Configuration.ProxyCreationEnabled = false;

                Requests dbRequest = ste.Requests
                    .Include("Passengers")
                    .Include("Flights")
                    .Include("Hotels")
                    .Include("Ancillaries")
                    .Include("Notes")
                    .Where(r => r.id == request.id)
                    .FirstOrDefault();

                if (request.Flights.Count > 0)
                {
                    try
                    {
                        foreach (var updatedFlight in request.Flights)
                        {
                            var dbFlight = dbRequest.Flights.Where(f => f.id == updatedFlight.id).FirstOrDefault();

                            if (dbFlight.approvalStatus != updatedFlight.approvalStatus)
                            {
                                dbFlight.approvalStatus = updatedFlight.approvalStatus;
                                var employee = ste.Employees.Where(e => e.EmpNumber == User.Identity.Name).FirstOrDefault();
                                ActivityLogs logEntry = new ActivityLogs
                                {
                                    empNumber = User.Identity.Name,
                                    empName = employee.FirstName + " " + employee.LastName,
                                    updatedOn = DateTime.Now,
                                    updateType = (int)Enums.ActivityLogUpdateTypeEnum.Status,
                                    requestId = updatedFlight.requestId,
                                    sectionType = (int)Enums.ActivityLogSectionTypeEnum.Flights,
                                    statusChange = updatedFlight.approvalStatus,
                                    userType = (int)Enums.ActivityLogUserTypeEnum.Admin,
                                    foreignId = updatedFlight.id
                                };
                                ste.ActivityLogs.Add(logEntry);
                            }

                            if (dbFlight.price != updatedFlight.price)
                            {
                                dbFlight.price = updatedFlight.price;
                                var employee = ste.Employees.Where(e => e.EmpNumber == User.Identity.Name).FirstOrDefault();
                                ActivityLogs logEntry = new ActivityLogs
                                {
                                    empNumber = User.Identity.Name,
                                    empName = employee.FirstName + " " + employee.LastName,
                                    updatedOn = DateTime.Now,
                                    updateType = (int)Enums.ActivityLogUpdateTypeEnum.Price,
                                    requestId = updatedFlight.requestId,
                                    sectionType = (int)Enums.ActivityLogSectionTypeEnum.Flights,
                                    statusChange = updatedFlight.approvalStatus,
                                    userType = (int)Enums.ActivityLogUserTypeEnum.Admin,
                                    foreignId = updatedFlight.id
                                };
                                ste.ActivityLogs.Add(logEntry);
                            }
                        }
                    }
                    catch (Exception e)
                    {
                        Logger.Log(LoggingLevel.Error, e, "Failed to update flights in function UpdateRequestAsync. Object = {@object}", request);
                        return InternalServerError();
                    }
                }

                if (request.Hotels.Count > 0)
                {
                    try
                    {
                        foreach (var updatedHotel in request.Hotels)
                        {
                            var dbHotel = dbRequest.Hotels.Where(h => h.id == updatedHotel.id).FirstOrDefault();
                            dbHotel.approvalStatus = updatedHotel.approvalStatus;
                            dbHotel.price = updatedHotel.price;
                        }
                    }
                    catch (Exception e)
                    {
                        Logger.Log(LoggingLevel.Error, e, "Failed to update hotels in function UpdateRequestAsync. Object = {@object}", request);
                        return InternalServerError();
                    }
                }

                if (request.Ancillaries.Count > 0)
                {
                    try
                    {
                        foreach (var updatedAncillary in request.Ancillaries)
                        {
                            var dbAncillary = dbRequest.Ancillaries.Where(a => a.id == updatedAncillary.id).FirstOrDefault();
                            dbAncillary.approvalStatus = updatedAncillary.approvalStatus;
                            dbAncillary.price = updatedAncillary.price;
                        }
                    }
                    catch (Exception e)
                    {
                        Logger.Log(LoggingLevel.Error, e, "Failed to update ancillaries in function UpdateRequestAsync. Object = {@object}", request);
                        return InternalServerError();
                    }
                }

                if (request.Notes.Where(n => n.typeId == (int)Enums.NoteTypeEnum.Admin).Count() > 0)
                {
                    try
                    {
                        foreach (var updatedNote in request.Notes.Where(n => n.typeId == (int)Enums.NoteTypeEnum.Admin))
                        {
                            var dbNote = dbRequest.Notes.Where(n => n.id == updatedNote.id && n.sectionId == updatedNote.sectionId).FirstOrDefault();
                            if (dbNote == null)
                                dbRequest.Notes.Add(updatedNote);
                            else
                                dbNote.text = updatedNote.text;

                        }
                    }
                    catch (Exception e)
                    {
                        Logger.Log(LoggingLevel.Error, e, "Failed to update notes in function UpdateRequestAsync. Object = {@object}", request);
                        return InternalServerError();
                    }
                }

                try
                {
                    if (request.bookingNumber.HasValue)
                    {
                        dbRequest.status = (int)Enums.StatusEnum.Approved;
                        dbRequest.reviewer = request.reviewer;
                        dbRequest.bookingNumber = request.bookingNumber;

                        await ste.SaveChangesAsync();
                        await SendUpdateNotificationToRequester(dbRequest, ste, "Staff Travel - Request update", "RequestBooked_Employee");
                        await UpdatePassesBalance(request);
                    }
                    else
                    {
                        await ste.SaveChangesAsync();
                        await SendUpdateNotificationToRequester(dbRequest, ste, "Staff Travel - Request update", "RequestUpdated_Employee");
                    }
                }
                catch (Exception e)
                {
                    Logger.Log(LoggingLevel.Error, e, "Failed to update request in function UpdateRequestAsync. Object = {@object}", request);
                    return InternalServerError();
                }

                return Ok();

            }
        }


        [HttpGet]
        [Route("RejectRequest")]
        [Authorize(Roles = "Admin")]
        public async Task<IHttpActionResult> RejectRequestAsync(int id)
        {
            using (STAutomationEntities ste = new STAutomationEntities())
            {
                try
                {
                    ste.Configuration.ProxyCreationEnabled = false;

                    Requests dbRequest = ste.Requests
                        .Include("Flights")
                        .Include("Hotels")
                        .Include("Ancillaries")
                        .Where(r => r.id == id)
                        .FirstOrDefault();

                    if (dbRequest == null)
                        return BadRequest();

                    if (dbRequest.Flights.Count > 0)
                    {
                        foreach (var flight in dbRequest.Flights)
                        {
                            flight.approvalStatus = (int)Enums.StatusEnum.Denied;
                        }
                    }

                    if (dbRequest.Hotels.Count > 0)
                    {
                        foreach (var hotel in dbRequest.Hotels)
                        {
                            hotel.approvalStatus = (int)Enums.StatusEnum.Denied;
                        }
                    }

                    if (dbRequest.Ancillaries.Count > 0)
                    {
                        foreach (var ancillary in dbRequest.Ancillaries)
                        {
                            ancillary.approvalStatus = (int)Enums.StatusEnum.Denied;
                        }
                    }

                    dbRequest.status = (int)Enums.StatusEnum.Denied;

                    await ste.SaveChangesAsync();

                    if (dbRequest.bookingNumber != null)
                    {//after having booking number, it needs to deduct passes
                        await deductPasses(id, dbRequest.employeeNumber);
                    }
                    await AddNoteForRejectPasses(id, true);

                    return Ok();
                }
                catch (Exception e)
                {
                    Logger.Log(LoggingLevel.Error, e, "Failed to reject request in function RejectRequestAsync. Request Id = {requestid}", id);
                    throw;
                }
            }
        }

        [HttpGet]
        [Route("CancelMyRequest")]
        public async Task<IHttpActionResult> CancelMyRequestAsync(int id)
        {
            using (STAutomationEntities ste = new STAutomationEntities())
            {
                try
                {
                    ste.Configuration.ProxyCreationEnabled = false;

                    Requests request = ste.Requests.Where(r => r.id == id).FirstOrDefault();

                    if (request != null && request.employeeNumber == User.Identity.Name)
                    {
                        request.status = (int)Enums.StatusEnum.Denied;
                        await ste.SaveChangesAsync();

                        //change status of all components to set denied
                        await changeStatusOfAllComponents(id, true);

                        if (request.bookingNumber != null)
                        {//after having booking number, it needs to deduct passes
                            await deductPasses(id, request.employeeNumber);
                        }
                        await AddNoteForRejectPasses(id, false);
                    }
                    else
                        return BadRequest();

                    return Ok();
                }
                catch (Exception e)
                {
                    Logger.Log(LoggingLevel.Error, e, "Failed to reject request in function CancelMyRequestAsync. Request Id = {requestid}", id);
                    throw;
                }
            }
        }

        private async Task<IHttpActionResult> changeStatusOfAllComponents(int id, Boolean isEmployeeRequest)
        {
            try
            {
                using (STAutomationEntities ste = new STAutomationEntities())
                {
                    Requests request = ste.Requests
                                        .Include("Flights")
                                        .Include("Hotels")
                                        .Include("Ancillaries")
                                        .Where(r => r.id == id).FirstOrDefault();
                    if (request.Flights != null)
                    {
                        foreach (Flights f in request.Flights)
                        {
                            Flights flight = request.Flights.Where(r => r.id == f.id).FirstOrDefault();
                            if (isEmployeeRequest)
                            {
                                flight.status = (int)Enums.StatusEnum.Denied;
                            }
                            await ste.SaveChangesAsync();
                        }
                    }

                    if (request.Hotels != null)
                    {
                        foreach (Hotels h in request.Hotels)
                        {
                            Hotels hotel = request.Hotels.Where(r => r.id == h.id).FirstOrDefault();
                            if (isEmployeeRequest)
                            {
                                hotel.status = (int)Enums.StatusEnum.Denied;
                            }
                            await ste.SaveChangesAsync();
                        }
                    }

                    if (request.Ancillaries != null)
                    {
                        foreach (Ancillaries a in request.Ancillaries)
                        {
                            Ancillaries ancillary = request.Ancillaries.Where(r => r.id == a.id).FirstOrDefault();
                            if (isEmployeeRequest)
                            {
                                ancillary.status = (int)Enums.StatusEnum.Denied;
                            }
                            await ste.SaveChangesAsync();
                        }
                    }
                }
                return Ok();
            }
            catch (Exception e)
            {
                Logger.Log(LoggingLevel.Error, e, "Failed to update request in function changeStatusOfAllComponents. User Id = {userid} Request Id = {requestid}", User.Identity.Name, id);
                return InternalServerError(e);
            }

        }

        private async Task<IHttpActionResult> AddNoteForRejectPasses(int requestId, bool isAdmin)
        {
            if (requestId != 0)
            {
                try
                {
                    using (STAutomationEntities ste = new STAutomationEntities())
                    {
                        Notes notes = ste.Notes.Where(x => x.requestId == requestId && x.sectionId == (int)Enums.NoteSectionEnum.Reject && x.typeId == (int)Enums.NoteTypeEnum.Employee).FirstOrDefault();
                        if (notes != null)
                        {
                            notes.text = "This request was rejected";
                            notes.enteredBy = User.Identity.Name;
                            if (isAdmin)
                            {
                                notes.typeId = (int)Enums.NoteTypeEnum.Admin;
                            }
                            else
                            {
                                notes.typeId = (int)Enums.NoteTypeEnum.Employee;
                            }
                            notes.sectionId = (int)Enums.NoteSectionEnum.Reject;
                            notes.requestId = requestId;
                        }
                        else
                        {
                            Notes note = new Notes();
                            note.enteredBy = User.Identity.Name;
                            note.enteredOn = DateTime.Now;
                            note.text = "This request was rejected";
                            if (isAdmin)
                            {
                                note.typeId = (int)Enums.NoteTypeEnum.Admin;
                            }
                            else
                            {
                                note.typeId = (int)Enums.NoteTypeEnum.Employee;
                            }
                            note.sectionId = (int)Enums.NoteSectionEnum.Reject;
                            note.requestId = requestId;
                            ste.Notes.Add(note);
                        }

                        await ste.SaveChangesAsync();
                    }
                }
                catch (Exception e)
                {
                    Logger.Log(LoggingLevel.Error, e, "Failed to add note for rejected request in function AddNoteForRejectPasses. User Id = {userid} Request Id = {requestid}", User.Identity.Name, requestId);
                    return InternalServerError(e);
                }
            }
            return Ok();
        }

        private async Task<IHttpActionResult> deductPasses(int id, string employeeNumber)
        {
            string yearlyPassExpired = DateTime.Now.Year.ToString();
            string bonusPassExpired = null;
            DateTime afteroneyear = DateTime.Now.AddYears(1);

            if (employeeNumber != null)
            {
                try
                {
                    using (STAutomationEntities ste = new STAutomationEntities())
                    {
                        bonusPassExpired = ste.PassesBonusExpiryDate.Where(x => x.ExpiredBy >= DateTime.Now && x.ExpiredBy <= afteroneyear).Select(x => x.ExpiredBy).FirstOrDefault().ToString("yyyy-MM-dd");

                        var passes = (from p in ste.Passengers
                                      where p.requestId == id
                                      group p by p.typeOfPass into grp
                                      select new { key = grp.Key, cnt = grp.Count() }).ToList();
                        foreach (var pass in passes)
                        {
                            //YCP, BCP, LMCP, NONE
                            if (pass.key == (int)Enums.TypeOfPassEnum.YCP)
                            {
                                PassesBalance pb = ste.PassesBalances.Where(x => x.employeeNumber.Equals(employeeNumber) && x.type.Equals("yearly") && x.year.Equals(yearlyPassExpired)).FirstOrDefault();
                                if (pb != null)
                                {
                                    pb.used -= pass.cnt;
                                    await ste.SaveChangesAsync();
                                }
                            }
                            if (pass.key == (int)Enums.TypeOfPassEnum.BCP)
                            {
                                PassesBalance pb = ste.PassesBalances.Where(x => x.employeeNumber.Equals(employeeNumber) && x.type.Equals("bonus") && x.year.Equals(bonusPassExpired)).FirstOrDefault();
                                if (pb != null)
                                {
                                    pb.used -= pass.cnt;
                                    await ste.SaveChangesAsync();
                                }
                            }
                            if (pass.key == (int)Enums.TypeOfPassEnum.LMCP)
                            {
                                PassesBalance pb = ste.PassesBalances.Where(x => x.employeeNumber.Equals(employeeNumber) && x.type.Equals("last") && x.year.Equals(yearlyPassExpired)).FirstOrDefault();
                                if (pb != null)
                                {
                                    pb.used -= pass.cnt;
                                    await ste.SaveChangesAsync();
                                }
                            }
                        }
                    }
                }
                catch (Exception e)
                {
                    Logger.Log(LoggingLevel.Error, e, "Failed to deduct passes in function deductPasses. User Id = {userid} Request Id = {requestid} Employee Id = {empid}", User.Identity.Name, id, employeeNumber);
                    return InternalServerError(e);
                }
            }
            return Ok();
        }

        private async Task<IHttpActionResult> UpdatePassesBalance(Requests request)
        {
            int ycpPass = 0;
            int bcpPass = 0;
            int lmcpPass = 0;

            //only one time deduct passes
            if (!IsPassDeducted(request.id))
            {
                foreach (Passengers pax in request.Passengers)
                {
                    if (pax.typeOfPass == (int)Enums.TypeOfPassEnum.YCP)
                    {
                        ycpPass++;
                    }
                    else if (pax.typeOfPass == (int)Enums.TypeOfPassEnum.BCP)
                    {
                        bcpPass++;
                    }
                    else if (pax.typeOfPass == (int)Enums.TypeOfPassEnum.LMCP)
                    {
                        lmcpPass++;
                    }
                }

                using (STAutomationEntities ste = new STAutomationEntities())
                {
                    #region PassDeductionForEachPasses
                    if (ycpPass > 0)
                    {
                        try
                        {
                            var ps = ste.PassesBalances.Where(x => x.type.Equals("yearly") && x.year == DateTime.Now.Year.ToString() && x.employeeNumber.Equals(request.employeeNumber)).FirstOrDefault();
                            if (ps != null)
                            {
                                ps.used += ycpPass;
                            }
                            else
                            {
                                //new insert
                                PassesBalance passesBalance = new PassesBalance();
                                passesBalance.employeeNumber = request.employeeNumber;
                                passesBalance.type = "yearly";
                                passesBalance.used = ycpPass;
                                passesBalance.updateDate = DateTime.Now;
                                passesBalance.status = "1";
                                passesBalance.year = DateTime.Now.Year.ToString();
                                ste.PassesBalances.Add(passesBalance);
                            }

                            ste.SaveChanges();
                        }
                        catch (Exception e)
                        {
                            Logger.Log(LoggingLevel.Error, e, "Failed to update ycp passes balance in function UpdatePassesBalance. Object = {@object}", request);
                            throw;
                        }
                    }

                    if (bcpPass > 0)
                    {
                        try
                        {
                            DateTime afteroneyear = DateTime.Now.AddYears(1);
                            string bonusExpiryDate = ste.PassesBonusExpiryDate.Where(x => x.ExpiredBy >= DateTime.Now && x.ExpiredBy <= afteroneyear).Select(x => x.ExpiredBy).FirstOrDefault().ToString("yyyy-MM-dd");

                            var ps = ste.PassesBalances.Where(x => x.type.Equals("bonus") && x.year == bonusExpiryDate && x.employeeNumber.Equals(request.employeeNumber)).FirstOrDefault();
                            if (ps != null)
                            {
                                ps.used += bcpPass;
                            }
                            else
                            {
                                //new insert
                                PassesBalance passesBalance = new PassesBalance();
                                passesBalance.employeeNumber = request.employeeNumber;
                                passesBalance.type = "bonus";
                                passesBalance.used = bcpPass;
                                passesBalance.updateDate = DateTime.Now;
                                passesBalance.status = "1";
                                passesBalance.year = bonusExpiryDate;
                                ste.PassesBalances.Add(passesBalance);
                            }

                            ste.SaveChanges();
                        }
                        catch (Exception e)
                        {
                            Logger.Log(LoggingLevel.Error, e, "Failed to update bcp passes balance in function UpdatePassesBalance. Object = {@object}", request);
                            throw;
                        }
                    }

                    if (lmcpPass > 0)
                    {
                        try
                        {
                            var ps = ste.PassesBalances.Where(x => x.type.Equals("last") && x.employeeNumber.Equals(request.employeeNumber)).FirstOrDefault();
                            if (ps != null)
                            {
                                ps.used += lmcpPass;
                            }
                            else
                            {
                                //new insert
                                PassesBalance passesBalance = new PassesBalance();
                                passesBalance.employeeNumber = request.employeeNumber;
                                passesBalance.type = "last";
                                passesBalance.used = lmcpPass;
                                passesBalance.updateDate = DateTime.Now;
                                passesBalance.status = "1";
                                passesBalance.year = DateTime.Now.Year.ToString();
                                ste.PassesBalances.Add(passesBalance);
                            }

                            ste.SaveChanges();
                        }
                        catch (Exception e)
                        {
                            Logger.Log(LoggingLevel.Error, e, "Failed to update lmcp passes balance in function UpdatePassesBalance. Object = {@object}", request);
                            throw;
                        }
                    }

                    #endregion

                    //add note for avoiding pass deduction several time for the future
                    Notes notes = ste.Notes.Where(x => x.requestId == request.id && x.sectionId == (int)Enums.NoteSectionEnum.BalanceChanged && x.typeId == (int)Enums.NoteTypeEnum.Admin).FirstOrDefault();
                    if (notes == null)
                    {
                        try
                        {
                            Notes note = new Notes();
                            note.text = "Passes deducted by this request";
                            note.enteredBy = User.Identity.Name;
                            note.enteredOn = DateTime.Now;
                            note.typeId = (int)Enums.NoteTypeEnum.Admin;
                            note.sectionId = (int)Enums.NoteSectionEnum.BalanceChanged;
                            note.requestId = request.id;
                            ste.Notes.Add(note);
                            await ste.SaveChangesAsync();
                        }
                        catch (Exception e)
                        {
                            Logger.Log(LoggingLevel.Error, e, "Failed to add note in function UpdatePassesBalance. Object = {@object}", request);
                            throw;
                        }
                    }
                }
            }
            return Ok();
        }

        private static bool IsPassDeducted(int RequestId)
        {
            using (STAutomationEntities ste = new STAutomationEntities())
            {
                Notes notes = ste.Notes.Where(x => x.requestId == RequestId
                                              && x.sectionId == (int)Enums.NoteSectionEnum.BalanceChanged
                                              && x.typeId == (int)Enums.NoteTypeEnum.Admin).FirstOrDefault();

                return notes == null ? false : true;
            }
        }

        [HttpPost]
        [Route("UpdateFlights")]
        [Authorize(Roles = "Payload")]
        public async Task<IHttpActionResult> UpdateFlightsAsync(List<Flights> Flights)
        {
            if (Flights == null || Flights.Count == 0)
            {
                return BadRequest();
            }

            using (STAutomationEntities ste = new STAutomationEntities())
            {
                try
                {
                    ste.Configuration.ProxyCreationEnabled = false;
                    Flights dbFlight = new Flights();
                    foreach (var flight in Flights)
                    {
                        dbFlight = ste.Flights.Where(f => f.id == flight.id).FirstOrDefault();

                        if (dbFlight.approvalStatus != flight.approvalStatus)
                        {
                            dbFlight.approvalStatus = flight.approvalStatus;
                            var employee = ste.Employees.Where(e => e.EmpNumber == User.Identity.Name).FirstOrDefault();
                            ActivityLogs logEntry = new ActivityLogs
                            {
                                empNumber = User.Identity.Name,
                                empName = employee.FirstName + " " + employee.LastName,
                                updatedOn = DateTime.Now,
                                updateType = (int)Enums.ActivityLogUpdateTypeEnum.Status,
                                requestId = flight.requestId,
                                sectionType = (int)Enums.ActivityLogSectionTypeEnum.Flights,
                                statusChange = flight.approvalStatus,
                                userType = (int)Enums.ActivityLogUserTypeEnum.Payload,
                                foreignId = flight.id
                            };
                            ste.ActivityLogs.Add(logEntry);
                        }
                    }

                    await ste.SaveChangesAsync();
                    Requests request = ste.Requests.Where(r => r.id == dbFlight.requestId).FirstOrDefault();
                    await SendUpdateNotificationToRequester(request, ste, "Staff Travel - Flight update", "FlightRequestUpdated_Employee");

                    return Ok();
                }
                catch (Exception e)
                {
                    Logger.Log(LoggingLevel.Error, e, "Failed to update flight request in function UpdateFlightsAsync. Object = {@object}", Flights);
                    return InternalServerError();
                }
            }
        }

        [HttpPost]
        [Route("UpdateHotels")]
        [Authorize(Roles = "Admin")]
        public async Task<IHttpActionResult> UpdateHotelsAsync(List<Hotels> Hotels)
        {
            if (Hotels == null || Hotels.Count == 0)
            {
                return BadRequest();
            }

            using (STAutomationEntities ste = new STAutomationEntities())
            {
                try
                {
                    ste.Configuration.ProxyCreationEnabled = false;
                    Hotels currentHotel = new Hotels();
                    foreach (var hotel in Hotels)
                    {
                        currentHotel = ste.Hotels.Where(h => h.id == hotel.id).FirstOrDefault();
                        currentHotel.approvalStatus = hotel.approvalStatus;
                        currentHotel.price = hotel.price;
                        await ste.SaveChangesAsync();
                    }

                    return Ok();
                }
                catch (Exception e)
                {
                    Logger.Log(LoggingLevel.Error, e, "Failed to update hotels request in function UpdateHotelsAsync. Object = {@object}", Hotels);
                    return InternalServerError();
                }
            }
        }

        [HttpPost]
        [Route("UpdateAncillaries")]
        [Authorize(Roles = "Admin")]
        public async Task<IHttpActionResult> UpdateAncillariesAsync(List<Ancillaries> Ancillaries)
        {
            if (Ancillaries == null || Ancillaries.Count == 0)
            {
                return BadRequest();
            }

            using (STAutomationEntities ste = new STAutomationEntities())
            {
                ste.Configuration.ProxyCreationEnabled = false;
                Ancillaries currentAncillary = new Ancillaries();
                foreach (var ancillary in Ancillaries)
                {
                    try
                    {
                        currentAncillary = ste.Ancillaries.Where(f => f.id == ancillary.id).FirstOrDefault();
                        currentAncillary.approvalStatus = ancillary.approvalStatus;
                        currentAncillary.price = ancillary.price;
                        await ste.SaveChangesAsync();
                    }
                    catch (Exception e)
                    {
                        Logger.Log(LoggingLevel.Error, e, "Failed to update Ancillaries request in function UpdateAncillariesAsync. Object = {@object}", Ancillaries);
                        return InternalServerError();
                    }
                }

                return Ok();
            }
        }



        [HttpPost]
        [Route("AddNote")]
        public async Task<IHttpActionResult> AddNoteAsync(Notes Note)
        {
            if (Note == null)
            {
                return BadRequest();
            }

            using (STAutomationEntities ste = new STAutomationEntities())
            {
                try
                {
                    ste.Configuration.ProxyCreationEnabled = false;
                    Notes tempNote = ste.Notes.Where(n => n.id == Note.id).FirstOrDefault();

                    if (tempNote == null)
                        ste.Notes.Add(Note);
                    else
                        tempNote.text = Note.text;

                    await ste.SaveChangesAsync();

                    return Ok();
                }
                catch (Exception e)
                {
                    Logger.Log(LoggingLevel.Error, e, "Failed to add note in function AddNoteAsync. Object = {@object}", Note);
                    return InternalServerError();
                }
            }

        }

        [HttpPost]
        [Route("AddNotes")]
        public async Task<IHttpActionResult> AddNotesAsync(List<Notes> Notes)
        {
            if (Notes == null || Notes.Count == 0)
            {
                return BadRequest();
            }

            using (STAutomationEntities ste = new STAutomationEntities())
            {
                try
                {
                    ste.Configuration.ProxyCreationEnabled = false;

                    foreach (Notes note in Notes)
                    {
                        Notes tempNote = ste.Notes.Where(n => n.id == note.id).FirstOrDefault();

                        if (tempNote == null)
                            ste.Notes.Add(note);
                        else
                            tempNote.text = note.text;

                        await ste.SaveChangesAsync();
                    }

                    return Ok();
                }
                catch (Exception e)
                {
                    Logger.Log(LoggingLevel.Error, e, "Failed to add note in function AddNoteAsync. Object = {@object}", Notes);
                    return InternalServerError();
                }
            }

        }

        private string returnNumberOfPass(int yearly, int bonus, int last, int none, int ip)
        {

            string returnStr = null;
            if (yearly > 0)
                returnStr = "YCP (" + yearly.ToString() + ")";
            if (last > 0)
                returnStr += " LMCP (" + last.ToString() + ")";
            if (bonus > 0)
                returnStr += " BCP (" + bonus.ToString() + ")";
            if (none > 0)
                returnStr += " NONE (" + none.ToString() + ")";
            if (ip > 0)
                returnStr += " IP (" + ip.ToString() + ")";

            return returnStr;
        }

        private string returnTypeOfPass(int requestid)
        {
            string returnString = null;
            using (STAutomationEntities ste = new STAutomationEntities())
            {
                var typeofpass = ste.Passengers.Where(x => x.requestId == requestid).GroupBy(x => x.typeOfPass).Select(x => x);
                foreach (var t in typeofpass) //YCP, BCP, LMCP, NONE
                {
                    string pass = null;
                    if (t.Key == (int)Enums.TypeOfPassEnum.YCP)
                    {
                        pass = "YCP";
                    }
                    else if (t.Key == (int)Enums.TypeOfPassEnum.BCP)
                    {
                        pass = "BCP";
                    }
                    else if (t.Key == (int)Enums.TypeOfPassEnum.LMCP)
                    {
                        pass = "LMCP";
                    }
                    else if (t.Key == (int)Enums.TypeOfPassEnum.NONE)
                    {
                        pass = "NONE";
                    }
                    else if (t.Key == (int)Enums.TypeOfPassEnum.IP)
                    {
                        pass = "IP";
                    }
                    if (string.IsNullOrEmpty(returnString))
                    {
                        returnString = pass;
                    }
                    else
                    {
                        returnString = string.Join(", ", returnString, pass);
                    }
                }
            }
            return returnString;
        }

        private string returnNumberOfPass(int id)
        {
            string returnString = null;
            using (STAutomationEntities ste = new STAutomationEntities())
            {
                var typeofpass = ste.Passengers.Where(x => x.requestId == id).GroupBy(x => x.typeOfPass).Select(x => x);
                foreach (var t in typeofpass) //YCP, BCP, LMCP, NONE
                {
                    string pass = null;
                    pass = t.Select(x => x.typeOfPass).Count().ToString();

                    if (string.IsNullOrEmpty(returnString))
                    {
                        returnString = pass;
                    }
                    else
                    {
                        returnString = string.Join(", ", returnString, pass);
                    }
                }
            }
            return returnString;
        }

        private async Task SendNewRequestNotificationsAsync(Requests request, STAutomationEntities ste)
        {
            //prepare the data that will be sent in emails
            _emailUtility = new EmailUtility();
            Employee requester = ste.Employees.Where(e => e.EmpNumber == request.employeeNumber).FirstOrDefault();
            string requesterName = requester.FirstName + " " + requester.LastName;
            //routes
            string adminReviewRoute = ConfigurationManager.AppSettings["AdminReviewRoute"];
            string employeeRequestProgressRoute = ConfigurationManager.AppSettings["EmployeeRequestProgressRoute"];
            string managerReviewRoute = ConfigurationManager.AppSettings["ManagerReviewRoute"];

            //emails
            string managerEmail = ste.Employees.Where(e => e.EmpNumber == requester.ManagerEmpNumber).Select(e => e.Email).FirstOrDefault();
            string adminEmail = ConfigurationManager.AppSettings["AdminEmail"];

            //urls
            string requestProgressUrl = Url.Link("AngularApp", new { action = employeeRequestProgressRoute, id = request.id });
            string adminReviewUrl = Url.Link("AngularApp", new { action = adminReviewRoute, id = request.id });
            string managerReviewUrl = Url.Link("AngularApp", new { action = managerReviewRoute, id = request.id });

            //send all emails in parallel
            List<Task> tasks = new List<Task>();

            tasks.Add(_emailUtility.SendEmail("Staff Travel Request Received", "NewRequest_Employee", requester.Email, new { url = requestProgressUrl, request = request, emailTo = requester.Email }));
            tasks.Add(_emailUtility.SendEmail("Staff Travel Request - " + requesterName, "NewRequest_Manager", managerEmail, new { url = managerReviewUrl, name = requesterName, emailTo = managerEmail }));
            tasks.Add(_emailUtility.SendEmail("Staff Travel Request - " + requesterName, "NewRequest_Admin", adminEmail, new { url = adminReviewUrl, name = requesterName, emailTo = adminEmail }));

            if (request.Flights.Count > 0)
            {
                tasks.AddRange(
                    GetListOfNewFlightNotifications(
                        request.Flights.First().departDate.Value.ToString("MMMM dd, yyyy"),
                        request.Flights.First().departTo,
                        request));
            }

            await Task.WhenAll(tasks);
        }

        private List<Task> GetListOfNewFlightNotifications(string departDate, string departTo, Requests request)
        {
            List<Task> tasks = new List<Task>();
            string payloadReviewRoute = ConfigurationManager.AppSettings["PayloadReviewRoute"];
            string payloadReviewUrl = Url.Link("AngularApp", new { action = payloadReviewRoute, id = request.id });
            string subject = "Staff Travel Request - " + departDate + " " + departTo;

            List<string> payloadEmails = GetEmailAddressesInRole("Payload");

            foreach (string emailAddress in payloadEmails)
            {
                tasks.Add(_emailUtility.SendEmail(subject, "NewRequest_Payload", emailAddress, new { url = payloadReviewUrl, request = request, emailTo = emailAddress }));
            }

            return tasks;
        }

        private async Task SendUpdateNotificationToAdmin(Requests request, STAutomationEntities ste)
        {
            _emailUtility = new EmailUtility();
            string requesterName = ste.Employees
                                    .Where(e => e.EmpNumber == request.employeeNumber)
                                    .Select(e => e.FirstName + " " + e.LastName)
                                    .FirstOrDefault();
            string adminReviewRoute = ConfigurationManager.AppSettings["AdminReviewRoute"];
            string adminEmail = ConfigurationManager.AppSettings["AdminEmail"];

            string adminReviewUrl = Url.Link("AngularApp", new { action = adminReviewRoute, id = request.id });

            await _emailUtility.SendEmail("Staff Travel Update - " + requesterName, "RequestUpdated_Admin", adminEmail, new { url = adminReviewUrl, name = requesterName, emailTo = adminEmail });
        }

        private static async Task SendUpdateNotificationToRequester(Requests request, STAutomationEntities ste, string subject, string template)
        {
            _emailUtility = new EmailUtility();
            Employee requester = ste.Employees.Where(e => e.EmpNumber == request.employeeNumber).FirstOrDefault();
            await _emailUtility.SendEmail(subject, template, requester.Email, new { emailTo = requester.Email, request = request });
        }

        private List<string> GetEmailAddressesInRole(string roleName)
        {
            List<string> emailAddresses = new List<string>();
            var context = Request.GetOwinContext().GetUserManager<ApplicationUserManager>();
            var roleManager = new RoleManager<IdentityRole>(new RoleStore<IdentityRole>(new ApplicationDbContext()));
            var role = roleManager.FindByName(roleName).Users.FirstOrDefault();

            if (role != null)
            {
                var users = context.Users
                    .Where(u => u.Roles.Select(r => r.RoleId).Contains(role.RoleId))
                    .Select(u => u.UserName)
                    .ToList();


                using (STAutomationEntities ste = new STAutomationEntities())
                {
                    emailAddresses = ste.Employees.Where(e => users.Contains(e.EmpNumber))
                        .Select(e => e.Email)
                        .ToList();
                }
            }

            return emailAddresses;
        }

    }
}
