using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using System.Web.Http.ModelBinding;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin.Security;
using Microsoft.Owin.Security.Cookies;
using Microsoft.Owin.Security.OAuth;
using StaffTravel.Models;
using StaffTravel.Providers;
using StaffTravel.Results;
using StaffTravel.Utils;
using System.Linq;
using SWG.Common.Utility.Logging;
using System.Web.Http.Results;

namespace StaffTravel.Controllers
{
    [Authorize]
    [RoutePrefix("api/Account")]
    public class AccountController : ApiController
    {
        private const string LocalLoginProvider = "Local";
        private ApplicationUserManager _userManager;

        public AccountController()
        {
        }

        public AccountController(ApplicationUserManager userManager,
            ISecureDataFormat<AuthenticationTicket> accessTokenFormat)
        {
            UserManager = userManager;
            AccessTokenFormat = accessTokenFormat;
        }

        public ApplicationUserManager UserManager
        {
            get
            {
                return _userManager ?? Request.GetOwinContext().GetUserManager<ApplicationUserManager>();
            }
            private set
            {
                _userManager = value;
            }
        }

        public ISecureDataFormat<AuthenticationTicket> AccessTokenFormat { get; private set; }

        // GET api/Account/UserInfo
        [HostAuthentication(DefaultAuthenticationTypes.ExternalBearer)]
        [Route("UserInfo")]
        public UserInfoViewModel GetUserInfo()
        {
            ExternalLoginData externalLogin = ExternalLoginData.FromIdentity(User.Identity as ClaimsIdentity);

            return new UserInfoViewModel
            {
                Email = User.Identity.GetUserName(),
                HasRegistered = externalLogin == null,
                LoginProvider = externalLogin != null ? externalLogin.LoginProvider : null
            };
        }

        // POST api/Account/Logout
        [Route("Logout")]
        public IHttpActionResult Logout()
        {
            Authentication.SignOut(CookieAuthenticationDefaults.AuthenticationType);
            return Ok();
        }

        // GET api/Account/ManageInfo?returnUrl=%2F&generateState=true
        [Route("ManageInfo")]
        public async Task<ManageInfoViewModel> GetManageInfo(string returnUrl, bool generateState = false)
        {
            IdentityUser user = await UserManager.FindByIdAsync(User.Identity.GetUserId());

            if (user == null)
            {
                return null;
            }

            List<UserLoginInfoViewModel> logins = new List<UserLoginInfoViewModel>();

            foreach (IdentityUserLogin linkedAccount in user.Logins)
            {
                logins.Add(new UserLoginInfoViewModel
                {
                    LoginProvider = linkedAccount.LoginProvider,
                    ProviderKey = linkedAccount.ProviderKey
                });
            }

            if (user.PasswordHash != null)
            {
                logins.Add(new UserLoginInfoViewModel
                {
                    LoginProvider = LocalLoginProvider,
                    ProviderKey = user.UserName,
                });
            }

            return new ManageInfoViewModel
            {
                LocalLoginProvider = LocalLoginProvider,
                Email = user.UserName,
                Logins = logins,
                ExternalLoginProviders = GetExternalLogins(returnUrl, generateState)
            };
        }

        // POST api/Account/ChangePassword
        [Route("ChangePassword")]
        public async Task<IHttpActionResult> ChangePassword(ChangePasswordBindingModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            IdentityResult result = await UserManager.ChangePasswordAsync(User.Identity.GetUserId(), model.OldPassword,
                model.NewPassword);

            if (!result.Succeeded)
            {
                return GetErrorResult(result);
            }

            return Ok();
        }

        // POST api/Account/SetPassword
        [Route("SetPassword")]
        public async Task<IHttpActionResult> SetPassword(SetPasswordBindingModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            IdentityResult result = await UserManager.AddPasswordAsync(User.Identity.GetUserId(), model.NewPassword);

            if (!result.Succeeded)
            {
                return GetErrorResult(result);
            }

            return Ok();
        }

