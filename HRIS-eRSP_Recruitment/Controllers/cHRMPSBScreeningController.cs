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
    public class cHRMPSBScreeningController : CustomController
    {
        HRIS_RCTEntities db = new HRIS_RCTEntities();
        User_Menu um = new User_Menu();
        RCT_Common rct = new RCT_Common();
        // GET: cHRMPSBScreening
        public ActionResult Index()
        {
            if(Session["user_id"] == null)
            {
                return RedirectToAction("Index","Login");
            }
            if (Convert.ToInt32(Session["panel_mbr_flag"].ToString()) == 1)
            {
                return RedirectToAction("Index", "cHRMPSBRating");
            }
            else
            {
                return View();
            }
            
           
        }
        public ActionResult Initialize(string employment_type)
        {
            CheckSession();
            db.Database.CommandTimeout = Int32.MaxValue;
            var psb_status = 0;
            List<sp_budgetyears_tbl_combolist1_RCT_Result> budgetyear = new List<sp_budgetyears_tbl_combolist1_RCT_Result>();
            List<sp_get_psbschedule_dropdown_Result> psbschedule = new List<sp_get_psbschedule_dropdown_Result>();
            List<sp_items_per_psbschedule_Result> psbsched_item = new List<sp_items_per_psbschedule_Result>();
            List<sp_hrmpsb_screening_list_Result> psblist = new List<sp_hrmpsb_screening_list_Result>();
            List<psb_sked_mbr_tbl> panels = new List<psb_sked_mbr_tbl>();
            List<psb_sked_hdr_tbl> psb_sked_hdr_tbl = new List<psb_sked_hdr_tbl>();
            um = rct.GetAllowAccess();

            //var v_psb_ctrl_nbr = Session["psb_psb_ctrl_nbr"] == null ? "" : Session["psb_psb_ctrl_nbr"].ToString();
            //var v_employment_type = Session["psb_employment_type"] == null ? "" : Session["psb_employment_type"].ToString();
            //var v_budget_code = Session["psb_budget_code"] == null ? "" : Session["psb_budget_code"].ToString();
            //var v_item_no = Session["item_no"] == null ? "" : Session["item_no"].ToString();

            var user_id = Session["user_id"].ToString();

            try
            {
                //psb_sked_hdr_tbl = db.psb_sked_hdr_tbl.Where(a => a.psb_status == 1).ToList();

                //if (psb_sked_hdr_tbl.Count() > 0)
                //{
                //    var p = psb_sked_hdr_tbl[0];
                //    budgetyear = db.sp_budgetyears_tbl_combolist1_RCT(p.employment_type).ToList();
                //    psbschedule = db.sp_get_psbschedule_dropdown(p.employment_type, p.budget_code).ToList();
                //    if (v_item_no != null)
                //    {
                //        psblist = db.sp_hrmpsb_screening_list(p.psb_ctrl_nbr, "2", user_id).Where(a => a.item_no == v_item_no).ToList();
                //    }

                //    psbsched_item = db.sp_items_per_psbschedule(p.psb_ctrl_nbr).ToList();
                //    psb_status = (int)p.psb_status;
                //    panels = db.psb_sked_mbr_tbl.Where(a => a.psb_ctrl_nbr == p.psb_ctrl_nbr).ToList();
                //}
                //else
                //{
                //    if (Session["psb_employment_type"] != null)
                //    {
                //        budgetyear = db.sp_budgetyears_tbl_combolist1_RCT(v_employment_type).ToList();
                //    }

                //    if (Session["psb_employment_type"] != null && Session["psb_budget_code"] != null)
                //    {
                //        psbschedule = db.sp_get_psbschedule_dropdown(v_employment_type, v_budget_code).ToList();
                //    }
                //    if (Session["psb_psb_ctrl_nbr"] != null)
                //    {
                //        if (v_item_no != null)
                //        {
                //            psblist = db.sp_hrmpsb_screening_list(v_psb_ctrl_nbr, "2", user_id).Where(a => a.item_no == v_item_no).ToList();
                //        }

                //        psbsched_item = db.sp_items_per_psbschedule(v_psb_ctrl_nbr).ToList();
                //        if (db.psb_sked_hdr_tbl.Where(a => a.psb_ctrl_nbr == v_psb_ctrl_nbr).Count() != 0)
                //        {
                //            psb_status = (int)db.psb_sked_hdr_tbl.Where(a => a.psb_ctrl_nbr == v_psb_ctrl_nbr).FirstOrDefault().psb_status;
                //        }
                //        panels = db.psb_sked_mbr_tbl.Where(a => a.psb_ctrl_nbr == v_psb_ctrl_nbr).ToList();

                //    }
                //}

                //var list = db.sp_hrmpsb_screening_list(budget_code, employment_type).ToList();

                var pageTitle = Session["page_title"];

                return JSON(new
                {
                    message = insert.success,
                    icon = icon.success,
                    pageTitle,
                    um,
                    //budgetyear,
                    //psbschedule,
                    //psblist,
                    //psb_status,
                    //psbsched_item,
                    //panels,
                    //psb_sked_hdr_tbl,
                    //psb_ctrl_nbr = v_psb_ctrl_nbr,
                    //employment_type = v_employment_type,
                    //budget_code = v_budget_code,
                    //item_no = v_item_no
                }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return JSON(new { message = DbEntityValidationExceptionError(e), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }

        }

      
        //public ActionResult Initialize(string employment_type)
        //{
        //    CheckSession();
        //    db.Database.CommandTimeout = Int32.MaxValue;
        //    var psb_status = 0;
        //    List<sp_budgetyears_tbl_combolist1_RCT_Result> budgetyear = new List<sp_budgetyears_tbl_combolist1_RCT_Result>();
        //    List<sp_get_psbschedule_dropdown_Result> psbschedule = new List<sp_get_psbschedule_dropdown_Result>();
        //    List<sp_items_per_psbschedule_Result> psbsched_item = new List<sp_items_per_psbschedule_Result>();
        //    List<sp_hrmpsb_screening_list_Result> psblist = new List<sp_hrmpsb_screening_list_Result>();
        //    List<psb_sked_mbr_tbl> panels = new List<psb_sked_mbr_tbl>();
        //    List<psb_sked_hdr_tbl> psb_sked_hdr_tbl = new List<psb_sked_hdr_tbl>();
        //    um = rct.GetAllowAccess();

        //   var v_psb_ctrl_nbr         = Session["psb_psb_ctrl_nbr"] == null?"":Session["psb_psb_ctrl_nbr"].ToString();    
        //   var v_employment_type      = Session["psb_employment_type"] == null?"":Session["psb_employment_type"].ToString();
        //   var v_budget_code          = Session["psb_budget_code"] == null?"":Session["psb_budget_code"].ToString();
        //   var v_item_no              = Session["item_no"] == null ? "" : Session["item_no"].ToString();

        //   var user_id = Session["user_id"].ToString();

        //    try
        //    {
        //       psb_sked_hdr_tbl = db.psb_sked_hdr_tbl.Where(a => a.psb_status == 1).ToList();

        //       if (psb_sked_hdr_tbl.Count() > 0)
        //       {
        //           var p = psb_sked_hdr_tbl[0];
        //           budgetyear = db.sp_budgetyears_tbl_combolist1_RCT(p.employment_type).ToList();
        //           psbschedule = db.sp_get_psbschedule_dropdown(p.employment_type, p.budget_code).ToList();
        //            if(v_item_no != null)
        //            {
        //                psblist = db.sp_hrmpsb_screening_list(p.psb_ctrl_nbr, "2", user_id).Where(a => a.item_no == v_item_no).ToList();
        //            }

        //           psbsched_item = db.sp_items_per_psbschedule(p.psb_ctrl_nbr).ToList();
        //           psb_status = (int)p.psb_status;
        //           panels = db.psb_sked_mbr_tbl.Where(a => a.psb_ctrl_nbr == p.psb_ctrl_nbr).ToList();
        //       }
        //       else
        //       {
        //           if (Session["psb_employment_type"] != null)
        //           {
        //               budgetyear = db.sp_budgetyears_tbl_combolist1_RCT(v_employment_type).ToList();
        //           }

        //           if (Session["psb_employment_type"] != null && Session["psb_budget_code"] != null)
        //           {
        //               psbschedule = db.sp_get_psbschedule_dropdown(v_employment_type, v_budget_code).ToList();
        //           }
        //           if (Session["psb_psb_ctrl_nbr"] != null)
        //           {
        //                if (v_item_no != null)
        //                {
        //                    psblist = db.sp_hrmpsb_screening_list(v_psb_ctrl_nbr, "2", user_id).Where(a => a.item_no == v_item_no).ToList();
        //                }

        //               psbsched_item = db.sp_items_per_psbschedule(v_psb_ctrl_nbr).ToList();
        //               if (db.psb_sked_hdr_tbl.Where(a => a.psb_ctrl_nbr == v_psb_ctrl_nbr).Count() != 0)
        //               {
        //                   psb_status = (int)db.psb_sked_hdr_tbl.Where(a => a.psb_ctrl_nbr == v_psb_ctrl_nbr).FirstOrDefault().psb_status;
        //               }
        //               panels = db.psb_sked_mbr_tbl.Where(a => a.psb_ctrl_nbr == v_psb_ctrl_nbr).ToList();

        //           }
        //       }

        //        //var list = db.sp_hrmpsb_screening_list(budget_code, employment_type).ToList();

        //        var pageTitle = Session["page_title"];

        //        return JSON(new { 
        //            message = insert.success, 
        //            icon = icon.success, 
        //            pageTitle, 
        //            um,
        //            budgetyear,
        //            psbschedule,
        //            psblist,
        //            psb_status,
        //            psbsched_item,
        //            panels,
        //            psb_sked_hdr_tbl,
        //            psb_ctrl_nbr        = v_psb_ctrl_nbr,
        //            employment_type     = v_employment_type,
        //            budget_code         = v_budget_code,
        //            item_no             = v_item_no
        //        }, JsonRequestBehavior.AllowGet);
        //    }
        //    catch (DbEntityValidationException e)
        //    {
        //       return JSON(new { message = DbEntityValidationExceptionError(e),icon=icon.error }, JsonRequestBehavior.AllowGet);
        //    }

        //}

        //public ActionResult sp_hrmpsb_screening_list(string psb_ctrl_nbr, string item_no)
        //{
        //    Session["item_no"] = item_no;


        //    try
        //    {
        //        var psblist = db.sp_hrmpsb_screening_list(psb_ctrl_nbr).ToList();

        //        return JSON(new { message = fetch.success, icon = icon.success, psblist }, JsonRequestBehavior.AllowGet);
        //    }
        //    catch (DbEntityValidationException e)
        //    {
        //        return JSON(new { message = DbEntityValidationExceptionError(e), icon = icon.error }, JsonRequestBehavior.AllowGet);
        //    }
        //}

        public ActionResult sp_get_psbschedule_dropdown(string employment_type, string budget_code)
        {
            CheckSession();
            db.Database.CommandTimeout = Int32.MaxValue;
            //Session["psb_budget_code"] = budget_code;
            //Session["psb_psb_ctrl_nbr"] = "";
            //Session["item_no"] = "";

            try
            {
                var psbschedule = db.sp_get_psbschedule_dropdown(employment_type, budget_code).ToList();
             
                return JSON(new { message = fetch.success, icon = icon.success, psbschedule }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return JSON(new { message = DbEntityValidationExceptionError(e), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }
    
        public ActionResult sp_hrmpsbscreening_item_list(string item_no, string psb_ctrl_nbr, string employment_type, string budget_code)
        {
            CheckSession();
            db.Database.CommandTimeout = Int32.MaxValue;
            var user_id = Session["user_id"].ToString();
            Session["psb_psb_ctrl_nbr"] = psb_ctrl_nbr;
            Session["item_no"] = item_no;
            try
            {
                
               
                var psb_status = db.psb_sked_hdr_tbl.Where(a => a.psb_ctrl_nbr == psb_ctrl_nbr).FirstOrDefault().psb_status;
                var psblist = db.sp_hrmpsb_screening_list(psb_ctrl_nbr, "2", user_id).Where(a => a.item_no == item_no).ToList();
                //var panels = db.psb_sked_mbr_tbl.Where(a => a.psb_ctrl_nbr == psb_ctrl_nbr).ToList();
                return JSON(new { message = fetch.success, icon = icon.success, psb_status, psblist}, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return JSON(new { message = DbEntityValidationExceptionError(e), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }
        
        public ActionResult findPanel(string psb_ctrl_nbr)
        {
            CheckSession();
            db.Database.CommandTimeout = Int32.MaxValue;
            var user = Session["user_id"].ToString();
            try
            {
                var psb = db.psb_sked_mbr_tbl.Where(a => a.psb_ctrl_nbr == psb_ctrl_nbr && a.panel_user_id == user).ToList().Count();

                return JSON(new { message = fetch.success, icon = icon.success, psb }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return JSON(new { message = DbEntityValidationExceptionError(e), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }

        public ActionResult CheckIfExec_HasSelected(string psb_ctrl_nbr,string item_no)
        {
            CheckSession();
            db.Database.CommandTimeout = Int32.MaxValue;
            var user = Session["user_id"].ToString();
            try
            {
                var hasSelected_approved = db.sp_checkIfExec_HasSelected(psb_ctrl_nbr, item_no).FirstOrDefault();
                
                return JSON(new { message = fetch.success, icon = icon.success, hasSelected_approved }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return JSON(new { message = DbEntityValidationExceptionError(e), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }

        public ActionResult sp_budgetyears_tbl_combolist1_RCT(string employment_type)
        {
            CheckSession();
            db.Database.CommandTimeout = Int32.MaxValue;
            //Session["psb_employment_type"] = employment_type;
            //Session["psb_budget_code"] = "";
            //Session["psb_psb_ctrl_nbr"] = "";
            //Session["item_no"] = "";
            var user_id = Session["user_id"].ToString();

            try
            {
                var budgetyears = db.sp_budgetyears_tbl_combolist1_RCT(employment_type).ToList();
              //  var psblist = db.sp_hrmpsb_screening_list(psb_ctrl_nbr, "2", user_id).ToList();
                return JSON(new { message = fetch.success, icon = icon.success, budgetyears }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return JSON(new { message = DbEntityValidationExceptionError(e), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }
        public ActionResult set_Item_no(string item_no,string psb_ctrl_nbr,string employment_type,string budget_code)
        {
            CheckSession();
            try
            {
                Session["item_no"] = item_no;

                return JSON(new { message = fetch.success, icon = icon.success }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return JSON(new { message = DbEntityValidationExceptionError(e), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }

        public ActionResult DeletefromPSBScreening(string app_ctrl_nbr,string psb_ctrl_nbr,string item_no)
        {
            CheckSession();

            try
            {
                
                return JSON(new { message = fetch.success, icon = icon.success}, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return JSON(new { message = DbEntityValidationExceptionError(e), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }

     
        
        public ActionResult SetPSBToConcluded(string psb_ctrl_nbr)
        {
            CheckSession();
            db.Database.CommandTimeout = Int32.MaxValue;
            try
            {
                var psb = db.psb_sked_hdr_tbl.Where(a => a.psb_ctrl_nbr == psb_ctrl_nbr).FirstOrDefault();
                psb.psb_status = 2;
                db.SaveChanges();
                var psb_status = db.psb_sked_hdr_tbl.Where(a => a.psb_ctrl_nbr == psb_ctrl_nbr).FirstOrDefault().psb_status;
                return JSON(new { message = fetch.success, icon = icon.success, psb_status}, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return JSON(new { message = DbEntityValidationExceptionError(e), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }

        public ActionResult SetPSBToStart(string psb_ctrl_nbr)
        {
            CheckSession();
            db.Database.CommandTimeout = Int32.MaxValue;
            try
            {
                var psb_status = db.sp_set_psbscreening_start(psb_ctrl_nbr).FirstOrDefault();
                return JSON(new { message = fetch.success, icon = icon.success, psb_status }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return JSON(new { message = DbEntityValidationExceptionError(e), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }
        
        public ActionResult ReactivateHRMPSB(string psb_ctrl_nbr)
        {
            CheckSession();
            db.Database.CommandTimeout = Int32.MaxValue;
            try
            {
                var psb = db.psb_sked_hdr_tbl.Where(a => a.psb_ctrl_nbr == psb_ctrl_nbr).FirstOrDefault();
                psb.psb_status = 1;
                db.SaveChanges();
                return JSON(new { message = fetch.success, icon = icon.success, psb_status = 1 }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return JSON(new { message = DbEntityValidationExceptionError(e), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }
        public ActionResult getProfileRatingInfo(string app_ctrl_nbr, string psb_ctrl_nbr)
        {
            CheckSession();
            db.Database.CommandTimeout = Int32.MaxValue;
            var user_id = Session["user_id"].ToString();
            try
            {
                var total_rating = db.sp_applicant_rating(app_ctrl_nbr, "000000").ToList();
                var sp_slide_rating = db.sp_slide_rating(app_ctrl_nbr, psb_ctrl_nbr, "000000").ToList();
                return JSON(new { message = fetch.success, icon = icon.success, total_rating, sp_slide_rating }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return JSON(new { message = DbEntityValidationExceptionError(e), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }
       public ActionResult getProfileRatingInfo_manual(string app_ctrl_nbr, string psb_ctrl_nbr, string panel_user_id)
       {
            CheckSession();
            db.Database.CommandTimeout = Int32.MaxValue;
           

           var user_id = Session["user_id"].ToString();
           try
           {
                var inf = db.applicants_review_tbl.Where(a => a.app_ctrl_nbr == app_ctrl_nbr).FirstOrDefault();
                var imgDataURL = (from ap in db.applicants_tbl
                            where ap.info_ctrl_nbr == inf.info_ctrl_nbr
                            select new
                            {
                                ap.info_ctrl_nbr
                                ,
                                ap.empl_photo_img
                            }).FirstOrDefault();
                var total_rating = db.sp_applicant_rating(app_ctrl_nbr, panel_user_id).ToList();
                var sp_slide_rating = db.sp_slide_rating(app_ctrl_nbr, psb_ctrl_nbr, panel_user_id).ToList();
               return JSON(new { message = fetch.success, icon = icon.success, total_rating, sp_slide_rating,imgDataURL}, JsonRequestBehavior.AllowGet);
           }
           catch (DbEntityValidationException e)
           {
               return JSON(new { message = DbEntityValidationExceptionError(e), icon = icon.error }, JsonRequestBehavior.AllowGet);
           }
       }

        public ActionResult SaveRating(string app_ctrl_nbr, string psb_ctrl_nbr, List<sp_slide_rating_Result> rating, string panel_id, bool is_panel, string item_no, string csc_level)
        {
            CheckSession();
            db.Database.CommandTimeout = Int32.MaxValue;
            var user_id = "";
            if (is_panel == true ) 
            {
                user_id = panel_id;
            }
            else
            {
                user_id = Session["user_id"].ToString();
            }
          
            var date = DateTime.Now;
            
            try
            {

                foreach (var l in rating)
                {

                    var rate = db.psb_pnl_rtg_tbl.Where(a =>
                             a.app_ctrl_nbr == l.app_ctrl_nbr
                             && a.psb_ctrl_nbr == l.psb_ctrl_nbr
                             && a.user_id == user_id
                             && a.psb_cat_subcode == l.psb_cat_subcode).FirstOrDefault();

                    if (rate == null)
                    {

                        psb_pnl_rtg_tbl r = new psb_pnl_rtg_tbl();
                        r.psb_ctrl_nbr = l.psb_ctrl_nbr;
                        r.app_ctrl_nbr = l.app_ctrl_nbr;
                        r.user_id = panel_id;
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
                   
                }
                db.SaveChanges();

                var total_rating = db.sp_applicant_rating(app_ctrl_nbr, user_id).ToList();
                var sp_slide_rating = db.sp_slide_rating(app_ctrl_nbr, psb_ctrl_nbr, user_id).ToList();
                var hsrated = db.sp_panel_verify_hasrated(user_id, psb_ctrl_nbr, app_ctrl_nbr, "002").FirstOrDefault();
                if (hsrated == true)
                {
                    var phdr = db.psb_sked_mbr_tbl.Where(a => a.panel_user_id == user_id && a.psb_ctrl_nbr == psb_ctrl_nbr);
                    if (phdr.Count() > 0)
                    {
                        var ph = phdr.FirstOrDefault();
                        ph.attended = true;
                    }
                }
                var panel_rating = db.sp_panelrating_perapplicant_list(psb_ctrl_nbr, app_ctrl_nbr, item_no,csc_level).ToList();
                return JSON(new { message = fetch.success, icon = icon.success, sp_slide_rating, total_rating, panel_rating }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return JSON(new { message = DbEntityValidationExceptionError(e), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }

        public ActionResult submit_to_comparative(string app_ctrl_nbr, string psb_ctrl_nbr)
        {
           
            db.Database.CommandTimeout = Int32.MaxValue;
            var user_id = Session["user_id"].ToString();
            var item_no = Session["item_no"].ToString();
            var message = "";
            var icn = "";
            try
            {
                var d = db.sp_applicant_proceedto_CA(psb_ctrl_nbr, app_ctrl_nbr).ToList();
                if(d[0].for_comparative == true)
                {
                    var dbs = db.applicants_review_tbl.Where(a => a.app_ctrl_nbr == app_ctrl_nbr).FirstOrDefault();
                    dbs.app_status = "3";
                    icn = icon.success;
                }
                else
                {
                    message = d[0].rating_error;
                    icn = icon.error;
                }
                db.SaveChanges();

              var  psblist = db.sp_hrmpsb_screening_list(psb_ctrl_nbr, "2", user_id).Where(a => a.item_no == item_no).ToList();
                return JSON(new { message = message, icon = icn, dbn = d[0], psblist }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return JSON(new { message = DbEntityValidationExceptionError(e), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }

        public ActionResult DeletefromComparative(string app_ctrl_nbr)
        {
            var message = "";
            var icn = "";
            db.Database.CommandTimeout = Int32.MaxValue;
            var user_id = Session["user_id"].ToString();
            var psb_ctrl_nbr = Session["psb_psb_ctrl_nbr"].ToString();
            var item_no = Session["item_no"].ToString();
            List<sp_hrmpsb_screening_list_Result> psblist = new List<sp_hrmpsb_screening_list_Result>();
            try
            {
                var app = db.applicants_review_tbl.Where(a => a.app_ctrl_nbr == app_ctrl_nbr).FirstOrDefault();
                if (app.app_status == "4")
                {
                    psblist = db.sp_hrmpsb_screening_list(psb_ctrl_nbr, "2", user_id).Where(a => a.item_no == item_no).ToList();
                    message = "Cannot be remove, applicants is already approved";
                    icn = "warning";
                }
                else
                {
                    app.app_status = "2";
                    app.updated_dttm = DateTime.Now;
                    app.updated_by_user = user_id;
                    db.SaveChanges();
                    psblist = db.sp_hrmpsb_screening_list(psb_ctrl_nbr, "2", user_id).Where(a => a.item_no == item_no).ToList();
                    message = "Successfully removed from comparative!";
                    icn = "success";
                }

                return JSON(new { message = message, icon = icn, psblist }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return JSON(new { message = DbEntityValidationExceptionError(e), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }

        public ActionResult submit_list_comparative(List<sp_hrmpsb_screening_list_Result> data)
        {
            CheckSession();
            db.Database.CommandTimeout = Int32.MaxValue;
            var user_id = Session["user_id"].ToString();
            var data_count = data.Count();
            var submit_count = 0;
            var fail_count = 0;
            var message = "";
            var icn = "";
            try
            {
                var psb_ctrl_nbr = data[0].psb_ctrl_nbr;
                foreach(var l in data)
                {
                    var d = db.sp_applicant_proceedto_CA(l.psb_ctrl_nbr, l.app_ctrl_nbr).ToList();
                    if (d[0].for_comparative == true)
                    {
                        var dbs = db.applicants_review_tbl.Where(a => a.app_ctrl_nbr == l.app_ctrl_nbr).FirstOrDefault();
                        dbs.app_status = "3";
                        submit_count++;
                    }
                    else{
                        fail_count++;
                    }

                    db.SaveChanges();
                }
                if (submit_count > 0 && fail_count > 0)
                {
                    message = submit_count + " successfully submitted and " + fail_count + " unsuccessfully submitted to Comparative assessment!";
                    icn = icon.success;
                }
                else if (submit_count == data_count)
                {
                    message = "All application submitted successfully to Comparative Assessment!";
                    icn = icon.success;
                }
                else if (fail_count == data_count)
                {
                    message = "All application submitted unsuccessfully!";
                    icn = icon.error;
                }
                var psblist = db.sp_hrmpsb_screening_list(psb_ctrl_nbr, "3", user_id).ToList();

                return JSON(new { message = message, icon = icn, psblist}, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return JSON(new { message = DbEntityValidationExceptionError(e), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }

        public ActionResult HRMPSBScreeningPass(string employment_type, string budget_code, string psb_ctrl_nbr, string item_no, string pass, string app_ctrl_nbr)
        {
            CheckSession();
            db.Database.CommandTimeout = Int32.MaxValue;
            var user_id = Session["user_id"].ToString();
            try
            {
                var dt = db.applicants_review_tbl.Where(a => a.app_ctrl_nbr == app_ctrl_nbr).FirstOrDefault();
                dt.app_status = "2";
                db.SaveChanges();

                //var psbsched_item = db.sp_hrmpsbscreening_item_list(psb_ctrl_nbr).ToList();
                //var psb_status = db.psb_sked_hdr_tbl.Where(a => a.psb_ctrl_nbr == psb_ctrl_nbr).FirstOrDefault().psb_status;
                var psblist = db.sp_hrmpsb_screening_list(psb_ctrl_nbr, "2", user_id).ToList();

                return JSON(new { message = update.success, icon.success, psblist }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return JSON(new { message = DbEntityValidationExceptionError(e), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }
        public ActionResult ProceedToComparative(List<items_added> data)
        {
            CheckSession();
            db.Database.CommandTimeout = Int32.MaxValue;
            var user_id = Session["user_id"].ToString();
            var psb_ctrl_nbr = data[0].psb_ctrl_nbr;
            try
            {
                foreach(var l in data)
                {
                    if(l.item_isadded)
                    {
                        var dt = db.applicants_review_tbl.Where(a => a.app_ctrl_nbr == l.app_ctrl_nbr).FirstOrDefault();
                        dt.app_status = "3";
                    }
                    else
                    {
                        var dt = db.applicants_review_tbl.Where(a => a.app_ctrl_nbr == l.app_ctrl_nbr).FirstOrDefault();
                        dt.app_status = "2";
                    }
                    
                }

                db.SaveChanges();

                var psblist = db.sp_hrmpsb_screening_list(psb_ctrl_nbr, "2", user_id).ToList();

                return JSON(new { message = update.success, icon=icon.success, psblist }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return JSON(new { message = DbEntityValidationExceptionError(e), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }
        public ActionResult validate_Panel(string panel_id,string psb_ctrl_nbr)
        {
            CheckSession();
            db.Database.CommandTimeout = Int32.MaxValue;
            var user_id = Session["user_id"].ToString();
            try
            {
                var is_panel = db.psb_sked_mbr_tbl.Where(a => a.panel_user_id == panel_id && a.psb_ctrl_nbr == psb_ctrl_nbr).Count();
                return JSON(new { message = update.success, icon.success, is_panel }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return JSON(new { message = DbEntityValidationExceptionError(e), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }

        public ActionResult ValidatePanelScoreEdit(string panel_id, string psb_ctrl_nbr,string app_ctrl_nbr)
        {
            CheckSession();
            db.Database.CommandTimeout = Int32.MaxValue;
            var user_id = Session["user_id"].ToString();
            try
            {
                var is_panel = db.psb_sked_mbr_tbl.Where(a => a.panel_user_id == panel_id && a.psb_ctrl_nbr == psb_ctrl_nbr).Count();
                return JSON(new { message = update.success, icon.success, is_panel }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return JSON(new { message = DbEntityValidationExceptionError(e), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }
        public ActionResult getPanel(string psb_ctrl_nbr){
            CheckSession();
            db.Database.CommandTimeout = Int32.MaxValue;
            try
            {
                var panels = db.psb_sked_mbr_tbl.Where(a => a.psb_ctrl_nbr == psb_ctrl_nbr).ToList();
                return JSON(new { message = update.success, icon.success, panels }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return JSON(new { message = DbEntityValidationExceptionError(e), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }
        public ActionResult getPanelRating(string app_ctrl_nbr, string psb_ctrl_nbr, string panel_user_id)
        {
            CheckSession();
            db.Database.CommandTimeout = Int32.MaxValue;
            var user_id = Session["user_id"].ToString();
            try
            {
                var total_rating = db.sp_applicant_rating(app_ctrl_nbr, panel_user_id).ToList();
                var sp_slide_rating = db.sp_slide_rating(app_ctrl_nbr, psb_ctrl_nbr, panel_user_id).ToList();
                return JSON(new { message = fetch.success, icon = icon.success, total_rating, sp_slide_rating }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return JSON(new { message = DbEntityValidationExceptionError(e), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }
      
        public ActionResult PanelRating(string psb_ctrl_nbr, string app_ctrl_nbr, string item_no, string csc_level)
        {
            CheckSession();
            db.Database.CommandTimeout = Int32.MaxValue;
            var user_id = Session["user_id"].ToString();
            try
            {
                var panel_rating = db.sp_panelrating_perapplicant_list(psb_ctrl_nbr, app_ctrl_nbr, item_no, csc_level).ToList();
                
                return JSON(new { message = fetch.success, icon = icon.success, panel_rating }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return JSON(new { message = DbEntityValidationExceptionError(e), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }
        public ActionResult getItemPerPSBSchedule(string psb_ctrl_nbr, string employment_type, string budget_code)
        {
            CheckSession();
            db.Database.CommandTimeout = Int32.MaxValue;
            var user_id = Session["user_id"].ToString();
            try
            {
                var items = db.sp_items_per_psbschedule(psb_ctrl_nbr).ToList();

                return JSON(new { message = fetch.success, icon = icon.success, items }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return JSON(new { message = DbEntityValidationExceptionError(e), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }

        public ActionResult GetItemsInPSB(string psb_ctrl_nbr, string employment_type, string budget_code)
        {
            CheckSession();
            db.Database.CommandTimeout = Int32.MaxValue;
            var user_id = Session["user_id"].ToString();
            try
            {
               
                var items = from itm in db.psb_sked_item_nbrs
                            join pitm in db.vw_plantilla_items
                            on new { itm.item_no, itm.budget_code} equals new { pitm.item_no, pitm.budget_code}
                            join pos in db.vw_positions_tbl
                            on pitm.position_code equals pos.position_code
                            where itm.psb_ctrl_nbr == psb_ctrl_nbr
                            && itm.employment_type == employment_type
                            && itm.budget_code == budget_code
                            select new
                            {
                                 itm.item_no
                                ,itm.psb_ctrl_nbr
                                ,itm.budget_code
                                ,itm.employment_type
                                ,pos.position_code
                                ,pos.position_title1
                            };

              

                return JSON(new { message = fetch.success, icon = icon.success, items }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return JSON(new { message = DbEntityValidationExceptionError(e), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }

        
    }
}