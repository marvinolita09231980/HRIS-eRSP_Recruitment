using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using HRIS_Common;

namespace HRIS_eSelfService
{
    /// <summary>
    /// Summary description for UploadImage
    /// </summary>
    public class UploadImage : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {

            string file_name = "";
            string filedata = string.Empty;
            Byte[] imgByte = null;
            if (context.Request.Files.Count > 0)
            {
                string fname = "";
                string fname2 = "";
                string app_ctrl_nbr = context.Request["app_ctrl_nbr"].Trim();
                //string doc_type = context.Request["doc_type"].Trim();
                HttpFileCollection files = context.Request.Files;
             
                for (int i = 0; i < files.Count; i++)
                {
                    HttpPostedFile file = files[i];
                    HttpPostedFile file2 = files[i];
                    decimal size = Math.Round(((decimal)file.ContentLength / (decimal)1024), 2);
                   
                    filedata = files[i].FileName.Trim();
                   
                }

                 context.Response.ContentType = "text/plain";
                 context.Response.Write("success" + file_name);
                
            }
          
        }

        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }
}