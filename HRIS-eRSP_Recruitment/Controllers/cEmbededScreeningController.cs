using HRIS_eRSP_Recruitment.Common_Code;
using HRIS_eRSP_Recruitment.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace HRIS_eRSP_Recruitment.Controllers
{
    public class cEmbededScreeningController : CustomController
    {
        HRIS_RCTEntities db = new HRIS_RCTEntities();
        User_Menu um = new User_Menu();
      
        // GET: cEmbededScreening
        public ActionResult Index()
        {
            CheckSession();
            return View();
        }

        public ActionResult Initialize(string employment_type)
        {
            CheckSession();
            try
            {
                var zoomcred = db.zoomcredential_tbl.FirstOrDefault();
                
                return Json(new { message = "Save Success", icon = "success" , zoomcred}, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { message = ex.Message, icon = "error" }, JsonRequestBehavior.AllowGet);
            }

        }
        public ActionResult savezoomcredential(string zoomid, string password)
        {
            CheckSession();
            try
            {
                var del = db.zoomcredential_tbl.ToList();
                if (del.Count() > 1)
                {
                    db.zoomcredential_tbl.RemoveRange(del);
                    db.SaveChanges();
                }
                zoomcredential_tbl zm = new zoomcredential_tbl();
                zm.zoom_id = zoomid;
                zm.zoom_password = password;
                db.zoomcredential_tbl.Add(zm);
                db.SaveChanges();

                return Json(new { message = "Save Success", icon = "success"}, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { message =ex.Message, icon = "error" }, JsonRequestBehavior.AllowGet);
            }
        }
    }

    
    
}