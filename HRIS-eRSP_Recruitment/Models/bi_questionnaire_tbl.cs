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
    
    public partial class bi_questionnaire_tbl
    {
        public int question_id { get; set; }
        public string question_descr { get; set; }
        public Nullable<int> question_type { get; set; }
        public Nullable<int> criteria1_id { get; set; }
        public string criteria1_descr { get; set; }
        public string criteria2_id { get; set; }
        public string criteria2_descr { get; set; }
        public string criteria3_id { get; set; }
        public string criteria3_descr { get; set; }
        public string order_by { get; set; }
        public Nullable<int> rating_scale { get; set; }
        public Nullable<System.DateTime> created_dttm { get; set; }
        public string created_by { get; set; }
        public Nullable<System.DateTime> updated_dttm { get; set; }
        public string updated_by { get; set; }
        public string question_type_descr { get; set; }
    }
}