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
    
    public partial class exam_shcedule_tbl
    {
        public int exam_id { get; set; }
        public System.DateTime exam_date { get; set; }
        public System.TimeSpan exam_time { get; set; }
        public string exam_type { get; set; }
        public string exam_location { get; set; }
        public string zoom_link { get; set; }
        public string zoom_meeting_id { get; set; }
        public string zoom_passcode { get; set; }
        public string exam_status { get; set; }
        public Nullable<System.DateTime> created_dttm { get; set; }
        public string created_by { get; set; }
        public Nullable<System.DateTime> updated_dttm { get; set; }
        public string updated_by { get; set; }
    }
}