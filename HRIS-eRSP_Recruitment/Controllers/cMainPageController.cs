using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace HRIS_eRSP_Recruitment.Controllers
{
    public class cMainPageController : Controller
    {
        // GET: cMainPage
        public ActionResult Index()
        {
            if (Session["TEMP_user_id"] == null)
            {
                return RedirectToAction("Index", "Login");
            }
            else
            {
                Session["user_id"] = Session["TEMP_user_id"].ToString();
            }
           
            return View();
        }
    }
}