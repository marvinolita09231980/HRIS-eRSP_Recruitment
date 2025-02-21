using HRIS_Common;
using HRIS_eRSP_Recruitment.Common_Code;
using HRIS_eRSP_Recruitment.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace HRIS_eRSP_Recruitment.Controllers
{
    public class LoginController : CustomController
    {
        // GET: Login
        HRIS_RCTEntities db = new HRIS_RCTEntities();
        CommonDB Cmn = new CommonDB();
        Dev_Version_Name dvn = new Dev_Version_Name();

        // GET: Login
        public ActionResult Index()
        {

            dvn.DVName = "(" + db.Database.Connection.DataSource.ToString().Split('\\')[db.Database.Connection.DataSource.ToString().Split('\\').Length - 1] + ")";
            if (Session["user_id"] != null)
            {
                return RedirectToAction("Index", "cMainPage");
            }
            else
            {

                return View(dvn);
            }

        }
        public ActionResult GetUserIsLogin()
        {

            if (Session["user_id"] != null)
            {
                return Json(new { data = Session["user_id"], success = 1 }, JsonRequestBehavior.AllowGet);
            }
            else
            {
                return Json(new { data = 0, success = 0 }, JsonRequestBehavior.AllowGet);
            }


        }
        public ActionResult isUserLogin()
        {
            if (Session["user_id"] != null)
            {
                var user = Session["user_id"];
                return Json(new { user = user, isLogin = 1 }, JsonRequestBehavior.AllowGet);
            }
            else
            {
                return Json(new { user = "", isLogin = 0 }, JsonRequestBehavior.AllowGet);
            }
        }
        public ActionResult Login_Validation(string username, string password)
        {
            db.Database.CommandTimeout = Int32.MaxValue;
           
            var message = "";
            var success = 0;
            object cred = new object();
            string pass = Cmn.EncryptString(password.Trim(), Cmn.CONST_WORDENCRYPTOR);
            try
            {

                var data = db.sp_user_login_RCT(username.Trim(), pass).ToList();

                if (data.Count() < 1)
                {
                    success = 2;
                }
                else
                {
                    Session["TEMP_user_id"] = data[0].user_id;
                    Session["empl_id"] = data[0].empl_id;
                    Session["last_name"] = data[0].last_name;
                    Session["first_name"] = data[0].first_name;
                    Session["employee_name"] = data[0].employee_name;
                    Session["owner_fullname"] = data[0].employee_name;
                    Session["department_code"] = data[0].department_code;
                    Session["employment_type"] = data[0].employment_type;
                    Session["panel_mbr_flag"] = data[0].panel_mbr_flag;
                    cred = data;
                    success = 1;
                }
                return Json(new { data = data, success, message, cred }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { message = ex.Message, success = 0 }, JsonRequestBehavior.AllowGet);
            }

        }
        public ActionResult logout()
        {
            db.Database.CommandTimeout = Int32.MaxValue;
            Session.Clear();
            if (Session["user_id"] == null)
            {
                return Json(new { session = 0, success = 1 }, JsonRequestBehavior.AllowGet);
            }
            else
            {
                return Json(new { session = 1, success = 0 }, JsonRequestBehavior.AllowGet);
            }
        }
        public ActionResult CheckSessionLogin()
        {
            if (Session["user_id"] == null)
            {
                return Json("expire", JsonRequestBehavior.AllowGet);
            }
            else
            {
                return Json("active", JsonRequestBehavior.AllowGet);
            }
        }
    }
}