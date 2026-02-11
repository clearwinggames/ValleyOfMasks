var threeScenes = [];
var targetScene = 0;

var yMomentum = 0;
var atRest = true;
var cached_scenario = null;

var lastCollisionY = null;
var lastCollisionZX = null;

var gameStarted = false;
var cached_scene_data = [];
var loader = new THREE.TextureLoader();
				
var cameraLight = new THREE.PointLight( 0x0fff7f, 2, 1000, 2 );

const textCanvas = document.createElement( 'canvas' );

function startGameLoop(controlScheme, runAtBeginning, runInTheMiddle, runAtEnd) {
	if (gameStarted == true) return;
	
	animateScene();
	
	setInterval(function() 
	{ 
		if (typeof threeScenes == 'undefined' || threeScenes.length == 0) return;
		
		if (typeof runAtBeginning != 'undefined') 
			runAtBeginning();
	
		let camera = getCamera();
	
		let scene_data = activeSceneData();
	
		if (scene_data.length == 0) console.log('NO SCENE DATA');
		
		let collideWithY = moveWithCollisionY(camera, 0.375, scene_data, yMomentum);
		if (collideWithY != null && lastCollisionY != collideWithY) 
		{
			lastCollisionY = collideWithY;		
		
			let equivalent = first_scene()[0].findIndexOf(collideWithY);
			for (let i = 0; i < threeScenes[targetScene].Data.length; i++)
			{
				if (typeof threeScenes[targetScene].Data[i].chents != 'undefined') {
					if (threeScenes[targetScene].Data[i].chents.length > 0) {
						for (let c = 0; c < threeScenes[targetScene].Data[i].chents.length; c++) {
							threeScenes[targetScene].Data[i].chents[c].fireEventsFor(collideWithY);
						}
					}
				}	
				threeScenes[targetScene].Data[i].fireEventsFor(collideWithY);
			}
		}
		else 
		{
				//lastCollisionY = null;
		}
		
		atRest = (collideWithY != null);
		if (atRest) {
			yMomentum = -0.0000001;
		}
		else
		{
			yMomentum -= 0.005;
		}
		// todo: override default key mappings with "controlScheme" parameter...
		if ((keyval('j')==true || keyval('x')==true) && atRest == true) {
		
			yMomentum = 0.075 * (keyval('r') ? 2 : 1);
			atRest = false;
		}
		
		if (keyval('q') || keyval('e')) 
		{
			if (keyval('q') && !keyval('e')) {
				// downkey
				//camera.rotation.z += 0.05;
				//camera.rotation.x += 0.05;
			}
			else if (keyval('e') && !keyval('q')) {
				//camera.rotation.z -= 0.05;
				//camera.rotation.x -= 0.05;
			}
		}
		else 
		{
			
		}
		
		if (leftkey() || keyval('a')) {
			camera.rotation.y += 0.05; // formerly 0.03333
		}
		if (rightkey() || keyval('d')) {
			camera.rotation.y -= 0.05; // formerly 0.03333
		}
		if (collideWithY != null)
			lastYCollision = collideWithY;

		let collideWith = null;
		
		if (typeof runInTheMiddle != 'undefined') 
			runInTheMiddle();
		
		if (upkey() || keyval('w')) {
			collideWith = moveForwardWithCollision(camera, scene_data, 0.05 * (keyval('r') ? 2 : 1));
		}
		if (downkey() || keyval('s')) {
			collideWith = moveForwardWithCollision(camera, scene_data, -0.05 * (keyval('r') ? 2 : 1));
		}

		if (keyval('q')) {
			fullScreenBody();
		}

		if (esckey()) {
			clear_all_mid_text();
			hide_mid_text();
		}
		executeKeydownActions();
		
		if (collideWith != null && collideWith != lastCollisionZX) {
			lastCollisionZX = collideWith;
			
			for (let i = 0; i < threeScenes[targetScene].Data.length; i++)
			{
				if (typeof threeScenes[targetScene].Data[i].chents != 'undefined') {
					if (threeScenes[targetScene].Data[i].chents.length > 0) {
						for (let c = 0; c < threeScenes[targetScene].Data[i].chents.length; c++) {
							threeScenes[targetScene].Data[i].chents[c].fireEventsFor(collideWith);
						}
					}
				}			
				threeScenes[targetScene].Data[i].fireEventsFor(collideWith);
			}
		}
		else 
		{
			lastCollisionZX = null;
		}
	
		if (enterkey()) {
			console.log('Enter key pressed.');
			camera.position.x = 0;
			camera.position.z = 0;
		}
		if (collideWith != null)
			lastCollision = collideWith;
		
		//cameraLight.position.set(camera.position.x, camera.position.y, camera.position.z);
		if (camera.position.y < -100) {
			if (typeof game_over_behavior != 'undefined')
				game_over_behavior();
		}
		
		if (typeof runAtEnd != 'undefined') 
			runAtEnd();
}, 30);
	
	gameStarted = true;
}	
function add_to_current_scene(threeEntity, thrData) {

	let scene = threeScenes[targetScene].Object;
	if (typeof thrData == 'undefined' || thrData == null) {
		// skip it, for things like light sources, thrData is not needed.
	}
	else {
            let scene_data = threeScenes[targetScene].Data;
	    scene_data.push(thrData);
	}
	
	scene.add( threeEntity );
}
function resoluteReplace(stringBefore, stringReplace, stringWith) {
	while (stringBefore.indexOf(stringReplace) >= 0) {
			stringBefore = stringBefore.replace(stringReplace, stringWith);
	}
	return stringBefore;
}
function getCamera() {
	return threeScenes[0].Object.camera;
}
function ent(name) {
	return getEntityByName(name);
}
function getEnt(name) {
	return getEntityByName(name);
}
function getEntityByName(name) {
	// look in current scene.  If entity was not given a name, this would fail...
	for (let i = 0; i < threeScenes[targetScene].Data.length; i++) {
		if (typeof threeScenes[targetScene].Data[i].name != 'undefined' && threeScenes[targetScene].Data[i].name == name) {
			fn_activeScene()[name] = threeScenes[targetScene].Data[i];
			return threeScenes[targetScene].Data[i];
		}
		else if (typeof threeScenes[targetScene].Data[i].chents != 'undefined' && threeScenes[targetScene].Data[i].chents != null) {
			for (let j = 0; j < threeScenes[targetScene].Data[i].chents.length; j++) {
				if (typeof threeScenes[targetScene].Data[i].chents[j].name != 'undefined' && threeScenes[targetScene].Data[i].chents[j].name == name) {
					fn_activeScene()[name] = threeScenes[targetScene].Data[i].chents[j];
					return threeScenes[targetScene].Data[i].chents[j];
				}
			}
		}
	}
	return null;
}
function preloadEntityNames() {
	for (let i = 0; i < threeScenes[targetScene].Data.length; i++) {
		if (typeof threeScenes[targetScene].Data[i].name != 'undefined' && threeScenes[targetScene].Data[i].name.length > 0) {
			fn_activeScene()[threeScenes[targetScene].Data[i].name] = threeScenes[targetScene].Data[i];
		}
		else if (typeof threeScenes[targetScene].Data[i].chents != 'undefined' && threeScenes[targetScene].Data[i].chents != null) {
			for (let j = 0; j < threeScenes[targetScene].Data[i].chents.length; j++) {
				if (typeof threeScenes[targetScene].Data[i].chents[j].name != 'undefined' && threeScenes[targetScene].Data[i].chents[j].name.length > 0) {
					fn_activeScene()[threeScenes[targetScene].Data[i].chents[j].name] = threeScenes[targetScene].Data[i].chents[j];
				}
			}
		}
	}
}

