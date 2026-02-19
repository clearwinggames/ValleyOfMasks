function scene_of_life() {
    
    let renderSprite = new Sprite(64, 64, 32, 32, 'default.png');

    renderSprite.turnOnGravityRelative(-0.1, -2);
    renderSprite.prependBehavior((me) => { console.log('logged'); });
    renderSprite.appendBehavior((me) => { console.log('also'); });
    
    let waterSprite = new Sprite(0, 0, 32, 32, 'whatever.png');
    waterSprite.turnOnAnimation([
        'water1.png', 'water2.png', 'water3.png', 'water4.png',
        'water5.png', 'water6.png', 'water7.png', 'water8.png',
        'water9.png', 'water10.png', 'water11.png', 'water12.png',
        'water13.png', 'water14.png', 'water15.png'
    ], 300);
    
    let firstGrid = new Grid(-128, -128, 32, 32, 24, 24, new Sprite(0, 0, 32, 32, 'grass32.png'));    
    let secondGrid =  new Grid(64, 128, 32, 32, 8, 8, waterSprite);
    firstGrid.turnBoundsOn(canvas);
    secondGrid.turnCollisionOn([ renderSprite ], (grid, cw, tile) => { console.log('Works: ' + cw.x.toString()); });

    keydownActions.push({ name: 'five', keyval: 'j', action: () => { renderSprite.momentumY = 4; } });
    
    return new Array
    (
        firstGrid,
        secondGrid
        ,renderSprite
    );

}

















