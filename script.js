//To clear cache, do : Ctrl + F5
var components =
{
    diff : '1',
    numRows : 9,
    numCols : 9,
    numBombs : 10,
    bomb : '¤',
    alive : true
}

function Difficulty()
{
    if (document.getElementById("diff").value == "1")
    {
        components.numRows = 9;
        components.numCols = 9;
        components.numBombs = 10;
    }
    if (document.getElementById("diff").value == "2")
    {
        components.numRows = 16;
        components.numCols = 16;
        components.numBombs = 40;
    }
    if (document.getElementById("diff").value == "3")
    {
        components.numRows = 32;
        components.numCols = 16;
        components.numBombs = 99;
    }
}

window.addEventListener('load', function() 
{
    StartGame();
});

function StartGame()
{
    Difficulty()
    document.getElementById('bombs-left').innerHTML = components.numBombs+" Bombs";
    document.getElementById('field').appendChild(CreateTable());
    PlaceBombs();
}

function cellID(i, j)
{
    return 'cell-' + i + '-' + j;
}

function CreateTable()
{
    var table, row, td;
    table = document.createElement('table');
    for (var i=0; i < components.numCols; i++)
    {
        row = document.createElement('tr');
        row.id = "row-" + i;
        for (var j=0; j < components.numRows; j++)
        {
            td = document.createElement('td');
            td.id = cellID(i, j);
            td.bomb = false;
            td.addEventListener("click", function() {
                OnClick(this, this.parentElement.rowIndex, this.cellIndex);
            });
            td.addEventListener("contextmenu", function(ev) {
                ev.preventDefault();
                Flag(this);
                return false;
            }, false);
            console.log(cellID(i,j));
            row.append(td);
        }
        table.append(row);
    }
    return table;
}

function OnClick(cell, row, col)
{
    if (cell.clicked == false)
    {
        t = document.getElementById('timer');
        timer(t);

        cell.clicked = true;
    }
    if (!components.alive)
    {
        return;
    }
    if (cell.textContent == "🚩" || cell.textContent == "?")
    {
        return;
    }
    if (cell.bomb == true)
    {
        cell.style.backgroundColor = 'red';
        cell.textContent = components.bomb;
        GameOver();
    }
    else
    {
        cell.style.backgroundColor = 'darkgray';
        bombnum = Adjacent(cell);
        if (bombnum == 0)
        {
            bombnum = null;
        }
        cell.textContent = bombnum;
    }
}

function Timer()
{

}

function MouseDown()
{
    if (!components.alive)
    {
        return;
    }
    document.getElementById("face").textContent = "😮";
}
function MouseUp()
{
    if (!components.alive)
    {
        return;
    }
    document.getElementById("face").textContent = "🙂";
}

function Flag(cell)
{
    while (components.alive == true && cell.style.backgroundColor != 'darkgray')
    {
        if (cell.textContent == "🚩")
        {
            cell.textContent = "?";
            return;
        }
        if (cell.textContent == "?")
        {
            cell.textContent = "";
            return;
        }
        cell.textContent = "🚩";
        return;
    }
}

function PlaceBombs()
{
    for (var i=0; i< components.numBombs; i++)
    {
        var nrow = Math.floor(Math.random() * components.numCols);
        var ncol = Math.floor(Math.random() * components.numRows);
        bombCell = document.getElementById("cell-"+nrow+"-"+ncol);
        console.log("Bomb at : "+nrow, ncol);
        bombCell.bomb = true;
    }
}

