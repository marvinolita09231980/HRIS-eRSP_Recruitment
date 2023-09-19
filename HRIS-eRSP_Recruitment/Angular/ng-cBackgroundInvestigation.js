
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
                console.log(d.data.employee[0])
                s.employee = d.data.employee[0]
                console.log(s.bi_rating_questiontype_tbl)
            }
            else {
                swal(d.data.message, {icon:d.data.icon})
            }

        })
    }

    init()


    s.setRatingUp = function (id, limit) {

        var input_len = $("#" + id.toString()).val().length
        var input_rate = $("#" + id).val()

        if (input_rate == "" || input_rate == undefined || input_len == 0) input_rate = "0"
        var countUp = parseInt(input_rate) + 1

        $("#" + id).val(countUp.toString())

        s.limitvalue(limit,id)
    }

    s.setRatingDown = function (id) {

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
        var rating_scale_group = s.bi_rating_questiontype_tbl.filter(function (d) {
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

                            console.log(s.bi_rating_scale_tbl)
                        }
                        else {
                            swal(d.data.message, { icon: d.data.icon })
                        }
                    })
           
      

       
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

    s.save_bi_rating = function () {
        var data2submit = []
        var data = cs.getFormData("questions")
        if (!cs.Validate1Field("accomplished_date")) {
            return
        }

        var accomplished_date = $("#accomplished_date").val()
        for (var prop in data) {
            var split = prop.split("_")
           
            var obj2submit = {
                  question_id: split[2]
                , app_ctrl_nbr: s.app_ctrl_nbr
                , question_rating: data[prop]
                , accomplished_date: accomplished_date
            }
            data2submit.push(obj2submit)
        }

        h.post("../cBackgroundInvestigation/save_bi_rating", {
            bi_ratings: data2submit
        }).then(function (d) {
            if (d.data.icon == "success") {
                swal("Rating successfully saved!", { icon: d.data.icon })
            }
            else {
                 swal(d.data.message, { icon: d.data.icon })
            }

        })
       
    }
   
    
})

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




