


ng_eRSP_App.controller("cAddApplicant_Ctrlr", function (commonScript,$scope, $http, $filter, $compile) {
    var s = $scope
    var h = $http
    var cs = commonScript;

    //string scope
    s.header_title = "ADD APPLICANTS INFO"
    s.rowLen = ""
    s.doc_type = ""
    s.pageTitle = ""
    s.info_ctrl_nbr = ""
    s.attach = "active"
    s.employment_type = "JO"
    s.person_message = ""
    s.budget_code = ""


    //int scope
    s.is_employee = 0
    s.modal = 1


    //boolean variables
    s.main_edit = false
    s.dtl_edit = false
    s.dropzone = false
    s.editonly = false
    s.adddetails = false
    s.hidesave = false
    s.allow_type_id = false;
    s.applicantinfo = true
    s.person_warning = false
    s.hasdetails = false

    
    //array scope
    s.year = []
    s.position_from_publication = []
    s.budget_year = []
    s.res_data = []
    s.docname = []


    // array variable
    var appl = []
    var educ = []
    var lnd = []
    var wexp = []
    var elig = []


    //object scope
    s.um = {}
    s.fd = {
          info_ctrl_nbr_disp: ""
        , last_name: ""
        , first_name: "" 
        , middle_name: ""
        , birth_date: ""
        , gender: ""
        , civil_status: ""
        , app_address: ""
        , applied_dttm: ""
        , birth_date: ""
    }
    s.wx = {}
    s.ld = {}
    s.el = {}
    s.ed = {}
    s.status = [
        { id: 'RC', text: 'Received' },
        { id: 'WS', text: 'Waiting List' },
        { id: 'SL', text: 'Short List' },
        { id: 'PS', text: 'PSB Screened' },
        { id: 'AP', text: 'Approved' }]
    s.AT = [
         { id: '', text: '' },
         { id: 'JO', text: 'Job Order' },
        { id: 'RE', text: 'Permanent' },
         { id: 'CE', text: 'CASUAL' }]

    s.alphabet_list = [
       { alpha_name: 'A' }, { alpha_name: 'B' }, { alpha_name: 'C' }, { alpha_name: 'D' }, { alpha_name: 'E' }, { alpha_name: 'F' },
       { alpha_name: 'G' }, { alpha_name: 'H' }, { alpha_name: 'I' }, { alpha_name: 'J' }, { alpha_name: 'K' }, { alpha_name: 'L' },
       { alpha_name: 'M' }, { alpha_name: 'N' }, { alpha_name: 'O' }, { alpha_name: 'P' }, { alpha_name: 'Q' }, { alpha_name: 'R' },
       { alpha_name: 'S' }, { alpha_name: 'T' }, { alpha_name: 'U' }, { alpha_name: 'V' }, { alpha_name: 'W' }, { alpha_name: 'X' },
       { alpha_name: 'Y' }, { alpha_name: 'Z' }
    ]
    s.svc = [{ id: false, text: 'No' }, { id: true, text: 'Yes' }]

    var Init_Applicant_List_Grid = function (par_data) {
        s.Applicant_List_Data = par_data;
        s.Applicant_List_Table = $('#Applicant_List_Grid').dataTable(
            {
                data: s.Applicant_List_Data,
                sDom: 'rt<"bottom"p>',
                pageLength: 10,
                columns: [
                    {
                        "mData": "app_ctrl_nbr_disp",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-center btn-block'>" + data + "</span>"
                        }
                    },

                    {
                        "mData": "applicant_name",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-left btn-block'>" + data + "</span>"
                        }
                    },
                    {
                        "mData": "applied_dttm",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-center btn-block'>" + data + "</span>"
                        }
                    },
                    {
                        "mData": "gender_descr",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-center btn-block'>" + data + "</span>"
                        }
                    },
                    {
                        "mData": "age",
                        "mRender": function (data, type, full, row) {

                            return "<span class='text-center btn-block'>" + data + "</span>"
                        }
                    },
                    {
                        "mData": "civil_status_descr",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-center btn-block'>" + data + "</span>"
                        }
                    },
                    {
                        "mData": "enabled",
                        "bSortable": false,
                        "mRender": function (data, type, full, row) {

                            return '<center><div class="btn-group">' +
                                '<button  type="button" class="btn btn-info btn-sm action" data-toggle="tab" href="#tab-7" ng-click="main_btn_edit(' + row["row"] + ')" >  <i class="fa fa-edit"></i></button >' +
                                '<button  type="button" class="btn btn-danger btn-sm action" ng-click="btn_del_row_main_grid(' + row["row"] + ')">   <i id="del_row' + row["row"] + '" class="fa fa-trash"></i></button>' +
                                '</div></center>';
                        }
                    }
                     //data-toggle="tab" href="#tab-7"
                ],
                "createdRow": function (row, data, index) {
                    //$(row).addClass("dt-row");
                    $compile(row)($scope);  //add this to compile the DOM
                },

            });

        $("div.toolbar").html('<b>Custom tool bar! Text/images etc.</b>');
    }

    function init() {
       
        //cs.DisabledField("save_fd");
        Init_Applicant_List_Grid([]);
        s.appl_year = "";
        s.let_Lname = "A";
        s.wx.workxp_sal_grade = "NA"
        s.rowLen = "10"
        s.year = cs.RetrieveYear();
        h.post("../cAddApplicants/Initialize", { employment_type: s.employment_type }).then(function (d) {
            if (d.data.icon == "success") {
                s.budget_year = d.data.budget_year;
                s.fd.info_ctrl_nbr_disp = cs.currentyear + "-" + d.data.info_ctrl_nbr;
                s.info_ctrl_nbr = d.data.info_ctrl_nbr;
            }
        })
    }

    init()


    s.cancelfetch = function () {
        s.allow_type_id = false;
        s.current_empl_id = ""
        $("#choose_applicanttype").modal("hide")
    }
    s.fetchfromPDS = function () {
        //s.app_ctrl_nbr
        var id = s.current_empl_id
        
        h.post("../cAddApplicants/FetchFromPDS", { empl_id: id, info_ctrl_nbr: s.info_ctrl_nbr }).then(function (d) {

            if (d.data.icon == "success") {
              
                if(d.data.DatafrmPDS == "Data successfully inserted")
                {
                    d.data.applicants.populateFields(s.fd, 0)
                    s.Applicant_List_Data = d.data.applicants.refreshTable("Applicant_List_Grid", "");
                    swal("Data from PDS successfully inserted", { icon: "info" })
                }
              
            }
            else {
                swal("Data from PDS not successfully fetch", { icon: "info" })
            }
        })
        $("#choose_applicanttype").modal("hide")
    }
    s.FindPersonnel = function (val) {
       
        if (val.length == 4) {
           
            h.post("../cAddApplicants/FindPersonnel", { empl_id: val }).then(function (d) {
                if (d.data.person.is_added == 0) {
                    s.person_warning = true
                    s.person_message = d.data.person.descr
                }
                else if (d.data.person.is_added == 1)
                {
                    s.person_warning = true
                    s.person_message = d.data.person.descr
                }
                else
                {
                    s.current_employee_name = d.data.person.employee_name
                }
            })
        }
    }
  
   
    s.refreshfield = function () {
        cs.clearFields(s.fd)
        cs.removeFormReq(s.fd)
        $("#Applicant_List_Grid").dataTable().fnClearTable();
        s.current_empl_id = ""
        h.post("../cAddApplicants/fetchAppCtrlNbr").then(function (d) {
            if(d.data.icon == "success")
            {
                s.fd.info_ctrl_nbr_disp = cs.currentyear + "-" + d.data.app_ctrl_nbr;
                s.app_ctrl_nbr = d.data.app_ctrl_nbr;
            }
        })
     
    }

    s.Select_Doc_Type = function (val) {
        s.doc_type = val
    }


    s.Select_ApplType = function (val) {
        
        h.post("../cAddApplicants/GetApplicationNbr").then(function (d) {
            if (val == 1) {
                cs.DisabledAllFields(s.fd);
                s.current_employee_name = ""
                $("#choose_applicanttype").modal("show")
                
                s.current_empl_id = ""
                s.is_employee = val
            }
            else {
                cs.clearFields(s.fd)
                $("#Applicant_List_Grid").dataTable().fnClearTable();
                s.current_empl_id = ""
                s.allow_type_id = false;
                s.is_employee = val
                s.fd.app_status = "RC"
            }
            s.fd.info_ctrl_nbr_disp = cs.currentyear + "-" + d.data.app_ctrl_nbr;
        })
       
    }
   
    function findDoc(flname) {
        var doc = s.docname.filter(function (d) {
           
            d.filename == flname
        })
        if (doc.length < 1) {
            return ""
        }
        else {
            return doc[0].doc
        }
    }
   
    s.goToDetails = function (row) {
        var app_control_nbr = s.Applicant_List_Data[0].app_ctrl_nbr;
        location.href = "cApplicationInfoDetails/Index?app_control_nbr=" + app_control_nbr;
    }
    s.Save_Application = function () {
 
        s.fd.birth_date = $("#birth_date").val()
        s.fd.applied_dttm = $("#applied_dttm").val()
     
        if (cs.ValidateFields(s.fd)) {
            h.post("../cAddApplicants/Save_Application", {
                app: s.fd, 
                info_ctrl_nbr_disp: s.fd.info_ctrl_nbr_disp,
            }).then(function (d) {
                if (d.data.icon == "success") {
                    swal(d.data.message, { icon: d.data.icon });
                    s.Applicant_List_Data = d.data.list.refreshTable("Applicant_List_Grid", "")
                }
                else {
                    swal(d.data.message, { icon: d.data.icon });
                }
            })
                
        }
    }

  
    s.selectEmployment = function (val) {
        s.budget_code = "";
        cs.DisabledAllFields(s.fd);
        cs.DisabledField("save_fd");

        h.post("../cAddApplicants/getBudgetYear", { employment_type: val }).then(function (d) {
            if (d.data.icon == "success") {
              
               
                s.budget_year = d.data.budget_year;
            }
            else {
               console.log(d.data.message)
            }
        })
    }

    //s.selectBudgetCode = function (val) {
    //    if(val == "")
    //    {
    //        cs.DisabledAllFields(s.fd);
         
    //        cs.DisabledField("save_fd");
    //        return
    //    }
    //    if(val != "")
    //    {
    //        cs.EnabledAllFields(s.fd);
    //        cs.EnabledField("save_fd");
    //        cs.EnabledField("dd-applicant-type");
    //        h.post("../cAddApplicants/getPositionFromPublication", { budget_code: val, employment_type: s.employment_type }).then(function (d) {
    //            if (d.data.icon == "success") {
    //                s.position_from_publication = d.data.positions;
                   
    //            }
    //            else {
    //                console.log(d.data.message)
    //            }
               
    //        })
    //    }
    //}

})