function refreshScene(entIndex, toUpdate, newSprite) {
	// flush and repopulate
//	cached_scene_data = [];

	let ents = threeScenes[targetScene].Data.filter(ent => typeof ent != 'lightSource');//reverse();

	let stoppedAt = -1;
	
	let imagePath = location.origin + '/lib/content/';
	
	var texture = loader.load
	(
		imagePath + newSprite
	);
	
	let ct = 0;
	for (let j = 0; j < ents.length; j++) {
		let thrs = ents[j].enumerateThrs();
		let localCt = 0;
		if (j == j || j == entIndex) 
		{		
			for (let i = 0; i < thrs.length; i++) 
			{
				for (let x = 0; x < toUpdate.length; x++) 
				{
					if (j == entIndex && localCt == toUpdate[x]) 
					{
						stoppedAt = ct;
						let material = new THREE.MeshLambertMaterial(
						{
    	         			map: texture, side: THREE.DoubleSide
						});
					
						let filtered = 	threeScenes[targetScene].Object.children
							.filter(ch => ch.type == 'Mesh' );
							
						if (filtered.length >= ct) 
						{
							filtered[ct].material  = material;
							
							filtered
							[ct].material.map.needsUpdate = true;
														
						}
						else {
							console.log('Could not find filtered');
						}
					
						material.dispose();
					}
			
				}
				ct++;
				localCt++;
			}

		}	
		
	}

	texture.dispose();
}
function setToNewScene(new_scene_data) {
	return new Promise(function(resolve, reject) {
		// efficiently combine new scene with set scene...
		
		let sceneCount = threeScenes.length;
		
		if (typeof sceneCount == 'undefined') alert('UNDEFINED Scene Count');
		// flush current scene
		
		cached_scene_data = [];

		for( let i = threeScenes[targetScene].Object.children.length - 1; i >= 0; i--) { 
			let toClear = threeScenes[targetScene].Object.children[i]; 
			threeScenes[targetScene].Object.remove(toClear); 
		}
		
		let scenePair = liteNewThreeScene(new_scene_data);
			
		targetScene = sceneCount;
		
		scenePair.Object.sceneNumber = targetScene;
		
		scenePair.Object.renderer.render( scenePair.Object, scenePair.Object.camera );
		
		setScene(targetScene).then(x => 
		{			
				resolve();
		});			
	});
}
function setScene(index) {

	return new Promise(function(resolve, reject) {
		// flush and repopulate
		cached_scene_data = [];

		for( let i = threeScenes[targetScene].Object.children.length - 1; i >= 0; i--) { 
			let toClear = threeScenes[targetScene].Object.children[i]; 
			threeScenes[targetScene].Object.remove(toClear); 
		}
		if (typeof index == 'undefined') 
			console.log('Scene Index UNDEFINED');
		else
			targetScene = index;
		
		threeScenes[targetScene].Object.sceneNumber = targetScene;
	
		ents = threeScenes[targetScene].Data;
		
		preloadEntityNames();
		
		addEntsToTargetScene(ents.slice()).then(x => {
			resolve();
		});
	});
}
function addEntsToTargetScene(ents) {
	return new Promise(function(resolve, reject) {
		if (ents.length > 0) {	
			addEntToTargetScene(ents[0]).then(x => 
			{
				ents.shift();
				resolve(addEntsToTargetScene(ents));
			});
		}
		else{
			resolve(threeScenes[targetScene]);
		}
	});
}
function addEntToTargetScene(ent) {
	return new Promise(function(resolve, reject) {
		ent.addToScene(threeScenes[targetScene].Object).then(x =>
		{
			resolve(x);
		});
	});
}
function activeSceneData(){
	if (cached_scene_data.length > 0) 
		return cached_scene_data;
	
	let scene = threeScenes[targetScene];
	if ('undefined' == typeof scene) return [];
	
	let scene_data = [];
	
	for (let j = 0; j < threeScenes[targetScene].Data.length; j++)
	{
		let thrs = threeScenes[targetScene].Data[j].enumerateThrs();
		for (let i = 0; i < thrs.length; i++) {			
			scene_data.push(thrs[i]);
		}
	}
	cached_scene_data = scene_data;
	return scene_data;
}
function liteNewThreeScene(scene_data) {
	let newScene = new THREE.Scene();
		if (threeScenes.length == 0) {
			let newCamera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.0001, 5000 );
			let newRenderer = new THREE.WebGLRenderer();

			newScene.camera = newCamera;
			newScene.renderer = newRenderer;
			
			newRenderer.setSize( window.innerWidth, window.innerHeight );
			document.body.appendChild( newRenderer.domElement ); 

			newCamera.position.z = 5;
		}
		else {
			newScene.camera = getCamera();
			newScene.renderer = threeScenes[0].Object.renderer;
		}

		let scenePair = { 'Object': newScene, 'Data': scene_data };

		threeScenes.push(scenePair);
		
		return scenePair;
}
function newThreeScene(scene_data) {

	return new Promise(function(resolve,reject) {
		let newScene = new THREE.Scene();
		if (threeScenes.length == 0) {
			let newCamera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.0001, 5000 );
			let newRenderer = new THREE.WebGLRenderer();

			newScene.camera = newCamera;
			newScene.renderer = newRenderer;
			
			newRenderer.setSize( window.innerWidth, window.innerHeight );
			document.body.appendChild( newRenderer.domElement ); 

			newCamera.position.z = 5;
		}
		else {
			newScene.camera = getCamera();
			newScene.renderer = threeScenes[0].Object.renderer;
		}

		// scene_data will be an array of models
	
		addSceneDataToScene(scene_data.slice(), newScene).then(scene => 
		{
			let scenePair = { 'Object': newScene, 'Data': scene_data };

			newScene.renderer.render( scenePair.Object, scenePair.Object.camera );
	
			threeScenes.push(scenePair);

			resolve(scenePair);
		});	
	});
}	
function addSceneDataToScene(dataArray, scene) 
{
	return new Promise(function(resolve, reject) 
	{
		if (typeof dataArray == 'undefined') {
			console.log('Undefined data array');
		}	
		else if (dataArray == null) {
			console.log('Null data array');
		}
		else if (typeof dataArray.length == 'undefined' || typeof dataArray[0] == 'undefined' || dataArray.length == 0) {
			console.log('Null first entry of data array');
			resolve(scene);
		}					
				
		dataArray[0].addToScene(scene).then(x => 
		{
			dataArray.shift();
			if (dataArray.length == 0) {
				resolve(scene);
			}
			else {
				resolve(addSceneDataToScene(dataArray, scene));
			}
		});
	});
}
function animateScene(){
	requestAnimationFrame( animateScene );
	
	if ('undefined' == typeof threeScenes[0] || 'undefined' == typeof threeScenes[targetScene]) return;

	threeScenes[0].Object.renderer.render
	(
		threeScenes[targetScene].Object, 
		threeScenes[0].Object.camera
	);
}
function fn_activeScene() {	
	return threeScenes[targetScene];
}
function active() {
	return threeScenes[targetScene];
}

