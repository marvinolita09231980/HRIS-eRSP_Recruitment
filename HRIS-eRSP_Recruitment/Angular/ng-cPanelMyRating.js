


ng_eRSP_App.controller("cPanelMyRating_Ctrlr", function (commonScript, $scope, $http, $filter, $compile, $window) {
    var s = $scope
    var h = $http
    var cs = commonScript
    s.rowLen = "8"
    s.exam_score = ""
    s.competency = ""
    s.totalrating = ""
    s.rank = ""
    s.app_ctrl_nbr = ""
    s.psb_status = 0
    s.psb_list = []
    s.datasource = []
    s.total_rating = []
    s.sp_slide_rating = []
    s.psbsched_item = []
    s.psbsched_list = []
    s.slideInnerText = []
    s.psb_ctrl_nbr_active = ""
    s.show_details = false

    s.um = {}
   
  

    s.AT = [{ id: 'JO', text: 'Job Order' }, { id: 'RE', text: 'Permanent' }, { id: 'CE', text: 'CASUAL' }]

    s.svc = [{ id: false, text: 'No' }, { id: true, text: 'Yes' }]


   


    var Init_PSB_Rating_Grid = function (par_data) {
        s.PSBRate_Data_List = par_data;
        s.PSBRate_Data_Table = $('#psbrating_table_Grid').dataTable(
            {
                data: s.PSBRate_Data_List,
                sDom: 'rt<"bottom"p>',
                bAutoWidth: false,
                pageLength: 10,
                //order: [[6, 'asc']],
                columns: [
                    {
                        "mData": "app_ctrl_nbr",
                        "mRender": function (data, type, full, row) {
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
                    }
                ],
                "createdRow": function (row, data, index) {
                    //$(row).addClass("dt-row");
                    $compile(row)($scope);  //add this to compile the DOM
                },
            });
        $("div.toolbar").html('<b>Custom tool bar! Text/images etc.</b>');
    }

    function init() {
        cs.loading("show")
       
       
        Init_PSB_Rating_Grid([])
       

        h.post("../cPanelMyRating/Initialize").then(function (d) {
            if (d.data.icon == "success") {
                if (d.data.psbsched_list.length > 0) {
                    s.psbsched_list = d.data.psbsched_list
                }
            }
            else {
                swal(d.data.message, {icon:"error"})
            }
           cs.loading("hide")
        })
    }

   
    init()
    
    s.selectPSBSchedApplicant = function (val) {
       cs.loading("show")
        h.post("../cPanelMyRating/sp_hrmpsb_screening_list",
            { item_no: val,psb_ctrl_nbr: s.psb_ctrl_nbr}).then(function (d) {
                if (d.data.icon == "success") {
                    s.PSBRate_Data_List = d.data.psb_rating_all.refreshTable("psbrating_table_Grid", "")
                }
                else {
                    console.log(d.data.message)
                }
                cs.loading("hide")
            })

    }
    s.selectPSBSched = function (val) {
        s.psbsched_item = []
        cs.loading("show")
        h.post("../cPanelMyRating/sp_psbSched_item",
            { psb_ctrl_nbr: s.psb_ctrl_nbr}).then(function (d) {
                if (d.data.icon == "success") {
                    s.psbsched_item = d.data.psbsched_item
                }
                else {
                    console.log(d.data.message)
                }
                cs.loading("hide")
            })

    }
  
})


