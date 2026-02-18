function scene_of_life() {
    
    let renderSprite = new Sprite(64, 64, 32, 32, 'default.png');
    
    let firstGrid = new Grid(-128, -128, 32, 32, 24, 24, new Sprite(0, 0, 32, 32, 'grass32.png'));    
    let secondGrid =  new Grid(64, 128, 32, 32, 8, 8, new Sprite(0, 0, 32, 32, 'redstone32.png'));
    firstGrid.turnBoundsOn(canvas);
    secondGrid.turnCollisionOn([ renderSprite ], (grid, cw, tile) => { console.log('Works: ' + cw.x.toString()); });
    
    return new Array
    (
        firstGrid,
        secondGrid
        ,renderSprite
    );
}