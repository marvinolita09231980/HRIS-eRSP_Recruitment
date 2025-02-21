using HRIS_eRSP_Recruitment.Common_Code;
using HRIS_eRSP_Recruitment.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity.Validation;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Mvc;

namespace HRIS_eRSP_Recruitment.Controllers
{
    [System.Runtime.InteropServices.GuidAttribute("200A09D0-93C5-4FF7-9C76-DB8310F38983")]
    public class cApplicantsInfoController : CustomController
    {
        string urlname = "cApplicantsInfo";
        HRIS_APLEntities db = new HRIS_APLEntities();
        HRIS_RCTEntities db2 = new HRIS_RCTEntities();
        User_Menu um = new User_Menu();
        RCT_Common rct = new RCT_Common();
        // GET: cApplicantsInfo
        public ActionResult Index()
        {

            if (Session["user_id"] == null)
            {
                return RedirectToAction("Index", "Login");
            }
            if (Session["url_name"] != null)
            {
                if (Session["url_name"].ToString() != urlname)
                {
                    return RedirectToAction("Index", "cMainPage");
                }
            }
            else
            {
                return RedirectToAction("Index", "cMainPage");
            }


                return View();
            
        }

      
        // GET: cJob_Application


        public ActionResult Initialize(string year, string month)
        {
            db.Database.CommandTimeout = Int32.MaxValue;
            db2.Database.CommandTimeout = Int32.MaxValue;
            CheckSession();
            um = rct.GetAllowAccess();
            try
            {
                //var list = db2.sp_applicant_tbl_list(month, year).ToList(); 

                var pageTitle = Session["page_title"];

                return JSON(new { message = fetch.success, icon = icon.success, pageTitle, um}, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                var message = DbEntityValidationExceptionError(e);

                return JSON(new { message = message ,icon = icon.error}, JsonRequestBehavior.AllowGet);
            }

        }
        

        public void assignToModel()
        {
            db.Database.CommandTimeout = Int32.MaxValue;
            db2.Database.CommandTimeout = Int32.MaxValue;
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
      
        //public ActionResult GetApplicationNbr()
        //{
        //    var message = "";
        //    try
        //    {
        //        var app_nbr = db2.sp_autogen_application_nbr().FirstOrDefault();
        //        message = "success";
        //        return Json(new { message = message, app_nbr }, JsonRequestBehavior.AllowGet);
        //    }
        //    catch (DbEntityValidationException e)
        //    {
        //        message = DbEntityValidationExceptionError(e);

        //        return Json(new { message = message }, JsonRequestBehavior.AllowGet);
        //    }

        //}

        public ActionResult DeleteApplicants(string info_ctrl_nbr,string year, string month)
        {
            db.Database.CommandTimeout = Int32.MaxValue;
            db2.Database.CommandTimeout = Int32.MaxValue;
            CheckSession();
            try
            {
              var returndata = db2.sp_delete_applicantsInfo(info_ctrl_nbr, month,year).ToList();
              return JSON(new { message = delete.success, icon = icon.success, returndata }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return Json(new { message = DbEntityValidationExceptionError(e),icon=icon.error }, JsonRequestBehavior.AllowGet);
            }
        }

        public ActionResult UpdateDataFrom(string info_ctrl_nbr, string empl_id, string source, string year, string month)
        {
            db.Database.CommandTimeout = Int32.MaxValue;
            db2.Database.CommandTimeout = Int32.MaxValue;
            CheckSession();
            var user_id = Session["user_id"].ToString();
            try
            {
                var returnUpdate = db2.sp_update_applicants_tbl(info_ctrl_nbr, empl_id, user_id, source).FirstOrDefault();
                var list = db2.sp_applicant_tbl_list(month, year).ToList();
                return JSON(new { message = " ", icon = icon.success, returnUpdate, list}, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {   
                return Json(new { message = DbEntityValidationExceptionError(e), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }
        public ActionResult UpdateDataFrom2(string info_ctrl_nbr, string empl_id, string source, string year, string month)
        {
            db.Database.CommandTimeout = Int32.MaxValue;
            db2.Database.CommandTimeout = Int32.MaxValue;
            CheckSession();
            var user_id = Session["user_id"].ToString();
            try
            {
                var returnUpdate = db2.sp_update_applicants_tbl(info_ctrl_nbr, empl_id, user_id, source).FirstOrDefault();
                var list = db2.sp_applicant_tbl_list(month, year).ToList();
                return JSON(new { message = " ", icon = icon.success, returnUpdate, list}, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return Json(new { message = DbEntityValidationExceptionError(e), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }

        public ActionResult DeleteAppDetails(string info_ctrl_nbr,int seq,int dtl)
        {
            db.Database.CommandTimeout = Int32.MaxValue;
            db2.Database.CommandTimeout = Int32.MaxValue;
            CheckSession();
            var message = "";
            
            try
            {
                if(dtl == 1)
                {
                    var dt = db2.applicant_educ_tbl.Where(a => a.info_ctrl_nbr == info_ctrl_nbr && a.seq_no == seq).FirstOrDefault();
                    db2.applicant_educ_tbl.Remove(dt);
                    db2.SaveChanges();
                }
                else if (dtl == 2)
                {
                    var dt = db2.applicant_eligibilty_tbl.Where(a => a.info_ctrl_nbr == info_ctrl_nbr && a.seq_no == seq).FirstOrDefault();
                    db2.applicant_eligibilty_tbl.Remove(dt);
                    db2.SaveChanges();
                }
                else if (dtl == 3)
                {
                    var dt = db2.applicant_learnanddevt_tbl.Where(a => a.info_ctrl_nbr == info_ctrl_nbr && a.seq_no == seq).FirstOrDefault();
                    db2.applicant_learnanddevt_tbl.Remove(dt);
                    db2.SaveChanges();
                }
                else if (dtl == 4)
                {
                    var dt = db2.applicant_workexprnce_tbl.Where(a => a.info_ctrl_nbr == info_ctrl_nbr && a.seq_no == seq).FirstOrDefault();
                    db2.applicant_workexprnce_tbl.Remove(dt);
                    db2.SaveChanges();
                }
                message = "success";
              return JSON(new { message }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {

                message = DbEntityValidationExceptionError(e);
                return JSON(new { message = message }, JsonRequestBehavior.AllowGet);
            }
        }
        public ActionResult getApplicantList(string month,string year)
        {
            db.Database.CommandTimeout = Int32.MaxValue;
            db2.Database.CommandTimeout = Int32.MaxValue;
            CheckSession();
            try
            {
                var list = db2.sp_applicant_tbl_list(month,year).ToList();
                var next_infoctrlnbr = db2.sp_autogen_ctrl_nbr("applicants_tbl", 6, "info_ctrl_nbr").FirstOrDefault();
                return JSON(new { message = fetch.success, icon = icon.success, list, next_infoctrlnbr}, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return Json(new { message = DbEntityValidationExceptionError(e), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }


        
        public ActionResult addToReviewTable(string info_ctrl_nbr, items item)
        {
            db.Database.CommandTimeout = Int32.MaxValue;
            db2.Database.CommandTimeout = Int32.MaxValue;
            CheckSession();
            var user = Session["user_id"].ToString();
            var message = "";
            var icn = "";
            var employment_type = item.employment_type;
            var budget_code = item.budget_code;
            var position_code = item.position_code;
           try
            {
                var app_exist = db2.applicants_review_tbl.Where(a => a.info_ctrl_nbr == info_ctrl_nbr
                                                                  && a.item_no == item.item_no && a.budget_code == item.budget_code && a.employment_type == item.employment_type).FirstOrDefault();


               if (app_exist == null)
               {
                   applicants_review_tbl app = new applicants_review_tbl();
                   var app_ctrl_nbr = db2.sp_autogen_ctrl_nbr("applicants_review_tbl", 6, "app_ctrl_nbr").FirstOrDefault();
                   app.app_ctrl_nbr = app_ctrl_nbr;
                   app.info_ctrl_nbr = info_ctrl_nbr;
                   app.item_no = item.item_no;
                   app.position_code = item.position_code;
                   app.department_code = item.department_code;
                   app.employment_type = item.employment_type;
                   app.app_status = "1";
                   app.budget_code = item.budget_code;
                   app.approval_id = "";
                   app.created_dttm = DateTime.Now;
                   app.created_by_user = user;
                   app.updated_dttm = Convert.ToDateTime("1900-01-01");
                   app.updated_by_user = "";
                   app.hiring_period = item.ctrl_nbr;
                   app.email_aknowldge_regret_dttm= null;
                   app.email_aknowldge_regret_by  ="";
                   app.email_regret_dttm          = null;
                   app.email_regret_by            ="";
                   app.email_noti_exam_dttm       = null;
                   app.email_noti_exam_by         ="";
                   app.email_notintop5_dttm       =null;
                   app.email_notintop5_by         ="";
                   app.email_noti_hrmpsb_dttm     =null;
                   app.email_noti_hrmpsb_by       ="";
                   app.email_congratulatory_dttm  =null;
                   app.email_congratulatory_by    ="";
                   app.email_aknowldge_dttm       =null;
                   app.email_aknowldge_by         ="";
                   app.exam_id = null;
                   db2.applicants_review_tbl.Add(app);
                   db2.SaveChanges();
                   message = insert.success;
                   icn = icon.success;
               }
               else
               {
                   message = "Applicants already in review ";
                   icn = icon.error;
               }
                return JSON(new { message,icn}, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return Json(new { message = DbEntityValidationExceptionError(e), icn = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }

        //public ActionResult addToReviewTable(applicants_review_tbl app, items item)
        //{
        //    CheckSession();
        //    var user = Session["user_id"].ToString();
        //    var message = "";
        //    var icn = "";
        //    var employment_type = item.employment_type;
        //    var budget_code = item.budget_code;
        //    var position_code = item.position_code;
        //    try
        //    {
        //        var app_exist = db2.applicants_review_tbl.Where(a => a.info_ctrl_nbr == app.info_ctrl_nbr
        //                                                          && a.item_no == item.item_no).FirstOrDefault();



        //        if (app_exist == null)
        //        {

        //            var app_ctrl_nbr = db2.sp_autogen_ctrl_nbr("applicants_review_tbl", 6, "app_ctrl_nbr").FirstOrDefault();
        //            app.app_ctrl_nbr = app_ctrl_nbr;
        //            app.item_no = item.item_no;
        //            app.position_code = item.position_code;
        //            app.department_code = item.department_code;
        //            app.budget_code = item.budget_code;
        //            app.app_status = "1";
        //            app.employment_type = item.employment_type;
        //            app.created_by_user = user;
        //            app.created_dttm = DateTime.Now;
        //            db2.applicants_review_tbl.Add(app);
        //            db2.SaveChanges();
        //            message = insert.success;
        //            icn = icon.success;
        //        }
        //        else
        //        {
        //            message = "Applicants already in review ";
        //            icn = icon.error;
        //        }
        //        return JSON(new { message, icn }, JsonRequestBehavior.AllowGet);
        //    }
        //    catch (DbEntityValidationException e)
        //    {
        //        return Json(new { message = DbEntityValidationExceptionError(e), icn = icon.error }, JsonRequestBehavior.AllowGet);
        //    }
        //}
        public ActionResult getBudgetYear(string employment_type)
        {
            db.Database.CommandTimeout = Int32.MaxValue;
            db2.Database.CommandTimeout = Int32.MaxValue;
            CheckSession();
            try
             {
                 var budget_year = db2.sp_budgetyears_tbl_combolist1_RCT(employment_type).ToList();
                 return JSON(new { message = update.success, icon = icon.success, budget_year}, JsonRequestBehavior.AllowGet);

             }
             catch (DbEntityValidationException e)
             {
                 return Json(new { message = DbEntityValidationExceptionError(e), icon = icon.error }, JsonRequestBehavior.AllowGet);
             }
        }
        public ActionResult getItems(string ctrl_nbr)
        {
            db.Database.CommandTimeout = Int32.MaxValue;
            db2.Database.CommandTimeout = Int32.MaxValue;

            CheckSession();
            try
            {

                var items = db.available_item_tbl.Where(a => a.ctrl_no == ctrl_nbr).ToList();
                return JSON(new { message = update.success, icon = icon.success, items }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return Json(new { message = DbEntityValidationExceptionError(e), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }
        public ActionResult Save_Application(string mo, string yr,string savebtn, applicants_tbl app, string info_ctrl_nbr_disp)
        {
            db.Database.CommandTimeout = Int32.MaxValue;
            db2.Database.CommandTimeout = Int32.MaxValue;
            CheckSession();
            var user_id = Session["user_id"].ToString();
            var info = info_ctrl_nbr_disp.ToString().Split(new char[] { '-' });
            var applied_year = info[0];
            var info_ctrl_nbr = info[1];
            try
            {
               
                if (savebtn == "edit")
                {
                    var edt = db2.applicants_tbl.Where(a => a.info_ctrl_nbr == info_ctrl_nbr).FirstOrDefault();
                    if(edt != null)
                    {
                        edt.app_address = app.app_address;
                        edt.applied_dttm = app.applied_dttm;
                        edt.birth_date = app.birth_date;
                        edt.civil_status = app.civil_status;
                        edt.first_name = app.first_name;
                        edt.gender = app.gender;
                        edt.last_name = app.last_name;
                        edt.middle_name = app.middle_name;
                        edt.mobile_number = app.mobile_number;
                        edt.email_add = app.email_add;
                        edt.updated_by_user = user_id;
                        edt.updated_dttm = DateTime.Now;
                    }
                }
                else
                {
                        app.info_ctrl_nbr = info_ctrl_nbr;
                        app.is_employee = false;
                        app.created_by_user = user_id;
                        app.created_dttm = DateTime.Now;
                        app.updated_by_user = "";
                        app.updated_dttm = Convert.ToDateTime("1900-01-01 00:00:00");
                        db2.applicants_tbl.Add(app);
                }


                db2.SaveChanges();
                var list = db2.sp_applicant_tbl_list(mo, yr).ToList(); 
                
                return JSON(new { message = saved.success, icon = icon.success, list}, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {

                return Json(new { message = DbEntityValidationExceptionError(e), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }
        public ActionResult checkApplicantsReview(string info_ctrl_nbr, string ctrl_nbr)
        {
            db.Database.CommandTimeout = Int32.MaxValue;
            db2.Database.CommandTimeout = Int32.MaxValue;

            var user_id = Session["user_id"].ToString();
            var message = "";
            try
            {
                var data_exist  = db2.applicants_review_tbl.Where(a => a.info_ctrl_nbr == info_ctrl_nbr && a.hiring_period == ctrl_nbr).ToList();

                //DatafrmPDS == "Data successfully inserted"


                message = "Data from PDS successfully inserted";

                return JSON(new { message, icon = icon.success, data_exist }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException exp)
            {

                message = DbEntityValidationExceptionError(exp);
                return Json(new { message = message }, JsonRequestBehavior.AllowGet);
            }

        }
        public ActionResult FetchFromPDS(string empl_id, string info_ctrl_nbr)
        {
            db.Database.CommandTimeout = Int32.MaxValue;
            db2.Database.CommandTimeout = Int32.MaxValue;
            CheckSession();
            var user_id = Session["user_id"].ToString();
            var message = "";
            try
            {
               var DatafrmPDS = db2.sp_current_empl_data2(empl_id, info_ctrl_nbr, user_id).ToList();
                
                //DatafrmPDS == "Data successfully inserted"


                message = "Data from PDS successfully inserted";

                return JSON(new { message, icon = icon.success, DatafrmPDS }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException exp)
            {

                message = DbEntityValidationExceptionError(exp);
                return Json(new { message = message }, JsonRequestBehavior.AllowGet);
            }

        }
        public ActionResult FetchFromPDS2(string empl_id, string info_ctrl_nbr)
        {
            db.Database.CommandTimeout = Int32.MaxValue;
            db2.Database.CommandTimeout = Int32.MaxValue;
            CheckSession();
            var user_id = Session["user_id"].ToString();
            var message = "";
            try
            {
                var DatafrmPDS = db2.sp_update_apl_data_from_pds(empl_id, info_ctrl_nbr, user_id).ToList();

                //DatafrmPDS == "Data successfully inserted"


                message = "Data from PDS successfully inserted";

                return JSON(new { message, icon = icon.success, DatafrmPDS }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException exp)
            {

                message = DbEntityValidationExceptionError(exp);
                return Json(new { message = message }, JsonRequestBehavior.AllowGet);
            }

        }
        public ActionResult FindPersonnel(string empl_id)
        {
            db.Database.CommandTimeout = Int32.MaxValue;
            db2.Database.CommandTimeout = Int32.MaxValue;
            CheckSession();
            var message = "";
            try
            {
                var person = db2.sp_if_employee_exist(empl_id).FirstOrDefault();
                return JSON(new { message = "success", person, icon = "success" }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException exp)
            {

                message = DbEntityValidationExceptionError(exp);
                return Json(new { message = message, icon="error"}, JsonRequestBehavior.AllowGet);
            }

        }
        public ActionResult GetApplicationNbr()
        {
            db.Database.CommandTimeout = Int32.MaxValue;
            db2.Database.CommandTimeout = Int32.MaxValue;
            CheckSession();
            try
            {
                var info_ctrl_nbr = db2.sp_autogen_ctrl_nbr("applicants_tbl", 6, "info_ctrl_nbr").FirstOrDefault();

                return JSON(new { icon = icon.success, info_ctrl_nbr }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return Json(new { message = DbEntityValidationExceptionError(e), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }

        }
        public ActionResult InitializeDetails(string info_ctrl_nbr)
        {
            db.Database.CommandTimeout = Int32.MaxValue;
            db2.Database.CommandTimeout = Int32.MaxValue;
            CheckSession();
            try
            {
                var applicant = db2.vw_applicant_tbl_list.Where(a => a.info_ctrl_nbr == info_ctrl_nbr).FirstOrDefault();
                var educ_type = db2.vw_applicant_educ_type_tbl.ToList();
                var salgrade = db2.vw_salary_grade_list;
                var education = db2.vw_applicant_educ_tbl_list.Where(a => a.info_ctrl_nbr == info_ctrl_nbr).ToList();
                var training = db2.vw_applicant_learnanddevt_tbl_list.Where(a => a.info_ctrl_nbr == info_ctrl_nbr).ToList();
                var eligibility = db2.vw_applicant_eligibility_tbl_list.Where(a => a.info_ctrl_nbr == info_ctrl_nbr).ToList();
                var experience = db2.vw_applicant_workexprnce_tbl_list.Where(a => a.info_ctrl_nbr == info_ctrl_nbr).ToList();
                return JSON(new { message = fetch.success, icon = icon.success, education, training, eligibility, experience, educ_type, salgrade }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return Json(new { message = DbEntityValidationExceptionError(e) }, JsonRequestBehavior.AllowGet);
            }
        }



        //EDUCATION DETAILS*************************************************START
        public ActionResult DeleteEduc(string info_ctrl_nbr, int seq_no)
        {
            db.Database.CommandTimeout = Int32.MaxValue;
            db2.Database.CommandTimeout = Int32.MaxValue;
            CheckSession();
            try
            {
                var edu = db2.applicant_educ_tbl.Where(a => a.info_ctrl_nbr == info_ctrl_nbr && a.seq_no == seq_no).FirstOrDefault();
                db2.applicant_educ_tbl.Remove(edu);
                db2.SaveChanges();
                var returndata = db2.vw_applicant_educ_tbl_list.Where(a => a.info_ctrl_nbr == info_ctrl_nbr).ToList();
                return JSON(new { message = delete.success, icon = icon.success, returndata }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException exp)
            {
                return Json(new { message = DbEntityValidationExceptionError(exp), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }
        public ActionResult AddEduc(applicant_educ_tbl ed, string info_ctrl_nbr)
        {
            db.Database.CommandTimeout = Int32.MaxValue;
            db2.Database.CommandTimeout = Int32.MaxValue;
            CheckSession();
            try
            {
                var seq = db2.sp_getlast_sequence("applicant_educ_tbl").FirstOrDefault();
                ed.info_ctrl_nbr = info_ctrl_nbr;
                ed.seq_no = Convert.ToInt32(seq);
                db2.applicant_educ_tbl.Add(ed);
                db2.SaveChanges();
                var returndata = db2.vw_applicant_educ_tbl_list.Where(a => a.info_ctrl_nbr == info_ctrl_nbr).ToList();
                return JSON(new { message = insert.success, icon = icon.success, returndata }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException exp)
            {
                return Json(new { message = DbEntityValidationExceptionError(exp), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }
        public ActionResult EditEduc(applicant_educ_tbl ed, string info_ctrl_nbr, int seq_no)
        {
            db.Database.CommandTimeout = Int32.MaxValue;
            db2.Database.CommandTimeout = Int32.MaxValue;
            CheckSession();
            try
            {
                var edu = db2.applicant_educ_tbl.Where(a => a.info_ctrl_nbr == info_ctrl_nbr && a.seq_no == seq_no).FirstOrDefault();
                edu.educ_type = ed.educ_type;
                edu.school_name = ed.school_name;
                edu.basic_educ_deg = ed.basic_educ_deg;
                edu.period_from = ed.period_from;
                edu.period_to = ed.period_to;
                edu.highest_lvl_earned = ed.highest_lvl_earned;
                edu.year_graduated = ed.year_graduated;
                edu.schlr_acdmic_rcvd = ed.schlr_acdmic_rcvd;
                db2.SaveChanges();
                var returndata = db2.vw_applicant_educ_tbl_list.Where(a => a.info_ctrl_nbr == info_ctrl_nbr).ToList();
                return JSON(new { message = update.success, icon = icon.success, returndata }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException exp)
            {
                return Json(new { message = DbEntityValidationExceptionError(exp), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }
        //EDUCATION DETAILS*************************************************END


        //ELIGIBILITY DETAILS***********************************************START
        public ActionResult EditElig(applicant_eligibilty_tbl el, string info_ctrl_nbr, int seq_no)
        {
            db.Database.CommandTimeout = Int32.MaxValue;
            db2.Database.CommandTimeout = Int32.MaxValue;
            CheckSession();
            try
            {
                var eli = db2.applicant_eligibilty_tbl.Where(a => a.info_ctrl_nbr == info_ctrl_nbr && a.seq_no == seq_no).FirstOrDefault();
                eli.cscsrvc_ra1080 = el.cscsrvc_ra1080;
                eli.rating = el.rating;
                eli.examination_date = el.examination_date;
                eli.examination_place = el.examination_place;
                eli.number = el.number;
                eli.validity_date = el.validity_date;
                db2.SaveChanges();
                var returndata = db2.vw_applicant_eligibility_tbl_list.Where(a => a.info_ctrl_nbr == info_ctrl_nbr).ToList();
                return JSON(new { message = update.success, icon = icon.success, returndata }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException exp)
            {
                return Json(new { message = DbEntityValidationExceptionError(exp), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }
        public ActionResult AddElig(applicant_eligibilty_tbl el, string info_ctrl_nbr)
        {
            db.Database.CommandTimeout = Int32.MaxValue;
            db2.Database.CommandTimeout = Int32.MaxValue;
            CheckSession();
            try
            {
                var seq = db2.sp_getlast_sequence("applicant_eligibilty_tbl").FirstOrDefault();
                el.info_ctrl_nbr = info_ctrl_nbr;
                el.seq_no = Convert.ToInt32(seq);
                db2.applicant_eligibilty_tbl.Add(el);
                db2.SaveChanges();
                var returndata = db2.vw_applicant_eligibility_tbl_list.Where(a => a.info_ctrl_nbr == info_ctrl_nbr).ToList();
                return JSON(new { message = insert.success, icon = icon.success, returndata }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException exp)
            {
                return Json(new { message = DbEntityValidationExceptionError(exp), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }
        public ActionResult DeleteElig(string info_ctrl_nbr, int seq_no)
        {
            db.Database.CommandTimeout = Int32.MaxValue;
            db2.Database.CommandTimeout = Int32.MaxValue;
            CheckSession();
            try
            {
                var eli = db2.applicant_eligibilty_tbl.Where(a => a.info_ctrl_nbr == info_ctrl_nbr && a.seq_no == seq_no).FirstOrDefault();
                db2.applicant_eligibilty_tbl.Remove(eli);
                db2.SaveChanges();
                var returndata = db2.vw_applicant_eligibility_tbl_list.Where(a => a.info_ctrl_nbr == info_ctrl_nbr).ToList();
                return JSON(new { message = delete.success, icon = icon.success, returndata }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException exp)
            {
                return Json(new { message = DbEntityValidationExceptionError(exp), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }
        //ELIGIBILITY DETAILS***********************************************END

        //WORK EXPERIENCE DETAILS*******************************************START

        public ActionResult EditWexp(applicant_workexprnce_tbl wx, string info_ctrl_nbr, int seq_no,bool gov)
        {
            db.Database.CommandTimeout = Int32.MaxValue;
            db2.Database.CommandTimeout = Int32.MaxValue;
            CheckSession();
            
            try
            {
                var wex = db2.applicant_workexprnce_tbl.Where(a => a.info_ctrl_nbr == info_ctrl_nbr && a.seq_no == seq_no).FirstOrDefault();
                wex.workexp_from = wx.workexp_from;
                wex.workexp_to = wx.workexp_to;
                wex.position_title = wx.position_title;
                wex.dept_agncy_offc_co = wx.dept_agncy_offc_co;
                wex.monthly_salary = wx.monthly_salary;
                wex.salary_job_grade = wx.salary_job_grade;
                wex.appt_status = wx.appt_status;
                wex.gov_srvc = gov;
                db2.SaveChanges();
                var returndata = db2.vw_applicant_workexprnce_tbl_list.Where(a => a.info_ctrl_nbr == info_ctrl_nbr).ToList();
                return JSON(new { message = update.success, icon = icon.success, returndata }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException exp)
            {
                return Json(new { message = DbEntityValidationExceptionError(exp), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }
        public ActionResult AddWexp(applicant_workexprnce_tbl wx, string info_ctrl_nbr,bool gov)
        {
            db.Database.CommandTimeout = Int32.MaxValue;
            db2.Database.CommandTimeout = Int32.MaxValue;
            CheckSession();
            try
            {
                var seq = db2.sp_getlast_sequence("applicant_workexprnce_tbl").FirstOrDefault();
                wx.info_ctrl_nbr = info_ctrl_nbr;
                wx.seq_no = Convert.ToInt32(seq);
                wx.gov_srvc = gov;
                db2.applicant_workexprnce_tbl.Add(wx);
                db2.SaveChanges();
                var returndata = db2.vw_applicant_workexprnce_tbl_list.Where(a => a.info_ctrl_nbr == info_ctrl_nbr).ToList();
                return JSON(new { message = insert.success, icon = icon.success, returndata }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException exp)
            {
                return Json(new { message = DbEntityValidationExceptionError(exp), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }
        public ActionResult DeleteWexp(string info_ctrl_nbr, int seq_no)
        {
            db.Database.CommandTimeout = Int32.MaxValue;
            db2.Database.CommandTimeout = Int32.MaxValue;
            CheckSession();
            try
            {
                var wxp = db2.applicant_workexprnce_tbl.Where(a => a.info_ctrl_nbr == info_ctrl_nbr && a.seq_no == seq_no).FirstOrDefault();
                db2.applicant_workexprnce_tbl.Remove(wxp);
                db2.SaveChanges();
                var returndata = db2.vw_applicant_workexprnce_tbl_list.Where(a => a.info_ctrl_nbr == info_ctrl_nbr).ToList();
                return JSON(new { message = delete.success, icon = icon.success, returndata }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException exp)
            {
                return Json(new { message = DbEntityValidationExceptionError(exp), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }

        //WORK EXPERIENCE DETAILS*******************************************END




        //TRAINING DETAILS**************************************************START
        public ActionResult EditLnD(applicant_learnanddevt_tbl ld, string info_ctrl_nbr, int seq_no)
        {
            db.Database.CommandTimeout = Int32.MaxValue;
            db2.Database.CommandTimeout = Int32.MaxValue;
            CheckSession();
            try
            {
                var lnd = db2.applicant_learnanddevt_tbl.Where(a => a.info_ctrl_nbr == info_ctrl_nbr && a.seq_no == seq_no).FirstOrDefault();
                lnd.learn_devt_title = ld.learn_devt_title;
                lnd.learn_devt_from = ld.learn_devt_from;
                lnd.learn_devt_to = ld.learn_devt_to;
                lnd.no_of_hrs = ld.no_of_hrs;
                lnd.learn_devt_type = ld.learn_devt_type;
                lnd.conducted_by = ld.conducted_by;
                db2.SaveChanges();
                var returndata = db2.vw_applicant_learnanddevt_tbl_list.Where(a => a.info_ctrl_nbr == info_ctrl_nbr).ToList();
                return JSON(new { message = update.success, icon = icon.success, returndata }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException exp)
            {
                return Json(new { message = DbEntityValidationExceptionError(exp), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }
        public ActionResult AddLnD(applicant_learnanddevt_tbl ld, string info_ctrl_nbr)
        {
            db.Database.CommandTimeout = Int32.MaxValue;
            db2.Database.CommandTimeout = Int32.MaxValue;
            CheckSession();
            try
            {
                var seq = db2.sp_getlast_sequence("applicant_learnanddevt_tbl").FirstOrDefault();
                ld.seq_no = Convert.ToInt32(seq);
                ld.info_ctrl_nbr = info_ctrl_nbr;
                db2.applicant_learnanddevt_tbl.Add(ld);
                db2.SaveChanges();
                var returndata = db2.vw_applicant_learnanddevt_tbl_list.Where(a => a.info_ctrl_nbr == info_ctrl_nbr).ToList();
                return JSON(new { message = insert.success, icon = icon.success, returndata }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException exp)
            {
                return Json(new { message = DbEntityValidationExceptionError(exp), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }
        public ActionResult DeleteLnD(string info_ctrl_nbr, int seq_no)
        {
            db.Database.CommandTimeout = Int32.MaxValue;
            db2.Database.CommandTimeout = Int32.MaxValue;
            CheckSession();
            try
            {
                var lnd = db2.applicant_learnanddevt_tbl.Where(a => a.info_ctrl_nbr == info_ctrl_nbr && a.seq_no == seq_no).FirstOrDefault();
                db2.applicant_learnanddevt_tbl.Remove(lnd);
                db2.SaveChanges();
                var returndata = db2.vw_applicant_learnanddevt_tbl_list.Where(a => a.info_ctrl_nbr == info_ctrl_nbr).ToList();
                return JSON(new { message = delete.success, icon = icon.success, returndata }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException exp)
            {
                return Json(new { message = DbEntityValidationExceptionError(exp), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }


        //TRAINING DETAILS**************************************************END

        public ActionResult getNewInfoCtrlNbr()
        {
            db.Database.CommandTimeout = Int32.MaxValue;
            db2.Database.CommandTimeout = Int32.MaxValue;
            CheckSession();
            try
            {
                var next_infoctrlnbr = db2.sp_autogen_ctrl_nbr("applicants_tbl", 6, "info_ctrl_nbr").FirstOrDefault();
                return JSON(new { message = delete.success, icon = icon.success, next_infoctrlnbr }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException exp)
            {
                return Json(new { message = DbEntityValidationExceptionError(exp), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }
        public ActionResult getEmployeeId(sp_applicant_tbl_list_Result data)
        {
            db.Database.CommandTimeout = Int32.MaxValue;
            db2.Database.CommandTimeout = Int32.MaxValue;
            CheckSession();
            try
            {
                var empl_id_info = db2.sp_get_employee_id_info(data.first_name, data.last_name).ToList();
                return JSON(new { message = delete.success, icon = icon.success, empl_id_info }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException exp)
            {
                return Json(new { message = DbEntityValidationExceptionError(exp), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }
        public ActionResult getApplicantFromAPL(sp_applicant_tbl_list_Result data)
        {
            db.Database.CommandTimeout = Int32.MaxValue;
            db2.Database.CommandTimeout = Int32.MaxValue;
            CheckSession();
            try
            {
                var apl_list = db2.sp_reg_applicant_apl(data.first_name, data.last_name,data.birth_date,data.gender).ToList();
                return JSON(new { message = delete.success, icon = icon.success, apl_list }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException exp)
            {
                return Json(new { message = DbEntityValidationExceptionError(exp), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }
      
        public ActionResult getApplicantFromPDS(string first_name, string last_name, string birth_date, string gender)
        {
            db.Database.CommandTimeout = Int32.MaxValue;
            db2.Database.CommandTimeout = Int32.MaxValue;
            CheckSession();
            try
            {
                var apl_list = db2.sp_reg_applicant_pds(first_name, last_name, birth_date, gender).ToList();
                return JSON(new { message = delete.success, icon = icon.success, apl_list }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException exp)
            {
                return Json(new { message = DbEntityValidationExceptionError(exp), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }
        public ActionResult search_applicant(string search_name, string search_option)
        {
            db.Database.CommandTimeout = Int32.MaxValue;
            db2.Database.CommandTimeout = Int32.MaxValue;
            CheckSession();

            try
            {
                var search_applicant_list = db2.sp_search_applicant_tbl_list(search_name, search_option).ToList();
                return JSON(new { message = "Success", icon = "success", search_applicant_list }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException exp)
            {
                return Json(new { message = DbEntityValidationExceptionError(exp), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }
        public ActionResult searchByLastname(string lastname)
        {
            db.Database.CommandTimeout = Int32.MaxValue;
            db2.Database.CommandTimeout = Int32.MaxValue;
            CheckSession();
            try
            {
                var list = db2.sp_applicant_list_bylastname(lastname).ToList();

                return JSON(new { message = fetch.success, icon = icon.success, list }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return Json(new { message = DbEntityValidationExceptionError(e), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }
        public ActionResult searchByid(string id)
        {
            db.Database.CommandTimeout = Int32.MaxValue;
            db2.Database.CommandTimeout = Int32.MaxValue;
            CheckSession();
            try
            {
                var list = db2.sp_applicant_list_byid(id).ToList();

                return JSON(new { message = fetch.success, icon = icon.success, list }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return Json(new { message = DbEntityValidationExceptionError(e), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }

        public ActionResult getHiringPeriod(string employment_type, string budget_code)
        {
            db.Database.CommandTimeout = Int32.MaxValue;
            db2.Database.CommandTimeout = Int32.MaxValue;

            try
            {
                var hiring_period = db2.psb_hiring_period_tbl.Where(a => a.employment_type == employment_type && a.budget_code == budget_code).ToList();

                return JSON(new { message = fetch.success, icon = icon.success, hiring_period }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return Json(new { message = DbEntityValidationExceptionError(e), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }
        public ActionResult getApplications(string info_ctrl_nbr)
        {
            db.Database.CommandTimeout = Int32.MaxValue;
            db2.Database.CommandTimeout = Int32.MaxValue;

            try
            {
                var applications = (from ar in db2.applicants_review_tbl
                                    join ax in db2.applicants_tbl
                                    on ar.info_ctrl_nbr equals ax.info_ctrl_nbr
                                    join po in db2.vw_positions_tbl
                                    on ar.position_code equals po.position_code
                                    join dp in db2.vw_departments_tbl
                                    on ar.department_code equals dp.department_code
                                    join hr in db2.psb_hiring_period_tbl
                                    on ar.hiring_period equals hr.ctrl_nbr
                                    where ax.info_ctrl_nbr == info_ctrl_nbr
                                    select new
                                    {
                                        ar.app_ctrl_nbr
                                         ,ar.item_no
                                         ,po.position_code
                                         ,po.position_long_title
                                         ,dp.department_code
                                         ,dp.department_name1
                                         ,hr.ctrl_nbr
                                         ,hr.period_descr

                                    }).ToList();

                return JSON(new { message = fetch.success, icon = icon.success, applications }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return Json(new { message = DbEntityValidationExceptionError(e), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }
        
    }
}