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
    public class cHRMPSBRatingController : CustomController
    {
        HRIS_RCTEntities db = new HRIS_RCTEntities();
        User_Menu um = new User_Menu();
        RCT_Common rct = new RCT_Common();
        // GET: cHRMPSBRating
        public ActionResult Index(string app_ctrl_nbr,string psb_ctrl_nbr,string item_no)
        {
           
            
            var userid = Session["user_id"].ToString();
            Session["panel_not_Authorize"] = 0;
        
            var p = db.sp_check_panel_isAuthorize(userid).ToList();
            if (Session["user_id"] == null)
            {
                return RedirectToAction("Index", "Login");
            }
           

           
           
            return View();
        }
        public ActionResult Initialize()
        {
            
            db.Database.CommandTimeout = Int32.MaxValue;
            var user_id = Session["user_id"].ToString();
           //var psblist = 
            um = rct.GetAllowAccess();
            try
            {
                var items = db.sp_items_per_psbschedule3(user_id).ToList();
                //var psblist = db.sp_panelrating_psblist(user_id).ToList();
                return JSON(new { message = fetch.success, icon = icon.success,items}, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return Json(new { message = DbEntityValidationExceptionError(e), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }

        }
        public ActionResult getPSBList()
        {
            db.Database.CommandTimeout = Int32.MaxValue;
            var user_id = Session["user_id"].ToString();
          
            //var psblist = 
            um = rct.GetAllowAccess();
            try
            {
                var psblist = db.sp_panelrating_psblist(user_id).ToList();
                return JSON(new { message = fetch.success, icon = icon.success, psblist}, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return Json(new { message = DbEntityValidationExceptionError(e), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }

        }
        public ActionResult getPSBList2(string item)
        {
            db.Database.CommandTimeout = Int32.MaxValue;
            var user_id = Session["user_id"].ToString();

            //var psblist = 
            um = rct.GetAllowAccess();
            try
            {
                var psblist = db.sp_panelrating_psblist(user_id).ToList().Where(a => a.item_no == item);
                return JSON(new { message = fetch.success, icon = icon.success, psblist }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return Json(new { message = DbEntityValidationExceptionError(e), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }

        }


        public ActionResult SaveRating(List<sp_slide_rating_Result> dial)
        {
           
            db.Database.CommandTimeout = Int32.MaxValue;
           
            var user_id = Session["user_id"].ToString();
            var date = DateTime.Now;
            //um = rct.GetAllowAccess();
            var app_ctrl_nbr = dial[0].app_ctrl_nbr;
            var psb_ctrl_nbr = dial[0].psb_ctrl_nbr;
            try
            {

               
                 
                foreach (var l in dial)
                {
                    var rate = db.psb_pnl_rtg_tbl.Where(a =>
                             a.app_ctrl_nbr == l.app_ctrl_nbr
                             && a.psb_ctrl_nbr == l.psb_ctrl_nbr
                             && a.user_id == user_id
                             && a.psb_cat_subcode == l.psb_cat_subcode).FirstOrDefault();
                        if(rate == null)
                        {
                           
                            psb_pnl_rtg_tbl r = new psb_pnl_rtg_tbl();
                            r.psb_ctrl_nbr         = l.psb_ctrl_nbr;
                            r.app_ctrl_nbr         = l.app_ctrl_nbr;
                            r.user_id		       = user_id;
                            r.psb_cat_subcode      = l.psb_cat_subcode;
                            r.psb_pnl_rating       = (double)l.psb_pnl_rating;
                            r.rating_dttm          = date;
                            r.updated_dttm = Convert.ToDateTime("1900-01-01");
                            db.psb_pnl_rtg_tbl.Add(r);
                        }
                        else
                        {
                            rate.psb_pnl_rating = (double)l.psb_pnl_rating;
                            rate.updated_dttm   = date;
                        }
                        db.SaveChanges();
                }
                var total_rating = db.sp_applicant_rating(app_ctrl_nbr, user_id).ToList();
                var sp_slide_rating = db.sp_slide_rating(app_ctrl_nbr, psb_ctrl_nbr, user_id).ToList();
                return JSON(new { message = fetch.success, icon = icon.success, sp_slide_rating, total_rating }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return Json(new { message = DbEntityValidationExceptionError(e), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }


        public ActionResult showDetails(string info_ctrl_nbr, int seq_no, int detail)
        {
            
            db.Database.CommandTimeout = Int32.MaxValue;
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


                return JSON(new { message = delete.success, icon = icon.success, obj }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException exp)
            {
                return Json(new { message = DbEntityValidationExceptionError(exp), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }
        public ActionResult sp_hrmpsb_screening_list(string item_no,string psb_ctrl_nbr)
        {
            
            db.Database.CommandTimeout = Int32.MaxValue;
            var user_id = Session["user_id"].ToString();
            
            try
            {
                var psb_applicant_list = db.sp_hrmpsb_screening_list_inItem(psb_ctrl_nbr, "2", user_id, item_no).ToList();
                var psb_rating_all = db.sp_panelrating_all_applicant_list(psb_ctrl_nbr, user_id, item_no).ToList();
                return JSON(new { message = fetch.success, icon = icon.success, psb_applicant_list, psb_rating_all}, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return Json(new { message = DbEntityValidationExceptionError(e), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }

        public ActionResult sp_hrmpsb_screen_details(string app_ctrl_nbr, string psb_ctrl_nbr)
        {
           
            db.Database.CommandTimeout = Int32.MaxValue;
            string imgBase64Data = "";
            string imgDataURL = "";
            var user_id = Session["user_id"].ToString();
            Session["rt_psb_ctrl_nbr"] = psb_ctrl_nbr;
            Session["app_ctrl_nbr"] = app_ctrl_nbr;
            try
            {
                var psbsched_item = db.sp_hrmpsbscreening_item_list(psb_ctrl_nbr).ToList();

                var dtl_list = db.sp_psb_applicant_dtl_list(app_ctrl_nbr).ToList();
                var psb_list = db.sp_hrmpsb_screening_profile(app_ctrl_nbr).ToList();
                var sp_slide_rating = db.sp_slide_rating(app_ctrl_nbr, psb_ctrl_nbr, user_id).ToList();
                var total_rating = db.sp_applicant_rating(app_ctrl_nbr, user_id).ToList();
                var empl_photo_img = db.sp_get_empl_photo_img(app_ctrl_nbr).FirstOrDefault().empl_photo_img;
                //if (empl_photo_img.empl_photo_img != null)
                //{
                //    imgBase64Data = Convert.ToBase64String(empl_photo_img.empl_photo_img);
                //    imgDataURL = string.Format("data:image/png;base64,{0}", imgBase64Data);
                //}
                //else
                //{
                //    imgDataURL = "~/ResourcesImages/upload_profile.png";
                //}

                return JSON(new { message = fetch.success, icon = icon.success, psb_list, sp_slide_rating, app_ctrl_nbr, dtl_list, total_rating, psbsched_item, imgDataURL }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return Json(new { message = DbEntityValidationExceptionError(e), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }

        public ActionResult QSdetails(string app_ctrl_nbr,string info_ctrl_nbr, string psb_ctrl_nbr)
        {
           
            db.Database.CommandTimeout = Int32.MaxValue;
            var user_id = Session["user_id"].ToString();

            try
            {
              //  var sp_slide_rating = db.sp_slide_rating(app_ctrl_nbr, psb_ctrl_nbr, user_id).ToList();
                var educdetails = db.applicant_educ_tbl.Where(a => a.info_ctrl_nbr == info_ctrl_nbr).OrderByDescending(a => a.period_from_2).ToList();
                var eligdetails = db.applicant_eligibilty_tbl.Where(a => a.info_ctrl_nbr == info_ctrl_nbr).OrderByDescending(a => a.examination_date_2).ToList();
                var lnddetails = db.applicant_learnanddevt_tbl.Where(a => a.info_ctrl_nbr == info_ctrl_nbr).OrderByDescending(a => a.learn_devt_from_2).ToList();
                var wexpdetails = db.applicant_workexprnce_tbl.Where(a => a.info_ctrl_nbr == info_ctrl_nbr).OrderByDescending(a => a.workexp_from).ToList();
                var reviewer_list = db.sp_reviewer_screening_list(app_ctrl_nbr).ToList();
                var cbrating = db.psb_pnl_rtg_tbl.Where(a => a.psb_ctrl_nbr == psb_ctrl_nbr && a.app_ctrl_nbr == app_ctrl_nbr && a.user_id == user_id).ToList();
              //  var zoomcred = db.zoomcredential_tbl.FirstOrDefault();
                return JSON(new { message = fetch.success, icon = icon.success, cbrating, educdetails, eligdetails, lnddetails, wexpdetails, reviewer_list}, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return JSON(new { message = DbEntityValidationExceptionError(e), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }
        public ActionResult getImage2(string info_ctrl_nbr)
        {
           
            db.Database.CommandTimeout = Int32.MaxValue;
            var user_id = Session["user_id"].ToString();

            try
            {
                var appl = (from ap in db.applicants_tbl
                            where ap.info_ctrl_nbr == info_ctrl_nbr
                            select new
                            {
                                 ap.info_ctrl_nbr
                                ,ap.empl_photo_img
                            }).FirstOrDefault();
                return JSON(new { message = fetch.success, icon = icon.success, appl }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return JSON(new { message = DbEntityValidationExceptionError(e), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }
        public ActionResult getImage(string info_ctrl_nbr)
        {
            
            db.Database.CommandTimeout = Int32.MaxValue;
            var user_id = Session["user_id"].ToString();

            try
            {
                var image = db.applicants_tbl.Where(a => a.info_ctrl_nbr == info_ctrl_nbr).FirstOrDefault().empl_photo_img;
                return JSON(new { message = fetch.success, icon = icon.success, image }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return JSON(new { message = DbEntityValidationExceptionError(e), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }
        public ActionResult refreshzoomlink()
        {
          
            db.Database.CommandTimeout = Int32.MaxValue;
            var user_id = Session["user_id"].ToString();

            try
            {
                var zoomcred = db.zoomcredential_tbl.FirstOrDefault();

                return JSON(new { message = "Save Success", icon = "success", zoomcred }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { message = ex.Message, icon = "error" }, JsonRequestBehavior.AllowGet);
            }
        }

        public ActionResult ratecbi(string psb_ctrl_nbr, string app_ctrl_nbr, string psb_pnl_rating,string psb_cat_subcode)
        {

            
          
            db.Database.CommandTimeout = Int32.MaxValue;
            var date = DateTime.Now;
            var user_id = Session["user_id"].ToString();
            try
            {
                var cbi = db.psb_pnl_rtg_tbl.Where(a => a.psb_ctrl_nbr == psb_ctrl_nbr
                                                   && a.app_ctrl_nbr == app_ctrl_nbr
                                                   && a.psb_cat_subcode == psb_cat_subcode
                                                   && a.user_id == user_id).FirstOrDefault();
                if (cbi != null)
                {
                    cbi.psb_pnl_rating = Convert.ToDouble(psb_pnl_rating);
                    cbi.updated_dttm = date;
                }
                else
                {
                    psb_pnl_rtg_tbl cb = new psb_pnl_rtg_tbl();
                    cb.psb_ctrl_nbr      = psb_ctrl_nbr; 
                    cb.app_ctrl_nbr      = app_ctrl_nbr;
                    cb.user_id           = user_id;
                    cb.psb_cat_subcode   = psb_cat_subcode;
                    cb.psb_pnl_rating    = Convert.ToDouble(psb_pnl_rating);
                    cb.rating_dttm       = date;
                    cb.updated_dttm      = Convert.ToDateTime("1900-01-01");
                    db.psb_pnl_rtg_tbl.Add(cb);
                }
                db.SaveChanges();

                var cbrating = db.psb_pnl_rtg_tbl.Where(a => a.psb_ctrl_nbr == psb_ctrl_nbr && a.app_ctrl_nbr == app_ctrl_nbr && a.user_id == user_id).ToList();

                return JSON(new { message = fetch.success, icon = icon.success, cbrating }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return Json(new { message = DbEntityValidationExceptionError(e), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }
    }
}