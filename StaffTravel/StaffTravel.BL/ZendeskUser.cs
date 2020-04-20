using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StaffTravel.BL
{
    public class ZendeskUser
    {
        public User user { get; set; }
        public class User
        {
            public string name { get; set; }
            public string email { get; set; }
            public bool verified { get; set; }
        }

    }

}