function moveCameraForward(amt) {
	var targetVector = getCameraVector();
	var xAmt = targetVector.x * (amt);
	var yAmt = targetVector.y * (amt);
	var zAmt = targetVector.z * (amt);
	getCamera().position.x += xAmt;
	getCamera().position.y += yAmt;
	getCamera().position.z += zAmt
	//targetVector.dispose();
}
function getCameraVector() {
	var vector = new THREE.Vector3(0,0,-1);
	vector.applyQuaternion(getCamera().quaternion);
	return vector;
}
function moveWithCollisionY(moveMe, heightBias, allThr, yAmt) {  
  let xAmt = 0;
  let zAmt = 0;

  let prev = new thr(moveMe.position.x, moveMe.position.y, moveMe.position.z, 0,0,0);
  
  let projectionRatio = 1;
  
  let collided = checkMovePoint3d(allThr, prev, prev.transpose(xAmt * projectionRatio, (yAmt * projectionRatio) - (heightBias / parseFloat(2)), zAmt * projectionRatio));

  if (collided != null) {
	// move the *other way*
	moveMe.position.y = collided.T() + (heightBias * 1);
	return collided;
  }

  collided = checkMovePoint3d(allThr, prev, prev.transpose(xAmt * projectionRatio, (yAmt * projectionRatio) - heightBias, zAmt * projectionRatio));

  if (collided == null) {
      moveMe.position.x += xAmt;
      moveMe.position.y += yAmt;
      moveMe.position.z += zAmt;
	  return collided;
  } 
  else {
	  return collided;
  }
}

