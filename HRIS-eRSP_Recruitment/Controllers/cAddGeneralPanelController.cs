using HRIS_eRSP_Recruitment.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace HRIS_eRSP_Recruitment.Controllers
{
    public class cAddGeneralPanelController : Controller
    {
        HRIS_RCTEntities db = new HRIS_RCTEntities();
        DateTime date = DateTime.Now;
        // GET: cAddGeneralPanel
        public ActionResult Index()
        {
            return View();
        }
        public ActionResult GetGeneralPanelList()
        {
            var general_panel = db.vw_psb_panel_permanent_mbr_tbl.ToList();
            return Json(new { message = "Success", icon = "success", general_panel}, JsonRequestBehavior.AllowGet);
        }
        public ActionResult GetPsbRoleList()
        {
            var psb_mbr_role_list = db.psb_mbr_role_tbl.ToList();
            return Json(new { message = "Success", icon = "success", psb_mbr_role_list }, JsonRequestBehavior.AllowGet);
        }
        public ActionResult editPSBPanel(psb_panel_permanent_mbr_tbl2 data)
        {
            try
            {
                var edit = db.psb_panel_permanent_mbr_tbl.Where(a => a.psb_user_id == data.epsb_user_id).FirstOrDefault();
                edit.branch = data.ebranch;
                edit.psb_inhouse = Convert.ToBoolean(Convert.ToInt32(data.epsb_inhouse));
                edit.psb_mbr_role = data.epsb_mbr_role;
                edit.psb_mbr_role = data.epsb_mbr_role;
                edit.active_status = Convert.ToBoolean(Convert.ToInt32(data.eactive_status));
                db.SaveChanges();
                return Json(new { message = "Successfully updated data!", icon = "success" }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { message = ex.Message, icon = "error" }, JsonRequestBehavior.AllowGet);
            }
            
        }
        public ActionResult gen_panel_delete(vw_psb_panel_permanent_mbr_tbl data)
        {
            try
            {
                var edit = db.psb_panel_permanent_mbr_tbl.Where(a => a.psb_user_id == data.psb_user_id).FirstOrDefault();
                db.psb_panel_permanent_mbr_tbl.Remove(edit);
                db.SaveChanges();
                return Json(new { message = "Successfully deleted data!", icon = "success" }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { message = ex.Message, icon = "error" }, JsonRequestBehavior.AllowGet);
            }
        }

        public ActionResult SavePSBPanel(psb_panel_permanent_mbr_tbl3 data)
        {
            int exist = 0;
            var user_id = Session["user_id"].ToString();
            try
            {
                exist = db.psb_panel_permanent_mbr_tbl.Where(a => a.psb_user_id == data.psb_user_id).Count();
                if (exist > 0)
                {
                    throw new Exception("Panel already exist!");
                }
                psb_panel_permanent_mbr_tbl p = new psb_panel_permanent_mbr_tbl();
                p.psb_user_id = data.psb_user_id;
                p.psb_first_name = data.psb_first_name;
                p.psb_last_name = data.psb_last_name;
                p.psb_middle_name = data.psb_middle_name;
                p.psb_mbr_role = data.psb_mbr_role;
                p.psb_agency = data.psb_agency;
                p.psb_inhouse = Convert.ToBoolean(Convert.ToInt32(data.psb_inhouse));
                p.active_status = Convert.ToBoolean(Convert.ToInt32(data.active_status));
                p.created_by_user = user_id;
                p.created_dttm = Convert.ToDateTime(date.ToString());
                p.branch = data.branch;
                db.psb_panel_permanent_mbr_tbl.Add(p);
                db.SaveChanges();
                
                return Json(new { message = "Successfully deleted data!", icon = "success" }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { message = ex.Message, icon = "error" }, JsonRequestBehavior.AllowGet);
            }
        }
    }
}