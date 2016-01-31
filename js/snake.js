/**********************************CanvasState***************************************/
function CanvasState (canvas) {
	//Initial some attribute
	this.canvas = canvas ;
	this.ctx = canvas.getContext("2d");
	this.width = canvas.width;	
 	this.height = canvas.height;
	this.snakesArray = [] ;//collection of snake body units 
	this.foodArray = [] ;  //collection of food
	this.snake_head_x = 100;
	this.snake_head_y = 100;
	this.canvas_unit = 20;
	//Important！！！！！！！！！！canvas != canvasState
	var myState = this;
	this.direction = "right";		//initial direction
	this.lastDirection = "right";	//make snake not override itself
	this.death = false;
	this.snakeScore = 0 ;
	this.pause = false;
	this.speed = 100;
	document.getElementById("score").innerHTML = this.snakeScore ;

	
	//Event mousedown
	this.canvas.addEventListener('mousedown',function(e){
		console.log("mousedown");
	},false);

	//Event keyboard
	this.canvas.addEventListener('keydown',doKeyDown,false);
	//keyboard event
	function doKeyDown(e){
			
		if (e.keyCode == 87){ //上  
				if(myState.lastDirection != "down"){
					myState.direction = "up";
					myState.lastDirection = "up";
				}
		}else if (e.keyCode == 83){//下
				if(myState.lastDirection != "up"){
					myState.direction = "down";
					myState.lastDirection = "down";
				}
		}else if (e.keyCode == 68){//右
				if(myState.lastDirection != "left"){
		    		myState.direction = "right";
		    		myState.lastDirection = "right";
		    	}
		}else if (e.keyCode == 65){//左
				if(myState.lastDirection != "right"){
					myState.direction = "left";
					myState.lastDirection = "left";
				}
		}
		if(e.keyCode ==80){
				myState.pause = !myState.pause;
				console.log("myState.pause :"+myState.pause);
		}
		
	}
}//End CanvasState	

	//add snake unit
	CanvasState.prototype.addSnake = function(){

		if(this.direction == "up"){
			this.snakesArray.push(new Snake(this.snake_head_x,this.snake_head_y-this.canvas_unit,this.canvas_unit,this.canvas_unit));
		}
		if(this.direction == "down"){
			this.snakesArray.push(new Snake(this.snake_head_x,this.snake_head_y+this.canvas_unit,this.canvas_unit,this.canvas_unit));
		}
		if(this.direction == "right"){
			this.snakesArray.push(new Snake(this.snake_head_x+this.canvas_unit,this.snake_head_y,this.canvas_unit,this.canvas_unit));
		}
		if(this.direction == "left"){
			this.snakesArray.push(new Snake(this.snake_head_x-this.canvas_unit,this.snake_head_y,this.canvas_unit,this.canvas_unit));
		}
	}

	

	CanvasState.prototype.clear = function() {
  		this.ctx.clearRect(0, 0, this.width, this.height);
	}

	CanvasState.prototype.moveScreen = function(){
		var myState = this;

		if(!this.pause){
			this.clear();
			this.autoRun();
			this.checkBorder();
			this.rebuildSnake();
			this.draw();
			this.checkEatSelf();
			this.checkEatFood();


			if(this.death){
				this.gameOver();
			}
		}//end if pause
		if(!this.death){
			setTimeout(function(){myState.moveScreen();}, myState.speed);
		}
	}
	CanvasState.prototype.generateFood = function() {
		var myState = this; 
		//if function inside function can't refer this;
		function getRandom(){	
        	return(Math.floor(Math.random()*(myState.width-myState.canvas_unit) ));
        }
        
		var foodRandom_x = getRandom();
        var foodRandom_y = getRandom();

        while (!this.checkRandomFood(foodRandom_x,foodRandom_y)) {//檢查x,y座標是否符合條件，若不適合重新產生			
            var foodRandom_x = getRandom();
      		var foodRandom_y = getRandom();
        }
		this.foodArray.push(new Food(foodRandom_x,foodRandom_y,this.canvas_unit,this.canvas_unit));
	
	}

	CanvasState.prototype.checkEatFood = function() {
		//console.log("this.foodArray[0].x == this.snakesArray[i].x :"+(this.foodArray[0].x == this.snakesArray[0].x) );
		for(var i=0;i<this.snakesArray.length;i++){
			if(this.foodArray[0].x == this.snakesArray[i].x && this.foodArray[0].y == this.snakesArray[i].y){
				//add score			
				this.snakeScore = (this.snakeScore+10);
				document.getElementById("score").innerHTML = this.snakeScore ;
				//control foodArray
				this.foodArray.pop();
				this.generateFood();
				this.addSnake();
			}
		}
	}
	CanvasState.prototype.checkRandomFood = function(x,y) {
		if(x % this.canvas_unit != 0 || y % this.canvas_unit != 0)	return false;
		if(x < this.canvas_unit || y < this.canvas_unit)	return false;

		for(var i=0;i<this.snakesArray.length;i++){
			if(x == this.snakesArray[i].x && y == this.snakesArray[i].y) return false;
		}
		return true;
	}
	
	CanvasState.prototype.rebuildSnake = function() {
		this.snakesArray.splice(0,0,new Snake(this.snake_head_x,this.snake_head_y,this.canvas_unit,this.canvas_unit) );
		this.snakesArray.pop();
	}

	CanvasState.prototype.draw = function(){
		var snakes = this.snakesArray;
		var foods = this.foodArray;
		var ctx = this.ctx;
		for(var i = 0 ; i<snakes.length;i++){
			snakes[i].draw(ctx);
		}
		for(var i = 0 ; i<foods.length;i++){
			foods[i].draw(ctx);
		}
	}

	CanvasState.prototype.autoRun = function(){
		if(this.direction == "up"){
			this.snake_head_y = this.snake_head_y - this.canvas_unit;
		}else if(this.direction == "down"){
			this.snake_head_y = this.snake_head_y + this.canvas_unit; 
		}else if(this.direction == "right"){
			this.snake_head_x = this.snake_head_x + this.canvas_unit;       
		}else if(this.direction == "left"){
			this.snake_head_x = this.snake_head_x - this.canvas_unit;   
		}
	}
	CanvasState.prototype.checkBorder = function() {
	
		if(this.snake_head_x+this.canvas_unit > this.width){
			this.snake_head_x = 0;
		}
		if(this.snake_head_x < 0){
			this.snake_head_x = this.width;
		}
		if(this.snake_head_y+this.canvas_unit > this.height){
			this.snake_head_y = 0;
		}
		if(this.snake_head_y < 0){
			this.snake_head_y = this.height;
		}
	}
	CanvasState.prototype.checkEatSelf = function() {
		var head_x = this.snake_head_x;
		var head_y = this.snake_head_y;

		for(var i = 2 ;i<this.snakesArray.length;i++){
			 if(this.snake_head_x == this.snakesArray[i].x && this.snake_head_y == this.snakesArray[i].y){	
			 	this.death = true ;
			}
			// 	break;
		}
	}
	CanvasState.prototype.gameOver = function() {
	
			alert("Game Over ,your score is : "+this.snakeScore);
			this.snakesArray = [] ;//collection of snake body units 
			this.foodArray = [] ;  //collection of food

			this.snake_head_x = 100;
			this.snake_head_y = 100;
			this.snakeScore = 0;

			document.getElementById("btnStart").disabled=false;
	}


