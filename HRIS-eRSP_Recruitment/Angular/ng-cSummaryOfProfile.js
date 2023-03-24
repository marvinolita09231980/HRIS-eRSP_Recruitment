
ng_eRSP_App.controller("cSummaryOfProfile_Ctrlr", function (commonScript, $scope, $http, $filter, $compile) {

	//Applicant_Details_Data source sp = sp_summaryofprofile_list
	var s = $scope
	var h = $http
	var cs = commonScript

	s.eduactionqs       =  ""
	s.experienceqs      =  ""
	s.trainingqs        =  ""
	s.eligibilityqs     =  ""

	var Init_DataList_Grid = function (par_data) {
		s.Data_List = par_data;
		s.Data_Table = $('#datalist_grid').dataTable(
			{
				data: s.Data_List,
				sDom: 'rt<"bottom"p>',
				pageLength: 10,
				columns: [
					{
						"mData": "applicant_name",
						"mRender": function (data, type, full, row) {
							return '<span class="text-left btn-block">' + data + '</span>'
						}
					},
					{
						"mData": "education",
						"mRender": function (data, type, full, row) {

							return '<span style="width:90%;" class="text-left btn-block " ng-click="show_details_action(' + row["row"] + ')">'
									+ data + '<br>' + '</span>'
						}
					},
					{
						"mData": "training",
						"mRender": function (data, type, full, row) {
							return '<span style="width:90%;" class="text-center btn-block" ng-click="show_details_action(' + row["row"] + ')">' + data + '</span>' 
						}
					},
					{
						"mData": "work_experience",
						"mRender": function (data, type, full, row) {
							return '<span style="width:90%;" class="text-left btn-block" ng-click="show_details_action(' + row["row"] + ')">'
								+ data + '<br>'
								+ '</span>'
						}
					},

					{

						"mData": "eligibility",
						"mRender": function (data, type, full, row) {
							return '<span style="width:90%;" class="text-left btn-block" ng-click="show_details_action(' + row["row"] + ')" >' + data + '</span>' 
						}
					},
					{

						"mData": null,
						"mRender": function (data, type, full, row) {
							return '<span style="width:10%;" class="pull-right btn-block" ng-click="show_details_action(' + row["row"] + ')"></span>'
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


	function fltr(data) {
		if (cs.elEmpty(s.app_status)) {
			return s.Applicant_List_Data_Orig
		}
		else {
			return data.filter(function (d) {
				return d.app_status == s.app_status
			})
		}

	}
	function addvalue(id, value) {
		$("#" + id).val(value)
		s[id] = value
	}
	function init() {
		cs.loading("show")
		s.rowLen = "10"
		h.post("../cSummaryOfProfile/Initialize").then(function (d) {
			s.Data_List = d.data.summaryProfile.refreshTable("datalist_grid", "")
			s.summaryProfileQS = d.data.summaryProfileQS
			s.eduactionqs       = s.summaryProfileQS[0].item_education
			s.experienceqs      = s.summaryProfileQS[0].item_work_experience
			s.trainingqs        = s.summaryProfileQS[0].item_training
			s.eligibilityqs     = s.summaryProfileQS[0].item_eligibility
			cs.loading("hide")
		})
	}
	Init_DataList_Grid([])
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


	s.show_details_action = function (row) {
		var dt = s.Applicant_Details_Data[row]
		alert("test")
		console.log(dt)
	}

	//************************************// 
	//*** Print Score Sheet             
	//**********************************// 
	s.printScoreSheet = function (row_index) {

		var dt = s.Applicant_List_Data[row_index]
		//cs.loading("show")
		var controller = "Reports";
		var action = "Index";
		var ReportName = "";
		var SaveName = "Crystal_Report";
		var ReportType = "inline";
		var ReportPath = "~/Reports/cryScoreSheet/";
		var sp = "sp_score_sheet_rpt"
		var parameters = "p_item_no," + dt.item_no + ",p_app_ctrl_nbr," + dt.app_ctrl_nbr + ",p_app_status," + dt.app_status;
		ReportName = "cryScoreSheet";
		ReportPath = ReportPath + "" + ReportName + ".rpt";

		// app_ctrl_nbr: "000004"
		// app_status: "1"​
		// item_no: "0306"


		// p_item_no 
		// p_app_ctrl_nbr 
		// p_app_status 

		//sp = "sp_payrollregistry_oth1_rep";
		//parameters = "par_payroll_year," + s.txtb_payroll_year + ",par_payroll_registry_nbr," + s.txtb_ctrl_no + ",par_payrolltemplate_code," + $('#ddl_reports option:selected').val()


		h.post("../cApplicantsReview/SetHistoryPage",
			{
				//empl_id: s.Applicant_List_Data[row_index].empl_id,
				//username: s.Applicant_List_Data[row_index].user_id,
				//password: s.Applicant_List_Data[row_index].user_password,
				//account_type: s.Applicant_List_Data[row_index].user_mode

			}).then(function (d) {
				location.href = "../" + controller + "/" + action + "?ReportName=" + ReportName
					+ "&SaveName=" + SaveName
					+ "&ReportType=" + ReportType
					+ "&ReportPath=" + ReportPath
					+ "&Sp=" + sp + "," + parameters
			});
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
				if ((!cs.elEmpty(totalitems) && !cs.elEmpty(scorerendered)) && (totalitems.length >= scorerendered.length)) {
					if ((parseInt(totalitems) >= parseInt(scorerendered)) == true) {
						perc = (scorerendered * 100) / totalitems;
						$('#' + form + ' input[name="scoreperc"]').val(perc.toFixed(2))
						s.score_percentage = perc.toFixed(2)
					}
					else {
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


ng_eRSP_App.directive('max25', ["commonScript", function (cs) {

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
				if (val > 25) {
					alert("Rating must not be higher than 25")
					elem.val("")
					s.id = ""
				}
			})
		}
	}

}])

