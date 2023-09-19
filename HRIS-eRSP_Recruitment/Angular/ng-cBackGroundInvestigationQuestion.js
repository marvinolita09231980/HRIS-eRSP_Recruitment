
ng_eRSP_App.controller("cBackgroundInvestigationQuestion_Ctrlr", function (commonScript, $scope, $http, $filter, $compile) {
    var s = $scope
    var h = $http
    var cs = commonScript

    s.is_edit = false
    s.exam_rowindex = ""
    s.um = {}
    s.year = cs.RetrieveYear()
    s.rating_left = "0"
    s.bi_criteria1_tbl = []
    s.bi_criteria2_tbl = []
    s.bi_criteria3_tbl = []

    s.bi_criteria1_tbl1 = []
    s.bi_criteria2_tbl2 = []
    s.bi_criteria3_tbl3 = []


    function addvalue(id, value) {
        $("#" + id).val(value)
        s[id] = value
    }


    var Init_Question_List_Grid = function (par_data) {
        s.Question_List_Data = par_data;
        s.Question_List_Table = $('#question_grid').dataTable(
            {
                data: s.Question_List_Data,
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

                        "mData": "question_id",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-center btn-block'>" + data + "</span>"
                        }
                    },

                    {
                        "mData": "question_descr",
                        "mRender": function (data, type, full, row) {
                            //return "<span><img alt='image'  class='img-circle grid-img' src='" + s.encode_idv(full["empl_photo_img"]) + "'></span>&nbsp;&nbsp;<span class='text-left'>" + data + "</span>"
                            return "<span class='text-left'>" + data + "</span>"
                        }
                    },
                    {
                        "mData": "question_id",
                        "bSortable": false,
                        "mRender": function (data, type, full, row) {

                            return '<center><div class="btn-group">' +
                                '<button  type="button" class="btn btn-success btn-sm action" data-toggle="tab" ng-click="edit(' + row["row"] + ')" data-toggle="tooltip" data-placement="left" title="Add To Review">  <i class="fa fa-plus"></i></button >' +
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


    function init() {
        Init_Question_List_Grid([])
        h.post("../cBackgroundInvestigationQuestion/Initialize").then(function (d) {
            s.bi_criteria1_tbl = d.data.bi_criteria1_tbl
            s.bi_criteria2_tbl = d.data.bi_criteria2_tbl
            s.bi_criteria3_tbl = d.data.bi_criteria3_tbl

        })
    }

    init()


    s.selectQuestion_type = function () {
        var question_type = $("#question_type").val()
        s.bi_criteria1_tbl1 = s.bi_criteria1_tbl.filter(function (d) {
            return d.question_type == question_type
        })

    }
    s.selectCriteria1_id = function () {
        var criteria1_id = $("#criteria1_id").val()
        s.bi_criteria2_tbl2 = s.bi_criteria2_tbl.filter(function (d) {
            return d.criteria1_id == criteria1_id
        })

    }

    s.selectCriteria2_id = function () {
        var criteria2_id = $("#criteria2_id").val()
        s.bi_criteria3_tbl3 = s.bi_criteria3_tbl.filter(function (d) {
            return d.criteria2_id == criteria2_id
        })

    }


    s.saveQuestion = function () {
        var question_type_descr = ""
        var criteria1_descr = ""
        var criteria2_descr = ""
        var criteria3_descr = ""

        if ($("#question_type").val() != "") {
             question_type_descr = $("#question_type option:selected").text()
        }
        if ($("#criteria1_id").val() != "") {
             criteria1_descr     = $("#criteria1_id option:selected").text()
        }
        if ($("#criteria2_id").val() != "") {
             criteria2_descr     = $("#criteria2_id option:selected").text()
        }
        if ($("#criteria3_id").val() != "") {
             criteria3_descr     = $("#criteria3_id option:selected").text()
        }

        var question = cs.getFormData("question")
        question.question_type_descr    =  question_type_descr
        question.criteria1_descr        =  criteria1_descr    
        question.criteria2_descr        =  criteria2_descr    
        question.criteria3_descr        =  criteria3_descr 

        h.post("../cBackgroundInvestigationQuestion/saveQuestion", {
            question: question
        }).then(function (d) {
            swal(d.data.message, {icon:d.data.icon})
        })
    }

   
})


