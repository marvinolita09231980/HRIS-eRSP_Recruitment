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
    
    public partial class sp_chiefexecutive_list_Result
    {
        public string app_ctrl_nbr { get; set; }
        public string psb_ctrl_nbr { get; set; }
        public string last_name { get; set; }
        public string first_name { get; set; }
        public string middle_name { get; set; }
        public string app_status { get; set; }
        public string item_no { get; set; }
        public string employment_type { get; set; }
        public string approval_id { get; set; }
        public string position_code { get; set; }
        public Nullable<bool> is_employee { get; set; }
        public string budget_code { get; set; }
        public decimal cbi_rating { get; set; }
        public decimal qs_rating { get; set; }
        public decimal exam_rating { get; set; }
        public decimal ipcr_rating { get; set; }
        public decimal total_rating { get; set; }
        public Nullable<long> applicant_rank { get; set; }
        public Nullable<bool> selected_approved { get; set; }
        public string approval_status { get; set; }
    }
}