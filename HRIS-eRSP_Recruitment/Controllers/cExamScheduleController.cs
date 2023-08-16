using HRIS_eRSP_Recruitment.Models;
using System;
using HRIS_Common;
using HRIS_eRSP_Recruitment.Common_Code;
using System.Collections.Generic;
using System.Data.Entity.Validation;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Text;

namespace HRIS_eRSP_Recruitment.Controllers
{
    public class cExamScheduleController : CustomController
    {
        HRIS_RCTEntities db = new HRIS_RCTEntities();
        // GET: cExamSchedule
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Initialize()
        {
            return View();
        }
        public ActionResult GetExamSchedulePeryear(string year)
        {
            try
            {
                var examschedules = db.vw_exam_schedule_tbl.Where(a => a.exam_year == year).ToList();
                return JSON2(new { message = " ", icon = "success", examschedules}, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return JSON2(new { message = DbEntityValidationExceptionError(e), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }

        public ActionResult SaveExamSchedule(string year, exam_shcedule_tbl exam_data)
        {
            var user_id = Session["user_id"].ToString();
            try
            {
                var find_data = db.exam_shcedule_tbl.Where(a => a.exam_date == exam_data.exam_date && a.exam_time == exam_data.exam_time && a.exam_type == exam_data.exam_type).FirstOrDefault();
                if (find_data == null)
                {
                    exam_data.created_by = user_id;
                    exam_data.created_dttm = DateTime.Now;
                    db.exam_shcedule_tbl.Add(exam_data);
                    db.SaveChanges();
                }
                else
                {
                    throw new Exception("This schedule already exist!");
                }

                var examschedules = db.vw_exam_schedule_tbl.Where(a => a.exam_year == year).ToList();

                return JSON2(new { message = " ", icon = "success", examschedules }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                return JSON2(new { message = e.Message, icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }
        public ActionResult EditExamSchedule(string year, exam_shcedule_tbl exam_data)
        {
            var user_id = Session["user_id"].ToString();
         
            try
            {
                var find_data = db.exam_shcedule_tbl.Where(a => a.exam_date == exam_data.exam_date && a.exam_time == exam_data.exam_time && a.exam_type == exam_data.exam_type).FirstOrDefault();
                if (find_data != null)
                {
                    find_data.exam_location = exam_data.exam_location;
                    find_data.zoom_link = exam_data.zoom_link;
                    find_data.zoom_meeting_id = exam_data.zoom_meeting_id;
                    find_data.zoom_passcode = exam_data.zoom_passcode;
                    find_data.updated_by = user_id;
                    find_data.updated_dttm = DateTime.Now;
                    db.SaveChanges();
                }
                

                var examschedules = db.vw_exam_schedule_tbl.Where(a => a.exam_year == year).ToList();

                return JSON2(new { message = " ", icon = "success", examschedules }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                return JSON2(new { message = e.Message, icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }


        public ActionResult DeleteExamSchedule(string exam_date, string exam_type,string exam_time,string year)
        {
            var user_id = Session["user_id"].ToString();
            var ts = TimeSpan.Parse(exam_time);
            var date = Convert.ToDateTime(exam_date);
            try
            {
                var find_data = db.exam_shcedule_tbl.Where(a => a.exam_date == date && a.exam_time == ts && a.exam_type == exam_type).FirstOrDefault();
                if (find_data != null)
                {
                    db.exam_shcedule_tbl.Remove(find_data);
                    db.SaveChanges();
                }
               

                var examschedules = db.vw_exam_schedule_tbl.Where(a => a.exam_year == year).ToList();

                return JSON2(new { message = " ", icon = "success", examschedules }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return JSON2(new { message = DbEntityValidationExceptionError(e), icon = icon.error }, JsonRequestBehavior.AllowGet);
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