using HRIS_eRSP_Recruitment.Common_Code;
using HRIS_eRSP_Recruitment.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace HRIS_eRSP_Recruitment.Controllers
{
    public class cAddRespondentController : CustomController
    {
        HRIS_RCTEntities db = new HRIS_RCTEntities();
        HRIS_APLEntities db2 = new HRIS_APLEntities();
        // GET: cAddRespondent
        public ActionResult Index(string app_ctrl_nbr)
        {
            if (Session["user_id"] == null)
            {
                Session.Remove("bi_app_ctrl_nbr");
                return RedirectToAction("Index", "Login");
            }
            else
            {
                Session["bi_app_ctrl_nbr"] = app_ctrl_nbr;
                return View();
            }
        }

        public ActionResult Initialize()
        {
            db.Database.CommandTimeout = Int32.MaxValue;
            db2.Database.CommandTimeout = Int32.MaxValue;
            if (Session["user_id"] == null)
            {
                return RedirectToAction("Index", "Login");
            }
            try
            {
                var app_ctrl_nbr = Session["bi_app_ctrl_nbr"].ToString();
                var bi_respondent_type_tbl = db.bi_respondent_type_tbl.ToList();
                return JSON(new { message = fetch.success, icon = icon.success, app_ctrl_nbr, bi_respondent_type_tbl}, JsonRequestBehavior.AllowGet);
            }catch(Exception e)
            {
                var message = e.Message;
                return JSON(new { message, icon = icon.error  }, JsonRequestBehavior.AllowGet);
            }
        }

        public ActionResult GetApplicants(string ctrl_no)
        {
            db.Database.CommandTimeout = Int32.MaxValue;
            db2.Database.CommandTimeout = Int32.MaxValue;
            if (Session["user_id"] == null)
            {
                return RedirectToAction("Index", "Login");
            }
            try
            {
                var applied_items = db.vw_applicant_for_bi.Where(a => a.hiring_period == ctrl_no).ToList();
                return JSON(new { message = fetch.success, icon = icon.success, applied_items }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                var message = e.Message;
                return JSON(new { message, icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }
        public ActionResult SaveRespondent(bi_respondent_tbl repondent_data,string app_ctrl_nbr)
        {
            db.Database.CommandTimeout = Int32.MaxValue;
            db2.Database.CommandTimeout = Int32.MaxValue;
            var rd = repondent_data;
            if (Session["user_id"] == null)
            {
                return RedirectToAction("Index", "Login");
            }

            try
            {
                var ex = db.bi_respondent_tbl.Where(a =>
                      a.last_name == rd.last_name
                      && a.first_name == rd.first_name
                      && a.birthdate == rd.birthdate
                    ).ToList();
                if (ex.Count() > 0)
                {
                    throw new Exception("Respondent already in registered");
                }
                db.bi_respondent_tbl.Add(repondent_data);
                db.SaveChanges();


                var id = db.bi_respondent_tbl.OrderByDescending(a => a.respondent_id).FirstOrDefault().respondent_id;

                var exst = db.bi_respondent_torate_tbl.Where(a => a.respondent_id == id && a.app_ctrl_nbr == app_ctrl_nbr).FirstOrDefault();

                if (exst == null)
                {
                    bi_respondent_torate_tbl tr = new bi_respondent_torate_tbl();
                    tr.respondent_id = id;
                    tr.app_ctrl_nbr = app_ctrl_nbr;
                    db.bi_respondent_torate_tbl.Add(tr);
                }
          
                db.SaveChanges();
                
                return JSON(new { message = fetch.success, icon = icon.success}, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                var message = e.Message;
                return JSON(new { message, icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }
    }
}