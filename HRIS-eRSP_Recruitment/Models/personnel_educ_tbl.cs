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
    
    public partial class personnel_educ_tbl
    {
        public int seq_no { get; set; }
        public string empl_id { get; set; }
        public string educ_type { get; set; }
        public string school_name { get; set; }
        public string basic_educ_deg { get; set; }
        public string period_from { get; set; }
        public string period_to { get; set; }
        public string highest_lvl_earned { get; set; }
        public string year_graduated { get; set; }
        public string schlr_acdmic_rcvd { get; set; }
        public Nullable<int> school_id { get; set; }
        public Nullable<int> courses_id { get; set; }
    }
}
