

let first_scene = () => {
    let firstGrid = new Grid(-128, -128, 32, 32, 24, 24, new Sprite(0, 0, 32, 32, 'default.png'));    
    let secondGrid =  new Grid(64, 128, 32, 32, 8, 8, new Sprite(0, 0, 32, 32, 'altdefault.png'));
    secondGrid.turnCollisionOn([{ 'x': 128, 'y': 128, 'w':32, 'h':32 }]);
    
    return new Array
    (
        firstGrid, 
        secondGrid
    );
};


loadNewScene(first_scene());

keydownActions.push({ name: 'one', keyval: 'up', action: () => { alert('up'); } });

startGameLoop();
