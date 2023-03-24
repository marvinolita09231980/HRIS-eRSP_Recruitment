
ng_eRSP_App.controller("cAddPanelRole_Ctrlr", function (commonScript, $scope, $http, $filter, $compile) {
	var s = $scope
	var h = $http
	var cs = commonScript
	s.edit = false
	s.mr = {
		 psb_mbr_role : ""
		,mbr_role_descr : ""
	}

	var PanelRole_List_Grid = function (par_data) {
		s.PanelRole_Data = par_data;
		s.PanelRole_Table = $('#panel_role_grid').dataTable(
			{
				data: s.Applicant_List_Data,
				sDom: 'rt<"bottom"p>',
				pageLength: 10,
				columns: [
					{ "mData": "psb_mbr_role", "mRender": function (data, type, full, row) { return "<span class='text-center btn-block'>" + data + "</span>" } },

					{
						"mData": "mbr_role_descr",
						"mRender": function (data, type, full, row) {
							return "<span class='text-left btn-block'>" + data + "</span>"
						}
					},
					
					{
						"mData": null,
						"bSortable": false,
						"mRender": function (data, type, full, row) {
							return '<center><div class="btn-group action-btn">' +
									'<button type="button"  class="btn btn-info btn-sm action" data-toggle="tab" data-toggle="tooltip" data-placement="top" title="Print Score Sheet" ng-click="rowEdit(' + row["row"] + ')" >  <i class="fa fa-edit"></i></button >' +
									//'<button type="button"  class="btn btn-danger btn-sm action" data-toggle="tab" data-toggle="tooltip" data-placement="top" title="Print Score Sheet" ng-click="rowDelete(' + row["row"] + ')" >  <i class="del_row' + row["row"] + ' fa fa-trash"></i></button >' +
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



	PanelRole_List_Grid([])
   
	function init() {
		h.post("../AddPanelRole/Initialize").then(function (d) {
			s.PanelRole_Data = d.data.prole.refreshTable("panel_role_grid", "")
		  
		})
	}
	init()
	s.AddPanelRole = function () {
		cs.clearFormFields("mr")
		s.edit = false
	   
		h.post("../AddPanelRole/getLastId").then(function (d) {
			s.mr.psb_mbr_role = d.data.role_id[0].key_value
			$("#addPanelRoleInfo").modal("show")
		})
	}



	s.SavePanelRole = function (mr) {

		if (cs.validatesubmit("mr"))
		{
			h.post("../AddPanelRole/SavePanelRole", {
				psb_mbr_role    : mr.psb_mbr_role
			  , mbr_role_descr  : mr.mbr_role_descr
			}).then(function (d)
			{
				if (d.data.icon == "success")
				{
					swal(d.data.message, { icon: d.data.icon })
					s.PanelRole_Data = d.data.prole.refreshTable("panel_role_grid", "")
				}
				else
				{
					swal("Error",d.data.message, { icon: d.data.icon })
				}
			})
		}
	}


	s.rowEdit = function (row) {
	   
		s.edit = true
		var dt = s.PanelRole_Data[row]
	  
		
		$("#psb_mbr_role").val(dt.psb_mbr_role)
		$("#mbr_role_descr").val(dt.mbr_role_descr)
	  
		$("#addPanelRoleInfo").modal("show")
	}

	s.rowDelete = function (row) {
		var dt = s.PanelRole_Data[row]
		cs.spinnerAdd("del_row" + row, "fa fa-trash")
		swal({
			title: "Are you sure to delete this record?",
			text: "Once deleted, you will not be able to recover this record!",
			icon: "warning",
			buttons: true,
			dangerMode: true,
		})
				.then(function (willDelete) {
					if (willDelete) {
					    h.post("../AddPanelRole/deletePanelRole", {
							psb_mbr_role: dt.psb_mbr_role
							
						}).then(function (d) {
							if (d.data.icon == "success") {
								swal(d.data.message, { icon: d.data.icon })
								s.PanelRole_Data = d.data.prole.refreshTable("panel_role_grid", "")
							}
							else {
								swal("Error", d.data.message, { icon: d.data.icon })
							}
							cs.spinnerRemove("del_row" + row, "fa fa-trash")
							//cs.spinnerRemove("#del_row" + row_id, "fa fa-trash")
						})
					}
					else {
					    cs.spinnerRemove("del_row" + row, "fa fa-trash")
						//cs.spinnerRemove("#del_row" + row_id, "fa fa-trash")
					}
				});
	}


	s.EditPanelRole = function (mr) {
		if (cs.validatesubmit("mr")) {
			
			h.post("../AddPanelRole/EditPanelRole", {
				psb_mbr_role: $("#psb_mbr_role").val()
			  , mbr_role_descr: $("#mbr_role_descr").val()
			}).then(function (d) {
				if (d.data.icon == "success") {
					s.PanelRole_Data = d.data.prole.refreshTable("panel_role_grid", "")
					swal(d.data.message, { icon: d.data.icon })
				}
				else {
					swal("Error", d.data.message, { icon: d.data.icon })
				}
			})
		}
	}
})


