var O = false;
var T = true;
var shapes = new Array();

shapes[0] = [	[O,O,O,O],
		[T,T,T,O],
		[O,O,T,O],
		[O,O,O,O]];

shapes[1] = [	[O,O,O,O],
		[T,T,T,O],
		[O,T,O,O],
		[O,O,O,O]];

shapes[2] = [	[O,O,O,O],
		[O,T,T,O],
		[O,T,T,O],
		[O,O,O,O]];
		
shapes[3] = [	[O,O,O,O],
		[T,T,O,O],
		[O,T,T,O],
		[O,O,O,O]];
		
shapes[4] = [	[O,O,O,O],
		[T,T,T,O],
		[T,O,O,O],
		[O,O,O,O]];

shapes[5] = [	[O,O,O,O],
		[T,T,T,T],
		[O,O,O,O],
		[O,O,O,O]];

shapes[6] = [	[O,O,O,O],
		[O,T,T,O],
		[T,T,O,O],
		[O,O,O,O]];		

Block.prototype.shapes = shapes;
Block.prototype.colors = ["blue","purple","yellow","red","orange","teal","green"];

function Block(blocks)
{
	this.blocks = blocks;
	this.type = Math.floor(Math.random()*7);
	this.shape = this.shapes[this.type];
	this.color = this.colors[this.type];
	
	this.y = -4;
	this.x = Math.ceil(Math.random()*5);
}

Block.prototype.isClear = function isClear()
{
	for(var x2 = 0; x2 < 4; x2++)
		for(var y2 = 0; y2 < 4; y2++)
			if(x2+this.x >= 0 && y2+this.y > 0)
				if(this.shape[y2][x2] == 1 && blocks[x2+this.x][y2+this.y+1].used)
					return false;
					
	return true;
}

Block.prototype.moveLeft = function moveLeft()
{
	this.x--;
	if(!this.isClear())
		this.x++;
}

Block.prototype.moveRight = function moveRight()
{
	this.x++;
	if(!this.isClear())
		this.x--;
}

Block.prototype.rotate = function rotate()
{
	var temp = [[],[],[],[]];

	for(var x = 0; x < 4; x++)
		for(var y = 0; y < 4; y++)
			temp[x][y] = this.shape[x][y];
	
	for(var x = 0; x < 4; x++)
		for(var y = 0; y < 4; y++)
			this.shape[3-y][x] = temp[x][y];

	if(!this.isClear())
		this.shape = temp;
}