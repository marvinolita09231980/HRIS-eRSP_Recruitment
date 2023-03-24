﻿using HRIS_eRSP_Recruitment.Common_Code;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace eSMIS.Controllers
{
    public class ReportsController : CustomController
    {
        // GET: Reports
        public ActionResult Index()
        {
            CheckSession();
            Session["ReportName"] = Request.QueryString["ReportName"].Trim();
            Session["SaveName"] = Request.QueryString["SaveName"].Trim();
            Session["ReportType"] = Request.QueryString["ReportType"].Trim();
            Session["ReportPath"] = Request.QueryString["ReportPath"].Trim();
            Session["Sp"] = Request.QueryString["Sp"].Trim();

            return View();
        }
        public ActionResult toCrystalData()
        {
            CheckSession();
            var ReportName = Session["ReportName"];
            var SaveName = Session["SaveName"];
            var ReportType = Session["ReportType"];
            var ReportPath = Session["ReportPath"];
            var Sp = Session["Sp"];
            var isUserLogin = Session["user_id"];
            return Json(new
            {
                ReportName = ReportName,
                SaveName = SaveName,
                ReportType = ReportType,
                ReportPath = ReportPath,
                Sp = Sp,
                isUserLogin = isUserLogin
            }, JsonRequestBehavior.AllowGet);
        }
        public ActionResult SessionRemove()
        {
            CheckSession();
            Session.Remove("ReportName");
            Session.Remove("SaveName");
            Session.Remove("ReportType");
            Session.Remove("ReportPath");
            Session.Remove("Sp");
            return Json("success", JsonRequestBehavior.AllowGet);
        }
    }
}