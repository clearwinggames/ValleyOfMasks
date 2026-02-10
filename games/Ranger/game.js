let is_game_setup = false;

function first_scene() {	
    let firstGrid = new Grid(-128, -128, 32, 32, 24, 24, new Sprite(0, 0, 32, 32, 'default.png'));    
    let secondGrid =  new Grid(64, 128, 32, 32, 8, 8, new Sprite(0, 0, 32, 32, 'altdefault.png'));
    secondGrid.turnCollisionOn([{ 'x': 128, 'y': 128, 'w':32, 'h':32 }]);
    
    return new Array
    (
        firstGrid, 
        secondGrid
    );
}
function reset_game() {

    turnOffAutosave();
    
    setVariable('Hitpoints', 40);
    setVariable('Money', 100);
    setVariable('EXP', 0);
    setVariable('MP', 20);
    setVariable('Location', 'Earth');
    setVariable('NewGamePlus', 'False');
    setVariable('Character', { 'Name': 'Ranger', 'Department': 'IT' });
}
function setup_game() {
    reset_game();

    let firstscene = first_scene();
    if (firstscene.length > 1) console.log('Multiple entities found in first scene');

    loadNewScene(firstscene);   

    //turnOnAutosave('Ranger');

    //if (is_game_setup == false)
    //    tryLoadGame();

    is_game_setup = true;
}



setInterval(function() 
{ 
    // game loop here.    
    if (!is_game_setup) { setup_game(); }
    
    standardDrawLoopBegin();

    drawCurrentScene();
    
    drawBigString('Hitpoints: ' + getVariable('Hitpoints'), 16, 32);
    drawBigString('Money: ' + getVariable('Money'), 16, 64);
    drawBigString('EXP: ' + getVariable('EXP'), 16, 96);
    drawBigString('MP: ' + getVariable('MP'), 16, 128);    
    drawBigString('Character: ' + getVariable('Character').Name + '; ' + getVariable('Character').Department + '.', 16, 160);
    drawBigString('Location: ' + getVariable('Location'), 16, 192);
    drawBigString('NewGamePlus: ' + (getVariable('NewGamePlus') == true ? 'Yes' : 'No'), 16, 224);

    standard_game_logic();
    
}, 30);

function standard_game_logic() {
    if (leftkey()) {
        moveCurrentSceneBy(4, 0);
    }
    if (rightkey()) {
        moveCurrentSceneBy(-4, 0);
    }
    if (upkey()) {
        moveCurrentSceneBy(0, 4);
    }
    if (downkey()) {
        moveCurrentSceneBy(0, -4);
    }
}


