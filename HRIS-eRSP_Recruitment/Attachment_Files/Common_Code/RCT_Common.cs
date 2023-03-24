using HRIS_eRSP_Recruitment.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.Entity.Validation;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Web;
using System.Web.Mvc;
using System.Web.SessionState;

namespace HRIS_eRSP_Recruitment.Common_Code
{
    public static class delete
    {
        public static string success = "Data Deleted Successfully";
        public static string failed = "Data Deletion Failed";
    }
    public static class insert
    {
        public static string success = "Data Inserted Successfully";
        public static string failed = " Data Insert Failed";
    }
    public static class submit
    {
        public static string success = "Submitted Successfully";
        public static string failed = " Submit Failed";
    }
    public static class remove 
    {
        public static string success = "Remove Successfully";
        public static string failed = " Remove Failed";
    }
    public static class update
    {
        public static string success = "Data Updated Successfully";
        public static string failed = " Data Update Failed";
    }
    public static class saved
    {
        public static string success = "Data Saved Successfully";
        public static string failed = " Data Saving Failed";
    }
    public static class fetch
    {
        public static string success = "Data fetch Successfully";
        public static string failed = " Data fetch Failed";
    }
    public static class dttm
    {
        public static DateTime currentDate = Convert.ToDateTime(String.Format("{0:yyyy-MM-dd HH:mm:ss}", DateTime.Now));
        public static DateTime defaultDate = Convert.ToDateTime("1900-01-01 00:00:00");
    }
    public static class icon
    {
        public static String error = "error";
        public static String success = "success";
        public static String warning = "warning";
    }

    public class RCT_Common
    {
        HRIS_RCTEntities db = new HRIS_RCTEntities();
        CustomController cs =  new CustomController();
        User_Menu um = new User_Menu();
        HttpSessionState Session = HttpContext.Current.Session;
       
        public string user;
        public string urlname;

        public RCT_Common()
        {
            
            if (HttpContext.Current.User.Identity.IsAuthenticated)
            {
                user = Session["user_id"].ToString();
                urlname = Session["url_name"].ToString();
                um.allow_add = (int)Session["allow_add"];
                um.allow_delete = (int)Session["allow_delete"];
                um.allow_edit = (int)Session["allow_edit"];
                um.allow_edit_history = (int)Session["allow_edit_history"];
                um.allow_print = (int)Session["allow_print"];
                um.allow_view = (int)Session["allow_view"];
                um.url_name = Session["url_name"].ToString();
                um.id = (int)Session["id"];
                um.menu_name = Session["menu_name"].ToString();
                um.page_title = Session["page_title"].ToString();  
            }
            else
            {
                cs.riderect("~/Login/ERROR_401", true);
            }
            
        }
        const string connectstring = "cnHRIS_HRD";
        public string CONST_WORDENCRYPTOR = "userprofile";

        private const string initVector = "pemgail9uzpgzl88";
        private const int keysize = 256;
        public string EncryptString(string plainText, string passPhrase)
        {
            byte[] initVectorBytes = Encoding.UTF8.GetBytes(initVector);
            byte[] plainTextBytes = Encoding.UTF8.GetBytes(plainText);
            PasswordDeriveBytes password = new PasswordDeriveBytes(passPhrase, null);
            byte[] keyBytes = password.GetBytes(keysize / 8);
            RijndaelManaged symmetricKey = new RijndaelManaged();
            symmetricKey.Mode = CipherMode.CBC;
            ICryptoTransform encryptor = symmetricKey.CreateEncryptor(keyBytes, initVectorBytes);
            MemoryStream memoryStream = new MemoryStream();
            CryptoStream cryptoStream = new CryptoStream(memoryStream, encryptor, CryptoStreamMode.Write);
            cryptoStream.Write(plainTextBytes, 0, plainTextBytes.Length);
            cryptoStream.FlushFinalBlock();
            byte[] cipherTextBytes = memoryStream.ToArray();
            memoryStream.Close();
            cryptoStream.Close();
            return Convert.ToBase64String(cipherTextBytes);
        }
        public SqlConnection ConnectDB()
        {
            try
            {
                string ConnectString = ConfigurationManager.ConnectionStrings[connectstring].ConnectionString;
                SqlConnection conn;
                conn = new SqlConnection(ConnectString);
                return conn;
            }
            catch (Exception)
            {
                return null;
            }
        }

