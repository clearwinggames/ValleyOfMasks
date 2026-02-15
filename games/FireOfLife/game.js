

let first_scene = () => {
    let firstGrid = new Grid(-128, -128, 32, 32, 24, 24, new Sprite(0, 0, 32, 32, 'grass32.png'));    
    let secondGrid =  new Grid(64, 128, 32, 32, 8, 8, new Sprite(0, 0, 32, 32, 'dirt32.png'));
    secondGrid.turnCollisionOn([{ 'x': 128, 'y': 128, 'w':32, 'h':32 }]);
    
    return new Array
    (
        firstGrid, 
        secondGrid
    );
};


loadNewScene(first_scene());

keydownActions.push({ name: 'one', keyval: 'up', action: () => { moveCurrentSceneBy(0, -4); } });
keydownActions.push({ name: 'two', keyval: 'down', action: () => { moveCurrentSceneBy(0, 4); } });
keydownActions.push({ name: 'three', keyval: 'left', action: () => { moveCurrentSceneBy(-4, 0); } });
keydownActions.push({ name: 'four', keyval: 'right', action: () => { moveCurrentSceneBy(4, 0); } });

startGameLoop();


