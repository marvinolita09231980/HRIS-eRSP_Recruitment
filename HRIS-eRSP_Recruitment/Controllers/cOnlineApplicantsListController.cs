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
    public class Filter
    {
        public string employment_type { get; set; }
        public string budget_code { get; set; }
        public string hiring_period { get; set; }
        public string department_code { get; set; }
        public string item_no { get; set; }
    }
    public class cOnlineApplicantsListController :CustomController
    {
        HRIS_RCTEntities db = new HRIS_RCTEntities();
        HRIS_APLEntities db2 = new HRIS_APLEntities();
        HRIS_PAYEntities db3 = new HRIS_PAYEntities();
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

       

        public ActionResult Initialize(bool departmentcount)
        {
            CheckSession();
            List<sp_applied_item_from_APL2_Result> item_nbrs = new List<sp_applied_item_from_APL2_Result>();
            List<sp_department_tbl_rct_Result> departments = new List<sp_department_tbl_rct_Result>();
            List<sp_get_applicantlist_from_APL_Result> APL_list = new List<sp_get_applicantlist_from_APL_Result>();
            List<sp_budgetyears_tbl_combolist1_Result> budget_year = new List<sp_budgetyears_tbl_combolist1_Result>();
            List<psb_hiring_period_tbl> HiringPeriods = new List<psb_hiring_period_tbl>();


            Filter filter = new Filter();

            filter.employment_type = Session["OALemployment_type"] != null? Session["OALemployment_type"].ToString():"";
            filter.budget_code = Session["OALbudget_code"] != null ? Session["OALbudget_code"].ToString() : "";
            filter.hiring_period = Session["OALhiring_period"] != null ? Session["OALhiring_period"].ToString() : "";
            filter.department_code = Session["OALdepartment_code"] != null ? Session["OALdepartment_code"].ToString() : "";
            filter.item_no = Session["OALitem_no"] != null ? Session["OALitem_no"].ToString() : "";




            try
            {
                if (filter.employment_type != null)
                {
                     budget_year = db3.sp_budgetyears_tbl_combolist1(filter.employment_type).ToList();
                }

                if(filter.employment_type != null && filter.budget_code != null)
                {
                     HiringPeriods = db.psb_hiring_period_tbl.Where(a => a.employment_type == filter.employment_type && a.budget_code == filter.budget_code).ToList();
                }

                if(filter.employment_type != "" && filter.budget_code != "" && filter.department_code != "")
                {
                    item_nbrs = db.sp_applied_item_from_APL2(filter.employment_type, filter.budget_code, filter.department_code, filter.hiring_period).ToList();
                }
                if (filter.hiring_period != null)
                {
                    departments = db.sp_department_tbl_rct(filter.hiring_period).ToList();
                }

                if (filter.employment_type != "" && filter.budget_code != "" && filter.item_no != "")
                {
                    APL_list = db.sp_get_applicantlist_from_APL("", filter.employment_type, filter.budget_code, filter.item_no, "", filter.hiring_period).ToList();
                }

                return JSON2(new {departments, APL_list, icon = "success", filter, budget_year, HiringPeriods, item_nbrs}, JsonRequestBehavior.AllowGet);
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
                var budget_year = db3.sp_budgetyears_tbl_combolist1(employment_type).ToList();
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

        public ActionResult EditFetchDate(string app_ctrl_nbr, string item_no, string employment_type, string budget_code, string hiring_period,string fetch_dttm)
        {
            CheckSession();
            Session["budget_code"] = budget_code;
            var user_id = Session["user_id"].ToString();
            List<sp_get_applicantlist_from_APL_Result> APL_list = new List<sp_get_applicantlist_from_APL_Result>();
            try
            {
                var sqledit = db.applicants_review_tbl.Where(a => a.app_ctrl_nbr == app_ctrl_nbr).FirstOrDefault();
                sqledit.fetch_dttm = Convert.ToDateTime(fetch_dttm);
                sqledit.fetch_by = user_id;
                db.SaveChanges();

                APL_list = db.sp_get_applicantlist_from_APL("", employment_type, budget_code, item_no, "", hiring_period).ToList();
                return JSON2(new { APL_list, icon = "success" }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return Json(new { message = DbEntityValidationExceptionError(e), icon = "error" }, JsonRequestBehavior.AllowGet);
            }
        }
        public ActionResult EditPrescreenDate(string app_ctrl_nbr, string item_no, string employment_type, string budget_code, string hiring_period, string fetch_dttm)
        {
            CheckSession();
            Session["budget_code"] = budget_code;

            var user_id = Session["user_id"].ToString();
            var empl_id = Session["empl_id"].ToString();
            List<sp_get_applicantlist_from_APL_Result> APL_list = new List<sp_get_applicantlist_from_APL_Result>();
            try
            {
                var sqledit = db.applicants_review_tbl.Where(a => a.app_ctrl_nbr == app_ctrl_nbr).FirstOrDefault();
                sqledit.prescreen_dttm = Convert.ToDateTime(fetch_dttm);
                sqledit.presreen_by = user_id;
                db.SaveChanges();
               
                var personnelname= db.vw_personnelnames_tbl_RCT.Where(a => a.empl_id == empl_id).FirstOrDefault();
                var employee_name = personnelname.employee_name;
                //APL_list = db.sp_get_applicantlist_from_APL("", employment_type, budget_code, item_no, "", hiring_period).ToList();

                return JSON2(new { employee_name, icon = "success" }, JsonRequestBehavior.AllowGet);
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
                var departments = db.sp_department_tbl_APL(hiring_period).ToList();

            
              
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
                                                        , l.prescreen_dttm
                                                        );

                }
               // var APL_list = db.sp_get_applicantlist_from_APL("", employment_type, budget_code, item_no, start, hiring_period).ToList();
                return JSON2(new { message = "Applicants data Successfully fetch", icon = "success" }, JsonRequestBehavior.AllowGet);
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
                    var email_settup = db.sp_send_email_notification(x.email_address, x.empl_id, x.app_ctrl_nbr,"","").FirstOrDefault();
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
        public ActionResult GetEmailNotification(sp_get_applicantlist_from_APL_Result dt, string email_type)
        {
            CheckSession();
        
            var user_id = Session["user_id"].ToString();
          
            DateTime dttm = DateTime.Now;
            try
            {
                var email_settup = db.sp_send_email_notification(dt.email, dt.APL_info_ctrl_nbr, dt.app_ctrl_nbr, dt.ctrl_no, email_type).FirstOrDefault();
                
                return JSON2(new { email_settup, message = "Applicants is successfully notified!", icon = "success"}, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                string message = DbEntityValidationExceptionError(e);
                return Json(new { message = message, icon = "error" }, JsonRequestBehavior.AllowGet);
            }
        }
        

        public ActionResult sendEmailNotification(sp_get_applicantlist_from_APL_Result dt, string email_type)
        {
            CheckSession();
            var email_subject = "";


            var user_id = Session["user_id"].ToString();
            var mi = "";
            DateTime dttm = DateTime.Now;
            try
            {

               

                var email_settup = db.sp_send_email_notification(dt.email, dt.APL_info_ctrl_nbr, dt.app_ctrl_nbr, dt.ctrl_no, email_type).FirstOrDefault();
                

                

                

                if (dt.middlename == "")
                {
                    mi = "";
                }
                else
                {
                    mi = dt.middlename.Substring(0, 1);
                }

                if (email_type == "1")
                {
                    var appreview = db.applicants_review_tbl.Where(a => a.app_ctrl_nbr == dt.app_ctrl_nbr).FirstOrDefault();
                    appreview.email_aknowldge_dttm = dttm;
                    appreview.email_aknowldge_by = user_id;
                    appreview.aknowledge_dttm = dttm;
                    appreview.aknowledge_by = user_id;

                    email_subject = "Aknowledge application email";
                }
                else if (email_type == "2")
                {
                    var appreview = db.applicants_review_tbl.Where(a => a.app_ctrl_nbr == dt.app_ctrl_nbr).FirstOrDefault();
                    appreview.email_aknowldge_regret_dttm = dttm;
                    appreview.email_aknowldge_regret_by = user_id;

                    email_subject = "email evaluated but not qualified to proceed to online exam.";

                }

                applicants_email_sent_items ems = new applicants_email_sent_items();
                ems.app_ctrl_nbr = dt.app_ctrl_nbr == null ? "" : dt.app_ctrl_nbr;
                ems.first_name = dt.firstname;
                ems.last_name = dt.lastname;
                ems.middle_name = dt.middlename;
                ems.email_address = dt.email;
                ems.hiring_period = dt.ctrl_no;
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
                se.applicant_name = dt.firstname + " " + mi + ". " + dt.lastname;
                se.email_address = dt.email;
                se.email_aknowldge_dttm = apr.email_aknowldge_dttm.ToString();
                se.email_aknowldge_regret_dttm = apr.email_aknowldge_regret_dttm.ToString();
                se.email_noti_exam_dttm = apr.email_noti_exam_dttm.ToString();
                se.email_regret_dttm = apr.email_regret_dttm.ToString();
                se.email_noti_hrmpsb_dttm = apr.email_noti_hrmpsb_dttm.ToString();
                se.email_notintop5_dttm = apr.email_notintop5_dttm.ToString();
                se.email_congratulatory_dttm = apr.email_congratulatory_dttm.ToString();
                se.status = true;

                var empl_id = user_id.Substring(1, user_id.Length - 1);
                var personnelname = db.vw_personnelnames_tbl_RCT.Where(a => a.empl_id == empl_id).FirstOrDefault();
                var employee_name = personnelname.employee_name;


                return JSON2(new { employee_name, message = "Applicants is successfully notified!", icon = "success", se }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                string message = DbEntityValidationExceptionError(e);
                return Json(new { message = message, icon = "error" }, JsonRequestBehavior.AllowGet);
            }
        }


        public ActionResult sendEmailNotification2(sp_get_applicantlist_from_APL_Result dt, string email_type, sp_send_email_notification_Result email_settup)
        {
            CheckSession();
            var email_subject = "";


            var user_id = Session["user_id"].ToString();
            var mi = "";
            DateTime dttm = DateTime.Now;
            try
            {

                if (dt.middlename == "")
                {
                    mi = "";
                }
                else
                {
                    mi = dt.middlename.Substring(0, 1);
                }

                if (email_type == "1")
                {
                    var appreview = db.applicants_review_tbl.Where(a => a.app_ctrl_nbr == dt.app_ctrl_nbr).FirstOrDefault();
                    appreview.email_aknowldge_dttm = dttm;
                    appreview.email_aknowldge_by = user_id;
                    appreview.aknowledge_dttm = dttm;
                    appreview.aknowledge_by = user_id;

                    email_subject = "Aknowledge application email";
                }
                else if (email_type == "2")
                {
                    var appreview = db.applicants_review_tbl.Where(a => a.app_ctrl_nbr == dt.app_ctrl_nbr).FirstOrDefault();
                    appreview.email_aknowldge_regret_dttm = dttm;
                    appreview.email_aknowldge_regret_by = user_id;

                    email_subject = "email evaluated but not qualified to proceed to online exam.";

                }

                applicants_email_sent_items ems = new applicants_email_sent_items();
                ems.app_ctrl_nbr = dt.app_ctrl_nbr == null ? "" : dt.app_ctrl_nbr;
                ems.first_name = dt.firstname;
                ems.last_name = dt.lastname;
                ems.middle_name = dt.middlename;
                ems.email_address = dt.email;
                ems.hiring_period = dt.ctrl_no;
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
                se.applicant_name = dt.firstname + " " + mi + ". " + dt.lastname;
                se.email_address = dt.email;
                se.email_aknowldge_dttm = apr.email_aknowldge_dttm.ToString();
                se.email_aknowldge_regret_dttm = apr.email_aknowldge_regret_dttm.ToString();
                se.email_noti_exam_dttm = apr.email_noti_exam_dttm.ToString();
                se.email_regret_dttm = apr.email_regret_dttm.ToString();
                se.email_noti_hrmpsb_dttm = apr.email_noti_hrmpsb_dttm.ToString();
                se.email_notintop5_dttm = apr.email_notintop5_dttm.ToString();
                se.email_congratulatory_dttm = apr.email_congratulatory_dttm.ToString();
                se.status = true;

                var empl_id = user_id.Substring(1, user_id.Length - 1);
                var personnelname = db.vw_personnelnames_tbl_RCT.Where(a => a.empl_id == empl_id).FirstOrDefault();
                var employee_name = personnelname.employee_name;


                return JSON2(new { employee_name, message = "Applicants is successfully notified!", icon = "success", se }, JsonRequestBehavior.AllowGet);
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

        public ActionResult verifyinReview(sp_get_applicantlist_from_APL_Result dt)
        {
            try
            {
                 
                 var inreview = (from A in db.vw_applicants_review_tbl_dates
                                where A.empl_id == dt.APL_info_ctrl_nbr
                                && A.item_no == dt.item_no
                                && A.hiring_period == dt.ctrl_no
                                select new {
                                     A.app_ctrl_nbr
                                    ,A.email_aknowldge_dttm
                                    ,A.email_aknowldge_regret_dttm
                                });
                               
                return JSON2(new { inreview, icon = "success" }, JsonRequestBehavior.AllowGet);
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

         
        public ActionResult SetHistoryPage1(string employment_type,string budget_code,string hiring_period,string department_code,string item_no)
        {
            CheckSession();
            try
            {
               
                Session["history_page"] = Request.UrlReferrer.ToString();

                Session["OALemployment_type"] = employment_type;
                Session["OALbudget_code"] = budget_code;
                Session["OALhiring_period"] = hiring_period;
                Session["OALdepartment_code"] = department_code;
                Session["OALitem_no"] = item_no;

                return JSON2(new { message = "success" }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                string message = e.Message;
                return JSON2(new { message = message }, JsonRequestBehavior.AllowGet);
            }
        }

    }
}