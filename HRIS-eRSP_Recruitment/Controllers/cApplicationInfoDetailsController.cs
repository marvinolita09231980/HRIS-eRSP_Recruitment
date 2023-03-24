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
    public class cApplicationInfoDetailsController : CustomController
    {
        string urlname = "cApplicantsInfo";
        HRIS_RCTEntities db = new HRIS_RCTEntities();
        User_Menu um;
        RCT_Common rct = new RCT_Common();
        // GET: cApplicationInfoDetails
        public ActionResult Index(string info_ctrl_nbr)
        {
            if (info_ctrl_nbr == null)
            {
                rct.infoControlNbr();
            }
            else
            {
                Session["info_ctrl_nbr"] = info_ctrl_nbr;
             
            }
            return View();
        }
        public ActionResult Initialize()
        {
            CheckSession();
            um = rct.GetAllowAccess();
            var info_ctrl_nbr = rct.infoControlNbr();
             
            try
            {
                var returndata = db.vw_applicant_tbl_list.Where(a => a.info_ctrl_nbr == info_ctrl_nbr).ToList();

                return JSON(new { message = fetch.success, icon = icon.success, returndata, info_ctrl_nbr,um}, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return Json(new { message = DbEntityValidationExceptionError(e) }, JsonRequestBehavior.AllowGet);
            }

        }


        public ActionResult Education()
        {
            CheckSession();
            rct.infoControlNbr();
            return View();
        }
        public ActionResult InitializeEduc(string info_ctrl_nbr)
        {
            CheckSession();
            try
            {
                var applicant = db.vw_applicant_tbl_list.Where(a => a.info_ctrl_nbr == info_ctrl_nbr).FirstOrDefault();
                var educ_type = db.vw_applicant_educ_type_tbl.ToList();
                var returndata = db.vw_applicant_educ_tbl_list.Where(a => a.info_ctrl_nbr == info_ctrl_nbr).ToList();
                return JSON(new { message = fetch.success, icon = icon.success, returndata, info_ctrl_nbr, educ_type, applicant}, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return Json(new { message = DbEntityValidationExceptionError(e) }, JsonRequestBehavior.AllowGet);
            }
        }


        public ActionResult Training()
        {
            CheckSession();
            rct.infoControlNbr();
            return View();
        }
        public ActionResult InitializeTrain(string info_ctrl_nbr)
        {
            CheckSession();
            try
            {
                var applicant = db.vw_applicant_tbl_list.Where(a => a.info_ctrl_nbr == info_ctrl_nbr).FirstOrDefault();

                var returndata = db.vw_applicant_learnanddevt_tbl_list.Where(a => a.info_ctrl_nbr == info_ctrl_nbr).ToList();
                return JSON(new { message = fetch.success, icon = icon.success, returndata, info_ctrl_nbr, applicant }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return Json(new { message = DbEntityValidationExceptionError(e) }, JsonRequestBehavior.AllowGet);
            }
        }
        public ActionResult Eligibility()
        {
            CheckSession();
            rct.infoControlNbr();
            return View();
        }
        public ActionResult InitializeElig(string info_ctrl_nbr)
        {
            CheckSession();
            try
            {
                var applicant = db.vw_applicant_tbl_list.Where(a => a.info_ctrl_nbr == info_ctrl_nbr).FirstOrDefault();
                var returndata = db.vw_applicant_eligibility_tbl_list.Where(a => a.info_ctrl_nbr == info_ctrl_nbr).ToList();
                return JSON(new { message = fetch.success, icon = icon.success, returndata, info_ctrl_nbr, applicant}, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return Json(new { message = DbEntityValidationExceptionError(e) }, JsonRequestBehavior.AllowGet);
            }
        }
        public ActionResult Experience()
        {
            CheckSession();
            rct.infoControlNbr();  
            return View();

        }
        public ActionResult InitializeExp(string info_ctrl_nbr)
        {
            CheckSession();
            try
            {
                var applicant = db.vw_applicant_tbl_list.Where(a => a.info_ctrl_nbr == info_ctrl_nbr).FirstOrDefault();
                var returndata = db.vw_applicant_workexprnce_tbl_list.Where(a => a.info_ctrl_nbr == info_ctrl_nbr).ToList();
                return JSON(new { message = fetch.success, icon = icon.success, returndata, info_ctrl_nbr, applicant }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return Json(new { message = DbEntityValidationExceptionError(e) }, JsonRequestBehavior.AllowGet);
            }
        }

        public ActionResult Attachements()
        {
            CheckSession();
            rct.infoControlNbr();
            return View();

        }
        public ActionResult InitializeAttache(string info_ctrl_nbr)
        {
            CheckSession();
            try
            {
                var applicant = db.vw_applicant_tbl_list.Where(a => a.info_ctrl_nbr == info_ctrl_nbr).FirstOrDefault();
                var budgetyear = db.sp_budgetyears_tbl_combolist1_RCT("");
                var returndata = db.applicant_attachment_tbl.Where(a => a.info_ctrl_nbr == info_ctrl_nbr).ToList();
                return JSON(new { message = fetch.success, icon = icon.success, returndata, info_ctrl_nbr, applicant}, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return Json(new { message = DbEntityValidationExceptionError(e), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }
        public ActionResult SaveAttachements(string doc, string[] data)
        {
            CheckSession();
            var info_ctrl_nbr = rct.infoControlNbr();
            List<applicant_attachment_tbl> file_att = new List<applicant_attachment_tbl>();
            var seq = 0;
            try
            {

                var s = db.applicant_attachment_tbl.OrderByDescending(a => a.seq_no).FirstOrDefault();
                if (s == null)
                {
                    seq = 1;
                }
                else
                {
                    seq = Convert.ToInt32(s.seq_no) + 1;
                }

                for (var i = 1; i < data.Length; i++)
                {
                    //E:\HRIS_RECRUITMENT\HRIS-eRSP_Recruitment -2020-04-10\HRIS-eRSP_Recruitment\UploadedFile\
                    string uploaddir = System.Configuration.ConfigurationManager.AppSettings["UploadedFile"];
                    var fname = System.IO.Path.Combine(Server.MapPath("~/" + uploaddir + "/"), "UploadedFile\\" + info_ctrl_nbr.Trim() + "_RCT_" + data[i]);

                    applicant_attachment_tbl attch = new applicant_attachment_tbl();
                    attch.seq_no = seq;
                    attch.info_ctrl_nbr = info_ctrl_nbr;
                    attch.doc_type = doc;
                    attch.file_path = fname;
                    db.applicant_attachment_tbl.Add(attch);
                    file_att.Add(attch);
                    db.SaveChanges();
                    seq++;
                }
                return Json(new { message = saved.success, icon = icon.success, file_att }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException exp)
            {
                return Json(new { message = DbEntityValidationExceptionError(exp), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public ActionResult DeleteAttachements(applicant_attachment_tbl att)
        {
            CheckSession();
            var info_ctrl_nbr = rct.infoControlNbr();
            try
            {
                if (System.IO.File.Exists(att.file_path))
                {
                    var fileX = db.applicant_attachment_tbl.Where(a => a.seq_no == att.seq_no && a.info_ctrl_nbr == info_ctrl_nbr).FirstOrDefault();
                    db.applicant_attachment_tbl.Remove(fileX);
                    db.SaveChanges();
                    System.IO.File.Delete(att.file_path);
                    return Json(new { message = delete.success, icon = icon.success }, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    return Json(new { message = delete.failed, icon = icon.error }, JsonRequestBehavior.AllowGet);
                }


            }
            catch (DbEntityValidationException exp)
            {
                return Json(new { message = DbEntityValidationExceptionError(exp), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }
        public ActionResult CheckFile(string doc, string file)
        {
            CheckSession();
            var info_ctrl_nbr = rct.infoControlNbr();
            var fileXs = 0;

            try
            {
                string uploaddir = System.Configuration.ConfigurationManager.AppSettings["UploadedFile"];
                var fname = System.IO.Path.Combine(Server.MapPath("~/" + uploaddir + "/"), "UploadedFile\\" + info_ctrl_nbr.Trim() + "_RCT_" + file);
                if (System.IO.File.Exists(fname))
                {
                    fileXs = 1;
                }
                else
                {
                    fileXs = 0;
                }
                return Json(new { message = saved.success, icon = icon.success, fileXs }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException exp)
            {
                return Json(new { message = DbEntityValidationExceptionError(exp), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }
        public ActionResult AddEduc(applicant_educ_tbl ed)
        {
            CheckSession();
            var info_ctrl_nbr = rct.infoControlNbr();
            try
            {
                var seq = db.sp_getlast_sequence("applicant_educ_tbl").FirstOrDefault();
                ed.info_ctrl_nbr = info_ctrl_nbr;
                ed.seq_no = Convert.ToInt32(seq);

                db.applicant_educ_tbl.Add(ed);
                db.SaveChanges();
                var returndata = db.vw_applicant_educ_tbl_list.Where(a => a.info_ctrl_nbr == info_ctrl_nbr).ToList();
                return Json(new { message = insert.success, icon = icon.success, returndata }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException exp)
            {
                return Json(new { message = DbEntityValidationExceptionError(exp), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }

        public ActionResult EditEduc(applicant_educ_tbl ed, string info_ctrl_nbr, int seq_no)
        {
            CheckSession();
            try
            {
                var edu = db.applicant_educ_tbl.Where(a => a.info_ctrl_nbr == info_ctrl_nbr && a.seq_no == seq_no).FirstOrDefault();
                edu.educ_type = ed.educ_type;
                edu.school_name = ed.school_name;
                edu.basic_educ_deg = ed.basic_educ_deg;
                edu.period_from = ed.period_from;
                edu.period_to = ed.period_to;
                edu.highest_lvl_earned = ed.highest_lvl_earned;
                edu.year_graduated = ed.year_graduated;
                edu.schlr_acdmic_rcvd = ed.schlr_acdmic_rcvd;
                db.SaveChanges();
                var returndata = db.vw_applicant_educ_tbl_list.Where(a => a.info_ctrl_nbr == info_ctrl_nbr).ToList();
                return Json(new { message = update.success, icon = icon.success, returndata }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException exp)
            {
                return Json(new { message = DbEntityValidationExceptionError(exp), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }

        public ActionResult DeleteEduc(string info_ctrl_nbr, int seq_no)
        {
            CheckSession();
            try
            {
                var edu = db.applicant_educ_tbl.Where(a => a.info_ctrl_nbr == info_ctrl_nbr && a.seq_no == seq_no).FirstOrDefault();
                db.applicant_educ_tbl.Remove(edu);
                db.SaveChanges();
                var returndata = db.vw_applicant_educ_tbl_list.Where(a => a.info_ctrl_nbr == info_ctrl_nbr).ToList();
                return Json(new { message = delete.success, icon = icon.success, returndata }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException exp)
            {
                return Json(new { message = DbEntityValidationExceptionError(exp), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }

        public ActionResult EditElig(applicant_eligibilty_tbl el, string info_ctrl_nbr, int seq_no)
        {
            CheckSession();
            try
            {
                var eli = db.applicant_eligibilty_tbl.Where(a => a.info_ctrl_nbr == info_ctrl_nbr && a.seq_no == seq_no).FirstOrDefault();
                eli.cscsrvc_ra1080 = el.cscsrvc_ra1080;
                eli.rating = el.rating;
                eli.examination_date = el.examination_date;
                eli.examination_place = el.examination_place;
                eli.number = el.number;
                eli.validity_date = el.validity_date;
                db.SaveChanges();
                var returndata = db.vw_applicant_eligibility_tbl_list.Where(a => a.info_ctrl_nbr == info_ctrl_nbr).ToList();
                return Json(new { message = update.success, icon = icon.success, returndata }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException exp)
            {
                return Json(new { message = DbEntityValidationExceptionError(exp), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }
        public ActionResult AddElig(applicant_eligibilty_tbl el)
        {
            CheckSession();
            var info_ctrl_nbr = rct.infoControlNbr();
            try
            {
                var seq = db.sp_getlast_sequence("applicant_eligibilty_tbl").FirstOrDefault();
                el.info_ctrl_nbr = info_ctrl_nbr;
                el.seq_no = Convert.ToInt32(seq);
                db.applicant_eligibilty_tbl.Add(el);
                db.SaveChanges();
                var returndata = db.vw_applicant_eligibility_tbl_list.Where(a => a.info_ctrl_nbr == info_ctrl_nbr).ToList();
                return Json(new { message = insert.success, icon = icon.success, returndata }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException exp)
            {
                return Json(new { message = DbEntityValidationExceptionError(exp), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }
        public ActionResult DeleteElig(string app_ctrl_nbr, int seq_no)
        {
            CheckSession();
            try
            {
                var eli = db.applicant_eligibilty_tbl.Where(a => a.info_ctrl_nbr == app_ctrl_nbr && a.seq_no == seq_no).FirstOrDefault();
                db.applicant_eligibilty_tbl.Remove(eli);
                db.SaveChanges();
                var returndata = db.vw_applicant_eligibility_tbl_list.Where(a => a.info_ctrl_nbr == app_ctrl_nbr).ToList();
                return Json(new { message = delete.success, icon = icon.success, returndata }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException exp)
            {
                return Json(new { message = DbEntityValidationExceptionError(exp), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }


        public ActionResult EditWexp(applicant_workexprnce_tbl wx, string info_ctrl_nbr, int seq_no)
        {
            CheckSession();
            try
            {
                var wex = db.applicant_workexprnce_tbl.Where(a => a.info_ctrl_nbr == info_ctrl_nbr && a.seq_no == seq_no).FirstOrDefault();
                wex.workexp_from = wx.workexp_from;
                wex.workexp_to = wx.workexp_to;
                wex.position_title = wx.position_title;
                wex.dept_agncy_offc_co = wx.dept_agncy_offc_co;
                wex.monthly_salary = wx.monthly_salary;
                wex.salary_job_grade = wx.salary_job_grade;
                wex.appt_status = wx.appt_status;
                wex.gov_srvc = wx.gov_srvc;
                db.SaveChanges();
                var returndata = db.vw_applicant_workexprnce_tbl_list.Where(a => a.info_ctrl_nbr == info_ctrl_nbr).ToList();
                return Json(new { message = update.success, icon = icon.success, returndata }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException exp)
            {
                return Json(new { message = DbEntityValidationExceptionError(exp), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }
        public ActionResult AddWexp(applicant_workexprnce_tbl wx)
        {
            CheckSession();
            var info_ctrl_nbr = rct.infoControlNbr();
            try
            {
                var seq = db.sp_getlast_sequence("applicant_workexprnce_tbl").FirstOrDefault();
                wx.info_ctrl_nbr = info_ctrl_nbr;
                wx.seq_no = Convert.ToInt32(seq);
                db.applicant_workexprnce_tbl.Add(wx);
                db.SaveChanges();
                var returndata = db.vw_applicant_workexprnce_tbl_list.Where(a => a.info_ctrl_nbr == info_ctrl_nbr).ToList();
                return Json(new { message = insert.success, icon = icon.success, returndata }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException exp)
            {
                return Json(new { message = DbEntityValidationExceptionError(exp), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }
        public ActionResult DeleteWexp(string info_ctrl_nbr, int seq_no)
        {
            CheckSession();
            try
            {
                var wxp = db.applicant_workexprnce_tbl.Where(a => a.info_ctrl_nbr == info_ctrl_nbr && a.seq_no == seq_no).FirstOrDefault();
                db.applicant_workexprnce_tbl.Remove(wxp);
                db.SaveChanges();
                var returndata = db.vw_applicant_workexprnce_tbl_list.Where(a => a.info_ctrl_nbr == info_ctrl_nbr).ToList();
                return Json(new { message = delete.success, icon = icon.success, returndata }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException exp)
            {
                return Json(new { message = DbEntityValidationExceptionError(exp), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }



        public ActionResult EditLnD(applicant_learnanddevt_tbl ld, string info_ctrl_nbr, int seq_no)
        {
            CheckSession();
            try
            {
                var lnd = db.applicant_learnanddevt_tbl.Where(a => a.info_ctrl_nbr == info_ctrl_nbr && a.seq_no == seq_no).FirstOrDefault();
                lnd.learn_devt_title = ld.learn_devt_title;
                lnd.learn_devt_from = ld.learn_devt_from;
                lnd.learn_devt_to = ld.learn_devt_to;
                lnd.no_of_hrs = ld.no_of_hrs;
                lnd.learn_devt_type = ld.learn_devt_type;
                lnd.conducted_by = ld.conducted_by;
                db.SaveChanges();
                var returndata = db.vw_applicant_learnanddevt_tbl_list.Where(a => a.info_ctrl_nbr == info_ctrl_nbr).ToList();
                return Json(new { message = update.success, icon = icon.success, returndata }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException exp)
            {
                return Json(new { message = DbEntityValidationExceptionError(exp), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }
        public ActionResult AddLnD(applicant_learnanddevt_tbl ld)
        {
            CheckSession();
            var info_ctrl_nbr = rct.infoControlNbr();
            try
            {
                var seq = db.sp_getlast_sequence("applicant_learnanddevt_tbl").FirstOrDefault();
                ld.seq_no = Convert.ToInt32(seq);
                ld.info_ctrl_nbr = info_ctrl_nbr;
                db.applicant_learnanddevt_tbl.Add(ld);
                db.SaveChanges();
                var returndata = db.vw_applicant_learnanddevt_tbl_list.Where(a => a.info_ctrl_nbr == info_ctrl_nbr).ToList();
                return Json(new { message = insert.success, icon = icon.success, returndata }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException exp)
            {
                return Json(new { message = DbEntityValidationExceptionError(exp), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }
        public ActionResult DeleteLnD(string info_ctrl_nbr, int seq_no)
        {
            CheckSession();
            try
            {
                var lnd = db.applicant_learnanddevt_tbl.Where(a => a.info_ctrl_nbr == info_ctrl_nbr && a.seq_no == seq_no).FirstOrDefault();
                db.applicant_learnanddevt_tbl.Remove(lnd);
                db.SaveChanges();
                var returndata = db.vw_applicant_learnanddevt_tbl_list.Where(a => a.info_ctrl_nbr == info_ctrl_nbr).ToList();
                return Json(new { message = delete.success, icon = icon.success, returndata }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException exp)
            {
                return Json(new { message = DbEntityValidationExceptionError(exp), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }


        public ActionResult Edit_Application(applicants_tbl app, string info_ctrl_nbr)
        {
            CheckSession();
            try
            {

                var ap = db.applicants_tbl.Where(a => a.info_ctrl_nbr == info_ctrl_nbr).FirstOrDefault();
                ap.last_name            = app.last_name;
                ap.first_name           = app.first_name;
                ap.middle_name          = app.middle_name;
                ap.birth_date           = app.birth_date;
                ap.gender               = app.gender;
                ap.civil_status         = app.civil_status;
                ap.app_address          = app.app_address;
                ap.applied_dttm         = app.applied_dttm;
                db.SaveChanges();
                return Json(new { message = update.success, icon = icon.success }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return Json(new { message = DbEntityValidationExceptionError(e), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }

        public ActionResult getBudgetCode(string employment_type)
        {
            CheckSession();
            try
            {

                var budgetcode = db.sp_budgetyears_tbl_combolist1_RCT(employment_type).ToList();

                return Json(new { message = update.success, icon = icon.success, budgetcode}, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return Json(new { message = DbEntityValidationExceptionError(e), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }

    }
}