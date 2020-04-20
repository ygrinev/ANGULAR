using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin.Security;
using Microsoft.Owin.Security.Cookies;
using Microsoft.Owin.Security.OAuth;
using StaffTravel.Models;
using Newtonsoft.Json;
using SWG.Common.Utility.Logging;

namespace StaffTravel.Providers
{
    public class ApplicationOAuthProvider : OAuthAuthorizationServerProvider
    {
        private readonly string _publicClientId;

        public ApplicationOAuthProvider(string publicClientId)
        {
            if (publicClientId == null)
            {
                throw new ArgumentNullException("publicClientId");
            }

            _publicClientId = publicClientId;
        }

        public override async Task GrantResourceOwnerCredentials(OAuthGrantResourceOwnerCredentialsContext context)
        {
            var userManager = context.OwinContext.GetUserManager<ApplicationUserManager>();

            ApplicationUser user = await userManager.FindAsync(context.UserName, context.Password);

            if (user == null)
            {
                context.SetError("ERR-LOG-001");
                return;
            }

            Employee employee;
            bool isManager;
            using (STAutomationEntities db = new STAutomationEntities())
            {
                employee = db.Employees.Where(e => e.EmpNumber.Equals(context.UserName)).FirstOrDefault();
                if (employee == null)
                {
                    context.SetError("ERR-LOG-001");
                    return;
                }
                else if (employee.Status == 0)
                {
                    context.SetError("ERR-LOG-001");
                    return;
                }

                isManager = db.Employees.Where(e => e.ManagerEmpNumber == context.UserName).Count() > 0;

                if (isManager && !userManager.IsInRole(user.Id, "Manager"))
                    userManager.AddToRole(user.Id, "Manager");

                if (!isManager && userManager.IsInRole(user.Id, "Manager"))
                    userManager.RemoveFromRole(user.Id, "Manager");
            }
            
            ClaimsIdentity oAuthIdentity = await user.GenerateUserIdentityAsync(userManager, OAuthDefaults.AuthenticationType);

            try
            {
                AuthenticationProperties properties = CreateProperties(user);
                AuthenticationTicket ticket = new AuthenticationTicket(oAuthIdentity, properties);
                context.Validated(ticket);
            }
            catch (Exception e)
            {
                Logger.Log(LoggingLevel.Error, e, "ERR-LOG-002: Failed to create authentication ticket. User Id = {userid}", context.UserName);
                context.SetError("ERR-LOG-002");
                return;
            }
        }

        public override Task TokenEndpoint(OAuthTokenEndpointContext context)
        {
            foreach (KeyValuePair<string, string> property in context.Properties.Dictionary)
            {
                context.AdditionalResponseParameters.Add(property.Key, property.Value);
            }

            return Task.FromResult<object>(null);
        }

        public override Task ValidateClientAuthentication(OAuthValidateClientAuthenticationContext context)
        {
            // Resource owner password credentials does not provide a client ID.
            if (context.ClientId == null)
            {
                context.Validated();
            }

            return Task.FromResult<object>(null);
        }

        public override Task ValidateClientRedirectUri(OAuthValidateClientRedirectUriContext context)
        {
            if (context.ClientId == _publicClientId)
            {
                Uri expectedRootUri = new Uri(context.Request.Uri, "/");

                if (expectedRootUri.AbsoluteUri == context.RedirectUri)
                {
                    context.Validated();
                }
            }

            return Task.FromResult<object>(null);
        }

        public static AuthenticationProperties CreateProperties(ApplicationUser user)
        {
            Controllers.PassesInfoController pic = new Controllers.PassesInfoController();
            string jsonUserInfo = pic.GetBasicInfoByEmployeeNumber(user.UserName);

            var roles = user.Roles.Select(x => x.RoleId).ToList();
            string jsonRoles = JsonConvert.SerializeObject(roles);

            IDictionary<string, string> data = new Dictionary<string, string>
            {
                { "userName", user.UserName },
                { "basicInfo", jsonUserInfo },
                { "roles", jsonRoles }
            };
            return new AuthenticationProperties(data);
        }
    }
}