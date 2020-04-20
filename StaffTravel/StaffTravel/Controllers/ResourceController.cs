using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Threading.Tasks;
using System.Globalization;
using System.Collections;

namespace StaffTravel.Controllers
{
    [RoutePrefix("api/Resource")]
    [Authorize]
    public class ResourceController : ApiController
    {
        private static readonly string _gatewaysAPI = ConfigurationManager.AppSettings["GatewaysAPI"];
        private static readonly string _destinationsAPI = ConfigurationManager.AppSettings["DestinationsAPI"];
        private static readonly string _svHotelDestinationsAPI = ConfigurationManager.AppSettings["SVHotelDestinationsAPI"];
        private static readonly string _svHotelsAPI = ConfigurationManager.AppSettings["SVHotelsAPI"];
        private HttpClient _httpClient;

        public ResourceController()
        {
            _httpClient = new HttpClient();

            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls | SecurityProtocolType.Tls11 | SecurityProtocolType.Tls12 | SecurityProtocolType.Ssl3;
        }

        public async Task<IHttpActionResult> GetGatewayforBrandAsync(string language, string brand)
        {
            string address = string.Format(_gatewaysAPI, language, brand);
            HttpResponseMessage response = await _httpClient.GetAsync(address);

            string gateways = await response.Content.ReadAsStringAsync();
            return Ok(gateways);
        }

        public async Task<IHttpActionResult> GetDestCodeAsync(string language, string brand, string gateway, string searchType)
        {
            string address = string.Format(_destinationsAPI, language, brand, gateway, searchType);
            HttpResponseMessage response = await _httpClient.GetAsync(address);

            string destinations = await response.Content.ReadAsStringAsync();
            return Ok(destinations);
        }

        public async Task<IHttpActionResult> GetSVHotelDestinationsAsync(string language, string brand, string gateway)
        {
            string address = string.Format(_svHotelDestinationsAPI, language, brand, gateway);
            HttpResponseMessage response = await _httpClient.GetAsync(address);

            string hotelDestinations = await response.Content.ReadAsStringAsync();
            return Ok(hotelDestinations);
        }

        public async Task<IHttpActionResult> GetSVHotelListAsync(string language, string brand, string gateway, string destination)
        {
            string address = string.Format(_svHotelsAPI, language, brand, gateway, destination);
            HttpResponseMessage response = await _httpClient.GetAsync(address);

            string hotels = await response.Content.ReadAsStringAsync();
            return Ok(hotels);
        }

        [AllowAnonymous]
        public IHttpActionResult GetResourceStringsFromResources(string culture)
        {
            CultureInfo ci = new CultureInfo(culture);
            var resourceSet = Resources.Resource.ResourceManager.GetResourceSet(ci, true, true);
            Dictionary<string, string> resDictionary = new Dictionary<string, string>();

            foreach(DictionaryEntry resource in resourceSet)
            {
                resDictionary.Add(resource.Key.ToString(), resource.Value.ToString());
            }
            return Json(resDictionary);
        }
    }
}
