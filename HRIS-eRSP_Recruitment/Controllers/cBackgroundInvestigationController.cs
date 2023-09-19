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
    public class cBackgroundInvestigationController : CustomController
    {
        HRIS_RCTEntities db = new HRIS_RCTEntities();
        // GET: cBackgroundInvestigation
        public ActionResult Index(string app_ctrl_nbr)
        {
            Session["bi_app_ctrl_nbr"] = app_ctrl_nbr;
            if (Session["bi_app_ctrl_nbr"] == null)
            {
                return RedirectToAction("Index", "cApplicantsReview");
            }
            else
            {
                return View();
            }

          
        }

        public ActionResult initialize()
        {
            try
            {
                var app_ctrl_nbr = Session["bi_app_ctrl_nbr"].ToString();
                var employee = from ar in db.applicants_review_tbl
                               join ap in db.applicants_tbl
                               on ar.info_ctrl_nbr equals ap.info_ctrl_nbr
                               join dp in db.vw_departments_tbl 
                               on ar.department_code equals dp.department_code
                               join ps in db.vw_positions_tbl 
                               on ar.position_code equals ps.position_code
                               where ar.app_ctrl_nbr == app_ctrl_nbr
                               select new
                               {
                                  ap.first_name
                                  ,ap.middle_name
                                  ,ap.last_name
                                  ,dp.department_name1
                                  ,ps.position_long_title
                               };
                var bi_rating_questiontype_tbl = db.bi_rating_questiontype_tbl.ToList();
                return JSON2(new { app_ctrl_nbr, bi_rating_questiontype_tbl, employee, icon = "success" }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return Json(new { message = DbEntityValidationExceptionError(e), icon = "error" }, JsonRequestBehavior.AllowGet);
            }
        }


        public ActionResult getBiQuestion(int question_type,int rating_scale_group)
        {
            var app_ctrl_nbr = Session["bi_app_ctrl_nbr"].ToString();
            try
            {
                var bi_rating_scale_tbl = db.bi_rating_scale_tbl.Where(a => a.group_type_id == rating_scale_group).ToList().OrderByDescending(a => a.rating_scale_id);
                var bi_questions_list = db.sp_applicants_bi_questions_list(app_ctrl_nbr, question_type).ToList();
                var bi_criteria1_tbl  = db.bi_criteria1_tbl.Where(a => a.question_type == question_type).ToList();
                var bi_criteria2_tbl  = db.bi_criteria2_tbl.Where(a => a.question_type == question_type).ToList();
                var bi_criteria3_tbl  = db.bi_criteria3_tbl.Where(a => a.question_type == question_type).ToList();
                return JSON2(new { bi_questions_list, bi_criteria1_tbl, bi_criteria2_tbl, bi_criteria3_tbl, bi_rating_scale_tbl, icon = "success" }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return Json(new { message = DbEntityValidationExceptionError(e), icon = "error" }, JsonRequestBehavior.AllowGet);
            }
        }

        public ActionResult save_bi_rating(List<bi_rating_tbl> bi_ratings)
        {
            try
            {
                var user_id = Session["user_id"].ToString();
                var datenow = DateTime.Now;
                var bi_len = bi_ratings.Count();

                for(var x = 0; x < bi_len; x++)
                {
                    var app_ctrl_nbr = bi_ratings[x].app_ctrl_nbr;
                    var question_id = bi_ratings[x].question_id;

                    var query_exist = db.bi_rating_tbl.Where(a => a.app_ctrl_nbr == app_ctrl_nbr && a.question_id == question_id).FirstOrDefault();
                    if (query_exist == null)
                    {
                        bi_rating_tbl quer_insert = new bi_rating_tbl();
                        quer_insert.app_ctrl_nbr = bi_ratings[x].app_ctrl_nbr;
                        quer_insert.question_id = bi_ratings[x].question_id;
                        quer_insert.question_rating = bi_ratings[x].question_rating;
                        quer_insert.accomplished_date = bi_ratings[x].accomplished_date;
                        quer_insert.created_by = user_id;
                        quer_insert.created_dttm = datenow;
                        db.bi_rating_tbl.Add(quer_insert);
                    }
                    else
                    {
                        query_exist.question_rating = bi_ratings[x].question_rating;
                        query_exist.updated_by = user_id;
                        query_exist.updated_dttm = datenow;
                    }
                    db.SaveChanges();
                }

                return JSON2(new { icon = "success" }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return Json(new { message = DbEntityValidationExceptionError(e), icon = "error" }, JsonRequestBehavior.AllowGet);
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