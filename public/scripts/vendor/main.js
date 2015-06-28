window.onload = function()
{ 
  var elements = document.getElementsByClassName('qtrGraphLnk');
  for(var i = 0, length = elements.length; i < length; i++) {
    elements[i].onmouseover = function() {
     this.style.backgroundColor = 'grey';
    };
    elements[i].onmouseout = function() {
     this.style.backgroundColor = '';
    };
    elements[i].style.cursor = 'pointer';   
  }  
};

getLeadershipContent = function()
{
	document.getElementById("mygraph").innerHTML = "<b>Leadership Selected!!</b>";
};
getSurveyContent = function()
{
	document.getElementById("mygraph").innerHTML = "<b>Surveys Selected!!</b>";	
};
editProfile = function()
{
     document.getElementById("mygraph").innerHTML = '<b>Edit Profile <b>';
};
shrewdLogo = function()
{	
	  var canvas = document.getElementById('myCanvas');
      var context = canvas.getContext('2d');
      var rectWidth = 40;
      var rectHeight = 25;

      // shear matrix:
      //  1  sx  0
      //  sy  1  0
      //  0  0  1

      var sx = 1;
      // .75 horizontal shear
      var sy = 0;
      // no vertical shear
	var margin = 2;
	
	context.shadowBlur = 15;
	context.shadowColor = "grey";
	context.save();
	// apply custom transform     
	
	// rotate 45 degrees clockwise
	context.rotate(-Math.PI / 4);
	
	// translate context to center of canvas
	context.translate(-canvas.width / 2, canvas.height / 4);
	
		context.save();
		      // translate context to center of canvas
		      context.translate(canvas.width / 2 *1.25, canvas.height / 4);
		
		      // apply custom transform
		      context.transform(1, sy, sx, 1, 0, 0);
		
		      context.fillStyle = '#ffb400';
		      context.fillRect(-2*rectWidth, -rectHeight, rectWidth-margin , rectHeight);
		      context.fillStyle = '#4d80fb';
		      context.fillRect(-rectWidth, 0, rectWidth-margin , rectHeight);
		      context.fillStyle = '#4d80fb';
		      context.fillRect(0, 0, rectWidth-margin , rectHeight);
		      context.fillStyle = '#9df605';
		      context.fillRect(-rectWidth, -rectHeight, rectWidth-margin , rectHeight);
		      context.fillStyle = '#9df605';
		      context.fillRect(-2*rectWidth, 0*rectHeight, rectWidth-margin , rectHeight);		      
		context.restore();
		
		context.save();
		     // translate context to center of canvas
		      context.translate(canvas.width / 2 *1.25, 1.35*canvas.height / 4);
		
		     // flip context horizontally
		      context.scale(1,-1);
		
		      // apply custom transform
		      context.transform(1, sy, sx, 1, 0, 0);
		
		      context.fillStyle = '#ffb400';
		      context.fillRect(-2*rectWidth, -rectHeight, rectWidth-margin , rectHeight);
		      context.fillStyle = '#4d80fb';
		      context.fillRect(-rectWidth, 0, rectWidth-margin , rectHeight);
		      context.fillStyle = '#4d80fb';
		      context.fillRect(0, 0, rectWidth-margin , rectHeight);
		      context.fillStyle = '#9df605';
		      context.fillRect(-rectWidth, -rectHeight, rectWidth-margin , rectHeight);
		      context.fillStyle = '#9df605';
		      context.fillRect(-2*rectWidth, 0*rectHeight, rectWidth-margin , rectHeight);		     
		context.restore();
		
	context.restore();

};
