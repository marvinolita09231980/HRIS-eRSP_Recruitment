using System;
using System.Collections.Generic;
using System.Data.Entity.Validation;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using HRIS_eRSP_Recruitment.Common_Code;
using HRIS_eRSP_Recruitment.Models;

namespace HRIS_eRSP_Recruitment.Controllers
{
    public class cPanelMyRatingController : CustomController
    {
        HRIS_RCTEntities db = new HRIS_RCTEntities();
        User_Menu um = new User_Menu();
        RCT_Common rct = new RCT_Common();
        private string userid_q = "";
        // GET: cPanelMyRating
        public ActionResult Index(string args)
        {
            if(args != null)
            {
                Session["args"] = args[0].ToString();
            }
            else
            {
                Session["args"] = "";
            }
           

            if (Session["user_id"] == null)
            {
                return RedirectToAction("Index", "Login");
            }
            else
            {
                //var user_id = Session["user_id"].ToString();
                //var vf = db.sp_verify_admin(user_id).FirstOrDefault();
                //if (vf.verified == true)
                //{
                //    Session["disabled"] = vf.u_disabled;
                //    Session["userType"] = vf.userType;
                //    return View();
                //}
                //else
                //{
                //    var vm = System.Web.HttpContext.Current.Request.UrlReferrer;
                //    return View(vm);
                //}
                return View();
            }

        }

        public ActionResult Initialize()
        {
            CheckSession();
          
            var user_id = Session["user_id"].ToString();
            var args = Session["args"].ToString();
            List<sp_panel_schedule_list_Result> psbsched_list = new List<sp_panel_schedule_list_Result>();
            try
            {
                
               
                     psbsched_list = db.sp_panel_schedule_list(user_id).ToList();
              

                return JSON(new { message = fetch.success, icon = icon.success, psbsched_list }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return JSON(new { message = DbEntityValidationExceptionError(e), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }

        }

        public ActionResult sp_hrmpsb_screening_list(string item_no, string psb_ctrl_nbr)
        {
            CheckSession();
            try
            {
                var psb_rating_all = db.sp_panelrating_all_applicant_list(psb_ctrl_nbr, userid_q, item_no).ToList();
                return Json(new { message = fetch.success, icon = icon.success, psb_rating_all }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return Json(new { message = DbEntityValidationExceptionError(e), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }
        public ActionResult sp_psbSched_item(string psb_ctrl_nbr)
        {
            CheckSession();

            try
            {
                var psbsched_item = db.sp_hrmpsbscreening_item_list(psb_ctrl_nbr).ToList();
                return Json(new { message = fetch.success, icon = icon.success, psbsched_item }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return Json(new { message = DbEntityValidationExceptionError(e), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }
    }
    
}