//Global variables for graph display
var my_nodes = null;
var my_edges = null;
var graph = null;
var nodeid = 300;

function drawGraph() {
	//create graph
	var container = document.getElementById('mygraph');
	var graph_data = {
		nodes: my_nodes,
		edges: my_edges
	};      
	var options = {
	nodes: {
      widthMin: 20,  // min width in pixels
      widthMax: 100,  // max width in pixels
	  blurSize: 9
    },
    edges: {
      color: 'green'
    }
  };
  graph = new vis.Graph(container, graph_data, options);
}

loadGraph = function(file) {
var mygraph = null;
   $.getJSON(file, function(data){
      var items = [];
      my_nodes = data.graph.nodes;
      my_edges = data.graph.edges;
   /*   $.each( my_nodes, function( id, nodeObj){
         items.push( "<li id='" + id + "'> Node #" + nodeObj.id + " : " + nodeObj.label + " : " + nodeObj.image + " : " + nodeObj.shape + "</li>" );
      });
      $.each( my_edges, function(id, edgeObj){
         items.push( "<li id='" + edgeObj.color + "'>" + edgeObj.from +  "->>" + edgeObj.to + " : "+ edgeObj.label + "</li>" );
      });	*/
      drawGraph();  
   });
};
addNode = function(){
	var node = new Object();
	node.id = nodeid;
	node.value = 50;
	node.label ="Node_"+nodeid;
	node.shape = "circle";	
	my_nodes.push(node);
	nodeid++;
	drawGraph();
};
removeNode = function(){
	var node = new Object();
	node.id = 300;
	node.value = 50;
	node.label ="Node_"+nodeid;
	node.shape = "circle";
	var index = my_nodes.indexOf(node);	
	if (index > -1) {
		array.splice(index, 1);
		}
	drawGraph();
};
drawGraphFromFile = function(file) {
	loadGraph(file);
};
