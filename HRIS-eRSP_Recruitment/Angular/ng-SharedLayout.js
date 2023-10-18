


ng_eRSP_App.filter('jsonDate', ['$filter', function ($filter) {
    return function (input, format) {
        return (input) ? $filter('date')(parseInt(input.substr(6)), format) : '';
    };
}]);


ng_eRSP_App.controller("SharedLayoutCtrlr", function ($scope, $http, $filter) {
    var s = $scope
    var h = $http
    s.hideThis = false
    s.controller = "Home"
    s.Action1 = "Index"
    s.Action2 = "About"
    s.Action3 = "Contact"
    s.imageshow = false
    s.employment_type = ""
    s.budget_code = ""
    s.expanded = []
    s.MenuList = []
    var group = new Array()
    var ls = new Array()
    var ls2 = new Array()
    function GetMenuList() {
        h.post("../Menu/GetMenuList").then(function (d) {

            s.MenuList = d.data.data

            angular.forEach(s.MenuList, function (value) {
                value.activeclass = ""
            })
            localStorage["MenuList"] = JSON.stringify(s.MenuList); 
           
            
            s.username = d.data.username
            var photo = d.data.photo
            if (photo == null) {
                s.imgprofile = "../ResourcesImages/149071.png";
            }
            else {
                s.imgprofile = photo;
            }
            s.budget_year = d.data.budgetyear
            s.employment_type = d.data.employment_type
            s.budget_code = d.data.budget_code
            //localStorage["username"] = d.data.username
            //localStorage["photo"] = d.data.photo
            //localStorage["budgetyear"] = JSON.stringify(d.data.budgetyear); 
            //localStorage["employment_type"] = d.data.employment_type
            //localStorage["budget_code"] = d.data.budget_code
        })
    }
    var init = function () {
        //if (localStorage["username"]) {
        //    if (localStorage["expanded"]) {
        //        s.expanded = JSON.parse(localStorage["expanded"])
        //        setTimeout(function () {
        //            s.MenuList = SetMenuList(s.expanded, JSON.parse(localStorage["MenuList"]))
                    
        //            s.$apply();
        //        }, 50)
               
        //    }
        //    else {
        //        setTimeout(function () {
        //            s.MenuList = SetMenuList(null, JSON.parse(localStorage["MenuList"]))
        //            s.$apply();
        //        }, 50)
        //    }
          
        //    s.username = localStorage["username"]

        //    var photo = localStorage["photo"]

        //    if (photo == null) {
        //        s.imgprofile = "../ResourcesImages/149071.png";
        //    }
        //    else {
        //        s.imgprofile = photo;
        //    }

        //    //s.budget_year = JSON.parse(localStorage["budgetyear"])
        //    s.employment_type = localStorage["employment_type"]
        //    s.budget_code = localStorage["budget_code"]

            
        //}
        //else {
        //    GetMenuList()
        //}
        GetMenuList()
    }
    function SetMenuList(expanded, menulist) {
       
        if (localStorage["active"]) {
           
            var active = localStorage["active"]
            angular.forEach(menulist, function (value) {
                if (value.id == active) {
                    value.activeclass = "active-menu"
                }
                else {
                    value.activeclass = ""
                }

            })
        }
        if (expanded != null) {
            angular.forEach(menulist, function (value) {
                var exp = s.expanded[0]
                if (exp == value.id.toString()) {
                    value.isOpen = 1
                    group.push(value.id);
                }
                else {
                    value.isOpen = 0
                }

            })
            return menulist
        }
        else {
            angular.forEach(menulist, function (value) {
                value.isOpen = 0;
            })
            return menulist
        }

        
    }

    init();

    function newEl(tag) {
        return document.createElement(tag);
    }
    function createImageFromRGBdata(rgbData, width, height) {
        var mCanvas = newEl('canvas');
        mCanvas.width = width;
        mCanvas.height = height;

        var mContext = mCanvas.getContext('2d');
        var mImgData = mContext.createImageData(width, height);

        var srcIndex = 0, dstIndex = 0, curPixelNum = 0;

        mContext.putImageData(mImgData, 0, 0);
        return mCanvas;
    }



    //**************************************//
    //********collapse-expand-menu**********//
    //**************************************// 
    s.collapse = function (val, id, hasUrl) {

        if (hasUrl == 1) return
        var menulink = 0
        var menulvl = findMenu(id)[0].menu_level
        if (menulvl == 1) {
            group = new Array()
            group.push(id)
        }
        else {
            var p = group.filter(function (d) {
                return d == id
            })
            if (p == null || p == "") group.push(id)

        }
        var newdata = s.MenuList

        angular.forEach(newdata, function (value) {
            var active = group.filter(function (d) {
                return d == value.id
            })

            if (value.id == id && value.hasUrl == 0) {

                menulink = value.menu_id_link
                if (value.isOpen == 0) {
                    expandedAdd(id, value.menu_level)
                    value.isOpen = 1
                   // h.post("../Menu/expandedAdd", { id: id, menulevel: value.menu_level })
                   
                    // 2019-12-12 : Update for Menu Active the Selected LI
                    $('ul#side-menu li.xx').removeClass('active')
                    var parent_li = $('a#' + id).closest('li')
                    parent_li.addClass('active')
                    // 2019-12-12 : Update for Menu Active the Selected LI

                }
                else {
                    expandedRemove(id)
                    value.isOpen = 0
                  
                   // h.post("../Menu/expandedRemove", { id: id })
                }
               
            }
            else {
                if (active != value.id) value.isOpen = 0
            }
           
           
        })

        //s.MenuList = newdata
    }

    function expandedAdd(id,menulevel) {
           ls = new Array()
        ls2 = new Array()
       
        if (menulevel == 1) localStorage["expanded"] = null;
        var expndd = JSON.parse(localStorage["expanded"])
        if (expndd != null) {
            ls = JSON.parse(localStorage["expanded"]);
            for (var x = 0; x < ls.length; x++) {
                ls2.push(ls[x]);
            }
            
            ls2.push(id);
            localStorage["expanded"] = JSON.stringify(ls2);
        }
        else {
            ls2.push(id);
            localStorage["expanded"] = JSON.stringify(ls2);
        }
    }

    function expandedRemove(id) {
        ls = new Array()
        var expndd = JSON.parse(localStorage["expanded"]);
        if (expndd != null) {
            ls = JSON.parse(localStorage["expanded"]);
            ls = ls.filter(function (d) {
                return d != id
            })
            localStorage["expanded"] = JSON.stringify(ls);
        }
    }
    //***********************Functions end*************************************************************//


    //**************************************//
    //**************find-menu***************//
    //**************************************// 
    var findMenu = function (id) {
        return data = s.MenuList.filter(function (d) {
            return d.id == id
        })
    }
    //***********************Functions end*************************************************************//



    //**************************************//
    //****************log-out***************//
    //**************************************// 
    s.logout = function () {
        h.post("../Login/logout").then(function (d) {
            if (d.data.success == 1) {
                localStorage.clear(); 
                location.href = "../Login/Index"
            }
        })
    }
    //***********************Functions end*************************************************************//


    //**************************************//
    //************location-redirect*********//
    //**************************************// 
    s.setActive = function (lst) {
        h.post("../Menu/UserAccessOnPage", { list: lst }).then(function (d) {

            if (d.data == "success") {
                location.href = "../" + lst.url_name
                //$('.page-wrapper').load("../" + lst.url_name);
            }

        })
        angular.forEach(s.MenuList, function (value) {
            if (value.id == lst.id && value.hasUrl == 1) {
                value.activeclass = "active-menu"
            }
            else {
                value.activeclass = ""
            }
           
        })
        localStorage["active"] = lst.id
    }

    s.CheckSession = function () {

        h.post("../Login/CheckSessionLogin").then(function (d) {
            if (d.data == "expire") {
                location.href = "../Login/Index"


            }
        })

    }

    //***********************Functions end*************************************************************//


})



