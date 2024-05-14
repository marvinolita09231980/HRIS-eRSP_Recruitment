
ng_eRSP_App.controller("cApplicantForBI_Ctrlr", function (commonScript, $scope, $http, $filter, $compile) {
    var s = $scope
    var h = $http
    var cs = commonScript


    s.exam_rowindex = ""
    s.um = {}
    s.year = cs.RetrieveYear()
    s.rating_left = "0"

    s.hiringperiod = []
    s.selectedItemRow = []
    s.bi_respondent_type_tbl = []


    var Init_ApplicantforRespondent_List_Grid = function (par_data) {
        s.ApplicantforRespondent_Data = par_data;
        s.ApplicantforRespondent_Table = $('#applicantsforRespondent_grid').dataTable(
            {
                data: s.ApplicantforRespondent_Data,
                sDom: 'rt<"bottom"p>',
                pageLength: 10,
              
                columns: [
                    {

                        "mData": "applicants_name",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-left btn-block'>" + data + "</span>"
                        }
                    },

                    {
                        "mData": "department_name1",
                        "mRender": function (data, type, full, row) {
                            //return "<span><img alt='image'  class='img-circle grid-img' src='" + s.encode_idv(full["empl_photo_img"]) + "'></span>&nbsp;&nbsp;<span class='text-left'>" + data + "</span>"
                            return "<span class='text-left'>" + data + "</span>"
                        }
                    },
                    {
                        "mData": null,
                        "bSortable": false,
                        "mRender": function (data, type, full, row) {

                            return '<center><div class="btn-group">' +
                                '<button  type="button" class="btn btn-danger btn-md action" ng-click="addRespondent(' + row["row"] + ')" >   <i id="del_row' + row["row"] + '" class="fa fa-pencil"></i></button>' +

                                '</div></center>';
                        }
                    }
                    //data-toggle="tab" href="#tab-7"
                ],
                "createdRow": function (row, data, index) {
                    $(row).attr('id', index);
                    $compile(row)($scope);  //add this to compile the DOM
                },

            });

        $("div.toolbar").html('<b>Custom tool bar! Text/images etc.</b>');
    }

    Init_ApplicantforRespondent_List_Grid([])

    function init() {

        h.post("../cApplicantForBI/Initialize").then(function (d) {
            s.hiringperiod = d.data.hiringperiod
            s.bi_respondent_type_tbl = d.data.bi_respondent_type_tbl
        })
    }



    init()


    s.GetApplicants = function (ctrl_no) {
        s.selectedItemRow = []
        h.post("../cAddRespondent/GetApplicants", { ctrl_no: ctrl_no }).then(function (d) {

            s.ApplicantforRespondent_Data = d.data.applied_items.refreshTable("applicantsforRespondent_grid", "")
        })
    }



    s.addRow = function (row) {
        var dt = s.ApplicantforRespondent_Data[row]
        var cbrow = $("#includedRow" + row)[0].checked

        if (cbrow) {
            var ex = s.selectedItemRow.filter(function (d) {
                return d.item_no == dt.item_no
            })
            var exdata = {
                rownum: row
                , applicants_name: dt.applicants_name
                , app_ctrl_nbr: dt.app_ctrl_nbr
                , department_name1: dt.department_name1

            }
            if (ex.length == 0) {
                s.selectedItemRow.push(exdata)
            }
        }
        else {

            s.selectedItemRow = s.selectedItemRow.filter(function (d) {
                return d.row != row
            })

        }


    }
    s.addRespondent = function (row) {
        var dt = s.ApplicantforRespondent_Data[row]
        var app_ctrl_nbr = dt.app_ctrl_nbr
        location.href = "../cAddRespondent?app_ctrl_nbr=" + app_ctrl_nbr
        
    }
    


})

// employee_name
// budget_code
// employment_type
// item_no
// hiring_period
// empl_id
// department_name

