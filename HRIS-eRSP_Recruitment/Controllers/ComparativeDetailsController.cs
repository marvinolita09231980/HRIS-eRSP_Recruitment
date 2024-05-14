using HRIS_eRSP_Recruitment.Common_Code;
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
    public class ComparativeDetailsController : CustomController
    {
        string transaction_code = "109";
        HRIS_RCTEntities db = new HRIS_RCTEntities();
        User_Menu um = new User_Menu();
        RCT_Common rct = new RCT_Common();
        // GET: ComparativeDetails
        public ActionResult Index()
        {
            return View();
        }
        public ActionResult Initialize()
        {
            db.Database.CommandTimeout = Int32.MaxValue;
            CheckSession();
            um = rct.GetAllowAccess();
            var user_id = Session["user_id"].ToString();
            var psb_ctrl_nbr = Session["ca_psb_ctrl_nbr"].ToString();
            var item_no = Session["ca_item_no"].ToString();
            var budget_code    = Session["ca_budget_code"].ToString();
            var employment_type= Session["ca_employment_type"].ToString();
            var salary_grade = Session["ca_salary_grade"].ToString();
            var ranked = (bool)Session["ca_ranked"];
            //um = rct.GetAllowAccess();
           
            try
            {
                if (ranked)
                {
                    var combined_id = Convert.ToInt32(item_no);
                    var comparative = db.sp_comparative_assessment_list_ranked(psb_ctrl_nbr, combined_id, "3").ToList();
                    return JSON(new { message = fetch.success, icon = icon.success, comparative, psb_ctrl_nbr, item_no, budget_code, employment_type, salary_grade, ranked }, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    var comparative = db.sp_comparative_assessment_list(psb_ctrl_nbr, item_no, "3").ToList();
                    return JSON(new { message = fetch.success, icon = icon.success, comparative, psb_ctrl_nbr, item_no, budget_code, employment_type, salary_grade, ranked }, JsonRequestBehavior.AllowGet);
                }
                
            }
            catch (DbEntityValidationException e)
            {
                return Json(new { message = e.Message, icon = icon.error }, JsonRequestBehavior.AllowGet);
            }

        }

        public ActionResult GetEndorseList(string item_no, string budget_code, string employment_type,bool ranked)
        {
            db.Database.CommandTimeout = Int32.MaxValue;
            CheckSession();
            var endorse_item_no = "";
            try
            {
                if (ranked) {

                    var combined_id = Convert.ToInt32(item_no);
                    var apps = db.vw_combined_item_dtl_tbl.Where(a => a.item_no == item_no && a.budget_code == budget_code && a.employment_type == a.employment_type).ToList();
                    var item_nbrs = db.combined_item_dtl_tbl.Where(a => a.combined_id == combined_id).ToList();
                    for(var x=0;x< item_nbrs.Count();x++)
                    {
                        if(x == (item_nbrs.Count()-1))
                        {
                            endorse_item_no += item_nbrs[x].item_no;
                        }
                        else { 
                            endorse_item_no += item_nbrs[x].item_no+", ";
                        }
                    }
                    return JSON(new { message = fetch.success, icon = icon.success, apps, endorse_item_no}, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    var apps = (from a in db.applicants_review_tbl
                                join p in db.vw_positions_tbl
                                on a.position_code equals p.position_code
                                join d in db.vw_departments_tbl
                                on a.department_code equals d.department_code
                                where a.item_no == item_no
                                && a.budget_code == budget_code
                                && a.employment_type == employment_type
                                select new
                                {
                                    a.item_no
                                    ,
                                    p.position_long_title
                                    ,
                                    d.department_name1
                                });
                    endorse_item_no = apps.FirstOrDefault().item_no;
                    return JSON(new { message = fetch.success, icon = icon.success, apps, endorse_item_no}, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception e)
            {
                return Json(new { message = e.Message, icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }
        public ActionResult GetEmailNotification2(sp_comparative_assessment_list_container dt, string email_type)
        {
            db.Database.CommandTimeout = Int32.MaxValue;
            CheckSession();

            var user_id = Session["user_id"].ToString();

            DateTime dttm = DateTime.Now;
            try
            {
                var app = db.vw_applicants_progress_tbl.Where(a => a.app_ctrl_nbr == dt.app_ctrl_nbr).FirstOrDefault();
                if (email_type == "1")
                {

                }
                else if (email_type == "2")
                {
                    if (app.quali_onlineexam == true)
                    {
                        throw new Exception("You already qualify this applicant for exam!");
                    }
                }
                else if (email_type == "3")
                {
                    if (app.quali_onlineexam == false)

                    {
                        throw new Exception("The applicant has not been shortlisted yet to proceed to the exam!");
                    }
                    if (IFNULL(app.email_aknowldge_regret_dttm,"") != "")
                    {
                        throw new Exception("The applicant has already been notified of disqualification from the exam!");
                    }
                }
                else if (email_type == "4")
                {
                    if (app.congratulatory == true)
                    {
                        throw new Exception("The applicant has already received a congratulatory email!");
                    }
                    if (IFNULL(app.email_aknowldge_regret_dttm,"") != "")
                    {
                        throw new Exception("The applicant has already been notified of disqualification from the exam!");
                    }
                }
                else if (email_type == "5")
                {
                    if (app.quali_hrmpsb == false)
                    {
                        throw new Exception("The applicant has not been shortlisted yet to proceed to the exam!");
                    }
                }
                else if (email_type == "6")
                {
                    if (app.top5examinees == true)
                    {
                        throw new Exception("The applicant has already been shortlisted as one of the top 5 examinees.!");
                    }
                    if (app.quali_hrmpsb == true)
                    {
                        throw new Exception("The applicant has already been shortlisted for HRMPSB Screening!");
                    }
                }
                else if (email_type == "7")
                {
                    if (IFNULL(dt.email_regret_dttm,"") != "")
                    {
                        throw new Exception("The applicant has already been sent a regret letter!");
                    }
                }
                var email_settup = db.sp_send_email_notification(app.email_add, dt.empl_id, dt.app_ctrl_nbr, dt.hiring_period, email_type).FirstOrDefault();

                return JSON2(new { email_settup, message = "Applicants is successfully notified!", icon = "success" }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                string message = e.Message;
                return Json(new { message = message, icon = "error" }, JsonRequestBehavior.AllowGet);
            }
        }
        public ActionResult sendEmailNotification2(sp_comparative_assessment_list_container dt, string email_type, sp_send_email_notification_Result email_settup)
        {
            db.Database.CommandTimeout = Int32.MaxValue;
            CheckSession();
            var email_subject = "";


            var user_id = Session["user_id"].ToString();
            var mi = "";
            DateTime dttm = DateTime.Now;
            try
            {

                if (dt.middle_name == "")
                {
                    mi = "";
                }
                else
                {
                    mi = dt.middle_name.Substring(0, 1);
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

                    email_subject = "email evaluated but not qualified to proceed to online exam";

                }

                else if (email_type == "3")
                {
                    var appreview = db.applicants_review_tbl.Where(a => a.app_ctrl_nbr == dt.app_ctrl_nbr).FirstOrDefault();
                    appreview.email_noti_exam_dttm = dttm;
                    appreview.email_noti_exam_by = user_id;
                    email_subject = "Qualify for examination";
                }
                else if (email_type == "4")
                {
                    var appreview = db.applicants_review_tbl.Where(a => a.app_ctrl_nbr == dt.app_ctrl_nbr).FirstOrDefault();
                    appreview.email_regret_dttm = dttm;
                    appreview.email_regret_by = user_id;
                    email_subject = "Regret letter to inform that another candidate was choosen for the position";
                }
                else if (email_type == "5")
                {
                    var appreview = db.applicants_review_tbl.Where(a => a.app_ctrl_nbr == dt.app_ctrl_nbr).FirstOrDefault();
                    appreview.email_noti_hrmpsb_dttm = dttm;
                    appreview.email_noti_hrmpsb_by = user_id;
                    email_subject = "Qualify for HRMPSB Screening";
                }
                else if (email_type == "6")
                {
                    var appreview = db.applicants_review_tbl.Where(a => a.app_ctrl_nbr == dt.app_ctrl_nbr).FirstOrDefault();
                    appreview.email_notintop5_dttm = dttm;
                    appreview.email_notintop5_by = user_id;
                    email_subject = "Not in top 5 examinees";
                }
                else if (email_type == "7")
                {
                    var appreview = db.applicants_review_tbl.Where(a => a.app_ctrl_nbr == dt.app_ctrl_nbr).FirstOrDefault();
                    appreview.email_congratulatory_dttm = dttm;
                    appreview.email_congratulatory_by = user_id;
                    email_subject = "Congratulatory letter";

                    var app = db.applicant_qualified_progress_tbl.Where(a => a.app_ctrl_nbr == dt.app_ctrl_nbr).FirstOrDefault();

                    if (app == null)
                    {
                        applicant_qualified_progress_tbl prog = new applicant_qualified_progress_tbl();
                        prog.app_ctrl_nbr = dt.app_ctrl_nbr;
                        prog.congratulatory = true;
                        prog.congratulatory_dttm = dttm;
                        prog.congratulatory_by = user_id;
                        //prog.congratulatory = false;
                        db.applicant_qualified_progress_tbl.Add(prog);
                    }
                    else
                    {
                        app.congratulatory = true;
                        app.congratulatory_dttm = dttm;
                        app.congratulatory_by = user_id;
                    }
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

                var empl_id = user_id.Substring(1, user_id.Length - 1);
                var personnelname = db.vw_personnelnames_tbl_RCT.Where(a => a.empl_id == empl_id).FirstOrDefault();
                var employee_name = personnelname.employee_name;


                return JSON2(new { employee_name, message = "Applicants is successfully notified!", icon = "success", se }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                string message = e.Message;
                return Json(new { message = message, icon = "error" }, JsonRequestBehavior.AllowGet);
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