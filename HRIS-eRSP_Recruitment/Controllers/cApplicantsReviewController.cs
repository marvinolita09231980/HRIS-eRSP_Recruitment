using HRIS_Common;
using HRIS_eRSP_Recruitment.Common_Code;
using HRIS_eRSP_Recruitment.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity.Validation;
using System.Globalization;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Text;
using System.Timers;
using System.Web;
using System.Web.Mvc;

namespace HRIS_eRSP_Recruitment.Controllers
{
    public class cApplicantsReviewController : CustomController
    {

        string transcation_code = "109";
        string urlname = "cApplicantsReview";

        HRIS_APLEntities db = new HRIS_APLEntities();
        HRIS_RCTEntities db2 = new HRIS_RCTEntities();
        private static Timer aTimer;
        CommonDB Cmn = new CommonDB();
        User_Menu um = new User_Menu();
        // GET: cApplicantsReview

        // var items = db2.vw_open_vacant_publication_list.Where(a => a.employment_type == employment_type && a.budget_code == budget_code).ToList();
        public ActionResult Index()
        {

            if (Session["user_id"] == null)
            {
                return RedirectToAction("Index", "Login");
            }
           
            
            return View();
        }
       
        public ActionResult Initialize(string item_no,string employment_type,string budget_code)
        {
            CheckSession();
            psb_sked_item_nbrs pitm = new psb_sked_item_nbrs();
            assignToModel();
            try
            {
             
                return JSON2(new {}, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return Json(new { message = DbEntityValidationExceptionError(e),icon=icon.error}, JsonRequestBehavior.AllowGet);
            }
        }
        public ActionResult getApplication_status()
        {
            CheckSession();
            try
            {
                var application_status = db2.application_status_tbl.ToList();
                return JSON2(new{ application_status }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return Json(new { message = DbEntityValidationExceptionError(e), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }

        }
        public ActionResult getDepartment(string hiring_period)
        {
            CheckSession();
            try
            {
                var department = db2.sp_department_tbl_rct(hiring_period).ToList();
                var psb_sked_hdr = db2.vw_psb_sked_hdr_tbl.Where(a => a.hiring_period == hiring_period && a.psb_status < 2).ToList();
                return JSON2(new
                {
                    department
                    ,psb_sked_hdr

                }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return Json(new { message = DbEntityValidationExceptionError(e), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }
        public ActionResult deleteFromReview(string app_ctrl_nbr, int app_status)
        {
            var icn = "";
            var message = "";
            CheckSession();
            try
            {
                if (app_status == 1)
                {
                    var del = db2.applicants_review_tbl.Where(a => a.app_ctrl_nbr == app_ctrl_nbr).FirstOrDefault();
                    if (del != null)
                    {
                        db2.applicants_review_tbl.Remove(del);
                        db2.SaveChanges();
                        message = "Applicants successfully deleted";
                        icn = icon.success;
                    }
                    else
                    {
                        message = "Applicants not found!";
                        icn = icon.error;
                    }
                }
                else
                {
                    message = "Applicants cannot be remove!";
                    icn = icon.error;
                }
              
                return JSON2(new
                {
                    message = message,
                    icon = icn

                }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return Json(new { message = DbEntityValidationExceptionError(e), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }

        public ActionResult getHiringPeriod(string employment_type, string budget_code)
        {
            CheckSession();
            try
            {
                var hiringperiodlist = db2.psb_hiring_period_tbl.Where(a => a.employment_type == employment_type && a.budget_code == budget_code).ToList();
                return JSON2(new
                {
                    hiringperiodlist

                }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return Json(new { message = DbEntityValidationExceptionError(e), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }


        public ActionResult getBudget_Code(string employment_type)
        {
            CheckSession();
            Session["s_employment_type"] = employment_type;
            List<sp_budgetyears_tbl_combolist1_RCT_Result> budgetyear = new List<sp_budgetyears_tbl_combolist1_RCT_Result>();
           
            try
            {
                
                budgetyear = db2.sp_budgetyears_tbl_combolist1_RCT(employment_type).ToList();

                return JSON2(new
                {
                    message = fetch.success,
                    icon = icon.success,
                    budgetyear

                }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return Json(new { message = DbEntityValidationExceptionError(e), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }

        }
        public void assignToModel()
        {
            um.allow_add = (int)Session["allow_add"];
            //um.allow_delete = (int)Session["allow_delete"];
            //um.allow_edit = (int)Session["allow_edit"];
            um.allow_edit_history = (int)Session["allow_edit_history"];
            um.allow_print = (int)Session["allow_print"];
            um.allow_view = (int)Session["allow_view"];
            um.url_name = Session["url_name"].ToString();
            um.id = (int)Session["id"];
            um.menu_name = Session["menu_name"].ToString();
            um.page_title = Session["page_title"].ToString();
            um.allow_delete = 0;
            um.allow_edit = 0;
        }
        public ActionResult getPublicationVacant(string budget_code, string employment_type,string department_code,string hiring_period)
        {
            CheckSession();
            Session["s_budget_code"] = budget_code;
            try
            {
               
                var items = db.available_item_tbl.Where(a => a.budget_code == budget_code 
                && a.employment_type == employment_type 
                && a.department_code == department_code
                && a.ctrl_no == hiring_period).ToList();
                return JSON2(new { message = update.success, icon = icon.success, items }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return Json(new { message = DbEntityValidationExceptionError(e), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }
        public ActionResult getReviewItem(string item_no, string budget_code, string employment_type, string hiring_period,string department_code)
        {
            CheckSession();
            Session["rw_item_no"] = item_no;
            Session["rw_budget_code"] = budget_code;
            Session["rw_employment_type"] = employment_type;
            Session["rw_hiring_period"] = hiring_period;
            Session["rw_department_code"] = department_code;
            var psb_ctrl_nbr = "";
            List<sp_review_applicant_tbl_list3_Result> review_list = new List<sp_review_applicant_tbl_list3_Result>();
            try
            {
                var pitm = db2.psb_sked_item_nbrs.Where(a => a.item_no == item_no && a.budget_code == budget_code && a.employment_type == employment_type).FirstOrDefault();
                if (pitm != null)
                {
                    psb_ctrl_nbr = pitm.psb_ctrl_nbr;
                }

                if (item_no != "")
                {
                    review_list = db2.sp_review_applicant_tbl_list3(item_no, employment_type, budget_code, hiring_period).ToList();
                }
               
                return JSON2(new { message = update.success, icon = icon.success, review_list, psb_ctrl_nbr }, JsonRequestBehavior.AllowGet);
               
            }
            catch (DbEntityValidationException e)
            {
                return Json(new { message = DbEntityValidationExceptionError(e), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }
        public ActionResult Updatefrompds(string info_ctrl_nbr,string empl_id)
        {
            CheckSession();
            try
            {
                    var updatepds = db2.sp_update_rct_qs_frompds_2(empl_id, info_ctrl_nbr).FirstOrDefault();
                    
                    return JSON2(new { message = update.success, icon = icon.success, updatepds }, JsonRequestBehavior.AllowGet);
                
            }
            catch (DbEntityValidationException e)
            {
                return Json(new { message = DbEntityValidationExceptionError(e), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }
        public ActionResult Updatefromapl(string info_ctrl_nbr, string empl_id)
        {
            CheckSession();
            try
            {
                var updateapl = db2.sp_update_rct_qs_fromapl_2(empl_id, info_ctrl_nbr).FirstOrDefault();

                return JSON2(new { message = update.success, icon = icon.success, updateapl }, JsonRequestBehavior.AllowGet);

            }
            catch (DbEntityValidationException e)
            {
                return Json(new { message = DbEntityValidationExceptionError(e), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }
        public ActionResult SaveExamResult(applicant_examination data, string app_ctrl_nbr)
        {
            CheckSession();
            var message = "";
             var user_id = Session["user_id"].ToString();
             DateTime date = DateTime.Now; 
            try
            {
                var exm = db2.applicant_examination.Where(a => a.app_ctrl_nbr == app_ctrl_nbr).FirstOrDefault();
                if(exm == null)
                {
                    data.app_ctrl_nbr = app_ctrl_nbr;
                    data.created_by_user = user_id;
                    data.created_dttm = date;
                    db2.applicant_examination.Add(data);
                    db2.SaveChanges();
                    message = insert.success;
                }
                else
                {
                    exm.score_rendered = data.score_rendered;
                    exm.updated_by_user = user_id;
                    exm.updated_dttm = date;
                    db2.SaveChanges();
                    message = update.success;
                }

                return JSON2(new { message = message, icon = icon.success }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return Json(new { message = DbEntityValidationExceptionError(e), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }
        public ActionResult getReviewDetail(string app_ctrl_nbr)
        {
            CheckSession();
            try
            {
                var dtl = db2.sp_review_dtl_modal(app_ctrl_nbr).ToList();
                var dtl_count = dtl.Count();
                return JSON2(new { message = fetch.success, icon = icon.success, dtl, dtl_count}, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return Json(new { message = DbEntityValidationExceptionError(e), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }
        public ActionResult getBudgetYear(string budget_code, string employment_type)
        {
            CheckSession();
            Session["s_employment_type"] = employment_type;
            try
            {
                var position_tbl = db2.sp_publicationvacant_combolist_RCT(IFNULL(budget_code, ""), IFNULL(employment_type, "")).ToList();
                var budget_year = db2.sp_budgetyears_tbl_combolist1_RCT(employment_type).ToList();
                return JSON2(new { icon = icon.success, budget_year, position_tbl }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return Json(new { message = DbEntityValidationExceptionError(e), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }
        public ActionResult HasPsbCtrlNbr(string app_ctrl_nbr)
        {
            CheckSession();
            try
            {
                var psb_ctrl_nbr = db2.psb_sked_app_tbl.Where(a => a.app_ctrl_nbr == app_ctrl_nbr).ToList();
                var psb_ctrl_nbr_count = psb_ctrl_nbr.Count();
                return JSON2(new { icon = icon.success, psb_ctrl_nbr_count }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return Json(new { message = DbEntityValidationExceptionError(e), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }
        public ActionResult SaveOtherDetails(app_review obj,string examdate,string examtype,string scorerendered)
        {
            CheckSession();
            var user = Session["user_id"].ToString();
            var date = DateTime.Now;
            try
            {
                var exm = db2.applicant_examination.Where(a => a.app_ctrl_nbr == obj.app_ctrl_nbr).FirstOrDefault();
                //var app = db2.applicants_review_tbl.Where(a => a.app_ctrl_nbr == obj.app_ctrl_nbr).FirstOrDefault();
                //app.item_no           = IFNULL(obj.item_no,"");
                //app.position_code     = IFNULL(obj.position_code,"");
                //app.department_code   = IFNULL(obj.department_code,"");
                //app.employment_type   = IFNULL(obj.employment_type,"");
                //app.budget_code       = IFNULL(obj.budget_code,"");
                //app.updated_dttm      = Convert.ToDateTime(date);
                //app.updated_by_user   = IFNULL(user, "");

                if(exm == null)
                {
                    applicant_examination ap = new applicant_examination();
                    ap.app_ctrl_nbr      =  obj.app_ctrl_nbr;
                    ap.exam_type_descr   = examtype;
                    ap.score_rendered    = Convert.ToDouble(scorerendered);
                    ap.exam_date         = Convert.ToDateTime(examdate);
                    ap.created_dttm      = Convert.ToDateTime(date);
                    ap.created_by_user   = user;
                    db2.applicant_examination.Add(ap);
                    db2.SaveChanges();
                
                }
                else
                {
                    exm.app_ctrl_nbr = obj.app_ctrl_nbr;
                    exm.exam_type_descr = IFNULL(obj.exam_type_descr, "");
                    exm.score_rendered = IFNULL(obj.score_rendered, 0.00);
                    exm.exam_date = IFNULL(Convert.ToDateTime(obj.exam_date), "1900-01-01 00:00:00");
                    exm.updated_dttm = date;
                    exm.updated_by_user = user;
                     db2.SaveChanges();
                }
                
                
                return JSON2(new { message = update.success ,icon = icon.success }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return Json(new { message = DbEntityValidationExceptionError(e), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }
        public ActionResult SaveForPsbSched(string psb_ctrl_nbr, string app_ctrl_nbr)
        {
            CheckSession();
            var user_id = Session["user_id"].ToString();
            var message = "";
            var icn = "";
            try
            {
                psb_sked_app_tbl ps = db2.psb_sked_app_tbl.Where(a => a.app_ctrl_nbr == app_ctrl_nbr && a.psb_ctrl_nbr == psb_ctrl_nbr).FirstOrDefault();
                if(ps == null)
                {
                    ps = new psb_sked_app_tbl();
                    ps.psb_ctrl_nbr = psb_ctrl_nbr;
                    ps.app_ctrl_nbr = app_ctrl_nbr;
                    db2.psb_sked_app_tbl.Add(ps);

                    var db = db2.applicants_review_tbl.Where(a => a.app_ctrl_nbr == app_ctrl_nbr).FirstOrDefault();
                    db.app_status = "2";
                    db2.SaveChanges();
                    message = insert.success;
                    icn = icon.success;
                }
                else
                {
                    message = "Application already scheduled for screening";
                    icn = icon.error;
                }

                return JSON2(new { message, icon = icn }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return Json(new { message = DbEntityValidationExceptionError(e), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }
        public ActionResult getPsbSchedList(string item_no)
        {
            CheckSession();
            var message = "";
            object pnl = new object();
            var icn = "";
            try
            {

                var itm = db2.sp_item_psb_schedule(item_no).ToList();
                var itm_rw = itm.FirstOrDefault();
                if(itm.Count() == 0)
                {
                    message = "Applicants item not scheduled for PSB Screening";
                    icn = "error";
                }
                else
                {
                    pnl = db2.psb_sked_mbr_tbl.Where(a => a.psb_ctrl_nbr == itm_rw.psb_ctrl_nbr).ToList();

                    icn = "success";
                }
                return JSON2(new { message, icon = icn, itm, pnl}, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return Json(new { message = DbEntityValidationExceptionError(e), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }
        public ActionResult getPsbPanelMember(string psb_ctrl_nbr)
        {
            CheckSession();
            try
            {
                var psbcshedmbr = db2.vw_psb_sked_mbr_tbl.Where(a => a.psb_ctrl_nbr == psb_ctrl_nbr).ToList();
                return JSON2(new { message = update.success, icon = icon.success, psbcshedmbr }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return Json(new { message = DbEntityValidationExceptionError(e), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }
        //public ActionResult sp_review_applicant_list(string budget_code, string employment_type, string item_no,string status)
        //{
        //    CheckSession();
        //    Session["s_item_no"] = item_no;
        //    Session["s_app_status"] = status;

        //    try
        //    {
        //        var review_list = db2.sp_review_applicant_tbl_list3(item_no,employment_type,budget_code).ToList();
        //        return JSON2(new    { message = update.success, icon = icon.success, review_list}, JsonRequestBehavior.AllowGet);
        //    }
        //    catch (DbEntityValidationException e)
        //    {
        //        return Json(new { message = DbEntityValidationExceptionError(e), icon = icon.error }, JsonRequestBehavior.AllowGet);
        //    }
        //}
        public ActionResult UpdateDataFrom(string info_ctrl_nbr, string empl_id, string source,string item_no,string employment_type,string budget_code,string hiring_period)
        {
            CheckSession();
            var user_id = Session["user_id"].ToString();
            try
            {
                var returnUpdate = db2.sp_update_applicants_tbl(info_ctrl_nbr, empl_id, user_id, source).FirstOrDefault();
                var review_list = db2.sp_review_applicant_tbl_list3(item_no, employment_type, budget_code, hiring_period).ToList();
                return JSON2(new { message = " ", icon = icon.success, returnUpdate, review_list }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return Json(new { message = DbEntityValidationExceptionError(e), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }
        public ActionResult ReviewPass(string item_no, string budget_code,string employment_type,string app_ctrl_nbr,bool pass,string hiring_period)
        {
            CheckSession();
            var message = "";
            var ps = "";
            if(pass)
            {
                ps = "2";
                message = "Data Added Successfully";
            }
            else
            {
                ps = "1";
                message = "Data Remove Successfully";
            }
           var user = Session["user_id"].ToString();
            try
            {
                psb_sked_app_tbl psa = new psb_sked_app_tbl();
                var dt = db2.applicants_review_tbl.Where(a => a.app_ctrl_nbr == app_ctrl_nbr).FirstOrDefault();
                dt.app_status = ps;
                dt.updated_dttm = dttm.currentDate;
                dt.updated_by_user = user;

                if (pass)
                {
                    var item = db2.psb_sked_item_nbrs.Join(db2.psb_sked_hdr_tbl, a => a.psb_ctrl_nbr, b => b.psb_ctrl_nbr,
                        (a, b) => new
                        {
                             a.psb_ctrl_nbr
                            ,a.item_no
                            ,b.budget_code
                        }).Where(c => c.item_no == dt.item_no && c.budget_code == dt.budget_code).FirstOrDefault();
                    psa.app_ctrl_nbr = app_ctrl_nbr;
                    psa.psb_ctrl_nbr = item.psb_ctrl_nbr;
                    db2.psb_sked_app_tbl.Add(psa);
                }
                else
                {
                    var psaa = db2.psb_sked_app_tbl.Where(a => a.app_ctrl_nbr == app_ctrl_nbr).FirstOrDefault();
                    db2.psb_sked_app_tbl.Remove(psaa);
                }
                    
                db2.SaveChanges();

                var review_list = db2.sp_review_applicant_tbl_list3(item_no,employment_type,budget_code,hiring_period).ToList();
                return JSON2(new    { message, icon = icon.success, review_list }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return Json(new { message = DbEntityValidationExceptionError(e), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }
        public ActionResult SetHistoryPage()
        {
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

                return JSON2(new { message = "success" }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                string message = e.Message;
                return JSON2(new { message = message }, JsonRequestBehavior.AllowGet);
            }
        }
        public ActionResult SendToEmail(List<emails> emails, string subject, string body)
        {
            CheckSession();
            var emx = emails;
            var emx_len = emails.Count();
            var email_body = "";

            try
            {
                foreach (var x in emx)
                {
                    aTimer = new System.Timers.Timer();
                    aTimer.Interval = 1000;
                    aTimer.Elapsed += OnTimedEvent;
                    aTimer.AutoReset = true;

                    var email_settup = db2.sp_send_email_notification(x.email_address, x.empl_id, x.app_ctrl_nbr,"","").FirstOrDefault();
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
                    aTimer.Enabled = true;
                }

                return JSON2(new { message = "Applicants is successfully notified!", icon = "success" }, JsonRequestBehavior.AllowGet);


            }
            catch (DbEntityValidationException e)
            {
                string message = DbEntityValidationExceptionError(e);
                return Json(new { message = message, icon = "error" }, JsonRequestBehavior.AllowGet);
            }
        }
        public ActionResult SendToEmail2(emails email, string subject, string body)
        {
            CheckSession();
            var emx = email;
            var x = email;
            var email_body = "";
            var user_id = Session["user_id"].ToString();
            var mi = "";
            DateTime dttm = DateTime.Now;
            try
            {

                var middlename = email.middle_name == null ? "" : email.middle_name;

                var email_settup = db2.sp_send_email_notification(x.email_address, x.empl_id, x.app_ctrl_nbr,"","").FirstOrDefault();
                email_body = email_settup.email_header + body;

                using (MailMessage mm = new MailMessage(email_settup.email_from, x.email_address))
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

                applicants_email_sent_items ems = new applicants_email_sent_items();
                ems.app_ctrl_nbr = email.app_ctrl_nbr == null ? "" : email.app_ctrl_nbr;
                ems.first_name = email.first_name;
                ems.last_name = email.last_name;
                ems.middle_name = middlename;
                ems.email_address = email.email_address;
                ems.hiring_period = email.hiring_period;
                ems.email_subject = subject;
                ems.created_dttm = dttm.ToString();
                ems.created_by_user = user_id;
                db2.applicants_email_sent_items.Add(ems);
                db2.SaveChanges();

                if (middlename == "")
                {
                    mi = "";
                }
                else
                {
                    mi = middlename.Substring(0, 1);
                }

                sendingEmailList se = new sendingEmailList();
                se.app_ctrl_nbr = email.app_ctrl_nbr == null?"": email.app_ctrl_nbr;
                se.applicant_name = email.first_name + " " + mi + ". " + email.last_name;
                se.email_address = email.email_address;
                se.status = true;

                return JSON2(new { message = "Applicants is successfully notified!", icon = "success", se}, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                string message = DbEntityValidationExceptionError(e);
                return Json(new { message = message, icon = "error" }, JsonRequestBehavior.AllowGet);
            }
        }
        private static void OnTimedEvent(Object source, System.Timers.ElapsedEventArgs e)
        {
            aTimer.Enabled = false;
        }
        public ActionResult UpdateDataFrom2(
              string info_ctrl_nbr
            , string empl_id
            , string source
            , string year
            , string month
            , string employment_type
            , string budget_code
            , string item_no
            , string hiring_period
            )
        {
            CheckSession();
            var user_id = Session["user_id"].ToString();
            try
            {
                var returnUpdate = db2.sp_update_applicants_tbl(info_ctrl_nbr, empl_id, user_id, source).FirstOrDefault();
               
                var review_list = db2.sp_review_applicant_tbl_list3(item_no, employment_type, budget_code, hiring_period).ToList();
                return JSON2(new { message = " ", icon = icon.success, returnUpdate, review_list }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return JSON2(new { message = DbEntityValidationExceptionError(e), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }
        public ActionResult UpdateDataFrom3(
              string info_ctrl_nbr
            , string empl_id
            , string source
            , string year
            , string month
            , string employment_type
            , string budget_code
            , string item_no
            , string hiring_period
            )
        {
            CheckSession();
            var user_id = Session["user_id"].ToString();
            try
            {
                var returnUpdate = db2.sp_update_applicants_tbl(info_ctrl_nbr, empl_id, user_id, source).FirstOrDefault();
                var review_list = db2.sp_review_applicant_tbl_list3(item_no, employment_type, budget_code, hiring_period).ToList();
                return JSON2(new { message = " ", icon = icon.success, returnUpdate, review_list }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return Json(new { message = DbEntityValidationExceptionError(e), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }

        public ActionResult getApplicantFromPDSID(string empl_id)
        {
            CheckSession();
            try
            {
                var apl_list = db2.sp_reg_applicant_pdsID(empl_id).ToList();
                return JSON2(new { message = delete.success, icon = icon.success, apl_list }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException exp)
            {
                return Json(new { message = DbEntityValidationExceptionError(exp), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        } 
        public ActionResult addToPSB(string item_no, string app_ctrl_nbr, string employment_type, string budget_code,string hiring_period,string psb_ctrl_nbr)
        {
            var message = "";
            var icn = "";
            try
            {
                List<sp_review_applicant_tbl_list3_Result> review_list = new List<sp_review_applicant_tbl_list3_Result>();

                var inpsb = (from p in db2.psb_sked_item_nbrs
                            where p.item_no == item_no
                             && p.employment_type == employment_type
                             && p.budget_code == budget_code
                             select new
                            {
                                p.psb_ctrl_nbr,
                                p.employment_type,
                                p.budget_code
                            }).FirstOrDefault();

                if (psb_ctrl_nbr == "")
                {
                    throw new Exception("You have not selected a HRMSP schedule");
                }
                else
                {
                    var psbhdr = db2.psb_sked_hdr_tbl.Where(a => a.psb_ctrl_nbr == psb_ctrl_nbr).FirstOrDefault();
                    if (psbhdr.psb_status >= 2)
                    {
                        throw new Exception("Cannot add applicants from PSB schedule that is already concluded");
                    }

                    var app = db2.psb_sked_app_tbl.Where(a => a.app_ctrl_nbr == app_ctrl_nbr && a.psb_ctrl_nbr == psb_ctrl_nbr).FirstOrDefault();
                    if(app == null)
                    {
                        psb_sked_app_tbl ap = new psb_sked_app_tbl();
                        ap.app_ctrl_nbr = app_ctrl_nbr;
                        ap.psb_ctrl_nbr = psb_ctrl_nbr;
                        db2.psb_sked_app_tbl.Add(ap);

                        var apl = db2.applicants_review_tbl.Where(a => a.app_ctrl_nbr == app_ctrl_nbr).FirstOrDefault();
                        apl.app_status = "2";
                        db2.SaveChanges();
                        message = "Applicants is successfully added to PSb schedule";
                        icn = "success";
                        review_list = db2.sp_review_applicant_tbl_list3(item_no, employment_type, budget_code, hiring_period).ToList();
                    }
                }
               
                return JSON2(new { message = message, icon = icn, review_list }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception exp)
            {
                return Json(new { message = exp.Message, icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }

        public ActionResult removeFromPsb(string item_no, string app_ctrl_nbr,string employment_type, string budget_code, string hiring_period, string psb_ctrl_nbr)
        {
            var message = "";
            var icn = "";
            try
            {
                List<sp_review_applicant_tbl_list3_Result> review_list = new List<sp_review_applicant_tbl_list3_Result>();
                var inpsb = (from p in db2.psb_sked_item_nbrs
                             where p.item_no == item_no
                             && p.employment_type == employment_type
                             && p.budget_code == budget_code
                             select new
                             {
                                 p.psb_ctrl_nbr,
                                 p.employment_type,
                                 p.budget_code
                             }).FirstOrDefault();
              

                var psbhdr = db2.psb_sked_hdr_tbl.Where(a => a.psb_ctrl_nbr == psb_ctrl_nbr).FirstOrDefault();
                if(psbhdr.psb_status >= 2)
                {
                    throw new Exception("Cannot remove applicants from PSB schedule that is already concluded");
                }
                var app = db2.psb_sked_app_tbl.Where(a => a.app_ctrl_nbr == app_ctrl_nbr && a.psb_ctrl_nbr == psb_ctrl_nbr).FirstOrDefault();
                if(app == null) throw new Exception("Applicants not yet in Psb Schedule");
                db2.psb_sked_app_tbl.Remove(app);
                var apl = db2.applicants_review_tbl.Where(a => a.app_ctrl_nbr == app_ctrl_nbr).FirstOrDefault();
                if (apl == null) throw new Exception("Application not found");
                apl.app_status = "1";
                db2.SaveChanges();
                message = "Applicants is successfully added to PSb schedule";
                icn = "success";
                review_list = db2.sp_review_applicant_tbl_list3(item_no, employment_type, budget_code, hiring_period).ToList();
                return JSON2(new { message = message, icon = icn, review_list }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception exp)
            {
                return Json(new { message = exp.Message, icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }

        public ActionResult getPSBSkedHdr(string budget_code, string employment_type)
        {
            try
            {
                var psbskedhdr = db2.sp_psb_sked_hdr_tbl_list(employment_type,budget_code).ToList();
                return JSON2(new { icon = icon.success, psbskedhdr }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException exp)
            {
                return Json(new { message = DbEntityValidationExceptionError(exp), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }

        public ActionResult GetExamSchedules()
        {
            try
            {
                var examschedules = db2.vw_exam_schedule_tbl.Where(a => a.exam_status == "O").ToList();
                return JSON2(new { icon = icon.success, examschedules }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException exp)
            {
                return Json(new { message = DbEntityValidationExceptionError(exp), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }
            
        public ActionResult SetExamSchedule(
             string app_ctrl_nbr
            ,string hiring_period
            ,string item_no
            ,string budget_code
            ,string employment_type
            ,int exam_id
            )
        {
            try
            {
                var ap_review_tbl  = db2.applicants_review_tbl.Where(a => a.app_ctrl_nbr == app_ctrl_nbr).FirstOrDefault();
                if (ap_review_tbl != null)
                {
                    ap_review_tbl.exam_id = exam_id;
                    db2.SaveChanges();

                    var review_list = db2.sp_review_applicant_tbl_list3(item_no, employment_type, budget_code, hiring_period).ToList();

                    return JSON2(new { message = "Successfully set exam date", icon = icon.success, review_list }, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    throw new Exception("app_ctrl_nbr is null");
                }
            }
            catch (DbEntityValidationException exp)
            {
                return Json(new { message = DbEntityValidationExceptionError(exp), icon = icon.error }, JsonRequestBehavior.AllowGet);
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