


ng_eRSP_App.controller("cComparativeAssessment_Ctrlr", function (commonScript, $scope, $http, $filter, $compile) {
    var s = $scope
    var h = $http
    var cs = commonScript
    var c = commonScript
    s.itemnumber = ""
    s.positionname = ""
    s.departmentname = ""
    s.session_time_interval = 5
    s.last_time = 5
    s.new_time = 5
    s.header_title = "APPLICANT LIST"
    s.psbsched = []
    s.budget_year = []
    s.employment_type = ""
    s.rowLen = "5"
    s.year = []
    s.yr = ""
    s.fullname = ""
    s.item_code = ""
    s.app_ctrl_nbr = ""
    s.position_code = ""
    s.department_code = ""
    s.slideInnerText = []
    s.positions = []
    s.included_list = []
    s.sp_psb_item_list = []
    s.endorse_list = []
    s.endorse_date = ""
    s.endorse_position = ""
    s.endorse_item_no = ""
    s.endorse_department_name1 = ""
    s.endorse_salary_grade = 0
    s.endorse_psb_ctrl_nbr = ""
    s.selectedRow = null
    s.individual = {}
    s.um = {}
    s.selected_approved = false

    s.month = [
        { id: "01", text: "January" },
        { id: "02", text: "February" },
        { id: "03", text: "March" },
        { id: "04", text: "April" },
        { id: "05", text: "May" },
        { id: "06", text: "June" },
        { id: "07", text: "July" },
        { id: "08", text: "August" },
        { id: "09", text: "September" },
        { id: "10", text: "October" },
        { id: "11", text: "November" },
        { id: "12", text: "December" },
    ]

    s.year = cs.RetrieveYear()
    s.profile = {}


    s.encode_idv = function (d, a, e, b, c, f) {
        c = "";
        try {

            for (a = e = b = 0; a < 4 * d.length / 3; f = b >> 2 * (++a & 3) & 63, c += String.fromCharCode(f + 71 - (f < 26 ? 6 : f < 52 ? 0 : f < 62 ? 75 : f ^ 63 ? 90 : 87)) + (75 == (a - 1) % 76 ? "\r\n" : ""))a & 3 ^ 3 && (b = b << 8 ^ d[e++]); for (; a++ & 3;)c += "=";

            if (c.toString().trim() == "") {
                c = "../ResourcesImages/149071.png";
            }
            else {
                c = "data:image/png;base64," + c;
            }
        } catch (e) {
            c = "../ResourcesImages/149071.png";
        }
        return c;
    }



    function changefa(val) {
        if (val == "4") {
            return "fa-check"
        }
        else if (val == "5") {
            return "fa-trophy"
        }
        else {
            return "fa-plus"
        }
    }

    function HSAD(data) { //IF ALREADY SELECTED ITEM DISABLE BUTTON
        if (data) {
            return "disabled"
        }
        else {
            return ""
        }
    }

    var Init_PSB_List_Grid = function (par_data) {
        s.Data_List = par_data;
        s.Data_Table = $('#Data_List_Grid').dataTable(
            {
                data: s.Data_List,
                sDom: 'rt<"bottom"p>',
                pageLength: 10,
                order: [[0, 'asc']],
                columns: [
                    {
                        "mData": null,
                        "mRender": function (data, type, full, row) {
                            return "<span></span>"
                        }
                    },
                    {
                        "mData": "last_name",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-left btn-block' style='text-transform:uppercase'><strong>" + data + "</strong></span>"
                        }
                    },

                    {
                        "mData": "first_name",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-left btn-block' style='text-transform:uppercase'><strong>" + data + "</strong></span>"
                        }
                    },
                    {
                        "mData": "qs_rating",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-center btn-block'>" + data + "</span>"
                        }
                    },
                    {
                        "mData": "cbi_rating",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-center btn-block'>" + data + "</span>"
                        }
                    },
                    {
                        "mData": "exam_rating",
                        "mRender": function (data, type, full, row) {

                            return "<span class='text-center btn-block'>" + data + "</span>"
                        }
                    },
                    {
                        "mData": "total_rating",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-center btn-block'>" + data + "</span>"
                        }
                    },
                    {
                        "mData": "applicant_rank",
                        "mRender": function (data, type, full, row) {

                            return "<span class='text-center btn-block'>" + data + "</span>"
                        }
                    },
                    {
                        "mData": "app_status",
                        "bSortable": false,
                        "mRender": function (data, type, full, row) {
                            return '<center><div class="btn-group">' +
                                '<button  type="button" class="btn btn-danger btn-sm action chkbox" ng-click="remove_comparative(' + row["row"] + ')" ' + HSAD(full["hasSelected_approved"]) + '><i class="fa fa-times"></i></button >' +
                                '<button  type="button" class="btn btn-info btn-sm action chkbox" ng-click="approved_comparative(' + row["row"] + ')" ' + HSAD(full["hasSelected_approved"]) + '><i class="fa ' + changefa(data) + '"></i></button >' +
                                '<div class="btn-group">' +
                                '<button class="btn btn-warning btn-sm action chkbox dropdown-toggle" type="button" data-toggle="dropdown" data-placement="top" title="Click for more action"><i class="fa fa-paper-plane"></i></button>' +
                                '<ul class="dropdown-menu ">' +
                                '<li><a ng-click="sendEmailNotification(' + row["row"] + ',7)">Congratulatory Email</a></li>' +
                                '<li><a ng-click="sendEmailNotification(' + row["row"] + ',4)">Regret Email</a></li>' +
                                '</ul>' +
                                '</div>' +
                                //'<div class="btn-group">' +
                                //'<button class="btn btn-success btn-sm action chkbox dropdown-toggle" type="button" data-toggle="dropdown" data-placement="top" title="Click for more action"><i class="fa fa-info"></i></button>' +
                                //'<ul class="dropdown-menu ">' +
                                //'<li><a ng-click="setEndorseDate(' + row["row"] + ',7)">Set Endorse Date</a></li>' +
                               
                                //'</ul>' +
                                //'</div>' +
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



    var Init_PSB_item_Grid = function (par_data) {
        s.item_grid_List = par_data;
        s.item_Table = $('#Data_item_Grid').dataTable(
            {
                data: s.item_grid_List,
                sDom: 'rt<"bottom"p>',
                pageLength: 10,
                //order: [[6, 'asc']],
                columns: [
                    {
                        "mData": "psb_ctrl_nbr",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-left btn-block'>" + data + " - " + full["psb_date"] + "</span>"
                        }
                    },

                    {
                        "mData": "item_no",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-left btn-block'><strong>" + data + " - " + full["position_long_title"] + "</strong></span>" +
                                "<span class='text-left btn-block'>" + full["department_name1"] + "</span>"
                        }
                    },
                    {
                        "mData": "endorsement_date",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-center btn-block'><strong>" + data + "</strong></span>" 
                        }
                    },

                    {
                        "mData": "psb_status",
                        "bSortable": false,
                        "mRender": function (data, type, full, row) {
                            return '<div>' +
                                '<button style="margin-top:3px;"  type="button" class="btn btn-default text-info" ng-click="comparative_item_applicant(' + row["row"] + ')">VIEW LIST</button>' +
                                '<div class="btn-group">' +
                                '<button class="btn btn-default text-warning dropdown-toggle" type="button" data-toggle="dropdown" data-placement="top" title="Click for more action">PRINT...</button>' +
                                '<ul class="dropdown-menu ">' +
                                '<li><a ng-click="printComparative(' + row["row"] + ',3)">Print Comparative</a></li>' +
                                '<li><a ng-click="prepareEndorsement(' + row["row"] + ',4)">Prepare Endorsement</a></li>' +
                                '</ul>' +
                                '</div>' +


                                '</div>';
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

    Init_PSB_List_Grid([])
    Array.prototype.hasSelected = function () {
        var dt = this
        s.selected_approved = dt[0].hasSelected_approved
    }


    var Init_panel_list = function (par_data) {
        s.Panel_List = par_data;
        s.Panel_Table = $('#Panel_Grid').dataTable(
            {
                data: s.Panel_List,
                sDom: 'rt<"bottom"p>',
                pageLength: 10,
                columns: [
                    {
                        "mData": "psb_name",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-left btn-block'>" + data + "</span>"
                        }
                    },

                    {
                        "mData": "mbr_role_descr",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-left btn-block'>" + data + "</span>"
                        }
                    },
                    {
                        "mData": "knowledge",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-center btn-block'>" + data + "</span>"
                        }
                    },
                    {
                        "mData": "skills",
                        "mRender": function (data, type, full, row) {

                            return "<span class='text-center btn-block'>" + data + "</span>"
                        }
                    },
                    {
                        "mData": "attitude",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-center btn-block'>" + data + "</span>"
                        }
                    },
                    {
                        "mData": "cbi_total",
                        "mRender": function (data, type, full, row) {

                            return "<span class='text-center btn-block'>" + data + "</span>"
                        }
                    }

                ],
                "createdRow": function (row, data, index) {
                    //$(row).addClass("dt-row");
                    $compile(row)($scope);  //add this to compile the DOM
                },

            });

        $("div.toolbar").html('<b>Custom tool bar! Text/images etc.</b>');
    }



    var Init_item_list = function (par_data) {
        s.Item_List = par_data;
        s.Item_Table = $('#item_Grid').dataTable(
            {
                data: s.Item_List,
                sDom: 'rt<"bottom"p>',
                pageLength: 10,
                columns: [
                    {
                        "mData": "item_no",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-left btn-block'>" + data + "</span>"
                        }
                    },

                    {
                        "mData": "position_long_title",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-left btn-block'>" + data + "</span>"
                        }
                    },
                    {
                        "mData": "department_name",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-center btn-block'>" + data + "</span>"
                        }
                    },
                    {
                        "mData": null,
                        "bSortable": false,
                        "mRender": function (data, type, full, row) {

                            return '<center><div class="btn-group">' +
                                '<input  type="checkbox" id="chk_item' + row["row"] + '" ng-model="chk_item' + row["row"] + '" class="form-control" ng-click="select_item(' + row["row"] + ')" />' +
                                '</div></center>';
                        }
                    }

                ],
                "createdRow": function (row, data, index) {
                    //$(row).addClass("dt-row");
                    $compile(row)($scope);  //add this to compile the DOM
                },

            });

        $("div.toolbar").html('<b>Custom tool bar! Text/images etc.</b>');
    }

    function addvalue(id, value) {
        $("#" + id).val(value)
        s[id] = value
    }
    function pass(data) {
        if (parseInt(data) >= 4) {

            return true;
        }
        else {

            return false;
        }
    }
    function disable(data) {
        var retval = false
        if (data == "5") {

            retval = true;
        }
        else {

            retval = false;

        }
        return retval
    }




    function init() {

        $("#endorse_no").prop("disabled", true);
        $("#printComparative").prop("disabled", true);
        $("#reporttype").prop("disabled", true);
        $("#submitExec").prop("disabled", true)
        $("#submitExec").html("Submit")
        var d = new Date();
        var y = d.getFullYear().toString();
        var m = (d.getMonth() + 1).toString();
        s.yr = y
        s.mo = m > 9 ? m : '0' + m
        Init_panel_list([])
        Init_item_list([])
        Init_PSB_item_Grid([])
        h.post("../cComparativeAssessment/Initialize", { year: y, month: s.mo }).then(function (d) {
            if (d.data.icon == "success") {
                s.budget_year = d.data.budgetyears
                s.psbsched_item = d.data.psbsched_item
                s.psbsched = d.data.sched;
                s.psbschedule = d.data.psbschedule

                s.psb_ctrl_nbr = c.ifnull(d.data.psb_ctrl_nbr, "")
                s.item_no = c.ifnull(d.data.item_no, "")
                if (!cs.elEmpty(d.data.item_no)) {
                    $("#reporttype").prop("disabled", false);
                }

                s.Data_List = d.data.comparative.refreshTable("Data_List_Grid", "")
                if (d.data.comparative.length > 0) {
                    d.data.comparative.hasSelected()
                }

                s.included_list = s.Data_List;

                if (s.Data_List.length == 0) {
                    $("#submitExec").prop("disabled", true)
                }
                else {
                    $("#submitExec").prop("disabled", false)
                }

            } else {
                console.log(d.data.message)
            }
        })

        $(".wizbutton").click(function () {
            console.log("sdjlkas")
        })
    }

    init()



    s.sendEmailNotification = function (row_id, type) {

        var dt = s.Data_List[row_id]
        var swal_title = ""
        var swal_message = ""
        console.log(dt)

        if (dt.email == "" || dt.email == null) {
            swal("This applicant has not provided email address", { icon: "error" })
            return
        }


        if (type == "4") {
            if (dt.email_regret_dttm != "") {
                swal("You have already sent regret email for this applicant", { icon: "error" })
                return
            }
            swal_title = "Send Regret Email"
            swal_message= "Are you sure you want to send this applicant a regret email? Please double check you action."
        }

        if (type == "7") {
            if (dt.email_congratulatory_dttm != "") {
                swal("You have already sent Congratulatory email for this applicant", { icon: "error" })
                return
            }
            swal_title = "Send Congratulatory Email"
            swal_message = "Are you sure you want to send this applicant a congratulatory email? Please double check you action."
        }


       

        $(".emailbtncls" + row_id).removeClass('fa fa-paper-plane');
        $(".emailbtncls" + row_id).addClass("fa fa-spinner fa-spin");
        $("#emailbtn" + row_id).prop("disabled", true);

        swal({
            title: swal_title,
            text: swal_message,
            icon: "info",
            buttons: true,
            dangerMode: true,
        })
            .then(function (willDelete) {
                if (willDelete) {

                    h.post("../cComparativeAssessment/sendEmailNotification", {
                        dt: dt
                        , email_type: type
                    }).then(function (d) {

                        var se = d.data.se

                        s.Data_List[row_id].email_aknowldge_dttm = se.email_aknowldge_dttm
                        s.Data_List[row_id].email_aknowldge_regret_dttm = se.email_aknowldge_regret_dttm
                        s.Data_List[row_id].email_noti_exam_dttm = se.email_noti_exam_dttm
                        s.Data_List[row_id].email_regret_dttm = se.email_regret_dttm
                        s.Data_List[row_id].email_noti_hrmpsb_dttm = se.email_noti_hrmpsb_dttm
                        s.Data_List[row_id].email_notintop5_dttm = se.email_notintop5_dttm
                        s.Data_List[row_id].email_congratulatory_dttm = se.email_congratulatory_dttm
                        swal(d.data.message, { icon: d.data.icon })

                        $(".emailbtncls" + row_id).removeClass("fa fa-spinner fa-spin");
                        $(".emailbtncls" + row_id).addClass('fa fa-paper-plane');
                        $("#emailbtn" + row_id).prop("disabled", false);
                    })

                }

            });


    }


    s.rating_view = function (row_id) {

        var app_ctrl_nbr = s.Data_List[row_id].app_ctrl_nbr;

        s.individual = s.Data_List[row_id]

        s.profile = s.individual

        h.post("../cComparativeAssessment/getPSBComparativeRating", { app_ctrl_nbr: app_ctrl_nbr }).then(function (d) {
            if (d.data.icon == "success") {
                s.slideInnerText = d.data.sp_slide_rating
                s.Panel_List = d.data.sp_panel_list_rating.refreshTable("Panel_Grid", "");
            }
            else {
                console.log(d.data.message)
            }
        })
        $("#applicant_rating_detail").modal("show")
    }



    s.selectDate = function () {
        if (!cs.elEmpty(s.yr) && !cs.elEmpty(s.mo)) {
            s.getPSBList(s.mo, s.yr)
        }
    }

    s.getPSBList = function (month, year) {
        h.post("../cComparativeAssessment/getPSBSchedule", { month: month, year: year }).then(function (d) {
            if (d.data.icon == "success") {
                s.psbsched = d.data.sched;
            }
            else {
                console.log(d.data.message)
            }
        })
    }


    Array.prototype.dialKnobValue = function (form) {
        var data = this;
        for (var i = 0; i < data.length; i++) {

            $('#' + form + ' input.dial.m-r-sm.' + data[i].slide_id).trigger(
                'configure',
                {
                    "min": 0,
                    "max": data[i].sub_max_rate,
                    "cursor": false
                }
            );
            $('#' + form + ' input.dial.m-r-sm.' + data[i].slide_id).val(data[i].psb_pnl_rating).trigger('change');

        }
    }

    Array.prototype.formInnerText = function (obj) {
        var thisObject = obj
        var data = this[0];
        var i_key = Object.keys(obj)
        var f_key = Object.keys(data)
        var f_val = Object.keys(data).map(function (itm) { return data[itm]; });
        for (var i = 0; i < i_key.length; i++) {
            for (var f = 0; f < f_key.length; f++) {
                if (i_key[i] == f_key[f]) {
                    thisObject[i_key[i]] = f_val[f]
                }
            }
        }
        return thisObject
    }


    $('.dial').trigger('configure', {
        'change': function (v) {

        }
    });

    s.selectEmployment = function (val) {
        s.budgetcode = ""
        s.position_code = ""
        $("#Data_List_Grid").dataTable().fnClearTable();
        h.post("../cComparativeAssessment/getBudgetYear", { employment_type: val }).then(function (d) {
            if (d.data.icon == "success") {
                s.budget_year = d.data.budget_year

            }
            else {
                console.log(d.data.message)
            }

        })
    }

    s.selectBudgetCode = function (val) {
        s.position_code = ""
        $("#Data_List_Grid").dataTable().fnClearTable();
        h.post("../cComparativeAssessment/getPositions", { employment_type: s.employment_type, budget_code: val }).then(function (d) {
            if (d.data.icon == "success") {
                s.positions = d.data.positions
            }
            else {
                console.log(d.data.message)
            }

        })
    }

    s.commentNotEmpty = function (val) {
        if (cs.elEmpty(val)) {
            s.nocomment = true;
        }
        else {
            s.nocomment = false;

        }

    }

    s.submitToExec_comments = function () {
        s.nocomment = true;
        s.l1comment = ""
        var cnt = s.included_list.length

        if (cnt > 0) {
            $("#submittoexec_comments").modal("show");
        }
        else {
            swal("No data to submit!", { icon: "error" })
        }
    }

    s.selectEmploymentType = function (val) {

        s.budget_year = []
        s.psbschedule = []
        s.psbsched_item = []
        s.psb_status = false
        if (!cs.elEmpty(val)) {
            h.post("../cComparativeAssessment/sp_budgetyears_tbl_combolist1_RCT", { employment_type: val }).then(function (d) {
                if (d.data.icon == "success") {
                    s.budget_year = d.data.budgetyears
                }
            })
        }
    }

    s.selectBudgetCode = function (val) {
        s.psbschedule = []
        s.psbsched_item = []
        s.psb_status = false
        if (!cs.elEmpty(val)) {
            h.post("../cComparativeAssessment/sp_get_psbschedule_dropdown", { employment_type: s.employment_type, budget_code: val }).then(function (d) {
                if (d.data.icon == "success") {
                    s.psbschedule = d.data.psbschedule
                }
            })
        }
    }

    s.selectPSBSchedApplicant = function (val) {
        if (!cs.elEmpty(val)) {
            $("#reporttype").prop("disabled", false);
        }
        else {
            $("#reporttype").val("");
            $("#endorse_no").val("");
            $("#reporttype").prop("disabled", true);
            $("#endorse_no").prop("disabled", true);
            $("#printComparative").prop("disabled", true);
        }

        h.post("../cComparativeAssessment/set_Item_no", { item_no: val, psb_ctrl_nbr: s.psb_ctrl_nbr }).then(function (d) {
            if (d.data.icon == "success") {
                s.Data_List = d.data.comparative.refreshTable("Data_List_Grid", "")
                s.included_list = s.Data_List;
                if (s.Data_List.length == 0) {
                    $("#submitExec").prop("disabled", true)
                }
                else {
                    $("#submitExec").prop("disabled", false)
                }
                d.data.comparative.hasSelected()
            }
        })
    }

    //s.selectEmploymentType = function (val) {
    //    cs.loading("show")
    //    s.psb_status = 0
    //    s.budget_year = []
    //    s.psbschedule = []
    //    // s.psb_status = false
    //    if (!cs.elEmpty(val)) {
    //        h.post("../cHRMPSBScreening/sp_budgetyears_tbl_combolist1_RCT", {
    //            employment_type: val
    //            , budget_code: ""
    //            , psb_ctrl_nbr: ""
    //        }).then(function (d) {
    //            if (d.data.icon == "success") {
    //                s.budget_year = d.data.budgetyears
    //                cs.clearTable("Data_item_Grid")
    //            }

    //            cs.loading("hide")
    //        })
    //    }
    //    else {
    //        cs.loading("hide")
    //    }

    //}
    s.selectBudgetCode = function (val) {
        cs.loading("show")
        s.psb_status = 0
        s.psbschedule = []
        //s.psb_status = false;
        if (!cs.elEmpty(val)) {
            h.post("../cHRMPSBScreening/sp_get_psbschedule_dropdown", {
                employment_type: s.employment_type
                , budget_code: val
                , psb_ctrl_nbr: ""
            }).then(function (d) {
                if (d.data.icon == "success") {
                    s.psbschedule = d.data.psbschedule
                    cs.clearTable("Data_item_Grid")
                }
                cs.loading("hide")
            })
        }
        else {
            cs.loading("hide")
        }

    }
    s.selectPsb_date = function (val) {
        s.psbsched_item = []
        if (!cs.elEmpty(val)) {
            cs.loading("show")
            h.post("../cComparativeAssessment/sp_psb_item_list",
                {
                    psb_ctrl_nbr: val,
                }).then(function (d) {
                    if (d.data.icon == "success") {
                        s.sp_psb_item_list = d.data.sp_psb_item_list
                        s.item_grid_List = d.data.sp_psb_item_list.refreshTable("Data_item_Grid", "")
                        cs.loading("hide")
                    } else {
                        console.log(d.data.message)
                        cs.loading("hide")
                    }
                })
        }
    }

    function changeBtnLabel() {
        var dt = s.included_list.filter(function (d) {
            return d.item_isadded == true
        })
    }

    Array.prototype.getCheckItem = function () {

        var data = this
        var dl = data.length
        for (var x = 0; x < dl; x++) {
            if ($("#pass" + x)[0].checked == true) {
                data[x].item_isadded = true
            }
            else {
                data[x].item_isadded = false
            }
        }
        return data
    }

    s.submitToExec = function (id) {
        var warning = ""


        var dt = s.Data_List.getCheckItem();
        if (dt.length == 0) {
            swal("No data to submit", { icon: "error" })
            return
        }
        h.post("../cComparativeAssessment/SubmitToExec", {
            data: dt
            , psb_ctrl_nbr: s.psb_ctrl_nbr
            , item_no: s.item_no
        }).then(function (d) {
            if (d.data.icon == "success") {
                s.Data_List = d.data.comparative.refreshTable("Data_List_Grid", "")
                d.data.comparative.hasSelected()
                swal(d.data.message, { icon: d.data.icon })
            }
        })
    }

    s.pass_check_box = function (row) {
        cs.spinnerAdd("pass" + row, "checkmark")
        var chk = $("#pass" + row)[0].checked

        if (chk) {
            s.included_list[row].item_isadded = true
        }
        else {
            s.included_list[row].item_isadded = false
        }

        setTimeout(function () {
            cs.spinnerRemove("pass" + row, "checkmark")

        }, 100);

    }



    s.printComparative = function (row, reptype) {
        var dt = s.item_grid_List[row]

        if (dt.screen_item < 1) {
            swal("Warning!", "No data for this item!", { icon: "warning" })
            return
        }

        var reporttype = "3"

        s.employee_name_print = 'COMPARATIVE ASSESSMENT REPORT';
        var item_no = dt.item_no.toString()
        var psb_ctrl_nbr = s.psb_ctrl_nbr
        var ReportName = "cryComparative";
        var SaveName = "Crystal_Report";
        var ReportType = "inline";
        var ReportPath = "~/Reports/cryComparative/";
        var sp = "";

        ReportPath = ReportPath + "" + ReportName + ".rpt";
        sp = "sp_comaparative_asessment_rpt,p_item_no," + item_no + ",p_psb_ctrl_nbr," + psb_ctrl_nbr + ",p_app_status," + reporttype;

        cs.loading('show')
        var iframe = document.getElementById('iframe_print_preview');
        var iframe_page = $("#iframe_print_preview")[0];
        iframe.style.visibility = "hidden";
        s.embed_link = "../Reports/CrystalViewer.aspx?Params=" + ""
            + "&ReportName=" + ReportName
            + "&SaveName=" + SaveName
            + "&ReportType=" + ReportType
            + "&ReportPath=" + ReportPath
            + "&id=" + sp //+ parameters

        if (!/*@cc_on!@*/0) { //if not IE
            iframe.onload = function () {
                iframe.style.visibility = "visible";
                cs.loading('hide')
            };
        }
        else if (iframe_page.innerHTML()) {
            var ifTitle = iframe_page.contentDocument.title;
            if (ifTitle.indexOf("404") >= 0) {
                swal("You cannot Preview this Report", "There something wrong!", { icon: "warning" });
                iframe.src = "";
            }
            else if (ifTitle != "") {
                swal("You cannot Preview this Report", "There something wrong!", { icon: "warning" });
                iframe.src = "";
            }
        }
        else {
            iframe.onreadystatechange = function () {
                if (iframe.readyState == "complete") {
                    iframe.style.visibility = "visible";
                    //$("#modal_loading").modal("hide")
                    cs.loading('hide')
                }
            };
        }
        iframe.src = s.embed_link;
        $('#modal_print_preview').modal({ backdrop: 'static', keyboard: false });
    }

    //budget_code: "2023-2"
    //department_code: "02"
    //department_name1: "PROVINCIAL ADMINISTRATOR'S OFFICE"
    //employment_type: "RE"
    //endorse_item: 1
    //item_no: "0081"
    //position_code: "1098"
    //position_long_title: "Community Affairs Officer IV"
    //position_short_title: "CAO IV"
    //psb_ctrl_nbr: "23-014"
    //psb_date: "2023-07-26"
    //psb_status: 3
    //screen_item: 5


    s.printEndorsement = function () {

        if (!cs.validatesubmit("endorseForm")) {
            return
        }

        var endorse_date = $("#endorse_dt").val()
        var endorse_by = $("#endorse_by").val()

        var reporttype = "4"

        s.employee_name_print = 'ENDORSEMENT REPORT';
        var item_no = s.endorse_item_no
        var psb_ctrl_nbr = s.endorse_psb_ctrl_nbr
        var endorse_no = "";
        var ReportName = "cryEndorsement";
        var SaveName = "Crystal_Report";
        var ReportType = "inline";
        var ReportPath = "~/Reports/cryEndorsement/";

        var sp = "";

        ReportPath = ReportPath + "" + ReportName + ".rpt";
        sp = "sp_endorsement_list_rpt,p_item_no," + item_no + ",p_psb_ctrl_nbr," + psb_ctrl_nbr + ",p_app_status," + reporttype + ",p_endorse_no," + endorse_no;

        cs.loading('show')

        h.post("../cComparativeAssessment/printEndorsement", {
              psb_ctrl_nbr : s.endorse_psb_ctrl_nbr
            , item_no : s.endorse_item_no
            , endorse_date : endorse_date
            , endorse_by : endorse_by
        }).then(function (d) {

            if (d.data.icon == "success") {
                var iframe = document.getElementById('iframe_print_preview');

                var iframe_page = $("#iframe_print_preview")[0];

                iframe.style.visibility = "hidden";

                s.embed_link = "../Reports/CrystalViewer.aspx?Params=" + ""
                    + "&ReportName=" + ReportName
                    + "&SaveName=" + SaveName
                    + "&ReportType=" + ReportType
                    + "&ReportPath=" + ReportPath
                    + "&id=" + sp //+ parameters
                console.log(s.embed_link)
                if (!/*@cc_on!@*/0) { //if not IE
                    iframe.onload = function () {
                        iframe.style.visibility = "visible";
                        cs.loading('hide')
                    };
                }
                else if (iframe_page.innerHTML()) {
                    var ifTitle = iframe_page.contentDocument.title;
                    if (ifTitle.indexOf("404") >= 0) {
                        swal("You cannot Preview this Report", "There something wrong!", { icon: "warning" });
                        iframe.src = "";
                    }
                    else if (ifTitle != "") {
                        swal("You cannot Preview this Report", "There something wrong!", { icon: "warning" });
                        iframe.src = "";
                    }
                }
                else {
                    iframe.onreadystatechange = function () {
                        if (iframe.readyState == "complete") {
                            iframe.style.visibility = "visible";
                            //$("#modal_loading").modal("hide")
                            cs.loading('hide')
                        }
                    };
                }

                iframe.src = s.embed_link;
                $('#modal_print_preview').modal({ backdrop: 'static', keyboard: false });

                s.item_grid_List[s.selectedRow].endorsement_date = endorse_date
                s.item_grid_List.refreshTable("Data_item_Grid", "")
            }
            else {
                swal(d.data.endorse.db_message, { icon: d.data.icon })
            }
         })
        



    }

    s.prepareEndorsement = function (row, reptype) {
        cs.loading('show')
        s.selectedRow = row
        var dt = s.item_grid_List[row]

        if (dt.endorse_item < 1) {
            swal("Warning!", "No data for this item!", { icon: "warning" })
            return
        }

        s.endorse_position = dt.position_long_title
        s.endorse_item_no = dt.item_no
        s.endorse_department_name1 = dt.department_name1
        s.endorse_salary_grade = dt.salary_grade
        s.endorse_psb_ctrl_nbr = dt.psb_ctrl_nbr

        h.post("../cComparativeAssessment/prepareEndorsement", {
            psb_ctrl_nbr: dt.psb_ctrl_nbr
            , item_no: dt.item_no
        }).then(function (d) {
            if (d.data.icon == "success") {
                s.endorse_list = d.data.endorse
                $("#prepareEndorsement").modal("show")
            }
            else {
                swal(d.data.message, {icon:d.data.icon})
            }
            cs.loading('hide')
        })
    }

 


    s.selectReporttype = function(val)
    {
        if (!cs.elEmpty(val)) {
           
            $("#printComparative").prop("disabled", false);
        }
        else {
            $("#printComparative").prop("disabled", true);
        }


        if(val == "4")
        {
            $("#endorse_no").prop("disabled", false);
        }
        else
        {
            $("#endorse_no").prop("disabled", true);
        }
    }

    s.comparative_item_applicant = function (row) {
        var dt = s.item_grid_List[row]
        s.itemnumber = dt.item_no
        s.positionname = dt.position_long_title
        s.departmentname = dt.department_name1
        s.departmentname = dt.department_name1
        cs.loading("show")
        h.post("../cComparativeAssessment/comparative_item_applicant",
            {
                  psb_ctrl_nbr: dt.psb_ctrl_nbr
                , item_no: dt.item_no

            }).then(function (d) {
                if (d.data.icon == "success") {
                    s.Data_List = d.data.comparative.refreshTable("Data_List_Grid", "")
                    cs.loading("hide")
                    $("#comparative_item_applicant").modal("show")
                }
                else {
                    cs.loading("show")
                }
            });
    }
    Array.prototype.checkifapprove = function () {
        var dt = this
        for (var x = 0; x < dt.length; x++) {
           
            if (dt[x].app_status == "4") {
                return true
                
            }
        }
    }
    s.approved_comparative = function (row) {
        var dt = s.Data_List[row]
      
        //if (s.Data_List.checkifapprove()) {
        //    swal("No allowed", "There is already applicant selected for this item. You are only allowed to add 1 applicant per item", { icon: "warning" })
        //   return
        //}

        cs.loading("show")
        h.post("../cComparativeAssessment/approved_comparative",
            {
                  app_ctrl_nbr: dt.app_ctrl_nbr
                , approval_id: dt.approval_id
                , psb_ctrl_nbr: dt.psb_ctrl_nbr
                , item_no: dt.item_no
                , hasSelected_approved: dt.hasSelected_approved

            }).then(function (d) {
                if (d.data.icon == "success") {
                    swal("Successfully Added for Indorsement", { icon: "success", timer: 1500 })
                    s.Data_List[row].app_status = d.data.app_status
                    s.Data_List = s.Data_List.refreshTable("Data_List_Grid", "")
                    s.get_sp_psb_item_list(dt.psb_ctrl_nbr)
                    cs.loading("hide")
                }
                else {
                    cs.loading("hide")
                }
            });
        
       
      
    }
    s.remove_comparative = function (row) {
        var dt = s.Data_List[row]
        swal({
            title: "Remove Indorsement!",
            text: "Are you sure to remove indorsement for this applicant?",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then(function (willDelete) {
                if (willDelete) {
                    cs.loading("show")
                    h.post("../cComparativeAssessment/remove_comparative",
                        {
                            app_ctrl_nbr: dt.app_ctrl_nbr
                            , approval_id: dt.approval_id
                            , psb_ctrl_nbr: dt.psb_ctrl_nbr
                            , item_no: dt.item_no
                            , hasSelected_approved: dt.hasSelected_approved

                        }).then(function (d) {
                            if (d.data.icon == "success") {
                                swal("Successfully Remove Indorsement", { icon: "warning", timer: 1500 })
                                s.Data_List[row].app_status = d.data.app_status
                                s.Data_List = s.Data_List.refreshTable("Data_List_Grid", "")
                                s.get_sp_psb_item_list(dt.psb_ctrl_nbr)
                                cs.loading("hide")
                            }
                            else {
                                cs.loading("hide")
                            }
                        });
                }
               
         });
       
    }

    s.get_sp_psb_item_list = function (psb_ctrl_nbr) {
            h.post("../cComparativeAssessment/sp_psb_item_list",
                {
                    psb_ctrl_nbr: psb_ctrl_nbr,
                }).then(function (d) {
                    if (d.data.icon == "success") {
                        console.log()
                        s.sp_psb_item_list = d.data.sp_psb_item_list
                        s.item_grid_List = d.data.sp_psb_item_list.refreshTable("Data_item_Grid", psb_ctrl_nbr)
                       
                    } else {
                        console.log(d.data.message)
                      
                    }
                })
        
    }
    
})


