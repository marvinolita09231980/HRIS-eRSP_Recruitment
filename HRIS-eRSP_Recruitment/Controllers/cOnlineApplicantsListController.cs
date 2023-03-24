using HRIS_eRSP_Recruitment.Common_Code;
using HRIS_eRSP_Recruitment.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity.Validation;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Text;
using System.Timers;
using System.Web;
using System.Web.Mvc;

namespace HRIS_eRSP_Recruitment.Controllers
{
    public class cOnlineApplicantsListController :CustomController
    {
        HRIS_RCTEntities db = new HRIS_RCTEntities();
        HRIS_APLEntities db2 = new HRIS_APLEntities();
        User_Menu um = new User_Menu();
        RCT_Common rct = new RCT_Common();
       private static Timer aTimer;
        // GET: cOnlineApplicantsList
        public ActionResult Index()
        {
            CheckSession();
            Session["page"] = "cOnlineApplicantsList";
            return View();
        }

       

        public ActionResult Initialize(string employment_type, string budget_code, string department_code, string item_no, bool departmentcount,string hiring_period)
        {
            CheckSession();
            List<sp_applied_item_from_APL2_Result> item_nbrs = new List<sp_applied_item_from_APL2_Result>();
            List<sp_department_tbl_rct_Result> department = new List<sp_department_tbl_rct_Result>();
            List<sp_get_applicantlist_from_APL_Result> APL_list = new List<sp_get_applicantlist_from_APL_Result>();

            try
            {

                if(employment_type != "" && budget_code != "" && department_code != "")
                {
                    item_nbrs = db.sp_applied_item_from_APL2(employment_type, budget_code, department_code, hiring_period).ToList();
                }
                if (departmentcount == false)
                {
                    department = db.sp_department_tbl_rct(hiring_period).ToList();
                }
                if (employment_type != "" && budget_code != "" && item_no != "")
                {
                    APL_list = db.sp_get_applicantlist_from_APL("", employment_type, budget_code, item_no, "", hiring_period).ToList();
                }

                return JSON2(new {department, APL_list, icon = "success" }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return Json(new { message = DbEntityValidationExceptionError(e), icon = "error" }, JsonRequestBehavior.AllowGet);
            }
        }


        public ActionResult selectEmploymentType(string employment_type, string start)
        {
            CheckSession();
            Session["employment_type"] = employment_type;
            try
            {
                var budget_year = db.sp_budgetyears_tbl_combolist1_RCT(employment_type).ToList();
                //var APL_list = db.sp_get_applicantlist_from_APL("", employment_type, "", "", start).ToList();
                return JSON2(new { budget_year, icon = "success" }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return Json(new { message = DbEntityValidationExceptionError(e), icon = "error" }, JsonRequestBehavior.AllowGet);
            }
        }


        //public ActionResult selectBudgetCode(string employment_type, string budget_code, string start)
        //{
        //    CheckSession();
        //    Session["budget_code"] = budget_code;
        //    try
        //    {
        //        var APL_list = db.sp_get_applicantlist_from_APL("", employment_type, budget_code, "", start).ToList();
        //        var item_nbrs = db.sp_applied_item_from_APL(employment_type, budget_code).ToList();
        //        return JSON2(new { item_nbrs,APL_list, icon = "success" }, JsonRequestBehavior.AllowGet);
        //    }
        //    catch (DbEntityValidationException e)
        //    {
        //        return Json(new { message = DbEntityValidationExceptionError(e), icon = "error" }, JsonRequestBehavior.AllowGet);
        //    }
        //}

        public ActionResult getAPLApplicants(string employment_type, string budget_code,string item_no, string hiring_period)
        {
            CheckSession();
            Session["budget_code"] = budget_code;
            List<sp_get_applicantlist_from_APL_Result> APL_list = new List<sp_get_applicantlist_from_APL_Result>();
            try
            {
                if (employment_type != "" && budget_code != "" && item_no != "")
                {
                    APL_list = db.sp_get_applicantlist_from_APL("", employment_type, budget_code, item_no, "", hiring_period).ToList();
                }

                return JSON2(new { APL_list, icon = "success" }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return Json(new { message = DbEntityValidationExceptionError(e), icon = "error" }, JsonRequestBehavior.AllowGet);
            }
        }

        public ActionResult getItemNumbers(string employment_type, string budget_code, string department_code,string hiring_period)
        {
            CheckSession();

            Session["budget_code"] = budget_code;

            try
            {
                var item_nbrs = db.sp_applied_item_from_APL2(employment_type, budget_code, department_code, hiring_period).ToList();
                return JSON2(new { item_nbrs, icon = "success" }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return Json(new { message = DbEntityValidationExceptionError(e), icon = "error" }, JsonRequestBehavior.AllowGet);
            }
        }

        public ActionResult getHiringPeriod(string employment_type, string budget_code)
        {
            CheckSession();

            Session["budget_code"] = budget_code;

            try
            {
                var HiringPeriods = db.psb_hiring_period_tbl.Where(a => a.employment_type == employment_type && a.budget_code == budget_code);
                return JSON2(new { HiringPeriods, icon = "success" }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return Json(new { message = DbEntityValidationExceptionError(e), icon = "error" }, JsonRequestBehavior.AllowGet);
            }
        }

        public ActionResult getDepartments(string hiring_period)
        {
            CheckSession();

            Session["hiring_period"] = hiring_period;
            try
            {
                var departments = db.sp_department_tbl_rct(hiring_period).ToList();

            
              
                return JSON2(new { departments, icon = "success" }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return Json(new { message = DbEntityValidationExceptionError(e), icon = "error" }, JsonRequestBehavior.AllowGet);
            }
        }

        //public ActionResult selectItem_no(string employment_type, string budget_code, string item_no, string start)
        //{
        //    CheckSession();
        //    try
        //    {
        //        var APL_list = db.sp_get_applicantlist_from_APL("", employment_type, budget_code, item_no, start).ToList();
        //        var item_nbrs = db.sp_applied_item_from_APL(employment_type, budget_code).ToList();
        //        return JSON2(new { item_nbrs, APL_list, icon = "success" }, JsonRequestBehavior.AllowGet);
        //    }
        //    catch (DbEntityValidationException e)
        //    {
        //        return Json(new { message = DbEntityValidationExceptionError(e), icon = "error" }, JsonRequestBehavior.AllowGet);
        //    }
        //}

        //public String DbEntityValidationExceptionError(DbEntityValidationException e)
        //{
        //    string message = "";
        //    foreach (var eve in e.EntityValidationErrors)
        //    {
        //        Console.WriteLine("Entity of type \"{0}\" in state \"{1}\" has the following validation errors:",
        //            eve.Entry.Entity.GetType().Name, eve.Entry.State);
        //        foreach (var ve in eve.ValidationErrors)
        //        {
        //            message = "- Property: \"{0}\", Error: \"{1}\"" + ve.PropertyName + "  :  " + ve.ErrorMessage;
        //            Console.WriteLine("- Property: \"{0}\", Error: \"{1}\"",
        //                ve.PropertyName, ve.ErrorMessage);
        //        }
        //    }
        //    return message;
        //}

        public ActionResult fetch_data_from_online(List<sp_get_applicantlist_from_APL_Result> data,string employment_type,string budget_code,string item_no, string start,string hiring_period)
        {
            CheckSession();
            var user_id = Session["user_id"].ToString();
        
            try
            {
                foreach (var l in data)
                {
                    var info_ctrl_nbr = db.sp_autogen_ctrl_nbr("applicants_tbl", 6, "info_ctrl_nbr").FirstOrDefault();
                    var APL_data = db.sp_pds_data_fromAPL(l.item_no
                                                        ,l.APL_info_ctrl_nbr
                                                        , info_ctrl_nbr
                                                        , user_id
                                                        , l.budget_code
                                                        , l.employment_type
                                                        , l.position_code
                                                        , l.department_code
                                                        , l.ctrl_no
                                                        , l.email
                                                        , l.mobile_no
                                                        );

                }
                var APL_list = db.sp_get_applicantlist_from_APL("", employment_type, budget_code, item_no, start, hiring_period).ToList();
                return JSON2(new { message = "Applicants data Successfully fetch", icon = "success", APL_list }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return Json(new { message = DbEntityValidationExceptionError(e), icon = "error" }, JsonRequestBehavior.AllowGet);
            }
        }
        public ActionResult findOnlineApplicant(string data, string start, string hiring_period)
        {
            CheckSession();
            try
            {
                var APL_list = db.sp_get_applicantlist_from_APL(data, "", "", "", start, hiring_period).ToList();
                return JSON2(new { APL_list, icon = "success" }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return Json(new { message = DbEntityValidationExceptionError(e), icon = "error" }, JsonRequestBehavior.AllowGet);
            }
        }


        public ActionResult StartsWith(string employment_type, string budget_code, string item_no, string start, string hiring_period)
        {
            CheckSession();
            try
            {
                var APL_list = db.sp_get_applicantlist_from_APL("", employment_type, budget_code, item_no, start, hiring_period).ToList();
                return JSON2(new { APL_list, icon = "success" }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return Json(new { message = DbEntityValidationExceptionError(e), icon = "error" }, JsonRequestBehavior.AllowGet);
            }
        }

        public ActionResult SendToEmail(List<emails> emails, string subject, string body)
        {
            aTimer = new System.Timers.Timer();
            aTimer.Interval = 2000;
            CheckSession();
            var emx = emails;
            var emx_len = emails.Count();
            var email_body = "";
            try
            {
                foreach (var x in emx)
                {
                    var email_settup = db.sp_send_email_notification(x.email_address, x.empl_id, x.app_ctrl_nbr).FirstOrDefault();
                    email_body = email_settup.email_header + body;
                    using (MailMessage mm = new MailMessage(email_settup.email_from, x.email_address))
                    {

                        mm.Subject = subject;
                        mm.Body = email_body;
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
                }

                return JSON2(new { message = "Applicants is successfully notified!", icon = "success" }, JsonRequestBehavior.AllowGet);


            }
            catch (DbEntityValidationException e)
            {
                string message = DbEntityValidationExceptionError(e);
                return Json(new { message = message, icon = "error" }, JsonRequestBehavior.AllowGet);
            }
        }

        public ActionResult fetch_education(string info_ctrl_nbr)
        {
            try
            {
                var fetched_education = db2.personnel_educ_tbl.Where(a => a.empl_id == info_ctrl_nbr).ToList();
                return JSON2(new { fetched_education, icon = "success" }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return JSON2(new { message = DbEntityValidationExceptionError(e), icon = "error" }, JsonRequestBehavior.AllowGet);
            }
        }

        public ActionResult fetch_eligibility(string info_ctrl_nbr)
        {
            try
            {
                var fetched_eligibility = db2.personnel_csceligibilty_tbl.Where(a => a.empl_id == info_ctrl_nbr).ToList();
                return JSON2(new { fetched_eligibility, icon = "success" }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return JSON2(new { message = DbEntityValidationExceptionError(e), icon = "error" }, JsonRequestBehavior.AllowGet);
            }
        }

        public ActionResult fetch_experience(string info_ctrl_nbr)
        {
            try
            {
                var fetched_experience = db2.personnel_workexprnce_tbl.Where(a => a.empl_id == info_ctrl_nbr).ToList();
                return JSON2(new { fetched_experience, icon = "success" }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return JSON2(new { message = DbEntityValidationExceptionError(e), icon = "error" }, JsonRequestBehavior.AllowGet);
            }
        }

        public ActionResult fetch_trainings(string info_ctrl_nbr)
        {
            try
            {
                var fetched_trainings = db2.personnel_learnanddevt_tbl.Where(a => a.empl_id == info_ctrl_nbr).ToList();
                return JSON2(new { fetched_trainings, icon = "success" }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return JSON2(new { message = DbEntityValidationExceptionError(e), icon = "error" }, JsonRequestBehavior.AllowGet);
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