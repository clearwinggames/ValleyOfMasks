
let canvas = document.getElementById('gameCanvas');
canvas.style.height = '480px';
canvas.style.width = '600px';
canvas.height = 160;
canvas.width = 200;

loadScript(location.href.split(location.pathname)[0] + location.pathname.replace('Default.html', '') + '/lib/Shared_Lib/components2d/scene_of_life.js').then(x => {
  setTimeout(() => {
    loadNewScene(scene_of_life());
    
    keydownActions.push({ name: 'one', keyval: 'up', action: () => { moveCurrentSceneBy(0, 4); } });
    keydownActions.push({ name: 'two', keyval: 'down', action: () => { moveCurrentSceneBy(0, -4); } });
    keydownActions.push({ name: 'three', keyval: 'left', action: () => { moveCurrentSceneBy(4, 0); } });
    keydownActions.push({ name: 'four', keyval: 'right', action: () => { moveCurrentSceneBy(-4, 0); } });
    
    startGameLoop();
  }, 500);
});
