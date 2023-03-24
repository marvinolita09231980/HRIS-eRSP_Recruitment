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
    public class cAddApplicantsController : CustomController
    {
        string urlname = "cApplicantsInfo";
        HRIS_RCTEntities db2 = new HRIS_RCTEntities();
        User_Menu um;
        RCT_Common rct = new RCT_Common();
        // GET: cAddApplicants
        public ActionResult Index()
        {
            if (Session["user_id"] == null)
            {
                return RedirectToAction("Index", "Login");
            }
            return View();
        }
        
        public ActionResult Initialize(string employment_type)
        {
            CheckSession();
            um = rct.GetAllowAccess() ;
          
            try
            {
                var info_ctrl_nbr = db2.sp_autogen_ctrl_nbr("applicants_tbl", 6, "info_ctrl_nbr").FirstOrDefault();
                var budget_year = db2.sp_budgetyears_tbl_combolist1_RCT(employment_type).ToList();
                return JSON(new { icon = icon.success, info_ctrl_nbr, um, budget_year }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return Json(new { message = DbEntityValidationExceptionError(e) , icon = icon.error}, JsonRequestBehavior.AllowGet);
            }

        }
        public ActionResult FindPersonnel(string empl_id)
        {
            CheckSession();
            var message = "";
            try
            {
                var person = db2.sp_if_employee_exist(empl_id).FirstOrDefault();
                return JSON(new { message = "success", person }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException exp)
            {

                message = DbEntityValidationExceptionError(exp);
                return Json(new { message = message }, JsonRequestBehavior.AllowGet);
            }

        }
        
        //public ActionResult InsertToApprovalWorkFlow()
        //{
        //    var user_id = Session["user_id"].ToString();
            
        //    try
        //    {
        //        var approval_id = db2.sp_insert_transaction_to_approvalworkflow_tbl_RCT(user_id,"191").ToList();
        //        return Json(new { message = saved.success, icon = icon.success, approval_id }, JsonRequestBehavior.AllowGet);
        //    }
        //    catch (DbEntityValidationException e)
        //    {
        //        return Json(new { message = DbEntityValidationExceptionError(e),icon = icon.error }, JsonRequestBehavior.AllowGet);
        //    }
        //}

        public ActionResult Save_Application( applicants_tbl app, string info_ctrl_nbr_disp)
        {
            CheckSession();
            var user_id = Session["user_id"].ToString();
            var info = info_ctrl_nbr_disp.ToString().Split(new char[] { '-' });
            var applied_year = info[0];
            var info_ctrl_nbr = info[1];
            try
            {
                app.info_ctrl_nbr = info_ctrl_nbr;
                app.is_employee   =  false;
                app.created_by_user = user_id;
                app.created_dttm = DateTime.Now;
                app.updated_by_user = "";
                app.updated_dttm   = Convert.ToDateTime("1900-01-01 00:00:00");
                db2.applicants_tbl.Add(app);
                db2.SaveChanges();

                var list = db2.vw_applicant_tbl_list.Where(a => a.info_ctrl_nbr == info_ctrl_nbr).ToList();
                return JSON(new { message = saved.success, icon = icon.success, list }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                
                return Json(new { message = DbEntityValidationExceptionError(e), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }

        public ActionResult GetApplicationNbr()
        {
            CheckSession();
            try
            {
                var app_ctrl_nbr = db2.sp_autogen_ctrl_nbr("applicants_tbl", 6, "info_ctrl_nbr").FirstOrDefault();
               
                return JSON(new { icon = icon.success, app_ctrl_nbr}, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return Json(new { message = DbEntityValidationExceptionError(e),icon=icon.error }, JsonRequestBehavior.AllowGet);
            }

        }
        public ActionResult FetchFromPDS(string empl_id, string info_ctrl_nbr)
        {
            CheckSession();
            var user_id = Session["user_id"].ToString();
            var message = "";
            try
            {
                var applicants = db2.vw_applicant_tbl_list.Where(a => a.info_ctrl_nbr == info_ctrl_nbr).ToList();
                var DatafrmPDS = db2.sp_current_empl_data(empl_id, info_ctrl_nbr, user_id).ToString();
                //DatafrmPDS == "Data successfully inserted"
                
                    
                 message = DatafrmPDS;

                 return JSON(new { message, icon = icon.success, applicants, DatafrmPDS }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException exp)
            {

                message = DbEntityValidationExceptionError(exp);
                return Json(new { message = message }, JsonRequestBehavior.AllowGet);
            }

        }
        public ActionResult fetchAppCtrlNbr()
        {
            CheckSession();
            try
            {
                var app_ctrl_nbr = db2.sp_autogen_ctrl_nbr("applicants_tbl", 6, "info_ctrl_nbr").FirstOrDefault();

                return JSON(new { icon = icon.success, app_ctrl_nbr }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return Json(new { message = DbEntityValidationExceptionError(e) , icon = icon.error}, JsonRequestBehavior.AllowGet);
            }
        }

        public ActionResult getBudgetYear(string employment_type)
        {
            CheckSession();
            try
            {
                var budget_year = db2.sp_budgetyears_tbl_combolist1_RCT(employment_type).ToList();
                return JSON(new { icon = icon.success, budget_year }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return Json(new { message = DbEntityValidationExceptionError(e) , icon = icon.error}, JsonRequestBehavior.AllowGet);
            }
        }
        public ActionResult getPositionFromPublication(string budget_code, string employment_type)
        {
            CheckSession();
             try
            {
                var positions = db2.sp_publicationvacant_combolist_RCT(budget_code, employment_type).ToList();
                return JSON(new { icon = icon.success, positions }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return Json(new { message = DbEntityValidationExceptionError(e) , icon = icon.error}, JsonRequestBehavior.AllowGet);
            }
        }
    }
}