function moveForwardWithCollision(moveMe, allThr, amt) {

  let vector = new THREE.Vector3(0,0,-1);
  vector = vector.applyQuaternion(moveMe.quaternion);

  let xAmt = vector.x * (amt);
  let yAmt = vector.y * (amt);
  let zAmt = vector.z * (amt);

  let prev = new thr(moveMe.position.x, moveMe.position.y, moveMe.position.z, 0,0,0);
  
  let projectionRatio = 1;
  
  let collided = checkMovePoint3d(allThr, prev, prev.transpose(xAmt * projectionRatio, yAmt * projectionRatio, zAmt * projectionRatio));
  
  //vector.dispose();

  if (collided == null) { 
      moveMe.position.x += xAmt;
      moveMe.position.y += yAmt;
      moveMe.position.z += zAmt;
	  return collided;
  } 
    else {
	  return collided;
  }
}

function checkMovePoint3d(allThr, point3dPrev, point3dPost) {  
	
	for(let i in allThr) { 
		if (checkPointCollision(allThr[i], point3dPrev, point3dPost)==true) { 
			return allThr[i]; 
		} 
	}
	return null;  
}

function checkPointCollision(thr, p3dPrev, p3dPost) {

   let xOverlap = false; 
   let yOverlap = false; 
   let zOverlap = false;

   if (p3dPrev.X<p3dPost.X) { 
      xOverlap = checkOverlap(p3dPrev.X, p3dPost.X, thr.L(), thr.R()); 
   } 
   else 
   { 
      xOverlap = checkOverlap(p3dPost.X, p3dPrev.X, thr.L(), thr.R()); 
   }
   if (p3dPrev.Y<p3dPost.Y) { 
      yOverlap = checkOverlap(p3dPrev.Y, p3dPost.Y, thr.B(), thr.T()); 
   } 
   else 
   { 
      yOverlap = checkOverlap(p3dPost.Y, p3dPrev.Y, thr.B(), thr.T()); 
   }
   if (p3dPrev.Z<p3dPost.Z) {
      zOverlap = checkOverlap(p3dPrev.Z, p3dPost.Z, thr.A(), thr.F()); 
   } 
   else 
   { 
      zOverlap = checkOverlap(p3dPost.Z, p3dPrev.Z, thr.A(), thr.F()); 
   }
   return (xOverlap == true && yOverlap == true && zOverlap == true);
 }


