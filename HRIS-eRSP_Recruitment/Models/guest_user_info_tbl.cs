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
    
    public partial class guest_user_info_tbl
    {
        public string g_user_id { get; set; }
        public string last_name { get; set; }
        public string first_name { get; set; }
        public string middle_name { get; set; }
        public string civil_status { get; set; }
        public string gender { get; set; }
        public Nullable<System.DateTime> birth_date { get; set; }
        public string g_address { get; set; }
        public string agency { get; set; }
        public string position { get; set; }
        public Nullable<System.DateTime> created_dttm { get; set; }
        public string created_by_user { get; set; }
        public Nullable<System.DateTime> updated_dttm { get; set; }
        public string updated_by_user { get; set; }
        public string g_user_password { get; set; }
        public Nullable<bool> g_status { get; set; }
    }
}