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
    
    public partial class personnel_voluntarywork_tbl
    {
        public int seq_no { get; set; }
        public string empl_id { get; set; }
        public string voluntarywork_from { get; set; }
        public string voluntarywork_to { get; set; }
        public string name_address_org { get; set; }
        public Nullable<double> no_of_hrs { get; set; }
        public string position_title { get; set; }
    }
}