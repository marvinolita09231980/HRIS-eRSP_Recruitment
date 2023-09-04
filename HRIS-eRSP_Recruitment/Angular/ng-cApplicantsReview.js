
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


    //for add item to psb object
    s.appdata_row = {}
    

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
				,app_ctrl_nbr_disp      :""
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
   



	var Init_Applicant_List_Grid = function (par_data) {
        s.Applicant_List_Data = par_data;
        s.Applicant_List_Data_Orig = s.Applicant_List_Data;
       
		s.Applicant_List_Table = $('#Applicant_List_Grid').dataTable(
			{
				data: s.Applicant_List_Data,
				sDom: 'rt<"bottom"p>',
                pageLength: 10,
                initComplete: function () {
                    cs.loading("hide")
                },
                drawCallback: function () {
                    cs.loading("hide")
                },
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
						"mData": "applicant_name",
						"mRender": function (data, type, full, row) {
                            return "<h4 class='text-left btn-block'>" + data + "</h4>" +
                                "<small>" + full["app_address"] +"</small>"
						}
					},
					{
                        "mData": "department_name1",
						"mRender": function (data, type, full, row) {
                            return "<h4 class='text-left btn-block'>" + data + "</h4>"+
                                "<small class=' btn-block'>" + full["position_long_title"] + "</small>"
						}
                    },
                    {
                        "mData": "item_in_psb",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-center btn-block'>" + s.fn_status2(data) + "</span>" +
                                   "<button class='text-left btn btn-block btn-primary no-padding no-margin " + ifExamNotSet(full["exam_date"])+"' style='font-size:14px;' ng-click='setExamDate(" + row["row"] + ")'>Set Exam Date</button>"+
                                   "<button class='text-left btn btn-block btn-primary no-padding no-margin " + ifExamSet(full["exam_date"]) +"' style='font-size:12px;' ng-click='setExamDate(" + row["row"] + ")'>"+
                                       "<span class='text-left'>Exam: " + full["exam_date"] + "</span><br>" +
                                       "<span class='text-left'>Type: " + full["exam_type"] + "</span>" +
                                   "</button>"
                        }
                    },
					{
                        "mData": "email_add",
						"mRender": function (data, type, full, row) {
                            return "<div class='text-left btn-block'><strong>Email</strong>&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;<small>" + data + "</small></div>"+
                                "<div class='text-left btn-block'><strong>Mobile</strong>&nbsp;:&nbsp;<small>" + full["mobile_number"] + "</small></div>"
						}
					},
					{
						"mData": null,
						"bSortable": false,
                        "mRender": function (data, type, full, row) {
                        return '<div>'+
                                '<button class="btn btn-info btn-sm btn-grid" type="button" data-toggle="tooltip" data-placement="top" title="Review Application" ng-click="appl_review(' + row["row"] + ')">REVIEW&nbsp;<i class="fa fa-plus"></i></button>' +
                                '<button class="btn btn-success btn-sm btn-grid" id="btntopsb' + row["row"] + '" type="button" data-toggle="tooltip" data-placement="top" title="Add to PSB" ng-click="addtopsb(' + row["row"] + ')">' + s.fn_itemstatuslabel(full["item_in_psb"]) + '&nbsp;<i id="icntopsb' + row["row"] + '" class="fa ' + s.fn_itemstatus(full["item_in_psb"]) + '"></i></button>'+
                                '<div class="btn-group">' +
                                    '<button class="btn btn-warning btn-sm dropdown-toggle btn-grid" type="button" data-toggle="dropdown" data-placement="top" title="Click for more action">MORE...</button>' +
                                    '<ul class="dropdown-menu ">'+
                                        '<li><a ng-click="identifyidPDS(' + row["row"] + ')">UPDATE PROFILE FROM PDS</a></li>' +
                                        '<li><a ng-click="updateDataFromApl(' + row["row"] + ')">UPDATE PROFILE FROM ONLINE APPLICATION</a></li>' +
                                        '<li><a ng-click="identifyidQS(' + row["row"] + ')">UPDATE QS FROM HRIS PDS</a></li>' +
                                        '<li><a ng-click="updatefromqsapl(' + row["row"] + ')">UPDATE QS ONLINE APPLICATION</a></li>' +
                                        '<li><a ng-click="goToDocs(' + row["row"] + ',2)">UPLOADED DOCUMENTS</a></li>' +
                                        '<li><a ng-click="goToDocs(' + row["row"] + ',1)">PRINT SCORE SHEET</a></li>' +
                                        '<li><a ng-click="composeEmail(' + row["row"] + ')">SEND EMAIL NOTIFICATION</a></li>' +
                                        '<li><a ng-click="btn_show_pds(' + row["row"] + ')">PRINT PDS FROM ONLINE APPLICATION</a></li>' +
                                        '<li ng-show = "' + full["app_status"] +'==1" style="color:red;"><a ng-click="deleteFromReview(' + row["row"] + ')">DELETE APPLICANTS</a></li>' +
                                    '</ul>' +
                                '</div>' +
                                '<div class="btn-group">' +
                                    '<button class="btn btn-danger btn-sm dropdown-toggle btn-grid" type="button" data-toggle="dropdown" data-placement="top" title="Click for more action">SEND EMAIL</button>' +
                                    '<ul class="dropdown-menu ">' +
                                        '<li><a ng-click="sendEmailNotification(' + row["row"] + ',1)">Acknowledge Email</a></li>' +
                                        '<li><a ng-click="sendEmailNotification(' + row["row"] + ',2)">Not Qualified for Online Examination</a></li>' +
                                        '<li><a ng-click="sendEmailNotification(' + row["row"] + ',3)">Notification for Online Examination</a></li>' +
                                        '<li><a ng-click="sendEmailNotification(' + row["row"] + ',5)">Notification for HRMPSB Screening</a></li>' +
                                        '<li><a ng-click="sendEmailNotification(' + row["row"] + ',6)">Notification not in Top 5 applicants</a></li>' +
                                    '</ul>' +
                                '</div>' +
                            '<button class="btn btn-info btn-sm dropdown-toggle btn-grid" type="button" data-toggle="dropdown" data-placement="top" ng-click="viewDates(' + row["row"] + ')">DATES</button>' +

                                //'<button ng-show = "'+full["app_status"]+'==1" class="btn btn-danger btn-sm btn-grid" type="button" data-toggle="tooltip" data-placement="top" title="Review Application" ng-click="deleteFromReview('+row["row"]+')">DELETE&nbsp;<i class="fa fa-plus"></i></button>' +






                            //'<div class="btn-group">' +
                            //      '<button class="btn btn-warning btn-sm dropdown-toggle btn-grid" type="button" data-toggle="dropdown" data-placement="top" title="Click for more action">SEND EMAIL</button>' +
                            //        '<ul class="dropdown-menu ">' +
                            //        '<li><a ng-click="identifyidPDS(' + row["row"] + ')">UPDATE PROFILE FROM PDS</a></li>' +
                            //        '<li><a ng-click="updateDataFromApl(' + row["row"] + ')">UPDATE PROFILE FROM ONLINE APPLICATION</a></li>' +
                            //        '<li><a ng-click="identifyidQS(' + row["row"] + ')">UPDATE QS FROM HRIS PDS</a></li>' +
                            //        '</ul>' +
                            //'</div>' +

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
        else {
            return ""
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
                swal(d.data.message, { icon: d.data.icon })
                cs.loading("hide")
            }
        })
    }

    s.sendEmailNotification = function (row_id, type) {

        var dt = s.Applicant_List_Data[row_id]
        var swal_title = ""
        var swal_text = ""
        console.log(dt)
   
        if (dt.app_ctrl_nbr == null || dt.app_ctrl_nbr == "") {
            swal("Applicant not yet fetch!", { icon: "error" })
            return
        }

        if (dt.exam_date == "" || dt.exam_date == null) {
            swal("No exam date added to this application", { icon: "error" })
            return
        }


        if (dt.email_address == "" || dt.email_address == null) {
            swal("This applicant has not provided email address", { icon: "error" })
            return
        }


        if (type == "1" && dt.email_aknowldge_dttm != "") {

            swal("You have already sent acknowldgement email for this applicant", { icon: "error" })
            return
          
        } else if (type == "2" && dt.email_aknowldge_regret_dttm != "") {

            
            swal("You have already sent notification email for this applicant that he/she was not qualified for the position", { icon: "error" })
            return
            
        } else if (type == "3" && dt.email_noti_exam_dttm != "") {
            
            swal("You have already sent notification email of this applicant for the schedule of the online examination", { icon: "error" })
            return
            
        } else if (type == "5" && dt.email_noti_hrmpsb_dttm != "") {

           
            swal("You have already sent notification email of this applicant for the screening schedule", { icon: "error" })
            return
            
        } else if (type == "6" && dt.email_notintop5_dttm != "") {

            swal("You have already sent notification email of this applicant that he/she is not included of the Top 5 examinees", { icon: "error" })
            return
        }


        if (type == "1") {

             swal_title = "Send Acknowledgement Email"
             swal_text = "Are you sure that you want to send an acknowledgement email to this applicant? Please double check your action!"
            

        }else if (type == "2") {


            swal_title = "Not Qualified for Online Examination Email"
            swal_text = "Are you sure that you want to inform this applicant that he or she did not qualify for online examination? Please double check your action!"


        }else if (type == "3") {

            swal_title = "Qualified for Online Examination Email"
            swal_text = "Are you sure that you want to inform this applicant that he or she qualifies for online examination? Please double check your action!"
            

        }else if (type == "5") {


            swal_title = "Notify For HRMPSB Screening"
            swal_text = "Are you sure that you want to notify this applicant that he or she is included for the HRMPSB Screening? Please double check your action!"

          

        }else if (type == "6") {
            swal_title = "Notify For Top 5 Examinees"
            swal_text = "Are you sure that you want to notify this applicant that he or she is one of the top 5 examineess? Please double check your action!"
        }

       
        swal({
            title: swal_title,
            text: swal_text,
            icon: "info",
            buttons: ["No", "Yes"],
            dangerMode: true,
        }).then(function (yes) {
            if (yes) {

                cs.loading("show")

                $(".emailbtncls" + row_id).removeClass('fa fa-paper-plane');
                $(".emailbtncls" + row_id).addClass("fa fa-spinner fa-spin");
                $("#emailbtn" + row_id).prop("disabled", true);


                h.post("../cApplicantsReview/sendEmailNotification", {
                    dt: dt
                    , email_type: type
                }).then(function (d) {
                    var se = d.data.se

                    s.Applicant_List_Data[row_id].email_aknowldge_dttm = se.email_aknowldge_dttm
                    s.Applicant_List_Data[row_id].email_aknowldge_regret_dttm = se.email_aknowldge_regret_dttm
                    s.Applicant_List_Data[row_id].email_noti_exam_dttm = se.email_noti_exam_dttm
                    s.Applicant_List_Data[row_id].email_regret_dttm = se.email_regret_dttm
                    s.Applicant_List_Data[row_id].email_noti_hrmpsb_dttm = se.email_noti_hrmpsb_dttm
                    s.Applicant_List_Data[row_id].email_notintop5_dttm = se.email_notintop5_dttm
                    s.Applicant_List_Data[row_id].email_congratulatory_dttm = se.email_congratulatory_dttm


                    swal(d.data.message, { icon: d.data.icon })

                    $(".emailbtncls" + row_id).removeClass("fa fa-spinner fa-spin");
                    $(".emailbtncls" + row_id).addClass('fa fa-paper-plane');
                    $("#emailbtn" + row_id).prop("disabled", false);
                    cs.loading("hide")
                })


            }
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
                data: s.PsbSchedule_Data,
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
                                "<span class='text-left btn-block no-padding text-danger " + vw_zoomdt(full["exam_type"]) + "' style='margin-top:-18px;font-size:12px;'>Meeting ID: " + full["zoom_meeting_id"] + "</span></br>" +
                                "<span class='text-left btn-block no-padding text-danger " + vw_zoomdt(full["exam_type"]) + "' style='margin-top:-18px;font-size:12px;'>Passcode: " + full["zoom_passcode"] + "</span></br>"

                        }
                    },
                    {
                        "mData": "exam_time",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-center btn-block'>" + convertTo12HourFormat(data) + "</span>"
                        }
                    },

                    {
                        "mData": "psb_status",
                        "mRender": function (data, type, full, row) {
                            return '<div>' +
                                '<div class="btn-group">' +
                                '<button class="btn btn-info btn-sm dropdown-toggle btn-grid" type="button" data-toggle="dropdown" data-placement="top" title="Set exam schedule" ng-click="set_exam_schedule(' + row["row"] + ')">Set Exam</button>' +
                               
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

        var dt = s.Applicant_List_Data[s.rowindex_forexamtimeset]
        console.log(dt)
        console.log(s.rowindex_forexamtimeset)
        var exam_id = s.ExamSchedule_Data[row].exam_id
        h.post("../cApplicantsReview/SetExamSchedule", {
              app_ctrl_nbr       :dt.app_ctrl_nbr
             ,hiring_period      :dt.hiring_period
             ,item_no            :dt.item_no
             ,budget_code        :dt.budget_code
             , employment_type: dt.employment_type 
             ,exam_id           :exam_id 
        }).then(function (d) {
            swal(d.data.message, { icon: d.data.icon });
            console.log(d.data.review_list)
            s.Applicant_List_Data = d.data.review_list.refreshTable("Applicant_List_Grid","")
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

        $("#item_nbr1").select2().on('change', function (e) {
            s.selectItem()
        });

        $("#department_code1").select2().on('change', function (e) {
            s.selectDepartment()
        });

        if (localStorage['employment_type']) {
            employment_type = localStorage['employment_type']
            addvalue("employment_type", localStorage['employment_type'])
            if (employment_type == "") {
                s.budget_year = []
                s.department = []
                s.items = []
                addvalue("budget_code", "")
                addvalue("department_code1", "")
                addvalue("item_nbr1", "")
                addvalue("app_status", "")
                localStorage.removeItem("budget_code");
                localStorage.removeItem("department_code1");
                localStorage.removeItem("item_nbr1");
            }
            else {
                getBudgetCode()
                //if (localStorage['budgetcodes_re']) {
                //    s.budget_year = JSON.parse(localStorage['budgetcodes_re'])
                //    if (localStorage['budgetcode']) {
                //        budget_code = localStorage['budgetcode']
                //        addvalue("budget_code", localStorage['budgetcode'])
                //    }
                //}
                //else if (localStorage['budgetcodes_ce']) {
                //    s.budget_year = JSON.parse(localStorage['budgetcodes_ce'])
                //    if (localStorage['budgetcode']) {
                //        budget_code = localStorage['budgetcode']
                //        addvalue("budget_code", localStorage['budgetcode'])
                //    }
                //}
                //else if (localStorage['budgetcodes_jo']) {
                //    s.budget_year = JSON.parse(localStorage['budgetcodes_jo'])
                //    if (localStorage['budgetcode']) {
                //        budget_code = localStorage['budgetcode']
                //        addvalue("budget_code", localStorage['budgetcode'])
                //    }
                //}

            }
        }
       
        if (localStorage["budget_code"]) {
            addvalue("budget_code", localStorage["budget_code"])
            if (localStorage["budget_code"] == "") {
                addvalue("hiring_period", "")
                addvalue("department_code1", "")
                addvalue("item_nbr1", "")
                addvalue("app_status", "")
            }
            else {
            }
        }
        else {
            addvalue("hiring_period", "")
            addvalue("department_code1", "")
            addvalue("item_nbr1", "")
            addvalue("app_status", "")
        }
        
        if (localStorage["hiringperiodlist"]) {
            s.hiringperiodlist = JSON.parse(localStorage['hiringperiodlist'])
            if (localStorage["hiring_period"]) {
                addvalue("hiring_period", localStorage['hiring_period'])
            }
        }

        if (localStorage['department']) {
            s.department = JSON.parse(localStorage['department'])
            if (localStorage['department_code1']) {
                addvalue("department_code1", localStorage['department_code1'])
                console.log(localStorage['      '])
            }
        }
        else {
            h.post("../cApplicantsReview/getDepartment").then(function (d) {
                s.department = d.data.department
                localStorage["department"] = JSON.stringify(d.data.department)
            })
        }
         
        if (localStorage["items"]) {
           s.items = JSON.parse(localStorage['items'])
          //if (localStorage['item_nbr1']) {
          //    addvalue("item_nbr1", localStorage['item_nbr1'])
          //   console.log(localStorage['item_nbr1'])
          //
          // //   GetReviewItem()
          //}
        
        }
        if (localStorage['psb_ctrl_nbr']) addvalue("psb_ctrl_nbr_disp", localStorage['psb_ctrl_nbr'])
        
        h.post("../cApplicantsReview/getApplication_status", {
           
        }).then(function (d) {
            s.application_status = d.data.application_status
        })
        
       GetReviewItem()
	}

	Init_Applicant_List_Grid([])
    Init_Panel_List_Grid([])
    Init_sendemail_List_Grid([])
    Init_sendemail_List_Grid2([])
    Init_select_applicant_APL_Grid([])
    Init_select_applicant_QS_Grid([])
    Init_PsbSchedule_Grid([])
    Init_ExamSchedule_Grid([])
	init()

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
				swal("This application must proceed first to HRMPSB Screening before you can rate Qualification standard, please add this application to HRMPSB Screening!", { icon: "error" });
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
                        swal(d.data.message, { icon: d.data.icon })
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
			swal("This applicant has no define position yet, please assign position for this specific applicant!", {icon:"error"});
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
               swal(d.data.returnUpdate, { icon: d.data.icon })
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
               swal(d.data.returnUpdate, { icon: d.data.icon })
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
                swal(d.data.updateapl.output_message, { icon: d.data.icon })
                cs.loading("hide")
            })
        }
        else {
            h.post("../cApplicantsReview/Updatefrompds", {
                info_ctrl_nbr: l.info_ctrl_nbr
                , empl_id: l.empl_id

            }).then(function (d) {
                swal(d.data.updatepds.output_message, { icon: d.data.icon })
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
                            swal("No data found!", { icon: "warning", timer: 2000 })
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
                            swal("No data found!gggg", { icon: "warning", timer: 2000 })
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
              swal(d.data.returnUpdate, { icon: d.data.icon })
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
                swal("No data found!", { icon: "warning", timer: 2000 })
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
            swal(d.data.returnUpdate, { icon: d.data.icon })
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
            swal(d.data.updatepds.output_message, { icon: d.data.icon })
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
                swal(d.data.updateapl.output_message, { icon: d.data.icon })
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

	s.selectEmploymentType = function (val) {
        cs.loading("show")
        s.budget_year = []
        s.department = []
        s.items = []
        addvalue("budget_code", "")
        addvalue("hiring_period", "")
        addvalue("department_code1", "")
        addvalue("item_nbr1", "")
        addvalue("app_status", "")

        localStorage.removeItem('budgetcode')
        localStorage.removeItem('hiring_period')
        localStorage.removeItem('item_nbr1')
        localStorage.removeItem('department_code1')
        localStorage['employment_type'] = val;
      
        if (val != "") {
            if (localStorage['budgetcodes']) {
                s.budget_year = JSON.parse(localStorage['budgetcodes'])
                cs.loading("hide")
            }
            else {
                getBudgetCode()
                cs.loading("hide")
            }
        }
        else {
            localStorage.removeItem('employment_type')
            cs.loading("hide")
        }

      
        var dt = []
        s.Applicant_List_Data = dt.refreshTable("Applicant_List_Grid", "")
        localStorage.removeItem("review_list")
    }


    function getBudgetCode() {
        var employment_type = s.employment_type
        h.post("../cApplicantsReview/getBudget_Code", { employment_type: employment_type}).then(function (d) {
           
            if (d.data.icon == "success") {
                localStorage['budgetcodes'] = JSON.stringify(d.data.budgetyear);
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



    s.selectBudgetCode = function (val) {
        cs.loading("show")
        s.items = []
        var employment_type = s.employment_type
        var budget_code = s.budget_code
        if (val != "") {

            localStorage['budget_code'] = val;
           
            h.post("../cApplicantsReview/getHiringPeriod", {employment_type: employment_type, budget_code: budget_code}).then(function (d) {
                s.hiringperiodlist = d.data.hiringperiodlist
                localStorage["hiringperiodlist"] = JSON.stringify(d.data.hiringperiodlist)
                cs.loading("hide")
            })
            
        }
        else {

            s.budget_year = []
            s.department = []
            s.items = []
            localStorage.removeItem('budget_code')
            localStorage.removeItem('item_nbr1')
            localStorage.removeItem('department_code1')
            localStorage.removeItem("items")
            cs.loading("hide")
        }

        addvalue("hiring_period", "")
        addvalue("department_code1", "")
        addvalue("item_nbr1", "")
        addvalue("app_status", "")
        var dt = []
        s.Applicant_List_Data = dt.refreshTable("Applicant_List_Grid", "")
        localStorage.removeItem("review_list")
    }

    s.selectHiringPeriod = function (val) {

        localStorage['hiring_period'] = val;


        h.post("../cApplicantsReview/getDepartment", { hiring_period: val }).then(function (d) {
            s.department = d.data.department
            s.psb_sked_hdr = d.data.psb_sked_hdr
            localStorage["department"] = JSON.stringify(d.data.department)
            cs.loading("hide")
        })
        //if (val == "") {
        //    addvalue("department_code1", "")
        //    addvalue("item_nbr1", "")
        //    addvalue("app_status", "")
        //    localStorage.removeItem('department_code1')
        //    localStorage.removeItem('item_nbr1')
        //   alert("sdas")
        //}
        //else {
        //    //cs.notrequired2("hiring_period", "")
        //    //if (localStorage['department']) {

        //    //    if (localStorage['department']) {
        //    //        s.department = JSON.parse(localStorage['department'])
        //    //        if (localStorage['department_code1']) addvalue("department_code1", localStorage['department_code1'])
        //    //    }
        //    //    cs.loading("hide")
        //    //}
        //    //else {
        //    //    h.post("../cApplicantsReview/getDepartment", { hiring_period: val} ).then(function (d) {
        //    //        s.department = d.data.department
        //    //        localStorage["department"] = JSON.stringify(d.data.department)
        //    //        cs.loading("hide")
        //    //    })
        //    //}
        //    h.post("../cApplicantsReview/getDepartment", { hiring_period: val }).then(function (d) {
        //        s.department = d.data.department
        //        s.psb_sked_hdr = d.data.psb_sked_hdr
        //        localStorage["department"] = JSON.stringify(d.data.department)
        //        cs.loading("hide")
        //    })
        //}
        addvalue("department_code1", "")
        addvalue("item_nbr1", "")
        addvalue("app_status", "")
      
        localStorage.removeItem('item_nbr1')
        localStorage.removeItem('department_code1')
       

    }

    s.selectDepartment = function () {
       // cs.loading("show")
        var hiring_period = $("#hiring_period").val()
        var employment_type = $("#employment_type").val()
        var budget_code = $("#budget_code").val()
        if (hiring_period == "") {
            addvalue("department_code1", "")
            cs.required2("hiring_period", "Required field!")
            $("#select2-department_code1-container").text("--Select Here--")
            cs.loading("hide")
        }
        else {
            if (department_code != "") {
                var department_code = $("#department_code1").val()
                localStorage["department_code1"] = $("#department_code1").val()
                h.post("../cApplicantsReview/getPublicationVacant", {
                    budget_code: budget_code,
                    employment_type: employment_type,
                    department_code: department_code,
                    hiring_period: hiring_period
                }).then(function (d) {
                    if (d.data.icon == "success") {
                        s.items = d.data.items
                        localStorage["items"] = JSON.stringify(d.data.items)
                        addvalue("item_no", "")
                        addvalue("app_status", "")
                    }
                    else {
                        console.log(d.data.message)
                    }
                    cs.loading("hide")
                })
            }
            else {
                cs.loading("hide")
                s.department = []
                s.items = []
                localStorage.removeItem('item_nbr1')
                localStorage.removeItem('department_code1')

            }
        }
       
        var dt = []
        s.Applicant_List_Data = dt.refreshTable("Applicant_List_Grid", "")
        localStorage.removeItem("review_list")
    }

    function GetReviewItem() {
           var item_no = $("#item_nbr1").val();
           // var item_no = s.item_nbr1
            var budget_code = s.budget_code
            var employment_type = s.employment_type
            var hiring_period = s.hiring_period
           var department_code = $("#department_code1").val(); 
            //var department_code = s.department_code1
        console.log(item_no + "-" + budget_code + "-" + employment_type + "-" + hiring_period + "-" + department_code)
        if (item_no == undefined || item_no == "") {
            cs.clearTable("Applicant_List_Grid")
        }
        else {
            h.post("../cApplicantsReview/getReviewItem", {
                  item_no: item_no
                , budget_code: budget_code
                , employment_type: employment_type
                , hiring_period: hiring_period
                , department_code: department_code
            }).then(function (d) {
                if (d.data.icon == "success") {
                    addvalue("psb_ctrl_nbr_disp", d.data.psb_ctrl_nbr)
                    localStorage['psb_ctrl_nbr'] = d.data.psb_ctrl_nbr;
                    s.Applicant_List_Data_Orig = d.data.review_list
                    //localStorage['review_list'] = JSON.stringify(d.data.review_list);
                    s.Applicant_List_Data = d.data.review_list.refreshTable("Applicant_List_Grid", "")
                    console.log(s.Applicant_List_Data)
                    addvalue("app_status", "")
                }
                else {
                    console.log(d.data.message)
                }
            })
        }
       
    }





    s.selectItem = function () {
        cs.loading("show")
        var item_no = $("#item_nbr1").val();
        localStorage['item_nbr1'] = item_no;

       
        GetReviewItem()
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
        console.log(s.Applicant_List_Data_Orig)
       
        var dt = s.Applicant_List_Data_Orig.filter(function (d) {
            return d.app_status == val.toString()
        })

        s.Applicant_List_Data = dt.refreshTable("Applicant_List_Grid", "")

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
				swal(d.data.message, { icon: d.data.icon })
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
			
			h.post("../cApplicantsReview/getPsbSchedList", { item_no: s.item_no }).then(function (d) {
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
					swal(d.data.message, {icon:d.data.icon})
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

					swal(d.data.message, { icon: d.data.icon });
					$("#addToPsbSched").modal("hide")

			 }
				else {

					swal(d.data.message, { icon: d.data.icon });

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
			swal("Applicants item not yet added to PSB screening schedule", { icon: "error" });
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
					swal(d.data.message, { icon: d.data.icon });
					cs.spinnerRemove("pass" + row, "checkmark")
				}
				else {
					swal(d.data.message, { icon: d.data.icon });
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
            swal("No email address provided by the applicant!", { icon: "error" })
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
                swal(d.data.message, { icon: d.data.icon })
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
                        , psb_ctrl_nbr: var_psb_ctrl_nbr
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
            var app_ctrl_nbr = l.app_ctrl_nbr
            h.post("../cApplicantsReview/SetHistoryPage").then(function (d) {
                      location.href = "../cViewUploadedFileFromAPL/Index?app_ctrl_nbr=" + app_ctrl_nbr
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

    s.setExamDate = function (row) {
        s.rowindex_forexamtimeset = row

        h.post("../cApplicantsReview/GetExamSchedules").then(function (d) {
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
