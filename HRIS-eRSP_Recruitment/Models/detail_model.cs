﻿using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Web;

namespace HRIS_eRSP_Recruitment.Models
{
    public class User_Menu : sp_user_menu_access_role_list_RCT_Result
    {
        public string remittancetype_code { get; set; }
        public string remittancetype_descr { get; set; }
        public string remittance_ctrl_nbr { get; set; }
        public string remittance_status { get; set; }
        public string remittance_year { get; set; }
        public string remittance_month { get; set; }
        public string remittance_month_descr { get; set; }
        public string employment_type { get; set; }
        public string employment_type_descr { get; set; }
        public string remittance_status_descr { get; set; }
    }
    public class appl
    {
        public string appl_address { get; set; }
        public string appl_appoint_type { get; set; }
        public string appl_birth_date { get; set; }
        public string appl_civil_status { get; set; }
        public string appl_ctrl_nbr { get; set; }
        public string appl_first_name { get; set; }
        public string appl_gender { get; set; }
        public string appl_last_name { get; set; }
        public string appl_middle_name { get; set; }
        public string appl_post_applied { get; set; }
        public string appl_date_applied { get; set; }
        public string app_type { get; set; }
        public string empl_id { get; set; }

    }
    public class elig
    {
        public string elig_exam_date { get; set; }
        public string elig_exam_place { get; set; }
        public string elig_number { get; set; }
        public string elig_rating { get; set; }
        public string elig_title { get; set; }
        public string elig_validity { get; set; }
    }
    //public class educ
    //{
    //    public string edu_degree        { get; set; }

    //    public string ​edu_honors        { get; set; }

    //    public string ​edu_lvl_earned    { get; set; }
    //    public string edu_periodfrm     { get; set; }
    //    public string edu_periodto​      { get; set; }
    //    public string edu_school_name   { get; set; }

    //    public string ​edu_yr_grad       { get; set; }
    //}


    public class  lnd
    {
        public string lnd_conductedby { get; set; }

        public string lnd_dev_type { get; set; }

        public string lnd_devfrm { get; set; }
        public string lnd_devto { get; set; }
        public string lnd_nbr_hours { get; set; }
        public string lnd_title { get; set; }
        
    }
   
    public class wexp
    {
        public string workxp_agency { get; set; }

        public string workxp_emp_stat { get; set; }

        public string workxp_frm { get; set; }
        public string workxp_gov_serv { get; set; }
        public string workxp_position { get; set; }
        public string workxp_sal_grade { get; set; }
        public string workxp_to { get; set; }
        public string workxp_mos_sal { get; set; }
     
    }
    public class app_review
    {
        public string  app_ctrl_nbr            { get; set; }
        public string  app_ctrl_nbr_disp       { get; set; }
        public string  employment_type         { get; set; }
        public string  budget_code             { get; set; }
        public string  position_code           { get; set; }
        public string  item_no                 { get; set; }
        public string  department_code         { get; set; }
        public string  exam_type_descr         { get; set; }
        public double  score_rendered          { get; set; }
        public DateTime exam_date                { get; set; }

    }
    public class image_prop
    {
        public string  str_byte { get; set; }
    }
    public class doctype
    {
        public string filename { get; set; }
        public string doc { get; set; }
    }  
    public class applicant_dtl
    {
        public List<vw_applicant_educ_tbl_list> educ_list{ get; set; }
    }

    public class items
    {
        public string budget_code       { get; set; }
        public string department_code   { get; set; }
        public string employment_type   { get; set; }
        public string ctrl_nbr { get; set; }
        public string item_no           { get; set; }
        public string position_code     { get; set; }
       
    }
    public class items_added:sp_hrmpsb_screening_list_Result
    {
        public bool item_isadded { get; set; }
      

    }
    public class items_added2 : sp_comparative_assessment_list_Result
    {
        public bool item_isadded { get; set; }


    }

    public class emails
    {
        public string app_ctrl_nbr { get; set; }
        public string empl_id { get; set; }
        public string email_address { get; set; }
        public string first_name { get; set; }
        public string last_name { get; set; }
        public string middle_name { get; set; }
        public string hiring_period { get; set; }
    }

    

    public class psb_panel_permanent_mbr_tbl2
    {
        public string epsb_user_id { get; set; }
        public string epsb_first_name { get; set; }
        public string epsb_last_name { get; set; }
        public string epsb_middle_name { get; set; }
        public string epsb_mbr_role { get; set; }
        public string epsb_agency { get; set; }
        public string epsb_inhouse { get; set; }
        public string eactive_status { get; set; }
        public string ecreated_by_user { get; set; }
        public System.DateTime ecreated_dttm { get; set; }
        public int ebranch { get; set; }
    }

    public class psb_panel_permanent_mbr_tbl3
    {
        public string psb_user_id { get; set; }
        public string psb_first_name { get; set; }
        public string psb_last_name { get; set; }
        public string psb_middle_name { get; set; }
        public string psb_mbr_role { get; set; }
        public string psb_agency { get; set; }
        public string psb_inhouse { get; set; }
        public string active_status { get; set; }
        public string created_by_user { get; set; }
        public System.DateTime created_dttm { get; set; }
        public int branch { get; set; }
    }

    public class sendingEmailList
    {
        public string app_ctrl_nbr { get; set; }
        public string applicant_name { get; set; }
        public string email_address { get; set; }
        public bool status { get; set; }
       
    }
   
}