//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace HRIS_eRSP_Recruitment.Models
{
    using System;
    using System.Collections.Generic;
    
    public partial class applicant_qualified_progress_tbl
    {
        public string app_ctrl_nbr { get; set; }
        public Nullable<bool> quali_onlineexam { get; set; }
        public Nullable<System.DateTime> quali_onlineexam_dttm { get; set; }
        public string quali_onlineexam_by { get; set; }
        public Nullable<bool> quali_hrmpsb { get; set; }
        public Nullable<System.DateTime> quali_hrmpsb_dttm { get; set; }
        public string quali_hrmpsb_by { get; set; }
        public Nullable<bool> top5examinees { get; set; }
        public Nullable<System.DateTime> top5examinees_dttm { get; set; }
        public string top5examinees_by { get; set; }
        public Nullable<bool> congratulatory { get; set; }
        public Nullable<System.DateTime> congratulatory_dttm { get; set; }
        public string congratulatory_by { get; set; }
    }
}