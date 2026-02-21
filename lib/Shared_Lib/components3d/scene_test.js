let coordsStart = { x: 0, y: 0, z: 0 };
let dimensions = { x: 1, y: 1, z: 1 };

function alternate_first_scene() {
	let floor = new Grid3D(coordsStart.x, -1, 1, dimensions.x, dimensions.y, dimensions.z, 14, 12, 13)
	.drawSolidCube(0, 0, 0, 14, 1, 12, new Sprite(0, 0, 32, 32, 'grassx.png'));
	let outerwall1 = new Grid3D(coordsStart.x, 0, coordsStart.z, dimensions.x, dimensions.y, dimensions.z, 1, 1, 14)
	.drawSolidCube(0, 0, 0, 1, 1, 14, new Sprite(0, 0, 32, 32, 'brickx.png'));
	let fs = [ 
				floor,
				outerwall1
		];
	
	setTimeout(() => {
		setSkyColorToString('#007fff');
	}, 1000);
	return fs;
}