/*********************************Snake****************************************/
function Snake(x,y,w,h){
	//Initial some attribute
	this.x = x ;
	this.y = y ;
	this.w = w ;
	this.h = h ;
}
// Draws this shape to a given context
Snake.prototype.draw = function(ctx) {
  //ctx.fillStyle = this.fill;
  ctx.fillStyle = "#cb3a93";
  ctx.fillRect(this.x, this.y, this.w, this.h);
  ctx.strokeRect( this.x, this.y, this.w, this.h);

  
}
/***********************************Food*********************************************/
function Food(x,y,w,h){
	//Initial some attribute
	this.x = x ;
	this.y = y ;
	this.w = w ;
	this.h = h ;
}
// Draws this shape to a given context
Food.prototype.draw = function(ctx) {
  //ctx.fillStyle = this.fill;
  ctx.fillStyle = "#7ecb0d";
  ctx.fillRect(this.x, this.y, this.w, this.h);
  ctx.strokeRect( this.x, this.y, this.w, this.h);
}

/********************************************************************************/

function init(){
	console.log("it is init()")
}
function start(){
	var canvas = document.getElementById('canvas1');
	// alert(canvas);
	var canvasState = new CanvasState(canvas);

	canvasState.addSnake();
	canvasState.generateFood();
	canvasState.moveScreen();

	canvas.focus();//Important!!!  canvas != canvasState
	document.getElementById("btnStart").disabled=true;
}