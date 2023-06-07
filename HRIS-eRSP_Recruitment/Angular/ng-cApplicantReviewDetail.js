


ng_eRSP_App.controller("cApplicantsReviewDetails_Ctrlr", function (commonScript, $scope, $http, $filter, $compile, $window) {
    var s = $scope
    var h = $http
    var cs = commonScript
    s.recieved = false
    s.header_title = "APPLICANT LIST"
    s.modal = 1
    s.rowLen = ""
    s.pageTitle = "Reviewer List"
    s.applicant_name = ""
    s.app_ctrl_nbr = ""
    s.info_ctrl_nbr = ""
    s.reviewer_list = []
    s.psb_schedule_list = []
    s.position_from_publication = []
    s.budget_year = []
    s.budget_code = ""
    s.profimge = ""
    s.item_no = ""
    s.appointment = ""
    s.psb_sched = ""
    s.appctrlnbr = ""
    s.psbctrlnbr = ""
    s.eduseqno = 0
    s.lndseqno = 0
    s.eligseqno = 0
    s.wexseqno = 0
    s.educ_rating = 0
    s.wexp_rating = 0
    s.lnd_rating = 0
    s.elig_rating = 0
    s.score_rendered = 0
    s.ipcr_rating = 0
    s.exam_type_descr = ""
    s.exam_date = ""

    s.main_edit = false
    s.dtl_edit = false
    s.showRemoveQS = false
    s.year = []
    s.att_dtl = []
    s.slideInnerText = []
    s.total_rating = []
    s.apprvr = {}
    s.um = {}
    s.experince2combine = []
    s.wexp_object = {}
    s.min_rate = 22
    s.max_rate = 25
    s.competencies_required = ""
    s.lndtotalhrs = 0
    s.educdetails = []
    s.eligdetails = []
    s.lnddetails = []
    s.wexpdetails = []
    s.empl_photo_img = ""
    s.profile = {
        applicant_name: ""
        , app_status: ""
        , position_long_title: ""
        , app_address: ""
        , birth_date: ""
        , employment_type_descr: ""
        , gender_descr: ""
        , budget_description: ""
        , civil_status_descr: ""
        , department_name: ""
        , qs_education: ""
        , qs_work_experience: ""
        , qs_training: ""
        , qs_eligibility: ""
        , education_rating: ""
        , experience_rating: ""
        , training_rating: ""
        , eligibility_rating: ""
        , exam_rating: ""
        , empl_photo_img: ""
        , mobile_number: ""
        , email_add: ""
        , qs_total_100perc: 0
        , qs_total_50perc: 0
        , exam_100perc: 0
        , cbi_100rating: 0
        , cbi_rating: 0
        , total_rating: 0
    }

    s.ed = {
        educ_type: ""
        , school_name: ""
        , basic_educ_deg: ""
        , period_from: ""
        , period_to: ""
        , highest_lvl_earned: ""
        , year_graduated: ""
        , schlr_acdmic_rcvd: ""
    }

    s.el = {
        cscsrvc_ra1080: ""
        , rating: ""
        , examination_date: ""
        , examination_place: ""
        , number: ""
        , validity_date: ""


    }

    s.wx = {
        workexp_from: ""
        , workexp_to: ""
        , position_title: ""
        , dept_agncy_offc_co: ""
        , monthly_salary: ""
        , salary_job_grade: ""
        , appt_status: ""
        , gov_srvc: ""
    }

    s.ld = {
        learn_devt_title: ""
        , learn_devt_from: ""
        , learn_devt_to: ""
        , no_of_hrs: ""
        , learn_devt_type: ""
        , conducted_by: ""
    }

    function SetValue(id, value, ng) {
        $("#" + id).val(value)
        if (ng != "") {
            s[ng][id] = value
        }
        else {
            s[id] = value
        }

    }

    Array.prototype.slideInnerText = function () {
        var thisObject = []
        thisObject = this.filter(function (d) {
            return d.rtg_ctrl_nbr > "003"
        })
        angular.forEach(thisObject, function (k, v) {
            k.color = s.slide_color[k]
        })
        return thisObject
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

    s.status = [{ id: 'NW', text: 'New Application' }, { id: 'DS', text: 'Disapproved' }, { id: 'PS', text: 'PSB Screening' }, { id: 'JH', text: 'JO Hiring' }, { id: 'FL', text: 'For Filing' }]
    s.review_status = [{ id: 'DS', text: 'Disapproved' }, { id: 'PS', text: 'PSB Screening' }, { id: 'JH', text: 'JO Hiring' }, { id: 'FL', text: 'For Filing' }]

    s.AT = [{ id: 'JO', text: 'Job Order' }, { id: 'RE', text: 'Permanent' }, { id: 'CE', text: 'CASUAL' }]
    s.alphabet_list = [
        { alpha_name: 'A' }, { alpha_name: 'B' }, { alpha_name: 'C' }, { alpha_name: 'D' }, { alpha_name: 'E' }, { alpha_name: 'F' },
        { alpha_name: 'G' }, { alpha_name: 'H' }, { alpha_name: 'I' }, { alpha_name: 'J' }, { alpha_name: 'K' }, { alpha_name: 'L' },
        { alpha_name: 'M' }, { alpha_name: 'N' }, { alpha_name: 'O' }, { alpha_name: 'P' }, { alpha_name: 'Q' }, { alpha_name: 'R' },
        { alpha_name: 'S' }, { alpha_name: 'T' }, { alpha_name: 'U' }, { alpha_name: 'V' }, { alpha_name: 'W' }, { alpha_name: 'X' },
        { alpha_name: 'Y' }, { alpha_name: 'Z' }
    ]
    s.svc = [{ id: false, text: 'No' }, { id: true, text: 'Yes' }]

    
    var Init_Applicant_Grid = function (par_data) {
        s.Applicant_grid_Data = par_data
        s.Applicant_grid_Table = $('#applicants_grid').dataTable(
            {
                data: s.Applicant_grid_Data,
                sDom: 'rt<"bottom"p>',
                pageLength: 6,
                columnDefs: [{

                    orderable: false
                }],
                columns: [
                    {
                        "mData": "applicant_name", "mRender": function (data, type, full, row) {
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
                        "mData": "education_rating",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-center btn-block'>" + data + "</span>"
                        }
                    },
                    {
                        "mData": "eligibility_rating",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-center btn-block'>" + data + "</span>"
                        }
                    },
                    {
                        "mData": "training_rating",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-center btn-block'>" + data + "</span>"
                        }
                    },
                    {
                        "mData": "experience_rating",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-center btn-block'>" + data + "</span>"
                        }
                    },
                    {
                        "mData": "qs_total_100perc",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-center btn-block'>" + data + "</span>"
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
                        "mData": "cbi_100rating",
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
                        "mData": null,
                        "bSortable": false,
                        "mRender": function (data, type, full, row) {
                            return '<center><div class="btn-group action-btn">' +
                                '<button type="button" ng-click="selectApp(' + row["row"] + ')" id="educ' + row["row"] + '" ng-model="educ' + row["row"] + '" class="btn btn-success btn-sm action" data-toggle="tooltip" data-placement="top" title="Select"><i class="fa fa-chevron-down"></i></button >' +

                                '</div></center>'
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

    var Init_Applicant_Details_Grid = function (par_data) {
        s.Applicant_Details_Data = par_data
        s.Applicant_Details_Table = $('#datalist_grid').dataTable(
            {
                data: s.Applicant_Details_Data,
                sDom: 'rt<"bottom"p>',
                pageLength: 6,
                columnDefs: [{

                    orderable: false
                }],
                columns: [
                    {
                        "mData": "seq_no", "mRender": function (data, type, full, row) {
                            return "<span class='text-left btn-block'>" + data + "</span>"
                        }
                    },
                    {

                        "mData": "education",
                        "mRender": function (data, type, full, row) {

                            return '<span style="width:90%;" class="text-left btn-block tabtxt pull-left">'
                                + full["education"] + '<br>'
                                + full["levelearned"] + '<br>'
                                + full["school_name"]
                                + '</span>'
                                + '<span style="width:10%;" class="pull-right"><button ng-hide="' + cs.elEmpty(data) + '"  type="button" class="btn btn-info btn-sm action" ng-click="show_details_action(' + row["row"] + ',1)" >  <i class="fa fa-edit"></i></button ></span>'
                        }
                    },
                    {
                        "mData": "experience",
                        "mRender": function (data, type, full, row) {
                            return '<span style="width:90%;" class="text-left btn-block tabtxt pull-left">'
                                + full["exp_position"] + '<br>'
                                + full["exp_period"] + '<br>'
                                + full["exp_office_employ"]
                                + '</span>' +
                                '<span style="width:10%;" class="pull-right"><button ng-hide="' + cs.elEmpty(full["seq_no"]) + '" type="button" class="btn btn-info btn-sm action" ng-click="show_details_action(' + row["row"] + ',3)" >  <i class="fa fa-edit"></i></button ></span>'
                            //'<span style="width:10%;" class="pull-right"><button ng-hide="' + cs.elEmpty(data) + '"  type="button" class="btn btn-info btn-sm action" ng-click="show_details_action(' + row["row"] + ',3)" >  <i class="fa fa-edit"></i></button ></span>'
                        }
                    },

                    {
                        "mData": "lnd_no_hours",
                        "mRender": function (data, type, full, row) {
                            return '<span style="width:90%;" class="text-center btn-block tabtxt pull-left">' + data + '</span>' +
                                '<span style="width:10%;" class="pull-right"><button ng-hide="' + cs.elEmpty(data) + '"  type="button" class="btn btn-info btn-sm action" ng-click="show_details_action(' + row["row"] + ',2)" >  <i class="fa fa-edit"></i></button ></span>'
                        }
                    },

                    {

                        "mData": "eligibility",
                        "mRender": function (data, type, full, row) {
                            return '<span style="width:90%;" class="text-left btn-block tabtxt pull-left">' + data + '</span>' +
                                '<span style="width:10%;" class="pull-right"><button ng-hide="' + cs.elEmpty(data) + '"  type="button" class="btn btn-info btn-sm action" ng-click="show_details_action(' + row["row"] + ',4)" >  <i class="fa fa-edit"></i></button ></span>'
                        }
                    },

                ],

                "createdRow": function (row, data, index) {
                    //$(row).addClass("dt-row");
                    $compile(row)($scope);  //add this to compile the DOM
                },

            });

        $("div.toolbar").html('<b>Custom tool bar! Text/images etc.</b>');
    }

    var Init_Educ_Grid = function (par_data) {
        s.Educ_Data = par_data;
        s.Educ_Table = $('#educ_grid').dataTable(
            {
                data: s.Educ_Data,
                sDom: 'rt<"bottom"p>',
                pageLength: 10,
                columns: [
                    {
                        "mData": "seq_no", "mRender": function (data, type, full, row) {
                            return "<span class='text-left btn-block'>" + data + "</span>"
                        }
                    },
                    {
                        "mData": "school_name", "mRender": function (data, type, full, row) {
                            return "<span class='text-left btn-block'>" + data + "</span>"
                        }
                    },
                    {
                        "mData": "basic_educ_deg",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-left btn-block'>" + data + "</span>"
                        }
                    },
                    {
                        "mData": "period",
                        "mRender": function (data, type, full, row) {

                            return "<span class='text-center btn-block'>" + data + "</span>"
                        }
                    },
                    {
                        "mData": "year_graduated",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-center btn-block'>" + data + "</span>"
                        }
                    },
                    {
                        "mData": "psb_selected",
                        "bSortable": false,
                        "mRender": function (data, type, full, row) {
                            //return '<label class="container no-padding">' +
                            //    //'<input type="checkbox" educ-checkbox="' + row["row"]+'" id="educ' + row["row"] + '" ng-model="educ' + row["row"] + '" ng-checked="' + data + '">' +
                            //    //'<span class="educ' + row["row"] + ' checkmark"></span>' +
                            //    '<button class="btn btn-warning btn-sm dim" type="button" data-toggle="tooltip" data-placement="top" title="Review Application" ng-click="appl_review(l)"><i class="fa fa-plus"></i></button>'+
                            //    '<button class="btn btn-success btn-sm dim" type="button" data-toggle="tooltip" data-placement="top" title="Rate Qualification Standards" ng-click="qs_btn_rate(l)"><i class="fa fa-star"></i></button>'+
                            //    //'<button type="button" class="btn btn-success btn-sm action" educ-checkbox="' + row["row"] +'" >  <i class="fa fa-eye"></i></button>' +
                            //    //'<button type="button" class="btn btn-info btn-sm action" ng-click="show_details_action(' + row["row"] + ',1)" >  <i class="fa fa-eye"></i></button>' +
                            //    '</label>'

                            return '<center><div class="btn-group action-btn">' +
                                '<button type="button" qs-addqs="' + row["row"] + ',1" id="educ' + row["row"] + '" ng-model="educ' + row["row"] + '" class="btn btn-success btn-sm action" data-toggle="tooltip" data-placement="top" title="Add Education Details" >  <i class="fa fa-plus"></i></button >' +
                                '<button type="button" show-detailsaction = "' + row["row"] + ',1"  class="btn btn-info btn-sm action" data-toggle="tooltip" data-placement="top" title="Open Info">  <i class="fa fa-eye"></i></button >' +
                                '</div></center>'
                        }
                    }
                ],
                "createdRow": function (row, data, index) {
                    $compile(row)($scope);  //add this to compile the DOM
                },
            });
        $("div.toolbar").html('<b>Custom tool bar! Text/images etc.</b>');
    }



    s.ld = {
        learn_devt_title: ""
        , learn_devt_from: ""
        , learn_devt_to: ""
        , no_of_hrs: ""
        , learn_devt_type: ""
        , conducted_by: ""
    }
    var Init_LnD_Grid = function (par_data) {
        s.LnD_Data = par_data;
        s.LnD_Table = $('#LnD_grid').dataTable(
            {
                data: s.LnD_Data,
                sDom: 'rt<"bottom"p>',
                pageLength: 10,
                columns: [
                    {
                        "mData": "seq_no", "mRender": function (data, type, full, row) {
                            return "<span class='text-left btn-block font-smr'>" + data + "</span>"
                        }
                    },
                    {
                        "mData": "learn_devt_title", "mRender": function (data, type, full, row) {
                            return "<span class='text-left btn-block font-smr'>" + data + "</span>"
                        }
                    },

                    {
                        "mData": "no_of_hrs",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-left btn-block font-smr'>" + data + "</span>"
                        }
                    },
                    {
                        "mData": "learn_devt_type",
                        "mRender": function (data, type, full, row) {

                            return "<span class='text-center btn-block font-smr'>" + data + "</span>"
                        }
                    },
                    {
                        "mData": "conducted_by",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-center btn-block font-smr'>" + cs.sector(data) + "</span>"
                        }
                    },
                    {
                        "mData": "psb_selected",
                        "bSortable": false,
                        "mRender": function (data, type, full, row) {
                            //return '<label class="container">' +
                            //    '<input type="checkbox" ng-click="lnd_check_box(' + row["row"] + ',' + data + ',lnd)" id="LnD' + row["row"] + '" ng-model="LnD' + row["row"] + '" ng-checked="' + data + '">' +
                            //    '<span class="LnD' + row["row"] + ' checkmark"></span>' +
                            //    '<button type="button" class="btn btn-info btn-sm action" ng-click="show_details_action(' + row["row"] + ',2)" >  <i class="fa fa-eye"></i></button ></span>' +
                            //    '</label>'

                            return '<center><div class="btn-group action-btn">' +
                                '<button type="button" qs-addqs="' + row["row"] + ',2" id="lnd' + row["row"] + '" ng-model="lnd' + row["row"] + '" class="btn btn-success btn-sm action" data-toggle="tooltip" data-placement="top" title="Add Training Details" >  <i class="fa fa-plus"></i></button >' +
                                '<button type="button" show-detailsaction = "' + row["row"] + ',2"  class="btn btn-info btn-sm action" data-toggle="tooltip" data-placement="top" title="Open Info">  <i class="fa fa-eye"></i></button >' +
                                '</div></center>'
                        }
                    }
                ],
                "createdRow": function (row, data, index) {
                    $compile(row)($scope);  //add this to compile the DOM
                },
            });
        $("div.toolbar").html('<b>Custom tool bar! Text/images etc.</b>');
    }

    var Init_LnD_included_Grid = function (par_data) {
        s.LnD_included_Data = par_data;
        s.LnD_included_Table = $('#lnd_included_grid').dataTable(
            {
                data: s.LnD_Data,
                sDom: 'rt<"bottom"p>',
                pageLength: 10,
                columns: [
                    {
                        "mData": "seq_no", "mRender": function (data, type, full, row) {
                            return "<span class='text-left btn-block font-smr'>" + data + "</span>"
                        }
                    },
                    {
                        "mData": "learn_devt_title", "mRender": function (data, type, full, row) {
                            return "<span class='text-left btn-block font-smr'>" + data + "</span>"
                        }
                    },

                    {
                        "mData": "no_of_hrs",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-center btn-block font-smr'>" + data + "</span>"
                        }
                    },
                    {
                        "mData": "learn_devt_type",
                        "mRender": function (data, type, full, row) {

                            return "<span class='text-center btn-block font-smr'>" + data + "</span>"
                        }
                    },
                    {
                        "mData": "conducted_by",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-center btn-block font-smr'>" + cs.sector(data) + "</span>"
                        }
                    },
                    {
                        "mData": "psb_selected",
                        "bSortable": false,
                        "mRender": function (data, type, full, row) {
                            //return '<label class="container">' +
                            //    '<input type="checkbox" ng-click="lnd_check_box(' + row["row"] + ',' + data + ',lnd)" id="LnD' + row["row"] + '" ng-model="LnD' + row["row"] + '" ng-checked="' + data + '">' +
                            //    '<span class="LnD' + row["row"] + ' checkmark"></span>' +
                            //    '<button type="button" class="btn btn-info btn-sm action" ng-click="show_details_action(' + row["row"] + ',2)" >  <i class="fa fa-eye"></i></button ></span>' +
                            //    '</label>'

                            return '<center><div class="btn-group action-btn">' +
                                '<button type="button" qs-removerelevantlnd="' + row["row"] + ',' + full["seq_no"] + '" id="lnd' + row["row"] + '" ng-model="lnd' + row["row"] + '" class="btn btn-danger btn-sm action" data-toggle="tooltip" data-placement="top" title="Remove Relevant Trainings" >  <i class="fa fa-times"></i></button >' +
                                '</div></center>'
                        }
                    }
                ],
                "createdRow": function (row, data, index) {
                    $compile(row)($scope);  //add this to compile the DOM
                },
            });
        $("div.toolbar").html('<b>Custom tool bar! Text/images etc.</b>');
    }

    s.salgrade = []
    s.wx = {
        workexp_from: ""
        , workexp_to: ""
        , position_title: ""
        , dept_agncy_offc_co: ""
        , monthly_salary: ""
        , salary_job_grade: ""
        , appt_status: ""
        , gov_srvc: ""
    }

    var Init_wexp_Grid = function (par_data) {
        s.Wexp_Data = par_data;
        s.Wexp_Table = $('#wexp_grid').dataTable(
            {
                data: s.Wexp_Data,
                sDom: 'rt<"bottom"p>',
                pageLength: 10,
                columns: [
                    {
                        "mData": "seq_no", "mRender": function (data, type, full, row) {
                            return "<span class='text-left btn-block'>" + data + "</span>"
                        }
                    },
                    {
                        "mData": "dept_agncy_offc_co", "mRender": function (data, type, full, row) {
                            return "<span class='text-left btn-block'>" + data + "</span>"
                        }
                    },

                    {
                        "mData": "position_title",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-left btn-block'>" + data + "</span>"
                        }
                    },
                    {
                        "mData": "period",
                        "mRender": function (data, type, full, row) {

                            return "<span class='text-center btn-block'>" + data + "</span>"
                        }
                    },
                    {
                        "mData": "gov_srvc",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-center btn-block'>" + cs.sector(data) + "</span>"
                        }
                    },
                    {
                        "mData": "psb_selected",
                        "bSortable": false,
                        "mRender": function (data, type, full, row) {
                            //return '<label class="container">' +
                            //    '<input type="checkbox" ng-click="exp_check_box(' + row["row"] + ',' + data + ',exp)" id="wexp' + row["row"] + '" ng-model="wexp' + row["row"] + '" ng-checked="' + data + '">' +
                            //    '<span class="wexp' + row["row"] + ' checkmark"></span>' +
                            //    '<button type="button" class="btn btn-info btn-sm action" ng-click="show_details_action(' + row["row"] + ',3)" >  <i class="fa fa-eye"></i></button >' +
                            //    '<button type="button" class="btn btn-warning btn-sm action combine_btn" style="display: inline-block !important;" ng-click="show_combine_action(' + row["row"] + ',3)" >  <i class="fa fa-plus"></i></button >' +
                            //    '</label>'

                            return '<center><div class="btn-group action-btn">' +
                                '<button type="button" qs-addqs="' + row["row"] + ',3" id="wexp' + row["row"] + '" ng-model="wexp' + row["row"] + '" class="btn btn-success btn-sm action" data-toggle="tooltip" data-placement="top" title="Add Work Experience Details" >  <i class="fa fa-plus"></i></button >' +
                                '<button type="button" show-detailsaction = "' + row["row"] + ',3"  class="btn btn-info btn-sm action" data-toggle="tooltip" data-placement="top" title="Open Info">  <i class="fa fa-eye"></i></button >' +
                                '<button type="button" ng-click="show_combine_action(' + row["row"] + ',3)" style="display: inline-block !important;"  class="btn btn-warning btn-sm action combine_btn">  <i class="fa fa-cogs"></i></button >' +
                                '</div></center>'
                        }
                    }
                ],
                "createdRow": function (row, data, index) {
                    $compile(row)($scope);  //add this to compile the DOM
                },
            });
        $("div.toolbar").html('<b>Custom tool bar! Text/images etc.</b>');
    }

    s.nodata = function (data) {
        if (data > 0) {
            return true
        }
        else {
            return false
        }
    }


    var Init_combine_wexp_Grid = function (par_data) {
        s.Combine_Wexp_Data = par_data;
        s.Combine_Wexp_Table = $('#combine_wexp_grid').dataTable(
            {
                data: s.Combine_Wexp_Data,
                sDom: 'rt<"bottom"p>',
                pageLength: 10,
                columns: [
                    //{
                    //    "mData": "seq_no", "mRender": function (data, type, full, row) {
                    //        return "<span class='text-left btn-block'>" + data + "</span>"
                    //    }
                    //},
                    {
                        "mData": "dept_agncy_offc_co", "mRender": function (data, type, full, row) {
                            return "<span class='text-left btn-block'>" + data + "</span>"
                        }
                    },

                    {
                        "mData": "position_title",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-left btn-block'>" + data + "</span>"
                        }
                    },
                    {
                        "mData": "period",
                        "mRender": function (data, type, full, row) {

                            return "<span class='text-center btn-block'>" + data + "</span>"
                        }
                    },
                    {
                        "mData": "gov_srvc",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-center btn-block'>" + cs.sector(data) + "</span>"
                        }
                    },
                    {
                        "mData": null,
                        "bSortable": false,
                        "mRender": function (data, type, full, row) {
                            return '<label class="container">' +
                                '<input type="checkbox" ng-click="combine_check_box(' + row["row"] + ')" id="combine_wexp' + row["row"] + '" ng-model="combine_wexp' + row["row"] + '" ng-checked="false">' +
                                '<span class="combine_wexp' + row["row"] + ' checkmark"></span>' +
                                '</label>'

                        }
                    }
                ],
                "createdRow": function (row, data, index) {
                    $compile(row)($scope);  //add this to compile the DOM
                },
            });
        $("div.toolbar").html('<b>Custom tool bar! Text/images etc.</b>');
    }

    s.el = {
        cscsrvc_ra1080: ""
        , rating: ""
        , examination_date: ""
        , examination_place: ""
        , number: ""
        , validity_date: ""
    }

    var Init_Elig_Grid = function (par_data) {
        s.Elig_Data = par_data;
        s.Elig_Table = $('#elig_grid').dataTable(
            {
                data: s.Elig_Data,
                sDom: 'rt<"bottom"p>',
                pageLength: 10,
                columns: [
                    {
                        "mData": "seq_no", "mRender": function (data, type, full, row) {
                            return "<span class='text-left btn-block'>" + data + "</span>"
                        }
                    },
                    {
                        "mData": "cscsrvc_ra1080", "mRender": function (data, type, full, row) {
                            return "<span class='text-left btn-block'>" + data + "</span>"
                        }
                    },

                    {
                        "mData": "rating",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-left btn-block'>" + data + "</span>"
                        }
                    },
                    {
                        "mData": "number",
                        "mRender": function (data, type, full, row) {

                            return "<span class='text-center btn-block'>" + data + "</span>"
                        }
                    },
                    {
                        "mData": "number",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-center btn-block'>" + cs.sector(data) + "</span>"
                        }
                    },
                    {
                        "mData": "psb_selected",
                        "bSortable": false,
                        "mRender": function (data, type, full, row) {
                            //return '<label class="container">' +
                            //    '<input type="checkbox" ng-click="elig_check_box(' + row["row"] + ',' + data + ',elig)" id="elig' + row["row"] + '" ng-model="elig' + row["row"] + '" ng-checked="' + data + '">' +
                            //    '<span class="elig' + row["row"] + ' checkmark"></span>' +
                            //    '<button type="button" class="btn btn-info btn-sm action" ng-click="show_details_action(' + row["row"] + ',4)" >  <i class="fa fa-eye"></i></button ></span>' +
                            //    '</label>'

                            return '<center><div class="btn-group action-btn">' +
                                '<button type="button" qs-addqs="' + row["row"] + ',4" id="elig' + row["row"] + '" ng-model="elig' + row["row"] + '" class="btn btn-success btn-sm action" data-toggle="tooltip" data-placement="top" title="Add Eligibility Details" >  <i class="fa fa-plus"></i></button >' +
                                '<button type="button" show-detailsaction = "' + row["row"] + ',4"  class="btn btn-info btn-sm action" data-toggle="tooltip" data-placement="top" title="Open Info">  <i class="fa fa-eye"></i></button >' +
                                '</div></center>'
                        }
                    }
                ],
                "createdRow": function (row, data, index) {
                    $compile(row)($scope);  //add this to compile the DOM
                },
            });
        $("div.toolbar").html('<b>Custom tool bar! Text/images etc.</b>');
    }


    s.ddl_educ_type = []

    s.ed = {
        educ_type: ""
        , school_name: ""
        , basic_educ_deg: ""
        , period_from: ""
        , period_to: ""
        , highest_lvl_earned: ""
        , year_graduated: ""
        , schlr_acdmic_rcvd: ""
    }

    var Init_Education_List_Grid = function (par_data) {
        s.Education_List_Data = par_data;
        s.Education_List_Table = $('#appl_edu_grid').dataTable(
            {
                data: s.Education_List_Data,
                sDom: 'rt<"bottom"p>',
                pageLength: 10,
                columns: [
                    {
                        "mData": "school_name",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-left btn-block'>" + data + "</span>"
                        }
                    },

                    {
                        "mData": "basic_educ_deg",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-left btn-block'>" + data + "</span>"
                        }
                    },
                    {
                        "mData": "period_from",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-center btn-block'>" + data + "</span>"
                        }
                    },
                    {
                        "mData": "period_to",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-center btn-block'>" + data + "</span>"
                        }
                    },
                    {
                        "mData": "year_graduated",
                        "mRender": function (data, type, full, row) {

                            return "<span class='text-center btn-block'>" + data + "</span>"
                        }
                    },
                    {
                        "mData": null,
                        "bSortable": false,
                        "mRender": function (data, type, full, row) {

                            return '<center><div class="btn-group">' +
                                '<button  type="button" class="btn btn-info btn-sm action" ng-click="educ_edit_action(' + row["row"] + ')" >  <i class="fa fa-edit"></i></button >' +
                                '<button  type="button" class="btn btn-danger btn-sm action" ng-click="educ_del_row(' + row["row"] + ')">   <i id="educ_del_row' + row["row"] + '" class="fa fa-trash"></i></button>' +
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




    s.el = {
        cscsrvc_ra1080: ""
        , rating: ""
        , examination_date: ""
        , examination_place: ""
        , number: ""
        , validity_date: ""
    }

    var Init_Eligibility_List_Grid = function (par_data) {
        s.Eligibility_List_Data = par_data;
        s.Eligibility_List_Table = $('#appl_elegib_grid').dataTable(
            {
                data: s.Eligibility_List_Data,
                sDom: 'rt<"bottom"p>',
                pageLength: 10,
                columns: [
                    {
                        "mData": "number",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-center btn-block'>" + data + "</span>"
                        }
                    },
                    {
                        "mData": "cscsrvc_ra1080",
                        "mRender": function (data, type, full, row) { return "<span class='text-center btn-block'>" + data + "</span>" }
                    },

                    {
                        "mData": "rating",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-left btn-block'>" + data + "</span>"
                        }
                    },

                    {
                        "mData": "validity_date",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-center btn-block'>" + data + "</span>"
                        }
                    },
                    {
                        "mData": null,
                        "bSortable": false,
                        "mRender": function (data, type, full, row) {

                            return '<center><div class="btn-group">' +
                                '<button  type="button" class="btn btn-info btn-sm action" ng-click="elig_edit_action(' + row["row"] + ')" >  <i class="fa fa-edit"></i></button >' +
                                '<button  type="button" class="btn btn-danger btn-sm action" ng-click="elig_del_row(' + row["row"] + ')">   <i id="elig_del_row' + row["row"] + '" class="fa fa-trash"></i></button>' +
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

    s.salgrade = []
    s.wx = {
        workexp_from: ""
        , workexp_to: ""
        , position_title: ""
        , dept_agncy_offc_co: ""
        , monthly_salary: ""
        , salary_job_grade: ""
        , appt_status: ""
        , gov_srvc: ""
    }
    var Init_Workexp_List_Grid = function (par_data) {
        s.Workexp_List_Data = par_data;
        s.Workexp_List_Table = $('#appl_workexp_grid').dataTable(
            {
                data: s.Workexp_List_Data,
                sDom: 'rt<"bottom"p>',
                pageLength: 10,
                columns: [
                    {
                        "mData": "workexp_from",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-center btn-block'>" + data + "</span>"
                        }
                    },

                    {
                        "mData": "workexp_to",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-center btn-block'>" + data + "</span>"
                        }
                    },
                    {
                        "mData": "position_title",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-center btn-block'>" + data + "</span>"
                        }
                    },
                    {
                        "mData": "dept_agncy_offc_co",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-center btn-block'>" + data + "</span>"
                        }
                    },
                    {
                        "mData": "gov_srvc",
                        "mRender": function (data, type, full, row) {

                            return "<span class='text-left btn-block'>" + serv(data) + "</span>"
                        }
                    },
                    {
                        "mData": null,
                        "bSortable": false,
                        "mRender": function (data, type, full, row) {

                            return '<center><div class="btn-group">' +
                                '<button  type="button" class="btn btn-info btn-sm action" ng-click="exp_edit_action(' + row["row"] + ')" >  <i class="fa fa-edit"></i></button >' +
                                '<button  type="button" class="btn btn-danger btn-sm action" ng-click="exp_del_row(' + row["row"] + ')">   <i id="exp_del_row' + row["row"] + '" class="fa fa-trash"></i></button>' +
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


    s.ld = {
        learn_devt_title: ""
        , learn_devt_from: ""
        , learn_devt_to: ""
        , no_of_hrs: ""
        , learn_devt_type: ""
        , conducted_by: ""
    }

    var Init_LnD_List_Grid = function (par_data) {
        s.LnD_List_Data = par_data;
        s.LnD_List_Table = $('#appl_lnd_grid').dataTable(
            {
                data: s.LnD_List_Data,
                sDom: 'rt<"bottom"p>',
                pageLength: 10,
                columns: [
                    {
                        "mData": "learn_devt_title",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-left btn-block'>" + data + "</span>"
                        }
                    },
                    {
                        "mData": "learn_devt_from",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-left btn-block'>" + data + "</span>"
                        }
                    },
                    {
                        "mData": "learn_devt_to",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-center btn-block'>" + data + "</span>"
                        }
                    },
                    {
                        "mData": "no_of_hrs",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-center btn-block'>" + data + "</span>"
                        }
                    },
                    {
                        "mData": "learn_devt_type",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-center btn-block'>" + data + "</span>"
                        }
                    },
                    {
                        "mData": "conducted_by",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-center btn-block'>" + data + "</span>"
                        }
                    },
                    {
                        "mData": null,
                        "bSortable": false,
                        "mRender": function (data, type, full, row) {

                            return '<center><div class="btn-group">' +
                                '<button  type="button" class="btn btn-info btn-sm action" ng-click="lnd_edit_action(' + row["row"] + ')" >  <i class="fa fa-edit"></i></button >' +
                                '<button  type="button" class="btn btn-danger btn-sm action" ng-click="lnd_del_row(' + row["row"] + ')">   <i id="lnd_del_row' + row["row"] + '" class="fa fa-trash"></i></button>' +
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

    s.boolean = function (val1, val2) {
        if (val1 == val2) {
            return true;
        }
        else {
            return false;
        }
    }

    s.profile_img;



    function init() {
        var app_ctrl_nbr = "";
        cs.loading("show")
        s.year = cs.RetrieveYear();
        s.rowLen = "10"
        h.post("../cApplicantReviewDetail/Initialize").then(function (d) {
            app_ctrl_nbr = d.data.app_ctrl_nbr

            s.sp_reviewer_screening_list2()

            //if (app_ctrl_nbr == localStorage["app_ctrl_nbr"]) {
            //
            //    if (localStorage["reviewer_list"]) {
            //
            //        s.reviewer_list = JSON.parse(localStorage['reviewer_list'])
            //        s.profile = s.reviewer_list.formInnerText(s.profile);
            //        s.info_ctrl_nbr = localStorage["info_ctrl_nbr"]
            //        s.item_no = localStorage["item_no"]
            //        s.position_code = localStorage["position_code"]
            //        s.app_status = localStorage["app_status"]
            //        s.app_ctrl_nbr = localStorage["app_ctrl_nbr"]
            //       
            //        fn_callQSDetails();
            //    }
            //
            //
            //    if (localStorage["dtl_list"]) {
            //        s.Applicant_Details_Data = JSON.parse(localStorage['dtl_list']).refreshTable("datalist_grid", "")
            //    }
            //
            //
            //    if (localStorage["eductype"]) {
            //        s.ddl_educ_type = JSON.parse(localStorage['eductype'])
            //        s.salgrade = JSON.parse(localStorage['salgrade'])
            //    }
            //} else {
            //    s.getReviewer_List();
            //    s.getDtl_List();
            //    s.getDropdownList();
            //}


                s.getReviewer_List();
                s.getDtl_List();
                s.getDropdownList();
                fn_callQSDetails();
                Get_QSDetails_List()
                $(document).ready(cs.loading("hide"))

        })
       


    }

    s.selectApp = function (row) {
        cs.loading("show")
        var dt = s.Applicant_grid_Data[row]
        var app_ctrl_nbr = dt.app_ctrl_nbr
        h.post("../cApplicantReviewDetail/setAppCtrlNbr", {
            app_ctrl_nbr: app_ctrl_nbr
        }).then(function (d) {
            s.getReviewer_List();
            s.getDtl_List();
            s.getDropdownList();
          
            var top = document.getElementById("app_profile").offsetTop; //Getting Y of target element
            window.scrollTo(0, top);    
        })
    }

    s.GotoTop = function(){
        var top = document.getElementById("top").offsetTop; //Getting Y of target element
        window.scrollTo(0, top);   
    }

    

    s.getDropdownList = function () {
        h.post("../cApplicantReviewDetail/getDropdownList").then(function (d) {
            s.ddl_educ_type = d.data.eductype
            s.salgrade = d.data.salgrade
            //localStorage["eductype"] = JSON.stringify(d.data.eductype)
            //localStorage["salgrade"] = JSON.stringify(d.data.salgrade)
        })
    }
    function Get_QSDetails_List() {
        h.post("../cApplicantReviewDetail/getDtl_List").then(function (d) {
            s.Applicant_Details_Data = d.data.dtl_list.refreshTable("datalist_grid", "")
        })
    }
    s.getDtl_List = function () {
        Get_QSDetails_List()
    }
    s.sp_reviewer_screening_list2 = function () {
        h.post("../cApplicantReviewDetail/sp_reviewer_screening_list2").then(function (d) {
            if (d.data.icon == "success") {
                s.Applicant_grid_Data = d.data.sp_reviewer_screening_list2.refreshTable("applicants_grid","");
            }
            
        })
    }
    s.getReviewer_List = function () {
        h.post("../cApplicantReviewDetail/getReviewer_List").then(function (d) {
            s.reviewer_list = d.data.reviewer_list
            s.info_ctrl_nbr = d.data.reviewer_list[0].info_ctrl_nbr
            s.item_no = d.data.reviewer_list[0].item_no
            s.position_code = d.data.reviewer_list[0].position_code
            s.app_status = d.data.reviewer_list[0].app_status
            s.app_ctrl_nbr = d.data.reviewer_list[0].app_ctrl_nbr
            s.profile = d.data.reviewer_list.formInnerText(s.profile);
            $(document).ready(cs.loading("hide"))
            //localStorage["reviewer_list"] = JSON.stringify(d.data.reviewer_list)
            //localStorage["info_ctrl_nbr"] = d.data.reviewer_list[0].info_ctrl_nbr
            //localStorage["item_no"] = d.data.reviewer_list[0].item_no
            //localStorage["position_code"] = d.data.reviewer_list[0].position_code
            //localStorage["app_status"] = d.data.reviewer_list[0].app_status
            //localStorage["app_ctrl_nbr"] = d.data.reviewer_list[0].app_ctrl_nbr
            fn_callQSDetails();
        })
    }

    Init_Educ_Grid([]);
    Init_Elig_Grid([]);
    Init_LnD_Grid([]);
    Init_wexp_Grid([]);
    Init_combine_wexp_Grid([])
    Init_LnD_included_Grid([])
    Init_Applicant_Details_Grid([])
    Init_Education_List_Grid([])
    Init_Eligibility_List_Grid([])
    Init_Workexp_List_Grid([])
    Init_LnD_List_Grid([])
    Init_Applicant_Grid([])

    init()

    s.selectToEdit = function (val) {
       h.post("../cApplicantReviewDetail/SetHistoryPage",
       {
           //empl_id: s.Applicant_List_Data[row_index].empl_id,
           //username: s.Applicant_List_Data[row_index].user_id,
           //password: s.Applicant_List_Data[row_index].user_password,
           //account_type: s.Applicant_List_Data[row_index].user_mode
       }).then(function (d) {
           location.href = val + "/Index"
       });
    }

    s.show_details_action = function (row, dtl) {
        var dt = s.Applicant_Details_Data[row]
        var info_ctrl_nbr = dt.info_ctrl_nbr
        s.showRemoveQS = true
        if (dtl == 1) {
            cs.DisabledAllFields(s.ed)
            s.eduseqno = dt.educ_seq
          
            h.post("../cApplicantReviewDetail/showDetails", { info_ctrl_nbr: info_ctrl_nbr, seq_no: dt.educ_seq, detail: dtl }).then(function (d) {
                if (d.data.icon == "success") {
                    d.data.obj.populateFields(s.ed, 0)
                    $("#educ_dtl_modal").modal("show")
                }
                else {console.log(d.data.message)}
            })
        }
        else if (dtl == 2) {
            cs.DisabledAllFields(s.ld)
            s.lndseqno = dt.lnd_seq
            h.post("../cApplicantReviewDetail/RelevantTraining", { info_ctrl_nbr: info_ctrl_nbr}).then(function (d) {
                if (d.data.icon == "success") {
                    s.LnD_included_Data = d.data.relevant_lnd.refreshTable("lnd_included_grid", "")
                    //d.data.obj.populateFields(s.ld, 0)
                    $("#lnd_included").modal("show")
                }
                else { console.log(d.data.message) }
            })
        }
        else if (dtl == 3) {
            cs.DisabledAllFields(s.wx)
            s.wexseqno = dt.wexp_seq
            h.post("../cApplicantReviewDetail/showDetails", { info_ctrl_nbr: info_ctrl_nbr, seq_no: dt.wexp_seq, detail: dtl }).then(function (d) {
                if (d.data.icon == "success") {
                    var dt = d.data.obj[0]

                    if (dt.gov_srvc == true) {
                        s.wx.gov_srvc = "1"
                    }
                    else {
                        s.wx.gov_srvc = "0"
                    }
                    d.data.obj.populateFields(s.wx, 0)
                    $("#workexp_dtl_modal").modal("show")
                }
                else { console.log(d.data.message) }
            })
        }
        else if (dtl == 4) {
            cs.DisabledAllFields(s.el)
            s.eligseqno = dt.elig_seq
            h.post("../cApplicantReviewDetail/showDetails", { info_ctrl_nbr: info_ctrl_nbr, seq_no: dt.elig_seq, detail: dtl }).then(function (d) {
                if (d.data.icon == "success") {
                    d.data.obj.populateFields(s.el, 0)
                    $("#eligib_dtl_modal").modal("show")
                }
                else { console.log(d.data.message) }
            })
        }
    }

    s.selectPosition = function (val) {
        h.post("../cApplicantReviewDetail/setApplicantPosition", { app_ctrl_nbr: s.app_ctrl_nbr,position:val }).then(function (d) {

        })
    }

    s.selectPSBSchedule = function () {
        var dt = s.reviewer_list[0]
        var budgetcode = dt.budget_code
        var emoloymenttype = dt.appointment
        h.post("../cApplicantReviewDetail/GetPSBSchedule", { budget_code: budgetcode, employment_type: emoloymenttype }).then(function (d) {
            if (d.data.icon == "success") {
                s.psb_schedule_list = d.data.psb_schedule_list
                $("#selectPSBSchedule").modal("show")
            }else{
                console.log(d.data.message)
            }
        })
     
    }
    s.addToPSB = function () {
        if (!cs.Validate1Field("psb_sched"))
        {
           
            return
        }
        h.post("../cApplicantReviewDetail/AddToPSB", { app_ctrl_nbr: s.app_ctrl_nbr, psb_sched: s.psb_sched }).then(function (d) {
            if(d.data.icon == "success")
            {
                swal(d.data.message, { icon: d.data.icon })
                $("#selectPSBSchedule").modal("hide")
            }
            else
            {
                swal(d.data.message, { icon: d.data.icon })
            }
        })
    }
     
    s.removeToPSB = function () {
        swal({
            title: "Are you sure you to remove this applicants from psb screening ?",
            text: "",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
                  .then(function (willDelete) {
                      if (willDelete) {
                          h.post("../cApplicantReviewDetail/removeToPSB", { app_ctrl_nbr: s.app_ctrl_nbr }).then(function (d) {
                              if (d.data.icon == "success") {
                                  swal("Successfully Remove from PSB List", { icon: "success" })
                                  disabledbtn(d.data.app_status)
                              }
                          })
                      }
                      //else {
                      //    cs.spinnerRemove("#del_row" + row_id, "fa fa-trash")
                      //}
                  });

       
    }

    function disabledbtn(value)
    {
        if(value == "P")
        {
            cs.DisabledField("addPSB")
            cs.EnabledField("removePSB")
        }
        else {
            cs.DisabledField("removePSB")
            cs.EnabledField("addPSB")
        }
    }
    function scorerendered100(x) {
        if (isNaN(x)) {
            return 0
        }
        else {
            return ((x * 100) / 25)
        }
       
    }
    function scorerendered25(x) {
        if (isNaN(x)) {
            return 0
        }
        else {

            return ((x / 100) * 25)
        }
      
    }


    s.btn_to_details = function () {
       
        h.post("../cApplicantReviewDetail/InitializeDetails", { info_ctrl_nbr: s.info_ctrl_nbr }).then(function (d) {
            s.ddl_educ_type = d.data.educ_type
            s.salgrade = d.data.salgrade
            s.Education_List_Data = d.data.education.refreshTable("appl_edu_grid", "");
            s.Eligibility_List_Data = d.data.eligibility.refreshTable("appl_elegib_grid", "");
            s.Workexp_List_Data = d.data.experience.refreshTable("appl_workexp_grid", "");
            s.LnD_List_Data = d.data.training.refreshTable("appl_lnd_grid", "");
            $("#applicantsDetails").modal("show")

        })


    }

   





    //EDUCATION DETAILS*******************************START
    s.educ_edit_action = function (row) {
      
        s.info_ctrl_nbr = s.Education_List_Data[row].info_ctrl_nbr;
        s.seq_no = s.Education_List_Data[row].seq_no;
        s.Education_List_Data.populateFields(s.ed, row)
      
        $("#educ_dtl_modal").modal("show");
    }

    $('#educ_dtl_modal').on('hidden.bs.modal', function () {

        cs.clearFields(s.ed)
        cs.removeFormReq(s.ed)
        s.editMode = false;
    });

   
    //EDUCATION DETAILS*******************************END





    //ELIGIBILITY DETAILS*******************************START
    

    s.elig_edit_action = function (row) {
        
        s.info_ctrl_nbr = s.Eligibility_List_Data[row].info_ctrl_nbr;
        s.seq_no = s.Eligibility_List_Data[row].seq_no;
        s.Eligibility_List_Data.populateFields(s.el, row)
        s.editMode = true;
        $("#eligib_dtl_modal").modal("show");
    }

    $('#eligib_dtl_modal').on('hidden.bs.modal', function () {
        cs.clearFields(s.el)
        cs.removeFormReq(s.el)
        s.editMode = false;
    });



    //ELIGIBILITY DETAILS*******************************END






    //EXPERIENCE DETAILS********************************START


    s.exp_edit_action = function (row) {
       
        var dt = s.Workexp_List_Data[row]
       
        s.info_ctrl_nbr = dt.info_ctrl_nbr;
        s.seq_no = dt.seq_no;
        s.Workexp_List_Data.populateFields(s.wx, row)
        if (dt.gov_srvc) {
            s.wx.gov_srvc = "1"
        }
        else {
            s.wx.gov_srvc = "0"
        }
        s.editMode = true;
        $("#workexp_dtl_modal").modal("show");
    }


    $('#workexp_dtl_modal').on('hidden.bs.modal', function () {
        cs.clearFields(s.wx)
        cs.removeFormReq(s.wx)
        s.editMode = false;
    });


    function serv(id) {
        if (id) {
            return "Government"
        }
        else if (id == false) {
            return "Private"
        }
        else {
            return ""
        }

    }

    //EXPERIENCE DETAILS********************************END





    //TRAINING DETAILS**********************************START



    s.lnd_edit_action = function (row) {
       
        var dt = s.LnD_List_Data[row]

        s.info_ctrl_nbr = dt.info_ctrl_nbr;
        $("#period_from").val(dt.period_from)
        $("#period_to").val(dt.period_to)

        s.seq_no = dt.seq_no;
        s.LnD_List_Data.populateFields(s.ld, row)
        s.editMode = true;
        $("#lnd_dtl_modal").modal("show");
    }

    $('#lnd_dtl_modal').on('hidden.bs.modal', function () {
        cs.clearFields(s.ld)
        cs.removeFormReq(s.ld)
        s.editMode = false;
    });


    //TRAINING DETAILS**********************************END
    //Return Button to cApplicantsReview
    s.ReturnToApplicantReview = function () {
        window.location.href = "/cApplicantsReview/";
    }




    s.show_combine_action = function (row, dtl) {
        if (dtl == 1) {

            s.Educ_Data.populateFields(s.ed, row)
            $("#educ_dtl_modal").modal("show")
        }
        else if (dtl == 2) {

            s.LnD_Data.populateFields(s.ld, row)
            $("#lnd_dtl_modal").modal("show")
        }
        else if (dtl == 3) {

            var dt = s.Wexp_Data[row]
            s.wexp_object = dt
            if (dt.gov_srvc == true) {
                s.wx.gov_srvc = "1"
            }
            else {
                s.wx.gov_srvc = "0"
            }
            s.Wexp_Data.populateFields2("cm", row)
            if (dt.ctrl_nbr > 0) {

                var w = s.Wexp_Data[row]
               
                var ctrl_nbr = w.ctrl_nbr
                var info_ctrl_nbr = w.info_ctrl_nbr
               
                swal({
                    title: "Unmerge Work Experience",
                    text: "Would you like to unmerge this combined work exeprience?",
                    icon: "warning",
                    buttons: true,
                    dangerMode: true,
                })
                .then(function (unmerge) {
                    if (unmerge) {
                        h.post("../cApplicantReviewDetail/UnmergeWexp", { ctrl_nbr: ctrl_nbr, info_ctrl_nbr: info_ctrl_nbr, app_ctrl_nbr: s.app_ctrl_nbr }).then(function (d) {
                            if (d.data.icon == "success") {
                                s.Wexp_Data = d.data.experience.refreshTable("wexp_grid", "");
                                swal(d.data.umg.output_message, { icon: "success",timer:1500})
                                //disabledbtn(d.data.app_status)
                            }
                        })
                    }
                });
            }
            else {
                $("#workexp_combine_modal").modal("show")
            }

          



        }
        else if (dtl == 4) {
            s.Elig_Data.populateFields(s.el, row)
            $("#eligib_dtl_modal").modal("show")
        }
    }


    s.SelectExperience = function () {
        s.experince2combine = []

        var dt = s.wexp_object

        var wexp_arr = s.Wexp_Data.filter(function (d) {
            return d.gov_srvc == dt.gov_srvc
        })

        s.Combine_Wexp_Data = wexp_arr.refreshTable("combine_wexp_grid", "");
        $("#workexp_combine_modal_grid").modal("show")

    }

    s.combine_check_box = function (row) {
        var seq_no = s.Combine_Wexp_Data[row].seq_no
       
        if ($("#combine_wexp" + row).is(':checked'))
        {
            s.experince2combine.push(s.Combine_Wexp_Data[row])
        }
        else
        {
            s.experince2combine  = s.experince2combine.filter(function (d) {
                return d.seq_no != seq_no
            })
        }
    }

    s.CombinedSelectedExperience = function () {
       
        s.experince2combine.sort(cs.dynamicSort("workexp_from"))
        var len = s.experince2combine.length
        if (len > 0) {
            var workfrom = s.experince2combine[0].workexp_from
            var workto = s.experince2combine[len - 1].workexp_to
            SetValue("workexp_from", workfrom, "")
            SetValue("workexp_to", workto, "")
        }
        $("#workexp_combine_modal_grid").modal("hide")
    }

    s.CombineExperience = function () {
        cs.loading("show")
        var data = cs.fetchDataFromForm("cm")
        var govsrvcs = $("#gov_srvc").val()
        if (s.experince2combine.length < 1) {
            swal("No experience selected", { icon: "warning" })
            return;
        }
        h.post("../cAddReviewQS/CombinedSelectedExperience", { data1: s.experince2combine, data2: data, gov_srvc: govsrvcs}).then(function (d) {
            s.Wexp_Data = d.data.experience.refreshTable("wexp_grid", "");
            $("#workexp_combine_modal").modal("hide");
            swal("Success", { icon: "success" })
            cs.loading("hide")
        })
    }


    s.goToDocs = function (l, d) {
        if (d == 1) {
            s.printScoreSheet(l)
        }
        else {
            h.post("../cApplicantsReview/SetHistoryPage").then(function (d) {
                location.href = "../cViewUploadedFileFromAPL/Index?app_ctrl_nbr=" + s.app_ctrl_nbr
            })
        }
    }

    //************************************// 
    //*** Print Score Sheet             
    //**********************************// 
    s.printScoreSheet = function (l) {
        var dt = s.applicanttbl 
        cs.loading("show")
       
        var controller = "Reports";
        var action = "Index";
        var ReportName = "";
        var SaveName = "Crystal_Report";
        var ReportType = "inline";
        var ReportPath = "~/Reports/cryScoreSheet_Unqualified/";
        var sp = "sp_score_sheet_rpt"
        var parameters = "p_item_no," + s.item_no + ",p_position_code," + s.position_code + ",p_app_ctrl_nbr," + s.app_ctrl_nbr + ",p_app_status," + s.app_status + ",p_panel_user_id," + "";
        ReportName = "cryScoreSheet";
        ReportPath = ReportPath + "" + ReportName + ".rpt";

        h.post("../cPrintScoreSheet/SetHistoryPage").then(function (d) {

                // *******************************************************
                // *** VJA : 2021-07-14 - Validation and Loading hide ****
                // *******************************************************

                var iframe = document.getElementById('iframe_print_preview');
                var iframe_page = $("#iframe_print_preview")[0];
                iframe.style.visibility = "hidden";

                s.embed_link = "../Reports/CrystalViewer.aspx?Params=" + ""
                    + "&ReportName=" + ReportName
                    + "&SaveName=" + SaveName
                    + "&ReportType=" + ReportType
                    + "&ReportPath=" + ReportPath
                    + "&id=" + sp + "," + parameters



                if (!/*@cc_on!@*/0) { //if not IE
                    iframe.onload = function () {
                        iframe.style.visibility = "visible";
                        cs.loading("hide")
                    };
                }
                else if (iframe_page.innerHTML()) {
                    // get and check the Title (and H tags if you want)
                    var ifTitle = iframe_page.contentDocument.title;
                    if (ifTitle.indexOf("404") >= 0) {
                        swal("You cannot Preview this Report", "There something wrong!", { icon: "warning" });
                        iframe.src = "";
                    }
                    else if (ifTitle != "") {
                        swal("You cannot Preview this Report", "There something wrong!", { icon: "warning" });
                        iframe.src = "";
                    }
                    cs.loading("hide")
                }
                else {
                    iframe.onreadystatechange = function () {
                        if (iframe.readyState == "complete") {
                            iframe.style.visibility = "visible";
                            cs.loading("hide")
                        }
                    };
                }

                iframe.src = s.embed_link;
                $('#modal_print_preview').modal({ backdrop: 'static', keyboard: false });

            });
    }


    s.identifyidPDS = function (l) {
        //cs.loading("show")
        var dt = l
        
        s.info_ctrl_nbr = dt.info_ctrl_nbr
        swal({
            title: "Use specific Employee ID",
            text: "If yes, the system will look for id instead of names and birthdate",
            content: "input",
            icon: "info",
            buttons: ["No", "Yes"],
            dangerMode: true,
        })
            .then(function (yes) {
                if (yes != "") {
                    h.post("../cApplicantsReview/getApplicantFromPDSID", {
                        empl_id: yes
                    }).then(function (d) {
                        if (d.data.apl_list.length > 0) {
                            s.select_applicant_PDS_Data = d.data.apl_list.refreshTable("select_id_employee_PDS_grid", "")
                            $("#select_id_employee_PDS").modal("show")
                        }
                        else {
                            swal("No data found!", { icon: "warning", timer: 2000 })
                        }
                        cs.loading("hide")
                    })
                }
                else {

                    h.post("../cApplicantsInfo/getApplicantFromPDS", {
                        first_name: dt.first_name
                        , last_name: dt.last_name
                        , birth_date: dt.birth_date
                        , gender: dt.gender
                    }).then(function (d) {
                        if (d.data.apl_list.length > 0) {
                            s.select_applicant_PDS_Data = d.data.apl_list.refreshTable("select_id_employee_PDS_grid", "")
                            $("#select_id_employee_PDS").modal("show")
                        }
                        else {
                            swal("No data found!", { icon: "warning", timer: 2000 })
                        }
                        cs.loading("hide")
                    })
                }
            });

    }

    s.updateDataFromApl = function (l) {

        h.post("../cApplicantsReview/UpdateDataFrom3", {
            info_ctrl_nbr: s.info_ctrl_nbr
            , empl_id: l.empl_id
            , source: "APL"
            , year: s.yr
            , month: s.mo
            , employment_type: s.employment_type
            , budget_code: s.budget_code
            , item_no: s.item_nbr1
        }).then(function (d) {
           
            swal(d.data.returnUpdate, { icon: d.data.icon })
        })

    }


    s.saveRating = function (appctrlnbr, psbctrlnbr) {
        var app_ctrl_nbr = appctrlnbr
        var psb_ctrl_nbr = psbctrlnbr
        var educ_rating = s.educ_rating
        var wexp_rating = s.wexp_rating
        var lnd_rating = s.lnd_rating
        var elig_rating = s.elig_rating
        var score_rendered = scorerendered25(s.score_rendered)
        var ipcr_rating = s.ipcr_rating
        var exam_type_descr = s.exam_type_descr
        var exam_date = s.exam_date

        if (parseInt(s.score_rendered) > 0 && (!cs.Validate1Field("exam_type_descr") || !cs.Validate1Field("exam_date"))) {
            return
        }
        console.log(score_rendered)
        h.post("../cApplicantReviewDetail/SaveRating",
            {
                  app_ctrl_nbr: app_ctrl_nbr
                , psb_ctrl_nbr: psb_ctrl_nbr
                , educ_rating: educ_rating
                , wexp_rating: wexp_rating
                , lnd_rating: lnd_rating
                , elig_rating: elig_rating
                , score_rendered: score_rendered
                , exam_type_descr: exam_type_descr
                , exam_date: exam_date
                , ipcr_rating: ipcr_rating
            }).then(function (d) {
                if (d.data.icon == "success") {
                    s.getReviewer_List();
                    swal("Successfully add rating!", { icon: "success" })
                    s.educ_rating = d.data.rtn.education == 0 ? 22 : d.data.rtn.education
                    s.wexp_rating = d.data.rtn.experience == 0 ? 22 : d.data.rtn.experience
                    s.lnd_rating = d.data.rtn.training == 0 ? 22 : d.data.rtn.training
                    s.elig_rating = d.data.rtn.eligibility == 0 ? 22 : d.data.rtn.eligibility
                    s.score_rendered = scorerendered100(d.data.rtn.examination)
                    s.exam_type_descr = d.data.rtn.exam_type_descr
                    s.exam_date = d.data.rtn.exam_date
                    s.appctrlnbr = d.data.rtn.app_ctrl_nbr
                    s.psbctrlnbr = d.data.rtn.psb_ctrl_nbr
                    s.ipcr_rating = d.data.rtn.ipcr_rating
                }
                else {
                    swal(d.data.message, { icon: d.data.icon })
                }
            })
    }

    s.fn_educdetails = function() {

        h.post("../cApplicantReviewDetail/fn_educdetails", {
            info_ctrl_nbr: s.info_ctrl_nbr
        }).then(function (d) {
            if (d.data.icon == "success") {
                s.educdetails = d.data.educdetails
            }
            else {
                console.log(d.data.message)
            }
          
        })
    }

    s.fn_eligdetails = function() {

        h.post("../cApplicantReviewDetail/fn_eligdetails", {
            info_ctrl_nbr: s.info_ctrl_nbr
        }).then(function (d) {
            if (d.data.icon == "success") {
                s.eligdetails = d.data.eligdetails
            }
            else {
                console.log(d.data.message)
            }
        })
    }

    s.fn_lnddetails = function() {

        h.post("../cApplicantReviewDetail/fn_lnddetails", {
            info_ctrl_nbr: s.info_ctrl_nbr
        }).then(function (d) {
            if (d.data.icon == "success") {
                s.lnddetails = d.data.lnddetails
                s.lndtotalhrs = d.data.lndTotalhrs
            }
            else {
                console.log(d.data.message)
            }
        })
    }

    s.fn_wexpdetails = function() {

        h.post("../cApplicantReviewDetail/fn_wexpdetails", {
            info_ctrl_nbr: s.info_ctrl_nbr
        }).then(function (d) {
            if (d.data.icon == "success") {
                s.wexpdetails = d.data.wexpdetails
            }
            else {
                console.log(d.data.message)
            }
        })
    }
  

    s.fn_competencies_required =function() {

        h.post("../cApplicantReviewDetail/fn_competencies_required").then(function (d) {
            if (d.data.icon == "success") {
                s.competencies_required = d.data.competencies_required[0].competency_required
            }
            else {
                console.log(d.data.message)
            }
        })
    }

    s.fn_empl_photo_img = function () {

        h.post("../cApplicantReviewDetail/fn_empl_photo_img").then(function (d) {
            if (d.data.icon == "success") {
                s.empl_photo_img = d.data.empl_photo_img
            }
            else {
                console.log(d.data.message)
            }
            cs.loading("hide")
        })
    }

    function fn_callQSDetails() {
        s.fn_empl_photo_img();
        s.fn_educdetails();
        s.fn_eligdetails();
        s.fn_lnddetails();
        s.fn_wexpdetails();
        s.fn_competencies_required();
    }
   
})


ng_eRSP_App.directive("openModal", ["commonScript", "$http", function (cs, h) {
    return {
        restrict: 'A',
        link: function (scope, elem, attrs) {
            elem.on('click', function () {
                var moda = attrs.openModal
                scope.showRemoveQS = false
                if (moda == "educ") {
                    h.post("../cApplicantReviewDetail/getEducation", { app_ctrl_nbr: scope.app_ctrl_nbr }).then(function (d) {
                        if (d.data.icon == "success") {
                            scope.Educ_Data = d.data.education.refreshTable("educ_grid", "");
                            $("#edu_tab").modal("show")
                        }
                        else {
                            swal(d.data.message, { icon: "error" })
                        }
                    })
                }
                else if (moda == "elig") {
                    h.post("../cApplicantReviewDetail/getEligibility", { app_ctrl_nbr: scope.app_ctrl_nbr }).then(function (d) {
                        if (d.data.icon == "success") {
                            scope.Elig_Data = d.data.eligibility.refreshTable("elig_grid", "");
                            $("#elig_tab").modal("show")
                        }
                        else {
                            swal(d.data.message, { icon: "error" })
                        }
                    })
                }
                else if (moda == "lnd") {
                    h.post("../cApplicantReviewDetail/getTraining", { app_ctrl_nbr: scope.app_ctrl_nbr }).then(function (d) {
                        if (d.data.icon == "success") {
                            scope.LnD_Data = d.data.training.refreshTable("LnD_grid", "");
                            $("#lnd_tab").modal("show")
                        }
                        else {
                            swal(d.data.message, { icon: "error" })
                        }
                    })
                }
                else if (moda == "exp") {
                    h.post("../cApplicantReviewDetail/getExperience", { app_ctrl_nbr: scope.app_ctrl_nbr }).then(function (d) {
                        if (d.data.icon == "success") {
                            scope.Wexp_Data = d.data.experience.refreshTable("wexp_grid", "");
                            $("#wexp_tab").modal("show")
                        }
                        else {
                            swal(d.data.message, { icon: "error" })
                        }
                    })
                }
                else if (moda == "addrating") {
                  
                    h.post("../cApplicantReviewDetail/GetRating", { app_ctrl_nbr: scope.app_ctrl_nbr }).then(function (d) {
                        if (d.data.icon == "success") {
                           
                            scope.educ_rating = d.data.rtn.education == 0 ? 22 : d.data.rtn.education 
                            scope.wexp_rating = d.data.rtn.experience == 0 ? 22 : d.data.rtn.experience 
                            scope.lnd_rating = d.data.rtn.training == 0 ? 22 : d.data.rtn.training 
                            scope.elig_rating = d.data.rtn.eligibility == 0 ? 22 : d.data.rtn.eligibility 
                            scope.score_rendered = scorerendered100(d.data.rtn.examination)
                            scope.exam_type_descr = d.data.rtn.exam_type_descr
                            scope.exam_date = d.data.rtn.exam_date
                            scope.appctrlnbr = d.data.rtn.app_ctrl_nbr
                            scope.psbctrlnbr = d.data.rtn.psb_ctrl_nbr
                            scope.ipcr_rating = d.data.rtn.ipcr_rating

                            $("#add_rating").modal("show")
                        }
                        else {
                            swal(d.data.message, { icon: "error" })
                        }
                    })
                }
            })
        }
    }
}])

ng_eRSP_App.directive("qsAddqs", ["commonScript", "$http", function (cs, h) {
    return {
        restrict: 'A',
        link: function (scope, elem, attrs) {
            elem.on('click', function () {
              
                var param = attrs.qsAddqs.split(',')
                var row = param[0]
                var dtl = param[1]

                if (dtl == 1) {
                    var dt = scope.Educ_Data[row]
                    var seqno = dt.seq_no
                   // var type = scope.Educ_Data[row].educ_type

                    //cs.spinnerAdd("educ" + row, "checkmark")
                    h.post("../cAddReviewQS/addToPSB",
                        {
                              seqno: seqno
                            , info_ctrl_nbr: dt.info_ctrl_nbr
                            , tab: "educ"
                        }).then(function (d) {
                            if (d.data.icon == "success") {
                                scope.Educ_Data = d.data.returndata.refreshTable("educ_grid", seqno);
                                scope.Applicant_Details_Data = d.data.dtl_list.refreshTable("datalist_grid", "");
                                scope.fn_educdetails();
                                swal("QS successfully Added!", { icon: "success", timer: 1000 })
                               // cs.spinnerRemove("educ" + row, "checkmark")
                            }
                        })
                }
                else if (dtl == 4) {
                    var dt = scope.Elig_Data[row]
                    var seqno = dt.seq_no

                   // cs.spinnerAdd("educ" + row, "checkmark")
                    h.post("../cAddReviewQS/addToPSB",
                        {
                            seqno: seqno
                            , info_ctrl_nbr: dt.info_ctrl_nbr
                            , tab: "elig"
                        }).then(function (d) {
                            if (d.data.icon == "success") {
                                scope.Elig_Data = d.data.returndata.refreshTable("elig_grid", seqno);
                                scope.Applicant_Details_Data = d.data.dtl_list.refreshTable("datalist_grid", "");
                                scope.fn_eligdetails();
                                swal("QS successfully Added!", { icon: "success", timer: 1000 })
                              //  cs.spinnerRemove("educ" + row, "checkmark")
                            }
                        })
                }
                else if (dtl == 2) {
                    var dt = scope.LnD_Data[row]
                    var seqno = dt.seq_no
                  
                    // cs.spinnerAdd("educ" + row, "checkmark")
                    h.post("../cAddReviewQS/addToPSB",
                        {
                              seqno: seqno
                            , info_ctrl_nbr: dt.info_ctrl_nbr
                            , tab: "lnd"
                        }).then(function (d) {
                            if (d.data.icon == "success") {
                                scope.LnD_Data = d.data.returndata.refreshTable("LnD_grid", seqno);
                                scope.Applicant_Details_Data = d.data.dtl_list.refreshTable("datalist_grid", "");
                                scope.fn_lnddetails();
                                swal("QS successfully Added!", { icon: "success", timer: 1000 })
                                //  cs.spinnerRemove("educ" + row, "checkmark")
                            }
                        })
                }
                else if (dtl == 3) {
                    var dt = scope.Wexp_Data[row]
                    var seqno = dt.seq_no

                    // cs.spinnerAdd("educ" + row, "checkmark")
                    h.post("../cAddReviewQS/addToPSB",
                        {
                            seqno: seqno
                            , info_ctrl_nbr: dt.info_ctrl_nbr
                            , tab: "wexp"
                        }).then(function (d) {
                            if (d.data.icon == "success") {
                                scope.Wexp_Data = d.data.returndata.refreshTable("wexp_grid", seqno);
                                scope.Applicant_Details_Data = d.data.dtl_list.refreshTable("datalist_grid", "");
                                scope.fn_wexpdetails();
                                swal("QS successfully Added!", { icon: "success", timer: 1000 })
                                //  cs.spinnerRemove("educ" + row, "checkmark")
                            }
                        })
                }
            })
        }
    }
}])

ng_eRSP_App.directive("showDetailsaction", ["commonScript", "$http", function (cs, h) {
    return {
        restrict: 'A',
        link: function (scope, elem, attrs) {
            elem.on('click', function () {
              
                var param = attrs.showDetailsaction.split(',')
                var row = param[0]
                var dtl = param[1]
               
                if (dtl == 1) {
                    scope.Educ_Data.populateFields3(scope.ed, row)
                    $("#educ_dtl_modal").modal("show")
                }
                else if (dtl == 2) {

                    scope.LnD_Data.populateFields3(scope.ld, row)
                    $("#lnd_dtl_modal").modal("show")
                }
                else if (dtl == 3) {
                    var dt = scope.Wexp_Data[row]
                    if (dt.gov_srvc == true) {
                        scope.wx.gov_srvc = "1"
                    }
                    else {
                        scope.wx.gov_srvc = "0"
                    }
                    scope.Wexp_Data.populateFields3(scope.wx, row)
                    $("#workexp_dtl_modal").modal("show")

                }
                else if (dtl == 4) {
                    scope.Elig_Data.populateFields3(scope.el, row)
                    $("#eligib_dtl_modal").modal("show")
                }
            })
        }
    }
}])

ng_eRSP_App.directive("qsRemove", ["commonScript", "$http", function (cs, h) {
    return {
        restrict: 'A',
        link: function (scope, elem, attrs) {
            elem.on('click', function () {
                var param = attrs.qsRemove
                var app_ctrl_nbr = scope.app_ctrl_nbr
               
               
                if (param == "edu") {
                    
                    var param2 = attrs.paramSeq
                    var param3 = attrs.paramInfoctrlnbr
                  
                    swal({
                        title: "Remove QS",
                        text: "",
                        icon: "info",
                        buttons: ["No", "Yes"],
                        dangerMode: true,
                    }).then(function (yes) {
                        if (yes) {
                            h.post("../cApplicantReviewDetail/RemoveEducQS",
                                {
                                      seqno: param2
                                    , info_ctrl_nbr: param3
                                    , app_ctrl_nbr: app_ctrl_nbr
                                }).then(function (d) {
                                    if (d.data.icon == "success") {
                                        scope.Applicant_Details_Data = d.data.dtl_list.refreshTable("datalist_grid", "")
                                        swal("QS successfully removed!", { icon: "success", timer: 1000 })
                                        scope.fn_educdetails();
                                      
                                    }
                                })
                        }
                             
                    });
                   
                }
                else if (param == "lnd") {
                    var param2 = attrs.paramSeq
                    var param3 = attrs.paramInfoctrlnbr
                    swal({
                        title: "Remove QS",
                        text: "",
                        icon: "info",
                        buttons: ["No", "Yes"],
                        dangerMode: true,
                    }).then(function (yes) {
                        if (yes) {
                            h.post("../cApplicantReviewDetail/RemoveLndQS",
                                {
                                    seqno: param2
                                    , info_ctrl_nbr: param3
                                    , app_ctrl_nbr: app_ctrl_nbr
                                }).then(function (d) {
                                    if (d.data.icon == "success") {
                                        scope.Applicant_Details_Data = d.data.dtl_list.refreshTable("datalist_grid", "")
                                        swal("QS successfully removed!", { icon: "success", timer: 1000 })
                                        scope.fn_lnddetails();
                                       
                                    }
                                })
                        }

                    });
                   
                }
                else if (param == "wexp") {
                    var param2 = attrs.paramSeq
                    var param3 = attrs.paramInfoctrlnbr
                    swal({
                        title: "Remove QS",
                        text: "",
                        icon: "info",
                        buttons: ["No", "Yes"],
                        dangerMode: true,
                    }).then(function (yes) {
                        if (yes) {
                            h.post("../cApplicantReviewDetail/RemoveWexpQS",
                                {
                                      seqno: param2
                                    , info_ctrl_nbr: param3
                                    , app_ctrl_nbr: app_ctrl_nbr
                                }).then(function (d) {
                                    if (d.data.icon == "success") {
                                        scope.Applicant_Details_Data = d.data.dtl_list.refreshTable("datalist_grid", "")
                                        swal("QS successfully removed!", { icon: "success", timer: 1000 })
                                        scope.fn_wexpdetails();
                                       
                                    }
                                })
                        }

                    });
                }

                else if (param == "elig") {
                    var param2 = attrs.paramSeq
                    var param3 = attrs.paramInfoctrlnbr
                    swal({
                        title: "Remove QS",
                        text: "",
                        icon: "info",
                        buttons: ["No", "Yes"],
                        dangerMode: true,
                    }).then(function (yes) {
                        if (yes) {
                            h.post("../cApplicantReviewDetail/RemoveEligQS",
                                {
                                      seqno: param2
                                    , info_ctrl_nbr: param3
                                    , app_ctrl_nbr: app_ctrl_nbr
                                }).then(function (d) {
                                    if (d.data.icon == "success") {

                                        scope.Applicant_Details_Data = d.data.dtl_list.refreshTable("datalist_grid", "")
                                        swal("QS successfully removed!", { icon: "success", timer: 1000 })
                                        scope.fn_eligdetails();
                                       
                                    }
                                })
                        }

                    });
                   
                   
                }
            })
        }
    }
}])

ng_eRSP_App.directive("qsRemoverelevantlnd", ["commonScript", "$http", function (cs, h) {
    return {
        restrict: 'A',
        link: function (scope, elem, attrs) {
            elem.on('click', function () {
                
                var param = attrs.qsRemoverelevantlnd.split(',')
                var row = param[0]
                var seqno = param[1]
                var info_ctrl_nbr = scope.info_ctrl_nbr
                var app_ctrl_nbr = scope.app_ctrl_nbr
               
                h.post("../cApplicantReviewDetail/RemoveLndQS",
                        {
                            seqno: seqno
                            , info_ctrl_nbr: info_ctrl_nbr
                            , app_ctrl_nbr: app_ctrl_nbr
                        }).then(function (d) {
                            if (d.data.icon == "success") {
                                scope.LnD_included_Data = d.data.relevant_lnd.refreshTable("lnd_included_grid", "")
                                scope.Applicant_Details_Data = d.data.dtl_list.refreshTable("datalist_grid", "")
                               
                                swal("QS successfully removed!", {icon:"success",timer:1000},)
                               
                            }
                        })
                
            })
        }
    }
}])


ng_eRSP_App.directive("saveRating", ["commonScript", "$http", function (cs, h) {
    return {
        restrict: 'A',
        link: function (scope, elem, attrs) {
            elem.on('click', function () {
                var param = attrs.saveRating.split(',')
                var app_ctrl_nbr = param[0]
                var psb_ctrl_nbr = param[1]
                var educ_rating         = scope.educ_rating
                var wexp_rating         = scope.wexp_rating
                var lnd_rating          = scope.lnd_rating 
                var elig_rating         = scope.elig_rating
                var score_rendered      = ((scope.score_rendered /100) * 25)
                var exam_type_descr     = scope.exam_type_descr
                var exam_date = scope.exam_date
             
                if (parseInt(scope.score_rendered) > 0 && (!cs.Validate1Field("exam_type_descr") || !cs.Validate1Field("exam_date"))) {
                    return
                }

                h.post("../cApplicantReviewDetail/SaveRating",
                    {
                          app_ctrl_nbr      : app_ctrl_nbr  
                        , psb_ctrl_nbr      : psb_ctrl_nbr
                        , educ_rating       : educ_rating    
                        , wexp_rating       : wexp_rating    
                        , lnd_rating        : lnd_rating     
                        , elig_rating       : elig_rating    
                        , score_rendered    : score_rendered 
                        , exam_type_descr   : exam_type_descr
                        , exam_date         : exam_date      
                    }).then(function (d) {

                       

                        if (d.data.icon == "success") {
                            scope.profile = d.data.reviewer_list.formInnerText(scope.profile);
                            swal("Successfully add rating!", { icon: "success" })

                            scope.educ_rating = d.data.rtn.education == 0 ? 22 : d.data.rtn.education
                            scope.wexp_rating = d.data.rtn.experience == 0 ? 22 : d.data.rtn.experience
                            scope.lnd_rating = d.data.rtn.training == 0 ? 22 : d.data.rtn.training
                            scope.elig_rating = d.data.rtn.eligibility == 0 ? 22 : d.data.rtn.eligibility
                            scope.score_rendered = ((d.data.rtn.examination * 100) / 25)
                            scope.exam_type_descr = d.data.rtn.exam_type_descr
                            scope.exam_date = d.data.rtn.exam_date
                            scope.appctrlnbr = d.data.rtn.app_ctrl_nbr
                            scope.psbctrlnbr = d.data.rtn.psb_ctrl_nbr

                        }
                        else {
                            swal(d.data.message, {icon:d.data.icon})
                        }
                    })

            })
        }
    }
}])

ng_eRSP_App.directive("rateApplicant", ["commonScript", "$http", function (cs, h) {
    return {
        restrict: 'A',
        link: function (scope, elem, attrs) {
            elem.on('click', function () {
                var app_ctrl_nbr = attrs.rateApplicant
              

                h.post("../cApplicantReviewDetail/CheckifInPsbSchedule",
                    {
                        app_ctrl_nbr: app_ctrl_nbr
                    }).then(function (d) {
                        var app = d.data.app
                        if (d.data.app == null) {
                            swal("Not Included In PSB!", "This applicants need to be added to PSB schedule before you can rate for it", { icon: "error" })
                        }
                        else {
                         
                            scope.educ_rating = d.data.rtn.education == 0 ? 22 : d.data.rtn.education
                            scope.wexp_rating = d.data.rtn.experience == 0 ? 22 : d.data.rtn.experience
                            scope.lnd_rating = d.data.rtn.training == 0 ? 22 : d.data.rtn.training
                            scope.elig_rating = d.data.rtn.eligibility == 0 ? 22 : d.data.rtn.eligibility
                            scope.score_rendered = ((d.data.rtn.examination * 100) / 25)
                            scope.exam_type_descr = d.data.rtn.exam_type_descr
                            scope.exam_date = d.data.rtn.exam_date
                            scope.appctrlnbr = d.data.rtn.app_ctrl_nbr
                            scope.psbctrlnbr = d.data.rtn.psb_ctrl_nbr
                            scope.ipcr_rating = d.data.rtn.ipcr_rating  

                            console.log(d.data.rtn.ipcr_rating)
                            $("#add_rating").modal("show")
                        }
                    })
            })
        }
    }
}])


ng_eRSP_App.directive("minMax", ["commonScript", "$http", function (cs, h) {
    return {
        restrict: 'A',
        link: function (scope, elem, attrs) {

            elem.on('keyup', function () {

                var param = attrs.minMax.split(',')
                var min = param[0]
                var max = param[1]
                
                var id = attrs.idl
                var val = $("#"+id).val()
               
                var ngmodel = attrs.ngModel
             

                if ((parseInt(val) < parseInt(min))) {
                    cs.required2(id, "Score must be greater or equal to " + min)
                }
                else if ((parseInt(val) > parseInt(max))) {           
                    cs.required2(id, "Score must be lower or equal to " + max)
                }
                else {
                    cs.notrequired2(id);
                }
                   
            })
        }
    }
}])


ng_eRSP_App.directive("ngValue", ["commonScript", "$http", function (cs, h) {
    return {
        restrict: 'A',
        link: function (scope, elem, attrs) {
            elem.on('load', function () {
                var param = attrs.ngValue
                var id = attrs.id
                var ngmodel = attrs.ngModel
               
                $("#" + id).val(param)
                scope[ngmodel] = param

            })
        }
    }
}])

ng_eRSP_App.filter("encode_idv", function () {
    return function (d, a, e, b, c, f) {
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
    };
});


ng_eRSP_App.filter("initial_min", function () {
    return function (input) {
        return input
    };
});

ng_eRSP_App.filter("scoreRendered", function () {
    return function (x) {
        if (isNaN(x)) {
            return 0
        }
        else {
            console.log(((x * 100) / 25))
            return ((x * 100) / 25)
        }
    }
});

//s.show_details_action = function (row, dtl) {
//    if (dtl == 1) {

//        s.Educ_Data.populateFields(s.ed, row)
//        $("#educ_dtl_modal").modal("show")
//    }
//    else if (dtl == 2) {

//        s.LnD_Data.populateFields(s.ld, row)
//        $("#lnd_dtl_modal").modal("show")
//    }
//    else if (dtl == 3) {

//        var dt = s.Wexp_Data[row]
//        if (dt.gov_srvc == true) {
//            s.wx.gov_srvc = "1"
//        }
//        else {
//            s.wx.gov_srvc = "0"
//        }
//        s.Wexp_Data.populateFields(s.wx, row)
//        $("#workexp_dtl_modal").modal("show")

//    }
//    else if (dtl == 4) {
//        s.Elig_Data.populateFields(s.el, row)
//        $("#eligib_dtl_modal").modal("show")
//    }
//}
//s.educ_check_box = function (row) {
//    var dt = s.Educ_Data[row]
//    var seqno = dt.seq_no
//    var type = s.Educ_Data[row].educ_type
    
//    cs.spinnerAdd("educ" + row, "checkmark")
//    h.post("../cAddReviewQS/addToPSB",
//        {
//            seqno: s.Educ_Data[row].seq_no
//            , info_ctrl_nbr: s.Educ_Data[row].info_ctrl_nbr
//            , psb_selected: $("#educ" + row)[0].checked
//            , tab: "educ"
//        }).then(function (d) {
//            if (d.data.icon == "success") {
//                s.Educ_Data = d.data.returndata.refreshTable("educ_grid", seqno);
//                cs.spinnerRemove("educ" + row, "checkmark")
//            }
//        })
    
//}