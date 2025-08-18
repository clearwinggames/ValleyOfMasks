var textureLoader = new THREE.TextureLoader();

function thr(x, y, z, w, h, d) {
  this.X = x;
  this.Y = y;
  this.Z = z;
  this.W = w;
  this.H = h;	
  this.D = d;
  this.name = '';
  this.transpose =  function(xDsp,yDsp,zDsp) {
    return new thr(this.X + xDsp, this.Y + yDsp, this.Z + zDsp, this.H, this.W, this.D);
  };
  this.L =  function() {
    return this.X - (this.W / parseFloat(2));
  };
  this.R =  function() {
    return this.X + (this.W / parseFloat(2));
  };
  this.T =  function() {
     return this.Y + (this.H / parseFloat(2));
  };
  this.B = function() { 
     return this.Y - (this.H / parseFloat(2)); 
  };
  this.A = function() { 
    return this.Z - (this.D / parseFloat(2));
  };
  this.F =  function() {
    return this.Z + (this.D / parseFloat(2));
  };
}

class lightSource extends thr {
	constructor(x, y, z, lightColor, intensity, distance, decay) {
		super(x, y, z, 0, 0, 0);
		this.color = lightColor;
		this.intensity = intensity;
		this.distance = distance;
		this.decay = decay;
		this.internal = null;
		this.stopped = false;
		this.parentSceneNumber = -1;
	}
	fireEventsFor() {
		
	}
	stopBehaviors() {
		this.stop = true;
	}
	switchBehavior(newBehavior, frequency, sceneNumber) {
		this.stopBehaviors();
		setTimeout(() => {
			this.stop = false;
			this.setBehavior(newBehavior, frequency, sceneNumber);
		}, frequency);
	}
	setBehavior(action, frequency, sceneNumber) {
		let me = this;
		if (sceneNumber >= 0 && sceneNumber != targetScene) return;
		sleep(frequency).then(x => 
		{
			action(me);			
			
			if (me.stop==false) {
				me.setBehavior(action, frequency, sceneNumber);
			}
		});
	}
	enumerateThrs() {
		return [ /* there aren't any */ ];
	}
	addToScene(scene) {
		let me = this;
		return new Promise(function(resolve, reject) {
			
			let newPointLight = new THREE.PointLight(me.color, me.intensity, me.distance, me.decay);
			newPointLight.position.x = me.X;
			newPointLight.position.y = me.Y;
			newPointLight.position.z = me.Z;
			scene.add(newPointLight);
			
			me.internal = newPointLight;
			
			me.parentSceneNumber = scene.sceneNumber;
			
			resolve(scene);
		});
	}
}

class CubePlane extends thr {
	
	constructor(x, y, z, w, h, d, sprite) {
		  super(x, y, z, w, h, d);
		  if (typeof sprite == 'string') {
			this.Sprite = new Sprite(0,0,32,32,sprite);  
		  }
		  else {
			this.Sprite = sprite;
		  }
     	  this.parentSceneNumber = -1;
		  this.collisionEvents = [];
		  this.internal = null;
		  this.stop = false;
		  this.allSides = true;
		  this.opacity = 1;
	}
	setOpacity(opacity) {
	  this.opacity = opacity;
	}
	fireEventsFor(collideWith) {
	   if (this.X == collideWith.X && this.Y == collideWith.Y && this.Z == collideWith.Z && this.W == collideWith.W && this.H == collideWith.H && this.D == collideWith.D)
	   {
		   for (let i = 0; i < this.collisionEvents.length; i++) {
				this.collisionEvents[i](this);
		   }
	   }
	}
	wireEventFor(event) {
		this.collisionEvents.push(event);
	}
	enumerateThrs() {
		return [ this ];
	}
	resumeBehavior() {
		  if (typeof this.lastBehavior != 'undefined') {
			  this.setBehavior(this.lastBehavior, this.lastBehaviorFrequency, this.lastBehaviorSceneNumber);
		  }
	}
	stopBehaviors() {
		this.stop = true;
	}
	setBehavior(action, frequency, sceneNumber) {
		let me = this;
		if (sceneNumber >= 0 && sceneNumber != targetScene) return;
		sleep(frequency).then(x => 
		{
			me.lastBehavior = action;
			me.lastBehaviorFrequency = frequency;
			me.lastBehaviorSceneNumber = sceneNumber;
			action(me);			
			
			if (me.stop==false) {
				me.setBehavior(action, frequency, sceneNumber);
			}
		});
	}
	addToScene(scene) 
	{
		let me = this;
		me.parentSceneNumber = scene.sceneNumber;		
		if (typeof me.lastBehavior != 'undefined') {
			me.resumeBehavior();
		}		
		return new Promise(function(resolve, reject) 
		{   			
        	const geometry = new THREE.BoxGeometry( me.W, me.H, me.D );
			   
			let imageName = me.Sprite.image;
			   		
			let imagePath = location.origin + '/lib/content/';
					
			var texture = textureLoader.load
			(
				imagePath + imageName
			);
			 
        		const material = new THREE.MeshLambertMaterial(
				{
	        		map: texture, side: THREE.DoubleSide,
				opacity: me.opacity, transparent: (me.opacity < 1 ? true : false)
		        });
				
	        	const cube = new THREE.Mesh( geometry,
				[			
					material,
					material,
					me.allSides == true ? material : getMaterialByColor(me.defaultColor),
					me.allSides == true ? material : getMaterialByColor(me.defaultColor),
					me.allSides == true ? material : getMaterialByColor(me.defaultColor),
					me.allSides == true ? material : getMaterialByColor(me.defaultColor)
				]);			 
				cube.position.x = me.X;
        		cube.position.y = me.Y;
        		cube.position.z = me.Z;
				
				geometry.dispose();
				material.dispose();
				texture.dispose();
				
				me.internal = cube;
				
		        scene.add( cube );
			resolve(scene); 
		});
	}    
}

