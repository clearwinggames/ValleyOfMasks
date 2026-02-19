
//const Rectangle = 
  class Rectangle
  //  Model 
  {
  constructor(x, y, height, width) {
    this.x = x;
    this.y = y;
    this.height = height;
    this.width = width;
  }
  left() {
    return this.x;
  }
  right() {
    return this.x + this.width;
  }
  top() {
    return this.y;
  }
  bottom() {
    return this.y + this.height;
  }
  overlaps(otherRect){
    if (this.x + this.width > otherRect.x && this.x < otherRect.x + otherRect.width && this.y + this.height > otherRect.y && this.y < otherRect.y + otherRect.height)
      return true;
    return false;
  }
}
//const Sprite = 
  class Sprite
    //Model 
    extends Rectangle {
  constructor(x, y, height, width, image) {
    super(x, y, width, height);
    this.image = image;
    this.frequency = 0;
    this.cycleCounter = 0;
    this.index = 0;
    this.updateActions = (me) => { };
  }
  turnOnAnimation(images, frequency) {
    this.image = images;
    this.frequency = frequency;
    this.cycleCounter = 0;
    this.index = 0;
  }
  prependBehavior(newBehavior) {
      oldActions = this.updateActions;
      this.updateActions = (me) => {
          newBehavior(me);
          oldActions(me);
      }
  }
  appendBehavior(newBehavior) {
      oldActions = this.updateActions;
      this.updateActions = (me) => {
          oldActions(me);
          newBehavior(me);
      }
  }
  turnOnGravity(accelerationDueTo, terminalVelocity) {
      this.appendBehavior((me) => 
      {
          if (typeof me.momentumY == 'undefined') me.momentumY = 0;
          me.momentumY += accelerationDueTo;
          if (me.momentumY > terminalVelocity) me.momentumY = terminalVelocity;
          me.y += me.momentumY;
      });
  }
  turnOnGravityRelative(accelerationDueTo, terminalVelocity) {
      this.appendBehavior((me) => 
      {
          if (typeof me.momentumY == 'undefined') me.momentumY = 0;
          me.momentumY += accelerationDueTo;
          if (me.momentumY > terminalVelocity) me.momentumY = terminalVelocity;
          moveCurrentSceneBy(0, me.momentumY);
          me.y += me.momentumY;
      });
  }
  update() {
     this.updateActions(this);
  }
  getRenderImage() {
    if (this.frequency > 0 && this.image.length != 'undefined') {
      this.cycleCounter++;
      if (this.cycleCounter == this.frequency) {
          this.cycleCounter = 0;
          this.index++;
          if (this.index >= this.image.length) {
            this.index = 0;
          }
      }
      return this.image[this.index];
    }
    return this.image;
  }
  render() {    
      drawImage(this.x, this.y, this.getRenderImage());        
  }
}

