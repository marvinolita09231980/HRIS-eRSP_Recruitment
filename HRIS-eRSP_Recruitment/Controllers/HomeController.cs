using HRIS_eRSP_Recruitment.Common_Code;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace HRIS_eRSP_Recruitment.Controllers
{
    public class HomeController : CustomController
    {
        public ActionResult Index()
        {
            CheckSession();
            ViewBag.Title = "Home Page";
            return View();
        }
    }
}
