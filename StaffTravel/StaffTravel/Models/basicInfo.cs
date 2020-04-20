using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace StaffTravel.Models
{
    public class basicInfo
    {
        public string empnumber { get; set; }
        public string firstname { get; set; }
        public string lastname { get; set; }
        public string email { get; set; }
        public string senioritydate { get; set; }
        public string HowLong { get; set; }
        public int IsFullTime { get; set; }
        public int HowManyPassesYouHave { get; set; }
        public int YearlyUsed { get; set; }
        public int YealyPending { get; set; }
        public int BonusPending { get; set; }
        public int LastPending { get; set; }
        public int BonusUsed { get; set; }
        public int LastMinuteUsed { get; set; }
        public int BonusEarned { get; set; }
    }
}