function checkOverlap (inputOneMin, inputOneMax, inputTwoMin, inputTwoMax) 
{
  if (inputOneMin > inputTwoMax || inputOneMax < inputTwoMin) { 
     return false; 
  }
  return true;
}
function getTextureWrappedMesh(texture, geometry, ratio) 
{
	// adjust geometry based on the side we're targeting...?
	let calc = (geometry, side) => 
	{
		if (side == 4 || side == 5) 
			return 2;
		return 1;
	};
	
	return new THREE.Mesh( geometry,
	[			
		manageTextureWrap(texture, geometry, ratio * (calc(geometry, 0))), // "front" (along X axis)
		manageTextureWrap(texture, geometry, ratio * (calc(geometry, 1))), // "back"  (along X axis)
		manageTextureWrap(texture, geometry, ratio * (calc(geometry, 2))),  // TOP
		manageTextureWrap(texture, geometry, ratio * (calc(geometry, 3))),  // UNDERNEATH
		manageTextureWrap(texture, geometry, ratio * (calc(geometry, 4))), // side, along Z axis.  Can see while facing "N"
		manageTextureWrap(texture, geometry, ratio * (calc(geometry, 5))) // side along Z axis see while facing "S"
	]);	
}
function manageTextureWrap(texture, geometry, ratio) 
{
	texture.wrapT = THREE.RepeatWrapping;
    texture.wrapS = THREE.RepeatWrapping;			 
	geometry.computeBoundingBox();			 
	let max = geometry.boundingBox.max;
	let min = geometry.boundingBox.min;
	let height = max.y - min.y;
    let width = max.x - min.x;
    texture.repeat.set(width / parseFloat(ratio) , height / parseFloat(ratio));
    texture.needsUpdate = true;	

	return JSON.parse(JSON.stringify(texture));
}
function getDefaultMaterial() {
	return new THREE.MeshLambertMaterial( {color: 'lightgray'})
}
function getMaterialByColor(color) {
	return new THREE.MeshLambertMaterial( {color: color})	
}
function buildSvgImageUrl(svg) {
    b64 = window.btoa(svg);
    return "data:image/svg+xml;base64," + b64;
}

