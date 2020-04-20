using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using StaffTravel.Models;
using Newtonsoft.Json;
using SWG.Common.Utility.Logging;

namespace StaffTravel.Controllers
{
    [Authorize]
    public class PassesInfoController : ApiController
    {
        [HttpGet]
        [Route("api/passesInfo/getbasicinfobyemployeenumber")]
        public string GetBasicInfoByEmployeeNumber(string empNumber)
        {
            using (STAutomationEntities db = new STAutomationEntities())
            {
                var sti = GetBasicInfo(empNumber);

                return JsonConvert.SerializeObject(sti);
            }
        }

        [HttpGet]
        [Route("api/passesInfo/GetBasicInfoByRequestId")]
        public IHttpActionResult GetBasicInfoByRequestId(int requestId)
        {
            using (STAutomationEntities db = new STAutomationEntities())
            {
                string empNumber = (from r in db.Requests
                                    join e in db.Employees on r.employeeNumber equals e.EmpNumber
                                    where r.id == requestId
                                    select e.EmpNumber).FirstOrDefault();

                var sti = GetBasicInfo(empNumber);

                return Json(sti);
            }
        }


        [HttpGet]
        [Route("api/passesInfo/GetExpiryDateBonus")]
        public IHttpActionResult GetExpiryDateBonus()
        {
            using (STAutomationEntities db = new STAutomationEntities())
            {
                var defaultExpirydate = (from d in db.PassesBonusExpiryDate
                                         where d.ExpiredBy >= DateTime.Now
                                         orderby d.ExpiredBy
                                         select d.ExpiredBy).FirstOrDefault();


                string returnExpiryDate = defaultExpirydate.ToString("MMM dd, yyyy");

                return Json(returnExpiryDate);
            }
        }



        private basicInfo GetBasicInfo(string empNumber)
        {
            try
            {
                basicInfo bi = new basicInfo();
                using (STAutomationEntities db = new STAutomationEntities())
                {
                    //get an employee info who is eligible and active status
                    Employee emp = db.Employees.Where(x => x.EmpNumber.Equals(empNumber) && x.Eligibility == (int)Enums.Eligibility.Yes && x.Status == (int)Enums.ActiveStatus.Active).FirstOrDefault();
                    if (emp != null)
                    {
                        bi.empnumber = emp.EmpNumber;
                        bi.firstname = emp.FirstName;
                        bi.lastname = emp.LastName;
                        bi.email = emp.Email;
                        bi.senioritydate = emp.SeniorityDate.ToString();
                        bi.HowLong = HowLongYouHaveBeenServices(emp.SeniorityDate);
                        bi.IsFullTime = emp.IsFullTime;
                        //applied pending status from passes count
                        //if pending status, take out from how many passes you have but add 

                        bi.HowManyPassesYouHave = 0; // HowManyPassesYouHave(emp.SeniorityDate, emp.IsFullTime);

                        string currentYear = DateTime.Now.Year.ToString();

                        //getting Expiry date for BYCP from employee's bycp as each employee has different expiry date
                        //if no data from employee's bycp, look for from bonus expiry date
                        DateTime currentDate = DateTime.Now;
                        string bonusExpirayDate = db.PassesBonus.Where(x => x.employeeNumber.Equals(empNumber) && x.ExpiryDate >= currentDate).Select(x => x.ExpiryDate).FirstOrDefault().ToString("yyyy-MM-dd");
                        if (string.IsNullOrEmpty(bonusExpirayDate))
                            bonusExpirayDate = db.PassesBonusExpiryDate.Where(x => x.ExpiredBy >= currentDate).Select(x => x.ExpiredBy).FirstOrDefault().ToString("yyyy-MM-dd");

                        bi.YearlyUsed = db.PassesBalances.Where(x => x.type.Equals("yearly") && x.employeeNumber.Equals(empNumber) && x.year.Equals(currentYear)).Select(x => x.used).FirstOrDefault();
                        bi.BonusUsed = db.PassesBalances.Where(x => x.type.Equals("bonus") && x.employeeNumber.Equals(empNumber) && x.year.Equals(bonusExpirayDate)).Select(x => x.used).FirstOrDefault();
                        bi.BonusEarned = 0; // db.PassesBonus.Where(x => x.employeeNumber.Equals(empNumber) && x.ExpiryDate >= DateTime.Now).Select(x => x.howmanybonus).FirstOrDefault();
                        bi.LastMinuteUsed = db.PassesBalances.Where(x => x.type.Equals("last") && x.employeeNumber.Equals(empNumber)).Select(x => x.used).FirstOrDefault();
                        bi.YealyPending = HowManyPassesPending(empNumber, currentYear, "YCP");
                        bi.BonusPending = HowManyPassesPending(empNumber, bonusExpirayDate, "YCBP");
                        bi.LastPending = HowManyPassesPending(empNumber, "", "LCP");
                        return bi;
                    }
                    else
                    {
                        return bi;
                    }
                }
            }
            catch (Exception ex)
            {
                Logger.Log(LoggingLevel.Error, ex, "Error on retriving basic info in function GetBasicInfo. User Id = {userid}", empNumber);
                return null;
            }

        }

