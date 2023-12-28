
ng_eRSP_App.controller("cBackgroundInvestigation_Ctrlr", function (commonScript, $scope, $http, $filter, $compile) {
    var s = $scope
    var h = $http
    var cs = commonScript

    s.app_ctrl_nbr = ""
    s.is_edit = false
    s.exam_rowindex = ""
    s.um = {}
    s.year = cs.RetrieveYear()
    s.bi_rating_questiontype_tbl = []
    s.employee = {}
   
    s.bi_questions_list = []
    s.bi_criteria1_list = []
    s.bi_criteria2_list = []
    s.bi_criteria3_list = []
    s.bi_rating_scale_tbl = []
    s.question_type = ""

    s.grouping = [
        { "level": 1 }
        , { "level": 2 }
        , { "level": 2 }
    ]

    function declareModel(data) {
        for (var x = 0; x < data.length; x++) {
            s[data[x].model_name.toString()] = "0"
        }
    }

    function addvalue(id, value) {
        $("#" + id).val(value)
        s[id] = value
    }


    

    function init() {
        h.post("../cBackgroundInvestigation/initialize").then(function (d) {

            if (d.data.icon == "success") {
                s.app_ctrl_nbr = d.data.app_ctrl_nbr
                s.bi_rating_questiontype_tbl = d.data.bi_rating_questiontype_tbl
                s.employee = d.data.employee[0]
                console.log(s.bi_rating_questiontype_tbl)
            }
            else {
                swal(d.data.message, {icon:d.data.icon})
            }

        })
    }

    init()

    function compute_average(data) {
        var data_len = data.length
        var total = 0
        var average = 0
        for (var x = 0; x < data_len; x++) {
            
            var value = $("#" + data[x]).val()
            
            total = total + parseInt(value)
        }
        average = total / data_len

        return average
    }

    function get_form_model(criteria1_model) {
        var data = []
        s.bi_questions_list.filter(function (d) {
            if (d.criteria1_model == criteria1_model) {
                data.push(d.model_name)
            }
        }) 
        return data

    }
    function average_value(question_type, criteria1_model) {
       
        var form_model = get_form_model(criteria1_model)
        var average = compute_average(form_model)
       
        $("#" + criteria1_model).text(average)


    }

    function reload_average_comment(data) {
        
        for (var x = 0; x < data.length; x++) {
            $("#" + data[x].criteria1_model).text(data[x].average)
            $("#comment" + data[x].criteria1_model).val(data[x].comments)
        }
    }
    s.setRatingUp_1 = function (id, limit, question_level,criteria1_model) {
        var input_len = $("#" + id.toString()).val().length
        var input_rate = $("#" + id).val()

        if (input_rate == "" || input_rate == undefined || input_len == 0) input_rate = "0"
        var countUp = parseInt(input_rate) + 1

        $("#" + id).val(countUp.toString())

        s.limitvalue(limit, id)
         average_value(1,criteria1_model)
        
    }

    s.setRatingDown_1 = function (id, question_level, criteria1_model) {

        var input_len = $("#" + id.toString()).val().length
        var input_rate = $("#" + id.toString()).val()

        if (input_rate == "" || input_rate == undefined || input_len == 0) input_rate = "0"

        if (input_rate != "0") {
            var countUp = parseInt(input_rate) - 1
            $("#" + id).val(countUp.toString())
        }
         average_value(1, criteria1_model)
        
    }

    s.setRatingUp = function (id, limit,question_level) {
        var question
        var input_len = $("#" + id.toString()).val().length
        var input_rate = $("#" + id).val()

        if (input_rate == "" || input_rate == undefined || input_len == 0) input_rate = "0"
        var countUp = parseInt(input_rate) + 1

        $("#" + id).val(countUp.toString())

        s.limitvalue(limit, id)
       
    }

    s.setRatingDown = function (id, question_level) {

        var input_len = $("#" + id.toString()).val().length
        var input_rate = $("#" + id.toString()).val()

        if (input_rate == "" || input_rate == undefined || input_len == 0) input_rate = "0"

        if (input_rate != "0") {
            var countUp = parseInt(input_rate) - 1
            $("#" + id).val(countUp.toString())
        }
    }

    s.limitvalue = function (limit, id) {
       
        var rating_left = $("#" + id).val()

        if (parseInt(rating_left) > limit) {

            addvalue(id, limit.toString())

        } else if (parseInt(rating_left) == 0) {

            addvalue(id, "0")

        } else if (isNaN(rating_left)) {

            addvalue(id, "0")

        } else if (rating_left == "") {

            addvalue(id, "0")
        }
        else {

            addvalue(id, rating_left)
        }
      
    }

    s.selectQuestion_type = function () {
        var question_type = $("#question_type").val()
        var rating_scale_group = "0"

        if (question_type == "") {
            question_type = "0"
            s.bi_questions_list   = []
            s.bi_criteria1_list   = []
            s.bi_criteria2_list   = []
            s.bi_criteria3_list   = []
            s.bi_rating_scale_tbl = []
        }
        else {

            rating_scale_group = s.bi_rating_questiontype_tbl.filter(function (d) {
                return d.question_type == question_type
            })[0].rscale_group_id

            h.post("../cBackgroundInvestigation/getBiQuestion",
                {
                      question_type: parseInt(question_type)
                    , rating_scale_group: parseInt(rating_scale_group)
                }).then(function (d) {
                    if (d.data.icon == "success") {
                        s.bi_questions_list = d.data.bi_questions_list
                        s.bi_criteria1_list = d.data.bi_criteria1_tbl
                        s.bi_criteria2_list = d.data.bi_criteria2_tbl
                        s.bi_criteria3_list = d.data.bi_criteria3_tbl
                        s.bi_rating_scale_tbl = d.data.bi_rating_scale_tbl

                        setTimeout(function () {
                            reload_average_comment(s.bi_criteria1_list)
                        }, 500);
                       
                    }
                    else {
                        swal(d.data.message, { icon: d.data.icon })
                    }
                  
                    

                })

        }

               
           
      

       
    }

    function groupbyData(data,prop) {
        var groupValues = data.reduce(function (obj, item) {
            var dt = item[prop]
           // console.log(item)
            var restOfValues = item; 
            if (!obj[dt]) {
                // If the letter group doesn't exist, create it
                obj[dt] = [];
            }
            obj[dt].push(restOfValues);
            //obj[item[prop]] = obj[item[prop]] || [];
            //obj[item[prop]] = item[prop1];
           
           // obj[item[prop1]] = +obj[item[prop1]] + + item[prop2]; // add (+) before variable so it's cast to numeric 
            return obj;
        },{});
        var groupData = Object.keys(groupValues).map(function (key) {
            return [key, groupValues[key]];
        });

        return groupData
    }

    s.SaveRespondent_1 = function () {
        cs.loading("show");
        var comment_data = []
         
        s.bi_criteria1_list.filter(function (d) {
            var average = $("#" + d.criteria1_model).text()
            var comments = $("#comment" + d.criteria1_model).val()
            var obj = {
                 app_ctrl_nbr: s.app_ctrl_nbr
                , criteria1_id: d.criteria1_id
                , average: average
                , comments: comments
            }
            comment_data.push(obj)
        })

        if (!cs.validatesubmit("respondent_1")) {
            cs.loading("hide");
            return
        }

        var respondent_data = cs.getFormData("respondent_1")

        h.post("../cBackgroundInvestigation/save_respondent_1", {
              respondent_data: respondent_data
            , comment_data: comment_data
        }).then(function (d) {
            if (d.data.icon == "success") {
                s.save_bi_rating(d.data.respondent_1_id)
            }
            else {
                swal(d.data.message, { icon: d.data.icon })
                cs.loading("hide");
            }

        })
    }

    s.SaveRespondent_2 = function () {
        cs.loading("show");
        //var comment_data = []

        //s.bi_criteria1_list.filter(function (d) {
        //    var average = $("#" + d.criteria1_model).text()
        //    var comments = $("#comment" + d.criteria1_model).val()
        //    var obj = {
        //         app_ctrl_nbr: s.app_ctrl_nbr
        //        , criteria1_id: d.criteria1_id
        //        , average: average
        //        , comments: ""
        //    }
        //    comment_data.push(obj)
        //})

        if (!cs.validatesubmit("respondent_2")) {
            cs.loading("hide");
            return
        }

        var respondent_data = cs.getFormData("respondent_2")

        h.post("../cBackgroundInvestigation/save_respondent_2", {
              respondent_data: respondent_data
        }).then(function (d) {
            if (d.data.icon == "success") {
                s.save_bi_rating(d.data.respondent_2_id)
            }
            else {
                swal(d.data.message, { icon: d.data.icon })
                cs.loading("hide");
            }

        })
    }

    s.SaveRespondent_3 = function () {
        cs.loading("show");

        if (!cs.validatesubmit("respondent_3")) {
            cs.loading("hide");
            return
        }

        var respondent_data = cs.getFormData("respondent_3")

        h.post("../cBackgroundInvestigation/save_respondent_3", {
            respondent_data: respondent_data
        }).then(function (d) {
            if (d.data.icon == "success") {
                s.save_bi_rating(d.data.respondent_3_id)
            }
            else {
                swal(d.data.message, { icon: d.data.icon })
                cs.loading("hide");
            }

        })
    }

    s.save_bi_rating = function (respondent_id) {
        var data2submit = []
        var question_type = $("#question_type").val()
        var data = cs.getFormData("questions")
       
        for (var prop in data) {
            var split = prop.split("_")
            if (parseInt(data[prop]) != 0) {
                var obj2submit = {
                    question_id: split[2]
                    , app_ctrl_nbr: s.app_ctrl_nbr
                    , question_rating: data[prop]
                    , question_type: parseInt(question_type)
                    , respondent_id: respondent_id
                }
                data2submit.push(obj2submit)
            }
        }

        if (data2submit.length < 1) {
            swal("Please add ratings to submit", { icon: "error" })
            cs.loading("hide");
            return
        }
        h.post("../cBackgroundInvestigation/save_bi_rating", {
            bi_ratings: data2submit
        }).then(function (d) {
            if (d.data.icon == "success") {
                swal("Rating successfully saved!", { icon: d.data.icon })
                cs.loading("hide");
            }
            else {
                swal(d.data.message, { icon: d.data.icon })
                cs.loading("hide");
            }

        })

    }

    s.open_respondent_form = function () {
       
        var question_type = $("#question_type").val()

       


        if (question_type == "1") {
            h.post("../cBackgroundInvestigation/get_respondent_data_1", {
                  question_type: question_type
                , app_ctrl_nbr: s.app_ctrl_nbr
            }).then(function (d) {
                if (d.data.icon == "success") {
                    
                    if (d.data.respondent_1 != null) {
                        cs.populateFormFields("respondent_1", d.data.respondent_1)
                    }
                    $("#SaveRespondentInfo_1").modal("show")

                    cs.loading("hide");
                }
                else {
                    swal(d.data.message, { icon: d.data.icon })
                    cs.loading("hide");
                }

            })

          

        }
        else if (question_type == "2") {
            h.post("../cBackgroundInvestigation/get_respondent_data_1", {
                question_type: question_type
                , app_ctrl_nbr: s.app_ctrl_nbr
            }).then(function (d) {
                if (d.data.icon == "success") {

                    if (d.data.respondent_1 != null) {
                        cs.populateFormFields("respondent_2", d.data.respondent_1)
                    }
                    
                    $("#SaveRespondentInfo_2").modal("show")

                    cs.loading("hide");
                }
                else {
                    swal(d.data.message, { icon: d.data.icon })
                    cs.loading("hide");
                }

            })

         
        }
        else if (question_type == "3") {
            h.post("../cBackgroundInvestigation/get_respondent_data_1", {
                  question_type: question_type
                , app_ctrl_nbr: s.app_ctrl_nbr
            }).then(function (d) {
                if (d.data.icon == "success") {
                    if (d.data.respondent_1 != null) {
                        cs.populateFormFields("respondent_3", d.data.respondent_1)
                    }
                    $("#SaveRespondentInfo_3").modal("show")

                    cs.loading("hide");
                }
                else {
                    swal(d.data.message, { icon: d.data.icon })
                    cs.loading("hide");
                }

            })

            
        }
       
    }
    
    s.ReturnToApplicantReview = function () {
        window.location.href = "/cApplicantsReview/";
    }
    
})

ng_eRSP_App.directive('textareaOnInput', ["commonScript", '$http', function (cs, http) {
    //************************************// 
    //*** this directive show alert if the value of a input type= number exceed is max or min values on blur
    //************************************// 
    return {
        restrict: 'C',
        link: function (scope, elem, attrs) {
            elem.on('keyup', function () {
                this.style.height = 'auto';
                this.style.height = (this.scrollHeight) + 'px';
            })
        }
    }
}])
//var abcArr = [["A", 10, 20], ["B", 20, 40], ["A", 30, 60], ["C", 40, 80]];

//// Use reduce to group the values by the first element (letter)
//var groupedByLetter = abcArr.reduce(function (acc, curr) {
//    var letter = curr[0]; // Get the letter
//    var restOfValues = curr.slice(1); // Get the rest of the values

//    if (!acc[letter]) {
//        // If the letter group doesn't exist, create it
//        acc[letter] = [];
//    }

//    // Push the rest of the values into the group
//    acc[letter].push(restOfValues);

//    return acc;
//}, {});

//console.log(groupedByLetter);




