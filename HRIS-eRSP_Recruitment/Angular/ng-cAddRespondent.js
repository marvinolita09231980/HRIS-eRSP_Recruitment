
ng_eRSP_App.controller("cAddRespondent_Ctrlr", function (commonScript, $scope, $http, $filter, $compile) {
    var s = $scope
    var h = $http
    var cs = commonScript

    s.app_ctrl_nbr = ""
    s.exam_rowindex = ""
    s.um = {}
    s.year = cs.RetrieveYear()
    s.rating_left = "0"
    
    s.hiringperiod = []
    s.selectedItemRow = []
    s.bi_respondent_type_tbl = []
    
    

    function init() {
     

        h.post("../cAddRespondent/Initialize").then(function (d) {
            s.app_ctrl_nbr = d.data.app_ctrl_nbr 
            s.bi_respondent_type_tbl = d.data.bi_respondent_type_tbl
        })
    }



    init()

    
    
    s.SaveRespondent = function () {

        if (cs.validateform("respondent_form")) {
           
                cs.notrequired("hiring_period")

                var repondent_data = cs.getFormData("respondent_form")
                var app_ctrl_nbr = s.app_ctrl_nbr
                h.post("../cAddRespondent/SaveRespondent", {

                     repondent_data: repondent_data
                    ,app_ctrl_nbr: app_ctrl_nbr


                }).then(function (d) {
                    if (d.data.icon == "success") {
                        location.href = "../cApplicantForBI"
                    }
                    else {
                        swal({ title: d.data.message, icon: d.data.icon })
                    }
                    
                    
                })
            
            
        }

    }
    

})

// employee_name
// budget_code
// employment_type
// item_no
// hiring_period
// empl_id
// department_name