        // POST api/Account/AddExternalLogin
        [Route("AddExternalLogin")]
        public async Task<IHttpActionResult> AddExternalLogin(AddExternalLoginBindingModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Authentication.SignOut(DefaultAuthenticationTypes.ExternalCookie);

            AuthenticationTicket ticket = AccessTokenFormat.Unprotect(model.ExternalAccessToken);

            if (ticket == null || ticket.Identity == null || (ticket.Properties != null
                && ticket.Properties.ExpiresUtc.HasValue
                && ticket.Properties.ExpiresUtc.Value < DateTimeOffset.UtcNow))
            {
                return BadRequest("External login failure.");
            }

            ExternalLoginData externalData = ExternalLoginData.FromIdentity(ticket.Identity);

            if (externalData == null)
            {
                return BadRequest("The external login is already associated with an account.");
            }

            IdentityResult result = await UserManager.AddLoginAsync(User.Identity.GetUserId(),
                new UserLoginInfo(externalData.LoginProvider, externalData.ProviderKey));

            if (!result.Succeeded)
            {
                return GetErrorResult(result);
            }

            return Ok();
        }

        // POST api/Account/RemoveLogin
        [Route("RemoveLogin")]
        public async Task<IHttpActionResult> RemoveLogin(RemoveLoginBindingModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            IdentityResult result;

            if (model.LoginProvider == LocalLoginProvider)
            {
                result = await UserManager.RemovePasswordAsync(User.Identity.GetUserId());
            }
            else
            {
                result = await UserManager.RemoveLoginAsync(User.Identity.GetUserId(),
                    new UserLoginInfo(model.LoginProvider, model.ProviderKey));
            }

            if (!result.Succeeded)
            {
                return GetErrorResult(result);
            }

            return Ok();
        }

        // GET api/Account/ExternalLogin
        [OverrideAuthentication]
        [HostAuthentication(DefaultAuthenticationTypes.ExternalCookie)]
        [AllowAnonymous]
        [Route("ExternalLogin", Name = "ExternalLogin")]
        public async Task<IHttpActionResult> GetExternalLogin(string provider, string error = null)
        {
            if (error != null)
            {
                return Redirect(Url.Content("~/") + "#error=" + Uri.EscapeDataString(error));
            }

            if (!User.Identity.IsAuthenticated)
            {
                return new ChallengeResult(provider, this);
            }

            ExternalLoginData externalLogin = ExternalLoginData.FromIdentity(User.Identity as ClaimsIdentity);

            if (externalLogin == null)
            {
                return InternalServerError();
            }

            if (externalLogin.LoginProvider != provider)
            {
                Authentication.SignOut(DefaultAuthenticationTypes.ExternalCookie);
                return new ChallengeResult(provider, this);
            }

            ApplicationUser user = await UserManager.FindAsync(new UserLoginInfo(externalLogin.LoginProvider,
                externalLogin.ProviderKey));

            bool hasRegistered = user != null;

            if (hasRegistered)
            {
                Authentication.SignOut(DefaultAuthenticationTypes.ExternalCookie);

                ClaimsIdentity oAuthIdentity = await user.GenerateUserIdentityAsync(UserManager,
                   OAuthDefaults.AuthenticationType);
                ClaimsIdentity cookieIdentity = await user.GenerateUserIdentityAsync(UserManager,
                    CookieAuthenticationDefaults.AuthenticationType);

                AuthenticationProperties properties = ApplicationOAuthProvider.CreateProperties(user);
                Authentication.SignIn(properties, oAuthIdentity, cookieIdentity);
            }
            else
            {
                IEnumerable<Claim> claims = externalLogin.GetClaims();
                ClaimsIdentity identity = new ClaimsIdentity(claims, OAuthDefaults.AuthenticationType);
                Authentication.SignIn(identity);
            }

            return Ok();
        }

        // GET api/Account/ExternalLogins?returnUrl=%2F&generateState=true
        [AllowAnonymous]
        [Route("ExternalLogins")]
        public IEnumerable<ExternalLoginViewModel> GetExternalLogins(string returnUrl, bool generateState = false)
        {
            IEnumerable<AuthenticationDescription> descriptions = Authentication.GetExternalAuthenticationTypes();
            List<ExternalLoginViewModel> logins = new List<ExternalLoginViewModel>();

            string state;

            if (generateState)
            {
                const int strengthInBits = 256;
                state = RandomOAuthStateGenerator.Generate(strengthInBits);
            }
            else
            {
                state = null;
            }

            foreach (AuthenticationDescription description in descriptions)
            {
                ExternalLoginViewModel login = new ExternalLoginViewModel
                {
                    Name = description.Caption,
                    Url = Url.Route("ExternalLogin", new
                    {
                        provider = description.AuthenticationType,
                        response_type = "token",
                        client_id = Startup.PublicClientId,
                        redirect_uri = new Uri(Request.RequestUri, returnUrl).AbsoluteUri,
                        state = state
                    }),
                    State = state
                };
                logins.Add(login);
            }

            return logins;
        }

