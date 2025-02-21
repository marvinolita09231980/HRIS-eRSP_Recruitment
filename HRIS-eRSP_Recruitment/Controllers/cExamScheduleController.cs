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
            db.Database.CommandTimeout = Int32.MaxValue;
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

        public ActionResult SaveExamSchedule(string year, exam_shcedule_tbl exam_data, string exam_time)
        {
            db.Database.CommandTimeout = Int32.MaxValue;
            var user_id = Session["user_id"].ToString();
            try
            {
                var ex_time = TimeSpan.Parse(exam_time);
                var find_data = db.exam_shcedule_tbl.Where(a => a.exam_date == exam_data.exam_date && a.exam_time == exam_data.exam_time && a.exam_type == exam_data.exam_type).FirstOrDefault();
                if (find_data == null)
                {
                    exam_data.exam_time = ex_time;
                    exam_data.exam_status = "O";
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
        public ActionResult EditExamSchedule(string exam_rowindex, string year, exam_shcedule_tbl exam_data,string exam_time)
        {
            db.Database.CommandTimeout = Int32.MaxValue;

            var user_id = Session["user_id"].ToString();
            
            try
            {

                if (exam_rowindex == "")
                {
                    throw new Exception("Exam id is empty!");
                }
                var exam_id = Convert.ToInt32(exam_rowindex);
                var ex_time = TimeSpan.Parse(exam_time);
                var find_data = db.exam_shcedule_tbl.Where(a => a.exam_id == exam_id).FirstOrDefault();

                if (find_data != null)
                {
                    find_data.exam_date = exam_data.exam_date;
                    find_data.exam_time = ex_time;
                    find_data.exam_type = exam_data.exam_type;
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


        public ActionResult DeleteExamSchedule(int exam_id, string year)
        {
            db.Database.CommandTimeout = Int32.MaxValue;
            var user_id = Session["user_id"].ToString();
          
            try
            {
                var find_data = db.exam_shcedule_tbl.Where(a => a.exam_id == exam_id).FirstOrDefault();
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