class TextPlane extends thr {
	  constructor(x, y, z, w, h, d, text) {
		  super(x, y, z, w, h, d);
		  this.Text = text;
		  this.parentSceneNumber = -1;
  		  this.internal = null;
		  this.stop = false;
		  this.allSides = true;
		  this.defaultColor = 'black';
	  }
	  updateText(text) {
		 this.Text = text;
	  }
	  fireEventsFor(collideWith) {
		  
	  }
	  stopBehaviors() {
		this.stop = true;
	  }
	  resumeBehavior() {
		  if (typeof this.lastBehavior != 'undefined') {
			  this.setBehavior(this.lastBehavior, this.lastBehaviorFrequency, this.lastBehaviorSceneNumber);
		  }
	  }
	  setBehavior(action, frequency, sceneNumber) {
		let me = this;
		
		if (me.stop == true) {
			
		}
		
		if (sceneNumber >= 0 && sceneNumber != targetScene) return;
		sleep(frequency).then(x => 
		{
			me.lastBehavior = action;
			me.lastBehaviorFrequency = frequency;
			me.lastBehaviorSceneNumber = sceneNumber;
			
			action(me);			
			
			if (me.stop==false) {
				me.setBehavior(action, frequency, sceneNumber);
			}
		});
	  }
	  enumerateThrs() {
		return [ this ];
	  }
	  isHTML() {
		  if (this.isMarkdown()==true) {
			  return true;
		  }
		  
		  if (this.Text.indexOf('>') >= 0 && this.Text.indexOf('<') >= 0 && (this.Text.indexOf('</') >= 0 || this.Text.indexOf('/>') >= 0)) {
			  return true;
		  }
		  return false;
	  }
	  isMarkdown() {
		if (this.Text.trim().indexOf('md.v1') == 0) {
			return true;
		}
		return false;
	  }
	  addTextureToScene(texture, scene) {		
		  let me = this;
		  return new Promise(function(resolve, reject) {
			const material = new THREE.MeshLambertMaterial(
			{
    			    map: texture, side: THREE.DoubleSide
			});
		
			const geometry = new THREE.BoxGeometry
			( 
				me.W,
				me.H, 
				me.D
			);
	
	        const cube = new THREE.Mesh( geometry,
			[			
				material, // "front" (along X axis)
				material, // "back"  (along X axis)
				getMaterialByColor(me.defaultColor),  // TOP
				getMaterialByColor(me.defaultColor),  // UNDERNEATH
				me.allSides == true ? material : getMaterialByColor(me.defaultColor), // side, along Z axis.  Can see while facing "N"
				me.allSides == true ? material : getMaterialByColor(me.defaultColor) // side along Z axis see while facing "S"
			]);	
			
			cube.position.x = me.X; 
        	cube.position.y = me.Y; 
	        cube.position.z = me.Z;   
			
			geometry.dispose();
			material.dispose();
				
			me.internal = cube;
			
			scene.add( cube );				
			  
        	resolve(scene);
		  });
	  }
	  addToScene(scene) {
 		let me = this;
		if (typeof scene.sceneNumber == 'undefined') console.log('Scene->SceneNumber UNDEFINED');
		me.parentSceneNumber = scene.sceneNumber;
		if (typeof me.lastBehavior != 'undefined') {
			me.resumeBehavior();
		}
		return new Promise(function(resolve, reject) {

		if (me.isHTML()==true)
		{
			if (me.isMarkdown()==true) {
				//me.Text = me.Text.replace('md.v1', '');
			  
				loadScript
				(
                                    'JSLib/Misc/showdown.js' 
				).then(x => 
				{
					var mdConverter = new showdown.Converter();
							
					me.Text = mdConverter.makeHtml
					(
						me.Text									
							.replace('md.v1', '')
							.replace('\n> ', '<danger>')
							.replace('{.is-danger}', '</div>')
							.replace('\n> ', '<info>')
							.replace('{.is-info}', '</div>')
							.replace('<danger>', '<div style="padding: 2px; background-color: pink">')
							.replace('<info>', '<div style="padding: 2px; background-color: skyblue">')
					);
					me.Text = "<body style='padding: 2px; background-color: white'>" + me.Text + "</body>";
	
					me.Text = resoluteReplace
					(
						me.Text, '<h2 id=', '<h2 style="background-color: blue; color: black; padding: 4px" id='
					)
						
					me.Text = resoluteReplace(me.Text, '<h2>', '<h2 style="color: gold">');
					
					me.Text = resoluteReplace
					(
						me.Text, '<p>title:', '<p style="background-color: gold; color: black; padding: 4px; font-size: 24px; font-weight: bold">'
					);
					
					me.Text = resoluteReplace(me.Text, '">subtitle: ', '">');
					me.Text = resoluteReplace(me.Text, '<p>', '<p style="color:blue">');
					me.Text = resoluteReplace(me.Text, '<li>', '<li style="color: black">');
					me.Text = resoluteReplace(me.Text, '<strong>', '<strong style="color: red">');

					me.addToScene(scene);
				});				
			}

			htmlToTexture(me.Text).then(texture => 
			{
				me.addTextureToScene(texture, scene).then(x => {
					resolve(scene);
				});
			});
		}
		else 
		{
			textToTexture(me.Text).then(texture => 
			{
				me.addTextureToScene(texture, scene).then(x => {
					resolve(scene);
				});
			});
		}			         
	  });
    }
}

