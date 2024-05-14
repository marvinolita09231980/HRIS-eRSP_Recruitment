using HRIS_eRSP_Recruitment.Common_Code;
using HRIS_eRSP_Recruitment.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity.Validation;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace HRIS_eRSP_Recruitment.Controllers
{
    public class cViewUploadedFileFromAPLController : CustomController
    {
        string urlname = "cViewUploadedFileFromAPL";
        HRIS_RCTEntities db = new HRIS_RCTEntities();
        HRIS_APLEntities db2 = new HRIS_APLEntities();
        User_Menu um;
        RCT_Common rct = new RCT_Common();
        private string destFile;

        // GET: cViewUploadedFileFromAPL
        public ActionResult Index(String app_ctrl_nbr,string origin)
        {
            CheckSession();
            if (app_ctrl_nbr == null || app_ctrl_nbr == "")
            {
                return RedirectToAction("Index", "cApplicantsReview");
            }
            else
            {
                Session["app_ctrl_nbr_apldocs"] = app_ctrl_nbr;
                Session["origin"] = origin;
                return View();
            }
           
        }

        public ActionResult Initialize()
        {
            CheckSession();
            var app_ctrl_nbr = Session["app_ctrl_nbr_apldocs"].ToString();
            var origin = Session["origin"].ToString();

            List<sp_get_uploadedfile_from_APL_Result> app_uploadedfile = new List<sp_get_uploadedfile_from_APL_Result>();
            List<sp_get_uploadedfile_from_APL2_Result> app_uploadedfile2 = new List<sp_get_uploadedfile_from_APL2_Result>();
            try
            {
                if(origin == "app_review")
                {
                    var app_info = (from ar in db.applicants_review_tbl
                                    join ap in db.applicants_tbl
                                     on ar.info_ctrl_nbr equals ap.info_ctrl_nbr
                                    where ar.app_ctrl_nbr == app_ctrl_nbr
                                    select new
                                    {
                                         ap.info_ctrl_nbr
                                        ,ap.first_name
                                        ,ap.middle_name
                                        ,ap.last_name
                                        ,ap.empl_id
                                        ,ap.empl_photo_img
                                    }).FirstOrDefault();
                    app_uploadedfile = db.sp_get_uploadedfile_from_APL(app_ctrl_nbr).ToList();
                    return JSON(new { message = fetch.success, icon = icon.success, app_uploadedfile, app_info }, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    var app_info = (from ar in db2.onlineApplicants_register_tbl
                                    join ap in db2.personnelnames_tbl
                                     on ar.info_ctrl_nbr equals ap.empl_id
                                    join az in db2.personnel_tbl
                                    on ar.info_ctrl_nbr equals az.empl_id
                                    where ar.info_ctrl_nbr == app_ctrl_nbr
                                    select new
                                    {
                                        ar.info_ctrl_nbr,
                                        ap.first_name
                                        ,
                                        ap.middle_name
                                        ,
                                        ap.last_name
                                        ,
                                        ap.empl_id
                                        ,
                                        az.empl_photo_img
                                    }).FirstOrDefault();
                    app_uploadedfile2 = db.sp_get_uploadedfile_from_APL2(app_ctrl_nbr).ToList();
                    return JSON(new { message = fetch.success, icon = icon.success, app_info, app_uploadedfile= app_uploadedfile2}, JsonRequestBehavior.AllowGet);
                }
               
               
            }
            catch (DbEntityValidationException e)
            {
                return Json(new { message = DbEntityValidationExceptionError(e), icon = icon.error }, JsonRequestBehavior.AllowGet);
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

        public ActionResult Copyfiles(sp_get_uploadedfile_from_APL_Result data)
        {
            CheckSession();
            var sourcePath = "";
            string destFile = "";
            try
            {
                string fileName = ""; 

                string[] splitpath = data.file_path.Split('\\');
                int splitpath_len = splitpath.Length-1;
                for (var x = 0; x <= splitpath_len-1; x++)
                {
                    if(x == 0)
                    {
                        sourcePath += splitpath[x] ;
                    }
                    else
                    {
                        sourcePath = sourcePath +"\\"+ splitpath[x] ;
                    }
                   
                }
               
                string targetPath = Server.MapPath("~/UploadedFile");
                
                string sourceFile = System.IO.Path.Combine(sourcePath, fileName);
               
                if (System.IO.Directory.Exists(sourcePath))
                {
                    string[] files = System.IO.Directory.GetFiles(sourcePath);

                    foreach (string s in files)
                    {
                      
                        fileName = System.IO.Path.GetFileName(s);
                        string[] sfn = fileName.Split(new char[] { '_' });
                        if(sfn[0].ToString() == data.apl_id)
                        {
                            destFile = System.IO.Path.Combine(targetPath, fileName);
                            System.IO.File.Copy(s, destFile, true);
                        }

                    }
                    return Json(new { message = saved.success, icon = icon.success }, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    return Json(new { message = saved.success, icon = icon.success }, JsonRequestBehavior.AllowGet);
                }
                
            }
            catch (DbEntityValidationException exp)
            {
                return Json(new { message = DbEntityValidationExceptionError(exp), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }
        public ActionResult getUploadedFileOnline(string empl_id)
        {
            CheckSession();
            try
            {
                var uf = db.sp_getUploadedFileOnline(empl_id).ToList();
                return Json(new { message = saved.success, icon = icon.success, uf}, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException exp)
            {
                return Json(new { message = DbEntityValidationExceptionError(exp), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }

        public ActionResult PreviousPage()
        {
            CheckSession();
            try
            {

                var previouspage = Session["history_page"].ToString();

                return Json(new { message = saved.success, icon = icon.success, previouspage}, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException exp)
            {
                return Json(new { message = DbEntityValidationExceptionError(exp), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }

       
        public ActionResult getPDFFile(string info_ctrl_nbr,string doc_type,string file_path)
        {
            CheckSession();
            try
            {

                var pdf_file = db2.applicant_attachment_tbl.Where(a => a.info_ctrl_nbr == info_ctrl_nbr && a.doc_type == doc_type && a.file_path == file_path).FirstOrDefault();

                return JSON(new { message = saved.success, icon = icon.success, pdf_file }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException exp)
            {
                return JSON(new { message = DbEntityValidationExceptionError(exp), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }
    }
}