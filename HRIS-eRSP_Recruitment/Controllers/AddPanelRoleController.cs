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
    public class AddPanelRoleController : CustomController
    {
        HRIS_RCTEntities db = new HRIS_RCTEntities();
        User_Menu um = new User_Menu();
        RCT_Common rct = new RCT_Common();
        // GET: AddPanelRole
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
            var prole = db.psb_mbr_role_tbl.ToList();
            return Json(new { prole }, JsonRequestBehavior.AllowGet);
        }
        public ActionResult getLastId()
        {
            CheckSession();
            var role_id = db.sp_generate_key("psb_mbr_role_tbl", "psb_mbr_role", 2);
            return Json(new { role_id }, JsonRequestBehavior.AllowGet);
        }
        
        public ActionResult SavePanelRole(string psb_mbr_role ,string mbr_role_descr)
        {
            CheckSession();
            var message = "";
            var icon = "";
            List<psb_mbr_role_tbl> prole = new List<psb_mbr_role_tbl>();
            try
            {
                var user_id = Session["user_id"].ToString();
                psb_mbr_role_tbl mr = new psb_mbr_role_tbl();
                mr.psb_mbr_role = psb_mbr_role;
                mr.mbr_role_descr = mbr_role_descr;
                mr.created_by_user = user_id;
                mr.created_dttm = DateTime.Now;
                db.psb_mbr_role_tbl.Add(mr);
                db.SaveChanges();
                message = "Successfully Added!";
                icon = "success";
                prole = db.psb_mbr_role_tbl.ToList();
            }catch(Exception ex)
            {
                message = ex.Message;
                icon = "error";
            }


            return Json(new { message, icon, prole }, JsonRequestBehavior.AllowGet);
        }

       
        public ActionResult EditPanelRole(string psb_mbr_role, string mbr_role_descr)
        {
            CheckSession();
            var message = "";
            var icon = "";
            List<psb_mbr_role_tbl> prole = new List<psb_mbr_role_tbl>();
            try
            {
                var user_id = Session["user_id"].ToString();
                var mr = db.psb_mbr_role_tbl.Where(a => a.psb_mbr_role == psb_mbr_role).FirstOrDefault();
                mr.mbr_role_descr = mbr_role_descr;
                mr.updated_by_user = user_id;
                mr.updated_dttm = DateTime.Now;
                db.SaveChanges();
                message = "Successfully Updated!";
                icon = "success";
                prole = db.psb_mbr_role_tbl.ToList();
            }
            catch (DbEntityValidationException e)
            {
                 message = DbEntityValidationExceptionError(e);
                 icon = "error";

            }
            return Json(new { message, icon, prole}, JsonRequestBehavior.AllowGet);
        }
        public ActionResult deletePanelRole(string psb_mbr_role)
        {
            CheckSession();
            var message = "";
            var icon = "";
            List<psb_mbr_role_tbl> prole = new List<psb_mbr_role_tbl>();
            try
            {
                var user_id = Session["user_id"].ToString();
                var mr = db.psb_mbr_role_tbl.Where(a => a.psb_mbr_role == psb_mbr_role).FirstOrDefault();
                db.psb_mbr_role_tbl.Remove(mr);
                db.SaveChanges();
                message = "Successfully Deleted!";
                icon = "success";
                prole = db.psb_mbr_role_tbl.ToList();
            }
            catch (DbEntityValidationException e)
            {
                message = DbEntityValidationExceptionError(e);
                icon = "error";

            }
            return Json(new { message, icon, prole }, JsonRequestBehavior.AllowGet);
        }
        //public String DbEntityValidationExceptionError(DbEntityValidationException e)
        //{
        //    string message = "";
        //    foreach (var eve in e.EntityValidationErrors)
        //    {
        //        Console.WriteLine("Entity of type \"{0}\" in state \"{1}\" has the following validation errors:",
        //            eve.Entry.Entity.GetType().Name, eve.Entry.State);
        //        foreach (var ve in eve.ValidationErrors)
        //        {
        //            message = "- Property: \"{0}\", Error: \"{1}\"" + ve.PropertyName + "  :  " + ve.ErrorMessage;
        //            Console.WriteLine("- Property: \"{0}\", Error: \"{1}\"",
        //                ve.PropertyName, ve.ErrorMessage);
        //        }
        //    }
        //    return message;
        //}
    }
}