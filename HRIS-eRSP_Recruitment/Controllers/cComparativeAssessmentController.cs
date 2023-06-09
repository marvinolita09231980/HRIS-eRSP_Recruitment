﻿using HRIS_eRSP_Recruitment.Common_Code;
using HRIS_eRSP_Recruitment.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity.Validation;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace HRIS_eRSP_Recruitment.Controllers
{
    public class cComparativeAssessmentController : CustomController
    {
        string transaction_code = "109";
        HRIS_RCTEntities db = new HRIS_RCTEntities();
        User_Menu um = new User_Menu();
        RCT_Common rct = new RCT_Common();
        //GET:cComparativeAssessment
        public ActionResult Index()
        {
            if (Session["user_id"] == null)
            {
                return RedirectToAction("Index", "Login");
            }
            return View();
        }
        public ActionResult Initialize(string year, string month)
        {
            CheckSession();
            um = rct.GetAllowAccess();
            var user_id = Session["user_id"].ToString();
            var psb_ctrl_nbr = Session["ca_psb_ctrl_nbr"] != null ? Session["ca_psb_ctrl_nbr"].ToString() : "";
            var item_no = Session["ca_item_no"] != null ? Session["ca_item_no"].ToString() : "";
            var reporttype = Session["ca_reporttype"] != null ? Session["ca_reporttype"].ToString() : "";

            //um = rct.GetAllowAccess();

            try
            {
                var budgetyears = db.vw_budgetyears_tbl.ToList();
                var sched = db.sp_psbschedule_list_bydate(month, year).ToList();
                var psbschedule = db.vw_psb_sked_hdr_tbl.Where(a => a.psb_status >= 2).ToList();
                var psbsched_item = db.sp_hrmpsbscreening_item_list(psb_ctrl_nbr).ToList();
                var comparative = db.sp_comparative_assessment_list(psb_ctrl_nbr, item_no, "3").ToList();
                return JSON(new { message = fetch.success, icon = icon.success, sched, psbschedule, reporttype, psb_ctrl_nbr, item_no, psbsched_item, comparative,um, budgetyears }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return Json(new { message = DbEntityValidationExceptionError(e), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }

        }
        public ActionResult getPSBSchedule(string month, string year)
        {
            CheckSession();
            try
            {
                var sched = db.sp_psbschedule_list_bydate(month, year).ToList();
                return JSON(new { message = fetch.success, icon = icon.success, sched }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return Json(new { message = DbEntityValidationExceptionError(e), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }

        public ActionResult getPSBComparativeRating(string app_ctrl_nbr)
        {
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
        public ActionResult getBudgetYear(string employment_type)
        {
            CheckSession();

            try
            {

                var budget_year = db.sp_budgetyears_tbl_combolist1_RCT(employment_type).ToList();
                return JSON(new { message = fetch.success, icon = icon.success, budget_year }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return Json(new { message = DbEntityValidationExceptionError(e) }, JsonRequestBehavior.AllowGet);
            }
        }

        public ActionResult getPositions(string employment_type, string budget_code)
        {
            CheckSession();
            try
            {
                var positions = db.sp_position_tbl_RCT(budget_code, employment_type).ToList();

                return JSON(new { message = fetch.success, icon = icon.success, positions }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return Json(new { message = DbEntityValidationExceptionError(e) }, JsonRequestBehavior.AllowGet);
            }
        }

        public ActionResult SubmitToExec(List<items_added2> data, string psb_ctrl_nbr, string item_no)
        {
            CheckSession();
            var user_id = Session["user_id"].ToString();
            var message = "";
            var submitcount = 0;
            try
            {
                foreach (var l in data)
                {
                    var approval_id = l.approval_id;
                    var app_ctrl_nbr = l.app_ctrl_nbr;

                    if (l.item_isadded)
                    {
                        db.sp_insert_transaction_to_approvalworkflow_tbl_RCT(user_id, l.app_ctrl_nbr, transaction_code);
                        message = submit.success;
                        submitcount = submitcount + 1;
                    }
                    else
                    {
                        db.sp_delete_in_approvalworkflow_tbl_RCT(app_ctrl_nbr);
                        message = remove.success;
                    }
                }

                var comparative = db.sp_comparative_assessment_list(psb_ctrl_nbr, item_no, "3").ToList();
                return JSON(new { message = message, icon = icon.success, submitcount, comparative }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return Json(new { message = DbEntityValidationExceptionError(e) }, JsonRequestBehavior.AllowGet);
            }
        }

        public ActionResult UpdateEndorseCount(string psb_ctrl_nbr, string item_no, int submitcount, int endorse_no)
        {
            CheckSession();
            var user_id = Session["user_id"].ToString();
            var message = "";
            try
            {
                if (submitcount > 0)
                {
                    var itm = db.psb_sked_item_nbrs.Where(a => a.item_no == item_no && a.psb_ctrl_nbr == psb_ctrl_nbr).FirstOrDefault();
                    itm.endorse_no = endorse_no;
                    db.SaveChanges();
                }
                else
                {
                    var itm = db.psb_sked_item_nbrs.Where(a => a.item_no == item_no && a.psb_ctrl_nbr == psb_ctrl_nbr).FirstOrDefault();
                    itm.endorse_no = 0;
                    db.SaveChanges();
                }

                var comparative = db.sp_comparative_assessment_list(psb_ctrl_nbr, item_no, "3").ToList();

                return JSON(new { message = message, icon = icon.success, comparative }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return Json(new { message = DbEntityValidationExceptionError(e) }, JsonRequestBehavior.AllowGet);
            }
        }
        //public ActionResult sp_budgetyears_tbl_combolist1_RCT(string employment_type)
        //{
        //    CheckSession();
        //    Session["psb_employment_type"] = employment_type;
        //    Session["psb_budget_code"] = "";
           
        //    try
        //    {
        //        var budgetyears = db.vw_budgetyears_tbl.Where(a => a.empl).ToList();

        //        return JSON(new { message = fetch.success, icon = icon.success, budgetyears }, JsonRequestBehavior.AllowGet);
        //    }
        //    catch (DbEntityValidationException e)
        //    {
        //        return Json(new { message = DbEntityValidationExceptionError(e), icon = icon.error }, JsonRequestBehavior.AllowGet);
        //    }
        //}
        public ActionResult sp_get_psbschedule_dropdown(string employment_type, string budget_code)
        {
            CheckSession();
            Session["psb_budget_code"] = budget_code;
            Session["psb_psb_ctrl_nbr"] = "";
            Session["item_no"] = "";

            try
            {
                var psbschedule = db.vw_psb_sked_hdr_tbl.Where(a => a.psb_status >= 2 && a.employment_type== employment_type && a.budget_code == budget_code).ToList();
              
                return JSON(new { message = fetch.success, icon = icon.success, psbschedule }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return Json(new { message = DbEntityValidationExceptionError(e), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }
        public ActionResult set_Item_no(string item_no, string psb_ctrl_nbr)
        {
            CheckSession();
            try
            {
                Session["ca_item_no"] = item_no;
                var comparative = db.sp_comparative_assessment_list(psb_ctrl_nbr, item_no, "3").ToList();
                return JSON(new { message = fetch.success, icon = icon.success, comparative }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return Json(new { message = DbEntityValidationExceptionError(e), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }

        public ActionResult sp_hrmpsbscreening_item_list(string psb_ctrl_nbr)
        {
            CheckSession();
            Session["ca_psb_ctrl_nbr"] = psb_ctrl_nbr;

            try
            {

                var psbsched_item = db.sp_hrmpsbscreening_item_list(psb_ctrl_nbr).ToList();
                return JSON(new { message = fetch.success, icon = icon.success, psbsched_item }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return Json(new { message = DbEntityValidationExceptionError(e), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }
        //ComparativeAssessmentPass
        public ActionResult ComparativeAssessmentPass(string item_no, string psb_ctrl_nbr, string pass, string app_ctrl_nbr)
        {
            CheckSession();
            try
            {
                var dt = db.applicants_review_tbl.Where(a => a.app_ctrl_nbr == app_ctrl_nbr).FirstOrDefault();
                dt.app_status = "4";
                db.SaveChanges();

                var comparative = db.sp_comparative_assessment_list(psb_ctrl_nbr, item_no, "3").ToList();
                return JSON(new { message = fetch.success, icon = icon.success, comparative }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return Json(new { message = DbEntityValidationExceptionError(e), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }
        public ActionResult sp_psb_item_list(string psb_ctrl_nbr)
        {
            CheckSession();
            try
            {
                var sp_psb_item_list = db.sp_psb_item_list(psb_ctrl_nbr).ToList();

                return JSON(new { message = fetch.success, icon = icon.success, sp_psb_item_list }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return Json(new { message = DbEntityValidationExceptionError(e), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }
        public ActionResult comparative_item_applicant(string psb_ctrl_nbr,string item_no)
        {
            CheckSession();
            try
            {
                var comparative = db.sp_comparative_assessment_list(psb_ctrl_nbr, item_no, "3").ToList();

                return JSON(new { message = fetch.success, icon = icon.success, comparative }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return Json(new { message = DbEntityValidationExceptionError(e), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }
        public ActionResult SetHistoryPage(string reporttype, string psb_ctrl_nbr, string item_no)
        {
            CheckSession();
            int sp_row_count = 0;
            try
            {

                if (reporttype == "3")
                {
                    sp_row_count = db.sp_comaparative_asessment_rpt(item_no, psb_ctrl_nbr, "4").Count();
                }
                else if (reporttype == "4")
                {
                    sp_row_count = db.sp_endorsement_list_rpt(item_no, psb_ctrl_nbr, reporttype, "").Count();
                }

                Session["history_page"] = Request.UrlReferrer.ToString();
                Session["ca_reporttype"] = reporttype;
                Session["ca_psb_ctrl_nbr"] = psb_ctrl_nbr;
                Session["ca_item_no"] = item_no;


                return JSON(new { message = "success", sp_row_count }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                string message = e.Message;
                return Json(new { message = message }, JsonRequestBehavior.AllowGet);
            }
        }
        public ActionResult approved_comparative(string app_ctrl_nbr, string approval_id,string psb_ctrl_nbr, string item_no)
        {
            CheckSession();
            var user_id = Session["user_id"].ToString();
            var message = "";
            var submitcount = 0;
            try
            {
                    db.sp_insert_transaction_to_approvalworkflow_tbl_RCT(user_id, app_ctrl_nbr, transaction_code);
                    message = submit.success;
                    submitcount = submitcount + 1;

                    var comparative = db.sp_comparative_assessment_list(psb_ctrl_nbr, item_no, "3").ToList();
                  
                    return JSON(new { message = message, icon = icon.success, submitcount, comparative }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                    return Json(new { message = DbEntityValidationExceptionError(e) }, JsonRequestBehavior.AllowGet);
            }
        }

        public ActionResult remove_comparative(string app_ctrl_nbr, string approval_id, string psb_ctrl_nbr, string item_no)
        {
            CheckSession();
            var user_id = Session["user_id"].ToString();
            var message = "";
            try
            {
                db.sp_delete_in_approvalworkflow_tbl_RCT(app_ctrl_nbr);
                message = remove.success;

                var comparative = db.sp_comparative_assessment_list(psb_ctrl_nbr, item_no, "3").ToList();

                return JSON(new { message = message, icon = icon.success, comparative }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return Json(new { message = DbEntityValidationExceptionError(e) }, JsonRequestBehavior.AllowGet);
            }
        }
        
    }

}