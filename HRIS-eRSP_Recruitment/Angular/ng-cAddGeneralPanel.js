
ng_eRSP_App.controller("cAddGeneralPanel_Ctrlr", function (commonScript, $scope, $http, $filter, $compile) {
    var s = $scope
    var h = $http
    var cs = commonScript


    //boolean scope
    s.found = true
    s.edit = false

    //int scope
    s.psb_status = 0
    s.items = []
    //array scope
    
    s.departments = []
    s.panel_role = []
    

    s.PsbItem_Data2_Orig = []
    s.PsbItem_Data3_Orig = []
    s.psb_mbr_role_list = []
    //object scope
    s.um = {}

   
    s.mbr = {
        psb_ctrl_nbr: ""
        , panel_user_id: ""
        , psb_mbr_role: ""
        , branch: ""
        , inhouse: ""
        , psb_name: ""
        , agency: ""
    }


    s.a = {
          branch: ""
        , psb_inhouse: ""
        , psb_mbr_role: ""
        , psb_user_id: ""
        , psb_first_name: ""
        , psb_middle_name: ""
        , psb_last_name: ""
        , psb_agency: ""
        , active_status: ""
    }

    s.e = {
          ebranch: ""
        , epsb_inhouse: ""
        , epsb_mbr_role: ""
        , epsb_user_id: ""
        , epsb_first_name: ""
        , epsb_middle_name: ""
        , epsb_last_name: ""
        , epsb_agency: ""
        , eactive_status: ""
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
                        "mData": "psb_user_id",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-left btn-block'>" + data + "</span>"
                        }
                    },

                    {
                        "mData": "panel_name",
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
                        "mData": "psb_agency",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-left btn-block'>" + data + "</span>"
                        }
                    },
                    {
                        "mData": null,
                        "bSortable": false,
                        "mRender": function (data, type, full, row) {

                            return '<center><div class="btn-group">' +
                               
                                '<button type="button" class="btn btn-info btn-sm action" data-toggle="tab" data-toggle="tooltip" data-placement="top" title="Edit Panel" ng-click="editPanel(' + row["row"] + ')" >  <i class="fa fa-pencil"></i></button >' +
                                '<button  type="button" class="btn btn-danger btn-md action" ng-click="gen_panel_del(' + row["row"] + ')" >   <i id="del_row' + row["row"] + '" class="fa fa-trash"></i></button>' +
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

  
   
    
    function addvalue(id, value) {
        $("#" + id).val(value)
        s[id] = value
    }
    function bool2numstr(val) {
       
        if (val) return "1"
        else return "0"
    }
    Init_PsbPanel_Grid([])
   
   
  

    function init() {
        getGeneralPanelList()
        getPsbRoleList()
    }

    init()
    function clearForm_a() {
        addvalue("branch","")          
        addvalue("psb_inhouse", "")     
        addvalue("psb_mbr_role", "")    
        addvalue("psb_user_id", "")     
        addvalue("psb_first_name", "")  
        addvalue("psb_middle_name", "") 
        addvalue("psb_last_name", "")   
        addvalue("psb_agency", "")      
        addvalue("active_status", "")  
    }
    function getGeneralPanelList(){
        h.post("../cAddGeneralPanel/GetGeneralPanelList").then(function (d) {
            s.PsbPanel_Data = d.data.general_panel.refreshTable("psb_panel", "")
        })
    }

    function getPsbRoleList() {
       
        h.post("../cAddGeneralPanel/GetPsbRoleList").then(function (d) {
            s.psb_mbr_role_list = d.data.psb_mbr_role_list
        })
    }

    

    s.editPanel = function (row) {
        var dt = s.PsbPanel_Data[row]
        s.e.ebranch          = String(dt.branch)         
        s.e.epsb_inhouse = bool2numstr(dt.psb_inhouse)        
        s.e.epsb_mbr_role    = dt.psb_mbr_role   
        s.e.epsb_user_id     = dt.psb_user_id    
        s.e.epsb_first_name  = dt.psb_first_name 
        s.e.epsb_middle_name = dt.psb_middle_name
        s.e.epsb_last_name   = dt.psb_last_name  
        s.e.epsb_agency = dt.psb_agency
        s.e.eactive_status = bool2numstr(dt.active_status)
        
        $("#edit_panel").modal("show")
    }
    s.gen_panel_del = function (row) {
        var dt = s.PsbPanel_Data[row]

        swal({
            title: "Are you sure to delete this record?",
            text: "Once deleted, you will not be able to recover this record!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then(function (willDelete) {
                if (willDelete) {
                    h.post("../cAddGeneralPanel/gen_panel_delete", { data: dt }).then(function (d) {
                        if (d.data.icon == "success") {
                            getGeneralPanelList();
                        }
                        swal(d.data.message, { icon: d.data.icon })
                    })
                }
                
            });
      
    }
    s.editPSBPanel = function (e) {
        if (cs.validatesubmit("e")) {
            h.post("../cAddGeneralPanel/editPSBPanel", { data: e }).then(function (d) {
                if (d.data.icon == "success") {
                    getGeneralPanelList();
                }
                swal(d.data.message, { icon: d.data.icon })
            })
        }
    }
    s.Select_Role = function () {
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
    }

    s.Select_Department_Panel = function () {
        var department_code = $("#agency").val()
        var dt = s.departments.filter(function (d) {
            return d.department_code == department_code
        })[0]
        var head_id = dt.empl_id
        var usertype = $("#user_type").val()
        h.post("../cAddPsbSchedule/findUser", { user_id: "U" + head_id, user_type: usertype }).then(function (d) {
            if (d.data.found > 0) {
                s.mbr.panel_user_id = "U" + head_id
                $("#panel_user_id").val("U" + head_id)
                s.mbr.psb_name = d.data.personnelname[0].panel_name
                $("#psb_name").val(d.data.personnelname[0].panel_name)
            }
        })
    }

    s.addPanel = function () {
        clearForm_a()
        $("#add_panel").modal("show")
    }


    s.findUser = function (val) {
        var psb_mbr_role = $("#psb_mbr_role").val()
   
        if (s.a.psb_inhouse == "1") {
            if (val.length < 5) {
                s.a.psb_first_name = ""
                s.a.psb_middle_name = ""
                s.a.psb_last_name = ""
                s.a.psb_agency = ""
                return
            }
        }
        else if (s.a.psb_inhouse == "0") {
            if (val.length < 7) {
                s.a.psb_first_name = ""
                s.a.psb_middle_name = ""
                s.a.psb_last_name = ""
                s.a.psb_agency = ""
                return
            }
        }
        h.post("../cAddPsbSchedule/findUser", { user_id: val, user_type: s.a.psb_inhouse }).then(function (d) {
            if (d.data.icon == "success") {
                if (d.data.found > 0) {
                    s.a.psb_first_name = d.data.personnelname[0].first_name
                    s.a.psb_middle_name = d.data.personnelname[0].middle_name
                    s.a.psb_last_name = d.data.personnelname[0].last_name
                    s.a.psb_agency = d.data.personnelname[0].department_name1
                    s.found = true
                }
                else {
                    s.a.psb_first_name = ""
                    s.a.psb_middle_name = ""
                    s.a.psb_last_name = ""
                    s.a.psb_agency = ""
                    s.found = false
                }
            }
            else {
                console.log(d.data.message)
            }
        })
    }

    s.blurUser_id = function () {
        if (!s.found) {
            s.a.psb_user_id = ""
        }
    }



    s.savePSBPanel = function (a) {
        if (cs.validatesubmit("a")) {
            console.log(s.a)
            h.post("../cAddGeneralPanel/SavePSBPanel", { data : s.a}).then(function (d) {
                if (d.data.icon == "success") {
                    getGeneralPanelList();
                }
                swal(d.data.message, { icon: d.data.icon })
            })
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

    s.inActiveAll = function () {

        swal({
            title: "Are you sure you want to in-active all panels in the list?",
            text: "Click Ok to proceed or Cancel to cancel",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then(function (willDelete) {
                if (willDelete) {
                    h.post("../cAddGeneralPanel/InactiveAllPanel").then(function (d) {
                        s.PsbPanel_Data = d.data.general_panel.refreshTable("psb_panel", "")
                        swal(d.data.message, { icon: d.data.icon })
                    })
                }

            });

    }

})


