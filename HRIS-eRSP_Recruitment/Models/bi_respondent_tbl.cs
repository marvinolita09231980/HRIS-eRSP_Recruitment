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
    
    public partial class bi_respondent_tbl
    {
        public int respondent_id { get; set; }
        public string first_name { get; set; }
        public string last_name { get; set; }
        public string middle_name { get; set; }
        public string birthdate { get; set; }
        public string residence_address { get; set; }
        public string contact_number { get; set; }
        public string email_address { get; set; }
        public string occupation { get; set; }
        public Nullable<int> respondent_type { get; set; }
        public Nullable<bool> inhouse { get; set; }
        public Nullable<System.DateTime> created_by_dttm { get; set; }
        public string created_by_user { get; set; }
    }
}
