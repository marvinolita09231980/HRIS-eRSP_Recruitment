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
    public class cAddReviewQSController : CustomController
    {
        string urlname = " cAddReviewQS";
        HRIS_RCTEntities db = new HRIS_RCTEntities();
        User_Menu um = new User_Menu();
        RCT_Common rct = new RCT_Common();
        // GET: cAddReviewQS
        public ActionResult Index()
        {
            if (Session["user_id"] == null)
            {
                return RedirectToAction("Index", "Login");
            }
            return View();
        }
       
        public ActionResult Initialize()
        {
            CheckSession();
            um = rct.GetAllowAccess();
            var app_ctrl_nbr = rct.appControlNbr("cApplicantsReview", "Index");
            try
            {
                var education = db.sp_applicant_qs_educ_tbl_list(app_ctrl_nbr).ToList();
                var eligibility = db.sp_applicant_qs_elig_tbl_list(app_ctrl_nbr).ToList();
                var training = db.sp_applicant_qs_lnd_tbl_list(app_ctrl_nbr).ToList();
                var experience = db.sp_applicant_qs_wexp_tbl_list(app_ctrl_nbr).ToList();
                var eductype = db.vw_applicant_educ_type_tbl.ToList();
                var salgrade = db.vw_salary_grade_list.ToList();
                return JSON(new { message = fetch.success, icon = icon.success, education, eligibility, training, experience, app_ctrl_nbr, um, eductype,salgrade}, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return Json(new { message = DbEntityValidationExceptionError(e) }, JsonRequestBehavior.AllowGet);
            }
        }

        public ActionResult addToPSB(int seqno, string info_ctrl_nbr,string tab)
        {
            CheckSession();
            object returndata = new object();
            try
            {
                var app_ctrl_nbr = db.applicants_review_tbl.Where(a => a.info_ctrl_nbr == info_ctrl_nbr).FirstOrDefault().app_ctrl_nbr;
                if(tab == "educ")
                {
                    var xp = db.applicant_educ_tbl.Where(a => a.seq_no == seqno && a.info_ctrl_nbr == info_ctrl_nbr).FirstOrDefault();
                    xp.psb_selected = true;
                    db.SaveChanges();
                    returndata = db.sp_applicant_qs_educ_tbl_list(app_ctrl_nbr).ToList();
                }
                else if (tab == "elig")
                {
                    var xp = db.applicant_eligibilty_tbl.Where(a => a.seq_no == seqno && a.info_ctrl_nbr == info_ctrl_nbr).FirstOrDefault();
                    xp.psb_selected = true;
                    db.SaveChanges();
                    returndata = db.sp_applicant_qs_elig_tbl_list(app_ctrl_nbr).ToList();
                }
                else if (tab == "lnd")
                {
                    var xp = db.applicant_learnanddevt_tbl.Where(a => a.seq_no == seqno && a.info_ctrl_nbr == info_ctrl_nbr).FirstOrDefault();
                    xp.psb_selected = true;
                    db.SaveChanges();
                    returndata = db.sp_applicant_qs_lnd_tbl_list(app_ctrl_nbr).ToList();
                }
                else if (tab == "wexp")
                {
                    var xp = db.applicant_workexprnce_tbl.Where(a => a.seq_no == seqno && a.info_ctrl_nbr == info_ctrl_nbr).FirstOrDefault();
                    xp.psb_selected = true;
                    db.SaveChanges();

                    returndata = db.sp_applicant_qs_wexp_tbl_list(app_ctrl_nbr).ToList();
                }


                var dtl_list = db.sp_psb_applicant_dtl_list(app_ctrl_nbr).ToList();

                return JSON(new { message = fetch.success, icon = icon.success, returndata, dtl_list }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return Json(new { message = DbEntityValidationExceptionError(e) }, JsonRequestBehavior.AllowGet);
            }
        }


        public ActionResult showDetails(string info_ctrl_nbr, int seq_no, int detail)
        {
            CheckSession();
            object obj = new object();
            try
            {
                if (detail == 1)
                {
                    obj = db.vw_applicant_educ_tbl_list.Where(a => a.seq_no == seq_no && a.info_ctrl_nbr == info_ctrl_nbr).ToList();
                }
                else if (detail == 2)
                {
                    obj = db.vw_applicant_learnanddevt_tbl_list.Where(a => a.seq_no == seq_no && a.info_ctrl_nbr == info_ctrl_nbr).ToList();
                }
                else if (detail == 3)
                {
                    obj = db.vw_applicant_workexprnce_tbl_list.Where(a => a.seq_no == seq_no && a.info_ctrl_nbr == info_ctrl_nbr).ToList();
                }
                else if (detail == 4)
                {
                    obj = db.vw_applicant_eligibility_tbl_list.Where(a => a.seq_no == seq_no && a.info_ctrl_nbr == info_ctrl_nbr).ToList();
                }


                return Json(new { message = delete.success, icon = icon.success, obj }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException exp)
            {
                return Json(new { message = DbEntityValidationExceptionError(exp), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }


        public ActionResult CombinedSelectedExperience(List<sp_applicant_qs_wexp_tbl_list_Result> data1, sp_applicant_qs_wexp_tbl_list_Result data2, string gov_srvc)
        {
            CheckSession();
            var next_seq = 0;
            var n_ctrl = 0;
            var govsrvce = false;
            if (gov_srvc == "1")
            {
                govsrvce = true;
            }
            else
            {
                govsrvce = false;
            }
                
            var app_ctrl_nbr = rct.appControlNbr("cApplicantsReview", "Index");
            
            try
            {
                var info_ctrl_nbr = data1[0].info_ctrl_nbr;
                var nseq = db.applicant_workexprnce_tbl.Where(a => a.info_ctrl_nbr == info_ctrl_nbr).OrderByDescending(a => a.seq_no).Take(1).FirstOrDefault();
                next_seq = Convert.ToInt32(nseq.seq_no) + 1;

                var nctrl = db.applicant_workexprnce_temp_tbl.OrderByDescending(a => a.seq_no).Take(1).FirstOrDefault();
                if (nctrl != null)
                {
                    n_ctrl = Convert.ToInt32(nseq.seq_no) + 1;
                }

               

                foreach (var x in data1)
                {
                    var ix = db.sp_insert_in_applicant_workexprnce_temp_tbl(
                             n_ctrl
                            ,x.seq_no
                            ,x.info_ctrl_nbr
                            ,x.workexp_from
                            ,x.workexp_to
                            ,x.position_title
                            ,x.dept_agncy_offc_co
                            ,x.monthly_salary
                            ,x.salary_job_grade
                            ,x.appt_status
                            ,x.gov_srvc
                        );
                }
                var ix2 = db.sp_insert_in_applicant_workexprnce_tbl(
                             next_seq
                            ,info_ctrl_nbr
                            ,data2.workexp_from
                            ,data2.workexp_to
                            ,data2.position_title
                            ,data2.dept_agncy_offc_co
                            ,data2.monthly_salary
                            ,data2.salary_job_grade
                            ,data2.appt_status
                            ,govsrvce
                            ,false
                            ,n_ctrl
                    );

               
                var experience = db.sp_applicant_qs_wexp_tbl_list(app_ctrl_nbr).ToList();
                return JSON(new { message = fetch.success, icon = icon.success, experience }, JsonRequestBehavior.AllowGet);

            }
            catch (DbEntityValidationException exp)
            {
                return Json(new { message = DbEntityValidationExceptionError(exp), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }
       

    }
}