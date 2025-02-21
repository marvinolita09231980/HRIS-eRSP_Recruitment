
ng_eRSP_App.controller("cApplicantsReview_Ctrlr", function (commonScript, $scope, $http, $filter, $compile) {
	var s = $scope
	var h = $http
    var cs = commonScript
    s.review_data = {}
    s.pay = false
    s.apl = false
    s.info_ctrl_nbr = ""
    s.empl_id = ""
	s.recieved = false
    s.header_title = "APPLICANT LIST"
    s.department = []
    s.change_item_items = []
	s.modal = 1
	s.rowLen = ""
	s.pageTitle = ""
    s.employment_type = ""
    s.u_row
    s.email_data = {}
	s.item_no = ""
	s.budget_year = []
    s.budget_code = ""
    s.single_empl_id = ""
    s.single_email = ""
    s.item_nbr1 = ""
    s.department_code1 = ""
    s.rowindex_forexamtimeset = ""
    s.emailreceipent = ""
    s.show_search = 1
    s.exam_row = ""
    s.exam_app_ctrl_nbr =""
    s.psb_number_disabled = false

    var row_for_email = ""
    var type_for_email = ""

    s.pagenumber1 = ""
    s.pagenumber2 = ""
    s.pagenumber3 = ""
    s.pagenumber4 = ""
   
	s.main_edit = false
	s.dtl_edit = false
	s.year = []
	s.att_dtl = []
	s.position_tbl = []
	s.psbcshedlist = []
	s.app_status_list = []
    s.Applicant_List_Data_Orig = []
    s.applicant_list_object = {}
	s.budget_year = []
    s.items = []
    s.application_status = []
    s.includeToEmail = []
    s.sendingEmailList = []
    s.hiringperiodlist = []
    s.psb_sked_hdr = []
	s.um = {}
	s.fd = {}
	s.wx = {}
	s.ld = {}
	s.el = {}
	s.ed = {}
	s.app_ctrl_nbr = ""
	var appl = []
	var educ = []
	var lnd = []
	var wexp = []
	var elig = []
    var budget_year_re = []
    var budget_year_ce = []
    var budget_year_jo = []

    s.selectedAppRow4Top5 = []
    s.qualifiedForExamList = []
    s.selectedAppRow4HRMPSB = []

    s.show


    //for add item to psb object
    s.appdata_row = {}
    //for email sent show button
    s.acknowledge = false
    s.qualified_exam = false
    s.not_qualified_exam = false
    s.for_hrmpsb = false
    s.top5 = false

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

    var summernote = $('#summernote2').summernote();

	s.year = cs.RetrieveYear()

    function fn_encode_idv (d, a, e, b, c, f) {
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

	s.ps = {
		  app_ctrl_nbr : ""
		, year : ""
		, month : ""
		, psb_ctrl_nbr : ""
		, psb_date : ""
		, employment_type : ""
		, employment_type_descr : ""
		, remarks_details : ""
	}

	s.app_review = {
				 app_ctrl_nbr           : ""
				,app_ctrl_nbr_disp      : ""
				,employment_type        : ""
				,budget_code            : ""
				,position_code          : ""
				,item_no                : ""
				,department_code        : ""
				,exam_type_descr        : ""
				,score_rendered         : ""
				,exam_date              : ""
	}

	s.status = [
		{ id: 'RC', text: 'Received' },
		{ id: 'WS', text: 'Waiting List' },
		{ id: 'SL', text: 'Short List' },
		{ id: 'PS', text: 'PSB Screened' },
		{ id: 'AP', text: 'Approved' }]

	s.review_status = [
		{ id: 'DS', text: 'Disapproved' },
		{ id: 'PS', text: 'PSB Screening' },
		{ id: 'JH', text: 'JO Hiring' },
		{ id: 'FL', text: 'For Filing' }]

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
   

    function civil_status(status) {
    var data = ""
        switch (status) {
            case "D":
                data = "Divorced";
                break;
            case "M":
                data = "Married";
                break;
            case "S":
                data = "Single";
                break;
            case "T":
                data = "Separated";
                break;
            case "W":
                data = "Widow / Widower";
                break;
            default:
            // code block
        }
        return data
    }
    function sex(sex) {
        var data = ""
        switch (sex) {
            case "M":
                data = "Male";
                break;
            case "F":
                data = "Female";
                break;
            default:
            // code block
        }
        return data
    }
    var Init_Position_List_Grid = function (par_data) {
        s.Position_List_Data = par_data;

        s.Position_List_Table = $('#Position_List_Grid').dataTable(
            {
                data: s.Position_List_Data,
                sDom: 'rt<"bottom"p>',
                order: [[1, "asc"]],
                sortable: false,
                pageLength: 10,
                initComplete: function () {
                    cs.loading("hide")
                },
                drawCallback: function () {
                    cs.loading("hide")
                },
                columns: [
                    {
                        "mData": "Position_long_title",
                        "mRender": function (data, type, full, row) {
                            return "<span>" + data + "</span>" +
                                "<small>" + full["app_address"] + "</small>"
                        }
                    },
                    //{
                    //    "mData": "empl_photo_img",
                    //    "mRender": function (data, type, full, row) {
                    //        return "<span><img alt='image'  class='img-circle grid-img' src='" + fn_encode_idv(data) + "'></span>"
                    //    }
                    //},

                    {
                        "mData": "no_applicants",
                        "mRender": function (data, type, full, row) {
                            return "<h4 class='text-left btn-block'>" + data + "</h4>"
                        }
                    },
                    {
                        "mData": "with_pwd",
                        "mRender": function (data, type, full, row) {
                            return "<h4 class='text-left btn-block'>" + civil_status(data) + "</h4>"

                        }
                    },
                    {
                        "mData": "for_review",
                        "mRender": function (data, type, full, row) {
                            return "<h4 class='text-left btn-block'>" + sex(data) + "</h4>"
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


	var Init_Applicant_List_Grid = function (par_data) {
        s.Applicant_List_Data = par_data;
       
		s.Applicant_List_Table = $('#Applicant_List_Grid').dataTable(
			{
				data: s.Applicant_List_Data,
                sDom: 'rt<"bottom"p>',
                order: [[1, "asc"]],
                sortable: false,
                pageLength: 10,
                initComplete: function () {
                    cs.loading("hide")
                },
                drawCallback: function () {
                    cs.loading("hide")
                },
                columns: [
                    {
                        "mData": "applicant_name",
                        "mRender": function (data, type, full, row) {
                            return "<span>" + data + "</span>" +
                                "<small>" + full["app_address"] + "</small>"
                        }
                    },
                    //{
                    //    "mData": "empl_photo_img",
                    //    "mRender": function (data, type, full, row) {
                    //        return "<span><img alt='image'  class='img-circle grid-img' src='" + fn_encode_idv(data) + "'></span>"
                    //    }
                    //},

					{
						"mData": "position_long_title",
						"mRender": function (data, type, full, row) {
                            return "<h4 class='text-left btn-block'>" + data + "</h4>" 
						}
					},
					{
                        "mData": "civil_status",
						"mRender": function (data, type, full, row) {
                            return "<h4 class='text-left btn-block'>" + civil_status(data) + "</h4>"
                               
						}
                    },
                    {
                        "mData": "gender",
                        "mRender": function (data, type, full, row) {
                            return "<h4 class='text-left btn-block'>" + sex(data) + "</h4>" 
                        }
                    },
					{
                        "mData": "gender2",
						"mRender": function (data, type, full, row) {
                            return "<h4 class='text-left btn-block'>" + data + "</h4>" 
						}
                    },
					{
                        "mData": "pwd_statutory",
                        "mRender": function (data, type, full, row) {
                            return "<h4 class='text-left btn-block'>" + data + "</h4>"
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

    function currentPageNumber() {
       
        if ($("#Applicant_Review_Grid_paginate a.paginate_button.current")[0] != undefined) {
            s.pagenumber1 = $("#Applicant_Review_Grid_paginate a.paginate_button.current")[0].text;
        }
        if ($("#Applicant_OnlineExam_Grid_paginate a.paginate_button.current")[0] != undefined) {
            s.pagenumber2 = $("#Applicant_OnlineExam_Grid_paginate a.paginate_button.current")[0].text;
        }
        if ($("#Applicant_Top5_Grid_paginate a.paginate_button.current")[0] != undefined) {
            s.pagenumber3 = $("#Applicant_Top5_Grid_paginate a.paginate_button.current")[0].text;
        }
        if ($("#Applicant_Hrmpsb_Grid_paginate a.paginate_button.current")[0] != undefined) {
            s.pagenumber4 = $("#Applicant_Hrmpsb_Grid_paginate a.paginate_button.current")[0].text;
        }
      
    }


    function tab_table_data(table) {
     

        var OnlineExam_Data = table.filter(function (d) {
            return d.quali_onlineexam == true
        })

        var Top5Examiness_Data = table.filter(function (d) {
            return d.top5examinees == true
        })

        var HRMPSB_Data = table.filter(function (d) {
            return d.quali_hrmpsb == true
        })
        

        s.Applicant_Review_Data = table.refreshTable2x("Applicant_Review_Grid", s.pagenumber1)
        s.Applicant_OnlineExam_Data = OnlineExam_Data.refreshTable2x("Applicant_OnlineExam_Grid", s.pagenumber2)
        s.Applicant_Top5_Data = Top5Examiness_Data.refreshTable2x("Applicant_Top5_Grid", s.pagenumber3)
        s.Applicant_Hrmpsb_Data = HRMPSB_Data.refreshTable2x("Applicant_Hrmpsb_Grid", s.pagenumber4)
       
    }


    var Init_Applicant_Review_Grid = function (par_data) {
        s.Applicant_Review_Data = par_data;
        s.Applicant_Review_Table = $('#Applicant_Review_Grid').dataTable(
            {
                data: s.Applicant_List_Data,
                sDom: 'rt<"bottom"p>',
                order: [[1, "asc"]],
                pageLength: 10,
                //initComplete: function () {
                //    cs.loading("hide")
                //},
                //drawCallback: function () {
                //    cs.loading("hide")
                //},
                columns: [
                    {
                        
                        "mData": "app_ctrl_nbr",
                        "mRender": function (data, type, full, row) {
                            return "<span>" + data + "</span>"
                        }
                    },

                    //{
                    //    "mData": "empl_photo_img",
                    //    "mRender": function (data, type, full, row) {
                    //        return "<span><img alt='image'  class='img-circle grid-img' src='" + fn_encode_idv(data) + "'></span>"
                    //    }
                    //},

                    {
                        sortable: false,
                        "mData": "applicant_name",
                        "mRender": function (data, type, full, row) {
                            return "<h4 class='text-left btn-block'>" + data + "</h4>" +
                                "<small>" + full["app_address"] + "</small>"
                        }
                    },
                    {
                        "mData": "department_name1",
                        "mRender": function (data, type, full, row) {
                            return "<h4 class='text-left btn-block'>" + data + "</h4>" +
                                "<small class=' btn-block'>" + full["position_long_title"] + "</small>"
                        }
                    },
                    {
                        "mData": "item_in_psb",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-center btn-block'>" + s.fn_status2(data) + "</span>" 
                        }
                    },
                    {
                        "mData": "email_add",
                        "mRender": function (data, type, full, row) {
                            return "<div class='text-left btn-block'><strong>Email</strong>&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;<small>" + data + "</small></div>" +
                                "<div class='text-left btn-block'><strong>Mobile</strong>&nbsp;:&nbsp;<small>" + full["mobile_number"] + "</small></div>"
                        }
                    },
                    {
                        "mData": "applicant_type",
                        "bSortable": false,
                        "mRender": function (data, type, full, row) {
                            return '<div>' +
                                '<button class="btn btn-info btn-sm btn-grid" type="button" data-toggle="tooltip" data-placement="top" title="Review Application" ng-click="appl_review(' + row["row"] + ')">REVIEW&nbsp;<i class="fa fa-plus"></i></button>' +
                                //'<button class="btn btn-success btn-sm btn-grid" ng-disabled="' + full["psb_concluded"] + '" id="btntopsb' + row["row"] + '" type="button" data-toggle="tooltip" data-placement="top" title="Add to PSB" ng-click="addtopsb(' + row["row"] + ')">' + s.fn_itemstatuslabel(full["item_in_psb"]) + '&nbsp;<i id="icntopsb' + row["row"] + '" class="fa ' + s.fn_itemstatus(full["item_in_psb"]) + '"></i></button>' +
                                
                                '<div class="btn-group">' +
                                '<button class="btn btn-warning btn-sm dropdown-toggle btn-grid" type="button" data-toggle="dropdown" data-placement="top" title="Click for more action">SEND EMAIL</button>' +
                                '<ul class="dropdown-menu ">' +
                                '<li><a ng-click="sendEmailNotification(' + row["row"] + ',1)">Acknowledge Email</a></li>' +
                                '<li ng-if="' + full["quali_onlineexam"] + ' == false"><a ng-click="sendEmailNotification(' + row["row"] + ',2)">Not Qualified for Examination</a></li>' +
                                '<li><a ng-click="printEmailNotif(' + row["row"] + ',1)">Print Acknowledgement</a></li>' +
                                '<li><a ng-click="printEmailNotif(' + row["row"] + ',2)">Print Not Qualified for Examination</a></li>' +
                                '</ul>' +
                                '</div>' +
                                '<button class="btn btn-info btn-sm dropdown-toggle btn-grid" type="button" data-toggle="dropdown" data-placement="top" ng-click="viewDates(' + row["row"] + ')">DATES</button>' +
                                '<div class="btn-group">' +
                                '<button class="btn btn-success btn-sm dropdown-toggle btn-grid" type="button" data-toggle="dropdown" data-placement="top" title="Click for more action">BI</button>' +
                                '<ul class="dropdown-menu form-group" style="font-size:18px">' +
                                '<li>' +
                                '<div class="i-checks" style="margin-left:20px;margin-top:15px;"> <label> <input type="radio" ng-checked="' + typecheckin(data) + '" id="in' + row["row"] + '" value="insider" name="a' + row["row"] + '" style="width:20px;height:20px;" ng-click="setApplicantType(1,' + row["row"] + ')"> <i></i> Insider </label></div>' +
                                '<div class="i-checks" style="margin-left:20px;"> <label> <input type="radio" ng-checked="' + typecheckout(data) + '" id="out' + row["row"] + '" value="outsider" name="a' + row["row"] + '" style="width:20px;height:20px;" ng-click="setApplicantType(2,' + row["row"] + ')"> <i></i>Outsider</label></div>' +
                                '</li > ' +
                                //'<li><a ng-click="backgrounInvestigation(' + row["row"] + ',2)">Background Investigation Rating</a></li>' +
                                '</ul>' +
                                '</div>' +
                                '<div class="btn-group">' +
                                '<button class="btn btn-danger btn-sm dropdown-toggle btn-grid" type="button" data-toggle="dropdown" data-placement="top" title="Click for more action">MORE...</button>' +
                                '<ul class="dropdown-menu ">' +
                                '<li><a ng-click="identifyidPDS(' + row["row"] + ')">SYNC PROFILE FROM PDS</a></li>' +
                                '<li><a ng-click="updateDataFromApl(' + row["row"] + ')">SYNC PROFILE FROM ONLINE APPLICATION</a></li>' +
                                '<li><a ng-click="identifyidQS(' + row["row"] + ')">SYNC QS FROM HRIS PDS</a></li>' +
                                '<li><a ng-click="updatefromqsapl(' + row["row"] + ')">SYNC QS ONLINE APPLICATION</a></li>' +
                                //'<li><a ng-click="goToDocs(' + row["row"] + ',2)">UPLOADED DOCUMENTS</a></li>' +
                                '<li><a ng-click="goToDocs(' + row["row"] + ',1)">PRINT SCORE SHEET</a></li>' +
                                //'<li><a ng-click="composeEmail(' + row["row"] + ')">SEND EMAIL NOTIFICATION</a></li>' +
                                '<li><a ng-click="btn_show_pds(' + row["row"] + ')">PRINT PDS FROM ONLINE APPLICATION</a></li>' +
                                '<li ng-show = " app_row_delete(' + row["row"] +')" style="color:red;"><a ng-click="deleteFromReview(' + row["row"] + ')">DELETE APPLICANTS</a></li>' +
                                '</ul>' +
                                '</div>' +
                                '<button class="btn btn-warning btn-sm dropdown-toggle btn-grid" type="button" data-toggle="dropdown" data-placement="top" title="Change applicants item" ng-click="changeApplicantsItem(' + row["row"]+')">Change Item</button>' +
                                '</div>'
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

    s.app_row_delete = function(row) {
        var dt = s.Applicant_Review_Data[row]
        if (dt.quali_onlineexam == true) {
            return false
        }
        else if (dt.quali_hrmpsb == true) {
            return false
        }
        else if (dt.top5examinees == true) {
            return false
        }
        else if (dt.congratulatory == true) {
            return false
        }
        else {
            return true
        }
        
    }

    var Init_Applicant_OnlineExam_Grid = function (par_data) {
        s.Applicant_OnlineExam_Data = par_data;
        s.Applicant_OnlineExam_Table = $('#Applicant_OnlineExam_Grid').dataTable(
            {
                data: s.Applicant_OnlineExam_Data,
                sDom: 'rt<"bottom"p>',
                order: [[1, "asc"]],
                pageLength: 10,
                //initComplete: function () {
                //    cs.loading("hide")
                //},
                //drawCallback: function () {
                //    cs.loading("hide")
                //},
                columns: [
                    {
                        "mData": "app_ctrl_nbr",
                        "mRender": function (data, type, full, row) {
                            return "<span>" + data + "</span>"
                        }
                    },

                    //{
                    //    "mData": "empl_photo_img",
                    //    "mRender": function (data, type, full, row) {
                    //        return "<span><img alt='image'  class='img-circle grid-img' src='" + fn_encode_idv(data) + "'></span>"
                    //    }
                    //},

                    {
                        sortable: false,
                        "mData": "applicant_name",
                        "mRender": function (data, type, full, row) {
                            return "<h4 class='text-left btn-block'>" + data + "</h4>" +
                                "<small>" + full["app_address"] + "</small>"
                        }
                    },
                    {
                        "mData": "department_name1",
                        "mRender": function (data, type, full, row) {
                            return "<h4 class='text-left btn-block'>" + data + "</h4>" +
                                "<small class=' btn-block'>" + full["position_long_title"] + "</small>"
                        }
                    },
                    {
                        "mData": "item_in_psb",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-left'><b>Exam:</b> " + full["exam_date"] + "</span><br>" +
                                "<span class='text-left'><b>Type :</b>  " + full["exam_type"] + "</span>" 
                               

                            //return "<button class='text-left btn btn-block btn-primary no-padding no-margin " + ifExamNotSet(full["exam_date"]) + "' style='font-size:14px;' ng-click='setExamDate(" + row["row"] + ")'>Set Exam Date</button>" +
                            //    "<button class='text-left btn btn-block btn-primary no-padding no-margin " + ifExamSet(full["exam_date"]) + "' style='font-size:12px;' ng-click='setExamDate(" + row["row"] + ")'>" +
                            //    "<span class='text-left'>Exam: " + full["exam_date"] + "</span><br>" +
                            //    "<span class='text-left'>Type: " + full["exam_type"] + "</span>" +
                            //    "</button>"
                        }
                    },
                    {
                        "mData": "email_add",
                        "mRender": function (data, type, full, row) {
                            return "<div class='text-left btn-block'><strong>Email</strong>&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;<small>" + data + "</small></div>" +
                                "<div class='text-left btn-block'><strong>Mobile</strong>&nbsp;:&nbsp;<small>" + full["mobile_number"] + "</small></div>"
                        }
                    },
                    {
                        "mData": "top5examinees",
                        "mRender": function (data, type, full, row) {
                            return '<input ng-disabled="' + data + '" id="top5CbRow' + row["row"] + '"  type="checkbox" class="form-control" ng-click="addToTop5CB(' + row["row"] + ')"  ng-checked="' + data + '"/> '
                           // return '<input ng-disabled="' + data + '" id="top5CbRow' + row["row"] + '"  type="checkbox" class="form-control" ng-click="addRow(' + row["row"] + ')" ng-checked="' + data + '"/> '
                        }
                    },
                    {
                        "mData": "applicant_type",
                        "bSortable": false,
                        "mRender": function (data, type, full, row) {
                            return '<div>' +
                                '<button class="btn btn-info btn-sm btn-grid" type="button" data-toggle="tooltip" data-placement="top" title="View Exam" ng-click="viewExam(' + row["row"] + ')">VIEW EXAM&nbsp;</button>' +
                                '<div class="btn-group">' +
                                '<button class="btn btn-warning btn-sm dropdown-toggle btn-grid" type="button" data-toggle="dropdown" data-placement="top" title="Click for more action">SEND EMAIL</button>' +
                                '<ul class="dropdown-menu ">' +
                                '<li ng-hide="' + full["top5examinees"] + '"><a ng-click="sendEmailNotification(' + row["row"] + ',3)">Notification for Examination</a></li>' +
                                '<li ng-hide="' + full["top5examinees"] + '"><a ng-click="sendEmailNotification(' + row["row"] + ',6)">Notification not in Top 5 applicants</a></li>' +
                                '<li><a ng-click="printEmailNotif(' + row["row"] + ',3)">Print Notification for Examination</a></li>' +
                                '<li><a ng-click="printEmailNotif(' + row["row"] + ',6)">Print not in Top 5 applicants</a></li>' +
                                '</ul>' +
                                '</div>' +
                                '<button ng-hide="' + full["top5examinees"] + '" class="btn btn-success btn-sm btn-grid" type="button" data-toggle="tooltip" data-placement="top" title="Add to top 5 examinees" ng-click="addToTop5Examinees(' + row["row"] + ')">Top 5 &nbsp;</button>' +
                                '<button ng-hide="' + full["top5examinees"] + '" class="btn btn-danger btn-sm btn-grid" type="button" data-toggle="tooltip" data-placement="top" title="Remove From Shortlist" ng-click="removeFromShortlist(' + row["row"] + ')">Remove&nbsp;</button>' +
                                '</div>'
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

    s.qualifyexam_email_show = function (row) {
        var out = false
        var dt = s.Applicant_OnlineExam_Data[row]
        if (dt.score_rendered == "") {
            if (dt.top5examinees == true) {
                out = true
            }
            else {
                out = false
            }
        }
        else {
            out = true
        } 
         console.log(out)
        return out
    }
    s.notInTop5_email_show = function (row) {
        var out = false
        var dt = s.Applicant_OnlineExam_Data[row]
        
        if (dt.top5examinees == true) {
            out = true
        }
        else {
            out = false
        }
        console.log(out)
        return out
    }

    var Init_Applicant_Top5_Grid = function (par_data) {
        s.Applicant_Top5_Data = par_data;
        s.Applicant_Top5_Table = $('#Applicant_Top5_Grid').dataTable(
            {
                data: s.Applicant_Top5_Data,
                sDom: 'rt<"bottom"p>',
                order: [[1, "asc"]],
                pageLength: 10,
                //initComplete: function () {
                //    cs.loading("hide")
                //},
                //drawCallback: function () {
                //    cs.loading("hide")
                //},
                columns: [
                    {
                        "mData": "app_ctrl_nbr",
                        "mRender": function (data, type, full, row) {
                            return "<span>" + data + "</span>"
                        }
                    },
                    {
                        sortable: false,
                        "mData": "applicant_name",
                        "mRender": function (data, type, full, row) {
                            return "<h4 class='text-left btn-block'>" + data + "</h4>" +
                                "<small>" + full["app_address"] + "</small>"
                        }
                    },
                    {
                        "mData": "department_name1",
                        "mRender": function (data, type, full, row) {
                            return "<h4 class='text-left btn-block'>" + data + "</h4>" +
                                "<small class=' btn-block'>" + full["position_long_title"] + "</small>"
                        }
                    },
                    {
                        "mData": "email_add",
                        "mRender": function (data, type, full, row) {
                            return "<div class='text-left btn-block'><strong>Email</strong>&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;<small>" + data + "</small></div>" +
                                "<div class='text-left btn-block'><strong>Mobile</strong>&nbsp;:&nbsp;<small>" + full["mobile_number"] + "</small></div>"
                        }
                    },
                    {
                        "mData": "quali_hrmpsb",
                        "mRender": function (data, type, full, row) {
                            return '<input ng-disabled="' + data + '" id="hrmpsbCbRow' + row["row"] + '"  type="checkbox" class="form-control" ng-click="addToHRMPSBCB(' + row["row"] + ')"  ng-checked="' + data + '"/> '
                            // return '<input ng-disabled="' + data + '" id="top5CbRow' + row["row"] + '"  type="checkbox" class="form-control" ng-click="addRow(' + row["row"] + ')" ng-checked="' + data + '"/> '
                        }
                    },
                    {
                        "mData": "applicant_type",
                        "bSortable": false,
                        "mRender": function (data, type, full, row) {
                            return '<div>' +
                                '<button ng-hide="' + full["quali_hrmpsb"] +'" class="btn btn-success btn-sm" type="button" data-toggle="tooltip" data-placement="top" title="Add to HRMPSB Screening" ng-click="addToHRMPSBScreening(' + row["row"] + ')">To HRMPSB &nbsp;<i class="fa fa-arrow-right"></i></button>' +
                                '<button ng-hide="' + full["quali_hrmpsb"] +'" class="btn btn-danger btn-sm" type="button" data-toggle="tooltip" data-placement="top" title="Remove From Top 5 Examinees" ng-click="removeFromTop5Examinees(' + row["row"] + ')">Remove</button>' +
                               
                                '</div>'
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

    var Init_Applicant_Hrmpsb_Grid = function (par_data) {
        s.Applicant_Hrmpsb_Data = par_data;
        s.Applicant_Hrmpsb_Table = $('#Applicant_Hrmpsb_Grid').dataTable(
            {
                data: s.Applicant_Hrmpsb_Data,
                sDom: 'rt<"bottom"p>',
                order: [[1, "asc"]],
                pageLength: 10,
                //initComplete: function () {
                //    cs.loading("hide")
                //},
                //drawCallback: function () {
                //    cs.loading("hide")
                //},
                columns: [
                    {
                        "mData": "app_ctrl_nbr",
                        "mRender": function (data, type, full, row) {
                            return "<span>" + data + "</span>"
                        }
                    },
                    {
                        sortable: false,
                        "mData": "applicant_name",
                        "mRender": function (data, type, full, row) {
                            return "<h4 class='text-left btn-block'>" + data + "</h4>" +
                                "<small>" + full["app_address"] + "</small>"
                        }
                    },
                    {
                        "mData": "department_name1",
                        "mRender": function (data, type, full, row) {
                            return "<h4 class='text-left btn-block'>" + data + "</h4>" +
                                "<small class=' btn-block'>" + full["position_long_title"] + "</small>"
                        }
                    },
                    {
                        "mData": "email_add",
                        "mRender": function (data, type, full, row) {
                            return "<div class='text-left btn-block'><strong>Email</strong>&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;<small>" + data + "</small></div>" +
                                "<div class='text-left btn-block'><strong>Mobile</strong>&nbsp;:&nbsp;<small>" + full["mobile_number"] + "</small></div>"
                        }
                    },
                    {
                        "mData": null,
                        "bSortable": false,
                        "mRender": function (data, type, full, row) {
                            return '<div>' +
                                '<div class="btn-group">' +
                                '<button class="btn btn-warning btn-sm dropdown-toggle" type="button" data-toggle="dropdown" data-placement="top" title="Click for more action">SEND EMAIL</button>' +
                                '<ul class="dropdown-menu ">' +
                                '<li><a ng-click="sendEmailNotification(' + row["row"] + ',5)">Notification for HRMPSB Screening</a></li>' +
                                '<li><a ng-click="printEmailNotif(' + row["row"] + ',5)">Print Notification for HRMPSB Screening</a></li>' +
                                '</ul>' +
                                '</div>' +
                                '<button class="btn btn-danger btn-sm" type="button" data-toggle="tooltip" data-placement="top" title="Remove from HRMPSB screening" ng-click="removeFromHRMPSBScreening(' + row["row"] + ')">Remove &nbsp;</button>' +
                                //'<button class="btn btn-success btn-sm btn-grid" type="button" data-toggle="tooltip" data-placement="top" title="Add to HRMPSB Screening" ng-click="addToHRMPSBScreening(' + row["row"] + ')">Top 5 Exam...&nbsp;</button>' +
                                '</div>'
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



    s.backgrounInvestigation = function (row) {
        var app_ctrl_nbr = s.Applicant_List_Data[row].app_ctrl_nbr

        location.href = "cBackgroundInvestigation/Index?app_ctrl_nbr=" + app_ctrl_nbr 
    }

    function typecheckin(data) {
        console.log(data)
        if (data == 1) {
            return true
        }
        else {
            return false
        }
    }

    function typecheckout(data) {
        if (data == 2) {
            return true
        }
        else {
            return false
        }
    }
    s.setApplicantType = function (type, row) {
        var app_ctrl_nbr = s.Applicant_List_Data[row].app_ctrl_nbr
        if (type == 1) {
            if ($("#in" + row)[0].checked == true) {
                var applicant_type = type
                var applicant_type_descr = $("#in" + row).val()
                h.post("../cApplicantsReview/setApplicantType", {
                      app_ctrl_nbr         : app_ctrl_nbr        
                    , applicant_type       : applicant_type      
                    , applicant_type_descr : applicant_type_descr
                }).then(function (d) {
                    if (d.data.icon == "success") {
                        s.Applicant_List_Data[row].applicant_type = applicant_type
                        s.Applicant_List_Data[row].applicant_type_descr = applicant_type_descr
                    }
                    else {
                        swal(d.data.message, {icon:d.data.icon})
                    }
                })
            }
        } else if (type == 2) {
            if ($("#out" + row)[0].checked == true) {
                var applicant_type = type
                var applicant_type_descr = $("#out" + row).val()
                h.post("../cApplicantsReview/setApplicantType", {
                      app_ctrl_nbr: app_ctrl_nbr
                    , applicant_type: applicant_type
                    , applicant_type_descr: applicant_type_descr
                }).then(function (d) {
                    if (d.data.icon == "success") {
                        s.Applicant_List_Data[row].applicant_type = applicant_type
                        s.Applicant_List_Data[row].applicant_type_descr = applicant_type_descr
                    }
                    else {
                        swal({ title: d.data.message, icon: d.data.icon })
                    }
                })
            }
        }
    }

    function ifExamSet(data) {

        if (data == "1900-01-01" || data == "") return "hidden"
        else return ""
    }
    function ifExamNotSet(data) {
        if (data == "1900-01-01" || data == "") return ""
        else return "hidden"
    }

    function convertTo12HourFormat(time24hr) {
        if (time24hr == "") {
            return ""
        }
        else {
            var timeTokens = time24hr.toString().split(":");
            var hours = parseInt(timeTokens[0]);
            var minutes = parseInt(timeTokens[1]);

            var ampm = "AM";
            if (hours >= 12) {
                ampm = "PM";
                if (hours > 12) {
                    hours -= 12;
                }
            }
            if (hours === 0) {
                hours = 12;
            }

            // Format hours and minutes to two digits
            var formattedHours = hours.toString().padStart(2, '0');
            var formattedMinutes = minutes.toString().padStart(2, '0');
            return formattedHours + ":" + formattedMinutes + " " + ampm;
        } 
    }
    s.fn_itemstatus = function (data) {
        if (data) {
            return "fa-check"
        }
        else {

            return "fa-arrow-right"
        }
    }
    s.fn_itemstatuslabel = function (data) {
        if (data) {
            return "IN PSB"
        }
        else {

            return "TO PSB"
        }
    }
    s.fn_status2 = function (data) {
        if (data) {
            return "In psb schedule"
        }
        else {
            return "Not in psb schedule"
        }
    }

    s.viewDates = function (row) {
        cs.loading("show")
        var dt = s.Applicant_List_Data[row]
        h.post("../cApplicantsReview/ViewDates", {
            app_ctrl_nbr : dt.app_ctrl_nbr
        }).then(function (d) {
            if (d.data.icon = "success") {
                cs.populateFormFields("viewdatesform", d.data.viewdates[0])
                $("#viewdates").modal()
                cs.loading("hide")
            }
            else {

                swal({ title: d.data.message, icon: d.data.icon })
                cs.loading("hide")

            }
        })
    }
    s.viewExam = function (row) {
        
        cs.loading("show")
        var dt = s.Applicant_OnlineExam_Data[row]
        s.exam_row = row
        s.exam_app_ctrl_nbr = dt.app_ctrl_nbr
        h.post("../cApplicantsReview/ViewExam", {
            app_ctrl_nbr: dt.app_ctrl_nbr
        }).then(function (d) {
            if (d.data.icon = "success") {
                if (d.data.viewexam.length > 0) {
                    addvalue("exam_app_ctrl_nbr", dt.app_ctrl_nbr)
                    
                    addvalue("score_rendered2", parseFloat((d.data.viewexam[0].score_rendered * 100)/25))
                    addvalue("exam_type_descr2", d.data.viewexam[0].exam_type_descr)
                    addvalue("exam_date2", d.data.viewexam[0].exam_date)
                    if (d.data.viewexam[0].score_rendered == "") {
                        $("#setexambtn").prop("disabled", false)
                    } else {
                        $("#setexambtn").prop("disabled", true)
                    }
                    cs.validatesubmit("exam_fields")
                }
                else {
                   
                    $("#setexambtn").prop("disabled", false)
                    addvalue("exam_app_ctrl_nbr", dt.app_ctrl_nbr)
                    addvalue("score_rendered2", "")
                    addvalue("exam_type_descr2", "")
                    addvalue("exam_date2", "")
                    addvalue("score_perc_disp", "")
                }
                s.calculate_perc()
                $("#exam_rating").modal()
               
                cs.loading("hide")
            }
            else {
                swal({ title: d.data.message, icon: d.data.icon })
                
                cs.loading("hide")
            }
        })
    }


    s.calculate_perc = function () {
        var score = $("#score_rendered2").val()
        var score_perc = ((parseFloat(score)*25) /100) 
        if (isNaN(score_perc)) {
            return
        }
        console.log(score_perc)
        addvalue("score_perc_disp", score_perc)
    }


    s.saveExamRating = function () {
      
        if (cs.validatesubmit("exam_fields")) {
            var exam_app_ctrl_nbr = $("#exam_app_ctrl_nbr").val()
            var score_rendered2 = 0.00
            var score = $("#score_rendered2").val()
            if (score > 25) {
                var score_rendered2 = ((parseFloat(score) * 25) / 100)
            }
            else {
                var score_rendered2 = $("#score_rendered2").val()
            }


            var exam_type_descr2   = $("#exam_type_descr2 ").val()
            var exam_date2         = $("#exam_date2       ").val()
            h.post("../cApplicantsReview/SaveExam", {
                 app_ctrl_nbr       : exam_app_ctrl_nbr
                ,score_rendered     : score_rendered2  
                ,exam_type_descr    : exam_type_descr2 
                ,exam_date          : exam_date2       
            }).then(function (d) {
                swal({ title: d.data.message, icon: d.data.icon})
                cs.loading("hide")
            })
        }
    }

   //s.addRow = function (row) {
   //    var dt = s.item_grid_List2[row]
   //    var cbrow = $("#top5CbRow" + row)[0].checked
   //
   //    if (cbrow) {
   //        var ex = s.selectedItemRow.filter(function (d) {
   //            return d.item_no == dt.item_no
   //        })
   //        if (ex.length == 0) {
   //            s.selectedItemRow.push(dt)
   //        }
   //    }
   //    else {
   //        s.selectedItemRow = s.selectedItemRow.filter(function (d) {
   //            return d.item_no != dt.item_no
   //        })
   //    }
   //
   //
   //}

    s.addToHRMPSBCB = function (row) {
        var dt = s.Applicant_Top5_Data[row]

        if (!cs.Validate1Field2("psb_ctrl_nbr_disp", "Required Field")) {
            $("#hrmpsbCbRow" + row).prop("checked",false)
            return
        }

        var cbrow = $("#hrmpsbCbRow" + row)[0].checked
        var activeTab = $(".nav-tabs li.active").prop("id")
        var psb_ctrl_nbr = $("#psb_ctrl_nbr_disp").val()
        if (cbrow) {
            var ex = s.selectedAppRow4HRMPSB.filter(function (d) {
                return d.app_ctrl_nbr == dt.app_ctrl_nbr
            })
            if (ex.length == 0) {

                s.selectedAppRow4HRMPSB.push(
                    {
                        "app_ctrl_nbr": dt.app_ctrl_nbr
                        , "item_no": dt.item_no
                        , "employment_type": dt.employment_type
                        , "budget_code": dt.budget_code
                        , "hiring_period": dt.hiring_period
                        , "department_code": dt.department_code
                        , "psb_ctrl_nbr": psb_ctrl_nbr
                    }
                )
            }
        }
        else {
            s.selectedAppRow4HRMPSB = s.selectedAppRow4HRMPSB.filter(function (d) {
                return d.app_ctrl_nbr != dt.app_ctrl_nbr
            })
        }

        if (s.selectedAppRow4HRMPSB.length > 0 && activeTab == "3") {
            $("#addToHRMPSBBtn").removeClass("hidden")
        }
        else {
            $("#addToHRMPSBBtn").addClass("hidden")
        }
    }
    s.addtoHRMPSBAll = function () {
        cs.loading("show")
        h.post("../cApplicantsReview/addToPSBAll", {
            data: s.selectedAppRow4HRMPSB
        }).then(function (d) {
            s.Applicant_List_Data = d.data.review_list
            s.Applicant_List_Data_Orig = d.data.review_list
            tab_table_data(d.data.review_list)
            swal({ title: d.data.message, icon: d.data.icon })
            s.selectedAppRow4HRMPSB = []
            $("#addToHRMPSBBtn").addClass("hidden")
            cs.loading("hide")
        })
    }

    s.addToHRMPSBScreening = function (row) {

        var dt = s.Applicant_Top5_Data[row]

        if (cs.Validate1Field2("psb_ctrl_nbr_disp", "Required Field")) {
            var psb_ctrl_nbr = $("#psb_ctrl_nbr_disp").val()
            var item_no = dt.item_no;
            var budget_code = dt.budget_code
            var employment_type = dt.employment_type
            var hiring_period = dt.hiring_period
            var department_code = dt.department_code
            var app_ctrl_nbr = dt.app_ctrl_nbr

            cs.loading("show")

            swal({
                title: "Add Applicant to HRMPS Schedule",
                text: "Would you like to proceed?",
                icon: "info",
                buttons: ["No", "Yes"],
                dangerMode: true,
            }).then(function (yes) {
                if (yes) {
                    //currentPageNumber();
                    h.post("../cApplicantsReview/addToPSB", {
                          item_no: item_no
                        , app_ctrl_nbr: app_ctrl_nbr
                        , employment_type: employment_type
                        , budget_code: budget_code
                        , hiring_period: hiring_period
                        , psb_ctrl_nbr: psb_ctrl_nbr
                        , department_code: department_code
                    }).then(function (d) {
                        if (d.data.icon == "success") {

                            h.post("../cApplicantsReview/sp_psb_pnl_rtg_tbl_qsupdate", {
                                  app_ctrl_nbr: app_ctrl_nbr
                                , psb_ctrl_nbr: psb_ctrl_nbr
                                , employment_type: employment_type
                                , budget_code: budget_code
                                , hiring_period: hiring_period
                                , item_no: item_no
                            }).then(function (d) {
                                if (d.data.icon == "success") {
                                    s.Applicant_List_Data = d.data.review_list
                                    s.Applicant_List_Data_Orig = d.data.review_list
                                    tab_table_data(d.data.review_list)
                                }

                                swal(d.data.message, {icon: d.data.icon })
                                cs.loading("hide")
                            })
                        }
                        else {
                            swal({ title: d.data.message, icon: d.data.icon })
                            cs.loading("hide")
                        }


                    })
                }
                else {
                    cs.loading("hide")
                }
            });

        }

    }



    s.addToTop5CB = function (row) {
       // s.qualifiedForExamList
        var dt = s.Applicant_OnlineExam_Data[row]
        console.log(dt)
        var cbrow = $("#top5CbRow" + row)[0].checked
        var activeTab = $(".nav-tabs li.active").prop("id")
        if (cbrow) {
            //insert list qualified for top 5
            if (dt.score_rendered == "0"||dt.score_rendered == 0 ||dt.score_rendered == null || dt.score_rendered == "" || dt.score_rendered == undefined) {
            }
            else {
                var ex = s.selectedAppRow4Top5.filter(function (d) {
                    return d.app_ctrl_nbr == dt.app_ctrl_nbr
                })
                if (ex.length == 0) {

                    s.selectedAppRow4Top5.push(
                        {
                            "app_ctrl_nbr": dt.app_ctrl_nbr
                            , "item_no": dt.item_no
                            , "employment_type": dt.employment_type
                            , "budget_code": dt.budget_code
                            , "hiring_period": dt.hiring_period
                        }
                    )
                }
            }


            //insert list qualified for top 5
            if (dt.score_rendered == "0" || dt.score_rendered == 0 || dt.score_rendered == null || dt.score_rendered == "" || dt.score_rendered == undefined) {
                var ex = s.qualifiedForExamList.filter(function (d) {
                    return d.app_ctrl_nbr == dt.app_ctrl_nbr
                })
                if (ex.length == 0) {

                    s.qualifiedForExamList.push(
                        {
                             "app_ctrl_nbr": dt.app_ctrl_nbr
                            , "item_no": dt.item_no
                            , "employment_type": dt.employment_type
                            , "budget_code": dt.budget_code
                            , "hiring_period": dt.hiring_period
                        }
                    )
                }
            }
            
        }
        else {

            s.selectedAppRow4Top5 = s.selectedAppRow4Top5.filter(function (d) {
                return d.app_ctrl_nbr != dt.app_ctrl_nbr
            })
            s.qualifiedForExamList = s.qualifiedForExamList.filter(function (d) {
                return d.app_ctrl_nbr != dt.app_ctrl_nbr
            })
        }

        if (s.selectedAppRow4Top5.length > 0 && activeTab == "2") {
            $("#addToTop5Btn").removeClass("hidden")
        }
        else {
            $("#addToTop5Btn").addClass("hidden")
        }

        if (s.qualifiedForExamList.length > 0 && activeTab == "2") {
            $("#assignexamAll").removeClass("hidden")
        }
        else {
            $("#assignexamAll").addClass("hidden")
        }
    }

    s.addtoTop5All = function () {
       
        h.post("../cApplicantsReview/AddToTop5ExamineesAll", {
            data: s.selectedAppRow4Top5
        }).then(function (d) {
           
            s.Applicant_List_Data = d.data.review_list
            s.Applicant_List_Data_Orig = d.data.review_list
            tab_table_data(d.data.review_list)
            s.selectedAppRow4Top5 = []
            $("#addToTop5Btn").addClass("hidden")
            swal({ title: d.data.message, icon: d.data.icon })
            
            cs.loading("hide")
        })
    }


    s.addToTop5Examinees = function (row) {
        var dt = s.Applicant_OnlineExam_Data[row]
        swal({
            title: "Add Applicant to Top 5 Examinees",
            text: "Would you like to proceed?",
            icon: "info",
            buttons: ["No", "Yes"],
            dangerMode: true,
        }).then(function (yes) {
            if (yes) {
                //currentPageNumber();
                h.post("../cApplicantsReview/AddToTop5Examinees", {
                    app_ctrl_nbr: dt.app_ctrl_nbr
                }).then(function (d) {
                    if (d.data.icon == "success") {
                        s.Applicant_List_Data = d.data.review_list
                        s.Applicant_List_Data_Orig = d.data.review_list
                        tab_table_data(d.data.review_list)
                    }
                    swal({ title: d.data.message, icon: d.data.icon })

                    cs.loading("hide")
                })
            }
            else {
                cs.loading("hide")
            }
        });
    }


                
    s.removeFromTop5Examinees = function (row) {
        var dt = s.Applicant_Top5_Data[row]
        swal({
            title: "Remove Applicant from Qualified Examinees",
            text: "Would you like to proceed?",
            icon: "info",
            buttons: ["No", "Yes"],
            dangerMode: true,
        }).then(function (yes) {
            if (yes) {
                //currentPageNumber();
                h.post("../cApplicantsReview/RemoveFromTop5Examinees", {
                    app_ctrl_nbr: dt.app_ctrl_nbr
                }).then(function (d) {
                    if (d.data.icon == "success") {
                        s.Applicant_List_Data = d.data.review_list
                        s.Applicant_List_Data_Orig = d.data.review_list
                        tab_table_data(d.data.review_list)
                    }
                    swal({ title: d.data.message, icon: d.data.icon })
                    cs.loading("hide")
                })
            }
            else {
                cs.loading("hide")
            }
        });
    }


    s.removeFromShortlist = function (row) {
        var dt = s.Applicant_OnlineExam_Data[row]
        swal({
            title: "Remove Applicant from Qualified Examinees",
            text: "Would you like to proceed?",
            icon: "info",
            buttons: ["No", "Yes"],
            dangerMode: true,
        }).then(function (yes) {
            if (yes) {
                h.post("../cApplicantsReview/RemoveFromShortlist", {
                    app_ctrl_nbr: dt.app_ctrl_nbr
                }).then(function (d) {
                    if (d.data.icon == "success") {
                        s.Applicant_List_Data = d.data.review_list
                        s.Applicant_List_Data_Orig = d.data.review_list
                        tab_table_data(d.data.review_list)
                    }

                    swal({ title: d.data.message, icon: d.data.icon })

                    cs.loading("hide")
                })
            }
            else {
                cs.loading("hide")
            }
        });
        
    }

   
    s.removeFromHRMPSBScreening = function (row) {

        var dt = s.Applicant_Hrmpsb_Data[row]
        console.log(dt)
           
                var psb_ctrl_nbr = dt.psb_ctrl_nbr;
                var item_no = dt.item_no;
                var budget_code = dt.budget_code;
                var employment_type = dt.employment_type;
                var hiring_period = dt.hiring_period;
                var app_ctrl_nbr = dt.app_ctrl_nbr;
        if (psb_ctrl_nbr == "") {
            swal({ title: "The applicant has not yet been added to the HRMPSB screening!", icon: "error" })
            return
        }

        cs.loading("show")
       
        swal({
            title: "Remove Applicant from HRMPS Schedule",
            text: "Would you like to proceed?",
            icon: "info",
            buttons: ["No", "Yes"],
            dangerMode: true,
        }).then(function (yes) {
            if (yes) {
                //currentPageNumber();
                h.post("../cApplicantsReview/removeFromPsb", {
                    item_no: item_no
                    , app_ctrl_nbr: app_ctrl_nbr
                    , employment_type: employment_type
                    , budget_code: budget_code
                    , hiring_period: hiring_period
                    , psb_ctrl_nbr: psb_ctrl_nbr
                }).then(function (d) {
                    if (d.data.icon == "success") {
                        s.Applicant_List_Data = d.data.review_list
                        s.Applicant_List_Data_Orig = d.data.review_list
                        tab_table_data(d.data.review_list)
                    }

                    swal({ title: d.data.message, icon: d.data.icon })
                    cs.loading("hide")
                })
            }
            else {
                cs.loading("hide")
            }
        });
             
                
            
       
    }

    s.sendEmailNotification = function (row_id, type) {
         cs.loading("show")
         row_for_email = row_id
         type_for_email = type
        var dt = [] 
      
        var swal_title = ""
        var swal_text = ""
       
   
       


        if (type == "1") {
            dt = s.Applicant_Review_Data[row_id]
            swal_title = "Send Acknowledgement Email"
            swal_text = "Are you sure you want to send an acknowledgement email to this applicant? Please double-check your action!"


        } else if (type == "2") {

            dt = s.Applicant_Review_Data[row_id]
            swal_title = "Not Qualified for Examination Email"
            swal_text = "Are you sure you want to inform this applicant that they did not qualify for the examination? Please double-check your action!"


        } else if (type == "3") {
            dt = s.Applicant_OnlineExam_Data[row_id]
            swal_title = "Qualified for Online Examination Email"
            swal_text = "Are you sure you want to inform this applicant that they qualify for the examination? Please double-check your action!"


        } else if (type == "5") {
            dt = s.Applicant_Hrmpsb_Data[row_id]
            swal_title = "Notify For HRMPSB Screening"
            swal_text = "Are you sure you want to notify this applicant that they are included for the HRMPSB Screening? Please double-check your action!"

        } else if (type == "6") {
            dt = s.Applicant_OnlineExam_Data[row_id]
            swal_title = "Notify not in top 5 Examinees"
            swal_text = "Are you sure you want to notify this applicant that they are not in the top 5 examinees? Please double-check your action!"
        }




        if (dt.app_ctrl_nbr == null || dt.app_ctrl_nbr == "") {
            swal({ title:"The applicant has not been fetched yet!", icon: "error" })
            cs.loading("hide")
            return
        }

        if (dt.exam_date == "" || dt.exam_date == null) {
            swal({ title:"No exam date has been added to this application", icon: "error" })
            cs.loading("hide")
            return
        }

        if (dt.email_address == "" || dt.email_address == null) {
            swal({ title:"This applicant has not provided an email address", icon: "error" })
            cs.loading("hide")
            return
        }

        s.emailreceipent = dt.email_address

        if (type == "1" && dt.email_aknowldge_dttm != "") {
           
            swal_title = "You have already sent an acknowledgment email for this applicant"
            swal_text = "Would you like to resend this notification?"
           
        } else if (type == "2" && dt.email_aknowldge_regret_dttm != "") {

            
            swal_title="You have already sent a notification email to this applicant indicating that they were not qualified for the position"
            swal_text = "Would you like to resend this notification?"
            
        } else if (type == "3" && dt.email_noti_exam_dttm != "") {
            
            swal_title="You have already sent a notification email to this applicant regarding the schedule of the online examination"
            swal_text = "Would you like to resend this notification?"
            
        } else if (type == "5" && dt.email_noti_hrmpsb_dttm != "") {

            swal_title="You have already sent a notification email to this applicant regarding the screening schedule"
            swal_text = "Would you like to resend this notification?"
            
        } else if (type == "6" && dt.email_notintop5_dttm != "") {
           
            swal_title = "You have already sent a notification email to this applicant indicating that they are not included in the top 5 examinees"
             swal_text = "Would you like to resend this notification?"
        }
        
        h.post("../cApplicantsReview/GetEmailNotification2", {
              dt: dt
            , email_type: type
        }).then(function (d) {
            cs.loading("hide")
            if (d.data.icon == "success") {
                swal({
                    title: swal_title,
                    text: swal_text,
                    icon: "info",
                    buttons: ["No", "Yes"],
                    dangerMode: true,
                }).then(function (yes) {
                    if (yes) {
                        s.email_settup = d.data.email_settup
                        summernote.code(d.data.email_settup.email_body)
                        $("#sendnotif_modal").modal("show")
                        cs.loading("hide")
                    }
                });
            }
            else {
                swal({title:d.data.message,  icon: d.data.icon })
              
            }
        })
       


    }


    s.printEmailNotif = function (row_id, type) {
        var dt = []

        var email           = ""  
        var empl_id         = ""
        var app_ctrl_nbr    = ""
        var hiring_period   = ""
       
        
        s.employee_name_print = 'EMAIL REPORT';
        var SaveName = "Crystal_Report";
        var ReportType = "inline";
        var ReportPath = "~/Reports/cryEmailPrinting/";
        var ReportName = "";
        var sp = "";

        if (type == "1") {
            dt = s.Applicant_Review_Data[row_id];
            swal_title = "Send Acknowledgement Email"

            ReportName = "cryAknowledgement";
            email = dt.email_add;
            empl_id = dt.empl_id;
            app_ctrl_nbr = dt.app_ctrl_nbr;
            hiring_period = dt.hiring_period;
           

        } else if (type == "2") {

            dt = s.Applicant_Review_Data[row_id]
            swal_title = "Not Qualified for Examination Email"

            ReportName = "cryNotQualifiedForExam";

            email = dt.email_add;
            empl_id = dt.empl_id;
            app_ctrl_nbr = dt.app_ctrl_nbr;
            hiring_period = dt.hiring_period;


        } else if (type == "3") {
            dt = s.Applicant_OnlineExam_Data[row_id]
            swal_title = "Qualified for Online Examination Email"

            ReportName = "cryNotifForOnlineExam";

            email = dt.email_add
            empl_id = dt.empl_id
            app_ctrl_nbr = dt.app_ctrl_nbr
            hiring_period = dt.hiring_period

        } else if (type == "5") {
            dt = s.Applicant_Hrmpsb_Data[row_id]
            swal_title = "Notify For HRMPSB Screening"

            ReportName = "cryNoticeForHRMPSB";

            email = dt.email_add
            empl_id = dt.empl_id
            app_ctrl_nbr = dt.app_ctrl_nbr
            hiring_period = dt.hiring_period

        } else if (type == "6") {
            dt = s.Applicant_OnlineExam_Data[row_id]
            swal_title = "Notify not in top 5 Examinees"

            ReportName = "cryNotifNotInTop5Examinee";

            email = dt.email_add
            empl_id = dt.empl_id
            app_ctrl_nbr = dt.app_ctrl_nbr
            hiring_period = dt.hiring_period
        }

        
        ReportPath = ReportPath + "" + ReportName + ".rpt";
        sp = "sp_send_email_notification_PRINT,p_email," + email + ",p_empl_id," + empl_id + ",p_app_ctrl_nbr," + app_ctrl_nbr + ",p_hiring_period," + hiring_period + ",p_email_type," + type;

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
    }


    //s.printPageArea = function (areaID) {
    //    var areaID = "summernote2"
    //    var printContent = document.getElementById(areaID).innerHTML;
    //    var originalContent = document.body.innerHTML;
    //    document.body.innerHTML = printContent;
    //    window.print();
    //    document.body.innerHTML = originalContent;
    //}


    s.sendEmailNotification2 = function () {

       
        var row_id = parseInt(row_for_email);
        var type = parseInt(type_for_email);
        var dt = {}
        if (type == 1 || type == 2) {
           
            dt = s.Applicant_Review_Data[row_id]
        }
        else if (type == 3 || type == 6) {
          
            dt = s.Applicant_OnlineExam_Data[row_id]
        }
        else if (type == 3 || type == 6) {
           
            dt = s.Applicant_OnlineExam_Data[row_id]
        }
        else if (type == 5) {
           
            dt = s.Applicant_Hrmpsb_Data[row_id]
        }

     
        
        var data = []
        var email_data = s.email_settup

        $("#btnsendemailicon").removeClass('fa fa-send');
        $("#btnsendemailicon").addClass("fa fa-spinner fa-spin");
        $("#buttonsendemail").prop("disabled", true);
        $("#buttonsendemailcancel").prop("disabled", true);
        

        email_data.email_body = summernote.code()

        //console.log(dt)
        //return
        h.post("../cApplicantsReview/sendEmailNotification2", {
              dt: dt
            , email_type: type
            , email_settup: email_data
        }).then(function (d) {


            var se = d.data.se

            s.Applicant_List_Data[row_id].email_aknowldge_dttm = se.email_aknowldge_dttm
            s.Applicant_List_Data[row_id].email_aknowldge_regret_dttm = se.email_aknowldge_regret_dttm
            s.Applicant_List_Data[row_id].email_noti_exam_dttm = se.email_noti_exam_dttm
            s.Applicant_List_Data[row_id].email_regret_dttm = se.email_regret_dttm
            s.Applicant_List_Data[row_id].email_noti_hrmpsb_dttm = se.email_noti_hrmpsb_dttm
            s.Applicant_List_Data[row_id].email_notintop5_dttm = se.email_notintop5_dttm
            s.Applicant_List_Data[row_id].email_congratulatory_dttm = se.email_congratulatory_dttm



            setTimeout(function () {
                s.APL_List_Data.refreshTable("APL_List_Grid", "" + row_id);
            }, 500)



            swal({ title: d.data.message, icon: d.data.icon })


            $("#btnsendemailicon").removeClass("fa fa-spinner fa-spin");
            $("#btnsendemailicon").addClass('fa fa-send');
            $("#buttonsendemail").prop("disabled", false);
            $("#buttonsendemailcancel").prop("disabled", false);
        });
        
    }
    

    var Init_sendemail_List_Grid = function (par_data) {
        s.Sendemail_List_Data = par_data;
        s.Sendemail_List_Table = $('#sendemail_List_Grid').dataTable(
            {
                data: s.Sendemail_List_Data,
                sDom: 'rt<"bottom"p>',
                pageLength: 10,
                columns: [
                    {
                        "mData": null, "mRender": function (data, type, full, row) {
                            return "<i id='icn3" + row["row"] + "' class='text-info fa fa-check-circle hidden'></i>";
                        },
                    },
                    {
                        "mData": "app_ctrl_nbr_disp", "mRender": function (data, type, full, row) {
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
                        "mData": "position_long_title",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-left btn-block'>" + data + "</span>"
                        }
                    }
                    ,{
                        "mData": "app_status_short_descr",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-left btn-block'>" + data + "</span>"
                        }
                    }
                    , {
                        "mData": "item_no",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-center btn-block'>" + data + "</span>"
                        }
                    }

                   
                    ,{
                        "mData": "empl_id",
                        "bSortable": false,
                        "mRender": function (data, type, full, row) {
                            return '<center><div class="btn-group">' +
                                '<button type="button" id="btninclude' + row["row"] + '" class="btn btn-success btn-sm action" ng-click="includeNemail(' + row["row"] + ')" data-toggle="tooltip" data-placement="left" title="Include to email">  <i id="icnemialbtn' + row["row"] + '" class="fa fa-plus"></i></button >' +
                                '</div></center>';
                            //return '<label class="container">' +
                            //    '<input class="includeNemail" type="checkbox" row="' + row["row"] + '"  ng-checked="' + CheckedToEmailList(data)+'"/>' +
                            //    '<span class="educ' + row["row"] + ' checkmark"></span></label>'
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

    var Init_sendemail_List_Grid2 = function (par_data) {
        s.Sendemail_List_Data2 = par_data;
        s.Sendemail_List_Table2 = $('#sendemail_List_Grid2').dataTable(
            {
                data: s.Sendemail_List_Data2,
                sDom: 'rt<"bottom"p>',
                pageLength: 10,
                columns: [
                    {
                        "mData": null, "mRender": function (data, type, full, row) {
                            return "<i id='icn3" + row["row"] + "' class='text-info fa fa-check-circle hidden'></i>";
                        },
                    },
                    {
                        "mData": "app_ctrl_nbr", "mRender": function (data, type, full, row) {
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
                        "mData": "email_address",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-left btn-block'>" + data + "</span>"
                        }
                    }
                    , {
                        "mData": "status",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-left btn-block'>" + sendStatus(data)+ "</span>"
                        }
                    }
                   

                    , {
                        "mData": "status",
                        "bSortable": false,
                        "mRender": function (data, type, full, row) {
                            return '<center><div class="btn-group">' +
                                '<button type="button" class="btn btn-info btn-sm action"><i id="icnemialbtn' + row["row"] + '" class="' + sendStatusIcon(data) + '"></i></button >' +
                                '</div></center>';
                            //return '<label class="container">' +
                            //    '<input class="includeNemail" type="checkbox" row="' + row["row"] + '"  ng-checked="' + CheckedToEmailList(data)+'"/>' +
                            //    '<span class="educ' + row["row"] + ' checkmark"></span></label>'
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

    function sendStatus(data) {
        if (data == false) 
        {
            return "Sending..."
        }
        else {
            return "Send"
        }
    }
    function sendStatusIcon(data) {
        if (data == false) {
            return "fa fa-spinner fa-spin"
        }
        else {
            return "fa fa-check"
        }
    }


    var Init_select_applicant_APL_Grid = function (par_data) {
        s.select_applicant_PDS_Data = par_data;
        s.select_applicant_PDS_Table = $('#select_id_employee_PDS_grid').dataTable(
            {
                data: s.select_applicant_PDS_Data,
                sDom: 'rt<"bottom"p>',
                pageLength: 10,
                columns: [
                    {
                        "mData": "empl_id",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-center btn-block'>" + data + "</span>"
                        }
                    },
                    {
                        "mData": "last_name",
                        "mRender": function (data, type, full, row) { return "<span class='text-center btn-block'>" + data + "</span>" }
                    },

                    {
                        "mData": "first_name",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-left btn-block'>" + data + "</span>"
                        }
                    },
                    {
                        "mData": "birth_date",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-left btn-block'>" + data + "</span>"
                        }
                    },

                    {
                        "mData": null,
                        "bSortable": false,
                        "mRender": function (data, type, full, row) {

                            return '<center><div class="btn-group">' +
                                '<button  type="button" class="btn btn-success btn-sm action" ng-click="updatefrompds(' + row["row"] + ')" >  <i class="fa fa-plus"></i>&nbsp;&nbsp;Update</button >' +
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
    var Init_select_applicant_QS_Grid = function (par_data) {
        s.select_applicant_QS_Data = par_data;
        s.select_applicant_QS_Table = $('#select_id_employee_QS_grid').dataTable(
            {
                data: s.select_applicant_QS_Data,
                sDom: 'rt<"bottom"p>',
                pageLength: 10,
                columns: [
                    {
                        "mData": "empl_id",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-center btn-block'>" + data + "</span>"
                        }
                    },
                    {
                        "mData": "last_name",
                        "mRender": function (data, type, full, row) { return "<span class='text-center btn-block'>" + data + "</span>" }
                    },

                    {
                        "mData": "first_name",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-left btn-block'>" + data + "</span>"
                        }
                    },
                    {
                        "mData": "birth_date",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-left btn-block'>" + data + "</span>"
                        }
                    },

                    {
                        "mData": null,
                        "bSortable": false,
                        "mRender": function (data, type, full, row) {

                            return '<center><div class="btn-group">' +
                                '<button  type="button" class="btn btn-success btn-sm action" ng-click="updatefromqspds(' + row["row"] + ')" >  <i class="fa fa-plus"></i>&nbsp;&nbsp;Update</button >' +
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

    var Init_PsbSchedule_Grid = function (par_data) {
        s.PsbSchedule_Data = par_data;
        s.PsbSchedule_Table = $('#psbschedule_grid').dataTable(
            {
                data: s.PsbSchedule_Data,
                sDom: 'rt<"bottom"p>',
                pageLength: 10,
                columns: [

                    {
                        "mData": "psb_ctrl_nbr",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-center btn-block'>" + data + "</span>"
                        }
                    },
                    {
                        "mData": "psb_date",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-center btn-block'>" + data  + "</span>"
                        }
                    },
                    {
                        "mData": "remarks_details",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-left btn-block'>" + data + "</span>"
                        }
                    },
                    {
                        "mData": "psb_status_descr",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-center btn-block'>" + data + "</span>"
                        }
                    },
                    {
                        "mData": "psb_status",
                        "mRender": function (data, type, full, row) {

                            return '<center><div class="btn-group">' +
                                '<button  type="button" class="btn btn-success btn-md action" data-toggle="tooltip" data-placement="top" title="Add Item" ng-click="btn_addPsb(' + row["row"] + ')" ng-disabled="' + s.fn_psbstatus_abl(data)+'"><i id="icn_btn' + row["row"]+'"  class="fa fa-plus"></i></button >' +
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
    s.fn_psbstatus = function (data) {
        if (data == 0) {
            return "Scheduled"
        } else if (data == 1) {
            return "On-going"
        }else if (data == 2) {
            return "Concluded"
        }else if (data == 3) {
            return "Has approved application"
        }
    }

    s.fn_psbstatus_abl = function (data) {
        if (data == 0) {
            return false
        } else if (data == 1) {
            return false
        } else if (data == 2) {
            return true
        } else if (data == 3) {
            return true
        }
    }
    function CheckedToEmailList(id) {
        var dt = s.includeToEmail.filter(function (d) {
            return d.empl_id == id
        })

        if (dt.length > 0) {
            return true
        }
        else {
            return false
        }

    }

	function BoleanTest(dataTest, trueValue) {
		if (dataTest == trueValue || dataTest == (parseInt(trueValue) + 1).toString()) {
			return false;
		}

		else {
			return true;
		}
	}

	function pass(data)
	{
		if(data == "2")
		{
			return true;
		}
		else
		{
			return false;
		}
	}

	function disabled(data) {
		if (data == "2") {
			return true
		}
		else if (s.app_status != "1")
		{
			return true
		}
		else {
			return false
		}
	}


	var Init_Panel_List_Grid = function (par_data) {
		s.Panel_List_Data = par_data;
		s.Panel_List_Table = $('#psb_panel').dataTable(
			{
				data: s.Panel_List_Data,
				sDom: 'rt<"bottom"p>',
				pageLength: 10,
				columns: [
					 {
						 "mData": "panel_user_id",
						"mRender": function (data, type, full, row) {
							return "<span class='text-left btn-block'>" + data + "</span>"
						}
					},
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
						"mData": "agency",
						"mRender": function (data, type, full, row) {

							return "<span class='text-left btn-block'>" + data + "</span>"
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

    var Init_ExamSchedule_Grid = function (par_data) {
        s.ExamSchedule_Data = par_data;
        s.ExamSchedule_Table = $('#examschedule_grid').dataTable(
            {
                data: s.ExamSchedule_Data,
                sDom: 'rt<"bottom"p>',
                pageLength: 10,
                columns: [

                    {
                        "mData": "exam_date",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-center btn-block'>" + data + "</span>"
                        }
                    },
                    {
                        "mData": "exam_type",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-center btn-block'>" + data + "</span>"
                        }
                    },
                    {
                        "mData": "exam_location",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-left btn-block' style='font-size:13px;'>" + data + "</span><br>" +
                                "<span class='text-left btn-block no-padding text-info " + vw_zoomdt(full["exam_type"]) + "' style='margin-top:-18px;font-size:12px;'>Meeting ID: " + full["zoom_meeting_id"] + "</span></br>" +
                                "<span class='text-left btn-block no-padding text-info " + vw_zoomdt(full["exam_type"]) + "' style='margin-top:-18px;font-size:12px;'>Passcode: " + full["zoom_passcode"] + "</span></br>"

                        }
                    },
                    {
                        "mData": "exam_time",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-center btn-block'>" + convertTo12HourFormat(data) + "</span>"
                        }
                    },

                    {
                        "mData": "selected_schedule",
                        "mRender": function (data, type, full, row) {
                            return '<div>' +
                                '<div class="btn-group">' +
                                '<button ng-hide="'+data+'" class="btn btn-info btn-sm dropdown-toggle btn-grid" type="button" data-toggle="dropdown" data-placement="top" title="Set exam schedule" ng-click="set_exam_schedule(' + row["row"] + ')">Set Exam</button>' +
                                '<button ng-show="'+data+'" class="btn btn-success btn-sm dropdown-toggle btn-grid" type="button" data-toggle="dropdown" data-placement="top" title="Selected exam schedule">Selected</button>' +
                               
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

    var Init_ExamSchedule_Grid_All = function (par_data) {
        s.ExamSchedule_Data_All = par_data;
        s.ExamSchedule_Table_All = $('#examschedule_grid_All').dataTable(
            {
                data: s.ExamSchedule_Data_All,
                sDom: 'rt<"bottom"p>',
                pageLength: 10,
                columns: [

                    {
                        "mData": "exam_date",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-center btn-block'>" + data + "</span>"
                        }
                    },
                    {
                        "mData": "exam_type",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-center btn-block'>" + data + "</span>"
                        }
                    },
                    {
                        "mData": "exam_location",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-left btn-block' style='font-size:13px;'>" + data + "</span><br>" +
                                "<span class='text-left btn-block no-padding text-info " + vw_zoomdt(full["exam_type"]) + "' style='margin-top:-18px;font-size:12px;'>Meeting ID: " + full["zoom_meeting_id"] + "</span></br>" +
                                "<span class='text-left btn-block no-padding text-info " + vw_zoomdt(full["exam_type"]) + "' style='margin-top:-18px;font-size:12px;'>Passcode: " + full["zoom_passcode"] + "</span></br>"

                        }
                    },
                    {
                        "mData": "exam_time",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-center btn-block'>" + convertTo12HourFormat(data) + "</span>"
                        }
                    },

                    {
                        "mData": "selected_schedule",
                        "mRender": function (data, type, full, row) {
                            return '<div>' +
                                '<div class="btn-group">' +
                                '<button class="btn btn-info btn-sm dropdown-toggle btn-grid" type="button" data-toggle="dropdown" data-placement="top" title="Set exam schedule" ng-click="set_exam_schedule_All(' + row["row"] + ')">Set Exam</button>' +
                                //'<button class="btn btn-success btn-sm dropdown-toggle btn-grid" type="button" data-toggle="dropdown" data-placement="top" title="Selected exam schedule">Selected</button>' +

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

	function fltr(data) {
		if (cs.elEmpty(s.app_status))
		{
            return data
		}
		else {
			return data.filter(function (d) {
				return d.app_status == s.app_status
			})
		}
		
	}

    function vw_zoomdt(data) {
        if (data == "Online Examination") {
            return ""
        }
        else {
            return "hidden"
        }
    }

	function addvalue(id, value) {
		$("#" + id).val(value)
		s[id] = value
    }


    s.set_exam_schedule = function (row) {

        var dt = s.Applicant_OnlineExam_Data[parseInt(s.exam_row)]
        
        var exam_id = s.ExamSchedule_Data[row].exam_id
        currentPageNumber();
        h.post("../cApplicantsReview/SetExamSchedule", {
              app_ctrl_nbr       :dt.app_ctrl_nbr
             ,hiring_period      :dt.hiring_period
             ,item_no            :dt.item_no
             ,budget_code        :dt.budget_code
             ,employment_type: dt.employment_type 
             ,exam_id           :exam_id 
        }).then(function (d) {
            swal({ title: d.data.message, icon: d.data.icon })
          
            //var pagenumber = $("#Applicant_OnlineExam_Grid_paginate a.paginate_button.current")[0].text;
            //s.Applicant_OnlineExam_Data = d.data.review_list.refreshTable2x("Applicant_OnlineExam_Grid", pagenumber)
            tab_table_data(d.data.review_list)
            $("#examScheduleGridModal").modal("hide")
        })
        

    }

    
   

    function init() {
        var employment_type = ""
        var budget_code = ""
        var item_no = ""
        var goquery_budgetyear = true
        cs.loading("show")
        s.rowLen = "10"

        $("#item_display").css("display", "none")

        $("#item_nbr1").select2().on('change', function (e) {
            s.selectItem()
        });

        $("#department_code1").select2().on('change', function (e) {
            s.selectDepartment()
        });

       


        if (localStorage.getItem('budget_year1') == null || localStorage.getItem('budget_year1') == "undefined") {
            s.budget_year = []
        }
        else {
            var ls_array = JSON.parse(localStorage['budget_year1']);
            s.budget_year = ls_array
        }
       
        if (localStorage.getItem('hiringperiodlist1') == null || localStorage.getItem('hiringperiodlist1') == "undefined") {
            s.hiringperiodlist = []
        }
        else {
            var ls_array = JSON.parse(localStorage['hiringperiodlist1']);
            s.hiringperiodlist = ls_array
        }

        if (localStorage.getItem('department1') == null || localStorage.getItem('department1') == "undefined") {
            s.department = []
        }
        else {
            var ls_array = JSON.parse(localStorage['department1']);
            s.department = ls_array
        }

        if (localStorage.getItem('items1') == null || localStorage.getItem('items1') == "undefined") {
            s.items = []
        }
        else {
            var ls_array = JSON.parse(localStorage['items1']);
            s.items = ls_array
        }
        if (localStorage.getItem('psb_sked_hdr1') == null || localStorage.getItem('psb_sked_hdr1') == "undefined") {
            s.psb_sked_hdr = []
        }
        else {
            var ls_array = JSON.parse(localStorage['psb_sked_hdr1']);
            s.psb_sked_hdr = ls_array
        }


       

        //ASSIGN VALUESON FILTER IF VALUES IS SET IN LOCAL STORAGE

        if (localStorage.getItem('employment_type1') == null || localStorage.getItem('employment_type1') == "undefined") {
            addvalue("employment_type", "")
        }
        else {
            addvalue("employment_type", localStorage['employment_type1'])
        }
        if (localStorage.getItem('budget_code1') == null || localStorage.getItem('budget_code1') == "undefined") {
            addvalue("budget_code", "")
        }
        else {
            addvalue("budget_code", localStorage['budget_code1'])
        }

        if (localStorage.getItem('hiring_period1') == null || localStorage.getItem('hiring_period1') == "undefined") {
            addvalue("hiring_period", "")
        }
        else {
            addvalue("hiring_period", localStorage['hiring_period1'])
        }

        if (localStorage.getItem('department_code1') == null || localStorage.getItem('department_code1') == "undefined") {
            addvalue("department_code1", "")
        }
        else {
            addvalue("department_code1", localStorage['department_code1'])
        }

        if (localStorage.getItem('item_nbr1') == null || localStorage.getItem('item_nbr1') == "undefined") {
            addvalue("item_nbr1", "")
        }
        else {
            addvalue("item_nbr1", localStorage['item_nbr1'])
        }

        
       
        

        if (localStorage.getItem('psb_ctrl_nbr1') == null || localStorage.getItem('psb_ctrl_nbr1') == "undefined") {
            addvalue("psb_ctrl_nbr_disp", "")
        }
        else {
            addvalue("psb_ctrl_nbr_disp", localStorage['psb_ctrl_nbr1'])
        }
        
        h.post("../cApplicantsReview/getApplication_status", {
           
        }).then(function (d) {
            s.application_status = d.data.application_status
        })
        
        GetReviewItem()

        $("#assignexamAll").addClass("hidden")
        $("#addToTop5Btn").addClass("hidden")
        $("#addToHRMPSBBtn").addClass("hidden")
      
	}
    Init_Position_List_Grid([])
    Init_Applicant_List_Grid([])
    Init_Applicant_Review_Grid([])
    Init_Applicant_OnlineExam_Grid([])
    Init_Applicant_Top5_Grid([])
    Init_Applicant_Hrmpsb_Grid([])
    Init_Panel_List_Grid([])
    Init_sendemail_List_Grid([])
    Init_sendemail_List_Grid2([])
    Init_select_applicant_APL_Grid([])
    Init_select_applicant_QS_Grid([])
    Init_PsbSchedule_Grid([])
    Init_ExamSchedule_Grid([])
    Init_ExamSchedule_Grid_All()
	init()


    s.changeApplicantsItem = function (row) {
        var dt = s.Applicant_Review_Data[row]
       
        $("#change_item_app_ctrl_nbr").val(dt.app_ctrl_nbr)
        $("#change_item_previous").val(dt.item_no)
        $("#change_item_employment_type").val($("#employment_type").val())
        $("#change_item_budget_code").val($("#budget_code").val())
        $("#change_item_hiring_period").val($("#hiring_period").val())
        $("#change_item_department_code").val("")
        $("#change_item_new").val("")
        $("#change_item_modal").modal("show")
    }

    s.change_item_selectDepartment = function () {
        // cs.loading("show")

        var employment_type = $("#change_item_employment_type").val()
        var budget_code = $("#change_item_budget_code").val()
        var hiring_period = $("#change_item_hiring_period").val()
        var department_code = $("#change_item_department_code").val()
        
        h.post("../cApplicantsReview/getPublicationVacant", {
            budget_code: budget_code,
            employment_type: employment_type,
            department_code: department_code,
            hiring_period: hiring_period
        }).then(function (d) {
            if (d.data.icon == "success") {
                s.change_item_items = d.data.items
            }
            else {
                console.log(d.data.message)
            }
            cs.loading("hide")
        })

    }
    s.changeItem = function () {

        if (cs.validatesubmit("change_item")) {
            var position_code = "";
           
            var app_ctrl_nbr = $("#change_item_app_ctrl_nbr").val()
            var item_no_previous = $("#change_item_previous").val()
            var department_code = $("#change_item_department_code").val()
            var hiring_period = $("#change_item_hiring_period").val()
            var item_no_new = $("#change_item_new").val()
            var position_code = s.change_item_items.filter(function (d) {
                return d.item_no == item_no_new
            })[0].position_code;
            
            //currentPageNumber();
            swal({
                title: "Change Applicants Item",
                text: "Would you like to change the item for this applicant?",
                icon: "warning",
                buttons: ["No", "Yes"],
                dangerMode: true,
            }).then(function (yes) {
                if (yes) {
                    cs.loading("show")
                    h.post("../cApplicantsReview/ChangeItem",
                        {
                              app_ctrl_nbr: app_ctrl_nbr
                            , item_no_previous: item_no_previous
                            , hiring_period: hiring_period
                            , item_no_new: item_no_new
                            , position_code: position_code
                            , department_code: department_code
                        }).then(function (d) {

                            if (d.data.icon == "success") {
                                $("#department_code1").val(department_code)
                                s.items = s.change_item_items
                                localStorage["items1"] = JSON.stringify(d.data.items)
                              
                                tab_table_data(d.data.review_list)

                                $("#item_nbr1").val(item_no_new)
                                swal({ title: "Change item successful!", icon: d.data.icon })
                            }
                            else {
                                swal({ title: "Change item unsuccessful!", icon: d.data.icon })
                            }
                            cs.loading("hide")
                          
                            $("#change_item_modal").modal("hide")
                        })
                }
            });
        }
    }


	//header search box to search row in Main Applicant list
	s.search_in_list = function (value, table) {
		if (!elEmpty(value)) {
			s.recieved = false
		}

		$("#" + table).DataTable().search(value).draw();
	}
	//set the number of rows to show in grid
	s.setNumOfRow = function (value, table) {
		$("#" + table).DataTable().page.len(s.rowLen).draw();
	}
   

	s.qs_btn_rate = function (row_id) {
		//var item_no = s.Applicant_List_Data[row_id].item_no
        //var app_ctrl_nbr = s.Applicant_List_Data[row_id].app_ctrl_nbr

        var item_no      = row_id.item_no
        var app_ctrl_nbr = row_id.app_ctrl_nbr

		
        h.post("../cApplicantsReview/HasPsbCtrlNbr", { app_ctrl_nbr: app_ctrl_nbr }).then(function (d) {

            if (d.data.psb_ctrl_nbr_count > 0) {

                location.href = "cQualificationStandard/Index?app_ctrl_nbr=" + app_ctrl_nbr 

			}
			else
			{
                swal({title:"This application must proceed first to HRMPSB Screening before you can rate Qualification standard, please add this application to HRMPSB Screening!",  icon: "error" });
			}
			
		})
		
    }

    s.deleteFromReview = function (row) {

        var data = s.Applicant_List_Data[row]

        swal({
            title: "Delete Applicant",
            text: "Would you like to delete applicant from review?",
            icon: "warning",
            buttons: ["No", "Yes"],
            dangerMode: true,
        }).then(function (yes) {
            if (yes) {
                h.post("../cApplicantsReview/deleteFromReview",
                    {
                         app_ctrl_nbr: data.app_ctrl_nbr
                        ,app_status: data.app_status
                    }).then(function (d) {
                        if (d.data.icon == "success") {
                            s.Applicant_List_Data = s.Applicant_List_Data.filter(function (d) {
                                return d.app_ctrl_nbr != data.app_ctrl_nbr
                            })
                            s.Applicant_List_Data.refreshTable("Applicant_List_Grid", "")
                        }

                        swal({ title: d.data.message, icon: d.data.icon })
                        
                    })
            }
        });
    }

   

    s.addOtherDetails = function (row_id) {
	    var temp_perc  = ""
		//var dt = s.Applicant_List_Data[row_id]
        //s.app_ctrl_nbr = dt.app_ctrl_nbr;

        var dt = row_id
        s.app_ctrl_nbr  = dt.app_ctrl_nbr;
	   
		h.post("../cApplicantsReview/getReviewDetail", { app_ctrl_nbr: s.app_ctrl_nbr }).then(function (d) {
		   
			if (d.data.dtl_count > 0) {

				var dtl = d.data.dtl
			
					h.post("../cApplicantsReview/getBudgetYear", { budget_code: dtl[0].budget_code, employment_type: dtl[0].employment_type }).then(function (d) {
						if (d.data.icon == "success") {

							s.budget_year = d.data.budget_year;
							s.position_tbl = d.data.position_tbl
							s.app_review = dtl.populateFields(s.app_review, 0)
							if (dt.app_status == "3")
							{
								cs.DisabledField("exam_type_descr")
								cs.DisabledField("score_rendered")
								cs.DisabledField("exam_date")
								$("#cal").hide()
                            }
                            temp_perc = dtl[0].score_rendered
                          
						}
                     
                        $("#score_rendered").val(cs.percentageToScore(temp_perc, 25))
                        s.app_review.score_rendered = cs.percentageToScore(temp_perc, 25)
                        $("#addexamresult").modal("show");
                })
               
					
			}
			
		})
	   
	}

	$('#addexamresult').on('hidden.bs.modal', function () {
		cs.clearFields(s.app_review)
	})

    $('#sendemailgrid_modal').on('hidden.bs.modal', function () {
      
        var dt = s.includeToEmail
        var dtlen = dt.length
        for (var x = 0; x < dtlen; x++) {
            var exist = s.sendingEmailList.filter(function (d) {
                return d.email_address == dt[x].email_address
            })
            if (exist.length == 0) {
                data = {
                      app_ctrl_nbr: dt[x].app_ctrl_nbr
                    , applicant_name: dt[x].first_name + " " + dt[x].middle_name.substring(0, 1) + ". " + dt[x].last_name
                    , email_address: dt[x].email_address
                    , status: false
                }
                s.sendingEmailList.push(data)
            }
        }
    })
   

	s.appl_review = function (row_id) {
		var position_code = s.Applicant_List_Data[row_id].position_code
		var app_ctrl_nbr = s.Applicant_List_Data[row_id].app_ctrl_nbr
        //var position_code = row_id.position_code
        //var app_ctrl_nbr  = row_id.app_ctrl_nbr

		if (cs.elEmpty(position_code))
		{
            swal({title:"This applicant has no define position yet, please assign position for this specific applicant!", icon:"error"});
		}
		else
		{
			location.href = "cApplicantReviewDetail/Index?app_ctrl_nbr=" + app_ctrl_nbr 
		}
		
    }
    s.updateProfileInfo = function (l) {
        s.review_data = l
        $("#modal_updateapp").modal("show")
    }

    s.updateProfileFrom = function () {
        cs.loading("show")
        var l = s.review_data
        
       if (l.empl_id.charAt(0) == "A") {
           h.post("../cApplicantsReview/UpdateDataFrom", {
               info_ctrl_nbr: l.info_ctrl_nbr
               , empl_id: l.empl_id
               , source: "APL"
               , item_no: l.item_no
               , employment_type: l.employment_type
               , budget_code: l.budget_code
               , hiring_period: s.hiring_period
           }).then(function (d) {
               s.Applicant_List_Data_Orig = d.data.review_list
               s.Applicant_List_Data = d.data.review_list
               swal({ title: d.data.message, icon: d.data.icon })
               
               cs.loading("hide")
           })
       }
       else {
           h.post("../cApplicantsReview/UpdateDataFrom", {
               info_ctrl_nbr: l.info_ctrl_nbr
               , empl_id: l.empl_id
               , source: "PAY"
               , item_no: l.item_no
               , employment_type: l.employment_type
               , budget_code: l.budget_code
           }).then(function (d) {
               s.Applicant_List_Data_Orig = d.data.review_list
               s.Applicant_List_Data = d.data.review_list
               swal({ title: d.data.message, icon: d.data.icon })
               
               cs.loading("hide")
           })
       }
    }

    s.updateQS = function () {
        cs.loading("show")
        var l = s.review_data
        if (l.empl_id.charAt(0) == "A") {
            h.post("../cApplicantsReview/Updatefromapl", {
                info_ctrl_nbr: l.info_ctrl_nbr
                , empl_id: l.empl_id

            }).then(function (d) {
                swal({title:d.data.updateapl.output_message,icon: d.data.icon })
                cs.loading("hide")
            })
        }
        else {
            h.post("../cApplicantsReview/Updatefrompds", {
                info_ctrl_nbr: l.info_ctrl_nbr
                , empl_id: l.empl_id

            }).then(function (d) {
                swal({title:d.data.updatepds.output_message, icon: d.data.icon })
                cs.loading("hide")
            })
        }
       
    }

    s.identifyidPDS = function (row) {
        var dt = s.Applicant_List_Data[row]
        s.info_ctrl_nbr = dt.info_ctrl_nbr

        swal({
            title: "Use specific Employee ID",
            text: "If yes, the system will look for id instead of names and birthdate",
            content:"input",
            icon: "info",
            buttons: ["No","Yes"],
            dangerMode: true,
        }).then(function (yes) {
               
                if (yes == "" || yes == null || yes == undefined) {
                  
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
                            swal({title:"No data found!", icon: "warning", timer: 2000 })
                        }
                        cs.loading("hide")
                    })
                }
                else  {
                 
                    h.post("../cApplicantsReview/getApplicantFromPDSID", {
                        empl_id: yes
                    }).then(function (d) {
                        if (d.data.apl_list.length > 0) {
                            s.select_applicant_PDS_Data = d.data.apl_list.refreshTable("select_id_employee_PDS_grid", "")
                            $("#select_id_employee_PDS").modal("show")
                        }
                        else {
                            swal({title:"No data found!", icon: "warning", timer: 2000 })
                        }
                        cs.loading("hide")
                    })
                }
        });
    }

    s.updateDataFromApl = function (row) {
        cs.loading("show")
        var l = s.Applicant_List_Data[row]
      
        h.post("../cApplicantsReview/UpdateDataFrom3", {
               info_ctrl_nbr: l.info_ctrl_nbr
              , empl_id: l.empl_id
              , source: "APL"
              , year: s.yr
              , month: s.mo
              , employment_type: l.employment_type
              , budget_code: l.budget_code
              , item_no: s.item_nbr1
            , hiring_period: s.hiring_period
          }).then(function (d) {
              s.Applicant_List_Data = d.data.review_list.refreshTable("Applicant_List_Grid", "")
              swal({title:d.data.returnUpdate, icon: d.data.icon })
              cs.loading("hide")
          })
        
    }

    s.identifyidQS = function (row) {
        var dt = s.Applicant_List_Data[row]
       
        s.info_ctrl_nbr = dt.info_ctrl_nbr

        h.post("../cApplicantsInfo/getApplicantFromPDS", {
              first_name: dt.first_name
            , last_name: dt.last_name
            , birth_date: dt.birth_date
            , gender: dt.gender
        }).then(function (d) {
            if (d.data.apl_list.length > 0) {
                s.select_applicant_QS_Data = d.data.apl_list.refreshTable("select_id_employee_QS_grid", "")
                $("#select_id_employee_QS").modal("show")
            }
            else {
                swal({title:"No data found!", icon: "warning", timer: 2000 })
            }
        })

    }

    s.updatefrompds = function (row) {
      cs.loading("show")
        var l = s.select_applicant_PDS_Data[row]
        h.post("../cApplicantsReview/UpdateDataFrom2", {
            info_ctrl_nbr: s.info_ctrl_nbr
            , empl_id: l.empl_id
            , source: "PAY"
            , year: s.yr
            , month: s.mo
            , employment_type: s.employment_type
            , budget_code: s.budget_code
            , item_no: s.item_nbr1
            , hiring_period: s.hiring_period
        }).then(function (d) {
            s.Applicant_List_Data = d.data.review_list.refreshTable("Applicant_List_Grid", "")
            swal({title:d.data.returnUpdate, icon: d.data.icon })
            $("#select_id_employee_PDS").modal("hide")
            $("#addApplicants").modal("hide")
            cs.loading("hide")
        })
    }

    s.updatefromqspds = function (row) {
        cs.loading("show")
        var l = s.select_applicant_QS_Data[row]

        h.post("../cApplicantsReview/Updatefrompds", {
            info_ctrl_nbr: s.info_ctrl_nbr
            , empl_id: l.empl_id

        }).then(function (d) {
            swal({title:d.data.updatepds.output_message, icon: d.data.icon })
            cs.loading("hide")
            $("#select_id_employee_PDS").modal("hide")
            $("#addApplicants").modal("hide")
            cs.loading("hide")
        })
    }

    s.updatefromqsapl = function (row) {
        cs.loading("show")
        var l = s.Applicant_List_Data[row]
        if (l.empl_id.charAt(0) == "A") {
            h.post("../cApplicantsReview/Updatefromapl", {
                info_ctrl_nbr: l.info_ctrl_nbr
                , empl_id: l.empl_id

            }).then(function (d) {
                swal({title:d.data.updateapl.output_message, icon: d.data.icon })
                cs.loading("hide")
                $("#select_id_employee_PDS").modal("hide")
                $("#addApplicants").modal("hide")
                cs.loading("hide")
            })
        }
        else {

            swal({ title: "Cannot Fetch Data From Online Application", text: "This application did not come from online application", icon: d.data.icon })
        }

    }

	s.selectEmployment = function (val) {
        cs.loading("show")
		s.app_review.budget_code = "";
		h.post("../cApplicantsReview/getBudgetYear", {budget_code: s.app_review.budget_code, employment_type: val }).then(function (d) {
			if (d.data.icon == "success") {
				s.budget_year = d.data.budget_year;
				s.position_tbl = d.data.position_tbl
			}
			else {
				console.log(d.data.message)
			}
			cs.loading("hide")
		})
    }

    function removeValue(arr) {
        for (var x = 0; x < arr.length; x++) {
            addvalue(arr[x], "")
        }
    }
    function removeValueArray(arr) {
        for (var x = 0; x < arr.length; x++) {
            s[arr[x]] = []
        }
    }

	s.selectEmploymentType = function (val) {
        cs.loading("show")
        
        removeValueArray(["budget_year","hiringperiodlist", "department","items"])
        removeValue(["budget_code", "hiring_period", "item_nbr1", "department_code1","app_status"])

        //cs.removeLocalStorage(["budget_year", "hiringperiodlist", "department", "items"])
        //cs.removeLocalStorage(["budget_year", "hiring_period", "item_nbr1", "department_code1"])
        
        localStorage["employment_type1"] = val;
      
        if (val != "") {
            if (localStorage['budget_year1']) {
                s.budget_year = JSON.parse(localStorage['budget_year1'])
                cs.loading("hide")
            }
            else {
                getBudgetCode()
                cs.loading("hide")
            }
        }
        else {
            localStorage.removeItem('employment_type1')
            cs.loading("hide")
        }

      
        var dt = []
        s.Applicant_List_Data = dt.refreshTable("Applicant_List_Grid", "")
        localStorage.removeItem("review_list1")
    }


    function getBudgetCode() {
        var employment_type = s.employment_type
        h.post("../cApplicantsReview/getBudget_Code", { employment_type: employment_type}).then(function (d) {
           
            if (d.data.icon == "success") {
                localStorage['budget_year1'] = JSON.stringify(d.data.budgetyear);
                $("#Applicant_List_Grid").dataTable().fnClearTable();

                //if (val == "RE") {
                //    localStorage['budgetcodes_re'] = JSON.stringify(d.data.budgetyear);
                //}
                //else if (val == "CE") {
                //    localStorage['budgetcodes_ce'] = JSON.stringify(d.data.budgetyear);
                //}
                //else if (val == "jo") {
                //    localStorage['budgetcodes_jo'] = JSON.stringify(d.data.budgetyear);
                //}
                s.budget_year = d.data.budgetyear

              
            }
            else {
                console.log(d.data.message)
            }
           
        })
    }

    //function filterApplicant_List_Grid(filter) {
    //    var hp = $("#hiring_period").val()
    //    var dc = $("#department_code1").val()
    //    var im = $("#item_nbr1").val()
    //    if (filter == 1) {
    //        if (hp.length > 0) {

    //            var dt = s.Applicant_List_Data_Orig.filter(function (d) {
    //                return d.hiring_period == hp
    //            })
              
    //            s.Applicant_List_Data = dt.refreshTable("Applicant_List_Grid", "");
               
    //        }
    //        else {
                
    //            s.Applicant_List_Data = s.Applicant_List_Data_Orig.refreshTable("Applicant_List_Grid", "");
    //        }
    //    }
    //    else if (filter == 2) {
    //        var dt = s.Applicant_List_Data_Orig.filter(function (d) {
    //            return d.hiring_period == hp && d.department_code == dc
    //        })
    //        s.Applicant_List_Data = dt.refreshTable("Applicant_List_Grid", "");
    //    }
    //    else if (filter == 3) {
    //        var dt = s.Applicant_List_Data_Orig.filter(function (d) {
    //            return d.hiring_period == hp && d.department_code == dc && d.item_no == im
    //        })

    //        console.log(dt)

    //        s.Applicant_List_Data = dt.refreshTable("Applicant_List_Grid", "");
    //    }
       
    //}

    function getAllApplicants(budget_code, employment_type) {
      

        h.post("../cApplicantsReview/getAllApplicants", { budget_code: budget_code, employment_type: employment_type }).then(function (d) {
            s.Applicant_List_Data = d.data.AllApplicants.refreshTable("Applicant_List_Grid", "");
            s.Applicant_List_Data_Orig = d.data.AllApplicants

        })
    }



    s.selectBudgetCode = function (val) {
        cs.loading("show")
      
        var employment_type = s.employment_type
        var budget_code = s.budget_code
        //getAllApplicants(budget_code, employment_type)
        removeValueArray(["hiringperiodlist","department", "items"])
        removeValue(["hiring_period", "item_nbr1", "department_code1", "app_status"])
        //cs.removeLocalStorage(["hiringperiodlist", "department", "items"])
        //cs.removeLocalStorage(["hiring_period", "item_nbr1", "department_code1"])
        localStorage.removeItem("review_list1")
        $("#Applicant_List_Grid").dataTable().fnClearTable();
       

       localStorage['budget_code1'] = val;
       
        h.post("../cAddAvailableItemInAPL/Open_Items_Hdr", { budget_code: s.budget_code, employment_type: s.employment_type }).then(function (d) {
            s.hiringperiodlist = d.data.data_items_hdr
            localStorage["hiringperiodlist1"] = JSON.stringify(d.data.data_items_hdr)
           cs.loading("hide")
       })
    }

    function psb_number_disabled(psb_ctrl_nbr) {

        var data = s.psb_sked_hdr.filter(function (d) {
            return d.psb_ctrl_nbr == psb_ctrl_nbr
        })
      
        if (data.length == 0) {
            s.psb_number_disabled = false
        }
        else {
            s.psb_number_disabled = true
        }
    }


    s.selectHiringPeriod = function (val) {
       // filterApplicant_List_Grid(1)
        removeValueArray(["department", "items"])
        removeValue(["item_nbr1", "department_code1", "app_status"])
       //cs.removeLocalStorage(["department", "items"])
       //cs.removeLocalStorage(["item_nbr1", "department_code1"])
        localStorage.removeItem("review_list1")
       // $("#Applicant_List_Grid").dataTable().fnClearTable();

        localStorage['hiring_period1'] = val;


        h.post("../cApplicantsReview/getDepartment", { hiring_period: val }).then(function (d) {
            s.department = d.data.department
            //s.psb_sked_hdr = d.data.psb_sked_hdr
            localStorage["department1"] = JSON.stringify(d.data.department)
            cs.loading("hide")
            
        })
        
    }

    s.selectDepartment = function () {
       // cs.loading("show")

        removeValueArray(["items"])
        removeValue(["item_nbr1", "app_status"])
        //cs.removeLocalStorage(["items"])
        //cs.removeLocalStorage(["item_nbr1"])
        localStorage.removeItem("review_list1")
        $("#Applicant_List_Grid").dataTable().fnClearTable();

        var hiring_period = $("#hiring_period").val()
        var employment_type = $("#employment_type").val()
        var budget_code = $("#budget_code").val()
        var department_code = $("#department_code1").val()

       // filterApplicant_List_Grid(2)

        localStorage["department_code1"] = $("#department_code1").val()


        h.post("../cApplicantsReview/getPublicationVacant", {
            budget_code     : budget_code,
            employment_type : employment_type,
            department_code : department_code,
            hiring_period   : hiring_period
        }).then(function (d) {
            if (d.data.icon == "success") {
                s.items = d.data.items
                localStorage["items1"] = JSON.stringify(d.data.items)
                addvalue("item_no", "")
                addvalue("app_status", "")
                s.psb_sked_hdr = d.data.psb_sked_hdr
                localStorage["psb_sked_hdr1"] = JSON.stringify(d.data.psb_sked_hdr)
            }
            else {
                console.log(d.data.message)
            }
            cs.loading("hide")
        })
       
    }

    function GetReviewItem() {
        var item_no = s.item_nbr1 == null ? $("#item_nbr1").val() : s.item_nbr1;
        var budget_code = s.budget_code;
        var employment_type = s.employment_type;
        var hiring_period = s.hiring_period;
        var department_code = s.department_code1 == null ? $("#department_code1").val() : s.department_code1;
        //var department_code = s.department_code1
        currentPageNumber()
        h.post("../cApplicantsReview/getReviewItem", {
              item_no: item_no
            , budget_code: budget_code
            , employment_type: employment_type
            , hiring_period: hiring_period
            , department_code: department_code
        }).then(function (d) {
            if (d.data.icon == "success") {
                addvalue("psb_ctrl_nbr_disp", d.data.psb_ctrl_nbr)
                localStorage['psb_ctrl_nbr1'] = d.data.psb_ctrl_nbr;
                s.Applicant_List_Data_Orig = d.data.review_list
                psb_number_disabled(d.data.psb_ctrl_nbr)
                //localStorage['review_list'] = JSON.stringify(d.data.review_list);
                s.Applicant_List_Data = d.data.review_list.refreshTable("Applicant_List_Grid", "")
                addvalue("app_status", "")
                tab_table_data(d.data.review_list)
                cs.loading("hide")
                
            }
            else {
                console.log(d.data.message)
                cs.loading("hide")
            }
        })
       
    }





    s.selectItem = function () {
        cs.loading("show")

        var item_no = $("#item_nbr1").val()
        localStorage['item_nbr1'] = item_no;

      //  filterApplicant_List_Grid(3)
        //currentPageNumber();
        h.post("../cApplicantsReview/getReviewItem", {
              item_no: item_no
            , budget_code: s.budget_code
            , employment_type: s.employment_type
            , hiring_period: s.hiring_period
            , department_code: s.department_code1
        }).then(function (d) {
            if (d.data.icon == "success") {
                addvalue("psb_ctrl_nbr_disp", d.data.psb_ctrl_nbr)
                localStorage['psb_ctrl_nbr1'] = d.data.psb_ctrl_nbr;
                s.Applicant_List_Data_Orig = d.data.review_list
                //localStorage['review_list'] = JSON.stringify(d.data.review_list);
                s.Applicant_List_Data = d.data.review_list.refreshTable("Applicant_List_Grid", "")
                addvalue("app_status", "")
                psb_number_disabled(d.data.psb_ctrl_nbr)
                tab_table_data(d.data.review_list)
                cs.loading("hide")
            }
            else {
                console.log(d.data.message)
                cs.loading("hide")
            }
        })
    }

    s.selectPSBSchedule = function () {
       
        var eval = $("#psb_ctrl_nbr_disp").val()

        localStorage['psb_ctrl_nbr1'] = eval;
        
       
    }


    function getItems(employmenttype,budgetcode) {
        h.post("../cApplicantsReview/getPublicationVacant", { budget_code: budgetcode, employment_type: employmenttype }).then(function (d) {
            if (d.data.icon == "success") {
                s.items = d.data.items
                addvalue("item_no", "")
                //s.Applicant_List_Data_Orig = d.data.review_list
                //s.Applicant_List_Data = d.data.review_list
                addvalue("app_status", "")
            }
            else {
                console.log(d.data.message)
            }
            cs.loading("hide")
        })
    }
   


    s.selectStatus = function (val) {
        //cs.loading("show")
        
        var dt = s.Applicant_List_Data_Orig.filter(function (d) {
            return d.app_status == val.toString()
        })
        
        if (val == "") {
            s.Applicant_List_Data = s.Applicant_List_Data_Orig.refreshTable("Applicant_List_Grid", "")
        }
        else {
            s.Applicant_List_Data = dt.refreshTable("Applicant_List_Grid", "")
        }
       

    }


	s.selectPosition = function (val) {
		
		var ob = s.position_tbl.filter(function (d) {
			return d.item_no == val
		})[0]
	   
		s.app_review.item_no = ob.item_no;
		s.app_review.department_code = ob.department_code
	}

	


	s.SaveOtherDetails = function (obj, id) {
	    cs.loading("show")
		var err = 0

        var examdate = $("#exam_date").val()
        var examtype = $("#exam_type_descr").val()
        var scorerendered = cs.scoreToPercentage($("#score_rendered").val(),25)

      

       
		cs.notrequired2("exam_type_descr")
		cs.notrequired2("score_rendered")
		cs.notrequired2("exam_date")

		if (cs.elEmpty(examtype)) {
			cs.required2("exam_type_descr", "Required Filed!")
			err = err + 1
		}
		if (scorerendered == "0" || cs.elEmpty(scorerendered)) {
			cs.required2("score_rendered", "Required Filed!")
			err = err + 1
		}
		if (cs.elEmpty(examdate)) {

			cs.required2("exam_date", "Required Filed!")
			err = err + 1
		}
		else {
			if (!cs.valid_date(examdate, "exam_date")) {
				cs.required2("exam_date", "Invalid date!")
				err = err + 1
			}
		}

		if (err > 0) return;

		cs.spinnerAdd("save_btn", 'fa fa-save')
       
       

        if (parseFloat($("#score_rendered").val()) == parseFloat(obj.score_rendered)) {
            obj.score_rendered = cs.scoreToPercentage(obj.score_rendered, 25)
        }
        else {
            obj.score_rendered = scorerendered
        }
		h.post("../cApplicantsReview/SaveOtherDetails", {

			obj: obj
			, examdate: examdate
			, examtype: examtype
			, scorerendered: scorerendered
		}).then(function (d) {
			if (d.data.icon == "success") {
				cs.spinnerRemove("save_btn", 'fa fa-save')
                swal({title:d.data.message, icon: d.data.icon })
				$("#addexamresult").modal("hide");
				cs.clearFields(s.app_review)

			}
			else {
				
				cs.spinnerRemove("save_btn", 'fa fa-save')
			}
			cs.loading("hide")
		})

	}

	s.addToPsbSched = function (row_id) {
	        cs.loading("show")
			var d = new Date();
			var m = cs.leadingZeroMonth(d.getMonth());
			var y = d.getFullYear().toString();
			var dt = s.Applicant_List_Data[row_id]
			var psb_ctrl = dt.budget_code
			s.item_no = dt.item_no
			s.ps.year = y
			s.ps.month = m
			s.ps.app_ctrl_nbr = dt.app_ctrl_nbr
			s.ps.employment_type = dt.employment_type
			 
			$("#psb_panel").dataTable().fnClearTable();
			
        h.post("../cApplicantsReview/getPsbSchedList", { item_no: s.item_no, app_ctrl_nbr: dt.app_ctrl_nbr}).then(function (d) {
				if (d.data.icon == "success") {
					var itm = d.data.itm[0];
					s.ps.psb_ctrl_nbr = itm.psb_ctrl_nbr
					s.ps.psb_date = itm.psb_date
					s.ps.employment_type_descr = itm.employment_type_descr
					s.ps.remarks_details = itm.remarks_details
					s.Panel_List_Data = d.data.pnl.refreshTable("psb_panel", "")
					$("#addToPsbSched").modal("show")
				}
                else {
                    swal({ title: d.data.message, icon: d.data.icon })
					
				}
				cs.loading("hide")
			})
			
	   
	}

	
	s.selectSchedule = function (psb_ctrl_nbr) {
	    cs.loading("show")
		s.ps.employment_type = ""
		s.ps.remarks_details = ""
		$("#psb_panel").dataTable().fnClearTable();
		var dt = s.psbcshedlist.filter(function (d) {
			return d.psb_ctrl_nbr == psb_ctrl_nbr
		})
		
		if(dt.length > 0)
		{
			s.ps.employment_type = dt[0].employment_type
			s.ps.remarks_details = dt[0].remarks_details
		}

		h.post("../cApplicantsReview/getPsbPanelMember", { psb_ctrl_nbr: psb_ctrl_nbr }).then(function (d) {
			if (d.data.icon == "success") {
				s.Panel_List_Data = d.data.psbcshedmbr.refreshTable("psb_panel", "")
			}
			else {
				console.log(d.data.message);
			}
			cs.loading("hide")
		})
	}

	s.SaveForPsbScreening = function (ps) {
	    cs.loading("show")
		if(cs.ValidateFields(ps))
		{
			h.post("../cApplicantsReview/SaveForPsbSched", { psb_ctrl_nbr: ps.psb_ctrl_nbr, app_ctrl_nbr: ps.app_ctrl_nbr }).then(function (d) {
				if (d.data.icon == "success") {

                    swal({ title: d.data.message, icon: d.data.icon })
					
					$("#addToPsbSched").modal("hide")

			 }
				else {
                    swal({ title: d.data.message, icon: d.data.icon })
					

				}
				cs.loading("hide")
			})
		}
		
	}


	s.pass_check_box = function (row) {
	   
		cs.spinnerAdd("pass" + row, "checkmark")
		var dt = s.Applicant_List_Data[row]
		if (dt.item_in_psb == false)
		{
			$("#pass" + row)[0].checked = false
            swal({title:"Applicants item not yet added to PSB screening schedule", icon: "error" });
			cs.spinnerRemove("pass" + row, "checkmark")
			
			return
		}
		h.post("../cApplicantsReview/ReviewPass",
			{
				 item_no:s.item_no
				,budget_code : s.budget_code
				,employment_type:s.employment_type
				, app_ctrl_nbr: dt.app_ctrl_nbr
                , pass: $("#pass" + row)[0].checked
                , hiring_period: s.hiring_period
			}).then(function (d) {
			   
				if (d.data.icon == "success") {
                    s.Applicant_List_Data_Orig = d.data.review_list
                    s.Applicant_List_Data = d.data.review_list
                    swal({ title: d.data.message, icon: d.data.icon })
					cs.spinnerRemove("pass" + row, "checkmark")
				}
                else {

                    swal({ title: d.data.message, icon: d.data.icon })
					cs.spinnerRemove("pass" + row, "checkmark")
				}
			   
		})
	}
    
    s.Email_Action = function (d) {
        if (d == 1) {

            addvalue("emailsubject", "Application Received")
        }
        else if (d == 2) {
            addvalue("emailsubject", "")
        }
        else {
            addvalue("emailsubject", "")
        }
    }

    s.composeEmail = function (row_id) {
        
        s.includeToEmail = []

        //var dt = s.Applicant_List_Data[row_id]

        var dt = s.Applicant_List_Data[row_id]

        s.single_email = dt.email_address
        s.single_empl_id = dt.empl_id

        var data = {
             app_ctrl_nbr: dt.app_ctrl_nbr
            ,empl_id: dt.empl_id
            ,email_address: dt.email_address
            ,first_name: dt.first_name
            ,last_name: dt.last_name
            ,middle_name: dt.middle_name
            ,hiring_period: dt.hiring_period
        }
        s.includeToEmail.push(data)
        if (dt.email_address != "") {

            $("#email_receipent").val(dt.email_address)
            $("#email_view_modal").modal("show")
                   
        }
        else {
            swal({title:"No email address provided by the applicant!",  icon: "error" })
        }
    }

    s.sendEmail = function () {
        var email_receipent = document.getElementById("email_receipent").value
        var email_subject = document.getElementById("email_subject").value
        var email_body = document.getElementById("mail-content").innerHTML
        h.post("../cApplicantsReview/SendToEmail",
            {
                  email: dt.email_address
                , empl_id: dt.empl_id
                , app_ctrl_nbr: dt.app_ctrl_nbr
                , receipent: email_receipent
                , subject: email_subject
                , body: email_body
            }).then(function (d) {


                swal({title:d.data.message, icon: d.data.icon })
                cs.loading("hide")
            })
    }

    s.addtopsb = function (row) {

        //Applicant_List_Grid
        var btntopsb = "btntopsb" + row
        var icntopsb = "icntopsb" + row
        var dt = s.Applicant_List_Data[row]
        var var_psb_ctrl_nbr = $("#psb_ctrl_nbr_disp").val()
        
        s.appdata_row = dt
        var item_no = dt.item_no
        var app_ctrl_nbr = dt.app_ctrl_nbr
        var icntopsb = "icntopsb" + row
        var budget_code = dt.budget_code
        var employment_type = dt.employment_type
        
      

       
        if (icntopsb.hasClass("fa-check") == true) {
            
            swal({
                title: "Message",
                text: "Would you like to remove this application from PSB schedule",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            }).then(function (willDelete) {
                if (willDelete) {
                    cs.loading("show")
                    h.post("../cApplicantsReview/removeFromPsb", {
                          item_no: item_no
                        , app_ctrl_nbr: app_ctrl_nbr
                        , employment_type: employment_type
                        , budget_code: budget_code
                        , hiring_period: s.hiring_period
                        , psb_ctrl_nbr: dt.i_psb_ctrl_nbr
                        , department_code: dt.department_code
                    }).then(function (d) {
                        if (d.data.icon == "error") {
                            swal("Warning Message", d.data.message, { icon: "warning" })
                        }
                        else {
                            s.Applicant_List_Data = d.data.review_list.refreshTable("Applicant_List_Grid", app_ctrl_nbr)
                        }
                        cs.loading("hide")
                    })
                }
                else {

                }
            });
        }
        else {
           
           
           
                btntopsb.disabled()
                icntopsb.replaceClass("fa-arrow-right", "fa-spinner fa-spin")

                h.post("../cApplicantsReview/addToPSB",
                    {
                        item_no: item_no
                        , app_ctrl_nbr: app_ctrl_nbr
                        , employment_type: employment_type
                        , budget_code: budget_code
                        , hiring_period: s.hiring_period
                        , psb_ctrl_nbr: var_psb_ctrl_nbr
                        , department_code: dt.department_code
                    }).then(function (d) {

                        if (d.data.message == "This item is not yet added to the psb schedule") {
                            cs.loading("hide")
                            swal({
                                title: "Warning:",
                                text: d.data.message,
                                icon: "warning",
                                buttons: true,
                                dangerMode: true,
                            }).then(function (willDelete) {
                                if (willDelete) {
                                    cs.loading("show")
                                    h.post("../cApplicantsReview/getPSBSkedHdr", {
                                        budget_code: s.budget_code
                                        , employment_type: s.employment_type
                                    }).then(function (d) {
                                        console.log(d.data.psbskedhdr)
                                        s.PsbSchedule_Data = d.data.psbskedhdr.refreshTable("psbschedule_grid", "")
                                        $("#psbskedhdr_modal").modal("show")
                                        cs.loading("hide")
                                        btntopsb.enabled()
                                        icntopsb.replaceClass("fa-spinner fa-spin", "fa-arrow-right")
                                    })
                                }
                                else {
                                    btntopsb.enabled()
                                    icntopsb.replaceClass("fa-spinner fa-spin", "fa-arrow-right")
                                }
                            });


                        }
                        else {

                            if (d.data.icon == "error") {
                                swal("Warning Message", d.data.message, { icon: "warning" })
                                btntopsb.enabled()
                                icntopsb.replaceClass("fa-spinner fa-spin", "fa-arrow-right")
                            }
                            else {

                                if (d.data.review_list.length > 0) {
                                    s.Applicant_List_Data = d.data.review_list.refreshTable("Applicant_List_Grid", app_ctrl_nbr)
                                }
                                btntopsb.enabled()
                            }

                            cs.loading("hide")
                        }
                    })
            
           
        }

    }

    s.goToDocs = function (row,d)
    {
       
        var l = s.Applicant_List_Data[row]
        if (d == 1)
        {
            s.printScoreSheet(l)
        }
        else
        {
            var origin = "app_review";
            var app_ctrl_nbr = l.app_ctrl_nbr
            h.post("../cApplicantsReview/SetHistoryPage").then(function (d) {
                location.href = "../cViewUploadedFileFromAPL/Index?app_ctrl_nbr=" + app_ctrl_nbr + "&origin=" + origin
              })
          
        }
    }
    
    s.ViewUploadeddocument = function (l) {
        s.applicant_list_object = l
        $("#document_modal").modal("show")
        
    }

    //************************************// 
    //*** Print Score Sheet             
    //**********************************// 
    s.printScoreSheet = function (l) {
        var dt = l
     
        cs.loading("show")
        var controller = "Reports";
        var action = "Index";
        var ReportName = "";
        var SaveName = "Crystal_Report";
        var ReportType = "inline";
        var ReportPath = "~/Reports/cryScoreSheet_Unqualified/";
        var sp = "sp_score_sheet_rpt"
        var parameters = "p_item_no," + dt.item_no + ",p_position_code," + dt.position_code +",p_app_ctrl_nbr," + dt.app_ctrl_nbr + ",p_app_status," + dt.app_status + ",p_panel_user_id," + "";
        ReportName = "cryScoreSheet";
        ReportPath = ReportPath + "" + ReportName + ".rpt";


        h.post("../cPrintScoreSheet/SetHistoryPage",
            {
              
            }).then(function (d) {
               
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

    s.setExamDate = function () {
        s.rowindex_forexamtimeset = s.exam_row
        $("#exam_rating").modal("hide")
        h.post("../cApplicantsReview/GetExamSchedules", { app_ctrl_nbr: s.exam_app_ctrl_nbr}).then(function (d) {
            if (d.data.icon == "success") {
                s.ExamSchedule_Data = d.data.examschedules.refreshTable("examschedule_grid", "")
                $("#examScheduleGridModal").modal("show")
            }
            else {
                swal(d.data.message, {icon:d.data.icon})
            }
          
        })

    }


    s.btn_addPsb = function (row) {

        var icn_btn = "icn_btn" + row
        icn_btn.replaceClass("fa-plus","fa-spinner fa-spin")
        var appdatarow = s.appdata_row
        var dt = s.PsbSchedule_Data[row]
        var psb_ctrl_nbr = dt.psb_ctrl_nbr
        
        var additem = {
              item_no: appdatarow.item_no
            , budget_code: appdatarow.budget_code
            , department_code: appdatarow.department_code
            , employment_type: appdatarow.employment_type
        }
        h.post("../cAddPsbSchedule/savePSBItems", {
             psb_ctrl_nbr       : psb_ctrl_nbr
            ,budget_code        : appdatarow.budget_code
            ,employment_type    : appdatarow.employment_type
            ,added_item         : additem
        }).then(function (d) {
            if (d.data.icon == "success") {
                addvalue("psb_ctrl_nbr_disp", psb_ctrl_nbr)
            }

            icn_btn.replaceClass("fa-spinner fa-spin", "fa-plus")

            $("#psbskedhdr_modal").modal("hide")
        })
    }


    s.includeNemail = function (row) {
        var icn3 = "icn3" + row
        var icnemialbtn = "icnemialbtn" + row
        var btninclude = "btninclude" + row
        var dt = s.Sendemail_List_Data[row]
        var app_ctrl_nbr = dt.app_ctrl_nbr
        if (dt.email_address == "") {
            swal("No email address provided", { icon: "warning" })
            elem.checked = false
        }
        else {
            if (icn3.hasClass("hidden")) {
                var exist = s.includeToEmail.filter(function (d) {
                    return d.email_address == dt.email_address
                })
                if (exist.length == 0) {
                    var data = {
                          app_ctrl_nbr: dt.app_ctrl_nbr
                        , empl_id: dt.empl_id
                        , email_address: dt.email_address
                        , first_name: dt.first_name
                        , last_name: dt.last_name
                        , middle_name: dt.middle_name
                        , hiring_period: dt.hiring_period
                    }
                    s.includeToEmail.push(data)
                }
                icnemialbtn.replaceClass("fa-plus", "fa-check")
                icn3.removeClass("hidden")
                btninclude.replaceClass("btn-success", "btn-info")
            }
            else {
                var dt2 = s.includeToEmail.filter(function (d) {
                    return d.app_ctrl_nbr != app_ctrl_nbr
                })
                s.includeToEmail = dt2
                icnemialbtn.replaceClass("fa-check", "fa-plus")
                icn3.addClass("hidden")
                btninclude.replaceClass("btn-info", "btn-success")
            }
        }
    }

   s.btn_show_pds = function (row_id) {
        var dt = s.Applicant_List_Data[row_id]
         //console.log(dt)
         //return

        var empl_id = dt.empl_id
        s.employee_name_print = 'PERSONAL DATA SHEET REPORT';

        var controller = "Reports";
        var action = "Index";
        var ReportName = "";
        var SaveName = "Crystal_Report";
        var ReportType = "inline";
        var ReportPath = "~/Reports/cryReorgApplReport/";
        var sp = "";
        //var dataX = s.psb.filter(function (d) {
        //    return d.app_ctrl_nbr == s.app_ctrl_nbr
        //})[0]
        //comsole.log(dataX)
        //return;
        ReportPath = "~/Reports/cryPDS/";
        ReportName = "cryPDSMain";
        ReportPath = ReportPath + "" + ReportName + ".rpt";
        sp = "sp_pds_rep,p_empl_id," + empl_id  + ",O";

        

        // *******************************************************
        // *** VJA : 2021-07-14 - Validation and Loading hide ****
        // *******************************************************
        //$("#modal_loading").modal({ keyboard: false, backdrop: "static" })
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
       // console.log(s.embed_link)

        if (!/*@cc_on!@*/0) { //if not IE
            iframe.onload = function () {
                iframe.style.visibility = "visible";
                //$("#modal_loading").modal("hide")
                cs.loading('hide')
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
        // *******************************************************
        // *******************************************************
    }
    s.changeTab = function (tab) {
        s.selectedAppRow4Top5 = []
        s.qualifiedForExamList = []
        s.selectedAppRow4HRMPSB = []
        $("#addToHRMPSBBtn").addClass("hidden")
        
        if (tab == 1) {
            s.show_search = 1
            $("#tab-4").removeClass("active");
            $("#tab-2").removeClass("active");
            $("#tab-3").removeClass("active");
            $("#tab-1").addClass("active");
            $("#assignexamAll").addClass("hidden")
        }
        else if (tab == 2) {
            s.show_search = 2
            $("#tab-4").removeClass("active");
            $("#tab-1").removeClass("active");
            $("#tab-3").removeClass("active");
            $("#tab-2").addClass("active");

            //$("#assignexamAll").removeClass("hidden")
        }
        else if (tab == 3) {
            
            s.show_search = 3
            console.log(s.Applicant_Top5_Data)
            var dt = s.Applicant_Top5_Data.filter(function (d) {
                return d.psb_ctrl_nbr != ""
            })


            if (dt.length > 0) {
                var psb_nbr = dt[0].psb_ctrl_nbr
                $("#psb_ctrl_nbr_disp").val(psb_nbr)
                $("#psb_ctrl_nbr_disp").prop("disabled", true)
            }
            else {
                $("#psb_ctrl_nbr_disp").prop("disabled", false)
            }

            $("#tab-4").removeClass("active");
            $("#tab-1").removeClass("active");
            $("#tab-2").removeClass("active");
            $("#tab-3").addClass("active");
            $("#assignexamAll").addClass("hidden")
            
          
        }
        else if (tab == 4) {
            s.show_search = 4


            var dt = s.Applicant_Top5_Data.filter(function (d) {
                return d.psb_ctrl_nbr != ""
            })
            if (dt.length > 0) {
                var psb_nbr = dt[0].psb_ctrl_nbr
                $("#psb_ctrl_nbr_disp").val(psb_nbr)
                $("#psb_ctrl_nbr_disp").prop("disabled", true)
            }
            else {
                $("#psb_ctrl_nbr_disp").prop("disabled", false)
            }

            $("#tab-3").removeClass("active");
            $("#tab-1").removeClass("active");
            $("#tab-2").removeClass("active");
            $("#tab-4").addClass("active");
            $("#assignexamAll").addClass("hidden")
           
        }

        if (tab == 4 || tab == 3) {
            $("#item_display").css("display", "block")
        }
        else {
            $("#item_display").css("display", "none")
        }
    }

    s.setExamDate = function () {
        s.rowindex_forexamtimeset = s.exam_row
        $("#exam_rating").modal("hide")
        h.post("../cApplicantsReview/GetExamSchedules", { app_ctrl_nbr: s.exam_app_ctrl_nbr }).then(function (d) {
            if (d.data.icon == "success") {
                s.ExamSchedule_Data = d.data.examschedules.refreshTable("examschedule_grid", "")
                $("#examScheduleGridModal").modal("show")
            }
            else {
                swal(d.data.message, { icon: d.data.icon })
            }

        })

    }

    s.assignExamScheduleToAll = function () {
        var payload_data = s.qualifiedForExamList

        if (s.qualifiedForExamList.length > 0) {
            if (cs.Validate1Field("item_nbr1")) {



                h.post("../cApplicantsReview/GetExamSchedulesAll").then(function (d) {
                    if (d.data.icon == "success") {
                        s.ExamSchedule_Data_All = d.data.examschedulesAll.refreshTable("examschedule_grid_All", "")
                        $("#examScheduleGridModal_All").modal("show")
                    }
                    else {
                        swal(d.data.message, { icon: d.data.icon })
                    }

                })



            }
        }
        else {
            alert("You have not selected applicants")
        }
    }

    s.set_exam_schedule_All = function (row) {

        var app_ctrl_nbr_list = []
        var dt = s.ExamSchedule_Data_All[row]
        var exam_id = dt.exam_id
        var hiring_period = $("#hiring_period").val()
        var item_no = $("#item_nbr1").val()
        var budget_code = $("#budget_code").val()
        var employment_type = $("#employment_type").val()
        for (var x = 0; x < s.Applicant_OnlineExam_Data.length; x++) {
            var obj = {
                app_ctrl_nbr: s.Applicant_OnlineExam_Data[x].app_ctrl_nbr
            }
            app_ctrl_nbr_list.push(obj)
        }


            var app_ctrl_nbr_list = s.Applicant_OnlineExam_Data


            h.post("../cApplicantsReview/SetExamScheduleAll", {
                  app_ctrl_nbr_list: s.selectedAppRow4Top5
                , hiring_period: hiring_period
                , item_no: item_no
                , budget_code: budget_code
                , employment_type: employment_type
                , exam_id: exam_id
            }).then(function (d) {
                tab_table_data(d.data.review_list)
                swal({ title: d.data.message, icon: d.data.icon })
                $("#examScheduleGridModal_All").modal("hide")
            })
    }
})



ng_eRSP_App.directive('percentage', ["commonScript", function (cs) {

	//************************************// 
	//*** this directive show alert if the value of a input type= number exceed is max or min values on blur
	//************************************// 
	return {
		restrict: 'C',
		link: function (scope, elem, attrs) {
			elem.on('keyup', function () {
				var perc = 0;
				var scorerendered = 0
				var totalitems = 0
				var form = elem[0].form.id;
				var id = attrs.id;
				var val = elem.val();
				var s = scope[form]
				totalitems = $('#' + form + ' input[name="totalitems"]').val();
				scorerendered = $('#' + form + ' input[name="scorerendered"]').val();
				if ((!cs.elEmpty(totalitems) && !cs.elEmpty(scorerendered)) && (totalitems.length >= scorerendered .length))
				{
					   if ((parseInt(totalitems) >= parseInt(scorerendered)) == true)
					   {
							perc = (scorerendered * 100) / totalitems;
							$('#' + form + ' input[name="scoreperc"]').val(perc.toFixed(2))
							s.score_percentage = perc.toFixed(2)
						}
					   else
					   {
							alert("Total number of items should be higher than score rendered")
							$('#' + form + ' input[name="scoreperc"]').val("")
							s.score_percentage = ""
							elem.val("")
							s.id = ""
						}
				}
			})
		}
	}

}])


ng_eRSP_App.directive('max100', ["commonScript", function (cs) {

	//************************************// 
	//*** this directive show alert if the value of a input type= number exceed is max or min values on blur
	//************************************// 
	return {
		restrict: 'C',
		link: function (scope, elem, attrs) {
			elem.on('keyup', function () {
				var perc = 0;
				var scorerendered = 0
				var totalitems = 0
				var form = elem[0].form.id;
				var id = attrs.id;
				var val = elem.val();
				var s = scope[form]
				if(val > 100)
				{
					alert("Rating must not be higher than 100")
					elem.val("")
					s.id = ""
				}
			})
		}
	}

}])


ng_eRSP_App.directive('openEmailList', ["commonScript", function (cs) {
        //************************************// 
        //*** 
        //************************************// 
        return {
            restrict: 'C',
            link: function (scope, elem, attrs) {
                elem.on('click', function () {

                
                    scope.Sendemail_List_Data = scope.Applicant_List_Data.refreshTable("sendemail_List_Grid", "")
                    $("#sendemailgrid_modal").modal("show")
                })
            }
        }
}])

ng_eRSP_App.directive('includeNemail', ["commonScript", function (cs) {
    //************************************// 
    //*** 
    //************************************// 
    return {
        restrict: 'C',
        link: function (scope, elem, attrs) {
            elem.on('click', function () {
                var row = attrs.row
                var elem = this
                var checked = elem.checked
                var dt = scope.Sendemail_List_Data[row]
                if (dt.email_address == "") {
                    swal("No email address provided", { icon: "warning" })
                    elem.checked = false
                }
                else {
                    if (checked) {
                            var data = {
                                  app_ctrl_nbr : dt.app_ctrl_nbr
                                , empl_id: dt.empl_id
                                , email_address: dt.email_address
                            }
                            scope.includeToEmail.push(data)
                    }
                    else {
                        var dt2 = scope.includeToEmail.filter(function (d) {
                            return d.empl_id != dt.empl_id
                        })
                        scope.includeToEmail = dt2
                    }

                    var dt3 = scope.includeToEmail
                   
                    if (scope.includeToEmail.length < 1) {
                        $("#email_receipent").val(scope.single_email)
                    }
                    else {
                      
                        var all_email_recep = ""
                        for (var x = 0; x < dt3.length; x++) {
                            if (all_email_recep == "" && x == 0) {
                                all_email_recep = dt3[x].email_address
                            }    
                            else {
                                all_email_recep = all_email_recep + ',' + dt3[x].email_address
                            }

                        }
                        $("#email_receipent").val(all_email_recep)
                    }
                 
               }
              
            })
        }
    }
}])

ng_eRSP_App.directive('sendEmail', ["commonScript",'$http', function (cs,http) {
    //************************************// 
    //*** this directive show alert if the value of a input type= number exceed is max or min values on blur
    //************************************// 
    return {
        restrict: 'C',
        link: function (scope, elem, attrs) {
            elem.on('click', function () {
                
                var emails = scope.includeToEmail
          
                var mail = $("#email_receipent").val()
                var subject = $("#email_subject").val()
               //var body = document.getElementById("mail-content").innerHTML
                var body = $(".note-editable").html()
                var body_text = $(".note-editable").text()
                if (cs.valid_textbox(subject, "email_subject") && cs.valid_textbox(body_text, "")) {

                    scope.Sendemail_List_Data2 = scope.sendingEmailList.refreshTable("sendemail_List_Grid2", "")

                    $("#sendemailgrid_modal2").modal("show")
                  
                    for (var x = 0; x < emails.length; x++) {
                            http.post("../cApplicantsReview/SendToEmail2", {
                                  email: emails[x]
                                , subject: subject
                                , body: body
                            }).then(function (d) {
                                var se = d.data.se
                                scope.Sendemail_List_Data2 = rse(se).refreshTable("sendemail_List_Grid2", "")
                            })
                    }
                }           
                else {
                    
                    if (!cs.valid_textbox(body_text, "")) {
                        $(".note-editable").html("<center><h2 style='color:red'>Required Message Here!</h2></center>")
                    }
                }

                function rse(se) {
                    var dt = angular.forEach(scope.sendingEmailList, function (value) {
                        if (value.app_ctrl_nbr == se.app_ctrl_nbr) {
                            value.status = true
                        }
                    })
                   return dt
                }
               
            })
        }
    }
}])

ng_eRSP_App.directive('note-editable', ["commonScript", '$http', function (cs, http) {
    //************************************// 
    //*** this directive show alert if the value of a input type= number exceed is max or min values on blur
    //************************************// 
    return {
        restrict: 'C',
        link: function (scope, elem, attrs) {
            elem.on('click', function () {
                alert("ddD")
                $(".note-editable").html("")
            })
        }
    }
}])

ng_eRSP_App.directive('reviewGrid', ["commonScript", '$http', function (cs, http) {
    //************************************// 
    //*** this directive show alert if the value of a input type= number exceed is max or min values on blur
    //************************************// 
    return {
        restrict: 'C',
        link: function (scope, elem, attrs) {
            elem.on('click', function () {
                alert("ddD")
                $(".note-editable").html("")
            })
        }
    }
}])
ng_eRSP_App.directive('reviewTable', ["commonScript", '$http', function (cs, http) {
   
    return {
        restrict: 'A',
        templateUrl: '/Template/ReviewTable_Partial.html'
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
