using HRIS_eRSP_Recruitment.Common_Code;
using HRIS_eRSP_Recruitment.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace HRIS_eRSP_Recruitment.Controllers
{
    public class cMainPageController : CustomController
    {
        HRIS_RCTEntities db = new HRIS_RCTEntities();
        HRIS_APLEntities db2 = new HRIS_APLEntities();
        RCT_Common rct = new RCT_Common();


        // GET: cMainPage
        public ActionResult Index()
        {
            if (Session["TEMP_user_id"] == null)
            {
                return RedirectToAction("Index", "Login");
            }
            else
            {
                Session["user_id"] = Session["TEMP_user_id"].ToString();
            }
           
            return View();
        }
        //public ActionResult Initialize(string year)
        //{

        //    db.Database.CommandTimeout = Int32.MaxValue;


        //    var nof_applicants = db.sp_number_applicants(year + "-2").ToList().OrderBy(a => a.hiring_period);
           
        //    return JSON(new
        //    {

        //        nof_applicants
                
        //    }, JsonRequestBehavior.AllowGet);

        //}

        public ActionResult barchart1(string year)
        {
            int appx_permanent = 0;
            int appx_casual = 0;
            db.Database.CommandTimeout = Int32.MaxValue;


            var nof_applicants = db.sp_number_applicants(year + "-2").ToList();
            var appx_sum = nof_applicants.Sum(a => a.yLabel);
            if(nof_applicants.Count() > 0)
            {
                var re = nof_applicants.Where(a => a.employment_type == "RE").ToList();
                var ce = nof_applicants.Where(a => a.employment_type == "CE").ToList();
                appx_permanent = (int)re.Sum(a => a.yLabel);
                appx_casual = (int)ce.Sum(a => a.yLabel);
            }
            
            return JSON(new
            {

                nof_applicants
                ,appx_sum
                ,appx_permanent
                ,appx_casual
            }, JsonRequestBehavior.AllowGet);
            
        }
        public ActionResult barchart2(string year)
        {
            db.Database.CommandTimeout = Int32.MaxValue;

            int disbx_permanent = 0;
            int disbx_casual = 0;

            var withDisabx_applicants = db.sp_number_appx_withdisability(year + "-2").ToList();
            var appx_sum = withDisabx_applicants.Sum(a => a.yLabel);

            if (withDisabx_applicants.Count() > 0)
            {
                var re = withDisabx_applicants.Where(a => a.employment_type == "RE").ToList();
                var ce = withDisabx_applicants.Where(a => a.employment_type == "CE").ToList();
                disbx_permanent = (int)re.Sum(a => a.yLabel);
                disbx_casual = (int)ce.Sum(a => a.yLabel);
            }
            return JSON(new
            {

                withDisabx_applicants
                ,appx_sum
                ,disbx_permanent
                ,disbx_casual
            }, JsonRequestBehavior.AllowGet);

        }
        public ActionResult barchart3(string year)
        {

            db.Database.CommandTimeout = Int32.MaxValue;


            var appx_insider_outsider = db.sp_number_appx_insider_outsider(year + "-2").ToList();
            var appx_insider = appx_insider_outsider.Sum(a => a.insider);
            var appx_outsider = appx_insider_outsider.Sum(a => a.outsider);
            var not_identified = appx_insider_outsider.Sum(a => a.not_identified);
            return JSON(new
            {

                appx_insider_outsider
                ,appx_insider
                ,appx_outsider
                ,not_identified
            }, JsonRequestBehavior.AllowGet);

        }
        public ActionResult piechart1(string year)
        {

            db.Database.CommandTimeout = Int32.MaxValue;


            var appx_per_gender = db.sp_number_appx_per_gender(year + "-2").ToList();

            return JSON(new
            {

                appx_per_gender
            }, JsonRequestBehavior.AllowGet);

        }
        public ActionResult piechart2(string year)
        {

            db.Database.CommandTimeout = Int32.MaxValue;


            var appx_per_civil_status = db.sp_number_appx_per_civilstatus(year + "-2").ToList();

            return JSON(new
            {

                appx_per_civil_status
            }, JsonRequestBehavior.AllowGet);

        }
        public ActionResult barchart4(string year)
        {

            db.Database.CommandTimeout = Int32.MaxValue;


            var appx_per_religion = db.sp_number_appx_per_religion(year + "-2").ToList();
            var appx_sum = appx_per_religion.Sum(a => a.yLabel);
            return JSON(new
            {

                appx_per_religion
                ,appx_sum
            }, JsonRequestBehavior.AllowGet);

        }
        public ActionResult barchart5(string year)
        {

            db.Database.CommandTimeout = Int32.MaxValue;


            var appx_per_ethnicity = db.sp_number_appx_per_ethnicity(year + "-2").ToList();
            var appx_sum = appx_per_ethnicity.Sum(a => a.yLabel);

            return JSON(new
            {

                appx_per_ethnicity
                ,appx_sum
            }, JsonRequestBehavior.AllowGet);

        }
    }
}