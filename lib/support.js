var gameVariables = [];

var autoSave = false;

var nameOfGame = '/lib/content/';

var activeScene = [];

var loadedScripts = [];

var temporaryFunctions = [];

let contentLibPath = '';

function execFnByName(fnName) {
	if (temporaryFunctions.filter(fn => fn.name == fnName).length > 0) {
		let fnObject = temporaryFunctions.filter(fn => fn.name == fnName)[0];
		if (fnObject != null && typeof fnObject.action != 'undefined' && fnObject.action != null) 
			fnObject.action();
	}
	else {
		console.log('Temporary Function ' + fnName + ' not found.');
	}
}
function addTemporaryFunction(fnName, fn) {
	if (temporaryFunctions.filter(f => f.name == fnName).length == 0) {
		temporaryFunctions.push
		({
			'name': fnName, 
			'action': fn,
		});
	}
	else // get it and update the action
	{
		temporaryFunctions.filter(f => f.name == fnName)[0].action = fn;
	}
}

var keydown = { }; 
window.onkeyup = function(e) { keydown[e.keyCode] = false; }
window.onkeydown = function(e) { keydown[e.keyCode] = true; }
window.onclick = function(e) { keydown[e.which] = true; }

function loadNewScene(new_scene_content) {
	activeScene = [];
	for(let i = 0; i < new_scene_content.length; i++) {
		activeScene.push(new_scene_content[i]);
	}
}
function drawCurrentScene() {
	for (let i = 0; i < activeScene.length; i++) {
		activeScene[i].render();
	}
	if (activeScene.length == 0) console.log('No members found in scene');
}
function moveCurrentSceneBy(xAmt, yAmt) {
	for (let i = 0; i < activeScene.length; i++) {
		if (typeof activeScene[i].supportCollision != 'undefined' && activeScene[i].supportCollision == true) {
			// would collision happen?  if so, return
			if (activeScene[i].wouldCauseCollision(xAmt, yAmt)) return;
		}
	}
	for (let i = 0; i < activeScene.length; i++) {
		activeScene[i].x += xAmt;
		activeScene[i].y += yAmt;
	}
}
function updateCurrentScene() {
	// logic within elements
	for (let i = 0; i < activeScene; i++) {
		activeScene[i].update();
	}
}
function turnOnAutosave(game_name){
	if (game_name == null || game_name.length == 0) 
	{
		alert('Cannot Turn On Autosave without valid Game');
	}
	else 
	{
		nameOfGame = game_name;
		autoSave = true;
	}
}
function turnOffAutosave() {
	autoSave = false;
}
function createGameVariable(variableName, initialValue) {
	gameVariables.push({ 'Key': variableName, 'Value': initialValue});
}
function getVariable(variableName) {
	for(let i = 0; i < gameVariables.length; i++) {
		if (gameVariables[i].Key == variableName) return gameVariables[i].Value;
	}
	//alert('[ERROR: Variable ' + variableName + ' not found.]');
	return '[[ERROR]: Variable ' + variableName + ' not found.]';
}
function setVariable(variableName, newValue) {
	let found = false;
	for(let i = 0; i < gameVariables.length; i++) {
		if (gameVariables[i].Key == variableName) {
			found = true;
			gameVariables[i].Value = newValue;
		}
	}
	if (found == false) {
		createGameVariable(variableName, newValue);
	}
	if (autoSave == true) {
		saveGame(nameOfGame);		
	}
}
function quietSetVariable(variableName, newValue) {
	let found = false;
	for(let i = 0; i < gameVariables.length; i++) {
		if (gameVariables[i].Key == variableName) {
			found = true;
			gameVariables[i].Value = newValue;
		}
	}
	if (found == false) {
		createGameVariable(variableName, newValue);
	}
}

function getContext2D(){
	return document.getElementById('gameCanvas').getContext('2d');
}

function drawSolidRectangle(x, y, w, h, color)
{
	let ctx = getContext2D();
	ctx.fillStyle = color;
	ctx.fillRect(x, y, w, h);		
	ctx.fillStyle = 'black';
}
function standardDrawLoopBegin(){
	clearCanvas();
	renderTemporaryMessages();
}
function clearCanvas()
{
	let ctx = getContext2D();
	ctx.clearRect(0, 0, 800, 600);
}

