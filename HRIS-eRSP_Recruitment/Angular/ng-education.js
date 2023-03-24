


ng_eRSP_App.controller("education_Ctrlr", function ($scope, $http, $filter, $compile) {
    var s = $scope
    var h = $http
    s.rowLen = ""
    s.year = []
    s.um = {}
    var educ = []
   
   
    s.alphabet_list = [
       { alpha_name: 'A' }, { alpha_name: 'B' }, { alpha_name: 'C' }, { alpha_name: 'D' }, { alpha_name: 'E' }, { alpha_name: 'F' },
       { alpha_name: 'G' }, { alpha_name: 'H' }, { alpha_name: 'I' }, { alpha_name: 'J' }, { alpha_name: 'K' }, { alpha_name: 'L' },
       { alpha_name: 'M' }, { alpha_name: 'N' }, { alpha_name: 'O' }, { alpha_name: 'P' }, { alpha_name: 'Q' }, { alpha_name: 'R' },
       { alpha_name: 'S' }, { alpha_name: 'T' }, { alpha_name: 'U' }, { alpha_name: 'V' }, { alpha_name: 'W' }, { alpha_name: 'X' },
       { alpha_name: 'Y' }, { alpha_name: 'Z' }
    ]
    s.svc = [{ id: false, text: 'No' }, { id: true, text: 'Yes' }]


    var Init_educ_Grid = function (par_data) {
        s.Educ_Data = par_data;
        s.Educ_Table = $('#educ_grid').dataTable(
            {
                data: s.Educ_Data,
                sDom: 'rt<"bottom"p>',
                pageLength: 10,
                columns: [
                    {
                        "mData": "seq_no", "mRender": function (data, type, full, row) {
                            return "<span class='text-left btn-block'>" + data + "</span>"
                        }
                    },
                    {
                        "mData": "school_name",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-left btn-block'>" + data + "</span>"
                        }
                    },
                    {
                        "mData": "basic_educ_deg",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-left btn-block'>" + data + "</span>"
                        }
                    },
                    {
                        "mData": "period_from",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-left btn-block'>" + data + "</span>"
                        }
                    },
                    {
                         "mData": "period_to",
                         "mRender": function (data, type, full, row) {
                             return "<span class='text-left btn-block'>" + data + "</span>"
                         }
                     },
                     {
                          "mData": "year_graduated",
                          "mRender": function (data, type, full, row) {
                              return "<span class='text-left btn-block'>" + data + "</span>"
                          }
                      },
                      {
                          "mData": null,
                          "bSortable": false,
                          "mRender": function (data, type, full, row) {
                              return ' <label class="container">' +
                                     '<input type="checkbox" ng-click="btn_receive(' + row["row"] + ',1)" id="f_daysched_we" ng-model="CD.f_daysched_we">' +
                                     '<span class="checkmark"></span></label>'
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
    
    function RetrieveYear() {
        var currentYear = new Date().getFullYear();

        var prev_year = currentYear - 8;
        for (var i = 1; i <= 9; i++) {
            var data = { "year": prev_year }
            s.year.push(data)
            prev_year++;
        }
    }

    function TextValue(id, data) {
        if (elEmpty(id)) {
            return ""
        }
        else {
            return s[data].filter(function (d) {
                return d.id == id
            })[0].text
        }
    }

    function init() {
        Init_educ_Grid([])
        RetrieveYear();
        s.rowLen = "10"
        h.post("../cApplicantReviewDetail/educ_data").then(function (d) {
            s.Educ_Data = d.data.educ_data.refreshTable("Educ_Table", "")
        })
    }

    init()








    //this fucntion is called after refreshTable to return to the current dataTable page
    function changePage(tname, page, id) {

        var npage = page

        var pageLen = $("#" + id).DataTable().page.info().length
        if (page < 2 && pageLen == 0) {
            npage = page + 1
        }
        else if (page > 1 && pageLen == 0) {
            npage = page - 1
        }

        if (npage != 0) {
            s[tname].fnPageChange(npage)
        }
    }


    //This function is called to extract the DataTable rows data
    function DataTable_data(tname) {
        var data = []
        var id = s[tname][0].id;
        var dtrw = $("#" + id).DataTable().rows().data()
        for (var x = 0; x < dtrw.length; ++x) {
            data.push(dtrw[x])
        }
        return data
    }

    //compute for float values
    function computeFloat(v1, v2) {
        var result = 0;

        result = v1 - v2;
        return result;
    }


    //*** format money values with two decimal zeros onblur***

    //*** test if overrides value is a valid money value****
    function isCurrency(nbr) {
        var regex = /^\d+(?:\.\d{0,2})$/;

        if (regex.test(nbr)) {
            return true
        }
        else {
            return false
        }

    }


    function validateEmpty(data) {
        if (data == null || data == "" || data == undefined) {
            return ""
        }
        else {
            return data
        }
    }
    function formatNumber(d) {
        return d.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    }

    s.elEmpty = function (data) {
        if (data == null || data == "" || data == undefined) {
            return true
        }
        else {
            return false
        }

    }



    function currency(d) {

        var retdata = ""
        if (d == null || d == "" || d == undefined) {
            return retdata = "0.00"
        }
        else {
            retdata = d.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
            return retdata
        }
    }

    Array.prototype.refreshTable = function (table, id) {

        if (this.length == 0) {
            s[table].fnClearTable();

        }
        else {
            s[table].fnClearTable();
            s[table].fnAddData(this);
        }

        var el_id = s[table][0].id
        if (id != "") {
            for (var x = 1; x <= $("#" + el_id).DataTable().page.info().pages; x++) {
                if (id.get_page(table) == false) {
                    s[table].fnPageChange(x);
                }
                else {
                    break;
                }
            }
        }
        $("#spinner_load").modal("hide")
        return this;
    }

    String.prototype.get_page = function (table) {
        id = this;
        var nakit_an = false;
        var rowx = 0;
        var el_id = s[table][0].id
        $("#" + el_id + " tr").each(function () {
            $.each(this.cells, function (cells) {
                if (cells == 0) {
                    if ($(this).text() == id) {
                        nakit_an = true;
                        return false;
                    }
                }
            });
            if (nakit_an) {
                $(this).addClass("selected");
                return false;
            }
            rowx++;
        });
        return nakit_an;
    }

    Array.prototype.select = function (code, prop) {
        return this.filter(function (d) {
            return d[prop] == code
        })
    }
    Array.prototype.delete = function (code, prop) {
        return this.filter(function (d) {
            return d[prop] != code
        })
    }
    Array.prototype.delete = function (code) {
        return this.filter(function (d, k) {
            return k != code
        })
    }
    Array.prototype.deletebyprop = function (code, prop) {

        return this.filter(function (d) {
            return d[prop] != code
        })
    }


})

