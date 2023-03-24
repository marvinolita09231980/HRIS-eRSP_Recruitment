
ng_eRSP_App.controller("cApplicationInfoDetails_Ctrlr", function (commonScript, $scope, $http, $filter, $compile) {
    var s = $scope
    var h = $http
    var cs = commonScript;
    s.header_title = "EDIT APPLICANTS INFO "
    s.modal = 1
    s.rowLen = ""
    s.doc_type = ""
    s.pageTitle = ""
    s.info_ctrl_nbr = ""
    s.applicant_type = ""
    s.main_edit = false
    s.dtl_edit = false
    s.dropzone = false
    s.editonly = false
    s.adddetails = false
    s.hidesave = false
    s.allow_type_id = false;
    s.applicantinfo = true
    s.attach = "active"
    s.hasdetails = false
    s.year = []
    s.res_data = []
    s.budget_year = []
    s.position_from_publication = []

    s.fd = {
          info_ctrl_nbr_disp: ""
        , last_name: ""
        , first_name: ""
        , middle_name: ""
        , birth_date: ""
        , gender: ""
        , civil_status: ""
        , app_address: ""
        , item_no: ""
        , appointment: ""
        , budget_code:""
        , app_status: ""
        , applied_dttm: ""
        
    }
    s.um = {}
    s.wx = {}
    s.ld = {}
    s.el = {}
    s.ed = {}
    s.docname = []
    var appl = []
    var educ = []
    var lnd = []

    var wexp = []
    var elig = []



    s.status = [{ id: 'NW', text: 'New Application' }, { id: 'DS', text: 'Disapproved' }, { id: 'PS', text: 'To PSB Screening' }, { id: 'JH', text: 'JO Hiring' }, { id: 'FL', text: 'For Filing' }]
    s.AT = [{ id: 'JO', text: 'Job Order' }, { id: 'RE', text: 'Permanent' }, { id: 'CE', text: 'CASUAL' }]
    s.alphabet_list = [
       { alpha_name: 'A' }, { alpha_name: 'B' }, { alpha_name: 'C' }, { alpha_name: 'D' }, { alpha_name: 'E' }, { alpha_name: 'F' },
       { alpha_name: 'G' }, { alpha_name: 'H' }, { alpha_name: 'I' }, { alpha_name: 'J' }, { alpha_name: 'K' }, { alpha_name: 'L' },
       { alpha_name: 'M' }, { alpha_name: 'N' }, { alpha_name: 'O' }, { alpha_name: 'P' }, { alpha_name: 'Q' }, { alpha_name: 'R' },
       { alpha_name: 'S' }, { alpha_name: 'T' }, { alpha_name: 'U' }, { alpha_name: 'V' }, { alpha_name: 'W' }, { alpha_name: 'X' },
       { alpha_name: 'Y' }, { alpha_name: 'Z' }
    ]
    s.svc = [{ id: false, text: 'No' }, { id: true, text: 'Yes' }]

   

    function init() {
      
        s.rowLen = "10"
      
        h.post("../cApplicationInfoDetails/Initialize").then(function (d) {
            if (d.data.icon == "success") {
                
                d.data.returndata.populateFields(s.fd,0)
                s.info_ctrl_nbr = d.data.info_ctrl_nbr;
            }
        })
    }



    init()



    s.AddDetails = function (val) {
        if (val == "cApplicationInfoDetails/Index") {
            location.href = "cApplicationInfoDetails/Index?app_control_nbr =" + s.app_ctrl_nbr;
        }
        else {
            
            location.href = val;
        }
    }

    s.Edit_Application = function () {
     
        if (cs.ValidateFields(s.fd)) {
            h.post("../cApplicationInfoDetails/Edit_Application", { app: s.fd, info_ctrl_nbr: s.info_ctrl_nbr }).then(function (d) {

                if (d.data.icon == "success") {
                    swal(d.data.message, { icon: d.data.icon });
                }
                else {
                    swal(d.data.message, { icon: d.data.icon });
                }
            })
        }

    }



    s.selectEmployment = function (val) {

        s.fd.budget_code = "";

        h.post("../cAddApplicants/getBudgetYear", { employment_type: val }).then(function (d) {
            if (d.data.icon == "success") {
                s.budget_year = d.data.budget_year;
            }
            else {
                console.log(d.data.message)
            }
        })
    }

    s.selectBudgetCode = function (val) {
        if (val != "") {
            h.post("../cAddApplicants/getPositionFromPublication", { budget_code: val, employment_type: s.fd.appointment }).then(function (d) {
                if (d.data.icon == "success") {
                    s.position_from_publication = d.data.positions;
                }
                else {
                    console.log(d.data.message)
                }

            })
        }
    }


})


