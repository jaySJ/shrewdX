// /public/scripts/controllers.js
/*"use strict";
var ShrewdApp = angular.module('ShrewdApp', []);*/

(function( ng, app ) {
	"use strict";

	app.directive('myslider', function() {
	  return {
	  restrict:'A',
		link: function(scope, elem, attrs) {    
		 scope.$watch("sliderval", function(){
		   $(elem).slider({
		   range: false,
			min: scope.conf_level[0],
			max: scope.conf_level[scope.conf_level.length-1],
			step: 1,
			value: scope.sliderval,
			slide: function( event, ui ) {
				scope.$apply(function() {
					scope.percent = scope.truevalues[ui.value];                
					scope.myOrgProfile.orgprofile.desired_confidence = scope.percent;
					scope.sliderval = ui.value;
					var ss = (scope.Zvalues[ui.value]*scope.Zvalues[ui.value])*0.25/ (0.0001*scope.confInterval*scope.confInterval);
					scope.sampleSize  = ss ;// (1+ ((ss-1)/scope.myOrgProfile.orgprofile.company_strength));
				});
			}});
		 });	
		}
	  };
	});

	app.directive('mysliderpercent', function() {
	  return {
	  restrict:'A',
		link: function(scope, elem, attrs) {
		  
		 scope.$watch("responserate", function(){
		   $(elem).slider({
		   range: false,
			min: 0,
			max: 100,
			step: 5,
			value: scope.responserate,
			slide: function( event, ui ) {
				scope.$apply(function() {
					scope.responserate = ui.value;
					scope.myOrgProfile.orgprofile.likely_response_rate = scope.responserate;
			   });
			}});
		 });	
		}
	  };
	});

	app.directive('googleMaps', function () {
		  return function (scope, elem, attrs) {
			var mapOptions,
			  latitude = attrs.latitude,
			  longitude = attrs.longitude,
			  map;
			latitude = latitude && parseFloat(latitude, 10) || 43.074688;
			longitude = longitude && parseFloat(longitude, 10) || -89.384294;
			mapOptions = {
			  zoom: 8,
			  center: new google.maps.LatLng(latitude, longitude)
			};
			map = new google.maps.Map(elem[0], mapOptions);
		  };
		}); 


	app.directive('draggable', function() {
	  return function(scope, element) {
		// this gives us the native JS object
		var el = element[0];
		
		el.draggable = true;
		
		el.addEventListener(
		  'dragstart',
		 function(e) {
			e.dataTransfer.effectAllowed = 'move';
			e.dataTransfer.setData('Text', this.id);
			this.classList.add('drag');
			return false;
		  },
		  false
		);
		
		el.addEventListener(
		  'dragend',
		  function(e) {
			this.classList.remove('drag');
			return false;
		  },
		  false
		);
	  }
	});

	app.directive('droppable', function() {
	  return {
		scope: {
		  drop: '&',
		  bin: '='
		},
		link: function(scope, element) {
		  // again we need the native object
		  var el = element[0];
		  
		  el.addEventListener(
			'dragover',
			function(e) {
			  e.dataTransfer.dropEffect = 'move';
			  // allows us to drop
			  if (e.preventDefault) e.preventDefault();
			  this.classList.add('over');
			  return false;
			},
			false
		  );
		  
		  el.addEventListener(
			'dragenter',
			function(e) {
			  this.classList.add('over');
			  return false;
			},
			false
		  );
		  
		  el.addEventListener(
			'dragleave',
			function(e) {
			  this.classList.remove('over');
			  return false;
			},
			false
		  );
		  
		  el.addEventListener(
			'drop',
			function(e) {
			  // Stops some browsers from redirecting.
			  if (e.stopPropagation) e.stopPropagation();
			  if (e.stopPropagation) e.preventDefault();
			  
			  this.classList.remove('over');
			  
			  var binId = this.id;
			  
			  // Send ID over dataTransfer.
			  var el = document.getElementById(e.dataTransfer.getData('Text'));
			  // This may prevent dragging between browser tabs and applications...

			  // Need a way to know name of thing in scope we are dragging eg item
			  var nameOfScopeValue = 'item';
			  
			  var scopedDragData = angular.element(el).scope()[nameOfScopeValue];
			  console.log(scopedDragData);

			  this.appendChild(el);
			  // call the passed drop function
			  scope.$apply(function(scope) {
				var fn = scope.drop();
				if ('undefined' !== typeof fn) {            
				  fn(scopedDragData, binId);
				}
			  });
			  
			  return false;
			},
			false
		  );
		}
	  }
	});

/*	app.controller('DragDropCtrl', function($scope) {
	  $scope.handleDrop = function(item, bin) {
	   /* alert('Item ' + item.name + ' has been dropped into ' + bin + '\nThe Cake: '+item.cake());*
	  }
	  $scope.items = [];
	  x = {
		cake: function() {
		  return 'Is not a lie!';
		}
	  };
	  for (var i=0;i<3;i++) {
		var o = { name: 'Item '+i, id: i };
		o.__proto__ = x;
		 $scope.items.push(o); 
	  }
	});
*/
	// directive for dnd between lists
/*	app.directive('dndBetweenList', function($parse) {

		return function(scope, element, attrs) {
			 // contains the args for this component
			var args = attrs.dndBetweenList.split(',');
			// contains the args for the target
			var targetArgs = $('#'+args[1]).attr('dnd-between-list').split(',');
			 
			// variables used for dnd
			var toUpdate;
			var target;
			var startIndex = -1;
			var toTarget = true;
	 
			// watch the model, so we always know what element
			// is at a specific position
			scope.$watch(args[0], function(value) {
				toUpdate = value;
			},true); 
			// also watch for changes in the target list
			scope.$watch(targetArgs[0], function(value) {
				target = value;
			},true);		
		
			// use jquery to make the element sortable (dnd). This is called
			// when the element is rendered
			$(element[0]).sortable({
				items:'li',
				start:function (event, ui) {
					// on start we define where the item is dragged from
					startIndex = ($(ui.item).index());
					toTarget = false;
				},
				stop:function (event, ui) {
					var newParent = ui.item[0].parentNode.id;
	 
					// on stop we determine the new index of the
					// item and store it there
					var newIndex = ($(ui.item).index());
					var toMove = toUpdate[startIndex];
	 
					// we need to remove him from the configured model
					toUpdate.splice(startIndex,1);
					
					if (newParent == args[1]) {
						// and add it to the linked list
						target.splice(newIndex,0,toMove);
					}  else {
						toUpdate.splice(newIndex,0,toMove);
					} 
					// we move items in the array, if we want
					// to trigger an update in angular use $apply()
					// since we're outside angulars lifecycle
					scope.$apply(targetArgs[0]);	
					scope.$apply(args[0]);
					scope.$apply(targetArgs[1]);	
					scope.$apply(args[1]);
				},
				connectWith:'#'+args[1]
			});
		}
	});*/
}) (angular, shrewdApp);