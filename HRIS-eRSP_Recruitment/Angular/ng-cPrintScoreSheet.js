


ng_eRSP_App.controller("cPrintScoreSheet_Ctrlr", function (commonScript, $scope, $http, $filter, $compile) {

    //sp_hrmpsb_screening_list - dataTable List
    //sp_hrmpsbscreening_item_list - dropdown list
	var s = $scope
	var h = $http
	var cs = commonScript
	s.all_data = []
	s.psbsched_item = []
	s.panel_user_id = ""

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

	s.budget_year = []
	s.svc = [{ id: false, text: 'No' }, { id: true, text: 'Yes' }]


	var Init_PSB_List_Grid = function (par_data) {
		s.Data_List = par_data;
		s.Data_Table = $('#Data_List_Grid').dataTable(
			{
				data: s.Data_List,
				sDom: 'rt<"bottom"p>',
				pageLength: 10,
				columns: [
					{
						"mData": "department_name1",
						"mRender": function (data, type, full, row) {
							return "<span class='text-left btn-block'>" + data + "</span>"
						}
					},

					{
						"mData": "item_no",
						"mRender": function (data, type, full, row) {
							return "<span class='text-center btn-block'>" + data + "</span>"
						}
					},
					{
						"mData": "position_long_title",
						"mRender": function (data, type, full, row) {
							return "<span class='text-left btn-block'>" + data + "</span>"
						}
					},
					{
						"mData": "first_name",
						"mRender": function (data, type, full, row) {
                            return "<span class='text-left btn-block'>" + data + " " + s.mi(full["middle_name"])+" "+full["last_name"] + "</span>"
						}
					},
					{
						"mData": "gender",
						"mRender": function (data, type, full, row) {

                            return "<span class='text-center btn-block'>" + s.gender_descr(data) + "</span>"
						}
					},

					{
						"mData": "app_status",
						"bSortable": false,
						"mRender": function (data, type, full, row) {

							return '<center><div class="btn-group action-btn">' +
									 '<button type="button" class="btn btn-danger btn-sm action" data-toggle="tab" data-toggle="tooltip" data-placement="top" title="Print Score Sheet" ng-click="printScoreSheet(' + row["row"] + ')" >  <i class="fa fa-print"></i></button >' +
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
    s.mi = function (data) {
        var str = data.charAt(0).toUpperCase()
        return str + ".";
    }
    s.gender_descr = function (data) {
        var str = ""
        if (data == "F") {
            str = "Female"
        }
        else if (data == "M") {
            str = "Male"
        }    
        return str;
    }


	function init() {
		cs.loading("show")
		
		s.rowLen = "10"
		h.post("../cPrintScoreSheet/Initialize").then(function (d) {
			if (d.data.icon == "success") {
				
				s.psbsched_item = d.data.psbsched_item
    //            s.all_data = d.data.psblist

				//s.Data_List = d.data.psblist.refreshTable("Data_List_Grid", "")
				s.panel_user_id = d.data.panel_user_id
				$(document).ready(cs.loading("hide"))
			}
			else {
				console.log(d.data.message)
				$(document).ready(cs.loading("hide"))
			}
		})
	}

	Init_PSB_List_Grid([])
	init()




	//************************************// 
	//*** Print Score Sheet             
	//**********************************// 
	//s.printScoreSheet = function (row_index) {

 //       var dt = s.Data_List[row_index]
 //       cs.loading("show")
	//	var controller = "Reports";
	//	var action = "Index";
	//	var ReportName = "";
	//	var SaveName = "Crystal_Report";
	//	var ReportType = "inline";
	//	var ReportPath = "~/Reports/cryScoreSheet/";
	//	var sp = "sp_score_sheet_rpt"
 //       var parameters = "p_item_no," + dt.item_no + ",p_position_code," + dt.position_code + ",p_app_ctrl_nbr," + dt.app_ctrl_nbr + ",p_app_status," + dt.app_status + ",p_panel_user_id," + s.panel_user_id;
	//	ReportName = "cryScoreSheet";
	//	ReportPath = ReportPath + "" + ReportName + ".rpt";
        
	//	h.post("../cPrintScoreSheet/SetHistoryPage",
	//		{
	//			//empl_id: s.Applicant_List_Data[row_index].empl_id,
	//			//username: s.Applicant_List_Data[row_index].user_id,
	//			//password: s.Applicant_List_Data[row_index].user_password,
	//			//account_type: s.Applicant_List_Data[row_index].user_mode

	//		}).then(function (d) {
	//			location.href = "../" + controller + "/" + action + "?ReportName=" + ReportName
	//				+ "&SaveName=" + SaveName
	//				+ "&ReportType=" + ReportType
	//				+ "&ReportPath=" + ReportPath
	//				+ "&Sp=" + sp + "," + parameters
	//		});
 //   }

    s.printScoreSheet = function (row_index) {
        s.employee_name_print = 'APPLICANT SCORE SHEET';
      

        var dt = s.Data_List[row_index]
        var controller = "Reports";
        var action = "Index";
        var ReportName = "cryScoreSheet";
        var SaveName = "Crystal_Report";
        var ReportType = "inline";
        var ReportPath = "~/Reports/cryScoreSheet/";
        var sp = "";
       
        ReportName = "cryScoreSheet";
        ReportPath = ReportPath + "" + ReportName + ".rpt";
        sp = "sp_score_sheet_rpt,p_item_no," + dt.item_no + ",p_position_code," + dt.position_code + ",p_app_ctrl_nbr," + dt.app_ctrl_nbr + ",p_app_status," + dt.app_status + ",p_panel_user_id," + s.panel_user_id;
        
      

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

        console.log(s.embed_link)

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


	s.selectPSBSchedApplicant = function (val) {
	   
        h.post("../cPrintScoreSheet/set_Item_no", { item_no: val }).then(function (d) {
            if (d.data.icon == "success") {
                s.Data_List = d.data.list.refreshTable("Data_List_Grid", "")
            }
		})
    }

	s.back = function () {
	    location.href = "../cAddPsbSchedule/"
	}



})

