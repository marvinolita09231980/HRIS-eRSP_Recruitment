using HRIS_eRSP_Recruitment.Common_Code;
using HRIS_eRSP_Recruitment.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity.Validation;
using System.Globalization;
using System.Linq;
using System.Threading;
using System.Web;
using System.Web.Mvc;

namespace HRIS_eRSP_Recruitment.Controllers
{
    public class cAddAvailableItemInAPLController : CustomController
    {
        HRIS_RCTEntities db = new HRIS_RCTEntities();
        HRIS_APLEntities db2 = new HRIS_APLEntities();
        User_Menu um = new User_Menu();
        RCT_Common rct = new RCT_Common();
        // GET: cAddAvailableItemInAPL
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
            var employment_type = Session["employment_type"] == null ? "" : Session["employment_type"].ToString();
            var budget_code = Session["budget_code"] == null ? "" : Session["budget_code"].ToString();

            try
            {
                var budgetyears = db.sp_budget_years_tbl_RCT();
                var available_item = db.sp_available_item_tbl_apl("", budget_code, employment_type);
                var data_items = db.sp_open_publication_items_RCT(budget_code, employment_type).ToList();
                var data_items_hdr = db.sp_online_items_hdr_APL(budget_code,employment_type).ToList();
                var departments = db.sp_department_tbl_rct("").ToList();
                //var data_items = db.sp_add_available_items_to_RCT(budget_code).ToList();

                return JSON(new { message = fetch.success, icon = icon.success, budgetyears, available_item, employment_type, budget_code, data_items, data_items_hdr, departments }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return Json(new { message = DbEntityValidationExceptionError(e), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }
        public ActionResult Data_Items(string budget_code)
        {
            CheckSession();
            try
            {
                var data_items = db.sp_add_available_items_to_RCT(budget_code).ToList();

                return JSON(new { message = fetch.success, icon = icon.success, data_items}, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return Json(new { message = DbEntityValidationExceptionError(e), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }
        public ActionResult addItemToOnlineRecruitment(string active_dttm,string expiry_dttm,string descr,string budget_code,string employment_type,List<sp_open_publication_items_RCT_Result> item_list)
        {
            CheckSession();
            DateTime date = DateTime.Now;
            var user_id = Session["user_id"].ToString();

            var a_dttm = Convert.ToDateTime(active_dttm);
            var e_dttm = Convert.ToDateTime(expiry_dttm);
            try
            {
                var av = db2.available_item_hdr_tbl.Where(a => a.active_dttm == a_dttm && a.expiry_dttm == e_dttm && a.employment_type == employment_type && a.budget_code == budget_code).Count();
                if (item_list == null) throw new Exception("No Item Selected");
                var ctrl_nbr = db.sp_autogen_ctrl_nbr_APL("available_item_hdr_tbl", 15, "ctrl_no").FirstOrDefault();
                var activemonthname = Convert.ToDateTime(active_dttm).ToString("MMMM");
                var activedate = Convert.ToDateTime(active_dttm).Day.ToString();
                var expiremonthname = Convert.ToDateTime(expiry_dttm).ToString("MMMM");
                var expiredate = Convert.ToDateTime(expiry_dttm).Day.ToString();
                if (av == 0)
                {

                    db.sp_add_available_items_hdr_APL(
                    ctrl_nbr,
                    descr,
                    budget_code,
                    employment_type,
                    user_id,
                    a_dttm,
                    e_dttm);

                    foreach (var i in item_list)
                    {
                        db.sp_add_available_items_to_APL(
                                  ctrl_nbr
                               , i.item_no
                               , i.budget_code
                               , i.employment_type
                               , i.position_code
                               , i.position_title1
                               , i.position_long_title
                               , i.department_code
                               , i.department_name1
                               , true
                            );
                    }
                    var period_descr = activemonthname + " " + activedate + " to " + expiremonthname + " " + expiredate;
                    db.sp_insert_psb_hiring_period_tbl(ctrl_nbr, active_dttm, expiry_dttm, budget_code, user_id, date.ToString("yyyy-MM-dd"), employment_type, period_descr);
                    psb_hiring_period_tbl php = new psb_hiring_period_tbl();
                    php.ctrl_nbr        = ctrl_nbr;
                    php.period_from     = active_dttm;
                    php.period_to       = expiry_dttm;
                    php.budget_code     = budget_code;
                    php.created_by_user = user_id;
                    php.created_dttm    = date;
                    php.employment_type = employment_type;
                    php.period_descr = descr;
                    db.psb_hiring_period_tbl.Add(php);
                    db.SaveChanges();
                }
                else
                {
                    throw new Exception("Application period already defined!");
                }
                var data_items_hdr = db.sp_online_items_hdr_APL(budget_code, employment_type).ToList();
                return JSON(new { message = "Items successfully added to online recruitment!", icon = icon.success, data_items_hdr}, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                return Json(new { message = e.Message, icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }
        public ActionResult addItemToAPLHDR(string ctrl_no, List<sp_open_publication_items_RCT_Result> item_list)
        {
            CheckSession();
            var user_id = Session["user_id"].ToString();
            try
            {
                if (item_list == null) throw new Exception("No Item Selected");
                
                foreach (var i in item_list)
                {
                    db.sp_add_available_items_to_APL(
                              ctrl_no
                           , i.item_no
                           , i.budget_code
                           , i.employment_type
                           , i.position_code
                           , i.position_title1
                           , i.position_long_title
                           , i.department_code
                           , i.department_name1
                           , true
                        );
                }
                return JSON(new { message = "Items successfully added to online recruitment!", icon = icon.success }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                return Json(new { message = e.Message, icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }
        public ActionResult addItemToavailable_item_hdr_tbl(string active_dttm,string expiry_dttm,string descr,string budget_code,string employment_type,List<sp_open_publication_items_RCT_Result> item_list)
        {
            CheckSession();
            var user_id = Session["user_id"].ToString();
            try
            {
                if (item_list == null) throw new Exception("No Item Selected");
                var ctrl_nbr = db.sp_autogen_ctrl_nbr_APL("available_item_hdr_tbl", 15, "ctrl_no").FirstOrDefault();
                
                

                db.sp_add_available_items_hdr_APL(
                      ctrl_nbr,
                      descr,
                      budget_code,
                      employment_type,
                      user_id,
                      Convert.ToDateTime(active_dttm),
                      Convert.ToDateTime(expiry_dttm)
                    );
                foreach (var i in item_list)
                {
                    db.sp_add_available_items_to_APL(
                              ctrl_nbr
                           , i.item_no
                           , i.budget_code
                           , i.employment_type
                           , i.position_code
                           , i.position_title1
                           , i.position_long_title
                           , i.department_code
                           , i.department_name1
                           , true
                        );
                }


                var data_items_hdr = db.sp_online_items_hdr_APL(budget_code, employment_type).ToList();
                return JSON(new { message = "Items successfully added to online recruitment!", icon = icon.success, data_items_hdr }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                return Json(new { message = e.Message, icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }
        public ActionResult removeItemToOnlineRecruitment(List<sp_available_item_tbl_apl_Result> item_list)
        {
            CheckSession();
            try
            {
                foreach (var i in item_list)
                {
                    db.sp_remove_available_item_tbl_apl(
                             i.item_no
                           , i.budget_code
                           , i.employment_type
                        );
                }
                var data_items = db.sp_open_publication_items_RCT(item_list[0].budget_code, item_list[0].employment_type).ToList();
                var available_item = db.sp_available_item_tbl_apl("", item_list[0].budget_code, item_list[0].employment_type);
                return JSON(new { message = "Items successfully added to online recruitment!", icon = icon.success, available_item, data_items }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return Json(new { message = DbEntityValidationExceptionError(e), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }
        public ActionResult removEAllItemToOnlineRecruitment(string budget_code, string employment_type)
        {
            CheckSession();
            try
            {
                db.sp_remove_available_item_tbl_apl("","","");
                var available_item = db.sp_available_item_tbl_apl("", budget_code, employment_type);
                var data_items = db.sp_open_publication_items_RCT(budget_code, employment_type).ToList();
                return JSON(new { message = "Items successfully added to online recruitment!", icon = icon.success, available_item, data_items}, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return Json(new { message = DbEntityValidationExceptionError(e), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }
        public ActionResult Open_Items(string budget_code,string employment_type,string ctrl_no)
        {
            CheckSession();
            Session["employment_type"] = employment_type;
            Session["budget_code"] = budget_code;

            try 
            {
                var data_items = db.sp_open_publication_per_item_hdr(budget_code, employment_type, ctrl_no).ToList();
                var departments = db.sp_department_tbl_rct(ctrl_no).ToList();
               
                return JSON(new { message = "Items successfully added to online recruitment!", icon = icon.success, data_items, departments}, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return Json(new { message = DbEntityValidationExceptionError(e), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }
        public ActionResult getPositions(string budget_code, string employment_type,string department_code)
        {
            CheckSession();
            Session["employment_type"] = employment_type;
            Session["budget_code"] = budget_code;

            try
            {
               
                var positions = db.sp_positions_tbl_rct(department_code, budget_code, employment_type).ToList();

                return JSON(new { message = "Items successfully added to online recruitment!", icon = icon.success, positions}, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return Json(new { message = DbEntityValidationExceptionError(e), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }
        public ActionResult Open_Items_Hdr(string budget_code, string employment_type)
        {
            CheckSession();
            Session["employment_type"] = employment_type;
            Session["budget_code"] = budget_code;

            try
            {
                var data_items_hdr = db.sp_online_items_hdr_APL(budget_code, employment_type).ToList();
                return JSON(new { message = "Items successfully added to online recruitment!", icon = icon.success, data_items_hdr}, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return Json(new { message = DbEntityValidationExceptionError(e), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }
        public ActionResult aplheaderdata(string ctrl_no)
        {
            CheckSession();
            try
            {
                var data_items_dtl = db2.available_item_tbl.Where(a => a.ctrl_no == ctrl_no).ToList();
                return JSON(new { message = "Items successfully added to online recruitment!", icon = icon.success, data_items_dtl }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return Json(new { message = DbEntityValidationExceptionError(e), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }
        public ActionResult fn_aplitemdeactive(string ctrl_no,string item_no, string budget_code, string employment_type)
        {
            CheckSession();
            try
            {

                db2.sp_deactive_availableitemapl(ctrl_no, item_no, budget_code, employment_type);
                var data_items_dtl = db2.available_item_tbl.Where(a => a.ctrl_no == ctrl_no).ToList();
                int activecount = db2.available_item_tbl.Where(a => a.ctrl_no == ctrl_no && a.active_status == true).Count();
                return JSON(new { message = "Items successfully deactivated to online recruitment!", icon = icon.success, data_items_dtl, activecount}, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return Json(new { message = DbEntityValidationExceptionError(e), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }
        public ActionResult fn_aplitemdactivate(string ctrl_no, string item_no, string budget_code, string employment_type)
        {
            CheckSession();
            try
            {
                db2.sp_activate_availableitemapl(ctrl_no, item_no, budget_code, employment_type);
                var data_items_dtl = db2.available_item_tbl.Where(a => a.ctrl_no == ctrl_no).ToList();
                int activecount = db2.available_item_tbl.Where(a => a.ctrl_no == ctrl_no && a.active_status == true).Count();
                return JSON(new { message = "Items successfully deactivated to online recruitment!", icon = icon.success, data_items_dtl, activecount}, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return Json(new { message = DbEntityValidationExceptionError(e), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }
        public ActionResult fn_aplitemremove(string ctrl_no, string item_no, string budget_code, string employment_type)
        {
            CheckSession();
            try
            {
                db2.sp_remove_availableitemapl(ctrl_no, item_no, budget_code, employment_type);
                var data_items_dtl = db2.available_item_tbl.Where(a => a.ctrl_no == ctrl_no).ToList();
                return JSON(new { message = "Items successfully remove from online recruitment!", icon = icon.success, data_items_dtl }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return Json(new { message = DbEntityValidationExceptionError(e), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }
        public ActionResult fn_addAPLItemHDR(string ctrl_no)
        {
            CheckSession();
            try
            {
                var data_items_dtl = db2.available_item_tbl.Where(a => a.ctrl_no == ctrl_no).ToList();
                return JSON(new { message = "Items successfully added to online recruitment!", icon = icon.success, data_items_dtl }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return Json(new { message = DbEntityValidationExceptionError(e), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }

        public ActionResult fn_deactiveAPLItemHDR(string ctrl_no, string employment_type, string budget_code)
        {
            CheckSession();
            try
            {
                db2.sp_deactive_availableitemaplall(ctrl_no);
                var hdr = db.sp_online_items_hdr_APL(budget_code, employment_type).ToList();
                return JSON(new { message = "All items belong to this control number are successfully deactivated to online recruitment!", icon = icon.success, hdr }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return Json(new { message = DbEntityValidationExceptionError(e), icon = icon.error}, JsonRequestBehavior.AllowGet);
            }
        }

        public ActionResult fn_activeForPSB(string ctrl_no,string employment_type,string budget_code)
        {
            CheckSession();
            try
            {
                var qry = db2.available_item_hdr_tbl.Where(a => a.ctrl_no == ctrl_no).FirstOrDefault();
                qry.active_forpsb = true;
                db2.SaveChanges();
                var hdr = db.sp_online_items_hdr_APL(budget_code, employment_type).ToList();
                return JSON(new { message = "Successfuly Updated", icon = icon.success, hdr }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return Json(new { message = DbEntityValidationExceptionError(e), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }

        public ActionResult fn_GetAvailableItem_HDR(string ctrl_no, string employment_type, string budget_code)
        {
            CheckSession();
            try
            {
                var hdr = db.sp_online_items_hdr_APL(budget_code, employment_type).ToList();
                return JSON(new { message = "Successfuly Updated", icon = icon.success, hdr }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return Json(new { message = DbEntityValidationExceptionError(e), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }

        public ActionResult fn_inactiveForPSB(string ctrl_no, string employment_type, string budget_code)
        {
            CheckSession();
            try
            {
                var qry = db2.available_item_hdr_tbl.Where(a => a.ctrl_no == ctrl_no).FirstOrDefault();
                qry.active_forpsb = false;
                db2.SaveChanges();
                var hdr = db.sp_online_items_hdr_APL(budget_code, employment_type).ToList();
                return JSON(new { message = "Successfuly Updated", icon = icon.success, hdr }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return Json(new { message = DbEntityValidationExceptionError(e), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }

        public ActionResult fn_activeallItemHDR(string ctrl_no)
        {
            CheckSession();
            try
            {
                db2.sp_activate_availableitemapl_all(ctrl_no);
                var data_items_dtl = db2.available_item_tbl.Where(a => a.ctrl_no == ctrl_no).ToList();
                return JSON(new { message = "All items belong to this control number are successfully activated to online recruitment!", icon = icon.success, data_items_dtl}, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return Json(new { message = DbEntityValidationExceptionError(e), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }
        public ActionResult activateitem(sp_open_publication_items_RCT_Result data)
        {
            CheckSession();
            var control_no = "";
            try
            {
                var it = db2.available_item_tbl.Where(a => a.item_no == data.item_no && a.budget_code == data.budget_code && a.employment_type == data.employment_type).FirstOrDefault();
                if (it != null)
                {
                    control_no = it.ctrl_no;
                    db2.sp_activate_availableitemapl(control_no, data.item_no, data.budget_code, data.employment_type);
                    return JSON(new { message = "Item is successfully activated to online recruitment!", icon = icon.success }, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    return JSON(new { message = "Item not found", icon = icon.error }, JsonRequestBehavior.AllowGet);
                }
              
            }
            catch (DbEntityValidationException e)
            {
                return Json(new { message = DbEntityValidationExceptionError(e), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }
        public ActionResult getOnlineAvailableItem()
        {
            CheckSession();
            try
            {
                var available_item = db.sp_available_item_tbl_apl("","budget_code", "employment_type");
                return JSON(new { message = "", icon = icon.success, available_item }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return Json(new { message = DbEntityValidationExceptionError(e), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }
        public ActionResult CheckItemOnline(string budget_code, string employment_type, string item_no)
        {
            CheckSession();
            try
            {
                
                var item_online = from item in db2.available_item_tbl
                                  join hdr in db2.available_item_hdr_tbl
                                  on item.ctrl_no equals hdr.ctrl_no
                                  where item.item_no == item_no
                                  && item.budget_code == budget_code
                                  && item.employment_type == employment_type
                                  select new
                                  {
                                      item.ctrl_no
                                     , item.budget_code
                                     , item.employment_type
                                     , hdr.descr
                                     , item.active_status
                                     , hdr.active_dttm
                                     , hdr.expiry_dttm
                                  };
                
         
                //var item_online = db2.available_item_tbl.Where(a => a.budget_code == budget_code && a.employment_type == employment_type && a.item_no == item_no).ToList();
                var item_online_count = item_online.Count();


                return JSON(new { message = "", icon = icon.success, item_online, item_online_count }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return Json(new { message = DbEntityValidationExceptionError(e), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }
        public ActionResult GetItemPerCtrlNo(string budget_code, string employment_type, string ctrl_no)
        {
            CheckSession();
            try
            {
                

                var items_ctrlno = db.sp_postedOnline_items_ctrlNo_RCT(budget_code, employment_type, ctrl_no);
                return JSON(new { message = "", icon = icon.success, items_ctrlno }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return Json(new { message = DbEntityValidationExceptionError(e), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }
        public ActionResult addSingleItem(sp_open_publication_items_RCT_Result data,string ctrl_no)
        {
            CheckSession();
            try
            {
                var item = db2.available_item_tbl.Where(a => a.budget_code == data.budget_code && a.employment_type == data.employment_type && a.ctrl_no == ctrl_no && a.item_no == data.item_no).FirstOrDefault();
                if (item == null)
                {
                    available_item_tbl i = new available_item_tbl();
                    i.item_no = data.item_no;
                    i.employment_type = data.employment_type;
                    i.position_code = data.position_code;
                    i.position_title1 = data.position_title1;
                    i.position_long_title = data.position_long_title;
                    i.department_code = data.department_code;
                    i.department_name1 = data.department_name1;
                    i.inPublication = data.in_publication;
                    i.budget_code = data.budget_code;
                    i.ctrl_no = ctrl_no;
                    db2.available_item_tbl.Add(i);
                    db2.SaveChanges();
                }
                var items_ctrlno = db.sp_postedOnline_items_ctrlNo_RCT(data.budget_code, data.employment_type, ctrl_no);
                return JSON(new { message = "", icon = icon.success, items_ctrlno }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return Json(new { message = DbEntityValidationExceptionError(e), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }

        }
        public ActionResult deleteSingleItem(sp_open_publication_items_RCT_Result data, string ctrl_no)
        {
            CheckSession();
            try
            {
                var item = db2.available_item_tbl.Where(a => a.budget_code == data.budget_code && a.employment_type == data.employment_type && a.ctrl_no == ctrl_no && a.item_no == data.item_no).FirstOrDefault();
                if (item != null)
                {
                    db2.available_item_tbl.Remove(item);
                    db2.SaveChanges();
                }
                var items_ctrlno = db.sp_postedOnline_items_ctrlNo_RCT(data.budget_code, data.employment_type, ctrl_no);
                return JSON(new { message = "", icon = icon.success, items_ctrlno }, JsonRequestBehavior.AllowGet);
            }
            catch (DbEntityValidationException e)
            {
                return Json(new { message = DbEntityValidationExceptionError(e), icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }


        public ActionResult deleteItemHdr(string ctrl_no)
        {
          
            try
            {
                var del = db.sp_delete_online_items_hdr_APL(ctrl_no).FirstOrDefault();
                if (del.result == 0)
                {
                    throw new Exception(del.result_descr);

                }
                return JSON(new { message = del.result_descr, icon = "success"}, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { message = ex.Message, icon = icon.error }, JsonRequestBehavior.AllowGet);
            }
        }

       
    }
    
}