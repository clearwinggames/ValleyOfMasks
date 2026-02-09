var y = 32;

var activeWaveNumber = 0;
var activeThreats = [];
var maxLevel = 6;
var gameHeight = 270;

setInterval(function() 
{ 
	standardDrawLoopBegin();
	//drawSolidRectangle(32, y, 32, 32, 'green');
	//y++;
	if (activeWaveNumber == 0) 
	{
		GetNewExpiringMessage('Click the threat-fetti!', 32, 32, 250);
		
		setupWave(1);
	}
	for (let i = 0; i < activeThreats.length; i++)
	{
		activeThreats[i].update();
		if (activeThreats[i].stopped === false)
			drawSolidRectangle(activeThreats[i].x, activeThreats[i].y, 16, 16, activeThreats[i].color);
	}
	
	drawSolidRectangle(0, (gameHeight - 1)+16, 400, 2, 'black');
	
}, 30);

document.getElementById('gameCanvas').addEventListener('mousedown', function(e) 
{
	let gc = document.getElementById('gameCanvas');
	let allOverlapping = getAllThreatsOverlapping(gc.lastClickedX, gc.lastClickedY);
	if (allOverlapping.length > 0) allOverlapping[0].stop();
	/*for (let i = 0; i < allOverlapping.length; i++)
	{
		allOverlapping[i].stop();
	}*/
})

function getAllThreatsOverlapping(x, y)
{
	let overlapping = [];
	for(let i = 0; i < activeThreats.length; i++)
	{
		if (activeThreats[i].stopped === false && overlaps(x, y, activeThreats[i]) == true)
		{
			overlapping.push(activeThreats[i]);
		}
	}
	return overlapping;
}
function overlaps(x, y, threat)
{
	let r = threat.x + 16;
	let b = threat.y + 16;
	if ((x > threat.x && x < r) && (y > threat.y && y < b))
	{
		return true;
	}
	return false;
}

function setupWave(level)
{
	activeWaveNumber = level;
	
	activeThreats = [];
	let threatCount = ((level - 1) * 2) + 2;

	// each missile needs a starting point and a target point so it can move along a straight line
	for(let i = 0; i < threatCount; i++)
	{
		activeThreats.push(new Threat());
		activeThreats[activeThreats.length - 1].color = getColor(i);
		activeThreats[activeThreats.length - 1].level = level;
		activeThreats[activeThreats.length - 1].startX = (Math.random() * 200) + 50;
		activeThreats[activeThreats.length - 1].x = activeThreats[activeThreats.length - 1].startX;
		activeThreats[activeThreats.length - 1].endX = (Math.random() * 200) + 50;
	}	
}
function getColor(number){
	if (number === 0) return 'red';
	else if (number === 1) return 'green';
	else if (number === 2) return 'blue';
	else if (number === 3) return 'yellow';
	else if (number === 4) return 'magenta';
	else if (number === 5) return 'orange';
	else if (number === 6) return 'cyan';
	else if (number === 7) return 'violet';
	else if (number > 7) {
		return getColor(number - 7);
	}
	else {
		return getColor(number + 7);
	}
}
function isWaveOver(){
	let waveIsOver = true;
	
	for(let i = 0; i < activeThreats.length; i++)
	{
		if (activeThreats[i].stopped === false && activeThreats[i].y < activeThreats[i].endY) 
		{
			return false;
		}
	}
	return waveIsOver;
}
function allThreatsStopped()
{
	for(let i = 0; i < activeThreats.length; i++)
	{
		if (activeThreats[i].stopped === false) 
		{
			return false;
		}
	}
	return true;
}
function Threat()
{
   this.color = '';
   this.level = 0;
   this.movements = 0;
   this.x = 0; 
   this.y = 0;
   this.startX = 0;
   this.startY = 0;
   this.endX = 0;
   this.endY = gameHeight;
   this.stopped = false;
   this.step = function() {
	   return parseFloat(750 / this.level);
   },
   this.stop = function() {
	   this.stopped = true;
   },
   this.update = function() {
		// use movements count to calculate x and y.
		if (this.stopped !== false) 
		{
			
		}
		else 
		{
			let deltaY = parseFloat(this.endY - this.startY) / parseFloat(600 / this.level);
			let deltaX = this.endX >= this.startX ? ( parseFloat(this.endX - this.startX) / this.step() ) : ( parseFloat(this.startX - this.endX) / this.step() );
			//let deltaY = ;
			this.y += deltaY;
			this.x += (this.endX >= this.startX ? deltaX : -deltaX);
			
			this.movements++;
		}
		
		if (isWaveOver() && this.level <= (maxLevel - 1))
		{
			if (allThreatsStopped()) 
			{
				if (maxLevel == this.level + 1) {
					GetNewExpiringMessage('Final Level!', 16, 16, 100);
				}
				else {
					GetNewExpiringMessage('Level ' + (this.level + 1), 16, 16, 50);
				}
				setupWave(this.level + 1);
			}
			else 
			{
				setupWave(0);

				GetNewExpiringMessage('You Lose!', 32, 16, 100);
			}
		}
		else if (isWaveOver() && this.level ==  maxLevel)
		{
			if (allThreatsStopped()) 
			{				
				GetNewExpiringMessage('You Win!  Take your screenshots now', 32, 16, 100);
				setTimeout(() => {
					setupWave(0);
				}, 15000);
			}
			else 
			{
				setupWave(0);

				GetNewExpiringMessage('You Lose!', 32, 16, 100);
			}
		}
   }	   
};