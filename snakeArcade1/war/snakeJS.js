function loadPage()
{
	window.pause = false;
	window.speed = 100;
	var node = document.createElement('div');
	var rowNode = document.createElement('div');
	rowNode.setAttribute('class', 'rows');
	node.setAttribute('class','element');
	window.initialSize = 5;
	
	for ( var i = 0; i < 30 ; i++ )
	{
		var row = rowNode.cloneNode(true);
		row.setAttribute('id' , 'row' + i);
		for(var j = 0 ; j < 30 ; j++)
		{
			var dot = node.cloneNode(true);
			dot.setAttribute('id', i + '_' + j );
			row.appendChild(dot);
		}
		document.getElementById('container').appendChild(row);
	}
	startGame();
}

function startGame()
{
	initialize();
	
	if( window.setFood != true )
		generateRandom();
	
	window.interval = window.setInterval( function () 
	{
		move();
	}, window.speed);
}

function move()
{
	if(window.pause == true )
		return;
	var next_head;
	var	n_row = getRow(window.head['val']);
	var n_col = getCol(window.head['val']);
	switch( window.direction) 
	{
		case 'E' :
			n_col = parseInt(n_col) + 1;
			break;
		case 'W' :
			n_col = parseInt(n_col) - 1;
			break;
		case 'S' :
			n_row = parseInt(n_row) + 1;
			break;
		case 'N' :
			n_row = parseInt(n_row) - 1;
			break;
		default :
			clearInterval(window.interval);
			return;
	}
	if( n_col > 29 || n_col < 0 || n_row > 29 || n_row < 0)
	{
		if( window.direction == 'E' || window.direction == 'W')
			n_col = setNew(n_col);
		else
		{
			if(window.direction == 'S' || window.direction == 'N')
				n_row = setNew(n_row);
			else
				return;
		}
		
// Code for Alternative Functionality		
//		clearInterval(window.interval);
//		gameover();
//		return;

	}
	
	if( $('#' + n_row + '_' + n_col).hasClass('set') )
	{
		if($('#' + n_row + '_' + n_col).attr('name') == 'food')
		{
			insertQ(n_row + '_' + n_col);
			document.getElementById(n_row + '_' + n_col).setAttribute('name','');
			window.setFood = false;
			generateRandom();
		}
		else
		{
			clearInterval(window.interval);
			gameover();
			return;
		}
	}
	else
	{
		insertQ(n_row + '_' + n_col);
		removeQ();
	}
}


function initialize()
{
	document.getElementById('textContainer').setAttribute('style','display : none!important');
	window.head = {};
	window.tail = {};
	var offset = {};
	var coord = '14_12';
	offset['val'] = coord;
	offset['next'] = null;
	offset['prev'] = null;
	window.snakeSize = 1;
	window.head = offset;
	window.tail = offset;
	window.direction = 'E';
	$('#14_12').addClass('set');
	
	var row = getRow(coord);
	var col = getCol(coord);
	
	for( var j = 1; j < window.initialSize ; j++ )
	{
		col = parseInt(col)+ 1;
		insertQ( row + '_' + col );
	}
}


function getRow( coord )
{
	for( var  j = 0; j < coord.length; j++) 
	{
		if( coord.charAt(j) == '_' )
			break;
	}
	return coord.substring(0,j);
}

function getCol( coord )
{
	for( var  j = 0; j < coord.length; j++) 
	{
		if( coord.charAt(j) == '_' )
			break;
	}
	return coord.substring(j+1);
}


function insertQ( data )
{
	var temp = {};
	temp['val'] = data;
	temp['next'] = window.head;
	temp['prev'] = null;
	window.head['prev'] = temp;
	window.head = temp;
	window.snakeSize++;
	if(!$('#' + data).hasClass('set'))
		$('#' + data).addClass('set');
}

function removeQ()
{
	if(window.snakeSize == 0)
		return;
	var temp = window.tail;
	var prevTail = temp['val'];
	$('#' + prevTail).removeClass('set');
	temp['val'] = '';
	temp['next'] = null;
	window.tail = temp['prev'];
	if( window.tail != null)
		window.tail['next'] = null;
	window.snakeSize--;
}


function changeDirection( id )
{
	if(window.pause == true)
		return;
	switch(id)
	{
		case 'up' :
				if(window.direction == 'S' || window.direction == 'N')
					return;
				else
					window.direction = 'N';
				break;
        case 'down' :
				if(window.direction == 'N' || window.direction == 'S')
					return;
				else
					window.direction = 'S';
				break;
        case 'left' :
				if(window.direction == 'E' || window.direction == 'W')
					return;
				else
					window.direction = 'W';
				break;
		case 'right' :
				if(window.direction == 'W' || window.direction == 'E')
					return;
				else
					window.direction = 'E';
				break;
	}
	clearInterval(window.interval);
	window.interval = window.setInterval( function () 
	{
		move();
	}, window.speed);
}

function generateRandom()
{
	var setFood = false;
	while( setFood == false )
	{
		var randRow = Math.floor( Math.random()* 29 );
		var randCol = Math.floor( Math.random()* 29 );
		if( $('#' + randRow + '_' + randCol ).hasClass('set') == false )
		{
			document.getElementById(randRow + '_' + randCol).setAttribute('name','food');
			$('#' + randRow + '_' + randCol).addClass('set');
			setFood = true;
			window.setFood = true;
		}
			
	}
}

function gameover()
{
	window.pause = true;
	var score = window.snakeSize - window.initialSize;
	document.getElementById('score').innerText = score;
	document.getElementById('textContainer').setAttribute('style','');
}

$(document).keydown(function(e) {
    switch(e.which) {
        case 37 : 
			changeDirection('left');
			break;
		case 38 : 
			changeDirection('up');
			break;
		case 39 :
			changeDirection('right');
			break;
		case 40 :
			changeDirection('down');
			break;
		default : return;
    }
    e.preventDefault();
});

function startAgain()
{
	while( window.snakeSize != 0)
		removeQ();
	window.pause = false;
	startGame();
}

function setNew( val )
{
	if(val < 0 )
		return 29;
	else
	{
		if(val > 29)
			return 0;
	}
}