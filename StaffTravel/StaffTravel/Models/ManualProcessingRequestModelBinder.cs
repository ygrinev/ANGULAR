using Newtonsoft.Json;
using StaffTravel.Controllers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http.Controllers;
using System.Web.Http.ModelBinding;

namespace StaffTravel.Models
{
    public class ManualProcessingRequestModelBinder : IModelBinder
    {
        public bool BindModel(HttpActionContext actionContext, ModelBindingContext bindingContext)
        {
            Requests newRequest = new Requests();
            string content = actionContext.Request.Content.ReadAsStringAsync().Result;
            newRequest = JsonConvert.DeserializeObject<Requests>(content);

            if (newRequest.status != (int)Enums.StatusEnum.Pending)
                bindingContext.ModelState.AddModelError(bindingContext.ModelName, "Invalid value provided: Request.status");

            PassesInfoController pic = new PassesInfoController();
            string basicInfo = pic.GetBasicInfoByEmployeeNumber(newRequest.employeeNumber);
            basicInfo bi = JsonConvert.DeserializeObject<basicInfo>(basicInfo);
            int ycpAvailable = bi.HowManyPassesYouHave - bi.YearlyUsed - bi.YealyPending;
            int bcpAvailable = bi.BonusEarned - bi.BonusPending - bi.BonusUsed;
            int ycpSelected = 0, bcpSelected = 0;

            foreach (Passengers p in newRequest.Passengers)
            {
                if (p.typeOfPass == (int)Enums.TypeOfPassEnum.YCP)
                    ycpSelected += 1;
                else if (p.typeOfPass == (int)Enums.TypeOfPassEnum.BCP)
                    bcpSelected += 1;
            }

            if (ycpSelected > ycpAvailable)
                bindingContext.ModelState.AddModelError(bindingContext.ModelName, "Invalid value provided: YCP balance");

            if (bcpSelected > bcpAvailable)
                bindingContext.ModelState.AddModelError(bindingContext.ModelName, "Invalid value provided: BCP balance");

            foreach (Flights f in newRequest.Flights)
            {
                if (f.status != (int)Enums.StatusEnum.Pending)
                    bindingContext.ModelState.AddModelError(bindingContext.ModelName, "Invalid value provided: Flights.status");
                if (f.approvalStatus != (int)Enums.StatusEnum.Pending)
                    bindingContext.ModelState.AddModelError(bindingContext.ModelName, "Invalid value provided: Flights.approvalStatus");
                if (f.price != 0 && f.price != null)
                    bindingContext.ModelState.AddModelError(bindingContext.ModelName, "Invalid value provided: Flights.price");
            }

            foreach (Hotels h in newRequest.Hotels)
            {
                if (h.status != (int)Enums.StatusEnum.Pending)
                    bindingContext.ModelState.AddModelError(bindingContext.ModelName, "Invalid value provided: Hotels.status");
                if (h.approvalStatus != (int)Enums.StatusEnum.Pending)
                    bindingContext.ModelState.AddModelError(bindingContext.ModelName, "Invalid value provided: Hotels.approvalStatus");
                if (h.price != 0 && h.price != null)
                    bindingContext.ModelState.AddModelError(bindingContext.ModelName, "Invalid value provided: Hotels.price");
            }

            foreach (Ancillaries a in newRequest.Ancillaries)
            {
                if (a.status != (int)Enums.StatusEnum.Pending)
                    bindingContext.ModelState.AddModelError(bindingContext.ModelName, "Invalid value provided: Ancillaries.status");
                if (a.approvalStatus != (int)Enums.StatusEnum.Pending)
                    bindingContext.ModelState.AddModelError(bindingContext.ModelName, "Invalid value provided: Ancillaries.approvalStatus");
                if (a.price != 0 && a.price != null)
                    bindingContext.ModelState.AddModelError(bindingContext.ModelName, "Invalid value provided: Ancillaries.price");
            }

            if (bindingContext.ModelState.IsValid)
            {
                bindingContext.Model = newRequest;
                return true;
            }
            else
                return false;

        }
    }
}