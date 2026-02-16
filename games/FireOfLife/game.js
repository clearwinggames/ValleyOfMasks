
let canvas = document.getElementById('gameCanvas');
canvas.style.height = '480px';
canvas.style.width = '600px';
canvas.height = 160;
canvas.width = 200;

let first_scene = () => {
    
    let renderSprite = new Sprite(128, 128, 32, 32, 'default.png');
    
    let firstGrid = new Grid(-128, -128, 32, 32, 24, 24, new Sprite(0, 0, 32, 32, 'grass32.png'));    
    let secondGrid =  new Grid(64, 128, 32, 32, 8, 8, new Sprite(0, 0, 32, 32, 'dirt32.png'));
    firstGrid.turnBoundsOn(canvas);
    secondGrid.turnCollisionOn([ renderSprite ]);
    
    return new Array
    (
        firstGrid, 
        secondGrid,
        renderSprite
    );
};





setTimeout(() => {
    loadNewScene(first_scene());
    
    keydownActions.push({ name: 'one', keyval: 'up', action: () => { moveCurrentSceneBy(0, 4); } });
    keydownActions.push({ name: 'two', keyval: 'down', action: () => { moveCurrentSceneBy(0, -4); } });
    keydownActions.push({ name: 'three', keyval: 'left', action: () => { moveCurrentSceneBy(4, 0); } });
    keydownActions.push({ name: 'four', keyval: 'right', action: () => { moveCurrentSceneBy(-4, 0); } });
    
    startGameLoop();
}, 500);











