using HRIS_Common;
using HRIS_eRSP_Recruitment.Common_Code;
using HRIS_eRSP_Recruitment.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity.Validation;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Mvc;

namespace HRIS_eRSP_Recruitment.Controllers
{
    public class cBackgroundInvestigationQuestionController : CustomController
    {
        HRIS_RCTEntities db = new HRIS_RCTEntities();
        // GET: cBackgroundInvestigationQuestion
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Initialize()
        {
            try
            {
                var bi_criteria1_tbl = db.bi_criteria1_tbl.ToList();
                var bi_criteria2_tbl = db.bi_criteria2_tbl.ToList();
                var bi_criteria3_tbl = db.bi_criteria3_tbl.ToList();

                return JSON2(new { bi_criteria1_tbl, bi_criteria2_tbl, bi_criteria3_tbl}, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return Json(new { message = DbEntityValidationExceptionError(e), icon = icon.error }, JsonRequestBehavior.AllowGet);
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

        public ActionResult saveQuestion(bi_questionnaire_tbl question)
        {
            var user_id = Session["user_id"].ToString();
            var datenow = DateTime.Now;
            try
            {
                question.created_dttm = datenow;
                question.created_by = user_id;
                db.bi_questionnaire_tbl.Add(question);
                db.SaveChanges();



                return JSON2(new { message="Question successfully saved!", icon=icon.success }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return Json(new { message = DbEntityValidationExceptionError(e), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }
    }
}