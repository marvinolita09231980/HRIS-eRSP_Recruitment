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
        
        
        
        
        
        
        
        

        public ActionResult save_respondent_1(bi_respondent_1_hdr_tbl respondent_data,List<bi_criteria1_average_comments_tbl> comment_data)
        {
            var respondent_1_id = 0;
            var app_ctrl_nbr = Session["bi_app_ctrl_nbr"].ToString();
            var user_id = Session["user_id"].ToString();
            var datenow = DateTime.Now.ToString();
            try
            {
                var resx = db.bi_respondent_1_hdr_tbl.Where(a => a.app_ctrl_nbr == respondent_data.app_ctrl_nbr).FirstOrDefault();
                if (resx == null)
                {
                    bi_respondent_1_hdr_tbl res = new bi_respondent_1_hdr_tbl();
                    res.app_ctrl_nbr = respondent_data.app_ctrl_nbr;
                    res.supervisor_name = respondent_data.supervisor_name;
                    res.supervisor_office_address = respondent_data.supervisor_office_address;
                    res.supervisor_date = respondent_data.supervisor_date;
                    res.interviewed_by = respondent_data.interviewed_by;
                    res.interviewed_date = respondent_data.interviewed_date;
                    res.created_dttm =  datenow;
                    res.created_by = user_id;
                    res.updated_dttm = "";
                    res.updated_by = "";
                    db.bi_respondent_1_hdr_tbl.Add(res);
                }
                else
                {


                    resx.supervisor_name = respondent_data.supervisor_name;
                    resx.supervisor_office_address = respondent_data.supervisor_office_address;
                    resx.supervisor_date = respondent_data.supervisor_date;
                    resx.interviewed_by = respondent_data.interviewed_by;
                    resx.interviewed_date = respondent_data.interviewed_date;
                    resx.updated_dttm = datenow;
                    resx.updated_by = user_id;
                    
                }
                db.SaveChanges();

                var respondent= db.bi_respondent_1_hdr_tbl.Where(a => a.app_ctrl_nbr == respondent_data.app_ctrl_nbr).FirstOrDefault();
                if (respondent != null)
                {
                    respondent_1_id = respondent.respondent_1_id;
                    for (var x = 0; x < comment_data.Count(); x++)
                    {
                        var app_ctrl_nbr1 = comment_data[x].app_ctrl_nbr;
                        var criteria1_id = comment_data[x].criteria1_id;
                        var comx = db.bi_criteria1_average_comments_tbl.Where(a => a.app_ctrl_nbr == app_ctrl_nbr1 && a.criteria1_id == criteria1_id).FirstOrDefault();
                        if (comx == null)
                        {
                            bi_criteria1_average_comments_tbl com = new bi_criteria1_average_comments_tbl();
                            com.app_ctrl_nbr = comment_data[x].app_ctrl_nbr;
                            com.criteria1_id = comment_data[x].criteria1_id;
                            com.average = comment_data[x].average;
                            com.comments = comment_data[x].comments;
                            com.respondent_1_id = respondent_1_id;
                            com.created_dttm = datenow ;
                            com.created_by = user_id;
                            com.updated_dttm = "";
                            com.updated_by = "";
                            db.bi_criteria1_average_comments_tbl.Add(com);
                        }
                        else
                        {
                            comx.average = comment_data[x].average;
                            comx.comments = comment_data[x].comments;
                            comx.respondent_1_id = respondent_1_id;
                            comx.updated_dttm = datenow ;
                            comx.updated_by = user_id;
                        }

                        db.SaveChanges();
                    }
                }
                else
                {
                    throw new Exception("Failed to save!");
                }
                return JSON2(new { respondent_1_id, icon=icon.success}, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                return Json(new { message = e.Message, icon = "error" }, JsonRequestBehavior.AllowGet);
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