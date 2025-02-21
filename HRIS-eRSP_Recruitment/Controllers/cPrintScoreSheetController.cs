using HRIS_Common;
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
    public class cPrintScoreSheetController : CustomController
    {
        string transcation_code = "109";
        string urlname = "cApplicantsReview";
        HRIS_RCTEntities db = new HRIS_RCTEntities();
        CommonDB Cmn = new CommonDB();
        User_Menu um = new User_Menu();
        // GET: cPrintScoreSheet
        public ActionResult Index(string psb_ctrl_nbr, string userid,string budget_code, string employment_type)
        {
            CheckSession();
            Session["ss_psb_ctrl_nbr"] = psb_ctrl_nbr;
            Session["ss_userid"] = userid;
            Session["ss_budget_code"] = budget_code;
            Session["ss_employment_type"] = employment_type;
            return View();
        }
        public ActionResult Initialize()
        {
            db.Database.CommandTimeout = Int32.MaxValue;
            CheckSession();
            var ss_psb_ctrl_nbr = Session["ss_psb_ctrl_nbr"].ToString();
            var panel_user_id = Session["ss_userid"].ToString();
            var budget_code = Session["ss_budget_code"].ToString();
            var employment_type = Session["ss_employment_type"].ToString();
            try
            {

                //var psblist = db.sp_hrmpsb_screening_list(ss_psb_ctrl_nbr, "2", panel_user_id).ToList();
                var psbsched_item = db.sp_psbitem_forpanel(ss_psb_ctrl_nbr, budget_code, employment_type, panel_user_id).ToList();
                return JSON(new
                {
                    message = "success",
                    icon = "success",
                    //psblist,
                    psbsched_item,
                    panel_user_id
                   
                }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return Json(new { message = DbEntityValidationExceptionError(e), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }

        }
        public ActionResult set_Item_no(string item_no)
        {
            db.Database.CommandTimeout = Int32.MaxValue;
            CheckSession();
            var psb_ctrl_nbr = Session["ss_psb_ctrl_nbr"].ToString();
            var panel_user_id = Session["ss_userid"].ToString();
            var budget_code = Session["ss_budget_code"].ToString();
            var employment_type = Session["ss_employment_type"].ToString();
            try
            {
                Session["item_no"] = item_no;
                var list = db.sp_applicantlist_forpsbprinting(psb_ctrl_nbr, budget_code, employment_type, panel_user_id, item_no).ToList();
                return JSON(new { message = fetch.success, icon = icon.success, list}, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return Json(new { message = DbEntityValidationExceptionError(e), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }
        //public ActionResult SetHistoryPage(string empl_id, string username, string password, string account_type)
        public ActionResult SetHistoryPage()
        {
            db.Database.CommandTimeout = Int32.MaxValue;
            CheckSession();
            try
            {
                //if (password.Trim() != "")
                //{
                //    password = Cmn.DecryptString(password, Cmn.CONST_WORDENCRYPTOR);
                //}
                Session["history_page"] = Request.UrlReferrer.ToString();
                //Session["create_empl_id"] = empl_id;
                //Session["create_username"] = username;
                //Session["create_password"] = password;
                //Session["create_account_type"] = account_type;

                return JSON(new { message = "success" }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                string message = e.Message;
                return Json(new { message = message }, JsonRequestBehavior.AllowGet);
            }
        }

    }
}
  //var psblist = db.sp_hrmpsb_screening_list(psb_ctrl_nbr, "2", user_id).ToList();