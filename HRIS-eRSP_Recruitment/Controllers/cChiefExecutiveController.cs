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
   
    public class cChiefExecutiveController : CustomController
    {
        string transaction_code = "109";
        HRIS_RCTEntities db = new HRIS_RCTEntities();
        User_Menu um = new User_Menu();
        RCT_Common rct = new RCT_Common();
        // GET: cChiefExecutive
        public ActionResult Index()
        {
            if (Session["user_id"] == null)
            {
                return RedirectToAction("Index", "Login");
            }
            return View();
        }
        public ActionResult Initialize(string employment_type,string approval_status)
        {
            db.Database.CommandTimeout = Int32.MaxValue;
           
            CheckSession();
            um = rct.GetAllowAccess();
            var user_id = Session["user_id"].ToString();

            //um = rct.GetAllowAccess();
            try
            {
                var x_position = db.sp_executive_position_dropdown_list(approval_status, employment_type);
                var psbschedule = db.vw_psb_sked_hdr_tbl.Where(a => a.psb_status >= 2).ToList();
                return JSON(new { message = fetch.success, icon = icon.success, x_position, psbschedule,um}, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return Json(new { message = DbEntityValidationExceptionError(e), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }

        }
        public ActionResult getItem(string month, string year)
        {
            db.Database.CommandTimeout = Int32.MaxValue;
            CheckSession();
            try
            {
                var item = db.sp_item_list_bypsbscheduledate(month, year).ToList();
                return JSON(new { message = fetch.success, icon = icon.success, item }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return Json(new { message = DbEntityValidationExceptionError(e), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }
       
        public ActionResult getExcutiveList(string item_no, string psb_ctrl_nbr)
        {
            db.Database.CommandTimeout = Int32.MaxValue;
            CheckSession();
            try
            {
                var executive_list = db.sp_chiefexecutive_list(item_no, psb_ctrl_nbr, "4");
                return JSON(new { message = fetch.success, icon = icon.success, executive_list }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return Json(new { message = DbEntityValidationExceptionError(e), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }
        public ActionResult getPSBComparativeRating(string app_ctrl_nbr)
        {
            db.Database.CommandTimeout = Int32.MaxValue;
            CheckSession();
            try
            {
                var psb_ctrl_nbr = db.psb_sked_app_tbl.Where(a => a.app_ctrl_nbr == app_ctrl_nbr).FirstOrDefault().psb_ctrl_nbr;
                var sp_panel_list_rating = db.sp_panel_list_rating(app_ctrl_nbr).ToList();
                var sp_slide_rating = db.sp_slide_rating(app_ctrl_nbr, psb_ctrl_nbr, "").ToList();
                return JSON(new { message = fetch.success, icon = icon.success, sp_slide_rating, sp_panel_list_rating }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return Json(new { message = DbEntityValidationExceptionError(e), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }

        public ActionResult toBeApprovedPosition(string employment_type,string approval_status)
        {
            db.Database.CommandTimeout = Int32.MaxValue;
            CheckSession();
            var user_id = Session["user_id"].ToString();

            //um = rct.GetAllowAccess();
            try
            {
                var x_position = db.sp_executive_position_dropdown_list(approval_status, employment_type);

                return JSON(new { message = fetch.success, icon = icon.success, x_position }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return Json(new { message = DbEntityValidationExceptionError(e), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }
        public ActionResult getItemListInPosition(string position_code, string budget_code, string employment_type)
        {
            db.Database.CommandTimeout = Int32.MaxValue;
            CheckSession();
            try
            {
                var item_list = db.sp_itemlist_in_position(position_code, budget_code, employment_type).ToList();

                return Json(new { message = fetch.success, icon = icon.success, item_list }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return Json(new { message = DbEntityValidationExceptionError(e) }, JsonRequestBehavior.AllowGet);
            }
        }

        public ActionResult sp_hrmpsbscreening_item_list(string year)
        {
            db.Database.CommandTimeout = Int32.MaxValue;
            CheckSession();
          //  Session["psb_psb_ctrl_nbr"] = psb_ctrl_nbr;
           
            try
            {
                //var sp_exec_2bapprovedlist = db.sp_exec_2bapprovedlist(psb_ctrl_nbr).ToList();
                var sp_hrmps_sched_header_list = db.sp_hrmps_sched_header_list(year+"-2").ToList();
                return Json(new { message = fetch.success, icon = icon.success, sp_hrmps_sched_header_list }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return Json(new { message = DbEntityValidationExceptionError(e), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }
        public ActionResult getItemIndorse(string psb_ctrl_nbr)
        {
            db.Database.CommandTimeout = Int32.MaxValue;
            CheckSession();
              Session["psb_psb_ctrl_nbr"] = psb_ctrl_nbr;

            try
            {
                var getItemIndorse = db.sp_exec_2bapprovedlist(psb_ctrl_nbr).ToList();
               
                return Json(new { message = fetch.success, icon = icon.success, getItemIndorse }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return Json(new { message = DbEntityValidationExceptionError(e), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }
        public ActionResult set_Item_no(string item_no, string psb_ctrl_nbr)
        {
            db.Database.CommandTimeout = Int32.MaxValue;
            CheckSession();
            try
            {
                Session["item_no"] = item_no;
                var endorsed = db.sp_chiefexecutive_list(item_no, psb_ctrl_nbr, "4");
                return Json(new { message = fetch.success, icon = icon.success, endorsed }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return Json(new { message = DbEntityValidationExceptionError(e), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }

       public ActionResult ApproveExec(items_added2 data, string comment, string psb_ctrl_nbr, string item_no)
        {
            db.Database.CommandTimeout = Int32.MaxValue;
            CheckSession();
           var user_id = Session["user_id"].ToString();
           if (comment == "" || comment == null)
           {
               comment = "Final Approved";
           }
           try
           {

                  db.sp_update_transaction_in_approvalworkflow_tbl_RCT(data.approval_id, user_id, "F", comment, data.app_ctrl_nbr, psb_ctrl_nbr, item_no, data.budget_code, data.employment_type);
                  
                  var endorsed = db.sp_chiefexecutive_list(item_no, psb_ctrl_nbr, "4");
                  return Json(new { message = fetch.success, icon = icon.success, endorsed }, JsonRequestBehavior.AllowGet);
           }
           catch (DbEntityValidationException e)
           {
               return Json(new { message = DbEntityValidationExceptionError(e) }, JsonRequestBehavior.AllowGet);
           }
       }

        public ActionResult ApproveExec2(items_added2 data,string psb_ctrl_nbr, string item_no)
        {
            db.Database.CommandTimeout = Int32.MaxValue;
            CheckSession();
            var app_status = "";
            var user_id = Session["user_id"].ToString();
            var date = DateTime.Now;
            try
            {
                var approve_exist = db.selected_applicants_tbl.Where(a => a.item_no == item_no && a.psb_ctrl_nbr == psb_ctrl_nbr).ToList();
                if (approve_exist.Count() > 0)
                {
                    throw new Exception("This item already has approved application!");
                }
                db.sp_update_transaction_in_approvalworkflow_tbl_RCT(data.approval_id, user_id, "F", "", data.app_ctrl_nbr, data.psb_ctrl_nbr, data.item_no,data.budget_code,data.employment_type);
                
                db.sp_select_applicant_insert_update(data.app_ctrl_nbr, data.item_no, data.psb_ctrl_nbr, date, user_id, "F");
                var chiefexecutive_list = db.sp_chiefexecutive_list(data.item_no, data.psb_ctrl_nbr, "4");
                return Json(new { message = "Successfully approved!", icon = icon.success, chiefexecutive_list }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                return Json(new { message = e.Message, icon="error" }, JsonRequestBehavior.AllowGet);
            }
        }

       public ActionResult RevertApprove(items_added2   data, string comment, string psb_ctrl_nbr, string item_no)
        {
            db.Database.CommandTimeout = Int32.MaxValue;
            CheckSession();
           var user_id = Session["user_id"].ToString();
           if (comment == "" || comment == null)
           {
               comment = "Cancel Pending";
           }
           try
           {
               db.sp_update_transaction_in_approvalworkflow_tbl_RCT(data.approval_id, user_id, "C", comment, data.app_ctrl_nbr, data.psb_ctrl_nbr, item_no, data.budget_code, data.employment_type);
               var endorsed = db.sp_chiefexecutive_list(item_no, data.psb_ctrl_nbr, "4");
               return Json(new { message = fetch.success, icon = icon.success, endorsed }, JsonRequestBehavior.AllowGet);
           }
           catch (DbEntityValidationException e)
           {
               return Json(new { message = DbEntityValidationExceptionError(e) }, JsonRequestBehavior.AllowGet);
           }
       }

        public ActionResult RevertApprove2(items_added2 data, string psb_ctrl_nbr, string item_no)
        {
            db.Database.CommandTimeout = Int32.MaxValue;
            CheckSession();
            var app_status = "";
            var user_id = Session["user_id"].ToString();
            var date = DateTime.Now;
            try
            {
                db.sp_update_transaction_in_approvalworkflow_tbl_RCT(data.approval_id, user_id, "C", "", data.app_ctrl_nbr, data.psb_ctrl_nbr, data.item_no, data.budget_code, data.employment_type);
               // var indorseitem_applicant_list = db.sp_comparative_assessment_list(psb_ctrl_nbr, data.item_no, "4").ToList();
                db.sp_select_applicant_insert_update(data.app_ctrl_nbr, data.item_no, data.psb_ctrl_nbr, date, user_id, "D");
                var chiefexecutive_list = db.sp_chiefexecutive_list(data.item_no, data.psb_ctrl_nbr, "4");

                return Json(new { message = fetch.success, icon = icon.success, chiefexecutive_list }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return Json(new { message = DbEntityValidationExceptionError(e) }, JsonRequestBehavior.AllowGet);
            }
        }


        public ActionResult GET_LIST(string psb_ctrl_nbr, string item_no)
        {
            db.Database.CommandTimeout = Int32.MaxValue;
            CheckSession();
           try
           {
                
               var endorsed = db.sp_chiefexecutive_list(item_no, psb_ctrl_nbr, "4");
               return Json(new { message = fetch.success, icon = icon.success,endorsed}, JsonRequestBehavior.AllowGet);
           }
           catch (DbEntityValidationException e)
           {
               return Json(new { message = DbEntityValidationExceptionError(e) }, JsonRequestBehavior.AllowGet);
           }
        }
        public ActionResult indorseitem_applicant_list(string psb_ctrl_nbr, string item_no)
        {
            db.Database.CommandTimeout = Int32.MaxValue;
            CheckSession();
            try
            {
                var indorseitem_applicant_list = db.sp_chiefexecutive_list(item_no,psb_ctrl_nbr, "4").ToList();

                return Json(new { message = fetch.success, icon = icon.success, indorseitem_applicant_list }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return Json(new { message = DbEntityValidationExceptionError(e), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }


    }
}