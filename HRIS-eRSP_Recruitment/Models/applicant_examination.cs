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
    
    public partial class applicant_examination
    {
        public string app_ctrl_nbr { get; set; }
        public string exam_type_descr { get; set; }
        public double score_rendered { get; set; }
        public System.DateTime exam_date { get; set; }
        public System.DateTime created_dttm { get; set; }
        public string created_by_user { get; set; }
        public Nullable<System.DateTime> updated_dttm { get; set; }
        public string updated_by_user { get; set; }
    }
}
