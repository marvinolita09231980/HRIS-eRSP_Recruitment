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
    
    public partial class sp_reviewer_screening_list_Result
    {
        public string app_ctrl_nbr { get; set; }
        public string info_ctrl_nbr { get; set; }
        public string applicant_name { get; set; }
        public string last_name { get; set; }
        public string first_name { get; set; }
        public string middle_name { get; set; }
        public string birth_date { get; set; }
        public string gender { get; set; }
        public string gender_descr { get; set; }
        public string civil_status { get; set; }
        public string civil_status_descr { get; set; }
        public string app_address { get; set; }
        public string app_status { get; set; }
        public string item_no { get; set; }
        public string employment_type { get; set; }
        public string employment_type_descr { get; set; }
        public Nullable<bool> is_employee { get; set; }
        public double exam_score { get; set; }
        public string budget_code { get; set; }
        public string budget_description { get; set; }
        public string department_code { get; set; }
        public string department_name { get; set; }
        public string position_code { get; set; }
        public string position_long_title { get; set; }
        public string qs_education { get; set; }
        public string qs_work_experience { get; set; }
        public string qs_training { get; set; }
        public string qs_eligibility { get; set; }
        public byte[] empl_photo_img { get; set; }
        public string mobile_number { get; set; }
        public string email_add { get; set; }
        public double education_rating { get; set; }
        public double training_rating { get; set; }
        public double experience_rating { get; set; }
        public double eligibility_rating { get; set; }
        public double exam_rating { get; set; }
        public double qs_total_100perc { get; set; }
        public double qs_total_50perc { get; set; }
        public double exam_100perc { get; set; }
        public string cbi_100rating { get; set; }
        public string cbi_rating { get; set; }
        public string total_rating { get; set; }
    }
}