        // POST api/Account/Register
        [AllowAnonymous]
        [Route("Register")]
        public async Task<IHttpActionResult> Register(RegisterBindingModel model)
        {
            if (!ModelState.IsValid)
            {
                Logger.Log(LoggingLevel.Error, "Failed to register new account. Model state = {@modelstate}", ModelState.Values);
                return BadRequest(ModelState);
            }
            try
            {
                using (STAutomationEntities db = new STAutomationEntities())
                {
                    string empNumberT = model.EmpNumber.Trim();
                    string lastNameT = model.LastName.Trim();

                    //var userCheck = db.spRegisterCheck(empNumberT, lastNameT).FirstOrDefault();
                    Employee userCheck = db.Employees.Where(x => x.EmpNumber.Equals(empNumberT) && x.LastName.Equals(lastNameT)).FirstOrDefault();
                    bool passportStatus = userCheck?.PassportStatus(empNumberT, db)??false;

                    var userRegistered = await UserManager.FindByNameAsync(model.EmpNumber);
                    if (userCheck == null)
                    {
                        return BadRequest("ERR-REG-003");
                    }
                    else if (userRegistered != null) //check if already registered && passportStatus
                    {
                        return BadRequest("ERR-REG-001");
                    }
                    else if (userCheck.Eligibility == 0)
                    { 
                        return BadRequest("ERR-REG-006");
                    }
                    else if (userCheck.Status == 0)
                    { //exists in database not Ultipro
                        return BadRequest("ERR-REG-003");
                    }
                    else if (userCheck.Eligibility == 1 && userCheck.Status == 1)
                    {
                        if (userRegistered == null) // register with Owin FW
                        {
                            var user = new ApplicationUser() { UserName = empNumberT };

                            IdentityResult result = await UserManager.CreateAsync(user, model.Password.Trim());

                            if (!result.Succeeded)
                            {
                                Logger.Log(LoggingLevel.Error, "Failed to create new account in Db. User Id = {userid} Email = {email} Result object = {@object}", model.EmpNumber, model.Email, result);
                                //unable to create user
                                return BadRequest("ERR-REG-002");
                            }
                            userCheck.RegisterDate = DateTime.Now;
                            var currentUser = UserManager.FindByName(empNumberT);
                            UserManager.AddToRole(currentUser.Id, "Employee");
                            var isManager = db.Employees.Where(e => e.ManagerEmpNumber == empNumberT).Count();
                            if (isManager > 0)
                                UserManager.AddToRole(currentUser.Id, "Manager");
                        }
                        if(!passportStatus)
                        {
                            db.EmployeePassports.Add(new EmployeePassport { EmpNumber = empNumberT, FirstName = model.FirstNamePassport, MidName = model.MidNamePassport, LastName = model.LastNamePassport });
                        }
                        await db.SaveChangesAsync();  // Save in DB since we must register or add passport data
                        return Ok("Succefully register");
                    }

                    //if you reached here, something went wront, send an error response
                    return BadRequest("ERR-REG-004");
                }
            }
            catch (Exception e)
            {
                Logger.Log(LoggingLevel.Error, e, "Failed to register new account. User Id = {userid} Email = {email}", model.EmpNumber, model.Email);
                return BadRequest("ERR-REG-004");
            }
        }

        [AllowAnonymous]
        [Route("GetRegisteredStatus")]
        public async Task<IHttpActionResult> GetRegisteredStatus(string empNumber)
        {
            try
            {
                //check if already registered
                var userRegisterd = await UserManager.FindByNameAsync(empNumber);
                if (userRegisterd != null)
                    return Ok("ERR-REG-001");
                return BadRequest("ERR-REG-001");
            }
            catch (Exception e)
            {
                Logger.Log(LoggingLevel.Error, e, $"Failed to get registration info for Employee # = {empNumber}");
                return BadRequest("ERR-REG-004");
            }
        }