ng_eRSP_App.directive('employmentType', ["commonScript", '$http', function (cs, http) {
    //************************************// 
    //*** this directive show alert if the value of a input type= number exceed is max or min values on blur
    //************************************// 
    return {
        restrict: 'C',
        link: function (scope, elem, attrs) {
            elem.on('change', function () {
                $("#common_loading_modal").modal("show")
                scope.budget_year = []
                
                var val = this.options[this.selectedIndex].value

                scope.employment_type = val

                http.post("../cApplicantsReview/getBudget_Code", { employment_type: val }).then(function (d) {
                    if (d.data.icon == "success") {
                        scope.budget_year = d.data.budgetyear
                    }
                    else {
                        console.log(d.data.message)
                    }
                    $("#common_loading_modal").modal("hide")
                    
                })
            })
        }
    }
}])



ng_eRSP_App.directive('budgetCode', ["commonScript", '$http', function (cs, http) {

    //************************************// 
    //*** this directive show alert if the value of a input type= number exceed is max or min values on blur
    //************************************// 

    return {
        restrict: 'C',
        link: function (scope, elem, attrs) {
            elem.on('change', function () {
                var val = this.options[this.selectedIndex].value
               
                http.post("../Menu/Budget_Code", { budget_code: val }).then(function (d) {
                    cs.item_nbrs = d.data.item_nbrs
                    scope.budget_code = val
                })
            })
        }
    }
}])