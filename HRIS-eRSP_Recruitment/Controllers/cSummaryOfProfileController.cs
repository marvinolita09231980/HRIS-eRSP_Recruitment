using HRIS_eRSP_Recruitment.Common_Code;
using HRIS_eRSP_Recruitment.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity.Validation;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace HRIS_eRSP_Recruitment.Controllers
{
    public class cSummaryOfProfileController : CustomController
    {
        HRIS_RCTEntities db = new HRIS_RCTEntities();
        User_Menu um = new User_Menu();
        RCT_Common rct = new RCT_Common();
        // GET: cSummaryOfProfile
        public ActionResult Index(string item_no, string psb_ctrl_nbr)
        {
            CheckSession();
            if (item_no == null || psb_ctrl_nbr == null)
            {
                return RedirectToAction("Index", "cHRMPSBScreening");
            }
            else
            {
                Session["sp_item_no"] = item_no;
                Session["sp_psb_ctrl_nbr"] = psb_ctrl_nbr;
                return View();
            }
            
           
        }
        public ActionResult Initialize()
       {
            db.Database.CommandTimeout = Int32.MaxValue;
            CheckSession();
            var psb_ctrl_nbr = Session["sp_psb_ctrl_nbr"].ToString();
           var item_no = Session["sp_item_no"].ToString();
           try
           {
               var summaryProfile = db.sp_summaryofprofile_list(item_no, psb_ctrl_nbr).ToList();
               var summaryProfileQS = db.sp_summaryofprofile_hdr_QS_list(item_no).ToList();
               return Json(new { message = fetch.success, icon = icon.success, summaryProfile, summaryProfileQS }, JsonRequestBehavior.AllowGet);
           }
           catch (DbEntityValidationException e)
           {
               return Json(new { message = DbEntityValidationExceptionError(e), icon = icon.error }, JsonRequestBehavior.AllowGet);
           }

       }
        public ActionResult pageUnderDevelopment()
        {
            CheckSession();
            return View();
        }
    }
}