        [AllowAnonymous]
        [Route("ForgotPassword")]
        public async Task<IHttpActionResult> ForgotPassword(ForgotPasswordModel model)
        {
            string userEmail = "";
            if (!ModelState.IsValid)
            {
                return BadRequest("ERR-RES-001"); //missing employee number
            }

            var user = await UserManager.FindByNameAsync(model.EmpNumber);

            if (user == null)
            {
                return BadRequest("ERR-RES-002"); //user not found
            }
            //get email
            using (STAutomationEntities db = new STAutomationEntities())
            {
                userEmail = db.Employees
                    .Where(e => e.EmpNumber.Equals(model.EmpNumber, StringComparison.InvariantCultureIgnoreCase))
                    .Select(e => e.Email)
                    .FirstOrDefault();
            }

            var resetToken = await UserManager.GeneratePasswordResetTokenAsync(user.Id);
            model.ResetPasswordUrl = Url.Link("AngularApp", new { Action = "reset-password", token = resetToken, uid = user.Id });

            //send email with url
            if (string.IsNullOrEmpty(userEmail))
                return BadRequest("ERR-RES-003"); //email not found
            else
            {
                EmailUtility emailUtility = new EmailUtility();
                await emailUtility.SendEmail("Reset Password", "ResetPassword_Employee", userEmail, model);
            }

            return Ok();
        }

        [AllowAnonymous]
        [Route("ResetPassword")]
        public async Task<IHttpActionResult> ResetPassword(ResetPasswordModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await UserManager.ResetPasswordAsync(model.UserId, model.ResetToken, model.NewPassword);

            if (result.Succeeded)
            {
                return Ok();
            }
            else
            {
                return BadRequest();
            }
        }

        // POST api/Account/RegisterExternal
        [OverrideAuthentication]
        [HostAuthentication(DefaultAuthenticationTypes.ExternalBearer)]
        [Route("RegisterExternal")]
        public async Task<IHttpActionResult> RegisterExternal(RegisterExternalBindingModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var info = await Authentication.GetExternalLoginInfoAsync();
            if (info == null)
            {
                return InternalServerError();
            }

            var user = new ApplicationUser() { UserName = model.Email, Email = model.Email };

            IdentityResult result = await UserManager.CreateAsync(user);
            if (!result.Succeeded)
            {
                return GetErrorResult(result);
            }

            result = await UserManager.AddLoginAsync(user.Id, info.Login);
            if (!result.Succeeded)
            {
                return GetErrorResult(result);
            }
            return Ok();
        }

        [Route("GetSystemRoles")]
        [Authorize(Roles = "SuperAdmin")]
        public IHttpActionResult GetSystemRoles()
        {
            ApplicationDbContext db = new ApplicationDbContext();

            var roles = db.Roles.Where(r => !r.Name.Equals("Manager", StringComparison.InvariantCultureIgnoreCase) && !r.Name.Equals("Employee", StringComparison.InvariantCultureIgnoreCase)).Select(r => r.Name).ToList();

            return Json(roles); 
        }

        [Route("GetUserRolesByEmail")]
        [Authorize(Roles = "SuperAdmin")]
        public async Task<IHttpActionResult> GetUserRolesByEmailAsync(string email)
        {
            if (string.IsNullOrEmpty(email))
                return BadRequest("Invalid data submitted");

            ApplicationDbContext db = new ApplicationDbContext();
            STAutomationEntities ste = new STAutomationEntities();

            string employeeNumber = ste.Employees.Where(e => e.Email == email).Select(e => e.EmpNumber).FirstOrDefault();

            var user = db.Users.Where(u => u.UserName == employeeNumber).FirstOrDefault();
            if (user == null)
                return BadRequest("User not found");

            var roles = await UserManager.GetRolesAsync(user.Id);
            roles = roles.Where(r => !r.Equals("Manager", StringComparison.InvariantCultureIgnoreCase) && !r.Equals("Employee", StringComparison.InvariantCultureIgnoreCase)).ToList();

            return Json(roles);
        }

        [Route("GrantUserRole")]
        [Authorize(Roles = "SuperAdmin")]
        [HttpPost]
        public async Task<IHttpActionResult> GrantUserRoleAsync(UserRoleViewModel userRoleViewModel)
        {
            if (!ModelState.IsValid)
                return BadRequest("Invalid data submitted");

            ApplicationDbContext db = new ApplicationDbContext();
            STAutomationEntities ste = new STAutomationEntities();

            string employeeNumber = ste.Employees.Where(e => e.Email.Equals(userRoleViewModel.Email, StringComparison.InvariantCultureIgnoreCase)).Select(e => e.EmpNumber).FirstOrDefault();

            var user = db.Users.Where(u => u.UserName == employeeNumber).FirstOrDefault();
            if (user == null)
                return BadRequest("ERR_RES_002");

            if (await UserManager.IsInRoleAsync(user.Id, userRoleViewModel.Role))
                return BadRequest("User is already assigned this access level");

            var result = await UserManager.AddToRoleAsync(user.Id, userRoleViewModel.Role);

            if (result.Succeeded)
            {
                Employee updatedBy = ste.Employees.Where(e => e.EmpNumber.Equals(User.Identity.Name)).FirstOrDefault();
                ActivityLogs logEntry = new ActivityLogs()
                {
                    empName = updatedBy.FirstName + " " + updatedBy.LastName,
                    empNumber = User.Identity.Name,
                    updatedOn = DateTime.Now,
                    userType = (int)Enums.ActivityLogUserTypeEnum.SuperAdmin,
                    updateType = (int)Enums.ActivityLogUpdateTypeEnum.AccessGrant,
                    text = "Granted access: " + userRoleViewModel.Role + " for user: " + userRoleViewModel.Email
                };
                ste.ActivityLogs.Add(logEntry);
                await ste.SaveChangesAsync();
                return Ok();
            }
            else
                return BadRequest("Failed to update");

        }

