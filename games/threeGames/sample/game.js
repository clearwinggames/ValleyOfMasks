
newThreeScene(
[ 
new Grid3D(0, -1, 1, 1, 1, 1, 14, 12, 13).drawSolidCube(0, 0, 0, 14, 1, 12, new Sprite(0, 0, 32, 32, 'default.png')),
new Grid3D(0, -1, 0, 1, 1, 1, 12, 12, 12).drawSolidCube(3, 1, 3, 4, 1, 1, new Sprite(0, 0, 32, 32, 'default.png')),
new Grid3D(0, 1, 0, 1, 1, 1, 12, 12, 12).drawSolidCube(3, 1, 3, 4, 4, 4, new Sprite(0, 0, 32, 32, 'default.png')) 

]).then(s1 => 
{
	//turnOnAutosave('sample-game');

	//tryLoadGame('sample-game');
			
	startGameLoop();
});