class Grid3D
  //  Model 
  {
  constructor(x, y, z, tileWidth, tileHeight, tileDepth, gridWidth, gridHeight, gridDepth) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.tileWidth = tileWidth;
    this.tileHeight = tileHeight;
    this.tileDepth = tileDepth;
    this.gridWidth = gridWidth;
    this.gridHeight = gridHeight;
    this.gridDepth = gridDepth;
	this.gridSprites = [];
    this.collidesWith = [];
    this.collisionEvents = [];
	this.animating = false;
    this.supportCollision = false;
	this.unifiedRanges = [];
	this.chents = [];
    this.name = '';
    this.innerGrid = [this.gridHeight];
	this.opacity = 1;
    for(let k = 0; k < this.gridHeight; k++) {
      this.innerGrid[k] = [this.gridWidth];
      for (let j = 0; j < this.gridWidth; j++) {
        this.innerGrid[k][j] = [this.gridDepth];
        for (let i = 0; i < this.gridDepth; i++) {
          this.innerGrid[k][j][i] = 0; // zero is *empty*
        }
      }
    }
  }
  setOpacity(opacity) {
	  this.opacity = opacity;
  }
  setAnimation(spriteIndex, frequency, animationSet, sceneNumber) {
	if (this.animating == false && typeof this.lastAnimationIndex == 'undefined')
		this.animating = true;
	else if (this.animating == false)
		return;
	// these are cached but not used directly in this method
	this.lastAnimationIndex = spriteIndex;
	this.lastAnimationFrequency = frequency;
	this.lastAnimationSet = animationSet;
	this.lastAnimationSceneNumber = sceneNumber;
	
	let me = this;
	if (sceneNumber >= 0 && sceneNumber != targetScene) return;
	sleep(frequency).then(x =>
	{
		me.gridSprites[spriteIndex-1].image = animationSet[0];
				
		// update the sprites in threeJS
		let toUpdate = [];
		let ct = 0;
		for (let k = 0; k < me.gridHeight; k++) {
			for (let j = 0; j < me.gridWidth; j++) {
				for (let i = 0; i < me.gridDepth; i++) {
    				
					let rangeIndex = this.isInRange(j, k, i);
					if (rangeIndex == -1 || this.firstInRange(rangeIndex,j,k,i))
					{
											
						if (me.innerGrid[k][j][i] == spriteIndex) {
							toUpdate.push(ct);
						}

						if (me.innerGrid[k][j][i] > 0) {
						
							ct++;
						
						}
						if ((k == (me.gridHeight - 1) || k == 0 )&& i % 3 == 0 && j % 3 == 0){
							//ct += 3;
						}
					}
				}
			}
		}
		let entIndex = -1;
		for (let i = 0; i < threeScenes[targetScene].Data.length; i++) {
			if (threeScenes[targetScene].Data[i] == me) entIndex = i;
		}
		if (entIndex >= 0)
			refreshScene(entIndex, toUpdate, animationSet[0]);
		// sort the animationSet slightly then recall this
		let first = [ animationSet[0] ];
		
		animationSet.shift();		
		me.setAnimation(spriteIndex, frequency, animationSet.concat(first), sceneNumber);
	});
  }  
  restoreAnimation() {
	
	  if (typeof this.lastAnimationIndex != 'undefined') {
		  this.setAnimation(this.lastAnimationIndex, this.lastAnimationFrequency, this.lastAnimationSet, this.lastAnimationSceneNumber);
	  }
  }
  transferAnimation(otherGrid) {
	  
	  if (otherGrid.animating == true) {
		  let spriteIndex = this.translateSprite(otherGrid.lastAnimationIndex, otherGrid);

		  if (spriteIndex == this.lastAnimationIndex && this.animating == true) {
			  // we already have an animation for this? skip
		  }
		  else 
		  {
			this.setAnimation
			(
				spriteIndex, 
				otherGrid.lastAnimationFrequency,
				otherGrid.lastAnimationSet,
				otherGrid.lastAnimationSceneNumber
			);
		  }
	  }	  
	  otherGrid.animating = false;
  }
  transferEvents(otherGrid) {
	  
	  for(let i = 0; i < otherGrid.collisionEvents.length; i++) {
		  this.collisionEvents.push(otherGrid.collisionEvents[i]);
	  }
  }
  turnCollisionOn(arrayOfCollideWith) {
    this.collidesWith = arrayOfCollideWith;
    this.supportCollision = true;
  }
  turnCollisionOff() {
    this.collidesWith = [];
    this.supportCollision = false;
  }
  hasSpriteAlready(newSprite) {
    for (let i = 0; i < this.gridSprites.length; i++) 
      if (this.gridSprites[i].image == newSprite.image) return true;
    return false;
  }
  getSpriteIndex(sprite) {
	if (!this.hasSpriteAlready(sprite)) {
         this.gridSprites.push(sprite);
    }
    for (let i = 1; i < this.gridSprites.length + 1; i++) 
      if (this.gridSprites[i-1].image == sprite.image) return i;
    return -1;
  }
  translateSprite(index, otherGrid) {
	  if (typeof otherGrid.gridSprites == 'undefined') 		return;
	  
	  let otherSprite = otherGrid.gridSprites[index-1];

	  let spriteIndex = this.getSpriteIndex(otherSprite);
	  
	  return spriteIndex;
  }
  mergeGridsAt(x, y, z, otherGrid) {
	  
	if (typeof otherGrid != 'undefined' && otherGrid != null && typeof otherGrid.gridHeight == 'undefined') {
		this.chents.push(otherGrid);
		
		return;
	}
	
	  //todo: consider having sprite information (not just spriteindex) passed over as well.
	for (let k = 0; k < otherGrid.gridHeight; k++) {
		for (let j = 0; j < otherGrid.gridWidth; j++) {
			for (let i = 0; i < otherGrid.gridDepth; i++) {
				if (k+y < this.gridHeight && j+x < this.gridWidth && i+z < this.gridDepth)
					if (otherGrid.innerGrid[k][j][i] != null && otherGrid.innerGrid[k][j][i] > 0)
						this.innerGrid[k+y][j+x][i+z] = this.translateSprite(otherGrid.innerGrid[k][j][i], otherGrid);
			}
		}
	}
	this.transferAnimation(otherGrid);	
		
	this.transferEvents(otherGrid);
  }
  drawSolidCube(x, y, z, w, h, d, sprite) {
	 if (typeof sprite == 'string') {
		 sprite = new Sprite(0,0,32,32,sprite);
	 }
     if (!this.hasSpriteAlready(sprite)) {
         this.gridSprites.push(sprite);
     }
	 let spriteIndex = this.getSpriteIndex(sprite);
     for(let k = y; k < y+h; k++) {
      for (let j = x; j < x+w; j++) {
        for (let i = z; i < z+d; i++) {
          this.innerGrid[k][j][i] = spriteIndex;
        }
      }
     }
	 return this;
  }
  drawFullPlaneAt(y, sprite) {
	  
	 if (!this.hasSpriteAlready(sprite)) {
         this.gridSprites.push(sprite);
     }
	 let spriteIndex = this.getSpriteIndex(sprite);
	 
	 for (let j = 0; j < this.gridWidth; j++) {
        for (let i = 0; i < this.gridDepth; i++) { 
			this.innerGrid[y][j][i] = spriteIndex;
		}
	 }	
	
  }
  firstInRange(rangeIndex,x,y,z) {
	  if (this.unifiedRanges[rangeIndex].x == x && this.unifiedRanges[rangeIndex].y == y && this.unifiedRanges[rangeIndex].z == z) {
		  return true;
	  }
	  return false;
  }
  isInRange(x,y,z) {
	  for (let i = 0; i < this.unifiedRanges.length; i++) {
		  if (x >= this.unifiedRanges[i].x && y >= this.unifiedRanges[i].y && z >= this.unifiedRanges[i].z){
			  if (x < this.unifiedRanges[i].x + this.unifiedRanges[i].w && y < this.unifiedRanges[i].y + this.unifiedRanges[i].h && z < this.unifiedRanges[i].z + this.unifiedRanges[i].d) {
				  return i;
			  }
		  }
	  }
	  return -1;
  }
  unifyRange(x, y, z, w, h, d, sprite) {
		this.unifiedRanges.push({
				'x': x,
				'y': y,
				'z': z,
				'w': w,
				'h': h,
				'd': d,
				'sprite': sprite
		});
  }
  imageFromSpriteIndex(spriteIndex) {
    if (spriteIndex == 0) return null;
	if (typeof this.gridSprites[spriteIndex-1] != 'undefined'){
		return this.gridSprites[spriteIndex-1].image;
	}
	return this.imageFromSpriteIndex(0);
  }
  update() {
    
  }
  fireEventsFor(collideWith) {
      // among events listed, find a match and execute, or fail silently
      for (let i = 0; i < this.collisionEvents.length; i++) {
    
			 if (this.collisionEvents[i].x + this.x == collideWith.X && this.collisionEvents[i].y + this.y == collideWith.Y && this.collisionEvents[i].z + this.z == collideWith.Z) {
              this.collisionEvents[i].event(this, collideWith);
			 }
          
      }
  }
  wireEventFor(x, y, z, event) {
      this.collisionEvents.push({
          'x': (x * this.tileWidth),
          'y': (y * this.tileHeight),
          'z': (z * this.tileDepth),
          'event': event
      });
  }
  findIndexOf(thr) {
	for(let k = 0; k < this.gridHeight; k++) {
      for (let j = 0; j < this.gridWidth; j++) {
        for (let i = 0; i < this.gridDepth; i++) {
			if ((j * this.tileWidth) + this.x == thr.X && (k * this.tileHeight) + this.y == thr.Y && (i * this.tileDepth) + this.z == thr.Z)
				return { 'x': j, 'y': k, 'z': i };
		}
	  }
	}
	return { 'x': -1, 'y': -1, 'z': -1 };
  }
  enumerateThrs() {
    let thrs = [];
    
    for(let k = 0; k < this.gridHeight; k++) {
      for (let j = 0; j < this.gridWidth; j++) {
        for (let i = 0; i < this.gridDepth; i++) {
          if (this.innerGrid[k][j][i] > 0) {
			  let rangeIndex = this.isInRange(j, k, i);
			  if (rangeIndex == -1) {			  
				thrs.push(new thr(this.x + (j * this.tileWidth), this.y + (k * this.tileHeight), this.z + (i * this.tileDepth), this.tileWidth, this.tileHeight, this.tileDepth));
			  }
			  else if (this.firstInRange(rangeIndex,j,k,i)) {
					thrs.push(new thr
					(
						this.x + (j * this.tileWidth) + (this.tileWidth * 0.5 * (this.unifiedRanges[rangeIndex].w - 1)), 
						this.y + (k * this.tileHeight), 
						this.z + (i * this.tileDepth) + (this.tileDepth * 0.5 * (this.unifiedRanges[rangeIndex].d - 1)), 
						(this.unifiedRanges[rangeIndex].w * this.tileWidth), 
						(this.unifiedRanges[rangeIndex].h * this.tileHeight), 
						(this.unifiedRanges[rangeIndex].d * this.tileDepth)
					));
			  }
			  else {
				  // no-op
			  }
          }
        }
      }
     }
	 
	 for (let i = 0; i < this.chents.length; i++) {
		 let chentThrs = this.chents[i].enumerateThrs();
		 for (let j = 0; j < chentThrs.length; j++) {
			thrs.push(chentThrs[j]);
		 }
	 }
    
    return thrs;
  }
  addLightingToScene(scene, j, k, i) 
  {
	  let me = this;
	  		       if (targetScene == 1 && k % 3 == 0 && j % 4 == 0 && i % 4 == 0) {
		        	const light = new THREE.PointLight( 0x7fcfff, 0.5, 10, 2 );
				
				light.position.set(  me.x + (j * me.tileWidth), -1 + me.y + (k * me.tileHeight),  me.z + (i * me.tileDepth));
				
				scene.add( light );
				
				const light2 = new THREE.PointLight( 0x7fcfff, 0.5, 10, 4 );
				
				light2.position.set(  me.x + (j * me.tileWidth), 4 + me.y + (k * me.tileHeight),  me.z + (i * me.tileDepth));
				
				scene.add( light2 );
								
				const light3 = new THREE.PointLight( 0x7fcfff, 0.5, 10, 8 );
				
				light3.position.set(  me.x + (j * me.tileWidth), 2 + me.y + (k * me.tileHeight),  me.z + (i * me.tileDepth));
				
				scene.add( light3 );
			  }
			  
			  if ((k == (me.gridHeight - 1) || k == 0 )&& i % 3 == 0 && j % 3 == 0) 
			  {
				const light = new THREE.PointLight( 0x7fcfff, 0.5, 10, 2 );
				
				light.position.set(  me.x + (j * me.tileWidth), 2 + me.y + (k * me.tileHeight),  me.z + (i * me.tileDepth));
				
				scene.add( light );
				
				const light2 = new THREE.PointLight( 0x7fcfff, 0.5, 10, 4 );
				
				light2.position.set(  me.x + (j * me.tileWidth), 4 + me.y + (k * me.tileHeight), me.z + (i * me.tileDepth));
				
				scene.add( light2 );
								
				const light3 = new THREE.PointLight( 0x7fcfff, 0.5, 10, 8 );
				
				light3.position.set(  me.x + (j * me.tileWidth), 12 + me.y + (k * me.tileHeight),  me.z + (i * me.tileDepth));
				
				scene.add( light3 );
	}
  }
  addToScene(scene) {
	  let me = this;
	  
	  me.parentSceneNumber = scene.sceneNumber;
	  
	  if (typeof me.lastAnimationIndex != 'undefined') {
		  me.restoreAnimation();
	  }
	  
	return new Promise(function(resolve, reject) {   
           // 3d array traversal... foreach non null entry...
			let ct = -1;
           for(let k = 0; k < me.gridHeight; k++) {

	      for (let j = 0; j < me.gridWidth; j++) {

	        for (let i = 0; i < me.gridDepth; i++) {
			ct++;
        	  if (me.innerGrid[k][j][i] > 0) { // zero is *empty*
				 let rangeIndex = me.isInRange(j, k, i);
				 if (rangeIndex == -1) {
			  
               		const geometry = new THREE.BoxGeometry( me.tileWidth, me.tileHeight, me.tileDepth );
			   
			let imageName = me.imageFromSpriteIndex(me.innerGrid[k][j][i]);
			 
			let imagePath = location.origin + '/lib/content/';
			
			var texture = textureLoader.load
			(
				imagePath + imageName
			);
			 			
					me.addLightingToScene(scene, j,k,i);
						
        	       const material = new THREE.MeshLambertMaterial(
		       {
    	        	  map: texture, side: THREE.DoubleSide, opacity: me.opacity, 
				  transparent: (me.opacity < 1 ? true : false)
          	       });
				
	               const cube = new THREE.Mesh( geometry, material );
		 	  

			    texture.dispose();
			    material.dispose();
				geometry.dispose();
			  
					cube.position.x = me.x + (j * me.tileWidth);
                    cube.position.y = me.y + (k * me.tileHeight);
                    cube.position.z = me.z + (i * me.tileDepth);
		            scene.add( cube );
					//resolve(scene);

				}              			
			else if (me.firstInRange(rangeIndex,j,k,i))
			{
				// add it in...				
				    const geometry = new THREE.BoxGeometry
					( 
						(me.tileWidth * me.unifiedRanges[rangeIndex].w), 
						(me.tileHeight * me.unifiedRanges[rangeIndex].h), 
						(me.tileDepth * me.unifiedRanges[rangeIndex].d)
					);
			   
			let imageName = me.imageFromSpriteIndex(me.innerGrid[k][j][i]);
			 
			let imagePath = location.origin + '/lib/content/';
			
			var texture = textureLoader.load
			(
				imagePath + imageName
			);

			   texture.wrapS = THREE.RepeatWrapping; 
			   texture.wrapT = THREE.RepeatWrapping; 
			   texture.repeat.set( me.unifiedRanges[rangeIndex].w, me.unifiedRanges[rangeIndex].d  );
				const material = new THREE.MeshLambertMaterial(
		       {
    	        	  map: texture, side: THREE.DoubleSide, opacity: me.opacity, 
						transparent: (me.opacity < 1 ? true : false)
          	   });

				
	               const cube = new THREE.Mesh( geometry, material );
		 	  

			    texture.dispose();
			    material.dispose();
				geometry.dispose();
			  
					cube.position.x = me.x + (j * me.tileWidth) + (me.tileWidth * 0.5 * (me.unifiedRanges[rangeIndex].w - 1)),
                    cube.position.y = me.y + (k * me.tileHeight) /*+ (me.tileHeight * 0.5 * me.unifiedRanges[rangeIndex].h)*/,
                    cube.position.z = me.z + (i * me.tileDepth) + (me.tileDepth * 0.5 * (me.unifiedRanges[rangeIndex].d - 1));
		            scene.add( cube );
					//resolve(scene); // ???
			}
			else {
				// no-op... but maybe add lighting regardless?
							me.addLightingToScene(scene, j,k,i);
			}

	    }
			}
			

			}

		   }
		   
		   me.addChentsToScene(me.chents.slice(), scene).then(x => {
				resolve(x);
		   });
	});
  }  
  addChentsToScene(chents, scene) {
	  let me = this; 
	  return new Promise(function(resolve, reject) {
		  if (chents.length > 0) {
				me.addChentToScene(chents[0], scene).then(x => {
				chents.shift();
				resolve(me.addChentsToScene(chents, x));
			  });
		  }
		  else {
			  resolve(scene);
		  }
	  });
  }
  addChentToScene(chent, scene) {
	  let me = this;
	  return new Promise(function(resolve, reject) {
		  chent.addToScene(scene).then(x => {
			 resolve(x); 
		  });
	  });
  }
  render() {
	  
  }
}
class stairCase {
   constructor (x, y, z, w, h, d, steps, orientation) {
     this.X = x;
     this.Y = y;
     this.Z = z;
     this.W = w;
     this.H = h;
     this.D = d;
     this.stepCount = steps;
	 this.Orientation = orientation; // ( N S E W )
   }
   fireEventsFor(collideWith) {

   }
   enumerateThrs() {
       let thrs = [];
    
	   let stepHeight = (this.H / parseFloat(this.stepCount));
	   let stepWidth = 0;
	   let stepDepth = 0;
	   if (this.Orientation == 'N' || this.Orientation == 'S') {
		   stepWidth = this.W;
		   stepDepth = (this.D / parseFloat(this.stepCount));
	   }
	   else {
		   stepWidth = (this.W / parseFloat(this.stepCount));
		   stepDepth = this.D;
	   }
	   
	   for (let i = 0; i < this.stepCount; i++) {
			
			if (this.Orientation == 'N')
			{ 
				thrs.push(new thr(
					this.X, 
					(this.Y + (stepHeight * (i+1)) / parseFloat(2)), 
					(this.Z + (stepDepth * (this.stepCount - (i+0.5)))), 
					this.W, 
					(stepHeight * (i+1)), 
					stepDepth
				));
			}
			else if (this.Orientation == 'S')
			{
				thrs.push(new thr(
					this.X, 
					(this.Y + (stepHeight * (i+1)) / parseFloat(2)), 
					(this.Z + (stepDepth * (i+0.5))), 
					this.W, 
					(stepHeight * (i+1)), 
					stepDepth
				));
			}
			else if (this.Orientation == 'E')
			{
				thrs.push(new thr(
					(this.X + (stepWidth * (i+1))), 
					(this.Y + (stepHeight * (i+1)) / parseFloat(2)), 
					(this.Z), 
					stepWidth, 
					(stepHeight * (i+1)), 
					this.D
				));
			}
			else 
			{
				thrs.push(new thr(
					(this.X + (stepWidth * (i+1))), 
					(this.Y + (stepHeight * (this.stepCount - (i))) / parseFloat(2)), 
					(this.Z), 
					stepWidth, 
					(stepHeight * (this.stepCount - (i))), 
					this.D
				));
			}
	   }
	   return thrs;
   }
   addToScene(scene) {
	   let me = this;

	   return new Promise(function(resolve,reject) {
		   
		   let allThrs = me.enumerateThrs();
	   	   for (let i = 0; i < allThrs.length; i++) {
		   
			const geometry = new THREE.BoxGeometry
			( 
				allThrs[i].W, 
				allThrs[i].H, 
				allThrs[i].D
			);
			   
			let imageName = '320brick.png'; 
			
			let imagePath = location.origin + '/lib/content/';
			
 		   	var texture = textureLoader.load
			(
					imagePath + imageName
			);
			 
           		const material = new THREE.MeshLambertMaterial(
			{
		    	        map: texture, side: THREE.DoubleSide
          		});
				

			
			const cube = getTextureWrappedMesh
			(
				texture, 				
				geometry, 
				1.25
			);
			   
			cube.position.x = allThrs[i].X;
			cube.position.y = allThrs[i].Y;
			cube.position.z = allThrs[i].Z;
			
				texture.dispose();
				material.dispose();
				geometry.dispose();
			
	                scene.add( cube );			
	   	}
	   });
   }
}
class spiralStairCase {
   constructor (x, y, z, w, h, d, stepsPerFlight, flights, initialOrientation, clockwiseNess, enclose) {
     this.X = x;
     this.Y = y;
     this.Z = z;
     this.W = w;
     this.H = h;
     this.D = d;
     this.stepCount = stepsPerFlight;
	 this.flightCount = flights;
	 this.Orientation = initialOrientation; // ( N S E W )
	 this.Clockwise = clockwiseNess;
	 this.Enclose = enclose;
   }
   fireEventsFor(collideWith) {
	   
   }
   enumerateThrs() {
       let thrs = [];
	   // create and re-enumerate staircases and plain thrs
	   let orientation = this.Orientation;

	   for (let j = 0; j < this.flightCount; j++) 
	   {
			let flightThrs = this.createFlight(this.Y + (this.H * (j)), orientation);
			
			for(let i = 0; i < flightThrs.length - (j == this.flightCount - 1 ? 3 : 0); i++) {
				thrs.push(flightThrs[i]);
			}
	
			orientation = this.nextOrientation(this.nextOrientation(orientation));
			
	   }
	   
	   return thrs;
   }
   getQuadrantBounds(yValue, orientation) {
	   let dby = 1;
	    if (this.Clockwise == true) {
		   if (orientation == 'N') {
			   return new thr(this.X, yValue+(this.H/parseFloat(dby)), this.Z+(this.D/parseFloat(dby)), this.W, this.H, this.D);
		   }
		   if (orientation == 'S') {
			   return new thr(this.X+(this.W/parseFloat(dby)), yValue, this.Z/*+(this.D/parseFloat(dby))*/,this.W, this.H, this.D);
		   }
		   if (orientation == 'E') {
			   return new thr(this.X, yValue, this.Z,this.W, this.H, this.D);
		   }
		   if (orientation == 'W') {
			   return new thr(this.X+(this.W/parseFloat(dby)), yValue, this.Z+(this.D/parseFloat(dby)),this.W, this.H, this.D);
		   }
	   }
	   else {
		   if (orientation == 'N') {
			   return new thr(this.X+(this.W/parseFloat(dby)),yValue+(this.H/parseFloat(dby)), this.Z+(this.D/parseFloat(dby)),this.W, this.H, this.D);
		   }
		   if (orientation == 'S') {
			   return new thr(this.X, yValue, this.Z,this.W, this.H, this.D);
		   }
		   if (orientation == 'E') {
			   return new thr(this.X+(this.W/parseFloat(dby)), yValue, this.Z,this.W, this.H, this.D);
		   }
		   if (orientation == 'W') {
			   return new thr(this.X, yValue, this.Z+(this.D/parseFloat(dby)),this.W, this.H, this.D);
		   }
	   }
	   return new thr(0, 0, 0, 0, 0, 0);
   }
   createFlight(yStart, orientation)
   {
	   let thrs = [];
	   
	   let qBounds = this.getQuadrantBounds(yStart, orientation);
	   
	   let newStairs = new stairCase(qBounds.X, yStart, qBounds.Z + ((orientation == 'S' ? 2 : 0) * (this.D / parseFloat(2))), this.W, this.H, this.D, this.stepCount, orientation);
	   
	   let stairThrs = newStairs.enumerateThrs();
	   
	   for (let i = 0; i < stairThrs.length; i++) {
			thrs.push(stairThrs[i]);
	   }
	   
	   qBounds = this.getQuadrantBounds(yStart, this.nextOrientation(orientation));
	 
	   if (orientation == 'S') {
		   qBounds.Z +=  ((orientation == 'S' ? 2 : 0) * (qBounds.D / parseFloat(2)));
	   }
	   
	   // calculate X, Y, Z etc to create a landing
	   thrs.push(new thr(qBounds.X , qBounds.Y+(this.H/parseFloat(2)), qBounds.Z + (this.D/parseFloat(2)), this.W, this.H, this.D));
	   
	   qBounds = this.getQuadrantBounds(yStart, this.nextOrientation(this.nextOrientation(orientation)));
	   
	   	   if (orientation == 'S') {
		   qBounds.Z +=  ((orientation == 'S' ? 2 : 0) * (qBounds.D / parseFloat(2)));
		   qBounds.Y -= qBounds.H;
	   }
	   
	   // a second landing to the right or left of that one
	     thrs.push(new thr(qBounds.X, qBounds.Y+(this.H/parseFloat(2)), qBounds.Z + (this.D/parseFloat(2)), this.W, this.H, this.D));
	   
	   if (this.Enclose) {
		   // in addition to the previous landing, our staircase will require
		   // three blocks (tall) to the left or right of it, plus bound the 
		   // landing by two blocks tall...
		   // Doing this later...
	   }
	   
	   return thrs;
   }
   nextOrientation(orientation){
	   if (this.Clockwise){
		   if (orientation == 'N') return 'E';
		   if (orientation == 'E') return 'S';
		   if (orientation == 'S') return 'W';
		   if (orientation == 'W') return 'N';
	   }
	   else{
		   if (orientation == 'N') return 'W';
		   if (orientation == 'W') return 'S';
		   if (orientation == 'S') return 'E';
		   if (orientation == 'E') return 'N';
	   }
   }
   addToScene(scene) {
	   let me = this;
	   return new Promise(function(resolve, reject) {
 
		   let allThrs = me.enumerateThrs();
	   	   for (let i = 0; i < allThrs.length; i++) {
		   
			const geometry = new THREE.BoxGeometry
			( 
				allThrs[i].W, 
				allThrs[i].H, 
				allThrs[i].D
			);
			   
			let imageName = '320brick.png'; 
						
			let imagePath = location.origin + '/lib/content/';
			

		    	var texture = textureLoader.load
			(
					imagePath + imageName
			);
			 
            		const material = new THREE.MeshLambertMaterial(
			{
    	          		map: texture, side: THREE.DoubleSide
          		});
				
			if (i % 24 == 0) 
			{
				const light = new THREE.PointLight( 0x0fff7f, 0.4, 10, 2 );
				
				light.position.set(  allThrs[i].X, 4 + allThrs[i].Y, allThrs[i].Z);
				
				scene.add( light );
				
				const light2 = new THREE.PointLight( 0x0fff7f, 0.4, 10, 2 );
				
				light2.position.set(  allThrs[i].X, 1 + allThrs[i].Y, allThrs[i].Z);
				
				scene.add( light2 );
			}
				
            		const cube = new THREE.Mesh( geometry, 
					
					material
										);
			cube.position.x = allThrs[i].X;
			cube.position.y = allThrs[i].Y;
			cube.position.z = allThrs[i].Z;
			
			material.dispose();
			texture.dispose();
			geometry.dispose();
			
            		scene.add( cube );
			resolve(scene);
	   	}
	   });
   }
}
class multiLevelTower {
	constructor(x, y, z, gridWidth, gridDepth, tileWidth, tileHeight, tileDepth, levelHeight, levelCount, defaultSprite) {
		this.X = x;
		this.Y = y;
		this.Z = z;
		this.GridWidth = gridWidth;
		this.GridDepth = gridDepth;
		this.TileWidth = tileWidth;
		this.TileHeight = tileHeight;
		this.TileDepth = tileDepth;
		this.LevelHeight = levelHeight;
		this.LevelCount = levelCount;
		this.DefaultSprite = defaultSprite;
		this.cachedSceneContents = null;
	}
	