function Adjacent(cell)
{
    cellRow = cell.parentElement.rowIndex;
    cellCol = cell.cellIndex;
    amount = 0;

    while (amount == 0)
    {
        if(cellRow == 0 && cellCol == 0)
        {
            if (document.getElementById("cell-"+(cellRow)+"-"+(cellCol+1)).bomb === true)
            {
                amount++;
            }
            if (document.getElementById("cell-"+(cellRow+1)+"-"+(cellCol+1)).bomb === true)
            {
                amount++;
            }
            if (document.getElementById("cell-"+(cellRow+1)+"-"+(cellCol)).bomb === true)
            {
                amount++;
            }
            return amount;
        }

        else if(cellRow == 0 && cellCol == components.numCols-1)
        {
            if (document.getElementById("cell-"+(cellRow)+"-"+(cellCol-1)).bomb === true)
            {
                amount++;
            }
            if (document.getElementById("cell-"+(cellRow+1)+"-"+(cellCol-1)).bomb === true)
            {
                amount++;
            }
            if (document.getElementById("cell-"+(cellRow+1)+"-"+(cellCol)).bomb === true)
            {
                amount++;
            }
            return amount;
        }

        else if (cellRow == components.numRows-1 && cellCol == 0)
        {
            if (document.getElementById("cell-"+(cellRow-1)+"-"+(cellCol)).bomb == true)
            {
                amount++;
            }
            if (document.getElementById("cell-"+(cellRow-1)+"-"+(cellCol+1)).bomb == true)
            {
                amount++;
            }
            if (document.getElementById("cell-"+(cellRow)+"-"+(cellCol+1)).bomb === true)
            {
                amount++;
            }
            return amount;
        }

        else if (cellRow == components.numRows-1 && cellCol == components.numCols-1)
        {
            if (document.getElementById("cell-"+(cellRow-1)+"-"+(cellCol-1)).bomb == true)
            {
                amount++;
            }
            if (document.getElementById("cell-"+(cellRow-1)+"-"+(cellCol)).bomb == true)
            {
                amount++;
            }
            if (document.getElementById("cell-"+(cellRow)+"-"+(cellCol-1)).bomb == true)
            {
                amount++;
            }
            return amount;
        }

        else if(cellRow == 0)
        {
            if (document.getElementById("cell-"+(cellRow)+"-"+(cellCol-1)).bomb == true)
            {
                amount++;
            }
            if (document.getElementById("cell-"+(cellRow)+"-"+(cellCol+1)).bomb === true)
            {
                amount++;
            }
            if (document.getElementById("cell-"+(cellRow+1)+"-"+(cellCol-1)).bomb === true)
            {
                amount++;
            }
            if (document.getElementById("cell-"+(cellRow+1)+"-"+(cellCol)).bomb === true)
            {
                amount++;
            }
            if (document.getElementById("cell-"+(cellRow+1)+"-"+(cellCol+1)).bomb === true)
            {
                amount++;
            }
            return amount;
        }

        else if(cellCol == 0)
        {
            if (document.getElementById("cell-"+(cellRow-1)+"-"+(cellCol)).bomb == true)
            {
                amount++;
            }
            if (document.getElementById("cell-"+(cellRow-1)+"-"+(cellCol+1)).bomb == true)
            {
                amount++;
            }
            if (document.getElementById("cell-"+(cellRow)+"-"+(cellCol+1)).bomb === true)
            {
                amount++;
            }
            if (document.getElementById("cell-"+(cellRow+1)+"-"+(cellCol)).bomb === true)
            {
                amount++;
            }
            if (document.getElementById("cell-"+(cellRow+1)+"-"+(cellCol+1)).bomb === true)
            {
                amount++;
            }
            return amount;
        }

        else if (cellRow == components.numRows-1)
        {
            if (document.getElementById("cell-"+(cellRow-1)+"-"+(cellCol-1)).bomb == true)
            {
                amount++;
            }
            if (document.getElementById("cell-"+(cellRow-1)+"-"+(cellCol)).bomb == true)
            {
                amount++;
            }
            if (document.getElementById("cell-"+(cellRow-1)+"-"+(cellCol+1)).bomb == true)
            {
                amount++;
            }
            if (document.getElementById("cell-"+(cellRow)+"-"+(cellCol-1)).bomb == true)
            {
                amount++;
            }
            if (document.getElementById("cell-"+(cellRow)+"-"+(cellCol+1)).bomb === true)
            {
                amount++;
            }
            return amount;
        }

        else if (cellCol == components.numCols-1)
        {
            if (document.getElementById("cell-"+(cellRow-1)+"-"+(cellCol-1)).bomb == true)
            {
                amount++;
            }
            if (document.getElementById("cell-"+(cellRow-1)+"-"+(cellCol)).bomb == true)
            {
                amount++;
            }
            if (document.getElementById("cell-"+(cellRow)+"-"+(cellCol-1)).bomb == true)
            {
                amount++;
            }
            if (document.getElementById("cell-"+(cellRow+1)+"-"+(cellCol-1)).bomb === true)
            {
                amount++;
            }
            if (document.getElementById("cell-"+(cellRow+1)+"-"+(cellCol)).bomb === true)
            {
                amount++;
            }
            return amount;
        }
        
        else
        {
            if (document.getElementById("cell-"+(cellRow-1)+"-"+(cellCol-1)).bomb == true)
            {
                amount++;
            }
            if (document.getElementById("cell-"+(cellRow-1)+"-"+(cellCol)).bomb == true)
            {
                amount++;
            }
            if (document.getElementById("cell-"+(cellRow-1)+"-"+(cellCol+1)).bomb == true)
            {
                amount++;
            }
            if (document.getElementById("cell-"+(cellRow)+"-"+(cellCol-1)).bomb == true)
            {
                amount++;
            }
            if (document.getElementById("cell-"+(cellRow)+"-"+(cellCol+1)).bomb === true)
            {
                amount++;
            }
            if (document.getElementById("cell-"+(cellRow+1)+"-"+(cellCol-1)).bomb === true)
            {
                amount++;
            }
            if (document.getElementById("cell-"+(cellRow+1)+"-"+(cellCol)).bomb === true)
            {
                amount++;
            }
            if (document.getElementById("cell-"+(cellRow+1)+"-"+(cellCol+1)).bomb === true)
            {
                amount++;
            }
        }
    
        /*if (amount == 0)
        {
            for (i=-1; i<=1; i++)
            {
                for (j=-1; j<=1; j++)
                {
                    //Auto Clear needs more work
                    newCell = document.getElementById("cell-"+(cellRow+i)+"-"+(cellCol+j));
                    if (Adjacent(newCell) != 0)
                    {
                        newCell.style.backgroundColor = 'darkgray';
                    }
                }
            }
            amount = null;
        }*/
        return amount;
    }
}

/*function AutoClear(cell, i, j)
{
    OnClick(cell, (i-1), (j-1))
    OnClick(cell, (i-1), j)
    OnClick(cell, (i-1), (j+1))
    OnClick(cell, i, (j-1))
    OnClick(cell, i, (j+1))
    OnClick(cell, (i+1), (j-1))
    OnClick(cell, (i+1), j)
    OnClick(cell, (i+1), (j+1))

    // When the Adjacent function returns a null int, it will clear
    // all cells around it, and then the other cells if it is also empty
}*/

function PlaySound(sound)
{
    audio = new Audio("Sounds/"+sound);
    audio.loop = false;
    audio.play();
}

function GameOver()
{
    console.log("Game over!");
    PlaySound("TNT_old.mp3");
    components.alive = false;
    document.getElementById("face").textContent = "☠️";
    document.getElementById('lost').style.display="block";
    for (let i = 0; i < components.numCols; i++)
    {
        for (let j = 0; j < components.numRows; j++)
        {
            cell = document.getElementById("cell-"+(i)+"-"+(j));
            if (cell.bomb == true)
            {
                cell.backgroundColor = 'darkgray';
                cell.textContent = components.bomb;
            }
        }
    }
}

function reload()
{
    window.location.reload();
}