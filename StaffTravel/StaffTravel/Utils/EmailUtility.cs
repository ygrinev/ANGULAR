using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using StaffTravel.EmailService;
using System.Threading.Tasks;
using System.Web.Routing;
using System.Web.Mvc;
using System.IO;
using System.Configuration;
using SWG.Common.Utility.Logging;

namespace StaffTravel.Utils
{
    public class EmailUtility
    {
        private static string _emailTemplateController = "Home";
        private static string _emailTemplatePath = "EmailTemplates/";

        public async Task SendEmail(string subject, string emailTemplate, string emailTo, object model)
        {
            if (emailTo == null)
                return;

            //override all emails addresses in test environment
            if (!string.IsNullOrEmpty(ConfigurationManager.AppSettings["GlobalEmailOverride"]) && !ConfigurationManager.AppSettings["GlobalEmailOverride"].Equals("."))
                emailTo = ConfigurationManager.AppSettings["GlobalEmailOverride"];

            try
            {
                var emailBody = RenderViewToString(emailTemplate, model);

                using (EmailServiceClient emailService = new EmailServiceClient())
                {
                    emailObjectClass emailObject = new emailObjectClass()
                    {
                        ClientID = "STAFFTRAVEL",
                        EmailTo = emailTo,
                        EmailBody = emailBody,
                        Subject = subject,
                        BodyHtml = true,
                        EmailType = emailTypeItems.notification,
                        Priority = emailPriorityItems.normal
                    };
                    await emailService.SendEmailAsync(emailObject);
                }
            }
            catch (Exception e)
            {
                Logger.Log(LoggingLevel.Error, e, "Failed to send email. Subject = {subject} Template = {template} To = {to} Object = {@object}", subject, emailTemplate, emailTo, model);
            }          
        }

        public static string RenderViewToString(string viewName, object viewData)
        {
            HttpContextBase contextBase = new HttpContextWrapper(HttpContext.Current);

            var routeData = new RouteData();
            routeData.Values.Add("controller", _emailTemplateController);
            var controllerContext = new ControllerContext(contextBase, routeData, new Controllers.HomeController());

            var razorViewEngine = new RazorViewEngine();
            var razorViewResult = razorViewEngine.FindView(controllerContext, _emailTemplatePath +  viewName, "", false);

            var writer = new StringWriter();
            var viewContext = new ViewContext(controllerContext, razorViewResult.View, new ViewDataDictionary(viewData), new TempDataDictionary(), writer);
            razorViewResult.View.Render(viewContext, writer);

            return writer.ToString();
        }
    }
}