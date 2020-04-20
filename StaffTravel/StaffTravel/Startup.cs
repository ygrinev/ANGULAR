using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.Owin;
using Owin;
using StaffTravel.Models;

[assembly: OwinStartup(typeof(StaffTravel.Startup))]

namespace StaffTravel
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
            CreateUserRoles();
        }

        public void CreateUserRoles()
        {
            ApplicationDbContext db = new ApplicationDbContext();
            var roleManager = new RoleManager<IdentityRole>(new RoleStore<IdentityRole>(db));

            if (!roleManager.RoleExists("Employee"))
            {
                var roleresult = roleManager.Create(new IdentityRole() { Id= "1", Name= "Employee" });
            }

            if (!roleManager.RoleExists("Manager"))
            {
                var roleresult = roleManager.Create(new IdentityRole() { Id = "2", Name = "Manager" });
            }

            if (!roleManager.RoleExists("SuperAdmin"))
            {
                var roleresult = roleManager.Create(new IdentityRole() { Id = "3", Name = "SuperAdmin" });
            }

            if (!roleManager.RoleExists("Payload"))
            {
                var roleresult = roleManager.Create(new IdentityRole() { Id = "4", Name = "Payload" });
            }

            if (!roleManager.RoleExists("Admin"))
            {
                var roleresult = roleManager.Create(new IdentityRole() { Id = "5", Name = "Admin" });
            }


        }
    }
}
