﻿using HRIS_eRSP_Recruitment.Common_Code;
using HRIS_eRSP_Recruitment.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity.Validation;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Text;
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
            //Session.Remove("ca_psb_ctrl_nbr");
            //Session.Remove("ca_item_no");
            if (Session["user_id"] == null)
            {
                return RedirectToAction("Index", "Login");
            }
           
            return View();
        }
        public ActionResult Initialize(string year, string month)
        {
            db.Database.CommandTimeout = Int32.MaxValue;
            //Session["comparative_psb_ctrl_nbr"] = psb_ctrl_nbr;
            //Session["comparative_item_no"] = item_no;
            //Session["comparative_budget_code"] = budget_code;
            //Session["comparative_employement_type"] = employment_type;
            //Session["comparative_salary_grade"] = salary_grade;
            //Session["comparative_ranked"] = ranked;
            CheckSession();
            um = rct.GetAllowAccess();
            var user_id = Session["user_id"].ToString();
            var psb_ctrl_nbr = Session["ca_psb_ctrl_nbr"] != null ? Session["ca_psb_ctrl_nbr"].ToString() : "";
            var item_no = Session["ca_item_no"] != null ? Session["ca_item_no"].ToString() : "";
            var budget_code = Session["ca_budget_code"] != null ? Session["ca_budget_code"].ToString() : "";
            var employment_type = Session["ca_employment_type"] != null ? Session["ca_employment_type"].ToString() : "";
            var reporttype = Session["ca_reporttype"] != null ? Session["ca_reporttype"].ToString() : "";

            //um = rct.GetAllowAccess();

            try
            {
                var budgetyears = db.vw_budgetyears_tbl.ToList();
                var sched = db.sp_psbschedule_list_bydate(month, year).ToList();
                var psbschedule = db.vw_psb_sked_hdr_tbl.Where(a => a.psb_status >= 2).ToList();
                var psbsched_item = db.sp_hrmpsbscreening_item_list(psb_ctrl_nbr).ToList();
                var comparative = db.sp_comparative_assessment_list(psb_ctrl_nbr, item_no, "3").ToList();
                var sp_psb_item_list     = db.sp_psb_item_list(psb_ctrl_nbr).ToList();
                var sp_combined_item_tbl = db.sp_combined_item_tbl(psb_ctrl_nbr).ToList();
                return JSON(new { message = fetch.success, icon = icon.success, sched, psbschedule
                    , reporttype, psb_ctrl_nbr, item_no, psbsched_item
                    , comparative,um, budgetyears
                    ,budget_code
                    ,employment_type
                    ,sp_psb_item_list
                    ,sp_combined_item_tbl
                }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return Json(new { message = DbEntityValidationExceptionError(e), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }

        }
        public ActionResult getPSBSchedule(string month, string year)
        {
            db.Database.CommandTimeout = Int32.MaxValue;
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
        public ActionResult getBudgetYear(string employment_type)
        {
            db.Database.CommandTimeout = Int32.MaxValue;
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
            db.Database.CommandTimeout = Int32.MaxValue;
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
            db.Database.CommandTimeout = Int32.MaxValue;
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
            db.Database.CommandTimeout = Int32.MaxValue;
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
            db.Database.CommandTimeout = Int32.MaxValue;
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
            db.Database.CommandTimeout = Int32.MaxValue;
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
            db.Database.CommandTimeout = Int32.MaxValue;
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
            db.Database.CommandTimeout = Int32.MaxValue;
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
            db.Database.CommandTimeout = Int32.MaxValue;
            CheckSession();
            try
            {
                var sp_psb_item_list = db.sp_psb_item_list(psb_ctrl_nbr).ToList();
                var sp_combined_item_tbl = db.sp_combined_item_tbl(psb_ctrl_nbr).ToList();

                return JSON(new { message = fetch.success, icon = icon.success, sp_psb_item_list, sp_combined_item_tbl }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return Json(new { message = DbEntityValidationExceptionError(e), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }
       
        public ActionResult comparative_item_applicant(string psb_ctrl_nbr,string item_no,string budget_code,string employment_type,string salary_grade,bool ranked)
        {
            db.Database.CommandTimeout = Int32.MaxValue;
            CheckSession();
            try
            {
                Session["ca_psb_ctrl_nbr"] = psb_ctrl_nbr;
                Session["ca_item_no"] = item_no;
                Session["ca_budget_code"] = budget_code;
                Session["ca_employment_type"] = employment_type;
                Session["ca_salary_grade"] = salary_grade;
                Session["ca_ranked"] = ranked;

                //Session["comparative_psb_ctrl_nbr"] = psb_ctrl_nbr;
                //Session["comparative_item_no"] = item_no;
                //Session["comparative_budget_code"] = budget_code;
                //Session["comparative_employement_type"] = employment_type;
                //Session["comparative_salary_grade"] = salary_grade;
                //Session["comparative_ranked"] = ranked;

                var comparative = db.sp_comparative_assessment_list(psb_ctrl_nbr, item_no, "3").ToList();

                return JSON(new { message = fetch.success, icon = icon.success }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return Json(new { message = DbEntityValidationExceptionError(e), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }
        public ActionResult SetHistoryPage(string reporttype, string psb_ctrl_nbr, string item_no)
        {
            db.Database.CommandTimeout = Int32.MaxValue;
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
            db.Database.CommandTimeout = Int32.MaxValue;
            CheckSession();
            var app_status = "";
            var user_id = Session["user_id"].ToString();
            var message = "";
            var submitcount = 0;
            try
            {
                    db.sp_insert_transaction_to_approvalworkflow_tbl_RCT(user_id, app_ctrl_nbr, transaction_code);
                    message = submit.success;
                    submitcount = submitcount + 1;
                    app_status = "4";
                // var comparative = db.sp_comparative_assessment_list(psb_ctrl_nbr, item_no, "3").ToList();
                  
                    return JSON(new { message = message, icon = icon.success, submitcount, app_status }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                    return Json(new { message = DbEntityValidationExceptionError(e) }, JsonRequestBehavior.AllowGet);
            }
        }

        public ActionResult approvedComparativeAll(List<comparativeTempList> data)
        {
            db.Database.CommandTimeout = Int32.MaxValue;
            CheckSession();
            var app_status = "";
            var user_id = Session["user_id"].ToString();
            var message = "";
            var submitcount = 0;
           
            var ranked = (bool)Session["ca_ranked"];
            try
            {
                var psb_ctrl_nbr = data[0].psb_ctrl_nbr;
                var item_no = data[0].item_no;
                for (var x = 0; x < data.Count(); x++)
                {
                    var app_ctrl_nbr = data[x].app_ctrl_nbr;
                    db.sp_insert_transaction_to_approvalworkflow_tbl_RCT(user_id, app_ctrl_nbr, transaction_code);
                    
                    submitcount = submitcount + 1;
                    
                }

                if (ranked)
                {
                    var ca_item_no = Session["ca_item_no"].ToString();
                    var combined_id = Convert.ToInt32(ca_item_no);
                    var comparative = db.sp_comparative_assessment_list_ranked(psb_ctrl_nbr, combined_id, "3").ToList();
                    message = submit.success;
                    return JSON(new { message = message, icon = icon.success, submitcount, comparative }, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    var comparative = db.sp_comparative_assessment_list(psb_ctrl_nbr, item_no, "3").ToList();
                    message = submit.success;
                    return JSON(new { message = message, icon = icon.success, submitcount, comparative }, JsonRequestBehavior.AllowGet);
                }
            }
            catch (DbEntityValidationException e)
            {
                return Json(new { message = DbEntityValidationExceptionError(e) }, JsonRequestBehavior.AllowGet);
            }
        }

        public ActionResult remove_comparative(string app_ctrl_nbr, string approval_id, string psb_ctrl_nbr, string item_no)
        {
            db.Database.CommandTimeout = Int32.MaxValue;
            CheckSession();
            var app_status = "";
            var user_id = Session["user_id"].ToString();
            var message = "";
            try
            {
                db.sp_delete_in_approvalworkflow_tbl_RCT(app_ctrl_nbr);
                message = remove.success;
                app_status = "3";
                //var comparative = db.sp_comparative_assessment_list(psb_ctrl_nbr, item_no, "3").ToList();

                return JSON(new { message = message, icon = icon.success, app_status }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return Json(new { message = DbEntityValidationExceptionError(e) }, JsonRequestBehavior.AllowGet);
            }
        }



        public ActionResult sendEmailNotification(sp_comparative_assessment_list_Result dt, string email_type)
        {
            db.Database.CommandTimeout = Int32.MaxValue;
            CheckSession();
            var email_subject = "";
            var user_id = Session["user_id"].ToString();
            var mi = "";
            DateTime dttm = DateTime.Now;
            try
            {



                var email_settup = db.sp_send_email_notification(dt.email, dt.empl_id, dt.app_ctrl_nbr, dt.hiring_period, email_type).FirstOrDefault();


               


                if (dt.middle_name == "")
                {
                    mi = "";
                }
                else
                {
                    mi = dt.middle_name.Substring(0, 1);
                }

               if (email_type == "4")
                {
                    var appreview = db.applicants_review_tbl.Where(a => a.app_ctrl_nbr == dt.app_ctrl_nbr).FirstOrDefault();
                    appreview.email_regret_dttm = dttm;
                    appreview.email_regret_by = user_id;

                    email_subject = "Regret Email";

                }
                
                else if (email_type == "7")
                {
                    var appreview = db.applicants_review_tbl.Where(a => a.app_ctrl_nbr == dt.app_ctrl_nbr).FirstOrDefault();
                    appreview.email_congratulatory_dttm = dttm;
                    appreview.email_congratulatory_by = user_id;
                    email_subject = "Congratulatory Email";
                }

                applicants_email_sent_items ems = new applicants_email_sent_items();
                ems.app_ctrl_nbr = dt.app_ctrl_nbr == null ? "" : dt.app_ctrl_nbr;
                ems.first_name = dt.first_name;
                ems.last_name = dt.last_name;
                ems.middle_name = dt.middle_name;
                ems.email_address = dt.email;
                ems.hiring_period = dt.hiring_period;
                ems.email_subject = email_subject;
                ems.created_dttm = dttm.ToString();
                ems.created_by_user = user_id;
                db.applicants_email_sent_items.Add(ems);

                using (MailMessage mm = new MailMessage(email_settup.email_from, dt.email))
                {

                    mm.Subject = email_settup.email_subject;
                    mm.Body = email_settup.email_body;
                    mm.IsBodyHtml = true;
                    using (SmtpClient smtp = new SmtpClient())
                    {
                        smtp.Host = email_settup.email_smtp;
                        smtp.EnableSsl = (bool)email_settup.email_enable_ssl;
                        NetworkCredential NetworkCred = new NetworkCredential(email_settup.email_from, email_settup.email_from_pass);
                        smtp.UseDefaultCredentials = (bool)email_settup.email_default_credentials;
                        smtp.Credentials = NetworkCred;
                        smtp.Port = (int)email_settup.email_port;
                        smtp.Send(mm);
                    }

                }

                db.SaveChanges();


                var apr = db.vw_applicants_review_tbl.Where(a => a.app_ctrl_nbr == dt.app_ctrl_nbr).FirstOrDefault();


                sendingEmailList se = new sendingEmailList();
                se.app_ctrl_nbr = dt.app_ctrl_nbr == null ? "" : dt.app_ctrl_nbr;
                se.applicant_name = dt.first_name + " " + mi + ". " + dt.last_name;
                se.email_address = dt.email;
                se.email_aknowldge_dttm = apr.email_aknowldge_dttm.ToString();
                se.email_aknowldge_regret_dttm = apr.email_aknowldge_regret_dttm.ToString();
                se.email_noti_exam_dttm = apr.email_noti_exam_dttm.ToString();
                se.email_regret_dttm = apr.email_regret_dttm.ToString();
                se.email_noti_hrmpsb_dttm = apr.email_noti_hrmpsb_dttm.ToString();
                se.email_notintop5_dttm = apr.email_notintop5_dttm.ToString();
                se.email_congratulatory_dttm = apr.email_congratulatory_dttm.ToString();
                se.status = true;


                return JSON2(new { message = "Applicants is successfully notified!", icon = "success", se }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                string message = DbEntityValidationExceptionError(e);
                return Json(new { message = message, icon = "error" }, JsonRequestBehavior.AllowGet);
            }
        }
        public ActionResult prepareEndorsement(string psb_ctrl_nbr, string item_no,bool ranked)
        {
            db.Database.CommandTimeout = Int32.MaxValue;
            CheckSession();
            var user_id = Session["user_id"].ToString();
            var message = "";
           
            try
            {
                var isSelected = db.selected_applicants_tbl.Where(a => a.psb_ctrl_nbr == psb_ctrl_nbr && a.item_no == item_no && a.status == "F").ToList();
                if (isSelected.Count() > 0)
                {
                    throw new Exception("The Governor already selected an applicant for this item");
                }
                else
                {
                    if (ranked)
                    {
                        var endorse = db.sp_endorsename_list_ranked(psb_ctrl_nbr, item_no, "4").OrderBy(a => a.applicant_rank).ToList();
                        if (endorse.Count() == 0)
                        {
                            throw new Exception("No applicants endorse for this item, please select applicants in View List");
                        }
                        return JSON(new { message = message, icon = icon.success, endorse }, JsonRequestBehavior.AllowGet);
                    }
                    else
                    {
                        var endorse = db.sp_endorsename_list(psb_ctrl_nbr, item_no, "4").OrderBy(a => a.applicant_rank).ToList();
                        if (endorse.Count() == 0)
                        {
                            throw new Exception("No applicants endorse for this item, please select applicants in View List");
                        }
                        return JSON(new { message = message, icon = icon.success, endorse }, JsonRequestBehavior.AllowGet);
                    }
                   
                   
                }
                

               
            }
            catch (Exception e)
            {
                return Json(new { message = e.Message,icon = "error" }, JsonRequestBehavior.AllowGet);
            }
        }

        public ActionResult printEndorsement(string psb_ctrl_nbr, string item_no, string endorse_date, string endorse_by)
        {
            db.Database.CommandTimeout = Int32.MaxValue;
            CheckSession();
            var user_id = Session["user_id"].ToString();
            var message = "";

          
            try
            {
                var endorse = db.sp_endorsement_hdr_insert_tbl(item_no,psb_ctrl_nbr, "4", endorse_date, endorse_by, user_id,"I").FirstOrDefault();
                if(endorse.db_code == "0")
                {
                    throw new Exception(endorse.db_message);
                }
                return JSON(new { message = endorse.db_message, icon = icon.success, endorse }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                return Json(new { message = e.Message, icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }

        public ActionResult CombinedItems(List<sp_psb_item_list_Result> sp_psb_item_list,string combine_descr)
        {
            db.Database.CommandTimeout = Int32.MaxValue;
            CheckSession();
            var data = sp_psb_item_list;
            var user_id = Session["user_id"].ToString();
            var dttm = DateTime.Now;
            var items = "";
            var len = sp_psb_item_list.Count();
            var ctrl_nbr = sp_psb_item_list[0].psb_ctrl_nbr.ToString();
            try
            {
                var psb_ctrl_nbr = data[0].psb_ctrl_nbr.ToString();
              
                combined_item_hdr_tbl hdr = new combined_item_hdr_tbl();
                hdr.psb_ctrl_nbr = psb_ctrl_nbr;
                hdr.position_code = data[0].position_code;
                hdr.employment_type = data[0].employment_type;
                hdr.budget_code = data[0].budget_code;
                hdr.descr = combine_descr;
                hdr.combined_by = user_id;
                hdr.combined_dttm = dttm;
                db.combined_item_hdr_tbl.Add(hdr);
                db.SaveChanges();

                var id = db.combined_item_hdr_tbl.OrderByDescending(a => a.combined_id).FirstOrDefault();

                for (var x = 0; x < len; x++)
                {
                   
                    var item_no = data[x].item_no.ToString();
                    
                    
                        combined_item_dtl_tbl ci = new combined_item_dtl_tbl();
                        ci.combined_id = id.combined_id;
                        ci.item_no = data[x].item_no;
                        db.combined_item_dtl_tbl.Add(ci);
                        db.SaveChanges();
                  
                }
                var sp_combined_item_tbl = db.sp_combined_item_tbl(ctrl_nbr).ToList();
                var psb_item_list = db.sp_psb_item_list(ctrl_nbr).ToList();
                return JSON(new { message = "Items successfully combined", icon = icon.success, sp_combined_item_tbl, psb_item_list }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                return Json(new { message = e.Message, icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }
        public ActionResult DeleteCombinedItems(sp_combined_item_tbl_Result row_data)
        {
            db.Database.CommandTimeout = Int32.MaxValue;
            CheckSession();
            var user_id = Session["user_id"].ToString();
            var message = "";
            var combined_id = row_data.combined_id;
            var psb_ctrl_nbr = row_data.psb_ctrl_nbr;
            

            try
            {
                var combined = db.combined_item_hdr_tbl.Where(a => a.combined_id == combined_id).FirstOrDefault();
                if (combined == null)
                {
                    throw new Exception("Data not found!");
                }
                db.combined_item_hdr_tbl.Remove(combined);
                var combined2 = db.combined_item_dtl_tbl.Where(a => a.combined_id == combined_id);
                if (combined2 == null)
                {
                    throw new Exception("Data not found!");
                }
                db.combined_item_dtl_tbl.RemoveRange(combined2);

                db.SaveChanges();

                var sp_combined_item_tbl = db.sp_combined_item_tbl(psb_ctrl_nbr).ToList();
                var sp_psb_item_list = db.sp_psb_item_list(psb_ctrl_nbr).ToList();
                return JSON(new { message = "Successfully deleted", icon = icon.success, sp_combined_item_tbl, sp_psb_item_list }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                return Json(new { message = e.Message, icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }

        public ActionResult AssignItemComparative(string item_no, string app_ctrl_nbr, string psb_ctrl_nbr)
        {
            try
            {
                var user = Session["user_id"].ToString();
                var datenow = DateTime.Now;
                var qry = db.comparative_item_assigned_tbl.Where(a => a.app_ctrl_nbr == app_ctrl_nbr && a.psb_ctrl_nbr == psb_ctrl_nbr).FirstOrDefault();
                if (qry == null)
                {
                    comparative_item_assigned_tbl insert_qry = new comparative_item_assigned_tbl();
                    insert_qry.item_no = item_no;
                    insert_qry.app_ctrl_nbr = app_ctrl_nbr;
                    insert_qry.psb_ctrl_nbr = psb_ctrl_nbr;
                    insert_qry.created_dttm = datenow;
                    insert_qry.created_userby = user;
                    db.comparative_item_assigned_tbl.Add(insert_qry);
                    db.SaveChanges();
                }
                else
                {
                    qry.item_no = item_no;
                    qry.updated_dttm = datenow;
                    qry.updated_userby = user;
                    db.SaveChanges();
                }
                var message = "Item successfully assigned!";
               
                return JSON(new { message, icon = icon.success}, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                return Json(new { message = e.Message, icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }

        protected JsonResult JSON2(object data, JsonRequestBehavior behavior)
        {
            

            return new JsonResult()
            {
                Data = data,
                ContentType = "application/json",
                ContentEncoding = Encoding.UTF8,
                JsonRequestBehavior = behavior,
                MaxJsonLength = Int32.MaxValue
            };
        }



    }

}