function getCursorPosition(canvas, event) {
    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    console.log("x: " + x + " y: " + y)
    return { "x": x, "y": y };
}
function drawImage(x, y, imagePath) {
	let ctx = getContext2D();
	// get the image from HTML
	let image = new Image();
	
	if (location.origin.indexOf('file') == 0) {
		image.src = location.pathname.replace('Default.html', '') + contentLibPath + imagePath;
	}
	else {
		image.src = location.href.replace('Default.html', contentLibPath + imagePath);
	}
	console.log('Drawing image ' + image.src);
	ctx.drawImage(image, x, y);
}
function drawString(caption, x, y)
{
	let ctx = getContext2D();
	ctx.font = '16px sans';
        ctx.fillText(caption, x, y);
}	
function drawBigString(caption, x, y)
{
	let ctx = getContext2D();
	ctx.font = '24px sans';
    	ctx.fillText(caption, x, y);
}
var temporaryMessages = [];

function renderTemporaryMessages()
{
	for(let i = 0; i < temporaryMessages.length; i++) 
	{
		if (temporaryMessages[i].duration <= 0) 
		{
			temporaryMessages.splice(i, 1);
		}
	    else 
		{
			temporaryMessages[i].render();
		}
	}
}

function GetNewExpiringMessage(caption, x, y, duration)
{
  let newExpiring = new ExpiringMessage();

  newExpiring.x = x;
  newExpiring.y = y;
  newExpiring.caption = caption;
  newExpiring.duration = duration;
  
  return newExpiring;
}

function ExpiringMessage()
{
	temporaryMessages.push(this);
		
	this.caption = '';
	this.duration = 0;
	this.x = 0;
	this.y = 0;
	this.render = function() 
	{
		if (this.duration <= 0)
		{
			
		}
		else 
		{
			drawString(this.caption, this.x, this.y);
			this.duration--;
		}
	};
}
function isNumeric(inputChar) {
	let charCode = inputChar.toString().charCodeAt(0);
	if (charCode >= 48 && charCode <= 57) return true;
	return false;
}
function isNumericPlus(inputChar) {
	// include minus sign and decimals
	if (isNumeric(inputChar)) return true;
	if (inputChar.toString().charCodeAt(0) == 109 || inputChar.toString().charCodeAt(0) == 110) return true;
	return false;
}
function isStringNumeric(inputString){
	if (inputString.length == 0) return false;
	for (let i = 0; i < inputString.length; i++) {
		if (!isNumeric(inputString.charAt(i))) return false;
	}
	return true;
}
function isStringNumericPlus(inputString) {
	if (inputString.length == 0) return false;
	for (let i = 0; i < inputString.length; i++) {
		if (!isNumericPlus(inputString.charAt(i))) return false;
	}
	return true;
}
function saveGame(gameName) {
	commitGameSave(gameName, gameVariables);
}
function commitGameSave(gameName, gameSaveDictionary) {
	let gameSaveObject = constructGameSaveObject(gameName, gameSaveDictionary);	
	let saveGameUrl = location.origin + '/api/games/saveGameState';
	JSON.stringify(gameSaveObject);
	httpPost(saveGameUrl, gameSaveObject).then(x => console.log('Game Save Results: ' + x));
}
function constructGameSaveObject(gameName, gameSaveDictionary) {
	let gameSaveObject = { 'GameName': gameName, 'SaveData': []  };
	for(let i = 0; i < gameSaveDictionary.length; i++)
	{
	   let data = gameSaveDictionary[i].Value;
	   let dataType = ((data.toString().toLowerCase() == 'true' || data.toString().toLowerCase() == 'false') ? 'BOOLEAN' : 
				((isStringNumeric(data.toString())) ? 'INTEGER' : 
				  ((isStringNumericPlus(data.toString())) ? 'FLOAT' :
					(data.constructor == Object ? 'JSON' : 'STRING')
				  ))
			  );	   
	   gameSaveObject.SaveData.push({ 'DataName': gameSaveDictionary[i].Key, 'Data': (dataType == 'JSON' ? JSON.stringify(data) : data), 'DataType': dataType });
	}
	return gameSaveObject;
}
function tryLoadGame() {
	try {
		loadGame(nameOfGame);
	}
	catch (err) {
		// can't do it??
		console.log('Load failed: ' + err);
	}
}
function loadGame(gameName) {
	retrieveGameSave(gameName);
}
function retrieveGameSave(gameName) {
	let loadGameUrl = location.origin + '/api/games/loadGameState?gameName=' + gameName;
	httpGet(loadGameUrl).then(x => updateGameVariables(JSON.parse(x)));
}
function updateGameVariables(newGameVariables) {
	for (let i = 0; i < newGameVariables.saveData.length; i++) {
		if (newGameVariables.saveData[i].dataType == '4')
			quietSetVariable(newGameVariables.saveData[i].dataName, JSON.parse(newGameVariables.saveData[i].data));
		else
			quietSetVariable(newGameVariables.saveData[i].dataName, newGameVariables.saveData[i].data);
	}
}

