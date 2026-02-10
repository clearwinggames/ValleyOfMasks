var y = 32;

setInterval(function() 
{ 
	clearCanvas();
	drawSolidRectangle(32, y, 32, 32, 'green');
	y++;
}, 30);