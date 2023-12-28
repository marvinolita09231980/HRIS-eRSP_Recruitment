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
    public class cUploadAddsImageController : CustomController
    {
        string urlname = "cApplicantsInfo";
        HRIS_RCTEntities db = new HRIS_RCTEntities();
        HRIS_APLEntities db2 = new HRIS_APLEntities();
        User_Menu um;
        RCT_Common rct = new RCT_Common();
        // GET: cUploadAddsImage
        public ActionResult Index()
        {
            CheckSession();
            return View();
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

                var hiring_periods = db.sp_psb_hiring_period_active().ToList();
                return JSON(new { message = fetch.success, icon = icon.success, hiring_periods}, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return Json(new { message = DbEntityValidationExceptionError(e), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }
        public ActionResult CheckFile(string doc, string file, string employment_type, string budget_code, string item_no)
        {
            CheckSession();
            var fileXs = 0;
            var ctrl_nbr = employment_type + "-" + budget_code + "-" + item_no;
            try
            {
                string uploaddir = System.Configuration.ConfigurationManager.AppSettings["Uploadedpath"];
                var fname = System.IO.Path.Combine(Server.MapPath("~/" + uploaddir + "/"), "UploadedFile\\" + ctrl_nbr.Trim() + "_APL_" + file);
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

        //[HttpPost]
        //public ActionResult SaveAttachements()
        //{
        //    List<object> img_name_exist = new List<object>();
        //    try
        //    {

        //        var hiring_period = Request.Form[0].ToString();
               
               
        //        foreach (string i in Request.Files)
        //        {
        //            HttpPostedFileBase file = Request.Files[i];
        //            if (file != null)
        //            {
        //                var exist = db2.adds_images_tbl.Where(a => a.img_name == file.FileName).ToList();
        //                if (exist.Count() > 0)
        //                {
        //                    img_name_exist.Add(file.FileName);
        //                }
        //                else
        //                {
        //                    int length = file.ContentLength;
        //                    byte[] img = new byte[length];
        //                    file.InputStream.Read(img, 0, length);
        //                    adds_images_tbl attch = new adds_images_tbl();
        //                    attch.hiring_period = hiring_period;
        //                    attch.img_file = img;
        //                    attch.img_name = file.FileName;
        //                    db2.adds_images_tbl.Add(attch);
        //                    db2.SaveChanges();
        //                }
                           
        //            }
        //        }
        //        var img_list = db2.adds_images_tbl.Where(a => a.hiring_period == hiring_period).ToList();
        //        return JSON(new { message = saved.success, icon = icon.success, img_list, img_name_exist}, JsonRequestBehavior.AllowGet);
        //    }
        //    catch (DbEntityValidationException exp)
        //    {
        //        return Json(new { message = DbEntityValidationExceptionError(exp), icon = icon.error }, JsonRequestBehavior.AllowGet);
        //    }
        //}


        //public ActionResult SaveAttachements(string doc, string[] data, string employment_type, string budget_code, string item_no)
        //{
        //    CheckSession();
        //    var ctrl_nbr = employment_type + "-" + budget_code + "-" + item_no;
        //    List<adds_images_tbl> file_att = new List<adds_images_tbl>();

        //    try
        //    {


        //        for (var i = 1; i < data.Length; i++)
        //        {
        //            adds_images_tbl img = new adds_images_tbl();
        //            var image_file_name = "";
        //            //E:\HRIS_RECRUITMENT\HRIS-eRSP_Recruitment -2020-04-10\HRIS-eRSP_Recruitment\UploadedFile\
        //            string uploaddir2 = System.Configuration.ConfigurationManager.AppSettings["Uploadedpath"];
        //            string path = uploaddir2;
        //            var fname2 = path + ctrl_nbr.Trim() + "_APL_" + data[i];
        //            // var fname2 = System.IO.Path.Combine(Server.MapPath("~/" + uploaddir2 + "/"), ctrl_nbr.Trim() + "_APL_" + data[i]);
        //            string uploaddir = System.Configuration.ConfigurationManager.AppSettings["UploadFile"];
        //            var fname = System.IO.Path.Combine(Server.MapPath("~/" + uploaddir + "/"), ctrl_nbr.Trim() + "_APL_" + data[i]);
        //            var dta = db.sp_insert_ads_images(budget_code, employment_type, item_no, ctrl_nbr.Trim() + "_APL_" + data[i], fname, fname2).FirstOrDefault();
        //            img.budget_code = budget_code;
        //            img.employment_type = employment_type;
        //            img.item_no = item_no;
        //            img.img_file_name = ctrl_nbr.Trim() + "_APL_" + data[i];
        //            img.file_path = fname;
        //            file_att.Add(img);
        //        }

        //        return Json(new { message = saved.success, icon = icon.success, file_att }, JsonRequestBehavior.AllowGet);
        //    }
        //    catch (DbEntityValidationException exp)
        //    {
        //        return Json(new { message = DbEntityValidationExceptionError(exp), icon = icon.error }, JsonRequestBehavior.AllowGet);
        //    }
        //}

        //public ActionResult DeleteAttachements(adds_images_tbl att, string employment_type, string budget_code, string item_no)
        //{
        //    CheckSession();
        //    var info_ctrl_nbr = rct.infoControlNbr();
        //    //Uploadedpath
        //    string uploaddir = System.Configuration.ConfigurationManager.AppSettings["Uploadedpath"];
        //    System.IO.DirectoryInfo di = new DirectoryInfo(uploaddir);
        //    try
        //    {
        //        if (System.IO.File.Exists(att.file_path))
        //        {

        //            foreach (FileInfo file in di.GetFiles())
        //            {
        //                if (file.Name == att.img_file_name)
        //                {
        //                    file.Delete();
        //                }

        //            }
        //            //foreach (DirectoryInfo dir in di.GetDirectories())
        //            //{

        //            //    //dir.Delete(true);
        //            //}

        //            db.sp_delete_ads_images(att.budget_code, att.employment_type, att.item_no, att.img_file_name.Trim());
        //            System.IO.File.Delete(att.file_path);
        //            var returndata = db.adds_images_tbl.ToList();
        //            return Json(new { message = delete.success, icon = icon.success, returndata}, JsonRequestBehavior.AllowGet);
        //        }
        //        else
        //        {
        //            return Json(new { message = delete.failed, icon = icon.error }, JsonRequestBehavior.AllowGet);
        //        }

        //    }
        //    catch (DbEntityValidationException exp)
        //    {
        //        return Json(new { message = DbEntityValidationExceptionError(exp), icon = icon.error }, JsonRequestBehavior.AllowGet);
        //    }
        //}

        [HttpPost]
        public ActionResult DeleteAttachements(int seq_no, string info_ctrl_nbr)
        {

            try
            {

                var fileX = db.applicant_attachment_tbl.Where(a => a.seq_no == seq_no && a.info_ctrl_nbr == info_ctrl_nbr).FirstOrDefault();
                db.applicant_attachment_tbl.Remove(fileX);
                db.SaveChanges();

                var img_list = db2.adds_images_tbl.ToList();

                return JSON(new { message = "Successfully Deleted!", icon = icon.success, img_list }, JsonRequestBehavior.AllowGet);

            }
            catch (DbEntityValidationException exp)
            {
                return JSON(new { message = DbEntityValidationExceptionError(exp), icon = icon.success }, JsonRequestBehavior.AllowGet);
            }
        }


        public ActionResult getBudgetCode(string employment_type)
        {
            CheckSession();
            try
            {

                var budgetcode = db.sp_budgetyears_tbl_combolist1_RCT(employment_type).ToList();

                return Json(new { message = update.success, icon = icon.success, budgetcode }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return Json(new { message = DbEntityValidationExceptionError(e), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }

        public ActionResult getEmployment_Type(string employment_type)
        {
            CheckSession();
            try
            {

                var budgetcode = db.sp_budgetyears_tbl_combolist1_RCT(employment_type).ToList();

                return Json(new { message = update.success, icon = icon.success, budgetcode }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return Json(new { message = DbEntityValidationExceptionError(e), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }

        //public ActionResult getImgList(string hiring_period)
        //{
        //    try
        //    {
        //        var img_list = db2.adds_images_tbl.Where(a => a.hiring_period == hiring_period).ToList();
        //        return JSON(new { message = update.success, icon = icon.success, img_list }, JsonRequestBehavior.AllowGet);
        //    }
        //    catch (DbEntityValidationException e)
        //    {
        //        return Json(new { message = DbEntityValidationExceptionError(e), icon = icon.error }, JsonRequestBehavior.AllowGet);
        //    }
        //}
        //public ActionResult DeleteImg(int id)
        //{
        //    try
        //    {
        //        var img = db2.adds_images_tbl.Where(a => a.id == id).FirstOrDefault();
        //        var period = img.hiring_period;
        //        db2.adds_images_tbl.Remove(img);
        //        db2.SaveChanges();

        //        var img_list = db2.adds_images_tbl.Where(a => a.hiring_period == period).ToList();
        //        return JSON(new { message = update.success, icon = icon.success, img_list }, JsonRequestBehavior.AllowGet);
        //    }
        //    catch (DbEntityValidationException e)
        //    {
        //        return Json(new { message = DbEntityValidationExceptionError(e), icon = icon.error }, JsonRequestBehavior.AllowGet);
        //    }
        //}

        //public ActionResult DeleteAllImages(string hiring_period)
        //{
        //    try
        //    {

        //        var imgs = db2.adds_images_tbl;
        //        db2.adds_images_tbl.RemoveRange(imgs);           
        //        db2.SaveChanges();

        //        var img_list = db2.adds_images_tbl.Where(a => a.hiring_period == hiring_period).ToList();
        //        return JSON(new { message = update.success, icon = icon.success, img_list }, JsonRequestBehavior.AllowGet);
        //    }
        //    catch (DbEntityValidationException e)
        //    {
        //        return Json(new { message = DbEntityValidationExceptionError(e), icon = icon.error }, JsonRequestBehavior.AllowGet);
        //    }
        //}
    }
}