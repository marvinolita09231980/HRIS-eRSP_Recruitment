using HRIS_eRSP_Recruitment.Common_Code;
using HRIS_eRSP_Recruitment.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace HRIS_eRSP_Recruitment.Controllers
{
    public class MenuController : CustomController
    {
        
        HRIS_RCTEntities db = new HRIS_RCTEntities();
        HRIS_PAYEntities db2 = new HRIS_PAYEntities();
        // GET: Menu
        public ActionResult Index()
        {
            CheckSession();
            return View();
        }
        public ActionResult GetMenuList()
        {
            db.Database.CommandTimeout = Int32.MaxValue;
            db2.Database.CommandTimeout = Int32.MaxValue;
            CheckSession();
            List<sp_budgetyears_tbl_combolist1_RCT_Result> budgetyear = new List<sp_budgetyears_tbl_combolist1_RCT_Result>();
            List<sp_user_menu_access_role_list_RCT_Result> data = new List<sp_user_menu_access_role_list_RCT_Result>();
            //menulst = (List<Object>)Session["menu"];
            if (Session["user_id"] != null)
            {
                var empl_id = Session["empl_id"].ToString();


                var emp_photo_byte_arr = db.vw_empl_photo_img.Where(a => a.empl_id == empl_id).FirstOrDefault().empl_photo_img;


                //string imreBase64Data = "";
                string imgDataURL = null;
                //***************convert byte array to image***********************************

                //*****************************************************************************
                if (emp_photo_byte_arr != null)
                {
                    //imreBase64Data = Convert.ToBase64String(emp_photo_byte_arr);
                    //imgDataURL = string.Format("data:image/png;base64,{0}", imreBase64Data);
                    imgDataURL = "http://192.168.5.218/storage/images" + emp_photo_byte_arr;
                }
                else
                {
                    imgDataURL = "../ResourcesImages/upload_profile.png";
                }
                //imgDataURL = "../ResourcesImages/upload_profile.png";
                //if (emp_photo_byte_arr != null)
                //{
                //    imreBase64Data = Convert.ToBase64String(emp_photo_byte_arr);
                //}
                //if (imreBase64Data != "")
                //{
                //    imgDataURL = string.Format("data:image/png;base64,{0}", imreBase64Data);
                //}


                var employment_type = Session["employment_type"] == null ? "" : Session["employment_type"].ToString();
                var budget_code = Session["budget_code"] == null ? "" : Session["budget_code"].ToString();
                if(employment_type != "")
                {
                    budgetyear = db.sp_budgetyears_tbl_combolist1_RCT(employment_type).ToList();
                }


                if (HttpContext.Session["sp_user_menu_access_role_list_RCT"] == null)
                {
                    data = db.sp_user_menu_access_role_list_RCT(Session["user_id"].ToString(), 11).ToList();
                    HttpContext.Session["sp_user_menu_access_role_list_RCT"] = data;
                }
                else
                {
                    data = (List<sp_user_menu_access_role_list_RCT_Result>)HttpContext.Session["sp_user_menu_access_role_list_RCT"];
                }

                var User_Name = Session["first_name"].ToString() + " " + Session["last_name"];

                return JSON(new { budgetyear, employment_type, budget_code, data, photo = imgDataURL, success = 1, username = User_Name }, JsonRequestBehavior.AllowGet);
                //if (Session["expanded"] != null)
                //    return JSON(new { budgetyear,  employment_type, budget_code, data = data, expanded = Session["expanded"], photo = imgDataURL, success = 1, username = User_Name }, JsonRequestBehavior.AllowGet);
                //else return JSON(new {budgetyear, employment_type, budget_code, data = data, expanded = 0, photo = imgDataURL, success = 1, username = User_Name }, JsonRequestBehavior.AllowGet);

            }
            else
            {
                return Json(new { data = 0, success = 0 }, JsonRequestBehavior.AllowGet);
            }

        }

        //public void CreateSession(List<sp_user_menu_access_role_list_RCT_Result> data)
        //{
        //    var dataLen = data.Count();
        //    for (var x = 0; x < dataLen; x++)
        //    {

        //        Session[" menu " + x.ToString()] = 
        //    }
        //}

        public ActionResult getUserImageId()
        {
            db.Database.CommandTimeout = Int32.MaxValue;
            db2.Database.CommandTimeout = Int32.MaxValue;
            CheckSession();
            var empl_id = Session["empl_id"].ToString();
            var emp_photo_byte_arr = db.vw_personnel_tbl_image_RCT.Where(a => a.empl_id == empl_id).FirstOrDefault().empl_photo_img;

            return Json(emp_photo_byte_arr, JsonRequestBehavior.AllowGet);
        }


        public ActionResult Budget_Code(string budget_code)
        {
            db.Database.CommandTimeout = Int32.MaxValue;
            db2.Database.CommandTimeout = Int32.MaxValue;
            CheckSession();
            var page = Session["page"].ToString();
            Session["budget_code"] = budget_code;

            var employment_type = Session["employment_type"].ToString();

            List<sp_applied_item_from_APL_Result> item_nbrs = new List<sp_applied_item_from_APL_Result>();

            if (page == "cOnlineApplicantsList")
            {
                item_nbrs = db.sp_applied_item_from_APL(employment_type, budget_code).ToList();
            }

            var icon = "success";
            
            return Json( new {item_nbrs, icon}, JsonRequestBehavior.AllowGet);
        }


        public ActionResult expandedAdd(string id, int menulevel)
        {
           
            CheckSession();
            List<String> ls = new List<string>();
            List<String> ls2 = new List<string>();
            if (menulevel == 1) Session["expanded"] = null;
            if (Session["expanded"] != null)
            {
                ls = (List<String>)Session["expanded"];
                foreach (string l in ls)
                {
                    ls2.Add(l);
                }
                ls2.Add(id);
                Session["expanded"] = ls2;
            }
            else
            {
                ls2.Add(id);
                Session["expanded"] = ls2;

            }
            return Json(Session["expanded"], JsonRequestBehavior.AllowGet);

        }
        public ActionResult expandedRemove(string id)
        {
            CheckSession();
            List<String> ls = new List<string>();

            if (Session["expanded"] != null)
            {
                ls = (List<String>)Session["expanded"];
                ls.Remove(id);
                Session["expanded"] = ls;
            }
            return Json(Session["expanded"], JsonRequestBehavior.AllowGet);
        }
        public ActionResult returnSesion()
        {
            CheckSession();
            return Json(Session["expanded"], JsonRequestBehavior.AllowGet);

        }
        public ActionResult UserAccessOnPage(sp_user_menu_access_role_list_RCT_Result list)
        {
            Session.Remove("ca_psb_ctrl_nbr");
            Session.Remove("ca_item_no");
            Session.Remove("ca_budget_code");
            Session.Remove("ca_employment_type");
            Session.Remove("ca_salary_grade");
            Session.Remove("ca_ranked");

            CheckSession();
            Session["allow_add"] = list.allow_add;
            Session["allow_delete"] = list.allow_delete;
            Session["allow_edit"] = list.allow_edit;
            Session["allow_edit_history"] = list.allow_edit_history;
            Session["allow_print"] = list.allow_print;
            Session["allow_view"] = list.allow_view;
            Session["url_name"] = list.url_name;
            Session["id"] = list.id;
            Session["menu_name"] = list.menu_name;
            Session["page_title"] = list.page_title;

            return Json("success", JsonRequestBehavior.AllowGet);
        }

        //protected JsonResult JSON(object data, JsonRequestBehavior behavior)
        //{
        //    return new JsonResult()
        //    {
        //        Data = data,
        //        ContentType = "application/json",
        //        ContentEncoding = System.Text.Encoding.UTF8,
        //        JsonRequestBehavior = behavior,
        //        MaxJsonLength = Int32.MaxValue
        //    };
        //}
    }
}