function resizeCanvasBasedOnHTML(html) 
{
		if (html.length > 240) {
			textCanvas.width = Math.ceil( ((textCanvas.getContext( '2d' )).measureText( html ).width * 0.05) + 64 );
			textCanvas.height = 768;			
		}
		else if (html.length > 120) {
			textCanvas.width = 360;
			textCanvas.height = 108;
		}
		else if (html.length > 60) {
			textCanvas.width = 288;
			textCanvas.height = 96;
		}
		else if (html.length > 30) {
			textCanvas.width = 256;
			textCanvas.height = 64;
		}
		else {
			textCanvas.width = 108;
			textCanvas.height = 24;
		}	
}

function htmlToTexture( html ) {
	
	return new Promise(function(resolve, reject) {
	
		let ctx = textCanvas.getContext( '2d' );
		
		const font = '18px courier';

		ctx.font = font;

		resizeCanvasBasedOnHTML(html);
	
		let xml = htmlToXml(html);
	
		let svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${textCanvas.width}" height="${textCanvas.height}">
<foreignObject width="100%" height="100%">
    <div xmlns="http://www.w3.org/1999/xhtml">${xml}</div>
</foreignObject>
</svg>`;

		let svgBlob = new Blob( [svg], { type: 'image/svg+xml;charset=utf-8' } );
		let svgObjectUrl = buildSvgImageUrl(svg);

		let tempImg = new Image();
		tempImg.setAttribute('crossOrigin', 'anonymous');
	
		let loaded = false;

		tempImg.onload = function() {
		if (loaded == true) return;

		ctx.clearRect(0, 0, textCanvas.width, textCanvas.height);
        ctx.drawImage( tempImg, 0, 0, textCanvas.width, textCanvas.height );
        URL.revokeObjectURL( svgObjectUrl );

		tempImg.setAttribute('crossOrigin', 'anonymous');
		tempImg.src = ctx.canvas.toDataURL("image/png");
		
		let texture = new THREE.Texture( tempImg );
		
		texture.minFilter = THREE.LinearFilter;
		texture.generateMipmaps = false;
		texture.needsUpdate = true;
		
			loaded = true;
	
			resolve(texture);
		};
		
		tempImg.src = svgObjectUrl;
    });		
}

function textToTexture(text) 
{	
	return new Promise(function(resolve, reject) {
		
		const ctx = textCanvas.getContext( '2d' );
		const font = '18px courier';

		ctx.font = font;
		textCanvas.width = Math.ceil( ctx.measureText( text ).width + 16 );

		ctx.font = font;
		ctx.strokeStyle = '#000';
		ctx.lineWidth = 8;
		ctx.lineJoin = 'miter';
		ctx.miterLimit = 3;
		ctx.strokeText( text, 8, 26 );
		ctx.fillStyle = 'white';
		ctx.fillText( text, 8, 26 );
		
		let img = new Image();
		img.onload = function() {
			ctx.drawImage( img, 0, 0 );
		};
		let imgData = ctx.getImageData( 0, 0, textCanvas.width, textCanvas.height);
		
		let dataImg = new Image();
		dataImg.src = textCanvas.toDataURL();
	
		let texture = new THREE.Texture( imgData );
		
		texture.minFilter = THREE.LinearFilter;
		texture.generateMipmaps = false;
		texture.needsUpdate = true;
		
		resolve(texture);
	});
}

function htmlToXml(html) {
	html = `<body>${html}</body>`;
    var doc = document.implementation.createHTMLDocument('');
    doc.write(html);

    doc.documentElement.setAttribute('xmlns', doc.documentElement.namespaceURI);

    html = (new XMLSerializer).serializeToString(doc.body);
    return html;
}
