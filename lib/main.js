let mainDiv = document.getElementById('main');

let gameScript = document.createElement('script');

gameScript.type = 'text/javascript';

let gameName = new URL(window.location.href).searchParams.get("game");

if (gameName == null) alert('Please provide "game" url parameter.');

if (gameName.indexOf('threeGames') == 0)
{	
   let threeScript = document.createElement('script');
   
   threeScript.type = 'text/javascript';
   
   threeScript.src = './lib/three/three.js';

   threeScript.onload = () => 
   {
	let supportScripts = [ "models", "support"];
	for (let i = 0; i < supportScripts.length; i++) 
	{
		let supportScript = document.createElement('script');

		supportScript.type = 'text/javascript';
		supportScript.id = supportScripts[i] + "_script";
		supportScript.src = './lib/' + supportScripts[i] + '.js';

		mainDiv.appendChild(supportScript);
	}
	supportScripts = [ "models", "support"];
	for (let i = 0; i < supportScripts.length; i++) 
	{
		let supportScript = document.createElement('script');

		supportScript.type = 'text/javascript';
		supportScript.id = supportScripts[i] + "_script";
		supportScript.src = './lib/three/' + supportScripts[i] + '.js';

		mainDiv.appendChild(supportScript);
	}
	setTimeout(() => { 	 
	        gameScript.src = './games/' + gameName + '/game.js';

		mainDiv.appendChild(gameScript);
	}, 500);
   };
   
   mainDiv.appendChild(threeScript);   	   
	
}
else 
{
	
let canvas = document.createElement('canvas');

canvas.id = 'gameCanvas';
canvas.width = 800;
canvas.height = 600;

canvas.lastClickedX = 0;
canvas.lastClickedY = 0;

mainDiv.appendChild(canvas);

canvas.addEventListener('mousedown', function(e) 
{
    var position = getCursorPosition(canvas, e);
	canvas.lastClickedX = position.x;
	canvas.lastClickedY = position.y;	
})

gameScript.src = './games/' + gameName + '/game.js';

mainDiv.appendChild(gameScript);

	let supportScripts = [ "models", "support" ];
	for (let i = 0; i < supportScripts.length; i++) 
	{
		let supportScript = document.createElement('script');

		supportScript.type = 'text/javascript';
		supportScript.id = supportScripts[i] + "_script";
		supportScript.src = './lib/' + supportScripts[i] + '.js';

		mainDiv.appendChild(supportScript);
	}
}