        public User_Menu GetAllowAccess()
        {
            if (HttpContext.Current.User.Identity.IsAuthenticated)
            {
                user = Session["user_id"].ToString();
                urlname = Session["url_name"].ToString();
                um.allow_add = (int)Session["allow_add"];
                um.allow_delete = (int)Session["allow_delete"];
                um.allow_edit = (int)Session["allow_edit"];
                um.allow_edit_history = (int)Session["allow_edit_history"];
                um.allow_print = (int)Session["allow_print"];
                um.allow_view = (int)Session["allow_view"];
                um.url_name = Session["url_name"].ToString();
                um.id = (int)Session["id"];
                um.menu_name = Session["menu_name"].ToString();
                um.page_title = Session["page_title"].ToString();
               
            }
            else
            {
                cs.riderect("~/Login/ERROR_401", true);
            }
            return um;
           
        }
        public string appControlNbr()
        {
            if (Session["app_ctrl_nbr"] == null)
            {
                cs.riderect("~/cApplicantsInfo/Index", true);
                return null;
            }
            else
            {
                return Session["app_ctrl_nbr"].ToString();
           
            }
        }
        public string appControlNbr(string controller, string index)
        {
            if (Session["app_ctrl_nbr"] == null)
            {
                cs.riderect(controller, index);
                return null;
            }
            else
            {
                return Session["app_ctrl_nbr"].ToString();

            }
        }
        
        public string infoControlNbr()
        {
            if (Session["info_ctrl_nbr"] == null)
            {
                cs.riderect("~/cApplicantsInfo/Index", true);
                return null;
            }
            else
            {
                return Session["info_ctrl_nbr"].ToString();
            }
        }
        public string getInfoCtrlNbr(string app_ctrl_nbr)
        {
            var info = db.applicants_review_tbl.Where(a => a.app_ctrl_nbr == app_ctrl_nbr).FirstOrDefault();
            return info.info_ctrl_nbr;
        }
       
    }
    public class CustomController : Controller
    {
        protected JsonResult JSON(object data, JsonRequestBehavior behavior)
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
        public Boolean boolean(int data)
        {
            if (data > 1)
            {
                return false;
            }
            else
            {
                if (data == 1)
                {
                    return true;
                }
                else
                {
                    return false;
                }
            }
        }

        public ActionResult riderect(string url, bool end)
        {
            return RedirectToAction("ERROR_401", "Login");
        }
        public ActionResult riderect(string controller, string index)
        {
            return RedirectToAction(controller, index);
        }
        public String IFNULL(string val, string sub)
        {
            if (val == null)
            {
                return sub;
            }
            else
            {
                return val;
            }
        }
      
        public Int32 IFNULL(int val, int sub)
        {
            if (val == 0)
            {
                return sub;
            }
            else
            {
                return val;
            }
        }
        public Double IFNULL(double val, double sub)
        {
            if (val == 0)
            {
                return sub;
            }
            else
            {
                return val;
            }
        }
        public DateTime IFNULL(DateTime val, string sub)
        {
            if (val == null)
            {
                return Convert.ToDateTime(sub);
            }
            else
            {
                return val;
            }
        }
        
        public String ISNULL(string val,string alt)
        {
            if (val == null)
            {
                return alt;
            }
            else
            {
                return val;
            }
        }


        public Boolean ISNULL(string val)
        {
            if (val == null)
            {
                return true;
            }
            else
            {
                return false;
            }
        }
        public Boolean ISNULL(int val)
        {
            if (val == 0)
            {
                return true;
            }
            else
            {
                return false;
            }
        }
        public Boolean ISNULL(double val)
        {
            if (val == 0)
            {
                return true;
            }
            else
            {
                return false;
            }
        }

        public String IfSessionIsNull(string val1, string val2)
        {
            if (Session[val1] == null)
            {
                return val2;
            }
            else{
                return Session[val1].ToString();
            }
        }
        public String DbEntityValidationExceptionError(DbEntityValidationException e)
        {
            string message = "";
            foreach (var eve in e.EntityValidationErrors)
            {
                Console.WriteLine("Entity of type \"{0}\" in state \"{1}\" has the following validation errors:",
                    eve.Entry.Entity.GetType().Name, eve.Entry.State);
                foreach (var ve in eve.ValidationErrors)
                {
                    message = "- Property: \"{0}\", Error: \"{1}\"" + ve.PropertyName + "  :  " + ve.ErrorMessage;
                    Console.WriteLine("- Property: \"{0}\", Error: \"{1}\"",
                        ve.PropertyName, ve.ErrorMessage);
                }
            }
            return message;
        }

    }
}