ng_eRSP_App.controller("cMainPage_Ctrlr", function (commonScript, $scope, $http, $filter, $compile) {
    var s = $scope
    var h = $http
    var cs = commonScript;
    s.appx_sum1 = ""
    s.appx_sum2 = ""
    s.appx_insider  =""
    s.appx_outsider = ""
    s.appx_sum5 = ""
    s.appx_sum6 = ""
    s.appx_inout_total = ""
    
    s.year = cs.RetrieveYear()
    var date = new Date();
    s.NoOfAppxDataTable_Data = []
    s.selected_year = ""
    var Init_NoOfAppxDataTable = function (par_data) {
        s.NoOfAppxDataTable_Data = par_data;
        s.NoOfAppxDataTable_Table = $('#NoOfAppxDataTable').dataTable(
            {
                data: s.NoOfAppxDataTable_Data,
                sDom: 'rt<"bottom"p>',
                order: [[0, 'asc']],
                pageLength: 8,
                columns: [
                    {
                        "mData": "xLabel",
                        "mRender": function (data, type, full, row) {
                            return "<h3 class='no-margins'>" + data + ".</h3 >"
                        }
                    },
                    {
                        "mData": "yLabel",
                        "mRender": function (data, type, full, row) {
                            return "<h3 class='no-margins'><small>" + full["period_descr"] + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + full["employment_type"] +"</small ><span class='pull-right'>" + data + "</span></h3 >"+
                                "<div class='stat-percent'>" + fn_appx_sum1(data)+"% <i class='fa fa-level-up text-navy'></i></div>"+
                                "<div class='progress progress-mini'>"+
                                "<div style='width: " + fn_appx_sum1(data)+"%;' class='progress-bar'></div>"+
                                "</div>"
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

    var Init_NoOfDisbxDataTable = function (par_data) {
        s.NoOfDisbxDataTable_Data = par_data;
        s.NoOfDisbxDataTable_Table = $('#NoOfDisbxDataTable').dataTable(
            {
                data: s.NoOfDisbxDataTable_Data,
                sDom: 'rt<"bottom"p>',
                order: [[0, 'asc']],
                pageLength: 8,
                columns: [
                    {
                        "mData": "xLabel",
                        "mRender": function (data, type, full, row) {
                            return "<h3 class='no-margins'>" + data + ".</h3 >"
                        }
                    },
                    {
                        "mData": "yLabel",
                        "mRender": function (data, type, full, row) {
                            return "<h3 class='no-margins'><small>" + full["period_descr"] + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + full["employment_type"] + "</small ><span class='pull-right'>" + data + "</span></h3 >" +
                                "<div class='stat-percent'>" + fn_appx_sum2(data) + "% <i class='fa fa-level-up text-navy'></i></div>" +
                                "<div class='progress progress-mini'>" +
                                "<div style='width: " + fn_appx_sum2(data) + "%;' class='progress-bar'></div>" +
                                "</div>"
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


    var Init_NoOfInOutDataTable = function (par_data) {
        s.NoOfInOutDataTable_Data = par_data;
        s.NoOfInOutDataTable_Table = $('#NoOfInOutDataTable').dataTable(
            {
                data: s.NoOfInOutDataTable_Data,
                sDom: 'rt<"bottom"p>',
                order: [[0, 'asc']],
                sortable:false,
                pageLength: 8,
                columns: [
                    {
                        "mData": "xLabel",
                        "mRender": function (data, type, full, row) {
                            return "<h3 class='no-margins'>" + data + ".</h3 >"
                        }
                    },
                    {
                        "mData": "insider",
                        "mRender": function (data, type, full, row) {
                            return "<h3 class='no-margins'><small>" + full["period_descr"] +  "</small ><span class='pull-right'>" + data + "</span></h3 >" +
                                "<div class='stat-percent'>" + fn_appx_sum_insider(data, full["not_identified"],full["outsider"]) + "% <i class='fa fa-level-up text-navy'></i></div>" +
                                "<div class='progress progress-mini'>" +
                                "<div style='width: " + fn_appx_sum_insider(data, full["not_identified"], full["outsider"]) + "%;' class='progress-bar'></div>" +
                                "</div>"
                        }
                    },
                    {
                        "mData": "outsider",
                        "mRender": function (data, type, full, row) {
                            return "<h3 class='no-margins'><small>" + full["employment_type"] + "</small ><span class='pull-right'>" + data + "</span></h3 >" +
                                "<div class='stat-percent m-t-sm'>" + fn_appx_sum_outsider(data, full["insider"], full["not_identified"]) + "% <i class='fa fa-level-up text-navy'></i></div>" +
                                "<div class='progress progress-mini'>" +
                                "<div style='width: " + fn_appx_sum_outsider(data, full["insider"], full["not_identified"]) + "%;' class='progress-bar'></div>" +
                                "</div>"
                        }
                    },
                    {
                        "mData": "not_identified",
                        "mRender": function (data, type, full, row) {
                            return "<h3 class='no-margins'><button class='btn btn-primary'>" + fn_io_tna(data, full["insider"], full["outsider"]) + "</button></h3 >"
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

    function fn_io_tna(data1, data2, data3) {
        
        return  (data1+ data2+data3)
    }

    var Init_NoOfReligionDataTable = function (par_data) {
        s.NoOfReligionDataTable_Data = par_data;
        s.NoOfReligionDataTable_Table = $('#NoOfReligionDataTable').dataTable(
            {
                data: s.NoOfReligionDataTable_Data,
                sDom: 'rt<"bottom"p>',
                order: [[0, 'asc']],
                pageLength: 8,
                columns: [
                    {
                        "mData": "xLabel",
                        "mRender": function (data, type, full, row) {
                            return "<h3 class='no-margins'></h3 >"
                        }
                    },
                    {
                        "mData": "yLabel",
                        "mRender": function (data, type, full, row) {
                            return "<h3 class='no-margins'><small>" + full["xLabel"] + "</small ><span class='pull-right'>" + data + "</span></h3 >" +
                                "<div class='stat-percent'>" + fn_appx_sum5(data) + "% <i class='fa fa-level-up text-navy'></i></div>" +
                                "<div class='progress progress-mini'>" +
                                "<div style='width: " + fn_appx_sum5(data) + "%;' class='progress-bar'></div>" +
                                "</div>"
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


    var Init_NoOfEthnicityDataTable = function (par_data) {
        s.NoOfEthnicityDataTable_Data = par_data;
        s.NoOfEthnicityDataTable_Table = $('#NoOfEthnicityDataTable').dataTable(
            {
                data: s.NoOfEthnicityDataTable_Data,
                sDom: 'rt<"bottom"p>',
                order: [[0, 'asc']],
                pageLength: 8,
                columns: [
                    {
                        "mData": "xLabel",
                        "mRender": function (data, type, full, row) {
                            return "<h3 class='no-margins'></h3 >"
                        }
                    },
                    {
                        "mData": "yLabel",
                        "mRender": function (data, type, full, row) {
                            return "<h3 class='no-margins'><small>" + full["xLabel"] + "</small ><span class='pull-right'>" + data + "</span></h3 >" +
                                "<div class='stat-percent'>" + fn_appx_sum6(data) + "% <i class='fa fa-level-up text-navy'></i></div>" +
                                "<div class='progress progress-mini'>" +
                                "<div style='width: " + fn_appx_sum6(data) + "%;' class='progress-bar'></div>" +
                                "</div>"
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
    function fn_appx_sum1(data) {
        if (data == 0) {
            return 0
        }
        else {
            var perc = (data * 100) / s.appx_sum1
            return perc.toFixed(3)
        }
    }
    function fn_appx_sum2(data) {
        if (data == 0) {
            return 0
        }
        else {
            var perc = (data * 100) / s.appx_sum2
            return perc.toFixed(3)
        }
    }
    function fn_appx_sum_insider(data, insider, outsider) {
        var in_out = data + insider + outsider
        if (data == 0) {
            return 0
        }
        else {
            var perc = (data * 100) / in_out
            return perc.toFixed(2)
        }
    }
    function fn_appx_sum_outsider(data, insider, outsider) {
        var in_out = data +  insider + outsider
        if (data == 0) {
            return 0
        }
        else {
            var perc = (data * 100) / in_out
            return perc.toFixed(2)
        }
    }
    function fn_appx_sum5(data) {
        if (data == 0) {
            return 0
        }
        else {
            var perc = (data * 100) / s.appx_sum5
            return perc.toFixed(2)
        }
    }
    function fn_appx_sum6(data) {
        if (data == 0) {
            return 0
        }
        else {
            var perc = (data * 100) / s.appx_sum6
            return perc.toFixed(2)
        }
    }
    Init_NoOfAppxDataTable([])
    Init_NoOfDisbxDataTable([])
    Init_NoOfInOutDataTable([])
    Init_NoOfReligionDataTable([])
    Init_NoOfEthnicityDataTable([])

    init()


    s.selectBudgetYear = function () {
        s.selected_year = $("#budget_year_1").val()
        Fecth_data_for_graph(s.selected_year)
    }
     

    function addvalue(id, value) {
        $("#" + id).val(value)
        s[id] = value
    }

    function init() {
        
        Fecth_data_for_graph("2024")
       
    }

    function Fecth_data_for_graph(year) {
        var arrempty = []
        $('#morris-bar-chart').empty();
        $('#morris-bar-chart2').empty();
        $('#morris-bar-chart3').empty();
        $("#flot-pie-chart").empty();
        $("#flot-pie-chart2").empty();
        $('#morris-bar-chart4').empty();
        $('#morris-bar-chart5').empty();
        arrempty.refreshTable("NoOfAppxDataTable", "")
        arrempty.refreshTable("NoOfDisbxDataTable", "")
        arrempty.refreshTable("NoOfInOutDataTable", "")
        arrempty.refreshTable("NoOfReligionDataTable", "")
        arrempty.refreshTable("NoOfEthnicityDataTable", "")

        $.ajax({
            url: "../cMainPage/barchart1",
            data: { year: year},
            success: function (d) {
                s.appx_sum1 = d.appx_sum
                s.appx_permanent = d.appx_permanent
                s.appx_casual = d.appx_casual
                $("#appx_sum1").text(d.appx_sum)
                $("#appx_permanent").text(d.appx_permanent)
                $("#appx_casual").text(d.appx_casual)

                if (d.appx_permanent == 0) {
                    $("#permanent_percent").text("0%")
                }
                else {
                    $("#permanent_percent").text(((d.appx_permanent * 100) / s.appx_sum1).toFixed(2) + '%')
                }
                if (d.appx_casual == 0) {
                    $("#casual_percent").text("0%")
                }
                else {
                    $("#casual_percent").text(((d.appx_casual * 100) / s.appx_sum1).toFixed(2) + '%')
                }

               
               

                s.NoOfAppxDataTable_Data = d.nof_applicants.refreshTable("NoOfAppxDataTable", "")
                var data = []
                for (var x = 0; x < d.nof_applicants.length; x++) {
                    data.push({
                          xLabel: d.nof_applicants[x].period_descr
                        , yLabel: d.nof_applicants[x].yLabel
                    })
                }
                if (data.length > 0) {
                    var moorisbar1 = Morris.Bar({
                        element: 'morris-bar-chart',
                        data: data,
                        xkey: 'xLabel',
                        ykeys: ['yLabel'],
                        labels: ['Series A'],
                        labelTop: true,
                        hideHover: 'auto',
                        resize: true,
                        xLabelAngle: 35,
                        barColors: ['#1ab394'],
                    });
                }

            }
        });



        $.ajax({
            url: "../cMainPage/barchart2",
            data: { year: year },
            success: function (d) {
                $("#appx_sum2").text(d.appx_sum)
                s.appx_sum2 = d.appx_sum
                $("#disbx_permanent").text(d.disbx_permanent)
                $("#disbx_casual").text(d.disbx_casual)
                if (d.disbx_permanent == 0) {
                    $("#disbx_permanent_percent").text("0%")
                }
                else {
                    $("#disbx_permanent_percent").text(((d.disbx_permanent * 100) / s.appx_sum2).toFixed(2) + '%')
                }
                if (d.disbx_permanent == 0) {
                    $("#disbx_casual_percent").text("0%")
                }
                else {
                    $("#disbx_casual_percent").text(((d.disbx_casual * 100) / s.appx_sum2).toFixed(2) + '%')
                }
              
                

                console.log(d.disbx_permanent)
                console.log(d.disbx_casual)

                s.NoOfDisbxDataTable_Data = d.withDisabx_applicants.refreshTable("NoOfDisbxDataTable", "")

                var data = []
                for (var x = 0; x < d.withDisabx_applicants.length; x++) {
                    data.push({
                        xLabel: d.withDisabx_applicants[x].period_descr
                        , yLabel: d.withDisabx_applicants[x].yLabel
                    })
                }
                if (data.length > 0) {
                    var moorisbar1 = Morris.Bar({
                        element: 'morris-bar-chart2',
                        data: data,
                        xkey: 'xLabel',
                        ykeys: ['yLabel'],
                        labels: ['With disability'],
                        hideHover: 'auto',
                        resize: true,
                        xLabelAngle: 35,
                        barColors: ['#1ab394'],
                    });
                }

            }
        });

        $.ajax({
            url: "../cMainPage/barchart3",
            data: { year: year},
            success: function (d) {
                //var perc = (data * 100) / s.appx_sum6
                $("#appx_insider").text(d.appx_insider)
                $("#appx_outsider").text(d.appx_outsider)
                $("#appx_inout_total").text(d.appx_insider + d.appx_outsider + d.not_identified)
                s.appx_insider = d.appx_insider
                s.appx_outsider = d.appx_outsider
                s.appx_inout_total = d.appx_insider + d.appx_outsider + d.not_identified

                if (d.appx_insider == 0) {
                    $("#percent_insider").text("0%")
                }
                else {
                    $("#percent_insider").text(((d.appx_insider * 100) / s.appx_inout_total).toFixed(2) + '%')
                }
                if (d.appx_outsider == 0) {
                    $("#percent_outsider").text("0%")
                }
                else {
                    $("#percent_outsider").text(((d.appx_outsider * 100) / s.appx_inout_total).toFixed(2) + '%')
                }

                
               

                s.NoOfInOutDataTable_Data = d.appx_insider_outsider.refreshTable("NoOfInOutDataTable", "")


                var data = []
                for (var x = 0; x < d.appx_insider_outsider.length; x++) {
                    data.push({
                        xLabel: d.appx_insider_outsider[x].period_descr
                        , insider: d.appx_insider_outsider[x].insider
                        , outsider: d.appx_insider_outsider[x].outsider
                    })
                }

                if (data.length > 0) {
                    Morris.Bar({
                        element: 'morris-bar-chart3',
                        data: data,
                        xkey: 'xLabel',
                        ykeys: ['insider', 'outsider'],
                        labels: ['Insider', 'Outsider'],
                        hideHover: 'auto',
                        resize: true,
                        xLabelAngle: 35,
                        barColors: ['#1ab394', '#cacaca'],
                    });
                }
            }
        });

        //---start flot chart js//
        $.ajax({
            url: "../cMainPage/piechart1",
            data: { year: year },
            success: function (d) {

                var data = []
                for (var x = 0; x < d.appx_per_gender.length; x++) {
                    data.push({
                         label: d.appx_per_gender[x].data +' - '+ d.appx_per_gender[x].label
                        , data: d.appx_per_gender[x].data
                        , color: d.appx_per_gender[x].color
                    })
                }

                if (data.length > 0) {
                    $.plot($("#flot-pie-chart"), data, {
                        series: {
                            pie: {
                                show: true
                            }
                        },
                        grid: {
                            hoverable: true
                        },
                        tooltip: true,
                        tooltipOpts: {
                            content: "%p.0%, %s", // show percentages, rounding to 2 decimal places
                            shifts: {
                                x: 0,
                                y: 20
                            },
                            defaultTheme: false
                        },
                        legend: {
                            position: "ne",
                            margin: [-110, 0]
                        },
                       


                    });
                }
            }
        });


        $.ajax({
            url: "../cMainPage/piechart2",
            data: { year: year },
            success: function (d) {

                var data = []
                for (var x = 0; x < d.appx_per_civil_status.length; x++) {
                    data.push({
                          label: d.appx_per_civil_status[x].data+' - '+ d.appx_per_civil_status[x].label
                        , data: d.appx_per_civil_status[x].data
                        , color: d.appx_per_civil_status[x].color
                    })
                }

                if (data.length > 0) {
                    $.plot($("#flot-pie-chart2"), data, {
                        series: {
                            pie: {
                                show: true
                            }
                        },
                        grid: {
                            hoverable: true
                        },
                        tooltip: true,
                        tooltipOpts: {
                            content: "%p.0%, %s", // show percentages, rounding to 2 decimal places
                            shifts: {
                                x: 0,
                                y: 20
                            },
                            defaultTheme: false
                        },
                        legend: {
                            position: "ne",
                            margin: [-110, 0]
                        }
                    });
                }
            }
        });

        //flot chart js end----//

        $.ajax({
            url: "../cMainPage/barchart4",
            data: { year: year},
            success: function (d) {
                $("#appx_sum5").text(d.appx_sum)
               s.appx_sum5 = d.appx_sum
                s.NoOfReligionDataTable_Data = d.appx_per_religion.refreshTable("NoOfReligionDataTable", "")

                var data = []
                for (var x = 0; x < d.appx_per_religion.length; x++) {
                    data.push({
                        xLabel: d.appx_per_religion[x].xLabel
                        , yLabel: d.appx_per_religion[x].yLabel

                    })
                }

                if (data.length > 0) {
                    Morris.Bar({
                        element: 'morris-bar-chart4',
                        data: data,
                        xkey: 'xLabel',
                        ykeys: ['yLabel'],
                        labels: ['Data'],
                        hideHover: 'auto',
                        resize: true,
                        xLabelAngle: 35,
                        barColors: ['#1ab394'],
                    });
                }

            }
        });

        $.ajax({
            url: "../cMainPage/barchart5",
            data: { year: year},
            success: function (d) {
                $("#appx_sum6").text(d.appx_sum)
                s.appx_sum6 = d.appx_sum
                s.NoOfEthnicityDataTable_Data = d.appx_per_ethnicity.refreshTable("NoOfEthnicityDataTable", "")

                var data = []
                for (var x = 0; x < d.appx_per_ethnicity.length; x++) {
                    data.push({
                        xLabel: d.appx_per_ethnicity[x].xLabel
                        , yLabel: d.appx_per_ethnicity[x].yLabel

                    })
                }

                if (data.length > 0) {
                    Morris.Bar({
                        element: 'morris-bar-chart5',
                        data: data,
                        xkey: 'xLabel',
                        ykeys: ['yLabel'],
                        labels: ['Data'],
                        hideHover: 'auto',
                        resize: true,
                        xLabelAngle: 35,
                        barColors: ['#1ab394'],
                    });
                }

            }
        });

    }

    s.Summary_Appx_Reports = function () {
        console.log($("#budget_year_1").val())
        if (!cs.Validate1Field2("budget_year_1", "Required Field!")) {
            return
        }
      
        var budget_code = $("#budget_year_1").val()+"-2"
        console.log(budget_code)

        s.employee_name_print = 'SUMMARY REPORTS';
        var SaveName = "Crystal_Report";
        var ReportType = "inline";
        var ReportPath = "~/Reports/SummaryReports/";
        var ReportName = "crySummaryAppxReports";
        var sp = "";

        

        ReportPath = ReportPath + "" + ReportName + ".rpt";
        sp = "sp_appx_summary_report,p_budget_code," + budget_code 

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
                cs.loading('hide')
            };
        }
        else if (iframe_page.innerHTML()) {
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
    }

})