        private int HowManyPassesPending(string empNumber, string expiryDate, string typeOfPass)
        {
            try
            {
                //active status = 1
                using (STAutomationEntities db = new STAutomationEntities())
                {

                    if (typeOfPass.Equals("YCP"))
                    {
                        DateTime firstDay = Convert.ToDateTime(expiryDate + "-01-01");
                        DateTime lastDay = Convert.ToDateTime(expiryDate + "-12-15");
                        var requestId = db.Requests.Where(x => x.employeeNumber.Equals(empNumber) && x.requestDate >= firstDay && x.requestDate <= lastDay && x.status == (int)Enums.StatusEnum.Pending).Select(x => x.id);

                        int pending = db.Passengers.Where(x => requestId.Contains(x.requestId)).Where(x => x.status == (int)Enums.StatusEnum.Pending && x.typeOfPass == (int)Enums.TypeOfPassEnum.YCP).Count();
                        return pending;
                    }
                    else if (typeOfPass.Equals("YCBP"))
                    {
                        DateTime currentExpiryDate = Convert.ToDateTime(expiryDate);
                        var expiryDateBefore = db.PassesBonusExpiryDate.Where(x => x.ExpiredBy <  currentExpiryDate).Select(x => x.ExpiredBy).FirstOrDefault();

                        var requestId = db.Requests.Where(x => x.employeeNumber.Equals(empNumber) && x.requestDate <= currentExpiryDate && x.requestDate >= expiryDateBefore && x.status == (int)Enums.StatusEnum.Pending).Select(x => x.id);
                        int pending = db.Passengers.Where(x => requestId.Contains(x.requestId)).Where(x => x.status == (int)Enums.StatusEnum.Pending && x.typeOfPass == (int)Enums.TypeOfPassEnum.BCP).Count();
                        return pending;
                    }
                    else if (typeOfPass.Equals("LCP"))
                    {
                        var requestId = db.Requests.Where(x => x.employeeNumber.Equals(empNumber) && x.status == (int)Enums.StatusEnum.Pending).Select(x => x.id);
                        int pending = db.Passengers.Where(x => requestId.Contains(x.requestId)).Where(x => x.status == (int)Enums.StatusEnum.Pending && x.typeOfPass == (int)Enums.TypeOfPassEnum.LMCP).Count();
                        return pending;
                    }
                    return 0;
                }
            }
            catch (Exception ex)
            {
                Logger.Log(LoggingLevel.Error, ex, "Error on retriving basic info in function HowManyPassesPending. User Id = {userid}", empNumber);
                return 0;
            }
        }

        private string HowLongYouHaveBeenServices(DateTime senioritydate)
        {
            int TotalDays = DateTime.Now.Subtract(senioritydate).Days;
            int HowManyYear = TotalDays / 365;

            string yearStr = null;

            if (HowManyYear > 0)
            {
                int daysInCurrentYear = HowManyYear * 365;
                int remaningDays = TotalDays - daysInCurrentYear;

                string md = GetMonthsDyas(remaningDays);
                if (HowManyYear > 1)
                    yearStr = " years ";
                else
                    yearStr = " year ";
                return HowManyYear + yearStr + md;
            }
            else
            {
                return GetMonthsDyas(TotalDays);
            }
        }

        private string GetMonthsDyas(int remaningDays, int HowManyYear = 0)
        {
            int whatMonths = 1;
            string monthStr = null;
            string dayStr = null;

            int currentYear = DateTime.Now.Year;

            while (remaningDays >= DateTime.DaysInMonth(currentYear, whatMonths))
            {
                remaningDays -= DateTime.DaysInMonth(currentYear, whatMonths++);
            }

            whatMonths -= 1;

            if (whatMonths == 0)
            {
                monthStr = " ";
            }
            else if (whatMonths > 1)
            {
                monthStr = whatMonths + " months ";
            }
            else
            {
                monthStr = whatMonths + " month ";
            }

            if (remaningDays > 1)
            {
                dayStr = remaningDays + " days";
            }
            else if (remaningDays == 0)
            {
                dayStr = "";
            }
            else
            {
                dayStr = remaningDays + " day";
            }

            return monthStr + dayStr;
        }

        private int HowManyPassesYouHave(DateTime senioritydate, int IsFullTime)
        {
            DateTime Month6 = senioritydate.AddMonths(6);
            DateTime Year1 = senioritydate.AddYears(1);
            DateTime Year2 = senioritydate.AddYears(2);
            DateTime Year3 = senioritydate.AddYears(3);

            if (IsFullTime == 1)
            {//fulltime
                if (DateTime.Now >= Year3)
                {
                    //more than 3 years
                    return 4;
                }
                else if (DateTime.Now >= Year1)
                {
                    //more than 2 years not 3 years
                    return 2;
                }
                else if (DateTime.Now >= Month6)
                {
                    //more than 6 months but less than 1 year
                    return 1;
                }
                else
                {
                    return 0;
                }
            }
            else
            {//parttime
                if (DateTime.Now >= Year3)
                {
                    //more than 3 years
                    return 3;
                }
                else if (DateTime.Now >= Year2)
                {
                    //2 years to 3 years
                    return 2;
                }
                else if (DateTime.Now >= Year1)
                {
                    //more than 6months but less than 1 year
                    return 1;
                }
                else
                {
                    return 0;
                }
            }
        }
    }
}
