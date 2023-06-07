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
    public class cAddPsbScheduleController : CustomController
    {
        HRIS_RCTEntities db = new HRIS_RCTEntities();
        HRIS_APLEntities db2 = new HRIS_APLEntities();
        User_Menu um;
        RCT_Common rct = new RCT_Common();
        // GET: cAddPsbSchedule
        public ActionResult Index()
        {

            if (Session["user_id"] == null)
            {
                return RedirectToAction("Index", "Login");
            }
            return View();
        }

        
        public ActionResult Initialize()
        {
            CheckSession();
            um = rct.GetAllowAccess();
            try
            {
                var departments = from dep in db.vw_departments_tbl
                                  select new
                                  {
                                       dep.department_code
                                      ,dep.empl_id
                                      ,dep.department_name1
                                  };
               
                var panel_role = db.psb_mbr_role_tbl.Where(a => a.psb_mbr_role == "03").ToList();
                return Json(new { message = fetch.success, icon = icon.success, panel_role, departments}, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return Json(new { message = DbEntityValidationExceptionError(e) }, JsonRequestBehavior.AllowGet);
            }
        }
        public ActionResult getAvailable_item_tbl(string psb_ctrl_nbr, string budget_code, string employment_type)
        {
            CheckSession();
            try
            {
                var sched_itemlist_toremove = db.sp_forscheduleitem_list_toremove(psb_ctrl_nbr, budget_code, employment_type).ToList();
                var sched_itemlist = db.sp_forscheduleitem_list(psb_ctrl_nbr, budget_code,employment_type).ToList();
                return Json(new { message = fetch.success, icon = icon.success, sched_itemlist, sched_itemlist_toremove}, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return Json(new { message = DbEntityValidationExceptionError(e) }, JsonRequestBehavior.AllowGet);
            }
        }
        public ActionResult getBudgetYear(string employment_type)
        {
            CheckSession();
            try
            {
                var budget_year = db.sp_budgetyears_tbl_combolist1_RCT(employment_type).ToList();
                return Json(new { message = fetch.success, icon = icon.success, budget_year }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return Json(new { message = DbEntityValidationExceptionError(e) }, JsonRequestBehavior.AllowGet);
            }
        }
        public ActionResult selectDepartment(string psb_ctrl_nbr, string department_code)
        {
            try
            {
                var appls_in_items = db.sp_applicant_In_ItemAdded_list2(psb_ctrl_nbr, department_code).ToList();
                return Json(new { message = fetch.success, icon = icon.success, appls_in_items }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return Json(new { message = DbEntityValidationExceptionError(e) }, JsonRequestBehavior.AllowGet);
            }
        }
      
        public ActionResult getDepartment()
        {
            CheckSession();
            try
            {
                var department = db.vw_departments_tbl.ToList();
                return Json(new { message = insert.success, icon = icon.success, department}, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return Json(new { message = DbEntityValidationExceptionError(e) }, JsonRequestBehavior.AllowGet);
            }
        }
        public ActionResult savePSBSchedule(psb_sked_hdr_tbl data, string employment_type, string budget_code)
        {
            CheckSession();
            try
            {
                var psb_ctrl_nbr = db.sp_autogen_psb_ctrl_nbr().FirstOrDefault();
                data.psb_ctrl_nbr = psb_ctrl_nbr;
                data.psb_status = 0;
                db.psb_sked_hdr_tbl.Add(data);
                db.SaveChanges();
                var sched = db.sp_psb_sked_hdr_tbl_list(data.employment_type, data.budget_code).ToList();
                var sched_itemlist = db.sp_forscheduleitem_list(psb_ctrl_nbr, data.budget_code, data.employment_type).ToList();
                return Json(new { message = insert.success, icon = icon.success, sched, psb_ctrl_nbr, sched_itemlist }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return Json(new { message = DbEntityValidationExceptionError(e) }, JsonRequestBehavior.AllowGet);
            }
        }
        public ActionResult getHiringPeriod(string employment_type, string budget_code)
        {
            CheckSession();
            try
            {
                var hiring_periods = db.psb_hiring_period_tbl.Where(a => a.budget_code == budget_code && a.employment_type == employment_type).ToList();
                return Json(new { message = insert.success, icon = icon.success, hiring_periods }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return Json(new { message = DbEntityValidationExceptionError(e) }, JsonRequestBehavior.AllowGet);
            }
        }
        public ActionResult editPSBSchedule(string psb_ctrl_nbr, psb_sked_hdr_tbl data, string employment_type, string budget_code)
        {
            CheckSession();
            try
            {
                var schd = db.psb_sked_hdr_tbl.Where(a => a.psb_ctrl_nbr == psb_ctrl_nbr).FirstOrDefault();
                schd.psb_date = data.psb_date;
                schd.budget_code = data.budget_code;
                schd.employment_type = data.employment_type;
                schd.remarks_details = data.remarks_details;
                db.SaveChanges();
             
                return Json(new { message = update.success, icon = icon.success }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return Json(new { message = DbEntityValidationExceptionError(e) }, JsonRequestBehavior.AllowGet);
            }
        }
        public ActionResult isDateExist(psb_sked_hdr_tbl data)
        {
            CheckSession();
            int exist = 0;
            try
            {
                var psb = db.psb_sked_hdr_tbl.Where(a => a.psb_date == data.psb_date).Count();
                if (psb > 0)
                {
                    exist = 1;
                }
                else
                {
                    exist = 0;
                }

                return Json(new { message = insert.success, icon = icon.success, exist }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return Json(new { message = DbEntityValidationExceptionError(e) }, JsonRequestBehavior.AllowGet);
            }
        }
        public ActionResult getPSBSchedule(string budget_code, string employment_type)
        {
            CheckSession();
            Session["employmenttype"] = employment_type;
            Session["budgetcode"] = budget_code;
            try
            {
                var psb_sched = db.sp_psb_sked_hdr_tbl_list(employment_type, budget_code).ToList();
                return Json(new { message = insert.success, icon = icon.success, psb_sched }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return Json(new { message = DbEntityValidationExceptionError(e) }, JsonRequestBehavior.AllowGet);
            }
        }
        public ActionResult findUser(string user_id, string user_type)
        {
            CheckSession();
            try
            {
                var personnelname = db.sp_psb_name_info(user_id, user_type).ToList();
                var found = personnelname.Count();
                return Json(new { message = insert.success, icon = icon.success, personnelname,found}, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return Json(new { message = DbEntityValidationExceptionError(e) }, JsonRequestBehavior.AllowGet);
            }
        }

        //public ActionResult savePSBPanel(psb_sked_mbr_tbl data, string user_type)
        //{
        //    CheckSession();
        //    if (Session["user_id"] == null)
        //    {
        //        return RedirectToAction("Index", "Login");
        //    }
        //    var panel_role = "";
        //    var inhouse = false;

        //    if (user_type == "E")
        //    {
        //        inhouse = true;
        //    }
        //    else
        //    {
        //        inhouse = false;
        //    }


        //    var user = Session["user_id"].ToString();
        //    DateTime date = DateTime.Now;
        //    var message = "";
        //    var icon = "";
        //    try
        //    {

        //        var panel_user = db.vw_userroles_tbl_RCT.Where(a => a.user_id == data.panel_user_id && a.role_id == "193").Count();
        //        var exist = db.psb_sked_mbr_tbl.Where(a => a.panel_user_id == data.panel_user_id 
        //                                                && a.psb_ctrl_nbr == data.psb_ctrl_nbr).Count();
        //        if (exist == 0)
        //        {
        //            data.inhouse = inhouse;
        //            data.created_by_user = user;
        //            data.created_dttm = date;
        //            db.psb_sked_mbr_tbl.Add(data);
        //            db.SaveChanges();
        //            message = insert.success;
        //            icon = "success";
        //           panel_role = db.sp_insertin_userroles_tbl_RCT(data.panel_user_id,"193").ToString();
        //        }
        //        else
        //        {
        //            message = "Panel already added for this item!";
        //            icon = "error";
        //        }
        //        if (panel_user < 1)
        //        {

        //        }
        //        return Json(new { message, icon, panel_role}, JsonRequestBehavior.AllowGet);
        //    }
        //    catch (DbEntityValidationException e)
        //    {
        //        return Json(new { message = DbEntityValidationExceptionError(e) }, JsonRequestBehavior.AllowGet);
        //    }
        //}

        
        public ActionResult savePSBPanel(psb_sked_mbr_tbl data, string inhouse, string department_name,string branch)
        { 

            var panel_role = "";
            CheckSession();
            if (Session["user_id"] == null)
            {
                return RedirectToAction("Index", "Login");
            }
          

            var user = Session["user_id"].ToString();
            DateTime date = DateTime.Now;
            var message = "";
            var icon = "";
            try
            {

                var namesparts = data.psb_name.Split(' ');
                if (data.psb_mbr_role == "03")
                {
                    
                    var exist = db.psb_sked_mbr_tbl.Where(a => a.panel_user_id == data.panel_user_id
                                                            && a.psb_ctrl_nbr == data.psb_ctrl_nbr
                                                            && a.department_code == data.agency
                                                            && a.psb_mbr_role == data.psb_mbr_role).Count();
                    if (exist == 0)
                    {
                        psb_sked_mbr_tbl psm = new psb_sked_mbr_tbl();
                        psm.psb_ctrl_nbr        = data.psb_ctrl_nbr;
                        psm.panel_user_id       = data.panel_user_id;
                        psm.psb_mbr_role        = data.psb_mbr_role;
                        psm.psb_name            = data.psb_name;
                        psm.agency              = department_name;
                        psm.inhouse             = Convert.ToBoolean(Convert.ToInt32(inhouse));
                        psm.created_by_user     = user;
                        psm.created_dttm        = date;
                        psm.attended            = false;
                        psm.department_code     = data.agency;
                        db.psb_sked_mbr_tbl.Add(psm);
                        db.SaveChanges();
                        message = insert.success;
                        icon = "success";
                        panel_role = db.sp_insertin_userroles_tbl_RCT(data.panel_user_id, "193").ToString();
                    }
                    else
                    {
                        message = "Panel already added for this item!";
                        icon = "error";
                    }
                }
                else
                {
                    var empl_id = data.panel_user_id.Substring(1, 4);

                    var exist = db.psb_sked_mbr_tbl.Where(a => a.panel_user_id == data.panel_user_id
                                                            && a.psb_ctrl_nbr == data.psb_ctrl_nbr
                                                            && a.department_code == data.agency
                                                            && a.psb_mbr_role == data.psb_mbr_role).Count();

                    if (exist == 0)
                    {
                        psb_sked_mbr_tbl psm = new psb_sked_mbr_tbl();
                        psm.psb_ctrl_nbr        = data.psb_ctrl_nbr;
                        psm.panel_user_id       = data.panel_user_id;
                        psm.psb_mbr_role        = data.psb_mbr_role;
                        psm.psb_name            = data.psb_name;
                        psm.agency              = department_name;
                        psm.inhouse             = Convert.ToBoolean(Convert.ToInt32(inhouse));
                        psm.created_by_user     = user;
                        psm.created_dttm        = date;
                        psm.attended            = false;
                        psm.department_code     = data.agency;
                        db.psb_sked_mbr_tbl.Add(psm);
                        db.SaveChanges();

                    }

                    var exist2 = db.psb_panel_permanent_mbr_tbl.Where(a => a.psb_user_id == data.panel_user_id
                                                            && a.psb_mbr_role == data.psb_mbr_role).Count();
                    if (exist2 == 0)
                    {
                        if (inhouse == "1")
                        {

                            var pernames = db.vw_personnelnames_tbl_RCT.Where(a => a.empl_id == empl_id).FirstOrDefault();
                            psb_panel_permanent_mbr_tbl pn = new psb_panel_permanent_mbr_tbl();

                            pn.psb_user_id = data.panel_user_id;
                            pn.psb_first_name = pernames.first_name;
                            pn.psb_last_name = pernames.last_name;
                            pn.psb_middle_name = pernames.middle_name;
                            pn.psb_mbr_role = data.psb_mbr_role;
                            pn.psb_agency = department_name;
                            pn.branch = Convert.ToInt32(branch);
                            pn.psb_inhouse = Convert.ToBoolean(Convert.ToInt32(data.inhouse));
                            pn.active_status = true;
                            pn.created_by_user = user;
                            pn.created_dttm = date;
                            db.psb_panel_permanent_mbr_tbl.Add(pn);
                            db.SaveChanges();
                           
                        }
                        else
                        {

                            var pernames = db.guest_user_info_tbl.Where(a => a.g_user_id == data.panel_user_id).FirstOrDefault();
                            psb_panel_permanent_mbr_tbl pn = new psb_panel_permanent_mbr_tbl();

                            pn.psb_user_id = data.panel_user_id;
                            pn.psb_first_name = pernames.first_name;
                            pn.psb_last_name = pernames.last_name;
                            pn.psb_middle_name = pernames.middle_name;
                            pn.psb_mbr_role = data.psb_mbr_role;
                            pn.psb_agency = department_name;
                            pn.branch = Convert.ToInt32(branch);
                            pn.psb_inhouse = Convert.ToBoolean(Convert.ToInt32(data.inhouse));
                            pn.active_status = true;
                            pn.created_by_user = user;
                            pn.created_dttm = date;
                            db.psb_panel_permanent_mbr_tbl.Add(pn);
                            db.SaveChanges();
                        }
                        
                        panel_role = db.sp_insertin_userroles_tbl_RCT(data.panel_user_id, "193").ToString();
                        message = insert.success;
                        icon = "success";

                    }
                    else
                    {
                        message = "Panel already added for this item!";
                        icon = "error";
                    }
                }

                    return Json(new { message, icon}, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return Json(new { message = DbEntityValidationExceptionError(e) }, JsonRequestBehavior.AllowGet);
            }
        }


        public ActionResult deletePSBSchedule(string psb_ctrl_nbr, string budget_code, string employment_type)
        {
            CheckSession();
            object sched = new object();
            try
            {
                var del = db.sp_delete_psbschedule(psb_ctrl_nbr).FirstOrDefault();
                if (del.result_bit == true)
                {
                    sched = db.sp_get_psbschedule_list(budget_code, employment_type).ToList();
                }
                return Json(new { message = insert.success, icon = icon.success, del}, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return Json(new { message = DbEntityValidationExceptionError(e) }, JsonRequestBehavior.AllowGet);
            }
        }

        public ActionResult DisablePSBForRating(string psb_ctrl_nbr, string budget_code, string employment_type,bool disabled_rating)
        {
            CheckSession();
            object sched = new object();
            try
            {
              
                var dis = db.psb_sked_hdr_tbl.Where(a => a.psb_ctrl_nbr == psb_ctrl_nbr).FirstOrDefault();
                dis.disabled_rating = disabled_rating;
                db.SaveChanges();
                var psb_sched = db.sp_psb_sked_hdr_tbl_list(employment_type, budget_code).ToList();
             
                
                return Json(new { message = insert.success, icon = icon.success, psb_sched }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return Json(new { message = DbEntityValidationExceptionError(e) }, JsonRequestBehavior.AllowGet);
            }
        }

        public ActionResult getPsbPanel(string psb_ctrl_nbr)
        {
            CheckSession();

            try
            {
                var panels = db.sp_psb_sked_mbr_tbl(psb_ctrl_nbr).ToList();
                return Json(new { message = insert.success, icon = icon.success, panels}, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return Json(new { message = DbEntityValidationExceptionError(e) }, JsonRequestBehavior.AllowGet);
            }
        }

        public ActionResult verifyAllowDeletePanel(string panel_user_id, string psb_ctrl_nbr)
        {
            CheckSession();
            try
            {
                var hasrated = db.psb_pnl_rtg_tbl.Where(a => a.user_id == panel_user_id && a.psb_ctrl_nbr == psb_ctrl_nbr).ToList();
                return Json(new { message = delete.success, icon = icon.success, hasrated }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return Json(new { message = DbEntityValidationExceptionError(e) }, JsonRequestBehavior.AllowGet);
            }
        }

        public ActionResult deletePanel(string panel_user_id, string psb_ctrl_nbr)
        {
            CheckSession();
            try
            {
                var panels = db.sp_delete_panel_in_schedule(panel_user_id, psb_ctrl_nbr).ToList();
                return Json(new { message = delete.success, icon = icon.success, panels }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return Json(new { message = DbEntityValidationExceptionError(e) }, JsonRequestBehavior.AllowGet);
            }
        }
        public ActionResult getPsbAppList(string psb_ctrl_nbr)
        {
            CheckSession();
            try
            {
                var psb_app = db.sp_psb_applicant_list(psb_ctrl_nbr).ToList();
                return Json(new { message = delete.success, icon = icon.success, psb_app }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return Json(new { message = DbEntityValidationExceptionError(e) }, JsonRequestBehavior.AllowGet);
            }
        }

        public ActionResult DeleteAppPsb(string psb_ctrl_nbr, string app_ctrl_nbr)
        {
            CheckSession();
            try
            {
                var psb_app = db.sp_delete_app_psb(psb_ctrl_nbr, app_ctrl_nbr).ToList();
                return Json(new { message = delete.success, icon = icon.success, psb_app }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return Json(new { message = DbEntityValidationExceptionError(e) }, JsonRequestBehavior.AllowGet);
            }
        }

       

        public ActionResult getItemsforPanel(string budget_code, string employment_type, string psb_ctrl_nbr)
        {
            CheckSession();
            try
            {
                if (employment_type == "RE")
                {
                    var psb_items_forpanel = db.sp_applicantsreviewtbl_items_list_2(budget_code, employment_type, psb_ctrl_nbr).Where(a => a.item_added == true).ToList();
                    return Json(new { message = fetch.success, icon = icon.success, psb_items_forpanel }, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    var psb_items_forpanel = db.sp_applicantsreviewtbl_items_casual_list(budget_code, employment_type, psb_ctrl_nbr).Where(a => a.item_added == true).ToList();
                    return Json(new { message = fetch.success, icon = icon.success, psb_items_forpanel }, JsonRequestBehavior.AllowGet);
                }

            }
            catch (DbEntityValidationException e)
            {
                return Json(new { message = DbEntityValidationExceptionError(e) }, JsonRequestBehavior.AllowGet);
            }
        }
        public ActionResult getItems(string budget_code, string employment_type, string psb_ctrl_nbr)
        {
            CheckSession();
            try
            {
                if (employment_type == "RE")
                {
                    var psb_items = db.sp_applicantsreviewtbl_items_list_2(budget_code, employment_type, psb_ctrl_nbr).ToList();
                    return Json(new { message = fetch.success, icon = icon.success, psb_items }, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    var psb_items = db.sp_applicantsreviewtbl_items_casual_list(budget_code, employment_type, psb_ctrl_nbr).ToList();
                    return Json(new { message = fetch.success, icon = icon.success, psb_items }, JsonRequestBehavior.AllowGet);
                }

            }
            catch (DbEntityValidationException e)
            {
                return Json(new { message = DbEntityValidationExceptionError(e) }, JsonRequestBehavior.AllowGet);
            }
        }

      

        public ActionResult savePSBItems(string psb_ctrl_nbr, string budget_code, string employment_type, sp_applicantsreviewtbl_items_list_2_Result added_item)
        {
            CheckSession();
            var user_id = Session["user_id"].ToString();
            var add = 0;

            try
            {


                var added = db.psb_sked_item_nbrs.Where(a => a.psb_ctrl_nbr == psb_ctrl_nbr
                && a.item_no == added_item.item_no
                && a.budget_code == budget_code
                && a.employment_type == employment_type).FirstOrDefault();
                if (added == null)
                {
                    psb_sked_item_nbrs itm = new psb_sked_item_nbrs();
                    itm.psb_ctrl_nbr = psb_ctrl_nbr;
                    itm.item_no = added_item.item_no;
                    itm.endorse_no = 0;
                    itm.selected_approved = false;
                    itm.budget_code = added_item.budget_code;
                    itm.employment_type = employment_type;
                    itm.department_code = added_item.department_code;
                    db.psb_sked_item_nbrs.Add(itm);
                    db.SaveChanges();
                    add = 1;
                }

                var gen = db.sp_generate_panelforpsb(psb_ctrl_nbr, budget_code, employment_type, added_item.department_code, user_id);





                var psb_items = db.sp_forscheduleitem_list(psb_ctrl_nbr, budget_code, employment_type).ToList();
                var psb_items_toremove = db.sp_forscheduleitem_list_toremove(psb_ctrl_nbr, budget_code, employment_type).ToList();
                return Json(new { message = "Successfully inserted data!", icon = "success", psb_items, psb_items_toremove }, JsonRequestBehavior.AllowGet);

            }
            catch (DbEntityValidationException e)
            {
                return Json(new { message = DbEntityValidationExceptionError(e), icon = "error" }, JsonRequestBehavior.AllowGet);
            }
        }

       
        // @p_psb_ctrl_nbr       VARCHAR(10)
        //,@p_budget_code        VARCHAR(06)
        //,@p_employment_type    VARCHAR(02)
        //,@p_department_code    VARCHAR(02)
        //,@p_user_id            VARCHAR(10)

        public ActionResult RefreshPanelList(string psb_ctrl_nbr, string budget_code, string employment_type)
        {
            CheckSession();

            var user_id = Session["user_id"].ToString();
            try
            {
                var psb_sked_item_nbrs = db.psb_sked_item_nbrs.Where(a => a.psb_ctrl_nbr == psb_ctrl_nbr).ToList();
                foreach(var i in psb_sked_item_nbrs)
                {
                    var gen = db.sp_generate_panelforpsb(psb_ctrl_nbr, budget_code, employment_type, i.department_code, user_id);
                }
                
                return Json(new { message = fetch.success, icon = icon.success }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return Json(new { message = DbEntityValidationExceptionError(e) }, JsonRequestBehavior.AllowGet);
            }
        }


        public ActionResult removePSBItems(string psb_ctrl_nbr, string employment_type, string budget_code)
        {
            CheckSession();
            try
            {
               if (employment_type == "RE")
               {
                   var psb_items = db.sp_applicantsreviewtbl_items_list_2(budget_code, employment_type, psb_ctrl_nbr).Where(a => a.item_added == true).ToList();

                    foreach (var l in psb_items)
                    {
                        if(l.item_added == true)
                        {
                             var i_del = db.sp_remove_item_in_psbsched(psb_ctrl_nbr, l.item_no).FirstOrDefault();
                        }
                    }
               }
               else
               {
                   var psb_items = db.sp_applicantsreviewtbl_items_casual_list(budget_code, employment_type, psb_ctrl_nbr).Where(a => a.item_added == true).ToList();

                   foreach (var l in psb_items)
                   {
                       if (l.item_added == true)
                       {
                           var i_del = db.sp_remove_item_in_psbsched(psb_ctrl_nbr, l.item_no).FirstOrDefault();
                       }
                   }
               }
                return Json(new { message="Item successfully removed!", icon = icon.success }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return Json(new { message = DbEntityValidationExceptionError(e) }, JsonRequestBehavior.AllowGet);
            }
        }

        public ActionResult removePSBItems_2(string psb_ctrl_nbr, string employment_type, string budget_code, string item_no, string department_code)
        {
            CheckSession();
            var user_id = Session["user_id"].ToString();
            try
            {
                var item = db.psb_sked_item_nbrs.Where(a => a.psb_ctrl_nbr == psb_ctrl_nbr
                                && a.item_no == item_no
                                && a.budget_code == budget_code
                                && a.employment_type == employment_type).FirstOrDefault();

                db.psb_sked_item_nbrs.Remove(item);
                db.SaveChanges();

                db.sp_remove_panelforpsb(psb_ctrl_nbr, budget_code, employment_type, item_no, department_code);

                var psb_items = db.sp_forscheduleitem_list(psb_ctrl_nbr, budget_code, employment_type).ToList();
                var psb_items_toremove = db.sp_forscheduleitem_list_toremove(psb_ctrl_nbr, budget_code, employment_type).ToList();
                return Json(new { message = "Item successfully removed!", icon = icon.success, psb_items, psb_items_toremove}, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return Json(new { message = DbEntityValidationExceptionError(e) }, JsonRequestBehavior.AllowGet);
            }
        }
        public ActionResult ApplicantInItemAdded(string psb_ctrl_nbr)
        {
            CheckSession();
            try
            {
                var appls_in_items = db.sp_applicant_In_ItemAdded_list(psb_ctrl_nbr).ToList();
                return Json(new { message = fetch.success, icon = icon.success, appls_in_items }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return Json(new { message = DbEntityValidationExceptionError(e) }, JsonRequestBehavior.AllowGet);
            }
        }



        public ActionResult addAppsToPsb(String psb_ctrl_nbr, List<sp_applicant_In_ItemAdded_list_Result> appls_in_items)
        {
            CheckSession();
            var message = "";
            var add = 0;
            
            try
            {
                foreach (var l in appls_in_items)
                {
                    var added = db.psb_sked_app_tbl.Where(a => a.psb_ctrl_nbr == l.psb_ctrl_nbr && a.app_ctrl_nbr == l.app_ctrl_nbr).FirstOrDefault();
                    if (added == null)
                    {
                        psb_sked_app_tbl app = new psb_sked_app_tbl();
                        app.psb_ctrl_nbr = l.psb_ctrl_nbr;
                        app.app_ctrl_nbr = l.app_ctrl_nbr;
                        db.psb_sked_app_tbl.Add(app);

                        var appp = db.applicants_review_tbl.Where(a => a.app_ctrl_nbr == l.app_ctrl_nbr).FirstOrDefault();
                        appp.app_status = "2";
                        add = 1;
                    }
                    //if (l.is_addedd == true)
                    //{
                       
                    //    if (added == null)
                    //    {
                    //        psb_sked_app_tbl app = new psb_sked_app_tbl();
                    //        app.psb_ctrl_nbr = l.psb_ctrl_nbr;
                    //        app.app_ctrl_nbr = l.app_ctrl_nbr;
                    //        db.psb_sked_app_tbl.Add(app);

                    //        var appp = db.applicants_review_tbl.Where(a => a.app_ctrl_nbr == l.app_ctrl_nbr).FirstOrDefault();
                    //        appp.app_status = "2";
                    //        add = 1;
                    //    }
                      
                    //}
                    //else
                    //{
                    //    var exst = db.psb_sked_app_tbl.Where(a => a.psb_ctrl_nbr == l.psb_ctrl_nbr && a.app_ctrl_nbr == l.app_ctrl_nbr).FirstOrDefault();
                    //    if (exst != null)
                    //    {
                    //        db.psb_sked_app_tbl.Remove(exst);
                    //        var appp = db.applicants_review_tbl.Where(a => a.app_ctrl_nbr == l.app_ctrl_nbr).FirstOrDefault();
                    //        appp.app_status = "1";
                    //        del = 1;
                    //    }
                      
                    //}
                }

                db.SaveChanges();

                //if (add == 1 && del == 1)
                //{
                //    message = "Succesfully Add and Remove Items";
                //}
                if (add == 1)
                {
                    message = "Succesfully Add Items";
                }
                //else if (del == 1)
                //{
                //    message = "Succesfully Remove Items";
                //}
                else if(add == 0)
                {
                    message = "No data is updated";
                }
                var appls = db.sp_applicant_In_ItemAdded_list(psb_ctrl_nbr).ToList();
                return Json(new { message, icon = icon.success, appls }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return Json(new { message = DbEntityValidationExceptionError(e) }, JsonRequestBehavior.AllowGet);
            }
        }

        public ActionResult getForScoreSheetParam(string psb_ctrl_nbr)
        {
            CheckSession();
            try
            {
                var appls_in_items = db.sp_applicant_In_ItemAdded_list(psb_ctrl_nbr).ToList();
                return Json(new { message = fetch.success, icon = icon.success, appls_in_items }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return Json(new { message = DbEntityValidationExceptionError(e) }, JsonRequestBehavior.AllowGet);
            }
        }


        public ActionResult SetHistoryPage(string employmenttype,string budgetcode)
        {
            CheckSession();
            try
            {
                
                Session["history_page"] = Request.UrlReferrer.ToString();
                Session["employmenttype"] = employmenttype;
                Session["budgetcode"] = budgetcode;
                

                return JSON(new { message = "success" }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                string message = e.Message;
                return Json(new { message = message }, JsonRequestBehavior.AllowGet);
            }
        }



    }
}