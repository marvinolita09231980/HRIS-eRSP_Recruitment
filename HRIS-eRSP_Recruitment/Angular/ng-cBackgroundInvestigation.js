
ng_eRSP_App.controller("cBackgroundInvestigation_Ctrlr", function (commonScript, $scope, $http, $filter, $compile) {
    var s = $scope
    var h = $http
    var cs = commonScript

    s.is_edit = false
    s.exam_rowindex = ""
    s.um = {}
    s.year = cs.RetrieveYear()
    s.rating_left =  "0"
    

    function addvalue(id, value) {
        $("#" + id).val(value)
        s[id] = value
    }


    


    function init() {

      


    }

    init()

    s.setRatingUp = function () {
        if (s.rating_left == "") s.rating_left="0"
        var countUp = parseInt(s.rating_left) + 1
        s.rating_left = countUp.toString()
        s.limitvalue(100)
    }

    s.setRatingDown = function () {
        if (s.rating_left == "") s.rating_left = "0"
        if (s.rating_left != "0") {
          var countUp = parseInt(s.rating_left) - 1
            s.rating_left = countUp.toString()
        }
    }

    s.limitvalue = function (value) {
        if (parseInt(s.rating_left) > value) {
            s.rating_left = value.toString()
        } else if (parseInt(s.rating_left) == 0) {
            s.rating_left = "0"
        } else if (isNaN(s.rating_left)) {
            s.rating_left = "0"
        } else if (s.rating_left == "") {
            s.rating_left = "0"
        }
        else {
            s.rating_left = parseInt(s.rating_left)
        }
    }
})


