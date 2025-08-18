
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
    this.innerGrid = [this.gridHeight];
    for(let j = 0; j < this.gridHeight; j++) {
      this.innerGrid[j] = [this.gridWidth];
      for (let i = 0; i < this.gridWidth; i++) {
          this.innerGrid[j][i] = 0; // zero is defaultSprite
      }
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
  /*drawRectangle(x, y, w, h, sprite) {
      if (!this.hasSpriteAlready(sprite)) {
         this.bonusSprites.push(sprite);
     }
     let spriteIndex = this.getSpriteIndex(sprite);
     for(let j = y; j < y+h; j++) {
      for (let i = x; i < x+w; i++) {
          this.innerGrid[j][i] = spriteIndex;
      }
     }
  }*/
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
    if (spriteIndex == 0) return this.defaultSprite.image;
    return this.bonusSprites[spriteIndex-1].image;
  }
  wouldTileOverlap(x, y, offsetX, offsetY) {

    for (let i = 0; i < this.collidesWith.length; i++){
        if (new Rectangle(this.collidesWith[i].x, this.collidesWith[i].y, this.collidesWith[i].w, this.collidesWith[i].h)
              .overlaps(new Rectangle(this.x + (x * this.tileWidth) + offsetX, this.y + (y * this.tileHeight) + offsetY, this.tileWidth, this.tileHeight ))) 
        {
           return true; 
        }
    }
    return false;
    
  }
  
  isOverlapping() {
    for (let j = 0; j < this.gridHeight; j++) {
      for (let i = 0; i < this.gridWidth; i++) {
        if (this.wouldTileOverlap(i, j, 0, 0)) return true;
      }
    }
    return false;
  }
  wouldCauseCollision(xMove, yMove) {
     // if it isn't overlapping now, and the move would cause overlapping, return true.
      if (!this.isOverlapping()) {
        for (let j = 0; j < this.gridHeight; j++) {
          for (let i = 0; i < this.gridWidth; i++) {
             if (this.wouldTileOverlap(i, j, xMove, yMove)) return true;
          }
        }
      }
    return false;
  }
  update() {
    
  }
  render() {
    for (let j = 0; j < this.gridHeight; j++) {
      for (let i = 0; i < this.gridWidth; i++) {
        let image = this.imageFromSpriteIndex(this.innerGrid[j][i]);
        //console.log('Drawing image ' + image + ' at ' + (this.x + (this.tileWidth * i)).toString() + '; ' + (this.y + (this.tileHeight * j)).toString());
        drawImage(this.x + (this.tileWidth * i), this.y + (this.tileHeight * j), image);
      }
    }
  }
}