function keyval(input) {
    if (keydown[lookup(input)] === true) {
      return true;
   }
}
function downkey() { return keyval('down'); }
function upkey() { return keyval('up'); }
function leftkey() { return keyval('left'); }
function rightkey() { return keyval('right'); }
function enterkey() { return keyval('enter'); }

function lookup(input) {
if (input === 'leftclick') { return 1; }
if (input === 'middleclick') { return 2; }
if (input === 'rightclick') { return 3; }
if (input === 'tab') { return 9; }
if (input === 'enter') { return 13; }
if (input === 'escape') { return 27; }
if (input === 'space') { return 32; }
if (input === 'left') { return 37; }
if (input === 'up') { return 38; }
if (input === 'right') { return 39; }
if (input === 'down') { return 40; }
if (input === '0') { return 48; }
if (input === '1') { return 49; }
if (input === '2') { return 50; }
if (input === '3') { return 51; }
if (input === '4') { return 52; }
if (input === '5') { return 53; }
if (input === '6') { return 54; }
if (input === '7') { return 55; }
if (input === '8') { return 56; }
if (input === '9') { return 57; }
if (input === 'a') { return 65; }
if (input === 'b') { return 66; }
if (input === 'c') { return 67; }
if (input === 'd') { return 68; }
if (input === 'e') { return 69; }
if (input === 'f') { return 70; }
if (input === 'g') { return 71; }
if (input === 'h') { return 72; }
if (input === 'i') { return 73; }
if (input === 'j') { return 74; }
if (input === 'k') { return 75; }
if (input === 'l') { return 76; }
if (input === 'm') { return 77; }
if (input === 'n') { return 78; }
if (input === 'o') { return 79; }
if (input === 'p') { return 80; }
if (input === 'q') { return 81; }
if (input === 'r') { return 82; }
if (input === 's') { return 83; }
if (input === 't') { return 84; }
if (input === 'u') { return 85; }
if (input === 'v') { return 86; }
if (input === 'w') { return 87; }
if (input === 'x') { return 88; }
if (input === 'y') { return 89; }
if (input === 'z') { return 90; }
}

function multi_chain_top_text(textArray, expiryPer) {
	chain_top_text(textArray[0], expiryPer).then(x => {
		if (textArray.length > 1) {
			textArray.shift();
			multi_chain_top_text(textArray, expiryPer)
		}				
	});
}
function chain_top_text(text, expiry) {
	return new Promise(function(resolve, reject) {
		show_top_text(text);
		setTimeout(() => 
		{ 
			hide_top_text(); 
			resolve(text);
		}, expiry);
	});
}
function createOption(caption, action) {
	// create a temporaryFunction for action
	addTemporaryFunction(caption, action);
	return {
		'caption': caption,
		'action': action
	};
}

function show_options(text, optionsArray) {
	
	let html = "";
	for (let i = 0; i < optionsArray.length; i++) {
		if (temporaryFunctions.filter(fn => fn.name == optionsArray[i].caption).length == 0)
		{
			addTemporaryFunction(optionsArray[i].caption, optionsArray[i].action);
		}
		if (optionsArray.length <= 4) {
			html += `<button style="padding: 6px 6px; border: 0; background-color: blue; color: white" onclick='execFnByName("${optionsArray[i].caption}")'>${optionsArray[i].caption}</button><br /><br />`;
		}
		else if (i % 2 == 0) {
			html += `&nbsp;<button style="padding: 6px 6px; border: 0; background-color: blue; color: white" onclick='execFnByName("${optionsArray[i].caption}")'>${optionsArray[i].caption}</button>&nbsp;`;
		}
		else {
			html += `<button style="padding: 6px 6px; border: 0; background-color: blue; color: white" onclick='execFnByName("${optionsArray[i].caption}")'>${optionsArray[i].caption}</button><br /><br />`;
		}
	}
	show_text_with_header(text, html);
}
function expiring_top_text(text, expiry) {
		show_top_text(text);
		setTimeout(() => { hide_top_text(); }, expiry);
}
function expiring_text_with_header(header, text, expiry) {
		show_text_with_header(header, text);
		setTimeout(() => { hide_mid_text(); }, expiry);
}
function text_with_large_header(header, text){
	return `<h1>${header}</h1><h2>${text}</h2>`;
}
function text_with_medium_header(header, text) {
	return `<h2>${header}</h2><h3>${text}</h3>`;
}
function show_top_text(text) {
	document.getElementById('top_text').style.display = "block";
	update_top_text(text);
}
function update_top_text(text) {
	document.getElementById('topText').innerHTML = text;
}
function hide_top_text() {
	document.getElementById('top_text').style.display = "none";
}
function show_iframe_in_mid_text(iframeSrc, height) {

	if (typeof height == 'undefined') height = '400px';
	let midText = document.getElementById('midText');

	const iframe = document.createElement("iframe");

	iframe.src = iframeSrc;
	iframe.width = "100%";
	iframe.height = height;
	iframe.style.border = "none"; // Remove the default border
	iframe.style.backgroundColor = 'white';

	midText.appendChild(iframe);

	document.getElementById('mid_text').style.display = 'block';
	
}
function show_text_with_header(header, text) {
	document.getElementById('mid_text').style.display = "block";
	update_mid_text(text_with_medium_header(header, text));
}
function show_mid_text(text) {
	document.getElementById('mid_text').style.display = "block";
	update_mid_text(text);
}
function update_mid_text(text) {
	document.getElementById('midText').innerHTML = text;
}
function hide_mid_text() {
	document.getElementById('mid_text').style.display = "none";
}
function show_bottom_text(text) {
	document.getElementById('bottom_text').style.display = "block";
	update_bottom_text(text);
}
function update_bottom_text(text) {
	document.getElementById('bottomText').innerHTML = text;
}
function hide_bottom_text() {
	document.getElementById('bottom_text').style.display = "none";
}
function hide_all_text() {
	hide_bottom_text();
	hide_mid_text();
	hide_top_text();
}