        [Route("RevokeUserRole")]
        [Authorize(Roles = "SuperAdmin")]
        [HttpPost]
        public async Task<IHttpActionResult> RevokeUserRoleAsync(UserRoleViewModel userRoleViewModel)
        {
            if (!ModelState.IsValid)
                return BadRequest("Invalid data submitted");

            ApplicationDbContext db = new ApplicationDbContext();
            STAutomationEntities ste = new STAutomationEntities();

            string employeeNumber = ste.Employees.Where(e => e.Email.Equals(userRoleViewModel.Email, StringComparison.InvariantCultureIgnoreCase)).Select(e => e.EmpNumber).FirstOrDefault();

            var user = db.Users.Where(u => u.UserName == employeeNumber).FirstOrDefault();
            if (user == null)
                return BadRequest("User not found");

            var result = await UserManager.RemoveFromRoleAsync(user.Id, userRoleViewModel.Role);

            if (result.Succeeded)
            {
                Employee updatedBy = ste.Employees.Where(e => e.EmpNumber.Equals(User.Identity.Name)).FirstOrDefault();
                ActivityLogs logEntry = new ActivityLogs()
                {
                    empName = updatedBy.FirstName + " " + updatedBy.LastName,
                    empNumber = User.Identity.Name,
                    updatedOn = DateTime.Now,
                    userType = (int)Enums.ActivityLogUserTypeEnum.SuperAdmin,
                    updateType = (int)Enums.ActivityLogUpdateTypeEnum.AccessRevoke,
                    text = "Revoked access: " + userRoleViewModel.Role + " for user: " + userRoleViewModel.Email
                };
                ste.ActivityLogs.Add(logEntry);
                await ste.SaveChangesAsync();
                return Ok();
            }                
            else
                return BadRequest("Failed to update");
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing && _userManager != null)
            {
                _userManager.Dispose();
                _userManager = null;
            }

            base.Dispose(disposing);
        }

        [AllowAnonymous]
        [Route("GetPassportStatus")]
        public IHttpActionResult GetPassportStatus(string empNumber)
        {
            try
            {
                using (STAutomationEntities db = new STAutomationEntities())
                {
                    EmployeePassport employeePassport = db.EmployeePassports.Where(x => x.EmpNumber.Equals(empNumber)).FirstOrDefault();
                    return employeePassport == null ? BadRequest("ERR-REG-008") : (IHttpActionResult)Ok("ERR-REG-001");
                }
            }
            catch (Exception e)
            {
                Logger.Log(LoggingLevel.Error, e, $"Failed to get Passport info for Employee # = {empNumber}");
                return BadRequest("ERR-REG-004");
            }
        }

        [AllowAnonymous]
        [Route("GetPassport")]
        public async Task<IHttpActionResult> GetPassport(string empNumber)
        {
            var user = await UserManager.FindByNameAsync(empNumber);

            if (user == null)
            {
                return BadRequest("ERR-RES-004"); //user not found
            }
            try
            {
                using (STAutomationEntities db = new STAutomationEntities())
                {
                    Employee userCheck = db.Employees.Where(x => x.EmpNumber.Equals(empNumber)).FirstOrDefault();
                    EmployeePassport empPassport = db.EmployeePassports.Where(p=>p.EmpNumber == empNumber).FirstOrDefault();
                    return userCheck == null 
                        ? BadRequest("ERR-REG-000") 
                        : (IHttpActionResult)Json(new SavePassportModel { empNumber = empNumber,
                                                                          name = $"{userCheck.FirstName} {userCheck.LastName}",
                                                                          firstNamePassport = empPassport?.FirstName??"",
                                                                          midNamePassport = empPassport?.MidName??"",
                                                                          lastNamePassport = empPassport?.LastName??""
                        });
                }
            }
            catch (Exception e)
            {
                Logger.Log(LoggingLevel.Error, e, $"Failed to get Passport info for Employee # = {empNumber}");
                return BadRequest("ERR-REG-004");
            }
        }

