using HRIS_Common;
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
    public class cGuestUserInfoController : CustomController
    {
        string urlname = "cGuestUserInfo";
        HRIS_RCTEntities db = new HRIS_RCTEntities();
        User_Menu um = new User_Menu();
        CommonDB Cmn = new CommonDB();
        RCT_Common rct = new RCT_Common();
        // GET: cGuestUserInfo
        public ActionResult Index()
        {
            CheckSession();
            return View();
        }

        public ActionResult AddGuestUser()
        {
            CheckSession();
            return View();
        }
        public ActionResult Initialize(string start_with)
        {
            db.Database.CommandTimeout = Int32.MaxValue;
            CheckSession();
            um = rct.GetAllowAccess();
            try
            {
                var guest_users = db.sp_guest_user_tbl(start_with).ToList();
                var civil_status = db.vw_civilstatus_tbl_RCT;
                return JSON(new { message = fetch.success, icon = icon.success, guest_users, civil_status,um}, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return Json(new { message = DbEntityValidationExceptionError(e), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }
        public ActionResult AddUserInitialize()
        {
            db.Database.CommandTimeout = Int32.MaxValue;
            CheckSession();
            bool edit = false;
            List<vw_guest_user_info_tbl> ob = new List<vw_guest_user_info_tbl>();
            try
            {
                //if (Session["g_user_id"] != null)
                //{
                //    edit = true;
                //    var g_user_id = Session["g_user_id"].ToString();
                //    ob = db.vw_guest_user_info_tbl.Where(a => a.g_user_id == g_user_id).ToList();
                //}
                if (Session["edit"] == "1")
                {
                    edit = true;
                    var g_user_id = Session["g_user_id"] != null?Session["g_user_id"].ToString():"";
                    ob = db.vw_guest_user_info_tbl.Where(a => a.g_user_id == g_user_id).ToList();
                }
                var civil_status = db.vw_civilstatus_tbl_RCT;
                var guest_id = db.sp_get_next_guest_userid().ToList();
                Session.Remove("g_user_id");
                return JSON(new { message = fetch.success, icon = icon.success, guest_id, civil_status,ob,edit},JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return Json(new { message = DbEntityValidationExceptionError(e),icon=icon.error }, JsonRequestBehavior.AllowGet);
            }
        }
        public ActionResult saveGuestUserInfo(guest_user_info_tbl gu, bool bit)
        {
            db.Database.CommandTimeout = Int32.MaxValue;
            CheckSession();
            var password = "Password1.";
             bool edit = false;
             var user_id = Session["user_id"].ToString();
             DateTime date = DateTime.Now; 
           try
            {
               var exist = db.guest_user_info_tbl.Where(a => a.g_user_id == gu.g_user_id).Count();
               if (exist < 1)
               {
                   gu.g_status = bit;
                   gu.created_dttm = date;
                   gu.created_by_user = user_id;
                   gu.updated_dttm = Convert.ToDateTime("1900-01-01 00:00:00");
                   gu.updated_by_user = "";
                   gu.g_user_password = Cmn.EncryptString(password.Trim(), Cmn.CONST_WORDENCRYPTOR);
                   db.guest_user_info_tbl.Add(gu);
               }
               else
               {
                edit = true;
                var g = db.guest_user_info_tbl.Where(a => a.g_user_id == gu.g_user_id).FirstOrDefault();
                   g.g_status = bit;
                   g.last_name     = gu.last_name     ;
                   g.first_name    = gu.first_name    ;
                   g.middle_name   = gu.middle_name   ;
                   g.civil_status  = gu.civil_status  ;
                   g.gender        = gu.gender        ;
                   g.birth_date    = gu.birth_date    ;
                   g.g_address     = gu.g_address     ;
                   g.agency        = gu.agency        ;
                   g.position = gu.position;
                   g.updated_dttm = date;
                   g.updated_by_user = user_id;
               }
               db.SaveChanges();

                var guest_id = db.sp_get_next_guest_userid().ToList();
                return JSON(new { message = insert.success, icon = icon.success, guest_id,edit}, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return Json(new { message = DbEntityValidationExceptionError(e),icon=icon.error }, JsonRequestBehavior.AllowGet);
            }
        }
        public ActionResult getUsers(string start_with)
        {
            db.Database.CommandTimeout = Int32.MaxValue;
            CheckSession();
            try
            {
                var guest_users = db.sp_guest_user_tbl(start_with).ToList();
                return JSON(new { message = fetch.success, icon = icon.success, guest_users}, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return Json(new { message = DbEntityValidationExceptionError(e), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }
        public ActionResult editGuestUsers(string g_user_id)
        {
            CheckSession();
            Session["g_user_id"] = g_user_id;
            Session["edit"] = "1";

            return JSON(new { message = fetch.success, icon = icon.success}, JsonRequestBehavior.AllowGet);
        }
        public ActionResult DeleteGuestUser(string g_user_id, string start_with)
        {
            db.Database.CommandTimeout = Int32.MaxValue;
            CheckSession();
            try
            {
                var del_u = db.guest_user_info_tbl.Where(a => a.g_user_id == g_user_id).FirstOrDefault();
                db.guest_user_info_tbl.Remove(del_u);
                db.SaveChanges();
                var guest_users = db.sp_guest_user_tbl(start_with).ToList();
                return JSON(new { message = "Guest user successfully deleted!", icon = icon.success, guest_users }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return Json(new { message = DbEntityValidationExceptionError(e), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }

        }


        
    }
}