function loadScript(path){
	return new Promise(function(resolve, reject) 
	{
		if (loadedScripts.includes(s => s==path)==true) {
			resolve(document.getElementById('main'));
		}
		let mainDiv = document.getElementById('main');
		let newScript = document.createElement('script');
		
		newScript.onload = () => 
		{
			resolve(document.getElementById('main'));
		};

		newScript.type = 'text/javascript';
		newScript.src = path;
   
		mainDiv.appendChild(newScript); 
		loadedScripts.push(path);		
	});
}
function loadScripts(paths) {
	return new Promise(function(resolve,reject) 
	{
		if (paths.length == 0) resolve(document.getElementById('main'));
		loadScript(paths[0]).then(x => 
		{
			if (paths.length == 1) {
				resolve(document.getElementById('main'));
			}
			else {
				paths.shift();
				resolve(loadScripts(paths));
			}
		});
	});
}

function bulkLoadScripts(paths, timePerScript) {
	return new Promise(function(resolve, reject) {
		for (let i = 0; i < paths.length; i++) 
		{	
			if (loadedScripts.includes(s => s==paths[i])==true) {
				//resolve(document.getElementById('main'));
			}
			else {
				let mainDiv = document.getElementById('main');
				let newScript = document.createElement('script');

				newScript.type = 'text/javascript';
				newScript.src = paths[i];
   
				mainDiv.appendChild(newScript); 
				loadedScripts.push(paths[i]);
			}
		}
		setTimeout(() => {
			resolve(mainDiv);
		}, paths.length * timePerScript);
	});
}


function httpGet(url, key) {
  return new Promise(function(resolve, reject) {  
    let xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
          resolve(this.responseText);
        }
        else if (this.readyState === 4){
          if (this.status === 204){
            resolve('[No Content Found]');
          }
          else if (this.status === 401) {
            resolve("[NOT AUTHORIZED. LOG IN AS ADMINISTRATOR FIRST]");
          }
          else if (this.status === 401) {
            resolve("[FORBIDDEN. LOG IN AS ADMINISTRATOR FIRST]");
          }
          else if (this.status === 500) {
            resolve('[Internal Server Error.]');
          }
          else {
            resolve('Status calling HttpGet at ' + url + ': ' + this.status.toString());
          }
        }
      };

      xhttp.open("GET", url, true);
      xhttp.setRequestHeader("Content-Type", "application/json");
      if (typeof key != 'undefined')
        xhttp.setRequestHeader("API_KEY", key);
      xhttp.send();
    });
}

function httpPost(url, payload, key) {
  return new Promise(function(resolve, reject) {
    let xhttp = new  XMLHttpRequest();

    xhttp.onreadystatechange = function() {
      if (this.readyState === 4 && this.status === 200) {
        resolve(this.responseText);
      }
      else if (this.readyState === 4){
        if (this.status === 405) {
            console.log('Status posting to ' + url + ': ' + this.status.toString() + " ( METHOD NOT ALLOWED ).");
        }
        else {
          alert('Status posting to ' + url + ': ' + this.status.toString());
        }
      }
    };
    xhttp.open("POST", url, true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    if (typeof key != 'undefined')
      xhttp.setRequestHeader("API_KEY", key);
    xhttp.send(JSON.stringify(payload));
  });
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