	fireEventsFor(collideWith) {
	   
    }

	enumerateSceneContents() {
		if (this.cachedSceneContents != null) {
			//return this.cachedSceneContents;
		}			
		let structures = [];
		for (let i = 0; i < this.LevelCount; i++) {
			// for each level, make a grid...
			let grid = new Grid3D(0, (this.LevelHeight * i), 0, this.TileWidth, this.TileHeight, this.TileDepth, this.GridWidth, this.LevelHeight, this.GridDepth);
			
			grid.drawFullPlaneAt(3, this.DefaultSprite);
			//if (i != (this.LevelCount - 1))
				grid.unifyRange(0, 3, 0, this.GridWidth, 1, this.GridDepth, null); 
			
			/* START LEVEL MERGE */
			let newGrids = null;
			
			if (i == this.LevelCount - 1) {
				// last floor
				newGrids = defaultTopLevel();
			}
			else if (i == 0) {
				// first floor
				newGrids = defaultGroundLevel();
			}
			else {
				// random floor							
				newGrids = getRandomBasicLevel();
			}

			for (let n = 0; n < newGrids.length; n++) {
				// what to do if newGrids[i] is not a grid?
				grid.mergeGridsAt(0, 0, 0, newGrids[n]);				
			}

			/* END LEVEL MERGE */

			let stairsYOffset = (this.LevelHeight / parseFloat(2)) - (this.TileHeight * 0.5);
			if (i == 0 || i % 2 == 0 && i < this.LevelCount - 1) {
				let bonusOffset = -1.5;
				
				let stairs = new spiralStairCase((grid.x + (grid.tileWidth * grid.gridWidth * 0.5)), (this.LevelHeight * i) + stairsYOffset, 0 + bonusOffset, 
				2, 1, 2, 
				9, this.LevelHeight, 'N', true, false);

				structures.push(stairs);
				
				structures.push(new TextPlane
				(
					grid.x + (grid.tileWidth * grid.gridWidth * 0.5) + 1.25, 
					(this.LevelHeight * i) + stairsYOffset + 0.75, 
					3.25 + bonusOffset,
					0.5, 0.125, 0.125, `<span style="color:green"><h2>TO ${(i+2).toString()}F</h2></span>`
				));
			}
			else if (i < this.LevelCount - 1){
				let bonusOffset = -4;
				
				let stairs = new spiralStairCase((grid.x + (grid.tileWidth * grid.gridWidth * 0.5)), (this.LevelHeight * i) + stairsYOffset, (grid.z + (grid.tileDepth * grid.gridDepth) - (grid.tileDepth * 2.5) + bonusOffset), 
				2, 1, 2, 
				9, this.LevelHeight, 'S', true, false);

				structures.push(stairs);
				
				structures.push(new TextPlane(
				(grid.x + (grid.tileWidth * grid.gridWidth * 0.5)) + 0.5, 
				(this.LevelHeight * i) + stairsYOffset + 0.75, 
				(grid.z + (grid.tileDepth * grid.gridDepth) - (grid.tileDepth * 2.5)) + 3 + bonusOffset, 
				0.5, 0.125, 0.125, `<span style="color:green"><h2>TO ${(i+2).toString()}F</h2></span>`));
			}
			
			structures.push(grid);

		}
		this.cachedSceneContents = structures;
		return structures;
	}
    enumerateThrs() {
		let thrs = [];
		
		let structures = this.enumerateSceneContents();
		for (let j = 0; j < structures.length; j++) {
			let structureThrs = structures[j].enumerateThrs();
			for (let i = 0; i < structureThrs.length; i++) {
				thrs.push(structureThrs[i]);
			}
		}

		return thrs;
    }
	addToScene(scene) {
		let me = this;
		return new Promise(function(resolve, reject) 
		{			
			let structures = me.cachedSceneContents != null ? 
			me.enumerateSceneContents() : me.enumerateSceneContents();

			let ct = 0;
			let previousCt = -1;
			while (ct < structures.length) 
			{
				if (previousCt == ct) {
					
				}
				else {
					structures[ct].addToScene(scene).then(x => {
						ct++;
					});
				}
				previousCt = ct;
			}
			resolve();			
		});
	}
}
