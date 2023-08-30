using CrystalDecisions.CrystalReports.Engine;
using CrystalDecisions.Shared;
using HRIS_Common;
//using HRIS_eHRD.App_Start;
using System;
using System.Collections.Generic;
using System.Data;
using System.Drawing.Printing;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace eSMIS.Reports
{
    public partial class CrystalViewer : System.Web.UI.Page
    {
      
        ReportDocument cryRpt = new ReportDocument();

        CommonDB MyCmn = new CommonDB();

        static string printfile = "";
        //static string lastpage = "";
        //static bool firstload = true;
        string paramList = "";
        //report file(.rpt) name
        string reportName = "";
        //save as to excel,pdf or word's file name
        string saveName = "";
        //report type for pdf, excel, word or inline preview
        string reportType = "";
        //report file path, base on ~/Reports folder
        string reportPath = "";

        //set the report file path
        string reportFile = "";
        //for save report file name
        string saveFileName = "";

        protected void Page_Init(object sender, EventArgs e)
        {
            string ls_val;
            paramList   = Request["Params"].Trim();
            reportName  = Request["ReportName"].Trim();
            saveName    = Request["SaveName"].Trim();
            reportType  = Request["ReportType"].Trim();
            reportPath  = Request["ReportPath"].Trim().Replace('-', '/');


            reportFile  = Server.MapPath(string.Format("~/Reports/{0}/{1}.rpt", reportPath, reportName));

            saveFileName = saveName + DateTime.Now.ToString("_yyyy-MM-dd");
            if (!IsPostBack)
            {

                hf_printers.Value   = "";
                hf_nexpage.Value    = "0";
                PrinterSettings settings = new PrinterSettings();
                //firstload = true;
            }
            else
            {
                //firstload = false;
            }





        

            string[] ls_splitvalue;
            ls_val = Request.QueryString["id"];
            ls_splitvalue = ls_val.Split(',');
            loadreport(ls_splitvalue, reportPath);
        }


        protected void Page_Unload(object sender, EventArgs e)
        {
            cryRpt.Close();
            cryRpt.Dispose();
        }
        private void loadreport(string[] ls_splitvalue, string printfile)
        {

            DataTable dt = null;
            DataTable dtSub = null;
            DataTable dtTemp = null;
            string locationpath = printfile;
            cryRpt.Load(Server.MapPath(locationpath));
            crvPrint.SeparatePages = true;
            if (ls_splitvalue.Length == 1)
            {

                dt = MyCmn.RetrieveData(ls_splitvalue[0]);
                //dt = customerdb.get_data(ls_splitvalue[1], Session["cust_account_no"].ToString(), Convert.ToInt32(Session["countryid"].ToString()), Session["comp_code"].ToString(), Session["branch_code"].ToString(), Convert.ToInt32(Session["franchise"].ToString()));
            }
            if (ls_splitvalue.Length == 2 && ls_splitvalue[0].ToString().Trim() == "sp_account_info_report")
            {

                dt = MyCmn.RetrieveData(ls_splitvalue[0], "p_empl_id", Session["create_empl_id"].ToString().Trim(), "p_username", Session["create_username"].ToString().Trim(), "p_password", Session["create_password"].ToString().Trim(), "p_account_type", Session["create_account_type"].ToString().Trim());
                //dt = customerdb.get_data(ls_splitvalue[1], Session["cust_account_no"].ToString(), Convert.ToInt32(Session["countryid"].ToString()), Session["comp_code"].ToString(), Session["branch_code"].ToString(), Convert.ToInt32(Session["franchise"].ToString()));
            }
            if (ls_splitvalue.Length == 3)
            {
                dt = MyCmn.RetrieveData(ls_splitvalue[0], ls_splitvalue[1], ls_splitvalue[2]);

                //dt = customerdb.get_data(ls_splitvalue[1], Session["cust_account_no"].ToString(), Convert.ToInt32(Session["countryid"].ToString()), Session["comp_code"].ToString(), Session["branch_code"].ToString(), Convert.ToInt32(Session["franchise"].ToString()), );
            }
            //For PDS Report
            if (ls_splitvalue.Length == 4)
            {
                dt = MyCmn.RetrieveDataAPL(ls_splitvalue[0], ls_splitvalue[1], ls_splitvalue[2]);
                if (ls_splitvalue[0].ToString().Trim() == "sp_pds_rep")
                {

                    dt = MyCmn.RetrieveDataAPL(ls_splitvalue[0], ls_splitvalue[1], ls_splitvalue[2].ToString().Trim());
                    crvPrint.SeparatePages = false;
                }

                //dt = customerdb.get_data(ls_splitvalue[1], Session["cust_account_no"].ToString(), Convert.ToInt32(Session["countryid"].ToString()), Session["comp_code"].ToString(), Session["branch_code"].ToString(), Convert.ToInt32(Session["franchise"].ToString()), );
            }
            if (ls_splitvalue.Length == 5)
            {
                dt = MyCmn.RetrieveData(ls_splitvalue[0], ls_splitvalue[1], ls_splitvalue[2], ls_splitvalue[3], ls_splitvalue[4]);



                // dt = customerdb.get_data(ls_splitvalue[1], Session["cust_account_no"].ToString(), Convert.ToInt32(Session["countryid"].ToString()), Session["comp_code"].ToString(), Session["branch_code"].ToString(), Convert.ToInt32(Session["franchise"].ToString()), ls_splitvalue[2], ls_splitvalue[3], ls_splitvalue[4], ls_splitvalue[5]);
            }
            if (ls_splitvalue.Length == 7)
            {
                dt = MyCmn.RetrieveData(ls_splitvalue[0], ls_splitvalue[1], ls_splitvalue[2], ls_splitvalue[3], ls_splitvalue[4], ls_splitvalue[5], ls_splitvalue[6]);
                
            }
            if (ls_splitvalue.Length == 9)
            {

                dt = MyCmn.RetrieveData(ls_splitvalue[0], ls_splitvalue[1], ls_splitvalue[2], ls_splitvalue[3], ls_splitvalue[4], ls_splitvalue[5], ls_splitvalue[6], ls_splitvalue[7], ls_splitvalue[8]);

            }
            //FOR SUBREPORT ON CARDING 
            //ADDED BY JORGE: 11/16/2019


            if (ls_splitvalue.Length == 10)
            {
                //dt = customerdb.get_data(ls_splitvalue[1], Session["cust_account_no"].ToString(), Convert.ToInt32(Session["countryid"].ToString()), Session["comp_code"].ToString(), Session["branch_code"].ToString(), Convert.ToInt32(Session["franchise"].ToString()), ls_splitvalue[2], ls_splitvalue[3], ls_splitvalue[4], ls_splitvalue[5], ls_splitvalue[6], ls_splitvalue[7], ls_splitvalue[8], ls_splitvalue[9]);

            }
            if (ls_splitvalue.Length == 11)
            {
                dt = MyCmn.RetrieveData(ls_splitvalue[0], ls_splitvalue[1], ls_splitvalue[2], ls_splitvalue[3], ls_splitvalue[4], ls_splitvalue[5], ls_splitvalue[6], ls_splitvalue[7], ls_splitvalue[8], ls_splitvalue[9], ls_splitvalue[10]);
            }
            //NOSA : 12 PARAMS
            if (ls_splitvalue.Length == 12)
            {
                dt = MyCmn.RetrieveData(ls_splitvalue[0], ls_splitvalue[1], ls_splitvalue[2], ls_splitvalue[3], ls_splitvalue[4], ls_splitvalue[5], ls_splitvalue[6], ls_splitvalue[7], ls_splitvalue[8], ls_splitvalue[9], ls_splitvalue[10], "par_letter_body_line1", Session["BODY_LINE"].ToString().Trim());
            }
            //OATH : 13 PARAMS
            if (ls_splitvalue.Length == 13)
            {
                if (ls_splitvalue[12].ToString() == "O")
                {
                    dt = MyCmn.RetrieveData(ls_splitvalue[1], ls_splitvalue[2], ls_splitvalue[3], ls_splitvalue[4], ls_splitvalue[5], ls_splitvalue[6], ls_splitvalue[7], ls_splitvalue[8], ls_splitvalue[9], ls_splitvalue[10], ls_splitvalue[11]);
                }
                else
                {
                    dt = MyCmn.RetrieveData(ls_splitvalue[0],ls_splitvalue[1], ls_splitvalue[2], ls_splitvalue[3], ls_splitvalue[4], ls_splitvalue[5], ls_splitvalue[6], ls_splitvalue[7], ls_splitvalue[8], ls_splitvalue[9], ls_splitvalue[10], ls_splitvalue[11], ls_splitvalue[12]);
                    
                }
            }
            else
            {
                //Label1.Text = ls_splitvalue.Length.ToString();
            }


            if (dt == null)
            {
                return;
            }

            if (dt.Rows.Count <= 0 && (ls_splitvalue[0].ToString().Trim() != "sp_pds_rep" && ls_splitvalue[0].ToString().Trim() != "sp_pds_add_page1_rep"))
            {
                //ScriptManager.RegisterStartupScript(this, this.GetType(), "MyFun1", "swal({title:'NO DATA FOUND!',text:'Data not found for Printing',icon:'warning',buttons:true, dangerMode: true });", true);

                cryRpt.SetDataSource(dtTemp);
                //Response.Redirect("~/Views/cEmployeeCardRep/");
                return;

            }
            if (ls_splitvalue[0].ToString().Trim() == "sp_payrollregistry_phic_share_brkdwn_rep")
            {
                dtSub = new DataTable();
                dtSub = MyCmn.RetrieveData("sp_payrollregistry_phic_share_brkdwn_dtl_rep", ls_splitvalue[1], ls_splitvalue[2], ls_splitvalue[3], ls_splitvalue[4], ls_splitvalue[5], ls_splitvalue[6]);
                cryRpt.Subreports["cryPHICBreakdownSummary.rpt"].SetDataSource(dtSub);
            }
           
            if (ls_splitvalue[0].ToString().Trim() == "sp_score_sheet_rpt")
            {
                dtSub = new DataTable();
                dtSub = MyCmn.RetrieveData("sp_sub_competencies_required_main_rpt", ls_splitvalue[3], ls_splitvalue[4]);
                cryRpt.Subreports["crySub_CompetenciesRequired.rpt"].SetDataSource(dtSub);
            }

            try
            {

                 cryRpt.SetDataSource(dt);

                //dtSub = new DataTable();
                //dtSub = MyCmn.GetDatatable("SELECT * FROM vw_institution_tbl WHERE f_institution_id = 1");
                //cryRpt.Subreports["cryInstutution.rpt"].SetDataSource(dtSub);
                ////cryRpt.Subreports["cryDepEd.rpt"].SetDataSource(dtSub);


                //if (ls_splitvalue[0].ToString().Trim() == "sp_servicerecord_report")
                //{
                //    dtSub = new DataTable();
                //    dtSub = MyCmn.RetrieveData(ls_splitvalue[0], ls_splitvalue[1], ls_splitvalue[2], ls_splitvalue[3], ls_splitvalue[4]);
                //    cryRpt.Subreports["cryServiceRecord.rpt"].SetDataSource(dtSub);
                //}

                //if (ls_splitvalue[0].ToString().Trim() == "sp_payrollregistry_salary_payslip_re_rep")
                //{
                //    dtSub = new DataTable();
                //    dtSub = MyCmn.RetrieveData(ls_splitvalue[0], ls_splitvalue[1], ls_splitvalue[2], ls_splitvalue[3], ls_splitvalue[4], ls_splitvalue[5], ls_splitvalue[6], ls_splitvalue[7], ls_splitvalue[8], ls_splitvalue[9], ls_splitvalue[10]);
                //    cryRpt.Subreports["cryPaySlip.rpt"].SetDataSource(dtSub);
                //}

                //cryRpt.Subreports[0].SetParameterValue(0, ls_splitvalue[2].ToString().Trim());
                //cryRpt.Subreports[1].SetParameterValue(0, ls_splitvalue[2].ToString().Trim());
                //cryRpt.Subreports[1].SetParameterValue(0, ls_splitvalue[2].ToString().Trim());


                //FOR SUBREPORT ON CARDING 
                //ADDED BY JORGE: 11/16/2019
                //if (ls_splitvalue[0].ToString().Trim() == "sp_employeecard_re_ce_rep")
                //{
                //    cryRpt.Subreports[0].SetDataSource(dtSub);
                //}

                if (ls_splitvalue[0].ToString().Trim() == "sp_pds_rep" && ls_splitvalue[3].ToString().Trim() == "O")
                {
                    if (ls_splitvalue[2].ToString().Substring(0, 1) == "A")
                    {
                        dtSub = new DataTable();
                        dtSub = MyCmn.GetDatatableAPL("SELECT * FROM vw_pds_page1 WHERE empl_id = '" + ls_splitvalue[2].ToString().Trim() + "'");
                        cryRpt.Subreports["cryPDSPersonalInfo.rpt"].SetDataSource(dtSub);
                        //cryRpt.SetParameterValue(0, ls_splitvalue[2].ToString().Trim(), "Sub report Name")

                        dtSub = new DataTable();
                        dtSub = MyCmn.GetDatatableAPL("SELECT * FROM vw_personnel_children_tbl WHERE empl_id = '" + ls_splitvalue[2].ToString().Trim() + "'");
                        cryRpt.Subreports["cryPDSNameOfChildren.rpt"].SetDataSource(dtSub);
                        //cryRpt.Subreports[1].SetParameterValue(0, ls_splitvalue[2].ToString().Trim());

                        dtSub = new DataTable();
                        dtSub = MyCmn.GetDatatableAPL("SELECT IIF(ISDATE(examination_dateS)=1,examination_dateS,'1900') AS examination_date1,* FROM vw_personnel_csceligibilty_tbl WHERE empl_id = '" + ls_splitvalue[2].ToString().Trim() + "' ORDER BY examination_date1 DESC");
                        cryRpt.Subreports["cryPDCivilService.rpt"].SetDataSource(dtSub);

                        dtSub = new DataTable();
                        dtSub = MyCmn.GetDatatableAPL("SELECT IIF(ISDATE(workexp_fromS)=1,workexp_fromS,'1900') AS workexp_from1,* FROM vw_personnel_workexprnce_tbl WHERE empl_id = '" + ls_splitvalue[2].ToString().Trim() + "' ORDER BY workexp_from1 DESC");
                        cryRpt.Subreports["cryPDSWorkExperience.rpt"].SetDataSource(dtSub);

                        dtSub = new DataTable();
                        dtSub = MyCmn.GetDatatableAPL("SELECT IIF(ISDATE(voluntarywork_fromS)=1,voluntarywork_fromS,'1900') AS voluntarywork_from1,* FROM vw_personnel_voluntarywork_tbl WHERE empl_id = '" + ls_splitvalue[2].ToString().Trim() + "' ORDER BY voluntarywork_from1 DESC");
                        cryRpt.Subreports["cryPDSVoluntaryWork.rpt"].SetDataSource(dtSub);

                        dtSub = new DataTable();
                        dtSub = MyCmn.GetDatatableAPL("SELECT IIF(ISDATE(learn_devt_fromS)=1,learn_devt_fromS,'1900') AS learn_devt_from1,* FROM vw_personnel_lnd_tbl WHERE empl_id = '" + ls_splitvalue[2].ToString().Trim() + "'ORDER BY learn_devt_from1 DESC");
                        cryRpt.Subreports["cryPDSLND.rpt"].SetDataSource(dtSub);

                        dtSub = new DataTable();
                        dtSub = MyCmn.GetDatatableAPL("SELECT * FROM vw_pds_page3 WHERE empl_id = '" + ls_splitvalue[2].ToString().Trim() + "'");
                        cryRpt.Subreports["cryPDSOtherInformation.rpt"].SetDataSource(dtSub);

                        dtSub = new DataTable();
                        dtSub = MyCmn.GetDatatableAPL("SELECT * FROM vw_personnel_otherinformation_tbl WHERE empl_id = '" + ls_splitvalue[2].ToString().Trim() + "' AND other_type='S'");
                        cryRpt.Subreports["cryPDSOtherInformation_Skills.rpt"].SetDataSource(dtSub);

                        dtSub = new DataTable();
                        dtSub = MyCmn.GetDatatableAPL("SELECT * FROM vw_personnel_otherinformation_recognation_tbl WHERE empl_id = '" + ls_splitvalue[2].ToString().Trim() + "' AND other_type='R'");
                        cryRpt.Subreports["cryPDSOtherInformation_Recognation.rpt"].SetDataSource(dtSub);

                        dtSub = new DataTable();
                        dtSub = MyCmn.GetDatatableAPL("SELECT * FROM vw_personnel_otherinformation_membership_tbl WHERE empl_id = '" + ls_splitvalue[2].ToString().Trim() + "' AND other_type='M'");
                        cryRpt.Subreports["cryPDSOtherInformation_Membership.rpt"].SetDataSource(dtSub);

                        dtSub = new DataTable();
                        dtSub = MyCmn.GetDatatableAPL("SELECT * FROM vw_personnel_statutary_tbl WHERE empl_id = '" + ls_splitvalue[2].ToString().Trim() + "'");
                        cryRpt.Subreports["cryPDSPage4.rpt"].SetDataSource(dtSub);

                        dtSub = new DataTable();
                        dtSub = MyCmn.GetDatatableAPL("SELECT * FROM vw_personnel_references_tbl WHERE empl_id = '" + ls_splitvalue[2].ToString().Trim() + "'");
                        cryRpt.Subreports["cryPDSPersonReference.rpt"].SetDataSource(dtSub);
                    }
                    else
                    {
                        dtSub = new DataTable();
                        dtSub = MyCmn.GetDatatable("SELECT * FROM vw_pds_page1 WHERE empl_id = '" + ls_splitvalue[2].ToString().Trim() + "'");
                        cryRpt.Subreports["cryPDSPersonalInfo.rpt"].SetDataSource(dtSub);
                        //cryRpt.SetParameterValue(0, ls_splitvalue[2].ToString().Trim(), "Sub report Name")

                        dtSub = new DataTable();
                        dtSub = MyCmn.GetDatatable("SELECT * FROM vw_personnel_children_tbl WHERE empl_id = '" + ls_splitvalue[2].ToString().Trim() + "'");
                        cryRpt.Subreports["cryPDSNameOfChildren.rpt"].SetDataSource(dtSub);
                        //cryRpt.Subreports[1].SetParameterValue(0, ls_splitvalue[2].ToString().Trim());

                        dtSub = new DataTable();
                        dtSub = MyCmn.GetDatatable("SELECT IIF(ISDATE(examination_dateS)=1,examination_dateS,'1900') AS examination_date1,* FROM vw_personnel_csceligibilty_tbl WHERE empl_id = '" + ls_splitvalue[2].ToString().Trim() + "' ORDER BY examination_date1 DESC");
                        cryRpt.Subreports["cryPDCivilService.rpt"].SetDataSource(dtSub);

                        dtSub = new DataTable();
                        dtSub = MyCmn.GetDatatable("SELECT IIF(ISDATE(workexp_fromS)=1,workexp_fromS,'1900') AS workexp_from1,* FROM vw_personnel_workexprnce_tbl WHERE empl_id = '" + ls_splitvalue[2].ToString().Trim() + "' ORDER BY workexp_from1 DESC");
                        cryRpt.Subreports["cryPDSWorkExperience.rpt"].SetDataSource(dtSub);

                        dtSub = new DataTable();
                        dtSub = MyCmn.GetDatatableAPL("SELECT IIF(ISDATE(voluntarywork_fromS)=1,voluntarywork_fromS,'1900') AS voluntarywork_from1,* FROM vw_personnel_voluntarywork_tbl WHERE empl_id = '" + ls_splitvalue[2].ToString().Trim() + "' ORDER BY voluntarywork_from1 DESC");
                        cryRpt.Subreports["cryPDSVoluntaryWork.rpt"].SetDataSource(dtSub);

                        dtSub = new DataTable();
                        dtSub = MyCmn.GetDatatable("SELECT IIF(ISDATE(learn_devt_fromS)=1,learn_devt_fromS,'1900') AS learn_devt_from1,* FROM vw_personnel_lnd_tbl WHERE empl_id = '" + ls_splitvalue[2].ToString().Trim() + "'ORDER BY learn_devt_from1 DESC");
                        cryRpt.Subreports["cryPDSLND.rpt"].SetDataSource(dtSub);

                        dtSub = new DataTable();
                        dtSub = MyCmn.GetDatatable("SELECT * FROM vw_pds_page3 WHERE empl_id = '" + ls_splitvalue[2].ToString().Trim() + "'");
                        cryRpt.Subreports["cryPDSOtherInformation.rpt"].SetDataSource(dtSub);

                        dtSub = new DataTable();
                        dtSub = MyCmn.GetDatatable("SELECT * FROM vw_personnel_otherinformation_tbl WHERE empl_id = '" + ls_splitvalue[2].ToString().Trim() + "' AND other_type='S'");
                        cryRpt.Subreports["cryPDSOtherInformation_Skills.rpt"].SetDataSource(dtSub);

                        dtSub = new DataTable();
                        dtSub = MyCmn.GetDatatable("SELECT * FROM vw_personnel_otherinformation_recognation_tbl WHERE empl_id = '" + ls_splitvalue[2].ToString().Trim() + "' AND other_type='R'");
                        cryRpt.Subreports["cryPDSOtherInformation_Recognation.rpt"].SetDataSource(dtSub);

                        dtSub = new DataTable();
                        dtSub = MyCmn.GetDatatable("SELECT * FROM vw_personnel_otherinformation_membership_tbl WHERE empl_id = '" + ls_splitvalue[2].ToString().Trim() + "' AND other_type='M'");
                        cryRpt.Subreports["cryPDSOtherInformation_Membership.rpt"].SetDataSource(dtSub);

                        dtSub = new DataTable();
                        dtSub = MyCmn.GetDatatable("SELECT * FROM vw_personnel_statutary_tbl WHERE empl_id = '" + ls_splitvalue[2].ToString().Trim() + "'");
                        cryRpt.Subreports["cryPDSPage4.rpt"].SetDataSource(dtSub);

                        dtSub = new DataTable();
                        dtSub = MyCmn.GetDatatable("SELECT * FROM vw_personnel_references_tbl WHERE empl_id = '" + ls_splitvalue[2].ToString().Trim() + "'");
                        cryRpt.Subreports["cryPDSPersonReference.rpt"].SetDataSource(dtSub);
                    }
                }
                else if (ls_splitvalue[0].ToString().Trim() == "sp_pds_rep" && ls_splitvalue[3].ToString().Trim() == "2")
                {
                    dtSub = new DataTable();
                    dtSub = MyCmn.GetDatatableAPL("SELECT IIF(ISDATE(examination_dateS)=1,examination_dateS,'1900') AS examination_date1,* FROM vw_personnel_csceligibilty2_tbl WHERE empl_id = '" + ls_splitvalue[2].ToString().Trim() + "' ORDER BY examination_date1 DESC");
                    cryRpt.Subreports["cryPDCivilService.rpt"].SetDataSource(dtSub);

                    dtSub = new DataTable();
                    dtSub = MyCmn.GetDatatableAPL("SELECT IIF(ISDATE(workexp_fromS)=1,workexp_fromS,'1900') AS workexp_from1,* FROM vw_personnel_workexprnce2_tbl WHERE empl_id = '" + ls_splitvalue[2].ToString().Trim() + "' ORDER BY workexp_from1 DESC");
                    cryRpt.Subreports["cryPDSWorkExperience.rpt"].SetDataSource(dtSub);
                }
                else if (ls_splitvalue[0].ToString().Trim() == "sp_pds_rep" && ls_splitvalue[3].ToString().Trim() == "3")
                {
                    dtSub = new DataTable();
                    dtSub = MyCmn.GetDatatableAPL("SELECT IIF(ISDATE(voluntarywork_fromS)=1,voluntarywork_fromS,'1900') AS voluntarywork_from1,* FROM vw_personnel_voluntarywork2_tbl WHERE empl_id = '" + ls_splitvalue[2].ToString().Trim() + "' ORDER BY voluntarywork_from1 DESC");
                    cryRpt.Subreports["cryPDSVoluntaryWork.rpt"].SetDataSource(dtSub);

                    dtSub = new DataTable();
                    dtSub = MyCmn.GetDatatableAPL("SELECT IIF(ISDATE(learn_devt_fromS)=1,learn_devt_fromS,'1900') AS learn_devt_from1,* FROM vw_personnel_lnd2_tbl WHERE empl_id = '" + ls_splitvalue[2].ToString().Trim() + "'ORDER BY learn_devt_from1 DESC");
                    cryRpt.Subreports["cryPDSLND.rpt"].SetDataSource(dtSub);

                    dtSub = new DataTable();
                    dtSub = MyCmn.GetDatatableAPL("SELECT * FROM vw_pds_page3 WHERE empl_id = '" + ls_splitvalue[2].ToString().Trim() + "'");
                    cryRpt.Subreports["cryPDSOtherInformation.rpt"].SetDataSource(dtSub);

                    dtSub = new DataTable();
                    dtSub = MyCmn.GetDatatableAPL("SELECT * FROM vw_personnel_otherinformation2_tbl WHERE empl_id = '" + ls_splitvalue[2].ToString().Trim() + "' AND other_type='S'");
                    cryRpt.Subreports["cryPDSOtherInformation_Skills.rpt"].SetDataSource(dtSub);

                    dtSub = new DataTable();
                    dtSub = MyCmn.GetDatatableAPL("SELECT * FROM vw_personnel_otherinformation_recognation2_tbl WHERE empl_id = '" + ls_splitvalue[2].ToString().Trim() + "' AND other_type='R'");
                    cryRpt.Subreports["cryPDSOtherInformation_Recognation.rpt"].SetDataSource(dtSub);

                    dtSub = new DataTable();
                    dtSub = MyCmn.GetDatatableAPL("SELECT * FROM vw_personnel_otherinformation_membership2_tbl WHERE empl_id = '" + ls_splitvalue[2].ToString().Trim() + "' AND other_type='M'");
                    cryRpt.Subreports["cryPDSOtherInformation_Membership.rpt"].SetDataSource(dtSub);
                }


                //END
                crvPrint.ReportSource = cryRpt;
                crvPrint.DataBind();
                PrinterSettings settings = new PrinterSettings();
                
            }
            catch (Exception e)
            {
                Console.Write(e.Message);
            }
        }

        private void BindReport(ReportDocument ReportPath)
        {
            crvPrint.ReportSource = ReportPath;
            crvPrint.DataBind();

        }
        private void shownextpage(int pageno)
        {
            crvPrint.ShowNthPage(pageno);
            hf_nexpage.Value = "0";

        }
        private void shoprevpage()
        {
            crvPrint.ShowPreviousPage();

        }
        protected void btn_print_Click(object sender, EventArgs e)
        {
            LinkButton btn = (LinkButton)sender;

            try
            {
                cryRpt.Refresh();

                switch (printfile)
                {
                    case "~/Reports/cryPlantilla/cryPlantilla.rpt":
                        cryRpt.PrintOptions.PaperOrientation = PaperOrientation.Landscape;
                        cryRpt.PrintOptions.PaperSize = CrystalDecisions.Shared.PaperSize.PaperLegal;
                        break;
                    case "~/Reports/cryPlantillaCSC/cryPlantillaCSC.rpt":
                        cryRpt.PrintOptions.PaperOrientation = PaperOrientation.Landscape;
                        cryRpt.PrintOptions.PaperSize = CrystalDecisions.Shared.PaperSize.PaperLegal;
                        break;
                    case "~/Reports/cryPlantillaHR/cryPlantillaHR.rpt":
                        cryRpt.PrintOptions.PaperOrientation = PaperOrientation.Landscape;
                        cryRpt.PrintOptions.PaperSize = CrystalDecisions.Shared.PaperSize.PaperLegal;
                        break;
                    case "~/Reports/cryPSSalariesWages/cryPSSalariesWages.rpt":
                        cryRpt.PrintOptions.PaperOrientation = PaperOrientation.Landscape;
                        cryRpt.PrintOptions.PaperSize = CrystalDecisions.Shared.PaperSize.PaperLetter;
                        break;
                    case "~/Reports/cryVacantItems/cryVacantItems.rpt":
                        cryRpt.PrintOptions.PaperOrientation = PaperOrientation.Portrait;
                        cryRpt.PrintOptions.PaperSize = CrystalDecisions.Shared.PaperSize.PaperLetter;
                        break;
                    case "~/Reports/cryListOfEmployees/cryListOfEmployees.rpt":
                        cryRpt.PrintOptions.PaperOrientation = PaperOrientation.Portrait;
                        cryRpt.PrintOptions.PaperSize = CrystalDecisions.Shared.PaperSize.PaperLetter;
                        break;
                    default:

                        break;
                }
            }
            catch (Exception)
            {
            }

        }

        private string GetDefaultPrinter()
        {
            PrinterSettings settings = new PrinterSettings();
            foreach (string printer in PrinterSettings.InstalledPrinters)
            {
                settings.PrinterName = printer;
                if (settings.IsDefaultPrinter)
                {
                    return printer;
                }
            }
            return string.Empty;
        }

        protected void btn_close_Click(object sender, EventArgs e)
        {
            closepage();
        }
        private void closepage()
        {
            ClientScript.RegisterClientScriptBlock(Page.GetType(), "script", "window.close();", true);
        }

        protected void img_nextpage_Click(object sender, ImageClickEventArgs e)
        {
            crvPrint.ShowNextPage();

        }
        protected void lbtn_pdf_Click(object sender, ImageClickEventArgs e)
        {
            converttopdf();

        }
        private void converttopdf()
        {
            try
            {
                ExportOptions CrExportOptions;
                DiskFileDestinationOptions CrDiskFileDestinationOptions = new DiskFileDestinationOptions();
                PdfRtfWordFormatOptions CrFormatTypeOptions = new PdfRtfWordFormatOptions();
                CrDiskFileDestinationOptions.DiskFileName = @"c:\\pdf\Plantilla.pdf";
                CrExportOptions = cryRpt.ExportOptions;
                {
                    CrExportOptions.ExportDestinationType = ExportDestinationType.DiskFile;
                    CrExportOptions.ExportFormatType = ExportFormatType.PortableDocFormat;
                    CrExportOptions.DestinationOptions = CrDiskFileDestinationOptions;
                    CrExportOptions.FormatOptions = CrFormatTypeOptions;
                }
                cryRpt.Export();

            }
            catch (Exception ex)
            {
                ex.ToString();
            }
        }

        protected void lbtn_pdf_Click(object sender, EventArgs e)
        {
            converttopdf();
        }

        protected void btn_save_Click(object sender, EventArgs e)
        {
            //ScriptManager.RegisterStartupScript(this, this.GetType(), "Pop", "Clickprint();", true);
        }

        protected void crvPrint_Load(object sender, EventArgs e)
        {
            //    if (Session["first_load"].ToString() == "true")
            //     {
            //        ScriptManager.RegisterStartupScript(this, this.GetType(), "Pop", "setPageDisplay();", true);
            //     }
        }

    }
}