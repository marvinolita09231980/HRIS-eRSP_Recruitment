 
ng_eRSP_App.controller("cAddPsbSchedule_Ctrlr", function (commonScript, $scope, $http, $filter, $compile) {
    var s = $scope
    var h = $http
    var cs = commonScript

    //string scope
    s.rowLen = "8"
    s.a_psb_ctrl_nbr = ""
    s.employmenttype = ""
    s.budgetcode = ""
    s.psb_ctrl_nbr = ""
    s.user_type = ""
    s.panel_user_id = ""

    //boolean scope
    s.found = true
    s.edit = false

    //int scope
    s.psb_status = 0
    s.items = []
    //array scope
    s.budget_year = []
    s.departments = []
    s.panel_role = []
    s.psb_schedule = []
    s.appls_in_items = []
    s.pos_item = []
    s.added_item = []
    s.remove_item = []
    s.psb_items_forpanel = []
    s.multiple_panel_items = []
    s.multiple_panel_items_remove = []
    s.panel_data = []
    s.PsbItemMultiple_Data_2_orig = []
    s.panelMultipleItems = ""
    s.datatable = []
    s.ng_psbitemselected = []
    s.ng_psbitemremove = []
    s.ng_To_add_items = []
    s.ng_To_del_items = []

    s.PsbItem_Data2_Orig = []
    s.PsbItem_Data3_Orig = []
    s.hiring_periods = []
    //object scope
    s.um = {}

    s.mtpl = {
          psb_ctrl_nbr : ""
        , employment_type : ""
    }

    s.mtpl_2 = {
          psb_name  : ""
        , psb_ctrl_nbr  : ""
    }

	s.mbr = {
		  psb_ctrl_nbr: ""
		, panel_user_id: ""
        , psb_mbr_role: ""
        , branch:""
        , inhouse: ""
		, psb_name: ""
        , agency: ""
    }

	s.sched = {
		 psb_date: ""
	   , employment_type: ""
       , budget_code: ""
       , hiring_period: ""
       , remarks_details: ""
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
							return "<span class='text-center btn-block'>" + data + "</span>"
						}
					},
					{
						"mData": "remarks_details",
						"mRender": function (data, type, full, row) {
							return "<span class='text-left btn-block'>" + data + "</span>"
						}
                    },
                    {
                        "mData": "period_descr",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-center btn-block'>" + data + "</span>"
                        }
                    },
					{
						"mData": "psb_status_descr",
						"mRender": function (data, type, full, row) {
                            return "<span class='text-center btn-block'>" + data + "</span>"
						}
                    },
                   
                    //{
                    //    "mData": "psb_status_descr",
                    //    "mRender": function (data, type, full, row) {
                    //        return "<span class='text-center btn-block'>" + data + "-" + s.fn_disabled_rating(full["disabled_rating"]) + "</span>"
                    //    }
                    //},
					{
						"mData": "psb_status",
						"mRender": function (data, type, full, row) {

         //                   return '<center><div class="btn-group">' +
         //                           '<button  type="button" class="btn btn-success btn-md action" data-toggle="tooltip" data-placement="top" title="Add Item" ng-click="btn_psbsetup(' + row["row"] + ')"><i class="fa fa-gear "></i></button >' +
         //                           '<button  type="button" class="btn btn-success btn-md action" data-toggle="tooltip" data-placement="top" title="Show Panel" ng-click="show_panel(' + row["row"] + ',' + data + ')"><i class="fa fa-list"></i></button >' +
									//'<button  type="button" class="btn btn-info btn-md action" data-toggle="tooltip" data-placement="top" title="Applicant List" ng-click="psb_app_list(' + row["row"] + ',' + data + ')"><i class="fa fa-users"></i></button >' +
         //                           '<button  type="button" ng-disabled="' + full["edit_disabled"] + '" class="btn btn-info btn-md action" data-toggle="tooltip" data-placement="top" title="Edit PSB Schedule" ng-click="btn_edit(' + row["row"] + ')" ng-disabled="' + data + '==2"><i class="fa fa-edit"></i></button >' +
         //                           '<button  type="button" ng-disabled="' + full["del_disabled"] + '" class="btn btn-danger btn-md action" data-toggle="tooltip" data-placement="top" title="Delete PSB Schedule" ng-click="psb_sched_del(' + row["row"] + ')" ng-disabled="' + data + '==2"><i id="del_row' + row["row"] + '" class="fa fa-trash"></i></button>' +
         //                           '</div></center>';

                            return '<div>' +
                                       '<div class="btn-group">' +
                                           '<button class="btn btn-info btn-sm dropdown-toggle btn-grid" type="button" data-toggle="dropdown" data-placement="top" title="Click for more action">MORE ACTION</button>' +
                                           '<ul class="dropdown-menu ">' +
                                           '<li><a ng-click="btn_psbsetup(' + row["row"] + ')">OTHER SETUP</a></li>' +
                                           '<li><a ng-click="show_panel(' + row["row"] + ',' + data + ')">SHOW PANEL FOR THIS HRMPSB</a></li>' +
                                           '<li><a ng-click="psb_app_list(' + row["row"] + ',' + data + ')">SHOW APPLICANTS FOR THIS HRMPSB</a></li>' +
                                           '<li><a ng-disabled="' + full["edit_disabled"] +'" ng-click="btn_edit(' + row["row"] + ')">EDIT HRMPSB SCHEDULE</a></li>' +
                                           '<li><a ng-disabled="' + full["edit_disabled"] +'"  ng-click="btn_refreshPanelList(' + row["row"] + ')">REFRESH PANEL LIST</a></li>' +
                                           '</ul>' +
                                       '</div>' +
                                       '<button  type="button" ng-disabled="' + full["del_disabled"] + '" class="btn btn-danger btn-sm btn-grid" data-toggle="tooltip" data-placement="top" title="Delete PSB Schedule" ng-click="psb_sched_del(' + row["row"] + ')" ng-disabled="' + data + '==2">Delete</button>' +
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

    s.fn_disabled_rating = function (data) {
        if (data == true) {
            return "Disabled Rating"
        } else {
            return "Enabled Rating"
        }
    }


	var Init_Applicant_List_Grid = function (par_data) {
		s.Applicant_List_Data = par_data;
		s.Applicant_List_Table = $('#Applicant_List_Grid').dataTable(
			{
				data: s.Applicant_List_Data,
				sDom: 'rt<"bottom"p>',
				pageLength: 10,
				columns: [
					{ "mData": "app_ctrl_nbr_disp", "mRender": function (data, type, full, row) { return "<span class='text-center btn-block'>" + data + "</span>" } },

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
					},
					{
						"mData": "employment_type_descr",
						"mRender": function (data, type, full, row) {
							return "<span class='text-center btn-block'>" + data + "</span>"
						}
					},
					
					{
						"mData": "app_status",
						"bSortable": false,
						"mRender": function (data, type, full, row) {
							return '<center><div class="btn-group action-btn">' +
									'<button type="button" ng-disabled="' + BoleanTest(data, "2") + ' || '+full["btn_disabled"]+'" class="btn btn-danger btn-sm action" data-toggle="tab" data-toggle="tooltip" data-placement="top" title="Print Score Sheet" ng-click="printScoreSheet(' + row["row"] + ')" >  <i class="fa fa-print"></i></button >' +
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

	 //Panel Members List Grid
	var Init_PsbPanel_Grid = function (par_data) {
		s.PsbPanel_Data = par_data;
		s.PsbPanel_Table = $('#psb_panel').dataTable(
			{
				data: s.PsbPanel_Data,
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
					},
					{
						"mData": null,
						"bSortable": false,
						"mRender": function (data, type, full, row) {

                            return '<center><div class="btn-group">' +
                               // '<button type="button" class="btn btn-warning btn-sm action" data-toggle="tab" data-toggle="tooltip" data-placement="top" title="Add Item" ng-click="addItemToPanel(' + row["row"] + ')" >  <i class="fa fa-plus"></i></button >' +
                                '<button type="button" class="btn btn-success btn-sm action" data-toggle="tab" data-toggle="tooltip" data-placement="top" title="Print Score Sheet" ng-click="printScoreSheet(' + row["row"] + ')" >  <i class="fa fa-print"></i></button >' +
                                '<button type="button" class="btn btn-info btn-sm action" data-toggle="tab" data-toggle="tooltip" data-placement="top" title="Print Score Sheet" ng-click="gotoPanelRating(' + row["row"] + ')" >  <i class="fa fa-star"></i></button >' +
								'<button  type="button" class="btn btn-danger btn-md action" ng-click="panel_del(' + row["row"] + ')">   <i id="del_row' + row["row"] + '" class="fa fa-trash"></i></button>' +
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

	var Init_PsbApp_Grid = function (par_data) {
		s.PsbApp_Data = par_data;
		s.PsbApp_Table = $('#psb_app').dataTable(
			{
				data: s.PsbApp_Data,
				sDom: 'rt<"bottom"p>',
				pageLength: 10,
				columns: [
					{
						"mData": "app_ctrl_nbr",
						"mRender": function (data, type, full, row) {
							return "<span class='text-left btn-block'>" + data + "</span>"
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
					},
					{
						"mData": "item_no",
						"mRender": function (data, type, full, row) {
							return "<span class='text-left btn-block'>" + data + "</span>"
						}
					},
					{
						"mData": "department_name1",
						"mRender": function (data, type, full, row) {
							return "<span class='text-left btn-block'>" + data + "</span>"
						}
					},
					{
						"mData": "employment_type_descr",
						"mRender": function (data, type, full, row) {
							return "<span class='text-left btn-block'>" + data + "</span>"
						}
					},
					{
						"mData": null,
						"bSortable": false,
						"mRender": function (data, type, full, row) {

							return '<center><div class="btn-group">' +
								'<button  type="button" class="btn btn-danger btn-md action" ng-click="app_del(' + row["row"] + ')" ng-disabled="psb_status == 1 || psb_status == 2 || ' + full["btn_disabled"] + '">   <i id="del_row' + row["row"] + '" class="fa fa-trash"></i></button>' +
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

	//var Init_PsbItem_Grid = function (par_data) {
	//	s.PsbItem_Data = par_data;
	//	s.PsbItem_Table = $('#psb_items').dataTable(
	//		{
	//			data: s.PsbItem_Data,
	//			sDom: 'rt<"bottom"p>',
	//			pageLength: 10,
 //               columns: [
 //                   {
 //                       "mData": null, "mRender": function (data, type, full, row) {
 //                           return "<i id='icn1" + row["row"] + "' class='text-info fa fa-check-circle hidden'></i>"
 //                       },
 //                   },
	//				{
	//					"mData": "item_no",
	//					"mRender": function (data, type, full, row) {
	//						return "<span class='text-left btn-block'>" + data + "</span>"
	//					}
	//				},

	//				{
 //                       "mData": "position_title1",
	//					"mRender": function (data, type, full, row) {
	//						return "<span class='text-left btn-block'>" + data + "</span>"
	//					}
	//				},
	//				{
	//					"mData": "department_name1",
	//					"mRender": function (data, type, full, row) {
	//						return "<span class='text-left btn-block'>" + data + "</span>"
	//					}
	//				},
	//				{
	//					"mData": "item_added",
	//					"bSortable": false,
 //                       "mRender": function (data, type, full, row) {
 //                           return '<center><div class="btn-group">' +
 //                               '<button  type="button" ng-hide="'+data+'" class="btn btn-success btn-sm action" data-toggle="tab" ng-click="ng_add_item(' + row["row"] + ')" data-toggle="tooltip" data-placement="left" title="Add Item">  <i id="icnbtn1' + row["row"] + '" class="' + s.fa_icon_changed(data) + '"></i></button >' +
 //                               '<button ng-disabled="' + full["haschild"]+'"  type="button" ng-show="'+data+'" class="btn btn-danger btn-sm action" data-toggle="tab" ng-click="ng_remove_item(' + row["row"] + ')" data-toggle="tooltip" data-placement="left" title="Remove Item">  <i id="icnbtn2' + row["row"] + '" class="fa fa-trash"></i></button >' +
 //                               '</div></center>';
	//						//return '<label class="container">' +
 //      //                         '<input type="checkbox" ng-click="check_box(' + row["row"] + ',' + data + ')" id="item' + row["row"] + '" ng-model="item' + row["row"] + '" ng-checked="' + data + '" ng-disabled= "' + full["psb_concluded"] + ' || ' + full["btn_disabled"] + '">' +
	//						//	   '<span class="educ' + row["row"] + ' checkmark"></span></label>'
	//					}
	//				}
	//				 //data-toggle="tab" href="#tab-7"
	//			],
	//			"createdRow": function (row, data, index) {
	//				//$(row).addClass("dt-row");
	//				$compile(row)($scope);  //add this to compile the DOM
	//			},

	//		});

	//	$("div.toolbar").html('<b>Custom tool bar! Text/images etc.</b>');
 //   }
    var Init_PsbItem_Grid2 = function (par_data) {
        s.PsbItem_Data2 = par_data;
        s.PsbItem_Table2 = $('#psb_items2').dataTable(
            {
                data: s.PsbItem_Data2,
                sDom: 'rt<"bottom"p>',
                pageLength: 10,
                columns: [
                    {
                        "mData": null, "mRender": function (data, type, full, row) {
                            return "<i id='icn1" + row["row"] + "' class='text-info fa fa-check-circle hidden'></i>"
                        },
                    },
                    {
                        "mData": "item_no",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-left btn-block'>" + data + "</span>"
                        }
                    },

                    {
                        "mData": "position_title1",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-left btn-block'>" + data + "</span>"
                        }
                    },
                    {
                        "mData": "department_name1",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-left btn-block'>" + data + "</span>"
                        }
                    },
                    {
                        "mData": "psb_ctrl_nbr",
                        "bSortable": false,
                        "mRender": function (data, type, full, row) {
                            return '<center><div class="btn-group">' +
                                '<button  type="button" ng-hide="' + data + '" class="btn btn-success btn-sm action" data-toggle="tab" ng-click="ng_add_item2(' + row["row"] + ')" data-toggle="tooltip" data-placement="left" title="Add Item">  <i id="icnbtn1' + row["row"] + '" class="' + s.fa_icon_changed2(data) + '"></i></button >' +
                                //'<button ng-disabled="' + full["haschild"] + '"  type="button" ng-show="' + data + '" class="btn btn-danger btn-sm action" data-toggle="tab" ng-click="ng_remove_item2(' + row["row"] + ')" data-toggle="tooltip" data-placement="left" title="Remove Item">  <i id="icnbtn2' + row["row"] + '" class="fa fa-trash"></i></button >' +
                                '</div></center>';
                            //return '<label class="container">' +
                            //                         '<input type="checkbox" ng-click="check_box(' + row["row"] + ',' + data + ')" id="item' + row["row"] + '" ng-model="item' + row["row"] + '" ng-checked="' + data + '" ng-disabled= "' + full["psb_concluded"] + ' || ' + full["btn_disabled"] + '">' +
                            //	   '<span class="educ' + row["row"] + ' checkmark"></span></label>'
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

    var Init_PsbItem_Grid3 = function (par_data) {
        s.PsbItem_Data3 = par_data;
        s.PsbItem_Table3 = $('#psb_items3').dataTable(
            {
                data: s.PsbItem_Data3,
                sDom: 'rt<"bottom"p>',
                pageLength: 10,
                columns: [
                    {
                        "mData": null, "mRender": function (data, type, full, row) {
                            return "<i id='icn1" + row["row"] + "' class='text-info fa fa-check-circle hidden'></i>"
                        },
                    },
                    {
                        "mData": "item_no",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-left btn-block'>" + data + "</span>"
                        }
                    },

                    {
                        "mData": "position_title1",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-left btn-block'>" + data + "</span>"
                        }
                    },
                    {
                        "mData": "department_name1",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-left btn-block'>" + data + "</span>"
                        }
                    },
                    {
                        "mData": "psb_ctrl_nbr",
                        "bSortable": false,
                        "mRender": function (data, type, full, row) {
                            return '<center><div class="btn-group">' +
                                '<button  type="button" ng-hide="' + data + '" class="btn btn-success btn-sm action" data-toggle="tab" ng-click="ng_add_item2(' + row["row"] + ')" data-toggle="tooltip" data-placement="left" title="Add Item">  <i id="icnbtn1' + row["row"] + '" class="' + s.fa_icon_changed2(data) + '"></i></button >' +
                                '<button ng-disabled="' + full["haschild"] + '"  type="button" ng-show="' + data + '" class="btn btn-danger btn-sm action" data-toggle="tab" ng-click="ng_remove_item2(' + row["row"] + ')" data-toggle="tooltip" data-placement="left" title="Remove Item">  <i id="icnbtn2' + row["row"] + '" class="fa fa-trash"></i></button >' +
                                '</div></center>';
                            //return '<label class="container">' +
                            //                         '<input type="checkbox" ng-click="check_box(' + row["row"] + ',' + data + ')" id="item' + row["row"] + '" ng-model="item' + row["row"] + '" ng-checked="' + data + '" ng-disabled= "' + full["psb_concluded"] + ' || ' + full["btn_disabled"] + '">' +
                            //	   '<span class="educ' + row["row"] + ' checkmark"></span></label>'
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

    s.fa_icon_changed = function (data) {
        if (data) {
            return "fa fa-check"
        }
        else {
            return "fa fa-plus"
        }
    }
    s.fa_icon_changed2 = function (data) {
    
        if (data == "") {
            return "fa fa-plus"
        }
        else {
            return "fa fa-check"
        }

    }

    var Init_PsbItemMultiple_Grid = function (par_data) {
        s.PsbItemMultiple_Data = par_data;
        s.PsbItemMultiple_Table = $('#psb_itemsMultiple').dataTable(
            {
                data: s.PsbItemMultiple_Data,
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
                        "mData": "department_name1",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-left btn-block'>" + data + "</span>"
                        }
                    },
                    {
                        "mData": "item_added",
                        "bSortable": false,
                        "mRender": function (data, type, full, row) {
                            return '<label class="container">' +
                                '<input type="checkbox" ng-click="check_box_multiple(' + row["row"] + ')" id="multiple' + row["row"] + '" ng-model="multiple' + row["row"] + '">' +
                                '<span class="educ' + row["row"] + ' checkmark"></span></label>'
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

    var Init_PsbItemMultiple_Grid_2 = function (par_data) {
        s.PsbItemMultiple_Data_2 = par_data;
        s.PsbItemMultiple_Table_2 = $('#psb_itemsMultiple_2').dataTable(
            {
                data: s.PsbItemMultiple_Data_2,
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
                        "mData": "department_name1",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-left btn-block'>" + data + "</span>"
                        }
                    },
                    {
                        "mData": "panel_user_str",
                        "bSortable": false,
                        "mRender": function (data, type, full, row) {
                            return '<label class="container">' +
                                '<input type="checkbox" ng-click="check_box_multipleB(' + row["row"] + ')" id="multipleB' + row["row"] + '" ng-model="multipleB' + row["row"] + '" ng-checked="' + checkCB(data) + '">' +
                                '<span class="educ' + row["row"] + ' checkmark"></span></label>'
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

	var Init_PsbApplicant_Grid = function (par_data) {
		s.PsbApplicant_Data = par_data;
		s.PsbApplicant_Table = $('#psb_applicant').dataTable(
			{
				data: s.PsbApplicant_Data,
				sDom: 'rt<"bottom"p>',
				pageLength: 10,
                columns: [
                    {
                        "mData": null, "mRender": function (data, type, full, row) {
                            return "<i id='icn3" + row["row"] + "' class='text-info fa fa-check-circle hidden'></i>"
                        },
                    },
					{
						"mData": "item_no",
						"mRender": function (data, type, full, row) {
							return "<span class='text-left btn-block'>" + data + "</span>"
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
					},
					{
						"mData": "is_addedd",
						"bSortable": false,
                        "mRender": function (data, type, full, row) {
                            return '<center><div class="btn-group">' +
                                '<button type="button" ng-hide="' + data + '" class="btn btn-success btn-sm action" data-toggle="tab" ng-click="ng_add_app(' + row["row"] + ')" data-toggle="tooltip" data-placement="left" title="Add Item">  <i id="icnbtnadd3' + row["row"] + '" class="' + s.fa_icon_changed(data) + '"></i></button >' +
                                //'<button ng-disabled="' + full["haschild"] + '"  type="button" ng-show="' + data + '" class="btn btn-danger btn-sm action" data-toggle="tab" ng-click="ng_remove_app(' + row["row"] + ')" data-toggle="tooltip" data-placement="left" title="Remove Item">  <i id="icnbtndel2' + row["row"] + '" class="fa fa-trash"></i></button >' +
                                '</div></center>';
							//return '<label class="container">' +
							//	   '<input type="checkbox" ng-disabled="' + full["btn_disabled"] + '" ng-click="check_box_app(' + row["row"] + ',' + data + ')" id="appl' + row["row"] + '" ng-model="appl' + row["row"] + '" ng-checked="' + data + '">' +
							//	   '<span class="educ' + row["row"] + ' checkmark"></span></label>'
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

    function addvalue(id, value) {
        $("#" + id).val(value)
        s[id] = value
    }

	Init_PsbPanel_Grid([])
	Init_PsbSchedule_Grid([])
	Init_PsbApp_Grid([])
	//Init_PsbItem_Grid([])
    Init_PsbApplicant_Grid([])
    Init_PsbItemMultiple_Grid([])
    Init_PsbItemMultiple_Grid_2([])
    Init_PsbItem_Grid2([])
    Init_PsbItem_Grid3([])

    function init() {
       
        if (localStorage["employment_type"]) {
            addvalue("employmenttype", localStorage["employment_type"])
            if (localStorage["employment_type"] == "RE") {
                if (localStorage['budget_year_re']) {
                    s.budget_year = JSON.parse(localStorage['budget_year_re'])
                
                    if (localStorage['budgetcode']) {
                        addvalue("budgetcode", localStorage['budgetcode'])
                        
                    }
                }
              
            }
            else if (localStorage["employment_type"] == "CE") {
                if (localStorage['budget_year_ce']) {
                    s.budget_year = JSON.parse(localStorage['budget_year_ce'])
                    if (localStorage['budgetcode']) {
                        addvalue("budgetcode", localStorage['budgetcode'])
                        
                    }
                }
            }
        }
        GetHiringPeriod()
        getPSBSchedule()
        //if (localStorage['departments']) {
        //    s.departments = JSON.parse(localStorage['departments'])
        //    s.panel_role = JSON.parse(localStorage['panel_role'])
           
        //} else {
        //    h.post("../cAddPsbSchedule/Initialize").then(function (d) {
        //        s.departments = d.data.departments
        //        localStorage['departments'] = JSON.stringify(d.data.departments)
        //        s.panel_role = d.data.panel_role
        //        localStorage['panel_role'] = JSON.stringify(d.data.panel_role)
        //    })
        //}
       
        h.post("../cAddPsbSchedule/Initialize").then(function (d) {
            s.departments = d.data.departments
            localStorage['departments'] = JSON.stringify(d.data.departments)
            s.panel_role = d.data.panel_role
            localStorage['panel_role'] = JSON.stringify(d.data.panel_role)
        })
    }

    init()

    function checkCB(data) {
        var spl = data.split(",")
        var code = ""
        code = spl.filter(function (d) {
            return d == s.panel_user_id
        })
        if (code == s.panel_user_id) {
            return true
        }
        else {
            false
        }
    }

    s.getItemsforPanel = function (budget_code, employment_type, psb_ctrl_nbr) {
        h.post("../cAddPsbSchedule/getItemsforPanel", { budget_code: budget_code, employment_type: employment_type, psb_ctrl_nbr: psb_ctrl_nbr }).then(function (d) {
            var itemArray = cs.createSingleItemArray(d.data.psb_items_forpanel, "item_no")
            h.post("../cAddPsbSchedule/getItems", { budget_code: budget_code, employment_type: employment_type, psb_ctrl_nbr: psb_ctrl_nbr }).then(function (d) {
                var item_list = d.data.psb_items.in(itemArray, "item_no")
                s.PsbItemMultiple_Data_2_orig = item_list
                var dt = s.PsbItemMultiple_Data_2_orig.selectByPanel(s.panel_user_id, "panel_user_str")
                s.PsbItemMultiple_Data_2 = dt.refreshTable("psb_itemsMultiple_2", "")
            })
        })
    }

    s.selectDepartment = function (departmentcode) {
        cs.loading("show")
        var dt = s.datatable;
        var psb_ctrl_nbr = dt.psb_ctrl_nbr
        s.a_psb_ctrl_nbr = dt.psb_ctrl_nbr
        h.post("../cAddPsbSchedule/selectDepartment", { psb_ctrl_nbr: psb_ctrl_nbr , department_code: departmentcode }).then(function (d) {
            s.PsbApplicant_Data = d.data.appls_in_items.refreshTable("psb_applicant", "")
            s.appls_in_items = d.data.appls_in_items
            cs.loading("hide")
        })
      
    }

    s.Select_Role = function () {
        var inhouse = $("#inhouse").val()
        $("#agency").prop("disabled", true)

        $("#agency").val("")
        s.mbr.agency = ""
        $("#panel_user_id").val("")
        s.mbr.panel_user_id = ""
        $("#psb_name").val("")
        s.mbr.psb_name = ""

        var psb_mbr_role = $("#psb_mbr_role").val()
        if (psb_mbr_role == "03") {
            $("#agency").prop("disabled", false)
        }
        if (inhouse == "0") {
            $("#agency").prop("disabled", false)
        }
    }

    s.Select_Department_Panel = function () {
        var inhouse = $("#inhouse").val()
        var department_code = $("#agency").val()
        var dt = s.departments.filter(function (d) {
            return d.department_code == department_code
        })[0]
        
        var usertype = $("#user_type").val()
        if (inhouse == "1") {
            var head_id = dt.empl_id
            h.post("../cAddPsbSchedule/findUser", { user_id: "U" + head_id, user_type: usertype }).then(function (d) {
                if (d.data.found > 0) {
                    s.mbr.panel_user_id = "U" + head_id
                    $("#panel_user_id").val("U" + head_id)
                    s.mbr.psb_name = d.data.personnelname[0].panel_name
                    $("#psb_name").val(d.data.personnelname[0].panel_name)
                }
            })
        }
        else {
            
        }
    }

    Array.prototype.selectByPanel = function (code, prop) {
        return this.filter(function (d) {
            var spl = d[prop].split(",")
            var code2 = spl.filter(function (e) {
                return e == code
            })
            return code2 == code
        })
    }
    Array.prototype.NselectByPanel = function (code, prop) {
        return this.filter(function (d) {
            var spl = d[prop].split(",")
            var code2 = spl.filter(function (e) {
                return e == code
            })
            return code2 != code
        })
    }

    s.addItemToPanel = function (row) {
        s.multiple_panel_items          = []
        s.multiple_panel_items_remove   = []
        s.dp_addItem = "R"
        var dt = s.PsbPanel_Data[row]
        s.panel_data = dt
        s.panel_user_id = dt.panel_user_id
        s.mtpl_2.psb_name = dt.psb_name
        s.mtpl_2.psb_ctrl_nbr = dt.psb_ctrl_nbr
        s.getItemsforPanel(s.budgetcode, s.employmenttype, dt.psb_ctrl_nbr)
       
        $("#addPSBItemMultiple_2").modal("show")
    }

    s.addSchedule = function () {
        empty_sched_form()
        s.edit = false
        s.sched_modal_title = "Add PSB Schedule"
        $('.nav-tabs a[href="#tab-A"]').tab('show')
        var tabB = "tabB"
        tabB.addClass("hidden")
        var tabC = "tabC"
        tabC.addClass("hidden")
        addvaluesched_pri()
		$("#addSchedule").modal("show")
    }


    function addvaluesched_pri() {
        s.sched.employment_type= s.employmenttype
        s.sched.budget_code = s.budgetcode
        $("#employment_type").val(s.employmenttype)
        $("#budget_code").val(s.budgetcode)
    } 

    s.selectEmployment = function (val) {

        var icn_selectbudgetcode = "icn_selectbudgetcode"
        var budgetcode = "budgetcode"

        icn_selectbudgetcode.addSpinner("fa-calendar")
        budgetcode.disabled()
        localStorage['employment_type'] = val

        if (val == "RE" && localStorage['budget_year_re']) {
            s.budget_year = JSON.parse(localStorage['budget_year_re'])
            icn_selectbudgetcode.removeSpinner("fa-calendar")
            budgetcode.enabled()
        }
        else if (val == "CE" && localStorage['budget_year_ce']) {
            s.budget_year = JSON.parse(localStorage['budget_year_ce'])
            icn_selectbudgetcode.removeSpinner("fa-calendar")
            budgetcode.enabled()
        }
        else {
            h.post("../cAddPsbSchedule/getBudgetYear", { employment_type: val }).then(function (d) {
                if (d.data.icon == "success") {
                    s.budget_year = d.data.budget_year
                    if (val == "RE") {
                        localStorage['budget_year_re'] = JSON.stringify(d.data.budget_year)
                    }
                    else if (val == "CE") {
                        localStorage['budget_year_ce'] = JSON.stringify(d.data.budget_year)
                    }
                    icn_selectbudgetcode.removeSpinner("fa-calendar")
                    budgetcode.enabled()
                }
                else {
               
                    icn_selectbudgetcode.removeSpinner("fa-calendar")
                    budgetcode.enabled()
                }
            })
        }
        addvalue("budgetcode", "")
        $("#psbschedule_grid").dataTable().fnClearTable();
    }
  

    s.selectBudgetCode = function (val) {
        cs.loading("show")
        localStorage["budgetcode"] = val
        getPSBSchedule()
        GetHiringPeriod()
       
	}
    function getPSBSchedule() {
        var budget_code = s.budgetcode 
        var employment_type = s.employmenttype
        h.post("../cAddPsbSchedule/getPSBSchedule", {
             budget_code: budget_code
            , employment_type: employment_type
        }).then(function (d) {
            if (d.data.icon == "success") {
                localStorage['PsbSchedule_Data'] = JSON.stringify(d.data.psb_sched)
                s.PsbSchedule_Data = d.data.psb_sched.refreshTable("psbschedule_grid", "")
            }
            else {
                console.log(d.data.message)
            }
            cs.loading("hide")
        })
    }

    function GetHiringPeriod() {
        var employment_type = s.employmenttype
        var budget_code = s.budgetcode
        h.post("../cAddPsbSchedule/getHiringPeriod", {
            employment_type: employment_type
            , budget_code: budget_code
        }).then(function (d) {
            if (d.data.icon == "success") {
                s.hiring_periods = d.data.hiring_periods
             }
        })
    }

    s.getPSBList = function (budget_code, appointment) {
		h.post("../cAddPsbSchedule/getPSBSchedule", { budget_code: budget_code, employment_type: appointment }).then(function (d) {
            if (d.data.icon == "success") {
              
                s.PsbSchedule_Data = d.data.psb_sched.refreshTable("psbschedule_grid", "")
			}
			else {
				console.log(d.data.message)
            }
            cs.loading("hide")
		})
    }

   
    function empty_sched_form() {
        s.sched.psb_date = ""
        s.sched.employment_type = ""
        s.sched.budget_code = ""
        s.sched.hiring_period = ""
        s.sched.remarks_details = ""
        $("#psb_date").val("")
        $("#employment_type").val("")
        $("#budget_code").val("")
        $("#hiring_period").val("")
        $("#remarks_details").val("")

    }
	s.savePSBSchedule = function (data) {
        data.psb_date = $("#psb_date").val()
        console.log(s.sched.hiring_period)
        console.log(data)

        if (cs.validatesubmit("sched")) {
			
			if (s.edit) {
				h.post("../cAddPsbSchedule/editPSBSchedule",
				{
					psb_ctrl_nbr: s.psb_ctrl_nbr,
					data: data,
					employment_type: s.employmenttype,
					budget_code: s.budgetcode
				}).then(function (d) {
                    if (d.data.icon == "success") {
                        getPSBSchedule()
						swal(d.data.message, { icon: d.data.icon })
					}
					else {
						console.log(d.data.message)
					}
				})
			}
			else {
				h.post("../cAddPsbSchedule/isDateExist", { data: data }).then(function (d) {
					if (d.data.exist < 1) {
						h.post("../cAddPsbSchedule/savePSBSchedule",
						{
							data: data,
							employment_type: s.employmenttype,
							budget_code: s.budgetcode
						}).then(function (d) {
                            if (d.data.icon == "success") {
                                s.psb_ctrl_nbr = d.data.psb_ctrl_nbr
                                getPSBSchedule()
                                localStorage["items"] = JSON.stringify(d.data.sched_itemlist)
                                console.log(d.data.sched_itemlist)
                                s.items = d.data.sched_itemlist
                                s.PsbItem_Data2_Orig = s.items
                                s.PsbItem_Data2 = s.PsbItem_Data2_Orig.refreshTable("psb_items2", "")
								swal(d.data.message, { icon: d.data.icon })
							
                                $('.nav-tabs a[href="#tab-B"]').tab('show');
                                var tabB = "tabB"
                                var tabC = "tabC"
                                tabB.removeClass("hidden")
                                tabC.removeClass("hidden")
							}
							else {
								console.log(d.data.message)
							}
						})
					}
					else {
						swal("Schedule already exist!", { icon: "warning" })
					}
				})
			}
		}
	}

	

    $('#addPanel').on('hidden.bs.modal', function () {
        cs.clearFields(s.mbr);
        cs.removeFormReq(s.mbr)
        s.found = true
    })

	
    s.btn_add_panel = function () {
        s.mbr.psb_ctrl_nbr = s.datatable.psb_ctrl_nbr
        cs.notrequired2("item_no_forpanel")
        //h.post("../cAddPsbSchedule/getItemsforPanel", {
        //    budget_code: s.budgetcode
        //    , employment_type: s.employmenttype
        //    , psb_ctrl_nbr: s.datatable.psb_ctrl_nbr
        //}).then(function (d) {
        //    s.psb_items_forpanel = d.data.psb_items_forpanel
        //    //$("#addPanel").modal("show")
        //})
    }

    s.selectItemForPanel_change = function (item_no_forpanel) {
        //s.mtpl.psb_ctrl_nbr = s.mbr.psb_ctrl_nbr
        //s.mtpl.employment_type = s.employmenttype

        ////var itemArray = cs.createSingleItemArray(s.psb_items_forpanel, "item_no")
      
        //if (item_no_forpanel == "xxxx") {
        //    h.post("../cAddPsbSchedule/getItems", { budget_code: s.budgetcode, employment_type: s.employmenttype, psb_ctrl_nbr: s.mbr.psb_ctrl_nbr }).then(function (d) {
        //        var item_list = d.data.psb_items.in(itemArray,"item_no")
        //        s.PsbItemMultiple_Data = item_list.refreshTable("psb_itemsMultiple", "")
        //        s.pos_item = s.PsbItemMultiple_Data
        //        //for (var x = 0; x < s.PsbItemMultiple_Data.length; x++) {
        //        //    $('#multiple' + x).removeClass("ng-not-empty")
        //        //    $('#multiple' + x).removeClass("ng-empty")
        //        //}
             
        //        s.multiple_panel_items = []
        //        $("#addPSBItemMultiple").modal("show")

        //    })

        //}
        //else {
        //    s.panelMultipleItems = ""
        //}
        //s.emptyPanelItemNotif()
    }
    
    s.check_box_multiple = function (row) {
        var dt = s.PsbItemMultiple_Data[row]
        var itmn = dt.item_no
        if ($("#multiple" + row).is(':checked')) {
            s.multiple_panel_items.push(dt)
        }
        else {
            var dt2 = s.multiple_panel_items.delete(itmn,"item_no") 
            s.multiple_panel_items = dt2
        }
    }
     
    s.check_box_multipleB = function (row) {
        var dt = s.PsbItemMultiple_Data_2[row]
        var itmn = dt.item_no
        var dp_addItem = s.dp_addItem

        if (dp_addItem == "A") {
            if ($("#multipleB" + row).is(':checked')) {
                  s.multiple_panel_items.push(dt)
            }
            else {
               
                var dt2 = s.multiple_panel_items.delete(itmn, "item_no")
                s.multiple_panel_items = dt2
            }
           
        }
        else if (dp_addItem == "R") {
            if ($("#multipleB" + row).is(':checked') == false) {
                s.multiple_panel_items_remove.push(dt)
            }
            else {
                var dt2 = s.multiple_panel_items_remove.delete(itmn, "item_no")
                s.multiple_panel_items_remove = dt2
            }
          
        }
    }

    s.check_box_multiple2 = function (row) {
        var dt = s.PsbItemMultiple_Data[row]
        var itmn = dt.item_no
        if ($("#multiple2" + row).is(':checked')) {
            s.multiple_panel_items.push(dt)
        }
        else {
            var dt2 = s.multiple_panel_items.delete(itmn, "item_no")
            s.multiple_panel_items = dt2
        }
    }

    //$("#addPSBItemMultiple").on('hidden.bs.modal', function () {
    //    s.uncheck_box_multiple()
    //});
    s.savePanelMultipleItems = function () {
        s.panelMultipleItems = cs.array_to_str(s.multiple_panel_items, "item_no")
      
        $("#addPSBItemMultiple").modal("hide")
    }

    s.fn_additems = function () {
        var dtl = s.PsbItemMultiple_Data_2
        var dt_len = dtl.length
        var dt = s.PsbItemMultiple_Data_2_orig.select(s.panel_user_id, "panel_user_str") 
        s.PsbItemMultiple_Data_2 = dt.refreshTable("psb_itemsMultiple_2", "")
    }

    s.fn_itemOption = function (value) {
        if (value == "R") {
            var dt = s.PsbItemMultiple_Data_2_orig.selectByPanel(s.panel_user_id, "panel_user_str")
            s.PsbItemMultiple_Data_2 = dt.refreshTable("psb_itemsMultiple_2", "")
          
        }
        else {
            var dt = s.PsbItemMultiple_Data_2_orig.NselectByPanel(s.panel_user_id, "panel_user_str")
            s.PsbItemMultiple_Data_2 = dt.refreshTable("psb_itemsMultiple_2", "")
        }
    }

    s.fn_removeitems = function () {
        var dtl = s.PsbItemMultiple_Data_2
        var dt_len = dtl.length
        var dt = s.PsbItemMultiple_Data_2_orig.NselectByPanel(s.panel_user_id, "panel_user_str")
        s.PsbItemMultiple_Data_2 = dt.refreshTable("psb_itemsMultiple_2", "")
    
    }

     

    s.savePanelMultipleItems2 = function () {
        var panelMultipleItems_remove = ""
        var dp_addItem = s.dp_addItem
        var usertype = ""
        var firstHPostErr = {
             message: ""
            ,icon :""
        }
        var data = s.panel_data 
        data.psb_mbr_role = data.psb_mbr_role.split(",")[0]
        if (data.inhouse) {
            usertype = "E"
        }
        else {
            usertype = "G"
        }
        if (dp_addItem == "A")
        {
            if (s.multiple_panel_items.length > 0) {
                s.panelMultipleItems = cs.array_to_str(s.multiple_panel_items, "item_no")
                s.func_savePSBPanel(data, user_type, "xxxx", s.panelMultipleItems)
            }
            else{
                swal("You have not selected an item", { icon: "warning" });
            }
        }
        else if (dp_addItem == "R")
        {
            if (s.multiple_panel_items_remove.length > 0)
            {
                panelMultipleItems_remove = cs.array_to_str(s.multiple_panel_items_remove, "item_no")
                s.func_savePSBPanel(data, user_type, "----", panelMultipleItems_remove)
              
            }
            else
            {
                swal("You have not selected an item", { icon: "warning" });
            }
        }
        $("#addPSBItemMultiple_2").modal("hide")
    }

    s.selectItemForPanel_click = function (item_no_forpanel) {
        //s.emptyPanelItemNotif()
    }

    s.emptyPanelItemNotif = function () {
        if (s.psb_items_forpanel.length < 1) {
            cs.required2("item_no_forpanel", "Please add items for this schedule first!")
        }
        else{
            cs.notrequired2("item_no_forpanel")
        }
    }

    // FUNCTION FOR SAVING PSB PANEL 
    s.func_savePSBPanel = function (data, user_type, item_no_forpanel, panelMultipleItems) {
        data.attended = false
       

        if (panelMultipleItems == "") {
            data.psb_mbr_role = data.psb_mbr_role 
        }
        else {
            data.psb_mbr_role = data.psb_mbr_role + "," + panelMultipleItems
        }
        h.post("../cAddPsbSchedule/savePSBPanel", { data: data, user_type: user_type, item_no_forpanel: item_no_forpanel }).then(function (d) {
            if (d.data.icon == "success") {
                swal(d.data.message, { icon: d.data.icon });
            }
            else {
                swal(d.data.message, { icon: d.data.icon });
            }
            s.clearAddPanel()
        })
    }

    s.savePSBPanel = function (data) {

        if (cs.validatesubmit("mbr")) {

            var department_code = $("#agency").val()
            var department_name = s.departments.filter(function (d) {
                return d.department_code == department_code
            })[0].department_name1

            s.mbr.agency  = $("#agency").val()
            s.mbr.inhouse = $("#inhouse").val()
            s.mbr.panel_user_id = $("#panel_user_id").val()
            s.mbr.psb_mbr_role = $("#psb_mbr_role").val()
            s.mbr.psb_name = $("#psb_name").val()
            var branch = $("#branch").val()
          
            h.post("../cAddPsbSchedule/savePSBPanel", { data: s.mbr, inhouse: s.mbr.inhouse, department_name: department_name, branch:branch }).then(function (d) {
                if (d.data.icon == "success") {
                    swal(d.data.message, { icon: d.data.icon });
                    s.clearAddPanel()
                }
                else {
                    swal(d.data.message, { icon: d.data.icon });
                }
               
            })
           // s.func_savePSBPanel(data,s.user_type,s.item_no_forpanel, s.panelMultipleItems)
		}
    }

  

    s.findUser = function (val) {
        var psb_mbr_role = $("#psb_mbr_role").val()
        
        if (s.mbr.inhouse == "1") {
            if (val.length < 5) {
				s.mbr.psb_name = ""
				return
			}
		}
		else if (s.mbr.inhouse == "0") {
            if (val.length < 7) {
                s.mbr.psb_name = ""
                return
             }
        }
        h.post("../cAddPsbSchedule/findUser", { user_id: val, user_type: s.mbr.inhouse }).then(function (d) {
            if (d.data.icon == "success") {
                if (d.data.found > 0) {

                
                    if (psb_mbr_role == "03") {
                        s.mbr.psb_name = d.data.personnelname[0].panel_name
                    }
                    else {

                        s.mbr.psb_name = d.data.personnelname[0].panel_name
                        //s.mbr.agency = d.data.personnelname[0].department_code
                    }

                }
                else {

                    //s.mbr.psb_name = ""
                    s.found = false
                }
            }
            else {
                console.log(d.data.message)
            }
        })
    }

   

	s.blurUser_id = function () {
		if (cs.elEmpty(s.mbr.psb_name)) {
			s.found = true
			s.mbr.user_id = ""
		}
	}

	s.btn_edit = function (row) {
		s.sched_modal_title = "Edit PSB Schedule"
		s.edit = true;
        var dt = s.PsbSchedule_Data
        var tabB = "tabB"
        var tabC = "tabC"
        tabB.removeClass("hidden")
        tabC.removeClass("hidden")
        dt.populateFields(s.sched, row)
        s.psb_ctrl_nbr = dt[row].psb_ctrl_nbr
        s.budget_code = dt[row].budget_code
        s.employment_type = dt[row].employment_type
        addvalue("hiring_period", dt[row].ctrl_nbr)
        h.post("../cAddPsbSchedule/getAvailable_item_tbl", {
            psb_ctrl_nbr: dt[row].psb_ctrl_nbr,
            budget_code: dt[row].budget_code,
            employment_type: dt[row].employment_type
        }).then(function (d) {
            if (d.data.icon == "success") {
               
                s.PsbItem_Data2_Orig = d.data.sched_itemlist
                s.PsbItem_Data3_Orig = d.data.sched_itemlist_toremove
                s.PsbItem_Data2 = d.data.sched_itemlist.refreshTable("psb_items2", "")
                s.PsbItem_Data3 = d.data.sched_itemlist_toremove.refreshTable("psb_items3", "")
            }
            
        })
		$("#addSchedule").modal("show")
    }

    //psb_ctrl_nbr
    //budget_code
    //employment_type
    //department_code
    //user_id         

    s.btn_refreshPanelList = function (row) {
        var dt = s.PsbSchedule_Data[row]
        console.log(dt)
        h.post("../cAddPsbSchedule/RefreshPanelList", {
            psb_ctrl_nbr        : dt.psb_ctrl_nbr,
            budget_code         : dt.budget_code,
            employment_type     : dt.employment_type
        }).then(function (d) {
            if (d.data.icon == "success") {
               
                swal("Panel successfully refreshed", { icon: d.data.icon })

            }
            else {
                swal(d.data.message, {icon:d.data.icon})
            }

        })

    }

	s.psb_sched_del = function (row_id) {

		var dt = s.PsbSchedule_Data[row_id]
		psb_ctrl_nbr = dt.psb_ctrl_nbr
		budget_code = dt.budget_code
		employment_type = dt.employment_type
		swal({
			title: "Are you sure to delete this record?",
			text: "Once deleted, you will not be able to recover this record!",
			icon: "warning",
			buttons: true,
			dangerMode: true,
		})
				  .then(function (willDelete) {
					  if (willDelete) {
						  h.post("../cAddPsbSchedule/deletePSBSchedule", {
							  psb_ctrl_nbr: psb_ctrl_nbr,
							  budget_code: budget_code,
							  employment_type: employment_type
						  }).then(function (d) {
                              if (d.data.del.result_bit == true) {
                                  getPSBSchedule();
								  swal(d.data.del.result_msg, { icon: d.data.del.icon });
							  }
							  else {
								  swal(d.data.del.result_msg, { icon: d.data.del.icon });
							  }
							 
						  })
					  }
					  else {
						  //cs.spinnerRemove("#del_row" + row_id, "fa fa-trash")
					  }
				  });
	}
    s.disabledRating = function (row) {
        var title = ""
        var text = ""
        var dt = s.PsbSchedule_Data[row]
        var disabled_rating = false
        var psb_ctrl_nbr = dt.psb_ctrl_nbr
        var budget_code = dt.budget_code
        var employment_type = dt.employment_type
        
        if (dt.disabled_rating == true || dt.disabled_rating == null) {
            title = "Are you sure to enable this schedule?"
            text = "Once enabled, you can disable it by clicking the disabled button again!"
            disabled_rating = false
        }
        else {
            title = "Are you sure to disable this schedule?"
            text = "Once disabled, you can enable it by clicking the disabled button again!"
            disabled_rating = true
        }
        swal({
            title: title,
            text: text,
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then(function (willDelete) {
                if (willDelete) {
                    h.post("../cAddPsbSchedule/DisablePSBForRating", {
                        psb_ctrl_nbr: psb_ctrl_nbr,
                        budget_code: budget_code,
                        employment_type: employment_type,
                        disabled_rating: disabled_rating
                    }).then(function (d) {
                        if (d.data.icon == "success") {
                            s.PsbSchedule_Data = d.data.psb_sched.refreshTable("psbschedule_grid", "")
                            swal(d.data.message, { icon: d.data.icon });
                        }
                        else {
                            swal(d.data.message, { icon: d.data.icon });
                        }
                       
                    })
                }
                else {
                    
                }
            });
    }
    s.selectUserType = function (user_type) {
        var usertype = $("#inhouse").val()

       

		cs.clearfield("panel_user_id")
		cs.clearfield("psb_name")
		cs.clearfield("psb_mbr_role")
        cs.clearfield("agency")

        if (usertype == "" || usertype == undefined) {
			cs.DisabledField("panel_user_id")
			cs.DisabledField("psb_mbr_role")
		}
		else {
			cs.EnabledField("panel_user_id")
			cs.EnabledField("psb_mbr_role")
        }

        s.user_type = usertype
	}

	s.show_panel = function (row_id, data) {
		s.psb_status = data
		var psb_ctrl_nbr = s.PsbSchedule_Data[row_id].psb_ctrl_nbr
		h.post("../cAddPsbSchedule/getPsbPanel", { psb_ctrl_nbr: psb_ctrl_nbr }).then(function (d) {
			
			s.PsbPanel_Data = d.data.panels.refreshTable("psb_panel", "")
			$("#showPanel").modal("show")
		})

	}

	s.panel_del = function (row_id) {
		var panel_user_id = s.PsbPanel_Data[row_id].panel_user_id
        var psb_ctrl_nbr = s.PsbPanel_Data[row_id].psb_ctrl_nbr

        h.post("../cAddPsbSchedule/verifyAllowDeletePanel", {
            panel_user_id: panel_user_id,
            psb_ctrl_nbr: psb_ctrl_nbr
        }).then(function (d) {
            if (d.data.icon == "success") {
                if (d.data.hasrated.length > 0) {
                    swal("Panel cannot be deleted, this panel has rated", { icon: "warning" })
                }
                else {

                    swal({
                        title: "Are you sure to delete this panel for this schedule?",
                        text: "",
                        icon: "warning",
                        buttons: true,
                        dangerMode: true,
                    })
                        .then(function (willDelete) {
                            if (willDelete) {
                                h.post("../cAddPsbSchedule/deletePanel", {
                                    panel_user_id: panel_user_id,
                                    psb_ctrl_nbr: psb_ctrl_nbr
                                }).then(function (d) {
                                    if (d.data.icon == "success") {
                                        s.PsbPanel_Data = d.data.panels.refreshTable("psb_panel", "")
                                        swal(d.data.message, { icon: d.data.icon });
                                    }
                                    else {
                                        console.log(d.data.message)
                                    }
                                    //cs.spinnerRemove("#del_row" + row_id, "fa fa-trash")
                                })
                            }
                            else {
                                //cs.spinnerRemove("#del_row" + row_id, "fa fa-trash")
                            }
                        });

                }
            }
            else {
                console.log(d.data.message)
            }
            //cs.spinnerRemove("#del_row" + row_id, "fa fa-trash")
        })

		
	}

    s.psb_app_list = function (row_id, data) {
        s.psb_status = data
        var psb_ctrl_nbr = s.PsbSchedule_Data[row_id].psb_ctrl_nbr
      
        
		h.post("../cAddPsbSchedule/getPsbAppList", { psb_ctrl_nbr: psb_ctrl_nbr }).then(function (d) {
            if (d.data.icon == "success") {
                console.log(d.data.psb_app)
                s.PsbApp_Data = d.data.psb_app.refreshTable("psb_app", "")
				$("#showPsbApp").modal("show")
			}
		})

	}
    s.filterByDepartment = function (val) {
        if (val == "") {
            s.PsbItem_Data2 = s.PsbItem_Data2_Orig.refreshTable("psb_items2", "")
        }
        else {
            var dt = s.PsbItem_Data2_Orig.filter(function (d) {
                return d.department_code == val
            })
            s.PsbItem_Data2 = dt.refreshTable("psb_items2", "")
        }
        
    }
	s.app_del = function (row_id) {
		var dt = s.PsbApp_Data[row_id]
		swal({
			title: "Are you sure to delete this applicant?",
			text: "",
			icon: "warning",
			buttons: true,
			dangerMode: true,
		})
		.then(function (willDelete) {
			if (willDelete) {
				h.post("../cAddPsbSchedule/DeleteAppPsb", { psb_ctrl_nbr: dt.psb_ctrl_nbr, app_ctrl_nbr: dt.app_ctrl_nbr }).then(function (d) {
					var dtl = d.data.psb_app

					if (dtl[0].psb_ctrl_nbr == "") {
						$("#psb_app").dataTable().fnClearTable();
					}
					else {
						s.PsbApp_Data = dtl.refreshTable("psb_app", "")
					}

					swal(dtl[0].sql_message, { icon: dtl[0].icon })

				})
			}
			else {
				//cs.spinnerRemove("#del_row" + row_id, "fa fa-trash")
			}
		});
    }

    s.btn_psbsetup = function (row_id) {
        cs.loading("show")
        s.added_item = []
        s.remove_item = []
        s.datatable = s.PsbSchedule_Data[row_id];
        var dt = s.datatable;
        s.psb_ctrl_nbr = dt.psb_ctrl_nbr
        s.mbr.psb_ctrl_nbr = s.datatable.psb_ctrl_nbr
        $("#psb_ctrl_nbr").val(s.datatable.psb_ctrl_nbr)
        s.i_psb_date = dt.psb_date
        s.i_employment_type = dt.employment_type
        var budget_code = dt.budget_code
        var employment_type = dt.employment_type
        //h.post("../cAddPsbSchedule/getItems", { budget_code: budget_code, employment_type: employment_type, psb_ctrl_nbr: dt.psb_ctrl_nbr }).then(function (d) {
          
        //    s.PsbItem_Data = d.data.psb_items.refreshTable("psb_items", "")
            
        //    s.pos_item = s.PsbItem_Data
        //    $("#psbsetup").modal("show")
        //    cs.loading("hide")
        //})
        $("#psbsetup").modal("show")
        cs.loading("hide")
    }

	
    //s.btn_add_item = function () {
    //    s.added_item = []
    //    s.remove_item = []
    //    var dt = s.datatable
    //    //s.psb_ctrl_nbr = dt.psb_ctrl_nbr
    //    s.i_psb_date = dt.psb_date
    //    s.i_employment_type = dt.employment_type
    //    var budget_code = dt.budget_code
    //    var employment_type = dt.employment_type
    //    h.post("../cAddPsbSchedule/getItems", { budget_code: budget_code, employment_type: employment_type, psb_ctrl_nbr: dt.psb_ctrl_nbr }).then(function (d) {
    //        s.PsbItem_Data = d.data.psb_items.refreshTable("psb_items", "")
    //        s.pos_item = s.PsbItem_Data
    //        //$("#addPSBItem").modal("show")
    //    })
    //}

    s.btn_add_applicant = function () {
        var dt = s.datatable;
        var psb_ctrl_nbr = dt.psb_ctrl_nbr
        s.a_psb_ctrl_nbr = dt.psb_ctrl_nbr
        h.post("../cAddPsbSchedule/ApplicantInItemAdded", { psb_ctrl_nbr: psb_ctrl_nbr }).then(function (d) {
   
            s.PsbApplicant_Data = d.data.appls_in_items.refreshTable("psb_applicant", "")
            s.appls_in_items = d.data.appls_in_items
            //$("#addPSBApplicant").modal("show")
        })

    }

	
  
  

	function items_to_add_del(dt,state)
	{
		var resdata = []
		var dt1 = []
		var len1 = 0
		var len2 = 0
		var len3 = 0
		len1 = s.added_item.length
		len2 = s.remove_item.length

		if(state == true)
		{
			len1 = s.added_item.filter(function (d) {
				return d.item_no == dt.item
			})
			if(len1 < 1)
			{
				s.added_item.push(dt)
			}
		}
		else
		{
			len2 = s.remove_item.filter(function (d) {
				return d.item_no == dt.item
			})
			if (len2 < 1) {
				s.remove_item.push(dt)
			}
		   
		}
		
	 

	}

	s.check_box_app = function (row, data) {

		var bol = $("#appl" + row)[0].checked
		angular.forEach(s.appls_in_items, function (v, k) {

			if (k == row) {
				v.is_addedd = bol
			}
		})
	}

	s.savePSBItems = function (data) {
        var btn_savepsbitem = "btn_savepsbitem"
        var btncancel_savepsbitem = "btncancel_savepsbitem"
        var icn_savepsbitem = "icn_savepsbitem"
        var btncancelhdr1 = "btncancelhdr1"
        icn_savepsbitem.addSpinner("fa-thumbs-up")
        btn_savepsbitem.disabled()
        btncancel_savepsbitem.disabled()
        btncancelhdr1.disabled()
        

        if (s.ng_psbitemselected.length > 0) {
            for (var x = 0; x < s.ng_psbitemselected.length; x++) {
                h.post("../cAddPsbSchedule/savePSBItems", {
                      psb_ctrl_nbr: s.psb_ctrl_nbr
                    , budget_code: s.sched.budget_code
                    , employment_type: s.sched.employment_type
                    , added_item: s.ng_psbitemselected[x]
                }).then(function (d) {
                    if (d.data.icon == "success") {
                        s.PsbItem_Data2_Orig = d.data.psb_items
                        s.PsbItem_Data3_Orig = d.data.psb_items_toremove
                        s.PsbItem_Data2 = d.data.psb_items.refreshTable("psb_items2", "")
                        s.PsbItem_Data3 = d.data.psb_items_toremove.refreshTable("psb_items3", "")
                        swal(d.data.message, { icon: d.data.icon })
                    }
                    else {
                        swal(d.data.message, { icon: d.data.icon })
                    }


                })

            }
         
            icn_savepsbitem.removeSpinner("fa-thumbs-up")
            btn_savepsbitem.enabled()
            btncancel_savepsbitem.enabled()
            btncancelhdr1.enabled()
           
        }
        else {
            swal("Warning","You have not selected an item!", { icon:"error" })
            icn_savepsbitem.removeSpinner("fa-thumbs-up")
            btn_savepsbitem.enabled()
            btncancel_savepsbitem.enabled()
            btncancelhdr1.enabled()
        }
        s.ng_psbitemselected = []
    }
    
    s.ng_add_item = function (row_id) {
        var dt = s.PsbItem_Data[row_id]
        var icn1 = "icn1" + row_id
        var icnbtn1 = "icnbtn1" + row_id
        var item_no = dt.item_no
        var budget_code = dt.budget_code
        var employment_type = dt.employment_type

        if (icn1.hasClass("hidden")) {
            s.ng_psbitemselected.push(dt)
            icn1.removeClass("hidden")
            icnbtn1.replaceClass("fa fa-plus", "fa fa-check")
           
        }
        else {
            var dt2 = s.ng_psbitemselected.filter(function (dta) {
                return dta.item_no != item_no
            })
            s.ng_psbitemselected = dt2
            icn1.addClass("hidden")
            icnbtn1.replaceClass("fa fa-check", "fa fa-plus")
        }

    }

    s.ng_add_item2 = function (row_id) {
        var dt = s.PsbItem_Data2[row_id]
        var icn1 = "icn1" + row_id
        var icnbtn1 = "icnbtn1" + row_id
        var item_no = dt.item_no
        var budget_code = dt.budget_code
        var employment_type = dt.employment_type

        if (icn1.hasClass("hidden")) {
            s.ng_psbitemselected.push(dt)
            icn1.removeClass("hidden")
            icnbtn1.replaceClass("fa fa-plus", "fa fa-check")

        }
        else {
            var dt2 = s.ng_psbitemselected.filter(function (dta) {
                return dta.item_no != item_no
            })
            s.ng_psbitemselected = dt2
            icn1.addClass("hidden")
            icnbtn1.replaceClass("fa fa-check", "fa fa-plus")
        }

    }

    s.ng_remove_item = function (row) {
        var dt = s.PsbItem_Data2[row]
       
        var icn1 = "icn1" + row
        var icnbtn2 = "icnbtn2" + row
        var btndeleteitem = "btndeleteitem" + row
        icnbtn2.addSpinner("fa-trash")
        
        h.post("../cAddPsbSchedule/removePSBItems_2", {
              psb_ctrl_nbr: dt.psb_ctrl_nbr
            , employment_type: dt.employment_type
            , budget_code: dt.budget_code
            , item_no : dt.item_no
        }).then(function (d) {
            s.PsbItem_Data = d.data.psb_items.refreshTable("psb_items", "")
            swal(d.data.message, { icon: d.data.icon })
            icnbtn2.removeSpinner("fa-trash")

        })
        


    }

    s.ng_remove_item2 = function (row) {
        var dt = s.PsbItem_Data3[row]
        var icn1 = "icn1" + row
        var icnbtn2 = "icnbtn2" + row
        var btndeleteitem = "btndeleteitem" + row
        icnbtn2.addSpinner("fa-trash")
      
        h.post("../cAddPsbSchedule/removePSBItems_2", {
              psb_ctrl_nbr: dt.psb_ctrl_nbr
            , employment_type: dt.employment_type
            , budget_code: dt.budget_code
            , item_no: dt.item_no
            , department_code: dt.department_code
        }).then(function (d) {
            s.PsbItem_Data2_Orig = d.data.psb_items
            s.PsbItem_Data3_Orig = d.data.psb_items_toremove
            s.PsbItem_Data2 = d.data.psb_items.refreshTable("psb_items2", "")
            s.PsbItem_Data3 = d.data.psb_items_toremove.refreshTable("psb_items3", "")
            swal(d.data.message, { icon: d.data.icon })
            icnbtn2.removeSpinner("fa-trash")

        })



    }

    s.ng_To_add_items = []
    s.ng_To_del_items = []

    s.ng_add_app = function (row_id) {
        var dt = s.PsbApplicant_Data[row_id]
        var app_ctrl_nbr = dt.app_ctrl_nbr
        var icn3 = "icn3" + row_id
        var icnbtnadd3 = "icnbtnadd3" + row_id
        if (icn3.hasClass("hidden")) {
            s.ng_To_add_items.push(dt)
            icn3.removeClass("hidden")
            icnbtnadd3.replaceClass("fa fa-plus", "fa fa-check")

        }
        else {
            var dt2 = s.ng_To_add_items.filter(function (dta) {
                return dta.app_ctrl_nbr != app_ctrl_nbr
            })
            s.ng_To_add_items = dt2
            icn3.addClass("hidden")
            icnbtnadd3.replaceClass("fa fa-check", "fa fa-plus")
        }
    }
    s.ng_del_app = function (row) {

        var dt = s.PsbApplicant_Data[row]
        var app_ctrl_nbr = dt.app_ctrl_nbr
        var icn3 = "icn3" + row_id
        var icnbtnadd3 = "icnbtnadd3" + row_id
        var btndeleteitem = "btndeleteitem" + row
        var faicon = icnbtnadd3.getFaIcon()

        if (icn3.hasClass("hidden")) {
            icn3.removeClass("hidden")
            icn3.replaceClass("fa fa-check", "fa fa-times")
            s.ng_To_del_items.push(dt)
            icnbtnadd3.replaceClass("fa fa-trash", "fa fa-times")
        }
        else {
            var dt2 = s.ng_To_del_items.filter(function (dta) {
                return dta.app_ctrl_nbr != app_ctrl_nbr
            })
            s.ng_To_del_items = dt2
            icn3.addClass("hidden")
            icn3.replaceClass("fa fa-times", "fa fa-check")
            icnbtnadd3.replaceClass("fa fa-times", "fa fa-trash")
        }
    }

    String.prototype.getFaIcon = function () {
        var id = this
        if (id.hasClass("fa-times")) {
            return "fa-times"
        }
        else if (id.hasClass("fa-check")) {
            return "fa-check"
        }
       
    }

	s.addAppsToPsb = function () {
        h.post("../cAddPsbSchedule/addAppsToPsb", { psb_ctrl_nbr: s.psb_ctrl_nbr, appls_in_items: s.ng_To_add_items }).then(function (d) {
			if (d.data.icon == "success") {
                //$("#addPSBItem").modal("hide")
                s.PsbApplicant_Data = d.data.appls.refreshTable("psb_applicant","")
				swal(d.data.message,"Applicants you have added to PSB schedule are remove from this list " ,{ icon: d.data.icon })
			}
			else {
				console.log(d.data.message)
			}
		})
	}

    s.gotoPanelRating = function (row) {
        var dt = s.PsbPanel_Data[row]
        location.href = "../cPanelMyRating/Index?panel_user_id=" + dt.panel_user_id
    }

	//************************************// 
	//*** Print Score Sheet             
	//**********************************// 
	s.printScoreSheet = function (row_index) {
        var dt = s.PsbPanel_Data[row_index]
		var psb_ctrl_nbr = dt.psb_ctrl_nbr
        var userid = dt.panel_user_id
        var budget_code = dt.budget_code
        var employment_type = dt.employment_type
		h.post("../cPrintScoreSheet/SetHistoryPage",
		 {
				employmenttype : s.employmenttype,
				budgetcode     : s.budgetcode
		 }).then(function (d) {
             location.href = "../cPrintScoreSheet/Index?psb_ctrl_nbr=" + psb_ctrl_nbr + "&userid=" + userid + "&budget_code=" + budget_code + "&employment_type=" + employment_type
		 });
    }
    Array.prototype.delete = function (code, prop) {
        return this.filter(function (d) {
            return d[prop] != code
        })
    }


    s.clearAddPanel = function () {
        s.item_no_forpanel = ""
        cs.clearfield("user_type")
        cs.clearFields(s.mbr)
    }
  
})


