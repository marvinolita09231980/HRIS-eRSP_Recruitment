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
    public class cApplicantReviewDetailController : CustomController
    {
        string urlname = "cApplicantReviewDetail";
        HRIS_RCTEntities db2 = new HRIS_RCTEntities();
        User_Menu um = new User_Menu();
        RCT_Common rct = new RCT_Common();
        // GET: cApplicantReviewDetail
        public ActionResult Index(string app_ctrl_nbr)
        {
            Session["qs_app_ctrl_nbr"] = app_ctrl_nbr;
            um = rct.GetAllowAccess();
            if(Session["user_id"] == null)
            {
                return RedirectToAction("Index", "Login");
            }
            if (app_ctrl_nbr == null || app_ctrl_nbr == "")
            {
               return RedirectToAction("Index", "cApplicantsReview");
            }
            else
            {
                Session["app_ctrl_nbr"] = app_ctrl_nbr;
            }
            return View();
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
        public ActionResult Initialize()
        {
            CheckSession();
            var app_ctrl_nbr = rct.appControlNbr("cApplicantReview","Index");
           
            assignToModel();
            try
            {
               

                

                return JSON(new {
                    message = fetch.success,
                    icon = icon.success
                   ,app_ctrl_nbr
                   
                }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return Json(new { message = DbEntityValidationExceptionError(e),icon=icon.error }, JsonRequestBehavior.AllowGet);
            }
        }

        public ActionResult setAppCtrlNbr(string app_ctrl_nbr)
        {
            CheckSession();
            Session["app_ctrl_nbr"] = app_ctrl_nbr;
            try
            {
                return JSON(new{ message = fetch.success,  icon = icon.success}, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return Json(new { message = DbEntityValidationExceptionError(e), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }
        public ActionResult sp_reviewer_screening_list2()
        {
            var app_ctrl_nbr = rct.appControlNbr("cApplicantReview", "Index");
            try
            {
                var D = db2.applicants_review_tbl.Where(a => a.app_ctrl_nbr == app_ctrl_nbr).FirstOrDefault();
                var item_no = D.item_no;
                var employment_type = D.employment_type;
                var budget_code = D.budget_code;
                var hiring_period = D.hiring_period;
                var sp_reviewer_screening_list2 = db2.sp_reviewer_screening_list2(item_no, employment_type, budget_code, hiring_period).ToList();
                return JSON(new
                {
                    message = fetch.success,
                    icon = icon.success
                   ,sp_reviewer_screening_list2

                }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return Json(new { message = DbEntityValidationExceptionError(e), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }
        public ActionResult getReviewer_List()
        {
            var app_ctrl_nbr = rct.appControlNbr("cApplicantReview", "Index");
            try
            {
                var reviewer_list = db2.sp_reviewer_screening_list(app_ctrl_nbr).ToList();


                return JSON(new
                {
                    message = fetch.success,
                    icon = icon.success,
                    reviewer_list

                }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return Json(new { message = DbEntityValidationExceptionError(e), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }

        public ActionResult getDtl_List()
        {
            var app_ctrl_nbr = Session["qs_app_ctrl_nbr"].ToString();
            try
            {
                var dtl_list = db2.sp_psb_applicant_dtl_list(app_ctrl_nbr).ToList();


                return JSON(new
                {
                    message = fetch.success,
                    icon = icon.success,
                    dtl_list

                }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return Json(new { message = DbEntityValidationExceptionError(e), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }

        public ActionResult getDropdownList()
        {
            try
            {
                var eductype = db2.vw_applicant_educ_type_tbl.ToList();
                var salgrade = db2.vw_salary_grade_list.ToList();

                return JSON(new
                {
                    message = fetch.success,
                    icon = icon.success,
                    eductype,
                    salgrade,
                }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return Json(new { message = DbEntityValidationExceptionError(e), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }
        public ActionResult educ_details()
        {
          
            if (Session["user_id"] == null)
            {
                return RedirectToAction("Index", "Login");
            }
            return View();
        }

       
        public ActionResult lnd_details()
        {
            return View();
        }
       
        public ActionResult elig_details()
        {
            return View();
        }
      
        public ActionResult wexp_details()
        {
            return View();
        }

       


        public ActionResult showDetails(string info_ctrl_nbr, int seq_no, int detail)
        {
            CheckSession();
            object obj = new object();
            try
            {
                if (detail == 1)
                {
                    obj = db2.vw_applicant_educ_tbl_list.Where(a => a.seq_no == seq_no && a.info_ctrl_nbr == info_ctrl_nbr).ToList();
                }
                else if (detail == 2)
                {
                    obj = db2.vw_applicant_learnanddevt_tbl_list.Where(a =>  a.info_ctrl_nbr == info_ctrl_nbr && a.psb_selected == true).ToList();
                }
                else if (detail == 3)
                {
                    obj = db2.vw_applicant_workexprnce_tbl_list.Where(a => a.seq_no == seq_no && a.info_ctrl_nbr == info_ctrl_nbr).ToList();
                }
                else if (detail == 4)
                {
                    obj = db2.vw_applicant_eligibility_tbl_list.Where(a => a.seq_no == seq_no && a.info_ctrl_nbr == info_ctrl_nbr).ToList();
                }


                return JSON(new { message = delete.success, icon = icon.success, obj }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException exp)
            {
                return Json(new { message = DbEntityValidationExceptionError(exp), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }
        public ActionResult RelevantTraining(string info_ctrl_nbr)
        {
            CheckSession();
            try
            {
                    var relevant_lnd = db2.vw_applicant_learnanddevt_tbl_list.Where(a => a.info_ctrl_nbr == info_ctrl_nbr && a.psb_selected == true).ToList();

                return JSON(new { message = delete.success, icon = icon.success, relevant_lnd }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException exp)
            {
                return Json(new { message = DbEntityValidationExceptionError(exp), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }
        public ActionResult UnmergeWexp(int ctrl_nbr, string info_ctrl_nbr,string app_ctrl_nbr)
        {
            CheckSession();
            try
            {
                var umg = db2.sp_unmerge_exp(ctrl_nbr, info_ctrl_nbr).FirstOrDefault();
                var experience = db2.sp_applicant_qs_wexp_tbl_list(app_ctrl_nbr).ToList();

                return JSON(new { message = "Applicants is successfully notified!", icon = "success", experience, umg}, JsonRequestBehavior.AllowGet);


            }
            catch (DbEntityValidationException e)
            {
                string message = DbEntityValidationExceptionError(e);
                return Json(new { message = message, icon = "error" }, JsonRequestBehavior.AllowGet);
            }
        }

      
        public ActionResult GetPSBSchedule(string budget_code, string employment_type)
        {
            CheckSession();
            try
            {
                var psb_schedule_list = db2.sp_get_psbschedule_list(budget_code, employment_type).ToList();
                return JSON(new { message = update.success, icon = icon.success, psb_schedule_list }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException exp)
            {
                return Json(new { message = DbEntityValidationExceptionError(exp), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }


        public ActionResult InitializeDetails(string info_ctrl_nbr)
        {
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
        public ActionResult SetHistoryPage()
        {
            CheckSession();
            try
            {
                Session["history_page"] = Request.UrlReferrer.ToString();
                return JSON(new { message = "success" }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                string message = e.Message;
                return Json(new { message = message }, JsonRequestBehavior.AllowGet);
            }
        }
        public ActionResult getEducation(string app_ctrl_nbr)
        {
            CheckSession();
            try
            {
                var education = db2.sp_applicant_qs_educ_tbl_list(app_ctrl_nbr).ToList();
                return JSON(new { message = update.success, icon = icon.success, education }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException exp)
            {
                return Json(new { message = DbEntityValidationExceptionError(exp), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }
        public ActionResult getEligibility(string app_ctrl_nbr)
        {
            CheckSession();
            try
            {
                var eligibility = db2.sp_applicant_qs_elig_tbl_list(app_ctrl_nbr).ToList();
                return JSON(new { message = update.success, icon = icon.success, eligibility }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException exp)
            {
                return Json(new { message = DbEntityValidationExceptionError(exp), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }

        public ActionResult getTraining(string app_ctrl_nbr)
        {
            CheckSession();
            try
            {
                var training = db2.sp_applicant_qs_lnd_tbl_list(app_ctrl_nbr).ToList();
                return JSON(new { message = update.success, icon = icon.success, training }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException exp)
            {
                return Json(new { message = DbEntityValidationExceptionError(exp), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }
        public ActionResult getExperience(string app_ctrl_nbr)
        {
            CheckSession();
            try
            {
                var experience = db2.sp_applicant_qs_wexp_tbl_list(app_ctrl_nbr).ToList();
                return JSON(new { message = update.success, icon = icon.success, experience}, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException exp)
            {
                return Json(new { message = DbEntityValidationExceptionError(exp), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }



        public ActionResult RemoveEducQS(int seqno, string info_ctrl_nbr, string app_ctrl_nbr)
        {
            CheckSession();
            try
            {
                var edu = db2.applicant_educ_tbl.Where(a => a.info_ctrl_nbr == info_ctrl_nbr && a.seq_no == seqno).FirstOrDefault();
                edu.psb_selected = false;
                db2.SaveChanges();
                var dtl_list = db2.sp_psb_applicant_dtl_list(app_ctrl_nbr).ToList();
                return JSON(new { message = update.success, icon = icon.success, dtl_list}, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException exp)
            {
                return Json(new { message = DbEntityValidationExceptionError(exp), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }

        public ActionResult RemoveLndQS(int seqno, string info_ctrl_nbr, string app_ctrl_nbr)
        {
            CheckSession();
            try
            {
                var lnd = db2.applicant_learnanddevt_tbl.Where(a => a.info_ctrl_nbr == info_ctrl_nbr && a.seq_no == seqno).FirstOrDefault();
                lnd.psb_selected = false;
                db2.SaveChanges();
                var dtl_list = db2.sp_psb_applicant_dtl_list(app_ctrl_nbr).ToList();
                var relevant_lnd = db2.vw_applicant_learnanddevt_tbl_list.Where(a => a.info_ctrl_nbr == info_ctrl_nbr && a.psb_selected == true).ToList();
                return JSON(new { message = update.success, icon = icon.success, dtl_list, relevant_lnd }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException exp)
            {
                return Json(new { message = DbEntityValidationExceptionError(exp), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }

        public ActionResult RemoveEligQS(int seqno, string info_ctrl_nbr, string app_ctrl_nbr)
        {
            CheckSession();
            try
            {
                var elig = db2.applicant_eligibilty_tbl.Where(a => a.info_ctrl_nbr == info_ctrl_nbr && a.seq_no == seqno).FirstOrDefault();
                elig.psb_selected = false;
                db2.SaveChanges();
                var dtl_list = db2.sp_psb_applicant_dtl_list(app_ctrl_nbr).ToList();
                return JSON(new { message = update.success, icon = icon.success, dtl_list }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException exp)
            {
                return Json(new { message = DbEntityValidationExceptionError(exp), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }

        public ActionResult RemoveWexpQS(int seqno, string info_ctrl_nbr, string app_ctrl_nbr)
        {
            CheckSession();
            try
            {
                var wexp = db2.applicant_workexprnce_tbl.Where(a => a.info_ctrl_nbr == info_ctrl_nbr && a.seq_no == seqno).FirstOrDefault();
                wexp.psb_selected = false;
                db2.SaveChanges();
                var dtl_list = db2.sp_psb_applicant_dtl_list(app_ctrl_nbr).ToList();
                return JSON(new { message = update.success, icon = icon.success, dtl_list }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException exp)
            {
                return Json(new { message = DbEntityValidationExceptionError(exp), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }
        public ActionResult GetRating(string app_ctrl_nbr)
        {
            CheckSession();
            try
            {
                var rtn = db2.sp_getqsrating(app_ctrl_nbr).FirstOrDefault();
               
                return JSON(new { message = update.success, icon = icon.success, rtn }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException exp)
            {
                return Json(new { message = DbEntityValidationExceptionError(exp), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }
         
        public ActionResult SaveRating(
            string app_ctrl_nbr,
            string psb_ctrl_nbr,
            string educ_rating,
            string wexp_rating,
            string lnd_rating,
            string elig_rating,
            string score_rendered,
            string exam_type_descr,
            string exam_date,
            string ipcr_rating
        )
        {
            CheckSession();
            //psb_ctrl_nbr
            //app_ctrl_nbr
            //user_id
            //psb_cat_subcode
            //psb_pnl_rating
            //rating_dttm
            //updated_dttm
            try
            {

                var user_id = Session["user_id"].ToString();

                var app = db2.applicants_review_tbl.Where(a => a.app_ctrl_nbr == app_ctrl_nbr).FirstOrDefault();
                if(Convert.ToInt32(app.app_status) >= 3)
                {
                    return JSON(new { message ="Cannot add your rating, Application already in comparative assessment", icon = icon.warning }, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    var dbe = db2.psb_pnl_rtg_tbl.Where(a => a.app_ctrl_nbr == app_ctrl_nbr && a.psb_ctrl_nbr == psb_ctrl_nbr && a.psb_cat_subcode == "001").FirstOrDefault();
                    if (dbe != null)
                    {
                        dbe.psb_pnl_rating = Convert.ToDouble(educ_rating);
                        dbe.user_id = user_id;
                        dbe.updated_dttm = DateTime.Now;

                    }
                    else
                    {
                        psb_pnl_rtg_tbl rate = new psb_pnl_rtg_tbl();
                        rate.psb_ctrl_nbr = psb_ctrl_nbr;
                        rate.app_ctrl_nbr = app_ctrl_nbr;
                        rate.user_id = user_id;
                        rate.psb_cat_subcode = "001";
                        rate.psb_pnl_rating = Convert.ToDouble(educ_rating);
                        rate.rating_dttm = DateTime.Now;
                        rate.updated_dttm = Convert.ToDateTime("1900-01-01 00:00:00");
                        db2.psb_pnl_rtg_tbl.Add(rate);

                    }
                    var dbe2 = db2.psb_pnl_rtg_tbl.Where(a => a.app_ctrl_nbr == app_ctrl_nbr && a.psb_ctrl_nbr == psb_ctrl_nbr && a.psb_cat_subcode == "002").FirstOrDefault();
                    if (dbe2 != null)
                    {
                        dbe2.psb_pnl_rating = Convert.ToDouble(lnd_rating);
                        dbe2.user_id = user_id;
                        dbe2.updated_dttm = DateTime.Now;

                    }
                    else
                    {
                        psb_pnl_rtg_tbl rate = new psb_pnl_rtg_tbl();
                        rate.psb_ctrl_nbr = psb_ctrl_nbr;
                        rate.app_ctrl_nbr = app_ctrl_nbr;
                        rate.user_id = user_id;
                        rate.psb_cat_subcode = "002";
                        rate.psb_pnl_rating = Convert.ToDouble(lnd_rating);
                        rate.rating_dttm = DateTime.Now;
                        rate.updated_dttm = Convert.ToDateTime("1900-01-01 00:00:00");
                        db2.psb_pnl_rtg_tbl.Add(rate);

                    }
                    var dbe3 = db2.psb_pnl_rtg_tbl.Where(a => a.app_ctrl_nbr == app_ctrl_nbr && a.psb_ctrl_nbr == psb_ctrl_nbr && a.psb_cat_subcode == "003").FirstOrDefault();
                    if (dbe3 != null)
                    {

                        dbe3.psb_pnl_rating = Convert.ToDouble(wexp_rating);
                        dbe3.user_id = user_id;
                        dbe3.updated_dttm = DateTime.Now;

                    }
                    else
                    {
                        psb_pnl_rtg_tbl rate = new psb_pnl_rtg_tbl();

                        rate.psb_ctrl_nbr = psb_ctrl_nbr;
                        rate.app_ctrl_nbr = app_ctrl_nbr;
                        rate.user_id = user_id;
                        rate.psb_cat_subcode = "003";
                        rate.psb_pnl_rating = Convert.ToDouble(wexp_rating);
                        rate.rating_dttm = DateTime.Now;
                        rate.updated_dttm = Convert.ToDateTime("1900-01-01 00:00:00");
                        db2.psb_pnl_rtg_tbl.Add(rate);

                    }
                    var dbe4 = db2.psb_pnl_rtg_tbl.Where(a => a.app_ctrl_nbr == app_ctrl_nbr && a.psb_ctrl_nbr == psb_ctrl_nbr && a.psb_cat_subcode == "004").FirstOrDefault();
                    if (dbe4 != null)
                    {

                        dbe4.psb_pnl_rating = Convert.ToDouble(elig_rating);
                        dbe4.user_id = user_id;
                        dbe4.updated_dttm = DateTime.Now;

                    }
                    else
                    {
                        psb_pnl_rtg_tbl rate = new psb_pnl_rtg_tbl();
                        rate.psb_ctrl_nbr = psb_ctrl_nbr;
                        rate.app_ctrl_nbr = app_ctrl_nbr;
                        rate.user_id = user_id;
                        rate.psb_cat_subcode = "004";
                        rate.psb_pnl_rating = Convert.ToDouble(elig_rating);
                        rate.rating_dttm = DateTime.Now;
                        rate.updated_dttm = Convert.ToDateTime("1900-01-01 00:00:00");
                        db2.psb_pnl_rtg_tbl.Add(rate);

                    }


                    var exam = db2.applicant_examination.Where(a => a.app_ctrl_nbr == app_ctrl_nbr).FirstOrDefault();

                    if (exam != null)
                    {
                        if (Convert.ToDouble(score_rendered) > 0)
                        {
                            exam.score_rendered = Convert.ToDouble(score_rendered);
                            exam.exam_type_descr = exam_type_descr;
                            exam.exam_date = Convert.ToDateTime(exam_date);
                            exam.ipcr_rating = ipcr_rating.ToString();
                            exam.updated_dttm = DateTime.Now;
                            exam.updated_by_user = user_id;
                        }

                    }
                    else
                    {
                        if (Convert.ToDouble(score_rendered) > 0)
                        {
                            applicant_examination exm = new applicant_examination();
                            exm.app_ctrl_nbr = app_ctrl_nbr;
                            exm.exam_type_descr = exam_type_descr;
                            exm.score_rendered = Convert.ToDouble(score_rendered);
                            exm.exam_date = Convert.ToDateTime(exam_date == "" ? "1900-01-01 00:00:00" : exam_date);
                            exm.created_dttm = DateTime.Now;
                            exm.created_by_user = user_id;
                            exm.updated_dttm = Convert.ToDateTime("1900-01-01 00:00:00");
                            exm.updated_by_user = "";
                            exm.ipcr_rating = ipcr_rating.ToString();
                            db2.applicant_examination.Add(exm);
                        }

                    }

                    db2.SaveChanges();

                    var reviewer_list = db2.sp_reviewer_screening_list(app_ctrl_nbr).ToList();
                    var rtn = db2.sp_getqsrating(app_ctrl_nbr).FirstOrDefault();
                    return JSON(new { message = update.success, icon = icon.success, reviewer_list, rtn }, JsonRequestBehavior.AllowGet);
                }
              
            }
            catch (DbEntityValidationException exp)
            {
                return Json(new { message = DbEntityValidationExceptionError(exp), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }

        public ActionResult fn_educdetails(string info_ctrl_nbr)
        {
            db2.Database.CommandTimeout = Int32.MaxValue;
            var user_id = Session["user_id"].ToString();
            try
            {
                //var educdetails = db2.applicant_educ_tbl.Where(a => a.info_ctrl_nbr == info_ctrl_nbr && a.psb_selected == true)
                //    .Join(db2.vw_educ_type_tbl_sort,a => a.educ_type).ToList();


                var educdetails = from a in db2.applicant_educ_tbl
                                  join b in db2.vw_educ_type_tbl_sort
                                  on a.educ_type equals b.educ_type
                                  where a.info_ctrl_nbr == info_ctrl_nbr
                                  && a.psb_selected == true
                                  orderby b.sort_order
                                  select a;
                return JSON(new { message = fetch.success, icon = icon.success,educdetails}, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return JSON(new { message = DbEntityValidationExceptionError(e), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }

        public ActionResult fn_eligdetails(string info_ctrl_nbr)
        {
            db2.Database.CommandTimeout = Int32.MaxValue;
            var user_id = Session["user_id"].ToString();
            try
            {
                var eligdetails = db2.applicant_eligibilty_tbl.Where(a => a.info_ctrl_nbr == info_ctrl_nbr && a.psb_selected == true).ToList();
              
                return JSON(new { message = fetch.success, icon = icon.success, eligdetails }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return JSON(new { message = DbEntityValidationExceptionError(e), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }
        public ActionResult fn_lnddetails(string info_ctrl_nbr)
        {
            db2.Database.CommandTimeout = Int32.MaxValue;
            var user_id = Session["user_id"].ToString();
            try
            {
                var lnddetails = db2.applicant_learnanddevt_tbl.Where(a => a.info_ctrl_nbr == info_ctrl_nbr && a.psb_selected == true).OrderByDescending(a => a.learn_devt_to_2).ToList();
                var lndTotalhrs = db2.applicant_learnanddevt_tbl.Where(a => a.info_ctrl_nbr == info_ctrl_nbr && a.psb_selected == true).Select(a => a.no_of_hrs).Sum();
                return JSON(new { message = fetch.success, icon = icon.success, lnddetails, lndTotalhrs}, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return JSON(new { message = DbEntityValidationExceptionError(e), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }
        public ActionResult fn_wexpdetails(string info_ctrl_nbr)
        {
            db2.Database.CommandTimeout = Int32.MaxValue;
            var user_id = Session["user_id"].ToString();
            try
            {
                var wexpdetails = db2.applicant_workexprnce_tbl.Where(a => a.info_ctrl_nbr == info_ctrl_nbr && a.psb_selected == true).OrderByDescending(a => a.workexp_from).ToList();
               
                return JSON(new { message = fetch.success, icon = icon.success, wexpdetails }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return JSON(new { message = DbEntityValidationExceptionError(e), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }
        
       public ActionResult fn_competencies_required()
        {
            db2.Database.CommandTimeout = Int32.MaxValue;
            var app_ctrl_nbr = rct.appControlNbr("cApplicantReview", "Index");
            var user_id = Session["user_id"].ToString();
            var app_user = db2.applicants_review_tbl.Where(a => a.app_ctrl_nbr == app_ctrl_nbr).FirstOrDefault();
            var item_no        = app_user.item_no;
            var budget_code    = app_user.budget_code;
            var employment_type= app_user.employment_type;
            var department_code= app_user.department_code;
            try
            {
                var competencies_required = db2.vw_return_compentency.Where(a => a.item_no == item_no
                                                                            && a.employment_type == employment_type
                                                                            && a.budget_code == budget_code
                                                                            && a.department_code == department_code).ToList();

                return JSON(new { message = fetch.success, icon = icon.success, competencies_required }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return JSON(new { message = DbEntityValidationExceptionError(e), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }
        public ActionResult fn_empl_photo_img()
        {
            db2.Database.CommandTimeout = Int32.MaxValue;
            var user_id = Session["user_id"].ToString();
            var app_ctrl_nbr = rct.appControlNbr("cApplicantReview", "Index");
            try
            {
                var info_ctrl_nbr = db2.applicants_review_tbl.Where(a => a.app_ctrl_nbr == app_ctrl_nbr).FirstOrDefault().info_ctrl_nbr;
                var empl_photo_img = db2.applicants_tbl.Where(a => a.info_ctrl_nbr == info_ctrl_nbr).FirstOrDefault().empl_photo_img;
               
                return JSON(new { message = fetch.success, icon = icon.success, empl_photo_img }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return JSON(new { message = DbEntityValidationExceptionError(e), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }
        public ActionResult CheckifInPsbSchedule(string app_ctrl_nbr)
        {
            CheckSession();
            try
            {
                var app = db2.psb_sked_app_tbl.Where(a => a.app_ctrl_nbr == app_ctrl_nbr).FirstOrDefault();
                var rtn = db2.sp_getqsrating(app_ctrl_nbr).FirstOrDefault();
                return JSON(new { message = update.success, icon = icon.success, app, rtn }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException exp)
            {
                return Json(new { message = DbEntityValidationExceptionError(exp), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }


    }
}