//const Grid = 
  class Grid
  //  Model 
  {
  constructor(x, y, tileWidth, tileHeight, gridWidth, gridHeight, defaultSprite) {
    this.x = x;
    this.y = y;
    this.tileWidth = tileWidth;
    this.tileHeight = tileHeight;
    this.gridWidth = gridWidth;
    this.gridHeight = gridHeight;
    this.defaultSprite = defaultSprite;
    this.bonusSprites = [];
    this.supportCollision = false;
    this.collidesWith = [];
    this.collisionAction = (thisGrid, collidedWith, tile) => { };
    this.bounds = [];
    this.innerGrid = [this.gridHeight];
    for(let j = 0; j < this.gridHeight; j++) {
      this.innerGrid[j] = [this.gridWidth];
      for (let i = 0; i < this.gridWidth; i++) {
          this.innerGrid[j][i] = 0; // zero is defaultSprite
      }
    }
  }
  totalWidth() {
    return this.gridWidth * this.tileWidth;
  }
  totalHeight() {
    return this.gridHeight * this.tileHeight;
  }
  turnCollisionOn(arrayOfCollideWith, collisionAction) {
    this.collidesWith = arrayOfCollideWith;
    if (typeof collisionAction != 'undefined') this.collisionAction = collisionAction;
    this.supportCollision = true;
  }
  turnCollisionOff() {
    this.collidesWith = [];
    this.supportCollision = false;
  }
  turnBoundsOn(canvasElement) {
    let xRes = canvasElement.width;
    let yRes = canvasElement.height;
    let bounds = [ { 'x': 0, 'y': 0, 'w': this.totalWidth(), 'h': this.totalHeight(), 'canvas': { 'w': xRes, 'h': yRes  } } ];
    this.bounds = bounds;
    this.supportBounds = true;
  }
  turnBoundsOff() {
    this.bounds = [];
    this.supportBounds = false;
  }
  hasSpriteAlready(newSprite) {
    if (this.defaultSprite.image == newSprite.image) return true;
    for (let i = 0; i < this.bonusSprites.length; i++) 
      if (this.bonusSprites[i].image == newSprite.image) return true;
    return false;
  }
  getSpriteIndex(sprite) {
    if (this.defaultSprite.image == sprite.image) return 0;
    for (let i = 1; i < this.bonusSprites.length + 1; i++) 
      if (this.bonusSprites[i-1].image == sprite.image) return i;
    return -1;
  }
  fillWith(sprite) {
     if (!this.hasSpriteAlready(sprite)) {
         this.bonusSprites.push(sprite);
     }
     let spriteIndex = this.getSpriteIndex(sprite);
     for(let j = 0; j < this.gridHeight; j++) {
      for (let i = 0; i < this.gridWidth; i++) {
          this.innerGrid[j][i] = spriteIndex;
      }
    }
  }
  drawSolidRectangle(x, y, w, h, sprite) {
      if (!this.hasSpriteAlready(sprite)) {
         this.bonusSprites.push(sprite);
     }
     let spriteIndex = this.getSpriteIndex(sprite);
     for(let j = y; j < y+h; j++) {
      for (let i = x; i < x+w; i++) {
          this.innerGrid[j][i] = spriteIndex;
      }
     }
  }
  imageFromSpriteIndex(spriteIndex) {
    if (spriteIndex == 0) return this.defaultSprite.getRenderImage();
    
    return this.bonusSprites[spriteIndex-1].getRenderImage();
  }
  wouldTileOverlap(x, y, offsetX, offsetY) {
    
    console.log('Checking overlap against ' + this.collidesWith.length.toString() + ' collide-ables.  Grid (parent) has coordinates (y, x) ' + this.y.toString() + ' and ' + this.x.toString());
    
    for (let i = 0; i < this.collidesWith.length; i++){
        //console.log('Collideable has coordinates (y, x) ' + this.collidesWith[i].y.toString() + ' and ' + this.collidesWith[i].x.toString());
        if (new Rectangle(this.collidesWith[i].x, this.collidesWith[i].y, this.collidesWith[i].width, this.collidesWith[i].height)
              .overlaps(new Rectangle(this.x + (x * this.tileWidth) + offsetX, this.y + (y * this.tileHeight) + offsetY, this.tileWidth, this.tileHeight ))) 
        {
           return i;
        }
    }
    return -1;
    
  }
  
  isOverlapping() {
    for (let j = 0; j < this.gridHeight; j++) {
      for (let i = 0; i < this.gridWidth; i++) {
        if (this.innerGrid[j][i] >= 0) {
          if (this.wouldTileOverlap(i, j, 0, 0) >= 0) return true;
        }
      }
    }
    return false;
  }
  wouldCauseCollision(xMove, yMove) {
     // if it isn't overlapping now, and the move would cause overlapping, return true.
      if (!this.isOverlapping()) {
        for (let j = 0; j < this.gridHeight; j++) {
          for (let i = 0; i < this.gridWidth; i++) {
            if (this.innerGrid[j][i] >= 0) 
            {
               let wto = this.wouldTileOverlap(i, j, xMove, yMove);
               if (wto >= 0) {
                 this.collisionAction(this, this.collidesWith[wto], this.innerGrid[j][i], j, i);
                 return true;
               }
            }
          }
        }
      }
    return false;
  }
  wouldExitBounds(xMove, yMove) {
    // this isn't collision, it's whether or not we would "draw" a part of the scene that is outside of the bounds
    // if any part of what's drawn in the scene (based on the one grid) would be outside of the bounds, return true
    for (let i = 0; i < this.bounds.length; i++) 
    {   // somewhere in here it should be based on the location of the grid (x, y) relative to canvas bounds...
        if (yMove > 0 && this.y + yMove > 0) return true;
        if (yMove < 0 && yMove + this.y + this.totalHeight() < this.bounds[i].canvas.h) return true;
        if (xMove > 0 && this.x + xMove > 0) return true;
        if (xMove < 0 && xMove + this.x + this.totalWidth() < this.bounds[i].canvas.w) return true;
    }
    return false;
  }
  update() {
    
  }
  render() {
    for (let j = 0; j < this.gridHeight; j++) {
      for (let i = 0; i < this.gridWidth; i++) {
        if (this.innerGrid[j][i] >= 0) {
          let image = this.imageFromSpriteIndex(this.innerGrid[j][i]);
          //console.log('Drawing image ' + image + ' at ' + (this.x + (this.tileWidth * i)).toString() + '; ' + (this.y + (this.tileHeight * j)).toString());
          
          drawImage(this.x + (this.tileWidth * i), this.y + (this.tileHeight * j), image);
        }
      }
    }
  }
}
