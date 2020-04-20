using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace StaffTravel.Controllers
{
    public class TermsController : Controller
    {
        public ActionResult Index(string lang = "en")
        {
            // TODO: Temporary solution until Generic DCIS is available
            string termsLink;
            if (lang.Equals("fr"))
            {
                termsLink = ConfigurationManager.AppSettings["terms-fr-link"];
            } else
            {
                termsLink = ConfigurationManager.AppSettings["terms-en-link"];
            }
            return Redirect(termsLink);
        }
    }
}