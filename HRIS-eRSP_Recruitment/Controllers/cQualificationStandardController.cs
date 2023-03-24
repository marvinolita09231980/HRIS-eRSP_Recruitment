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
    public class cQualificationStandardController : CustomController
    {
        HRIS_RCTEntities db = new HRIS_RCTEntities();
        User_Menu um = new User_Menu();
        RCT_Common rct = new RCT_Common();
        // GET: cQualityStandardRating
        public ActionResult Index(string app_ctrl_nbr)
        {
            CheckSession();
            if (app_ctrl_nbr == null)
            {
                if (Session["app_ctrl_nbr"] == null)
                {
                    return RedirectToAction("Index", "cHRMPSBScreening");
                }
            }
            else
            {
                Session["app_ctrl_nbr"] = app_ctrl_nbr;
                
            }

            return View();
        }

       public ActionResult Initialize(string employment_type)
       {
           CheckSession();
           string imgBase64Data = "";
           string imgDataURL = "";
           var psb_status = 0;
           var psb_ctrl_nbr = "";
           var user_id = Session["user_id"].ToString();
           var app_ctrl_nbr = rct.appControlNbr("cHRMPSBScreening", "Index");
           
           try
           {
               var psb = db.psb_sked_app_tbl.Where(a => a.app_ctrl_nbr == app_ctrl_nbr).FirstOrDefault();
               if (psb != null)
               {
                   psb_ctrl_nbr = psb.psb_ctrl_nbr;
               }
               
               var dtl_list = db.sp_psb_applicant_dtl_list(app_ctrl_nbr).ToList();
               var psb_list = db.sp_hrmpsb_screening_profile(app_ctrl_nbr).ToList();
               var sp_slide_rating = db.sp_slide_rating(app_ctrl_nbr, psb_ctrl_nbr, user_id).ToList();
               var exec_hasSelected = db.psb_sked_hdr_tbl.Where(a => a.psb_ctrl_nbr == psb_ctrl_nbr).FirstOrDefault();
               if(exec_hasSelected != null)
               {
                   psb_status = Convert.ToInt32(exec_hasSelected.psb_status);
               }
               var total_rating = db.sp_applicant_rating(app_ctrl_nbr, user_id).ToList();
               var empl_photo_img = psb_list[0].empl_photo_img;
               if (empl_photo_img != null)
               {
                   imgBase64Data = Convert.ToBase64String(empl_photo_img);
                   imgDataURL = string.Format("data:image/png;base64,{0}", imgBase64Data);
               }
               else
               {
                   imgDataURL = "../ResourcesImages/upload_profile.png";
               }
                return Json(new { message = fetch.success, icon = icon.success, psb_list, sp_slide_rating, app_ctrl_nbr, dtl_list, total_rating, psb_status, imgDataURL }, JsonRequestBehavior.AllowGet);
           }
           catch (DbEntityValidationException e)
           {
               return Json(new { message = DbEntityValidationExceptionError(e), icon = icon.error }, JsonRequestBehavior.AllowGet);
           }

       }


        public ActionResult SaveRating(List<sp_slide_rating_Result> dial, string app_ctrl_nbr)
        {
            CheckSession();
            var user_id = Session["user_id"].ToString();
            var date = DateTime.Now;
            //um = rct.GetAllowAccess();
            try
            {
                var psb_ctrl_nbr = db.psb_sked_app_tbl.Where(a => a.app_ctrl_nbr == app_ctrl_nbr).FirstOrDefault().psb_ctrl_nbr;

                foreach (var l in dial)
                {
                    var rate = db.psb_pnl_rtg_tbl.Where(a =>
                            a.app_ctrl_nbr == app_ctrl_nbr
                            && a.psb_ctrl_nbr == psb_ctrl_nbr
                            && a.psb_cat_subcode == l.psb_cat_subcode).FirstOrDefault();
                    if (rate == null)
                    {
                        psb_pnl_rtg_tbl r = new psb_pnl_rtg_tbl();
                        r.psb_ctrl_nbr = psb_ctrl_nbr;
                        r.app_ctrl_nbr = app_ctrl_nbr;
                        r.user_id = user_id;
                        r.psb_cat_subcode = l.psb_cat_subcode;
                        r.psb_pnl_rating = (double)l.psb_pnl_rating;
                        r.rating_dttm = date;
                        r.updated_dttm = Convert.ToDateTime("1900-01-01");
                        db.psb_pnl_rtg_tbl.Add(r);
                    }
                    else
                    {
                        rate.psb_pnl_rating = (double)l.psb_pnl_rating;
                        rate.updated_dttm = date;
                    }
                    db.SaveChanges();
                }
                var total_rating = db.sp_applicant_rating(app_ctrl_nbr, user_id).ToList();
                var sp_slide_rating = db.sp_slide_rating(app_ctrl_nbr, psb_ctrl_nbr, user_id).ToList();
                return Json(new { message = fetch.success, icon = icon.success, sp_slide_rating, total_rating }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return Json(new { message = DbEntityValidationExceptionError(e), icon = icon.error }, JsonRequestBehavior.AllowGet);
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
    }
}