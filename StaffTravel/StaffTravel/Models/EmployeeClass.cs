using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace StaffTravel.Models
{
    public partial class Employee
    {
        public bool PassportStatus(string employeeNumber, STAutomationEntities db = null)
        {
            if(db == null)
            {
                using (var ste = new STAutomationEntities())
                {
                    return ste.EmployeePassports.Where(x => x.EmpNumber.Equals(employeeNumber)).Any();
                }
            }
            else // improve performance avoiding creation of EF DB object
            {
                return db.EmployeePassports.Where(x => x.EmpNumber.Equals(employeeNumber)).Any();
            }
        }

        public Employee GetEmployeeClass(string employeenumber)
        {
            using (STAutomationEntities ste = new STAutomationEntities())
            {
                return ste.Employees.Where(x => x.EmpNumber.Equals(employeenumber)).FirstOrDefault();
            }
        }

        public string EmployeeFullName(string firstname, string lastname)
        {
            return firstname + " " + lastname;
        }
    }
}