using HRIS_eRSP_Recruitment.Common_Code;
using HRIS_eRSP_Recruitment.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace HRIS_eRSP_Recruitment.Controllers
{
    public class cApplicantForBIController : CustomController
    {
        HRIS_RCTEntities db = new HRIS_RCTEntities();
        HRIS_APLEntities db2 = new HRIS_APLEntities();
        // GET: cApplicantForBI
        public ActionResult Index()
        {
            return View();
        }
        public ActionResult Initialize()
        {
            if (Session["user_id"] == null)
            {
                return RedirectToAction("Index", "Login");
            }
            try
            {
                var bi_respondent_type_tbl = db.bi_respondent_type_tbl.ToList();
                var hiringperiod = db2.VW_available_item_hdr_tbl_distinct.ToList();
                return JSON(new { message = fetch.success, icon = icon.success, hiringperiod, bi_respondent_type_tbl }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                var message = e.Message;
                return JSON(new { message, icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }
        public ActionResult GetApplicants(string ctrl_no)
        {
            if (Session["user_id"] == null)
            {
                return RedirectToAction("Index", "Login");
            }
            try
            {
                var applied_items = db.vw_applicant_for_bi.Where(a => a.hiring_period == ctrl_no).ToList();
                return JSON(new { message = fetch.success, icon = icon.success, applied_items }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                var message = e.Message;
                return JSON(new { message, icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }
    }
}