        [AllowAnonymous]
        [Route("SavePassport")]
        public async Task<IHttpActionResult> SavePassport(SavePassportModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = await UserManager.FindByNameAsync(model.empNumber);

            if (user == null)
            {
                return BadRequest("ERR-RES-002"); //user not found
            }
            try
            {
                using (STAutomationEntities db = new STAutomationEntities())
                {
                    EmployeePassport empPassport = db.EmployeePassports.Where(p => p.EmpNumber == model.empNumber).FirstOrDefault();
                    if (empPassport == null)
                    {
                        db.EmployeePassports.Add(new EmployeePassport
                        {
                            EmpNumber = model.empNumber,
                            FirstName = model.firstNamePassport,
                            MidName = model.midNamePassport,
                            LastName = model.lastNamePassport
                        });
                    }
                    else if(empPassport.FirstName != model.firstNamePassport 
                         || empPassport.MidName != model.midNamePassport 
                         || empPassport.LastName != model.lastNamePassport)
                    {
                        //empPassport.EmpNumber = model.EmpNumber;
                        empPassport.FirstName = model.firstNamePassport;
                        empPassport.MidName = model.midNamePassport;
                        empPassport.LastName = model.lastNamePassport;
                        
                    }
                    db.SaveChanges();
                }
                return Ok("ERR-REG-001");
            }
            catch (Exception e)
            {
                Logger.Log(LoggingLevel.Error, e, $"Failed to set/update Passport info for Employee # = {model.empNumber}");
                return BadRequest("ERR-REG-004");
            }
        }


        #region Helpers

        private IAuthenticationManager Authentication
        {
            get { return Request.GetOwinContext().Authentication; }
        }

        private IHttpActionResult GetErrorResult(IdentityResult result)
        {
            if (result == null)
            {
                return InternalServerError();
            }

            if (!result.Succeeded)
            {
                if (result.Errors != null)
                {
                    foreach (string error in result.Errors)
                    {
                        ModelState.AddModelError("", error);
                    }
                }

                if (ModelState.IsValid)
                {
                    // No ModelState errors are available to send, so just return an empty BadRequest.
                    return BadRequest();
                }

                return BadRequest(ModelState);
            }

            return null;
        }

        private class ExternalLoginData
        {
            public string LoginProvider { get; set; }
            public string ProviderKey { get; set; }
            public string UserName { get; set; }

            public IList<Claim> GetClaims()
            {
                IList<Claim> claims = new List<Claim>();
                claims.Add(new Claim(ClaimTypes.NameIdentifier, ProviderKey, null, LoginProvider));

                if (UserName != null)
                {
                    claims.Add(new Claim(ClaimTypes.Name, UserName, null, LoginProvider));
                }

                return claims;
            }

            public static ExternalLoginData FromIdentity(ClaimsIdentity identity)
            {
                if (identity == null)
                {
                    return null;
                }

                Claim providerKeyClaim = identity.FindFirst(ClaimTypes.NameIdentifier);

                if (providerKeyClaim == null || String.IsNullOrEmpty(providerKeyClaim.Issuer)
                    || String.IsNullOrEmpty(providerKeyClaim.Value))
                {
                    return null;
                }

                if (providerKeyClaim.Issuer == ClaimsIdentity.DefaultIssuer)
                {
                    return null;
                }

                return new ExternalLoginData
                {
                    LoginProvider = providerKeyClaim.Issuer,
                    ProviderKey = providerKeyClaim.Value,
                    UserName = identity.FindFirstValue(ClaimTypes.Name)
                };
            }
        }

        private static class RandomOAuthStateGenerator
        {
            private static RandomNumberGenerator _random = new RNGCryptoServiceProvider();

            public static string Generate(int strengthInBits)
            {
                const int bitsPerByte = 8;

                if (strengthInBits % bitsPerByte != 0)
                {
                    throw new ArgumentException("strengthInBits must be evenly divisible by 8.", "strengthInBits");
                }

                int strengthInBytes = strengthInBits / bitsPerByte;

                byte[] data = new byte[strengthInBytes];
                _random.GetBytes(data);
                return HttpServerUtility.UrlTokenEncode(data);
            }
        }

        #endregion
    }
}
