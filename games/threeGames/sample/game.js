let coordsStart = { x: 0, y: 0, z: 0 };
let dimensions = { x: 1, y: 1, z: 1 };
function first_scene() { 
	let fs = [


new Grid3D(coordsStart.x, -1, 1, dimensions.x, dimensions.y, dimensions.z, 14, 12, 13)
	.drawSolidCube(0, 0, 0, 14, 1, 12, 
				new Sprite(0, 0, 32, 32, 'brickx.png')),
	
new Grid3D(coordsStart.x, -1, coordsStart.z, dimensions.x, dimensions.y, dimensions.z, 12, 12, 12)
	.drawSolidCube(3, 1, 3, 4, 1, 1, 
				   new Sprite(0, 0, 32, 32, 'brickx.png')),

new Grid3D(coordsStart.x, -1, coordsStart.z, dimensions.x, dimensions.y, dimensions.z, 12, 12, 12)
	.drawSolidCube(5, 1, 5, 1, 1, 1, 
				   new Sprite(0, 0, 32, 32, 'kioskx.png'))	
	
//new Grid3D(0, 0, 0, 1, 1, 1, 1, 1, 1).drawSolidCube(0, 0, 0, 1, 1, 1, new Sprite(0, 0, 32, 32, 'kioskx.png'))
//new Grid3D(0, 1, 0, 1, 1, 1, 12, 12, 12).drawSolidCube(3, 1, 3, 4, 4, 4, new Sprite(0, 0, 32, 32, 'kioskx.png')) 

];

		let otherPlat = new CubePlane(7, -0.5, 7, 1, 1, 1, new Sprite(0,0,32,32,'kioskx.png'));
	
	otherPlat.wireEventFor((plat) => {
alert('bing');
	});

	fs[2].wireEventFor(1, 1, 1, () => 
	{
		let midText = document.getElementById('midText');

		const iframe = document.createElement("iframe");

		iframe.src = "https://clearwinggames.github.io/xcdn/DynamicStatic/Main#/"; // Replace with your URL
		iframe.width = "100%";
		iframe.height = "400px";
		iframe.style.border = "none"; // Remove the default border

		midText.appendChild(iframe);
	});
	fs.push(otherPlat);
	return fs;
}

newThreeScene(first_scene()).then(s1 => 
{
	//turnOnAutosave('sample-game');

	//tryLoadGame('sample-game');

	setTimeout(() => {
		startGameLoop();
	}, 1000);
});
