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
    
    public partial class psb_sked_mbr_tbl
    {
        public string psb_ctrl_nbr { get; set; }
        public string panel_user_id { get; set; }
        public string psb_mbr_role { get; set; }
        public string psb_name { get; set; }
        public string agency { get; set; }
        public Nullable<bool> inhouse { get; set; }
        public string created_by_user { get; set; }
        public Nullable<System.DateTime> created_dttm { get; set; }
        public Nullable<bool> attended { get; set; }
        public string department_code { get; set; }
    }
}
