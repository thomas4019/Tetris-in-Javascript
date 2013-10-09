window.onload = init;
window.onresize = scale;
document.onkeydown = keyPressed;

var current = new Block();

var blocks = new Array();
var previousBlocks = new Array();

var instantDown = false;
var busy = false;
var paused = false;

function getPageWidth()
{
	if( typeof( window.innerWidth ) == 'number' ) {
		//Non-IE
		return window.innerWidth;
	} else if( document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight ) ) {
		//IE 6+ in 'standards compliant mode'
		return document.documentElement.clientWidth;
	} else if( document.body && ( document.body.clientWidth || document.body.clientHeight ) ) {
		//IE 4 compatible
		return document.body.clientWidth;
	}
}

function getPageHeight()
{
	if( typeof( window.innerWidth ) == 'number' ) {
		//Non-IE
		return window.innerHeight;
	} else if( document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight ) ) {
		//IE 6+ in 'standards compliant mode'
		return document.documentElement.clientHeight;
	} else if( document.body && ( document.body.clientWidth || document.body.clientHeight ) ) {
		//IE 4 compatible
		return document.body.clientHeight;
	}
}

function init()
{
	var page = document.getElementById("page");
	
	for(var x = 0; x < 10; x++)
		blocks[x] = new Array();
	
	for(var x = 0; x < 10; x++)
		for(var y = 0; y < 20; y++)
		{
			blocks[x][y] = document.createElement("DIV");
			blocks[x][y].used = true;
			blocks[x][y].className = "border";
			blocks[x][y].x = x;
			blocks[x][y].y = y;			

			page.appendChild(blocks[x][y]);
		}
	
	scale();
	startAnim(0);
}

function scale()
{
	var w = getPageWidth();
	var h = getPageHeight();
	var gameHeight = 22;
	var gameWidth = 11;

	var scaledWidth,scaledHeight,x2 = 0,y2 = 0;

	if(gameWidth/gameHeight > w/h)
	{
		scaledWidth = w;
		scaledHeight = Math.ceil(((gameHeight*w)/gameWidth));
		y2 = (h-scaledHeight)/2;
	}
	else
	{
		scaledHeight = h;
		scaledWidth = Math.ceil(((gameWidth*h)/gameHeight));
		x2 = (w-scaledWidth)/2;
	}
	
	var block = Math.floor(scaledWidth/11);
	var gap = 1;

	for(var x = 0; x < 10; x++)
		for(var y = 0; y < 20; y++)
		{
			var obj = blocks[x][y];
			
			obj.style.width = block+"px";
			obj.style.height = block+"px";
			obj.style.left = x2+x*(block+gap)+"px";
			obj.style.top = y2+y*(block+gap)+"px";
		}
}

function startAnim(t)
{
	for(var x = 1; x < 9; x++)
		for(var y = 1; y < 19; y++)
		{
			var obj = blocks[x][y];
			
			if(x+y*10 < t*3)
				obj.style.backgroundColor = "white";
			
			obj.used = false;
		}
		
	if(t < 70)
		setTimeout("startAnim("+(t+1)+")",30);
	else
		setInterval("frame()",150);	
}

function restart(t)
{
	paused = true;
	
	
	for(var x = 1; x < 9; x++)
		for(var y = 1; y < 19; y++)
		{
			var obj = blocks[x][y];
			
			if(t < 70)
			{
				if(x+y*10 < t*3)
					obj.style.backgroundColor = "#072255";
			}
			else if(x+y*10 < (t-70)*3)
				obj.style.backgroundColor = "white";	
				
			obj.used = false;
		}
		
	if(t < 140)
		setTimeout("restart("+(t+1)+")",30);
	else
		paused = false;
}

function frame()
{
	if(paused) return;
		
	busy = true;
	
	var lowering = false;
	
	for(var y = 18; y > 0; y--)
	{
		if(!lowering)
		{
			var cleared = true;

			for(var x = 1; x < 9; x++)
				if(blocks[x][y].used == false)
					cleared = false;

			if(cleared)
				lowering = true;
		}
		else
			for(var x = 1; x < 9; x++)
			{
				blocks[x][y+1].style.backgroundColor = blocks[x][y].style.backgroundColor;
				blocks[x][y+1].used = blocks[x][y].used;
			}
	}

	if(current.isClear())
	{
		current.y += 1;
		
		while(previousBlocks.length > 0)
			previousBlocks.pop().style.backgroundColor = "white";
		
		for(var x = 0; x < 4; x++)
			for(var y = 0; y < 4; y++)
				if(x+current.x > 0 && y+current.y > 0 && current.shape[y][x] == 1)
				{
					var obj = blocks[x+current.x][y+current.y];

					obj.style.backgroundColor = current.color;
					previousBlocks.push(obj);
				}
	}
	else
	{
		while(previousBlocks.length > 0)
		{
			var obj = previousBlocks.pop();
			obj.used = true;
			if(obj.y == 1)
			{
				alert("You Lost");
				restart(0);
			}
		}
		
		current = new Block();
		
		instantDown = false;
	}

	busy = false;
	
	if(instantDown)
		frame();
}

function keyPressed(evt)
{	
	var thisKey = (evt) ? evt.which : window.event.keyCode;
	
	if(!busy && !paused)
	switch(thisKey)
	{
		case 37: current.moveLeft(); break;	//leftArrow
		case 39: current.moveRight();break;	//rightArrow
		case 38: current.rotate();break;	//upArrow
		case 32:				//space
		case 40: instantDown = true;break;	//downArrow
		case 80: paused = !paused;break;	//P
		default: alert(thisKey);
	}
		
	return false;
}