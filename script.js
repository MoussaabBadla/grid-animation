var canvas = document.getElementById("canvas");

var ctx = canvas.getContext("2d");

canvas.width = 500;
canvas.height = 500;

class Cell {
  constructor(effect, x, y , index) {

    this.effect = effect;
    this.x = x;
    this.y = y;
    this.positionX = this.effect.width / 2; 
    this.positionY = this.effect.height / 2;
    this.speedX;
    this.speedY;
    this.width = this.effect.cellWidth;
    this.height = this.effect.cellHeight;
    this.image = document.getElementById("myimage");
    this.slideX = 0;
    this.slideY = 0;
    this.vx = 0;
    this.vy = 0;
    this.ease = 0.1;
    this.friction = 0.9;
    this.randomize = Math.random() * 10 + 2,
    this.index = index;
    this.start();


  }
  draw(context) {
    context.drawImage(
      this.image,
      this.x + this.slideX,
      this.y + this.slideY,
      this.width,
      this.height,
      this.positionX ,
      this.positionY ,
      this.width,
      this.height,
      
    
    );
    context.strokeRect(this.positionX, this.positionY, this.width, this.height);
    
  }
  start() {
    this.speedX = (this.x - this.positionX) / this.randomize;
    this.speedY =(this.y - this.positionY) / this.randomize;   

}

  update(context) {
    // if statement to stop the animation when the cell reach the target position
    if (Math.abs(this.speedX) > 0.1 || Math.abs(this.speedY)> 0.1) {
     this.positionX += this.speedX;
     this.positionY += this.speedY;
     this.speedX = (this.x - this.positionX) / this.randomize;
    this.speedY =(this.y - this.positionY) / this.randomize;     

    }

    // calculate the distance between the mouse and the cell
    const dx = this.effect.mouse.x - this.x ;
    const dy = this.effect.mouse.y - this.y ;
    const distance = Math.hypot(dx, dy);
    if (distance < this.effect.mouse.raduis) {

      // calculate the angle between the mouse and the cell

      const angle = Math.atan2(dy, dx);


      // calculate the force of the cell to the mouse

      const force = distance / this.effect.mouse.raduis;
      // calculate the velocity of the cell
      this.vx = force * Math.cos(angle);
      this.vy = force * Math.sin(angle);
    }
    // apply the velocity to the cell

    this.slideX -= (this.vx *= this.friction) + this.slideX * this.ease;
    this.slideY -= (this.vy *= this.friction) + this.slideY * this.ease;

  }
  
}


class Effect {
  constructor(canvas) {
    this.canvas = canvas;
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.cellWidth = this.width / 60;
    this.cellHeight = this.height / 60;
    this.cell = new Cell(this, 0, 0);
    this.imageGrid = [];
    this.creatGrid();
    this.mouse = {
      x: undefined,
      y: undefined,
      raduis : 80,
    
    }
    // add event listener to track the mouse position
    this.canvas.addEventListener('mousemove', (e) => {
      this.mouse.x = e.offsetX;
      this.mouse.y = e.offsetY;
    })
    this.canvas.addEventListener('mouseleave', (e) => {
      this.mouse.x = undefined;
      this.mouse.y = undefined;
    })

  }

  // create the grid of cells using nested loops to get matrix of cells

  creatGrid() {
    let index = 0 ; 
    for (let i = 0; i < this.height; i += this.cellHeight) {
      for (let j = 0; j < this.width; j += this.cellWidth) {
        index++;
        this.imageGrid.unshift(new Cell(this, j, i , index));
      }
    }
  }

  // render the cells and update the cells
  render(context) {
    this.imageGrid.forEach(cell => {
        cell.draw(context);
        cell.update(context);

    });
  }
}
const effect = new Effect(canvas);



// animate the cells


 function animate (canvas)  {

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  effect.render(ctx);
  requestAnimationFrame(animate);
}




requestAnimationFrame(animate);
