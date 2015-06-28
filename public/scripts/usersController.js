// /public/scripts/usersController.js
(function ( ng, app ) {
	'use strict';
    //function usersController ($scope, $http)
    app.controller('usersController', ['$scope', '$http', '$modal', function ($scope,$http, $modal, $templateCache)
    {
        var graph = null;
        $scope.allowedRoles = ['user-member', 'user-admin', 'user-manager', 'user-exec'];
        $scope.formdata_ = { showDepartment : false,
                            selectedRole : $scope.allowedRoles[1]
        };
        $scope.formData = {};
        $scope.selectedMember = "";
        $scope.message ="Please choose role." + $scope.formdata_.selectedRole;

        $scope.$watch('formdata_.selectedRole', function() {
            if($scope.formdata_.selectedRole == "user-member" || $scope.formdata_.selectedRole == "user-manager"){
                $scope.formdata_.showDepartment = true;
                $scope.message ="You chose "+ $scope.formdata_.selectedRole + " | ShowDepartment=" + $scope.formdata_.showDepartment;
            } else {
               $scope.formdata_.showDepartment = false;
               $scope.message ="You chose "+ $scope.formdata_.selectedRole + " | ShowDepartment=" + $scope.formdata_.showDepartment;
            }
        });
        $scope.loadMemberList = function() {
            $http.get ('/api/members')
            .success(function(data) {
                $scope.members = data;
                console.log(data);
            });
            $http.get ('/galileo/account')
            .success(function(data) {
                $scope.myProfile = data;
                console.log(data);
            });
        };
        $scope.open = function () {
            var modalIns = $modal.open({
                templateUrl: '/partials/myModalContent.ejs',               
                scope: $scope,
                controller: 'ModalInstanceCtrl',
                transclude: false,
            });
            var ModalInstanceCtrl = function ($scope, $modalInstance ) {
                   $scope.submit = function() {
                 alert($scope.myForm.$dirty);
              };
              $scope.ok = function () {
                 $modalInstance.close();
              };
              $scope.cancel = function () {
                 $modalInstance.dismiss('cancel');
              };
            };
        };

        // GET LIST of users ========================================================
/*		$http.get ('/api/members')
            .success(function(data) {
                $scope.members = data;
                console.log(data);
        });
*/		// CREATE ========================================================
        $scope.createMember = function() {
            // validate the formData to make sure that something is there
            // if form is empty, nothing will happen
            // people can't just hold enter to keep adding the same user anymore			
            if($scope.formdata_.selectedRole === "user-manager" || $scope.formdata_.selectedRole === "user-member")
            {
                if ($.isEmptyObject($scope.formData) || $scope.formData.department===null || $scope.formData.location===null) {
                    $scope.message ="Please enter all fields.";
                    return;
                }
            }
            if(validEmail($scope.formData.email)){
                if(validRole($scope.formdata_.selectedRole)) 
                {					
                    var randomstring = Math.random().toString(36).slice(-8);
                    var member = { "email": $scope.formData.email, "department": $scope.formData.department, "location": $scope.formData.location, 
                                  "password": randomstring, "user_group": $scope.formdata_.selectedRole};
                    // call the create function from our service (returns a promise object)	
                    $http.post('/api/members', member)
                            // if successful creation, call our get function to get all the new todos
                         .success(function(data) {
                                $scope.formData.email = ""; // clear the form so our user is ready to enter another							
                                $scope.members = data;      // assign our new list of users
                                $scope.message ="Member was added. You can continue to add more.";
                                $scope.loadMemberList();
                                $scope.drawUsersGraph();
                    });
                } else {
                    $scope.message ="Invalid role.";
                }
            } else {
                    $scope.message ="Invalid email address.";
            }
        };
        // UPDATE ========================================================
        // validate the formData to make sure that something is there
        // if form is empty, nothing will happen
        // people can't just hold enter to keep adding the same user anymore
        $scope.updateMember = function() {
            if (!$.isEmptyObject($scope.formData) && $scope.formData.department!=null && $scope.formData.group!=null) {
                var randomstring = Math.random().toString(36).slice(-8);
                var member = { "email": $scope.formData.email, "department": $scope.formData.department, "location": $scope.formData.location, "password": randomstring, "user_group": $scope.formData.group};
                // call the create function from our service (returns a promise object)	
                $http.post('/api/members', member)
                    // if successful creation, call our get function to get all the new members
                     .success(function(data) {
                            $scope.formData = {}; // clear the form so our user is ready to enter another member
                            $scope.members = data; // assign our new list of members
                            $scope.loadMemberList();
                            $scope.drawUsersGraph();  // TODO : This does not get re-drawn automatically
                    });
            }
        };
        // DELETE ==================================================================
        // delete a user after checking it
        $scope.deleteMemberByEmail = function() {
            if (!$.isEmptyObject($scope.formData)) {
                if($scope.formData.email!=null)
                {
                    $http.delete('/api/members/email/' + $scope.formData.email)
                    // if successful creation, call our get function to get all the new todos
                    .success(function(data) {
                        $scope.formData = {}; // clear the form so our user is ready to enter another		
                        $scope.members = data; // assign our new list of users
                        $scope.loadMemberList();

                    });				
                }
            }
            $scope.drawUsersGraph();			
        };
        $scope.deleteSelectedMember = function() {
            $scope.getSelectedNodeEmail();
            if($scope.selectedMember==null || $scope.selectedMember=="")
            {
                return;
            } else {
                $http.delete('/api/members/email/' + $scope.selectedMember)
                // if successful creation, call our get function to get all the new todos
                .success(function(data) {
                    $scope.members = data; // assign our new list of users			
                });
                $scope.loadMemberList();
                $scope.drawUsersGraph();
            }
        };
        // DELETE ==================================================================
        // delete a user after checking it
        $scope.deleteMember = function(id){
            $http.delete('/api/members/' + id)
                // if successful creation, call our get function to get all the new todos
                .success(function(data){
                    $scope.members = data; // assign our new list of users
                    $scope.loadMemberList();
                    $scope.drawUsersGraph();
                });
        //	$http.get ('/galileo').success(function(data) {});
            //$scope.drawUsersGraph();				
        };
        $scope.drawUsersGraph = function()
        {
            $scope.loadMemberList();
            $scope.AsTable = false;
            //Global variables for graph display
            var my_nodes = [];
            var my_edges = [];

            var id=0;
            var users_dat = $scope.members;
        //		alert("Updating graph !" + users_dat.length);		
            for (var i=0; i<users_dat.length ; i++){
                var userObj = users_dat[i];
                var node = new Object();
                node.id = id;
                node.value = 100;
                node.label = userObj.local.department +" | " + userObj.local.location; // do not append items here as we are currently deleting nodes by label
                node.title = userObj.local.email ; //+ "("+userObj.local.group+")"
                if($scope.myProfile.user.local.email === userObj.local.email)
                {	
                    node.label = node.label + ' [YOU] ';
                }
                var color = new Object();
                var highlight = new Object();
                if(userObj.local.group === "user-admin"){
                    color.border = "white";
                    color.background = "#4c70fd";
                    color.shadow = "white";
                    highlight.border = "#4c70fd";
                    highlight.background = "white";
                    highlight.shadow = "green";
                    color.highlight = highlight;
                    node.shape = "dot";
                //	node.image="../img/user_green.png";
                }
                else if (userObj.local.group === "site-admin"){
                    color.border = "white";
                    color.background = "#C0C0C0";
                    highlight.border = "#C0C0C0";
                    highlight.background = "white";
                    highlight.shadow = "green";
                    color.highlight = highlight;
                    color.shadow = "white";
                    node.shape = "dot";
                //	node.image="../img/user_orange.png";
                }
                else if (userObj.local.group === "user-manager"){
                    color.border = "white";
                    color.background = "#f6695b";
                    highlight.border = "#f6695b";
                    highlight.background = "white";
                    highlight.shadow = "green";
                    color.highlight = highlight;
                    color.shadow = "white";
                    node.shape = "dot";
                //	node.image="../img/user_lightblue_group.png";
                }
                else if (userObj.local.group === "user-exec"){
                    color.border = "white";
                    color.background = "#f6695b";
                    highlight.border = "#f6695b";
                    highlight.background = "white";
                    highlight.shadow = "green";
                    color.highlight = highlight;
                    color.shadow = "white";
                    node.shape = "dot";
            //		node.image="../img/user_green_group.png";
                }
                else {
                    color.border ="white";
                    color.background = "#d2f92b";
                    color.shadow = "white";
                    highlight.border =  "#d2f92b";
                    highlight.background = "white";
                    highlight.shadow = "green";
                    color.highlight = highlight;					
                    node.shape = "dot";
            //		node.image="../img/user_blue.png";
                }
                node.color = color;
                my_nodes.push(node);
                id = id+1;
            }
            var max = users_dat.length;
            var min = 0;

            for(var j = 0; j < users_dat.length; j++)
            {
                var edge = new Object();
                var second = Math.floor(Math.random() * (max - min + 1)) + min;
                if(second === j)
                    continue;
                edge.from = j;
                edge.to = second;
                edge.value = 0;
                edge.title = "{Documents (weekly), Memos (Daily)}";
                if(j%3 ===0) 
                    edge.color = "rgba(57, 247, 86, 0.97)"; //good
                else if(j%2 ===0) edge.color ="#fdf40e" //caution
                else edge.color = "#fd0e3c"; //bad
                edge.style= "line";
                my_edges.push(edge);
            }
             var graph_data = {
                nodes: my_nodes,
                edges: my_edges
             };      
             var options = {
                nodes: {
                  widthMin: 20,  // min width in pixels
                  widthMax: 100,  // max width in pixels
                  blurSize: 0,
                  fontColor:"#2c3e50",
                  fontSize: 10,
                  fontFace: "sans-serif"
                },
                  edges: {
                  color: 'green'
                }
              };
          var container = document.getElementById('mygraph');
          graph = new vis.Graph(container, graph_data, options);		  
        };
        $scope.getSelectedNodeEmail = function()
        {
            var selectionList = graph.getSelection();
            var selectionObjs = graph.getSelectionObjects();
            var i = 0; 
            while(i < selectionList.length)
            {
                var nodeId = selectionList[i];
                var r = confirm('Remove member <' + selectionObjs[nodeId].title + '> permanently?');
                if (r === true) {
                    $scope.selectedMember = selectionObjs[nodeId].title;				
                }
                i++;
            };
        };
        $scope.viewAsTable = function()
        {			
            alert($scope.AsTable);

            $scope.AsTable = true;
            $http.get ('/galileo')
            .success(function(data) {
                $scope.members = data;				
            //	console.log(data);
            });
        }
        $scope.loadMemberList();
        }
    ]);

}) (angular, shrewdApp);