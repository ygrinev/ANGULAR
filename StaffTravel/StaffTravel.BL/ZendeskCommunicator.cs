using log4net;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using System.Web.Script.Serialization;

namespace StaffTravel.BL
{
    public class ZendeskCommunicator
    {
        private static readonly string _zendeskAP = ConfigurationManager.AppSettings["ZendeskAP"];
        private static readonly string _zendeskToken = ConfigurationManager.AppSettings["ZendeskAPIToken"];
        private static readonly string _zendeskUser = ConfigurationManager.AppSettings["ZendeskAPIUser"];
        private static readonly ILog Log = LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);


        /// <summary>
        /// This method is acturally connecting zendesk to send body(request form)
        /// </summary>
        /// <param name="bodyToSend"></param>
        /// <param name="url"></param>
        /// <param name="method"></param>
        /// <returns></returns>
        public string SendRequestToZendesk(object bodyToSend, string url, string method)
        {
            string errorMsg = null;
            try
            {
                HttpWebRequest request = (HttpWebRequest)WebRequest.Create(_zendeskAP + url);
                request.Method = method;
                request.Credentials = new NetworkCredential(_zendeskUser + "/token", _zendeskToken);
                request.Accept = "application/json";
                request.ContentType = "application/json";

                if (method.Equals("POST"))
                {
                    string json = JsonConvert.SerializeObject(bodyToSend);
                    ASCIIEncoding encoding = new ASCIIEncoding();
                    Byte[] bytes = encoding.GetBytes(json);

                    using (var stream = request.GetRequestStream())
                    {
                        stream.Write(bytes, 0, bytes.Length);
                    }
                }

                var response = request.GetResponse();
                string responseValue = null;
                using (var responseStream = response.GetResponseStream())
                {
                    if (responseStream != null)
                        using (var reader = new StreamReader(responseStream))
                        {
                            responseValue = reader.ReadToEnd();
                        }
                }

                return responseValue;
            }
            catch (Exception ex)
            {
                errorMsg = "Error on request/response with Zendesk - " + ex.Message;
                Log.Error(errorMsg);
                return errorMsg;
            }
        }

        public string GetCustomFieldValueFromZendesk(string jsonBody, string ticketId, string lookforcustomField)
        {
            try
            {
                dynamic responseJson = new JavaScriptSerializer().Deserialize<dynamic>(jsonBody);

                foreach (var ticket in responseJson["tickets"])
                {
                    if (ticket["id"].ToString().Equals(ticketId))
                    {
                        foreach (var customField in ticket["custom_fields"])
                        {
                            if (customField["id"].ToString().Equals(lookforcustomField))
                            {
                                return customField["value"];
                            }
                        }
                    }
                }
                return null;
            }
            catch (Exception ex)
            {
                string errorMsg = "Error on retriving custom fields from json object of Zendesk ticket - " + ex.Message;
                Log.Error(errorMsg);
                return errorMsg;
            }
        }

        public string GetZendeskCustomFieldId(CustomFieldsList fieldName)
        {
            return FieldIdTranslator.GetFieldId(fieldName);
        }

        public string GetRequesterIdFromZendesk(string email)
        {
            string errorMsg = null;
            try
            {
                string apiUrl = "/api/v2/users/search.json?query=";
                string returnJson = SendRequestToZendesk(null, apiUrl + email, "GET"); //search 

                string userId = GetRequesterUserId(returnJson, email);
                
                return userId;
            }
            catch (Exception ex)
            {
                errorMsg = "Error on request/response with Zendesk - " + ex.Message;
                Log.Error(errorMsg);
                return errorMsg;
            }

        }

        public string GetRequesterUserId(string jsonBody, string email)
        {
            try
            {
                dynamic responseJson = new JavaScriptSerializer().Deserialize<dynamic>(jsonBody);

                foreach (var user in responseJson["users"])
                {
                    if (user["email"].ToString().ToLower().Equals(email.ToLower()))
                    {
                        //    foreach (var customField in ticket["custom_fields"])
                        //    {
                        return user["id"].ToString();
                    //    }
                    }
                }
                return null;
            }
            catch (Exception ex)
            {
                string errorMsg = "Error on retriving custom fields from json object of Zendesk ticket - " + ex.Message;
                Log.Error(errorMsg);
                return errorMsg;
            }
        }
    }
}
