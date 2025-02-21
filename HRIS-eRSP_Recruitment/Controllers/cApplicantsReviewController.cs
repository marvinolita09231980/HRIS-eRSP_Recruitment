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
            db.Database.CommandTimeout = Int32.MaxValue;
            db2.Database.CommandTimeout = Int32.MaxValue;

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
                db.Database.CommandTimeout = Int32.MaxValue;
                db2.Database.CommandTimeout = Int32.MaxValue;
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
                db.Database.CommandTimeout = Int32.MaxValue;
                db2.Database.CommandTimeout = Int32.MaxValue;
                var department = db2.sp_department_tbl_rct(hiring_period).ToList();
                //var psb_sked_hdr = db2.vw_psb_sked_hdr_tbl.Where(a => a.hiring_period == hiring_period && a.psb_status < 2).ToList();

                var psb_sked_hdr = db2.vw_psb_sked_hdr_tbl.Where(a => a.hiring_period == hiring_period).ToList();
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
                db.Database.CommandTimeout = Int32.MaxValue;
                db2.Database.CommandTimeout = Int32.MaxValue;
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
                db.Database.CommandTimeout = Int32.MaxValue;
                db2.Database.CommandTimeout = Int32.MaxValue;
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
                db.Database.CommandTimeout = Int32.MaxValue;
                db2.Database.CommandTimeout = Int32.MaxValue;

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
                db.Database.CommandTimeout = Int32.MaxValue;
                db2.Database.CommandTimeout = Int32.MaxValue;

                var items = db.available_item_tbl.Where(a => a.budget_code == budget_code 
                && a.employment_type == employment_type 
                && a.department_code == department_code
                && a.ctrl_no == hiring_period).ToList();
                var psb_sked_hdr = db2.vw_psb_sked_hdr_tbl.Where(a => a.hiring_period == hiring_period).ToList();
                return JSON2(new { message = update.success, icon = icon.success, items, psb_sked_hdr}, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return Json(new { message = DbEntityValidationExceptionError(e), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }
        public ActionResult getReviewItem(string item_no, string budget_code, string employment_type, string hiring_period,string department_code)
        {
            CheckSession();
         
            var psb_ctrl_nbr = "";

            List<sp_review_applicant_tbl_list3_Result> review_list = new List<sp_review_applicant_tbl_list3_Result>();
            try
            {
                db.Database.CommandTimeout = Int32.MaxValue;
                db2.Database.CommandTimeout = Int32.MaxValue;
                var pitm = db2.vw_psb_sked_app_item_no_tbl.Where(a => a.item_no == item_no && a.budget_code == budget_code 
                && a.employment_type == employment_type && a.hiring_period == hiring_period).FirstOrDefault();

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
                db.Database.CommandTimeout = Int32.MaxValue;
                db2.Database.CommandTimeout = Int32.MaxValue;
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
                db.Database.CommandTimeout = Int32.MaxValue;
                db2.Database.CommandTimeout = Int32.MaxValue;
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
                db.Database.CommandTimeout = Int32.MaxValue;
                db2.Database.CommandTimeout = Int32.MaxValue;
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
                db.Database.CommandTimeout = Int32.MaxValue;
                db2.Database.CommandTimeout = Int32.MaxValue;
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
                db.Database.CommandTimeout = Int32.MaxValue;
                db2.Database.CommandTimeout = Int32.MaxValue;
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
                db.Database.CommandTimeout = Int32.MaxValue;
                db2.Database.CommandTimeout = Int32.MaxValue;
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
                db.Database.CommandTimeout = Int32.MaxValue;
                db2.Database.CommandTimeout = Int32.MaxValue;
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

       
        public ActionResult SaveForPsbSched(string psb_ctrl_nbr, 
            string app_ctrl_nbr, 
            string item_no, 
            string budget_code, 
            string employment_type, 
            string hiring_period
        )
        {
            CheckSession();
            var user_id = Session["user_id"].ToString();
            var message = "";
            var icn = "";
            try
            {
                db.Database.CommandTimeout = Int32.MaxValue;
                db2.Database.CommandTimeout = Int32.MaxValue;
                psb_sked_app_tbl ps = db2.psb_sked_app_tbl.Where(a => a.app_ctrl_nbr == app_ctrl_nbr && a.psb_ctrl_nbr == psb_ctrl_nbr).FirstOrDefault();
                if (ps == null)
                {
                    throw new Exception("The applicant has already been added to the HRMPSB screening!");
                }
                ps = new psb_sked_app_tbl();
                ps.psb_ctrl_nbr = psb_ctrl_nbr;
                ps.app_ctrl_nbr = app_ctrl_nbr;
                db2.psb_sked_app_tbl.Add(ps);

                var dbx = db2.applicants_review_tbl.Where(a => a.app_ctrl_nbr == app_ctrl_nbr).FirstOrDefault();
                dbx.app_status = "2";
                db2.SaveChanges();
                message = "Successfully added to HRMPSB schedule";
                icn = icon.success;
              
                var review_list = db2.sp_review_applicant_tbl_list3(item_no, employment_type, budget_code, hiring_period).ToList();
                return JSON2(new { message , icon = icn, review_list}, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                  message = e.Message;
                return Json(new { message = message, icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }

        public ActionResult RemoveFromHRMPSBScreening(string psb_ctrl_nbr,
          string app_ctrl_nbr,
          string item_no,
          string budget_code,
          string employment_type,
          string hiring_period
         )
        {
            CheckSession();
            var user_id = Session["user_id"].ToString();
            var message = "";
            var icn = "";
            try
            {
                db.Database.CommandTimeout = Int32.MaxValue;
                db2.Database.CommandTimeout = Int32.MaxValue;
                psb_sked_app_tbl ps = db2.psb_sked_app_tbl.Where(a => a.app_ctrl_nbr == app_ctrl_nbr && a.psb_ctrl_nbr == psb_ctrl_nbr).FirstOrDefault();
                if (ps == null)
                {
                    throw new Exception("The applicant has already been added to the HRMPSB screening!");
                }
                ps = new psb_sked_app_tbl();
                ps.psb_ctrl_nbr = psb_ctrl_nbr;
                ps.app_ctrl_nbr = app_ctrl_nbr;
                db2.psb_sked_app_tbl.Add(ps);

                var dbx = db2.applicants_review_tbl.Where(a => a.app_ctrl_nbr == app_ctrl_nbr).FirstOrDefault();
                dbx.app_status = "2";
                db2.SaveChanges();
                message = "Successfully added to HRMPSB schedule";
                icn = icon.success;

                var review_list = db2.sp_review_applicant_tbl_list3(item_no, employment_type, budget_code, hiring_period).ToList();
                return JSON2(new { message, icon = icn, review_list }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                message = e.Message;
                return Json(new { message = message, icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }
        public ActionResult getPsbSchedList(string item_no,string app_ctrl_nbr)
        {
            CheckSession();
            var message = "";
            object pnl = new object();
            var icn = "";
            try
            {
                db.Database.CommandTimeout = Int32.MaxValue;
                db2.Database.CommandTimeout = Int32.MaxValue;
                var inpsb = (from d in db2.psb_sked_app_tbl
                             join e in db2.psb_sked_hdr_tbl
                             on d.psb_ctrl_nbr equals e.psb_ctrl_nbr
                             where d.app_ctrl_nbr == app_ctrl_nbr
                             select new
                             {
                                
                                  e.psb_date
                                 ,e.remarks_details
                             }).ToList();

                if (inpsb.Count() > 0)
                {
                    var strtdate= DateTime.ParseExact(inpsb[0].psb_date.ToString(), "MM/d/yyyy", CultureInfo.InvariantCulture);
                    throw new Exception("Applicants already added in HRMPSB schedule on " + strtdate +" " + inpsb[0].remarks_details);
                }
                var itm = db2.sp_item_psb_schedule(item_no).ToList();
                var itm_rw = itm.FirstOrDefault();
                if(itm.Count() == 0)
                {
                    throw new Exception("Applicants item not scheduled for PSB Screening");
                }
                else
                {
                    pnl = db2.psb_sked_mbr_tbl.Where(a => a.psb_ctrl_nbr == itm_rw.psb_ctrl_nbr).ToList();

                    icn = "success";
                }
                return JSON2(new { message, icon = icn, itm, pnl}, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                return Json(new { message = e.Message, icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }
        public ActionResult getPsbPanelMember(string psb_ctrl_nbr)
        {
            CheckSession();
            try
            {
                db.Database.CommandTimeout = Int32.MaxValue;
                db2.Database.CommandTimeout = Int32.MaxValue;
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
                db.Database.CommandTimeout = Int32.MaxValue;
                db2.Database.CommandTimeout = Int32.MaxValue;
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
                db.Database.CommandTimeout = Int32.MaxValue;
                db2.Database.CommandTimeout = Int32.MaxValue;
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
                db.Database.CommandTimeout = Int32.MaxValue;
                db2.Database.CommandTimeout = Int32.MaxValue;
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
                db.Database.CommandTimeout = Int32.MaxValue;
                db2.Database.CommandTimeout = Int32.MaxValue;
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
                db.Database.CommandTimeout = Int32.MaxValue;
                db2.Database.CommandTimeout = Int32.MaxValue;

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

        public ActionResult GetEmailNotification2(sp_review_applicant_tbl_list3_Result dt, string email_type)
        {
            CheckSession();

            var user_id = Session["user_id"].ToString();

            DateTime dttm = DateTime.Now;
            try
            {
                db.Database.CommandTimeout = Int32.MaxValue;
                db2.Database.CommandTimeout = Int32.MaxValue;
                var app = db2.vw_applicants_progress_tbl.Where(a => a.app_ctrl_nbr == dt.app_ctrl_nbr).FirstOrDefault();
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
                }
                var email_settup = db2.sp_send_email_notification(dt.email_address, dt.empl_id, dt.app_ctrl_nbr, dt.hiring_period, email_type).FirstOrDefault();

                return JSON2(new { email_settup, message = "Applicants is successfully notified!", icon = "success" }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                string message = e.Message;
                return Json(new { message = message, icon = "error" }, JsonRequestBehavior.AllowGet);
            }
        }


        public ActionResult sendEmailNotification2(sp_review_applicant_tbl_list3_Result dt, string email_type, sp_send_email_notification_Result email_settup)
        {
            CheckSession();
            var email_subject = "";


            var user_id = Session["user_id"].ToString();
            var mi = "";
            DateTime dttm = DateTime.Now;
            try
            {
                db.Database.CommandTimeout = Int32.MaxValue;
                db2.Database.CommandTimeout = Int32.MaxValue;

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
                    var appreview = db2.applicants_review_tbl.Where(a => a.app_ctrl_nbr == dt.app_ctrl_nbr).FirstOrDefault();
                    appreview.email_aknowldge_dttm = dttm;
                    appreview.email_aknowldge_by = user_id;
                    appreview.aknowledge_dttm = dttm;
                    appreview.aknowledge_by = user_id;

                    email_subject = "Aknowledge application email";
                }
                else if (email_type == "2")
                {
                    var appreview = db2.applicants_review_tbl.Where(a => a.app_ctrl_nbr == dt.app_ctrl_nbr).FirstOrDefault();
                    appreview.email_aknowldge_regret_dttm = dttm;
                    appreview.email_aknowldge_regret_by = user_id;

                    email_subject = "email evaluated but not qualified to proceed to online exam";

                }

                else if (email_type == "3")
                {
                    var appreview = db2.applicants_review_tbl.Where(a => a.app_ctrl_nbr == dt.app_ctrl_nbr).FirstOrDefault();
                    appreview.email_noti_exam_dttm = dttm;
                    appreview.email_noti_exam_by = user_id;
                    email_subject = "Qualify for examination";
                }
                else if (email_type == "4")
                {
                    var appreview = db2.applicants_review_tbl.Where(a => a.app_ctrl_nbr == dt.app_ctrl_nbr).FirstOrDefault();
                    appreview.email_regret_dttm = dttm;
                    appreview.email_regret_by = user_id;
                    email_subject = "Regret letter to inform that another candidate was choosen for the position";
                }
                else if (email_type == "5")
                {
                    var appreview = db2.applicants_review_tbl.Where(a => a.app_ctrl_nbr == dt.app_ctrl_nbr).FirstOrDefault();
                    appreview.email_noti_hrmpsb_dttm = dttm;
                    appreview.email_noti_hrmpsb_by = user_id;
                    email_subject = "Qualify for HRMPSB Screening";
                }
                else if (email_type == "6")
                {
                    var appreview = db2.applicants_review_tbl.Where(a => a.app_ctrl_nbr == dt.app_ctrl_nbr).FirstOrDefault();
                    appreview.email_notintop5_dttm = dttm;
                    appreview.email_notintop5_by = user_id;
                    email_subject = "Not in top 5 examinees";
                }
                else if (email_type == "7")
                {
                    var appreview = db2.applicants_review_tbl.Where(a => a.app_ctrl_nbr == dt.app_ctrl_nbr).FirstOrDefault();
                    appreview.email_congratulatory_dttm = dttm;
                    appreview.email_congratulatory_by = user_id;
                    email_subject = "Congratulatory letter";
                }

                applicants_email_sent_items ems = new applicants_email_sent_items();
                ems.app_ctrl_nbr = dt.app_ctrl_nbr == null ? "" : dt.app_ctrl_nbr;
                ems.first_name = dt.first_name;
                ems.last_name = dt.last_name;
                ems.middle_name = dt.middle_name;
                ems.email_address = dt.email_add;
                ems.hiring_period = dt.hiring_period;
                ems.email_subject = email_subject;
                ems.created_dttm = dttm.ToString();
                ems.created_by_user = user_id;
                db2.applicants_email_sent_items.Add(ems);


                using (MailMessage mm = new MailMessage(email_settup.email_from, dt.email_add))
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


                db2.SaveChanges();


                var apr = db2.vw_applicants_review_tbl.Where(a => a.app_ctrl_nbr == dt.app_ctrl_nbr).FirstOrDefault();

                sendingEmailList se = new sendingEmailList();
                se.app_ctrl_nbr = dt.app_ctrl_nbr == null ? "" : dt.app_ctrl_nbr;
                se.applicant_name = dt.first_name + " " + mi + ". " + dt.last_name;
                se.email_address = dt.email_add;
                se.email_aknowldge_dttm = apr.email_aknowldge_dttm.ToString();
                se.email_aknowldge_regret_dttm = apr.email_aknowldge_regret_dttm.ToString();
                se.email_noti_exam_dttm = apr.email_noti_exam_dttm.ToString();
                se.email_regret_dttm = apr.email_regret_dttm.ToString();
                se.email_noti_hrmpsb_dttm = apr.email_noti_hrmpsb_dttm.ToString();
                se.email_notintop5_dttm = apr.email_notintop5_dttm.ToString();
                se.email_congratulatory_dttm = apr.email_congratulatory_dttm.ToString();
                se.status = true;

                var empl_id = user_id.Substring(1, user_id.Length - 1);
                var personnelname = db2.vw_personnelnames_tbl_RCT.Where(a => a.empl_id == empl_id).FirstOrDefault();
                var employee_name = personnelname.employee_name;


                return JSON2(new { employee_name, message = "Applicants is successfully notified!", icon = "success", se }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                string message = DbEntityValidationExceptionError(e);
                return Json(new { message = message, icon = "error" }, JsonRequestBehavior.AllowGet);
            }
        }



        public ActionResult sendEmailNotification(sp_review_applicant_tbl_list3_Result dt, string email_type)
        {
            CheckSession();
            var email_subject = "";
            var user_id = Session["user_id"].ToString();
            var mi = "";

           

            DateTime dttm = DateTime.Now;    
            try
            {
                db.Database.CommandTimeout = Int32.MaxValue;
                db2.Database.CommandTimeout = Int32.MaxValue;


                var email_settup = db2.sp_send_email_notification(dt.email_address, dt.empl_id, dt.app_ctrl_nbr, dt.hiring_period, email_type).FirstOrDefault();


              

               
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
                    var appreview = db2.applicants_review_tbl.Where(a => a.app_ctrl_nbr == dt.app_ctrl_nbr).FirstOrDefault();
                    appreview.email_aknowldge_dttm = dttm;
                    appreview.email_aknowldge_by = user_id;
                    appreview.aknowledge_dttm = dttm;
                    appreview.aknowledge_by = user_id;

                    email_subject = "Aknowledge application email";

                }
                else if (email_type == "2")
                {
                    var appreview = db2.applicants_review_tbl.Where(a => a.app_ctrl_nbr == dt.app_ctrl_nbr).FirstOrDefault();
                    appreview.email_aknowldge_regret_dttm = dttm;
                    appreview.email_aknowldge_regret_by = user_id;

                    email_subject = "email evaluated but not qualified to proceed to online exam.";

                }
                

               
                applicants_email_sent_items ems = new applicants_email_sent_items();
                ems.app_ctrl_nbr = dt.app_ctrl_nbr == null ? "" : dt.app_ctrl_nbr;
                ems.first_name = dt.first_name;
                ems.last_name = dt.last_name;
                ems.middle_name = dt.middle_name;
                ems.email_address = dt.email_address;
                ems.hiring_period = dt.hiring_period;
                ems.email_subject = email_subject;
                ems.created_dttm = dttm.ToString();
                ems.created_by_user = user_id;
                db2.applicants_email_sent_items.Add(ems);

                using (MailMessage mm = new MailMessage(email_settup.email_from, dt.email_address))
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

                db2.SaveChanges();


                var apr = db2.vw_applicants_review_tbl.Where(a => a.app_ctrl_nbr == dt.app_ctrl_nbr).FirstOrDefault();


                sendingEmailList se = new sendingEmailList();
                se.app_ctrl_nbr = dt.app_ctrl_nbr == null ? "" : dt.app_ctrl_nbr;
                se.applicant_name = dt.first_name + " " + mi + ". " + dt.last_name;
                se.email_address = dt.email_address;
                se.email_aknowldge_dttm = apr.email_aknowldge_dttm.ToString();
                se.email_aknowldge_regret_dttm = apr.email_aknowldge_regret_dttm.ToString();
                se.email_noti_exam_dttm = apr.email_noti_exam_dttm.ToString();
                se.email_regret_dttm = apr.email_regret_dttm.ToString();
                se.email_noti_hrmpsb_dttm = apr.email_noti_hrmpsb_dttm.ToString();
                se.email_notintop5_dttm = apr.email_notintop5_dttm.ToString();
                se.email_congratulatory_dttm = apr.email_congratulatory_dttm.ToString();
                se.status = true;

                return JSON2(new { message = "Applicants is successfully notified!", icon = "success", se }, JsonRequestBehavior.AllowGet);
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
                db.Database.CommandTimeout = Int32.MaxValue;
                db2.Database.CommandTimeout = Int32.MaxValue;
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
                db.Database.CommandTimeout = Int32.MaxValue;
                db2.Database.CommandTimeout = Int32.MaxValue;
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
                db.Database.CommandTimeout = Int32.MaxValue;
                db2.Database.CommandTimeout = Int32.MaxValue;
                var apl_list = db2.sp_reg_applicant_pdsID(empl_id).ToList();
                return JSON2(new { message = delete.success, icon = icon.success, apl_list }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException exp)
            {
                return Json(new { message = DbEntityValidationExceptionError(exp), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        } 
        public ActionResult addToPSB(string item_no, string app_ctrl_nbr, string employment_type, string budget_code,string hiring_period,string psb_ctrl_nbr, string department_code)
        {
            var message = "";
            var icn = "";
            var user = Session["user_id"].ToString();
            var datenow = DateTime.Now;
            try
            {
                db.Database.CommandTimeout = Int32.MaxValue;
                db2.Database.CommandTimeout = Int32.MaxValue;
                List<sp_review_applicant_tbl_list3_Result> review_list = new List<sp_review_applicant_tbl_list3_Result>();

                
                

                var ps2 = db2.psb_sked_hdr_tbl.Where(a => a.psb_ctrl_nbr == psb_ctrl_nbr).FirstOrDefault();
                if (ps2 != null && ps2.psb_status >= 2)
                {
                    throw new Exception("Cannot add applicants from PSB schedule that is already concluded");
                }
                //var ps3 = db2.vw_applicants_progress_tbl.Where(a => a.app_ctrl_nbr == app_ctrl_nbr).FirstOrDefault();
                //if (ps3.email_noti_hrmpsb_dttm != "" && ps3.email_noti_hrmpsb_dttm != "1900-01-01")
                //{
                //    throw new Exception("The applicant has already been notified for the HRMPSB screening!");
                //}

                
                    var prog = db2.applicant_qualified_progress_tbl.Where(a => a.app_ctrl_nbr == app_ctrl_nbr).FirstOrDefault();
                    prog.quali_hrmpsb = true;
                    prog.quali_hrmpsb_by = user;
                    prog.quali_hrmpsb_dttm = datenow;

                    var ps = db2.psb_sked_app_tbl.Where(a => a.app_ctrl_nbr == app_ctrl_nbr && a.psb_ctrl_nbr == psb_ctrl_nbr).FirstOrDefault();
                    if (ps == null)
                    {
                        psb_sked_app_tbl ap = new psb_sked_app_tbl();
                        ap.app_ctrl_nbr = app_ctrl_nbr;
                        ap.psb_ctrl_nbr = psb_ctrl_nbr;
                        db2.psb_sked_app_tbl.Add(ap);
                    }

                    var apl = db2.applicants_review_tbl.Where(a => a.app_ctrl_nbr == app_ctrl_nbr).FirstOrDefault();
                    apl.app_status = "2";
                    db2.SaveChanges();

                        var inpsb = (from p in db2.psb_sked_item_nbrs
                                     where p.item_no == item_no
                                      && p.employment_type == employment_type
                                      && p.budget_code == budget_code
                                      && p.psb_ctrl_nbr == psb_ctrl_nbr
                                     select new
                                     {
                                         p.psb_ctrl_nbr,
                                         p.employment_type,
                                         p.budget_code
                                     }).ToList();
                        if (inpsb.Count() == 0)
                        {
                            psb_sked_item_nbrs pi = new psb_sked_item_nbrs();
                            pi.item_no = item_no;
                            pi.psb_ctrl_nbr = psb_ctrl_nbr;
                            pi.endorse_no = 0;
                            pi.selected_approved = false;
                            pi.budget_code = budget_code;
                            pi.employment_type = employment_type;
                            pi.department_code = department_code;
                            pi.panel_01_02         = false;
                            pi.panel_03            = false;
                            pi.panel_04            = false;
                            pi.panel_05 = false;
                            db2.psb_sked_item_nbrs.Add(pi);
                            db2.SaveChanges();
                        }
                       
                        message = "Applicants is successfully added to PSb schedule";
                        icn = "success";

                 db2.sp_psb_pnl_rtg_tbl_qsupdate(psb_ctrl_nbr, app_ctrl_nbr);

                 review_list = db2.sp_review_applicant_tbl_list3(item_no, employment_type, budget_code, hiring_period).ToList();
                return JSON2(new {message, icon = icn, review_list }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException exp)
            {
                return Json(new { message = DbEntityValidationExceptionError(exp), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
            //catch (Exception exp)
            //{
            //    return Json(new { message = exp.Message, icon = icon.error }, JsonRequestBehavior.AllowGet);
            //}
        }
        public ActionResult addToPSBAll(List<app_ctrl_nbr_list_2> data)
        {
            var message = "";
            var icn = "";
            var user = Session["user_id"].ToString();
            var datenow = DateTime.Now;

            var psb_ctrl_nbr = data[0].psb_ctrl_nbr;
            var app_ctrl_nbr = data[0].app_ctrl_nbr;
            var item_no = data[0].item_no;
            var employment_type = data[0].employment_type;
            var budget_code = data[0].budget_code;
            var hiring_period = data[0].hiring_period;
            List<app_ctrl_nbr_list_2> insert_failed_list = new List<app_ctrl_nbr_list_2>();
            db.Database.CommandTimeout = Int32.MaxValue;
            db2.Database.CommandTimeout = Int32.MaxValue;
            List<sp_review_applicant_tbl_list3_Result> review_list = new List<sp_review_applicant_tbl_list3_Result>();
            try
            {
                var error_text = "";

                var psb= db2.psb_sked_hdr_tbl.Where(a => a.psb_ctrl_nbr == psb_ctrl_nbr).FirstOrDefault();
                if (psb != null)
                {
                    if (psb.psb_status < 2)
                    {
                        for (var x = 0; x < data.Count(); x++)
                        {

                            var x_psb_ctrl_nbr = data[x].psb_ctrl_nbr;
                            var x_app_ctrl_nbr = data[x].app_ctrl_nbr;
                            var x_item_no = data[x].item_no;
                            var x_employment_type = data[x].employment_type;
                            var x_budget_code = data[x].budget_code;
                            var x_department_code = data[x].department_code;
                            var x_hiring_period = data[x].hiring_period;

                            var SQL_ST = db2.sp_add_to_hrmpsb(x_psb_ctrl_nbr, x_app_ctrl_nbr, x_item_no, x_employment_type, x_budget_code, x_hiring_period, x_department_code, user).FirstOrDefault();

                            if (SQL_ST != null && SQL_ST.errorcode == "0")
                            {
                                insert_failed_list.Add(data[x]);
                            }

                        }
                    }
                    else
                    {
                        throw new Exception("Cannot add applicants from HRMPSB schedule that is already concluded.");
                    }
                }
                

                message = "Applicants is successfully added to PSb schedule";
                icn = "success";



                review_list = db2.sp_review_applicant_tbl_list3(item_no, employment_type, budget_code, hiring_period).ToList();
                return JSON2(new { message = message, icon = icn, review_list, insert_failed_list}, JsonRequestBehavior.AllowGet);
            }
            //catch (DbEntityValidationException exp)
            //{
            //    message = DbEntityValidationExceptionError(exp);
            //    review_list = db2.sp_review_applicant_tbl_list3(item_no, employment_type, budget_code, hiring_period).ToList();
            //    return JSON2(new { message = message, icon = icon.error, review_list }, JsonRequestBehavior.AllowGet);
            //}
            catch (Exception exp)
            {
                review_list = db2.sp_review_applicant_tbl_list3(item_no, employment_type, budget_code, hiring_period).ToList();
                return JSON2(new { message = exp.Message, icon = icon.error, review_list }, JsonRequestBehavior.AllowGet);
            }
        }


        public ActionResult sp_psb_pnl_rtg_tbl_qsupdate(string app_ctrl_nbr, string psb_ctrl_nbr,string employment_type,string budget_code,string hiring_period,string item_no)
        {
            try
            {
              
                db2.Database.CommandTimeout = Int32.MaxValue;
                var sp_psb_pnl_rtg_tbl_qsupdate = db2.sp_psb_pnl_rtg_tbl_qsupdate(psb_ctrl_nbr, app_ctrl_nbr).FirstOrDefault();
                if(sp_psb_pnl_rtg_tbl_qsupdate.db_code == "0")
                {
                    throw new Exception(sp_psb_pnl_rtg_tbl_qsupdate.db_message);
                }
                var review_list = db2.sp_review_applicant_tbl_list3(item_no, employment_type, budget_code, hiring_period).ToList();
                return JSON2(new { message="Successfully added!", icon = icon.success, review_list }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException exp)
            {
                return Json(new { message = DbEntityValidationExceptionError(exp), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }

        public ActionResult removeFromPsb(string item_no, string app_ctrl_nbr,string employment_type, string budget_code, string hiring_period, string psb_ctrl_nbr)
        {
            var message = "";
            var icn = "";
            try
            {
                db.Database.CommandTimeout = Int32.MaxValue;
                db2.Database.CommandTimeout = Int32.MaxValue;

                List<sp_review_applicant_tbl_list3_Result> review_list = new List<sp_review_applicant_tbl_list3_Result>();

                

                var ps1 = db2.psb_sked_hdr_tbl.Where(a => a.psb_ctrl_nbr == psb_ctrl_nbr).FirstOrDefault();
               
                if (ps1.psb_status >= 2)
                {
                    throw new Exception("Cannot remove applicants from PSB schedule that is already concluded");
                }

                var ps2 = db2.vw_applicants_progress_tbl.Where(a => a.app_ctrl_nbr == app_ctrl_nbr).FirstOrDefault();
                if (ps2 != null && ps2.email_noti_hrmpsb_dttm != "")
                {
                    throw new Exception("The applicant has already been notified for the HRMPSB screening!");
                }

                var prog = db2.applicant_qualified_progress_tbl.Where(a => a.app_ctrl_nbr == app_ctrl_nbr).FirstOrDefault();
                prog.quali_hrmpsb = null;
                prog.quali_hrmpsb_by = null;
                prog.quali_hrmpsb_dttm = null;

                var app = db2.psb_sked_app_tbl.Where(a => a.app_ctrl_nbr == app_ctrl_nbr && a.psb_ctrl_nbr == psb_ctrl_nbr).FirstOrDefault();

                if(app != null) db2.psb_sked_app_tbl.Remove(app);


                var apl = db2.applicants_review_tbl.Where(a => a.app_ctrl_nbr == app_ctrl_nbr).FirstOrDefault();
                apl.app_status = "1";
                db2.SaveChanges();

                var inpsb = (from p in db2.vw_psb_sked_app_item_no_tbl
                             where p.item_no == item_no
                             && p.employment_type == employment_type
                             && p.budget_code == budget_code
                             && p.psb_ctrl_nbr == psb_ctrl_nbr
                             select new
                             {
                                 p.psb_ctrl_nbr,
                                 p.employment_type,
                                 p.budget_code
                             }).ToList();

                if (inpsb.Count() == 0)
                {
                    var pi = db2.psb_sked_item_nbrs.Where(a => a.item_no == item_no && a.psb_ctrl_nbr == psb_ctrl_nbr
                    && a.budget_code == budget_code && a.employment_type == employment_type).FirstOrDefault();
                    if(pi != null)db2.psb_sked_item_nbrs.Remove(pi);
                    db2.SaveChanges();
                }

               
                message = "Applicants is successfully removed from PSb schedule";
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
                db.Database.CommandTimeout = Int32.MaxValue;
                db2.Database.CommandTimeout = Int32.MaxValue;
                var psbskedhdr = db2.sp_psb_sked_hdr_tbl_list(employment_type,budget_code).ToList();
                return JSON2(new { icon = icon.success, psbskedhdr }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException exp)
            {
                return Json(new { message = DbEntityValidationExceptionError(exp), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }

        public ActionResult GetExamSchedules(string app_ctrl_nbr)
        {
            try
            {
                db.Database.CommandTimeout = Int32.MaxValue;
                db2.Database.CommandTimeout = Int32.MaxValue;
                var examschedules = db2.sp_exam_schedule_tbl(app_ctrl_nbr).ToList();
                return JSON2(new { icon = icon.success, examschedules }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException exp)
            {
                return Json(new { message = DbEntityValidationExceptionError(exp), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }

        public ActionResult GetExamSchedulesAll()
        {
            try
            {
                db.Database.CommandTimeout = Int32.MaxValue;
                db2.Database.CommandTimeout = Int32.MaxValue;
                var examschedulesAll = db2.sp_exam_schedule_tbl_2().ToList();
                return JSON2(new { icon = icon.success, examschedulesAll }, JsonRequestBehavior.AllowGet);
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
                db.Database.CommandTimeout = Int32.MaxValue;
                db2.Database.CommandTimeout = Int32.MaxValue;
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
        public ActionResult SetExamScheduleAll(
            List<app_ctrl_nbr_list_2> app_ctrl_nbr_list
          , string hiring_period
          , string item_no
          , string budget_code
          , string employment_type
          , int exam_id
          )
        {
            try
            {
                db.Database.CommandTimeout = Int32.MaxValue;
                db2.Database.CommandTimeout = Int32.MaxValue;
                
                for (var x = 0; x < app_ctrl_nbr_list.Count(); x++)
                {
                    var app_ctrl_nbr = app_ctrl_nbr_list[x].app_ctrl_nbr;
                    var ap_review_tbl = db2.applicants_review_tbl.Where(a => a.app_ctrl_nbr == app_ctrl_nbr).FirstOrDefault();
                    ap_review_tbl.exam_id = exam_id;
                    db2.SaveChanges();
                }
                
               var review_list = db2.sp_review_applicant_tbl_list3(item_no, employment_type, budget_code, hiring_period).ToList();
               return JSON2(new { message = "Successfully set exam date", icon = icon.success, review_list }, JsonRequestBehavior.AllowGet);
                
            }
            catch (DbEntityValidationException exp)
            {
                return Json(new { message = DbEntityValidationExceptionError(exp), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }
        public ActionResult ViewDates(string app_ctrl_nbr)
        {
            try
            {
                db.Database.CommandTimeout = Int32.MaxValue;
                db2.Database.CommandTimeout = Int32.MaxValue;
                var viewdates = db2.vw_applicants_review_dates_names.Where(a => a.app_ctrl_nbr == app_ctrl_nbr).ToList();
                return JSON2(new { icon = icon.success, viewdates}, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException exp)
            {
                return Json(new { message = DbEntityValidationExceptionError(exp), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }
        public ActionResult ViewExam(string app_ctrl_nbr)
        {
            try
            {
                db.Database.CommandTimeout = Int32.MaxValue;
                db2.Database.CommandTimeout = Int32.MaxValue;
                var viewexam = db2.vw_applicant_examination_tbl.Where(a => a.app_ctrl_nbr == app_ctrl_nbr).ToList();
                return JSON2(new { icon = icon.success, viewexam}, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException exp)
            {
                return Json(new { message = DbEntityValidationExceptionError(exp), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }

        public ActionResult AddToTop5Examinees(string app_ctrl_nbr)
        {
            CheckSession();
            try
            {
                db.Database.CommandTimeout = Int32.MaxValue;
                db2.Database.CommandTimeout = Int32.MaxValue;
                var datenow = DateTime.Now;
                var user = Session["user_id"].ToString();
                var x = db2.vw_applicants_progress_tbl.Where(a => a.app_ctrl_nbr == app_ctrl_nbr).FirstOrDefault();
                if (x.score_rendered == 0)
                {
                    throw new Exception("The applicants have not received exam ratings yet!");
                }
                if (x.email_aknowldge_regret_dttm != "")
                {
                    throw new Exception("The applicant has already been notified of disqualification from the exam!");
                }
                var app = db2.applicant_qualified_progress_tbl.Where(a => a.app_ctrl_nbr == app_ctrl_nbr).FirstOrDefault();
               
                if (app == null)
                {
                    applicant_qualified_progress_tbl prog = new applicant_qualified_progress_tbl();
                    prog.app_ctrl_nbr = app_ctrl_nbr;
                    prog.top5examinees = true;
                    prog.top5examinees_dttm = datenow;
                    prog.top5examinees_by = user;
                    //prog.congratulatory = false;
                    db2.applicant_qualified_progress_tbl.Add(prog);
                }
                else
                {
                    app.top5examinees = true;
                    app.top5examinees_dttm = datenow;
                    app.top5examinees_by = user;
                }
                db2.SaveChanges();

                var review_list = db2.sp_review_applicant_tbl_list3(x.item_no, x.employment_type, x.budget_code, x.hiring_period).ToList();
                return JSON(new { message = "Successfully added to top 5 examinees", icon = icon.success, review_list}, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                var message = e.Message;
                return Json(new { message = message, icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }

        public ActionResult AddToTop5ExamineesAll(List<app_ctrl_nbr_list_2> data)
        {
            CheckSession();

            List<sp_review_applicant_tbl_list3_Result> review_list = new List<sp_review_applicant_tbl_list3_Result>();

            db.Database.CommandTimeout = Int32.MaxValue;
            db2.Database.CommandTimeout = Int32.MaxValue;
            var datenow = DateTime.Now;
            var user = Session["user_id"].ToString();
            var item_no = data[0].item_no;
            var employment_type = data[0].employment_type;
            var budget_code = data[0].budget_code;
            var hiring_period = data[0].hiring_period;

            try
            {
               

               
                for (var x = 0; x < data.Count(); x++)
                {
                    var app_ctrl_nbr = data[x].app_ctrl_nbr;
                    var z = db2.vw_applicants_progress_tbl.Where(a => a.app_ctrl_nbr == app_ctrl_nbr).FirstOrDefault();
                    if (z != null)
                    {

                        if (z.score_rendered == 0)
                        {
                            throw new Exception(" applicants have not received exam ratings yet!");
                        }

                        if (z.email_aknowldge_regret_dttm != "")
                        {
                            throw new Exception("The applicant has already been notified of disqualification from the exam!");
                        }
                    }

                    var app = db2.applicant_qualified_progress_tbl.Where(a => a.app_ctrl_nbr == app_ctrl_nbr).FirstOrDefault();

                    if (app == null)
                    {
                        applicant_qualified_progress_tbl prog = new applicant_qualified_progress_tbl();
                        prog.app_ctrl_nbr = data[x].app_ctrl_nbr;
                        prog.top5examinees = true;
                        prog.top5examinees_dttm = datenow;
                        prog.top5examinees_by = user;
                        //prog.congratulatory = false;
                        db2.applicant_qualified_progress_tbl.Add(prog);
                    }
                    else
                    {
                        app.top5examinees = true;
                        app.top5examinees_dttm = datenow;
                        app.top5examinees_by = user;
                    }
                }

                db2.SaveChanges();

                review_list = db2.sp_review_applicant_tbl_list3(item_no, employment_type, budget_code, hiring_period).ToList();
                return JSON(new { message = "Successfully added to top 5 examinees", icon = icon.success, review_list }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                var message = e.Message;
                review_list = db2.sp_review_applicant_tbl_list3(item_no, employment_type, budget_code, hiring_period).ToList();
                return Json(new { message = message, icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }

        public ActionResult RemoveFromTop5Examinees(string app_ctrl_nbr)
        {
            CheckSession();
            try
            {
                db.Database.CommandTimeout = Int32.MaxValue;
                db2.Database.CommandTimeout = Int32.MaxValue;
                var datenow = DateTime.Now;
                var user = Session["user_id"].ToString();
                var x = db2.vw_applicants_progress_tbl.Where(a => a.app_ctrl_nbr == app_ctrl_nbr).FirstOrDefault();
                if (x.quali_hrmpsb == true)
                {
                    throw new Exception("The applicants have already been added to the HRMPSB screening!");
                }
                
                var app = db2.applicant_qualified_progress_tbl.Where(a => a.app_ctrl_nbr == app_ctrl_nbr).FirstOrDefault();

                if (app != null)
                {

                   
                   
                    app.top5examinees = null;
                    app.top5examinees_dttm = null;
                    app.top5examinees_by = null;
                    //prog.congratulatory = false;
                    
                }
               
                db2.SaveChanges();

                var review_list = db2.sp_review_applicant_tbl_list3(x.item_no, x.employment_type, x.budget_code, x.hiring_period).ToList();
                return JSON(new { message = "Successfully remove from top 5 examinees", icon = icon.success, review_list }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                var message = e.Message;
                return Json(new { message = message, icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }


        public ActionResult RemoveFromShortlist(string app_ctrl_nbr)
        {
            CheckSession();
            try
            {
                db.Database.CommandTimeout = Int32.MaxValue;
                db2.Database.CommandTimeout = Int32.MaxValue;
                var datenow = DateTime.Now;
                var user = Session["user_id"].ToString();
                var x = db2.vw_applicants_progress_tbl.Where(a => a.app_ctrl_nbr == app_ctrl_nbr).FirstOrDefault();
                if (x.score_rendered != 0)
                {
                    throw new Exception("The applicants have already taken the exam!");
                }
                if (x.top5examinees == true)
                {
                    throw new Exception("The applicant is already one of the top 5 examinees!");
                }
                var app = db2.applicant_qualified_progress_tbl.Where(a => a.app_ctrl_nbr == app_ctrl_nbr).FirstOrDefault();

                if (app != null)
                {
                    app.quali_onlineexam = null;
                    app.quali_onlineexam_dttm = null;
                    app.top5examinees_by = null;
                }
               
                db2.SaveChanges();

                var review_list = db2.sp_review_applicant_tbl_list3(x.item_no, x.employment_type, x.budget_code, x.hiring_period).ToList();
                return JSON(new { message = "Successfully remove from shortlist!", icon = icon.success, review_list }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                var message = e.Message;
                return Json(new { message = message, icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }

        public ActionResult AddToHRMPSBScreening(string app_ctrl_nbr,string psb_ctrl_nbr)
        {
            CheckSession();
            try
            {
                db.Database.CommandTimeout = Int32.MaxValue;
                db2.Database.CommandTimeout = Int32.MaxValue;
                var datenow = DateTime.Now;
                var user = Session["user_id"].ToString();
                var x = db2.vw_applicants_progress_tbl.Where(a => a.app_ctrl_nbr == app_ctrl_nbr).FirstOrDefault();

                if (x.top5examinees == false)
                {
                    throw new Exception("The applicant has not yet been shortlisted for HRMPSB Screening!");
                }
                
                var app = db2.applicant_qualified_progress_tbl.Where(a => a.app_ctrl_nbr == app_ctrl_nbr).FirstOrDefault();

                if (app == null)
                {
                    applicant_qualified_progress_tbl prog = new applicant_qualified_progress_tbl();
                    prog.app_ctrl_nbr = app_ctrl_nbr;
                    prog.quali_hrmpsb = true;
                    prog.quali_hrmpsb_dttm = datenow;
                    prog.quali_hrmpsb_by = user;
                    db2.applicant_qualified_progress_tbl.Add(prog);
                }
                else
                {
                    app.quali_hrmpsb = true;
                    app.quali_hrmpsb_dttm = datenow;
                    app.quali_hrmpsb_by = user;
                }

                db2.SaveChanges();

                var review_list = db2.sp_review_applicant_tbl_list3(x.item_no, x.employment_type, x.budget_code, x.hiring_period).ToList();

                return JSON(new { message = "Successfully added to HRMPSB Screening", icon = icon.success, review_list}, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                var message = e.Message;
                return Json(new { message = message, icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }

        public ActionResult SaveExam(string app_ctrl_nbr, string score_rendered, string exam_type_descr, string exam_date)
        {
            try
            {
                db.Database.CommandTimeout = Int32.MaxValue;
                db2.Database.CommandTimeout = Int32.MaxValue;

                var user = Session["user_id"].ToString();
                var datenow = DateTime.Now;

                var q1 = (from a in db2.applicants_review_tbl
                         join b in db2.psb_sked_app_tbl
                         on a.app_ctrl_nbr equals b.app_ctrl_nbr
                         join c in db2.psb_sked_item_nbrs
                         on new { b.psb_ctrl_nbr, a.item_no } equals new { c.psb_ctrl_nbr, c.item_no }
                         where a.app_ctrl_nbr == app_ctrl_nbr
                         select new
                         {
                              b.psb_ctrl_nbr
                             ,c.item_no

                         }).FirstOrDefault();
                if (q1 != null)
                {
                    var approve_exist = db2.selected_applicants_tbl.Where(a => a.item_no == q1.item_no && a.psb_ctrl_nbr == q1.psb_ctrl_nbr).ToList();

                    if (approve_exist.Count() > 0)
                    {
                        throw new Exception("This item already has approved application!, changes in rating is not permitted.");
                    }
                }
               

                var exam  = db2.applicant_examination.Where(a => a.app_ctrl_nbr == app_ctrl_nbr).FirstOrDefault();

                if (exam == null)
                {
                    applicant_examination exm = new applicant_examination();
                    exm.app_ctrl_nbr = app_ctrl_nbr;
                    exm.exam_type_descr = exam_type_descr;
                    exm.score_rendered = Convert.ToDouble(score_rendered);
                    exm.exam_date = Convert.ToDateTime(exam_date);
                    exm.created_dttm = datenow;
                    exm.created_by_user = user;
                    db2.applicant_examination.Add(exm);

                }
                else
                {
                    exam.app_ctrl_nbr = app_ctrl_nbr;
                    exam.exam_type_descr = exam_type_descr;
                    exam.score_rendered = Convert.ToDouble(score_rendered);
                    exam.exam_date = Convert.ToDateTime(exam_date);
                    exam.updated_dttm = datenow;
                    exam.updated_by_user = user;
                }
                db2.SaveChanges();
                return JSON2(new { icon = icon.success,message="Successfully saved!"  }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException exp)
            {
                return Json(new { message = DbEntityValidationExceptionError(exp), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }

        public ActionResult setApplicantType(string app_ctrl_nbr,int applicant_type, string applicant_type_descr)
        {
            try
            {
                db.Database.CommandTimeout = Int32.MaxValue;
                db2.Database.CommandTimeout = Int32.MaxValue;
                var user_id = Session["user_id"].ToString();
                var datenow = DateTime.Now;
                var dbquery = db2.insider_outsider_applicant_tbl.Where(a => a.app_ctrl_nbr == app_ctrl_nbr).FirstOrDefault();
                if (dbquery == null)
                {
                    insider_outsider_applicant_tbl dbinsert = new insider_outsider_applicant_tbl();
                    dbinsert.app_ctrl_nbr = app_ctrl_nbr;
                    dbinsert.applicant_type = applicant_type;
                    dbinsert.applicant_type_descr = applicant_type_descr;
                    dbinsert.created_dttm = datenow;
                    dbinsert.created_by = user_id;
                    db2.insider_outsider_applicant_tbl.Add(dbinsert);
                    db2.SaveChanges();
                }
                else
                {
                    dbquery.applicant_type = applicant_type;
                    dbquery.applicant_type_descr = applicant_type_descr;
                    dbquery.updated_dttm = datenow;
                    dbquery.updated_by = user_id;
                    db2.SaveChanges();
                }
                
                return JSON2(new { icon = icon.success }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException exp)
            {
                return Json(new { message = DbEntityValidationExceptionError(exp), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }
       

        public ActionResult ChangeItem(string app_ctrl_nbr, string item_no_previous, string hiring_period, string item_no_new, string position_code, string department_code)
        {
            try
            {
                db.Database.CommandTimeout = Int32.MaxValue;
                db2.Database.CommandTimeout = Int32.MaxValue;
                applicants_review_tbl CONT = new applicants_review_tbl();
                var date = DateTime.Now;
                var datestr = date.ToString();
                var user_id = Session["user_id"].ToString();
                var allow_change = db2.admin_authority_rct_tbl.Where(a => a.user_id == user_id && a.auth_code == 1).ToList();

                if (allow_change.Count() == 0)
                {
                    throw new Exception("The user does not have the authority to change the item!"); 
                }
                var change_exist = db2.change_item_history_tbl.Where(a => a.app_ctrl_nbr == app_ctrl_nbr && a.item_previous == item_no_previous && a.hiring_period == hiring_period).FirstOrDefault();

                if (change_exist == null)
                {
                    change_item_history_tbl c = new change_item_history_tbl();
                    c.app_ctrl_nbr = app_ctrl_nbr;
                    c.item_previous = item_no_previous;
                    c.item_new = item_no_new;
                    c.hiring_period = hiring_period;
                    c.created_by = user_id;
                    c.created_dttm = datestr;
                    c.updated_by = "";
                    c.updated_dttm = "";
                    db2.change_item_history_tbl.Add(c);
                }
                else {
                    change_exist.item_new     = item_no_new;
                    change_exist.updated_by   = user_id;
                    change_exist.updated_dttm = datestr;

                }
                var app_item_change = db2.applicants_review_tbl.Where(a => a.app_ctrl_nbr == app_ctrl_nbr).FirstOrDefault();
                if (app_item_change == null) {
                    throw new Exception("The applicant was not found!");
                }
                else
                {
                    app_item_change.item_no = item_no_new;
                    app_item_change.department_code = department_code;
                    app_item_change.position_code = position_code;
                    app_item_change.hiring_period = hiring_period;

                    db2.SaveChanges();
                    
                }
               

                var review_list = db2.sp_review_applicant_tbl_list3(item_no_new, app_item_change.employment_type, app_item_change.budget_code, hiring_period).ToList();
                return JSON2(new { icon = icon.success, review_list}, JsonRequestBehavior.AllowGet);
            }
            catch (Exception exp)
            {
                return Json(new { message = exp.Message, icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }
        public ActionResult getAllApplicants(string budget_code,  string employment_type)
        {
            try
            {
                db.Database.CommandTimeout = Int32.MaxValue;
                db2.Database.CommandTimeout = Int32.MaxValue;
                var AllApplicants = db2.sp_review_applicant_tbl_list_all("", employment_type, budget_code, "").ToList();

                return JSON2(new { icon = icon.success, AllApplicants }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception exp)
            {
                return Json(new { message = exp.Message, icon = icon.error }, JsonRequestBehavior.AllowGet);
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