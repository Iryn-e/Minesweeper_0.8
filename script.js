//To clear cache, do : Ctrl + F5
var components =
{
    diff : '1',
    numRows : 9,
    numCols : 9,
    numBombs : 10,
    flagged : 0,
    numSafe : -1,
    bomb : '¤',
    alive : true,
    victory : false,
    colors : {1: 'blue', 2: 'green', 3: 'red', 4: 'purple', 5: 'maroon', 6: 'turquoise', 7: 'black', 8: 'grey'}
}
var totalSeconds = 0;


function Difficulty()
{
    let val = sessionStorage.getItem("diffValue");
    diff = document.getElementById("diff");

    diff.selectedIndex = val - 1;
    if (val == "1")
    {
        components.numRows = 9;
        components.numCols = 9;
        components.numBombs = 10;
    }
    if (val == "2")
    {
        components.numRows = 16;
        components.numCols = 16;
        components.numBombs = 40;
    }
    if (val == "3")
    {
        components.numRows = 32;
        components.numCols = 16;
        components.numBombs = 99;
    }
    if (val == "4")
    {
        components.numRows = sessionStorage.getItem("nrows");
        components.numCols = sessionStorage.getItem("ncols");
        components.numBombs = sessionStorage.getItem("nbombs");
    }
}

function DiffRemember()
{
    myDiff = document.getElementById("diff");
    myDiff.addEventListener("change", function() {
        sessionStorage.setItem("diffValue", this.value);
    });
    sessionStorage.setItem("diffValue", myDiff.value);
    if (sessionStorage.getItem("diffValue") == 4)
    {
        OptionVisible();
    }
    else
    {
        reload();
    }
}

function OptionVisible()
{
    var custom = document.getElementById("hiddencustom");
    custom.style.visibility = 'visible';
}

function SetCustom()
{
    myCustom = document.getElementById("hiddencustom");
    myRows = document.getElementById("nrows");
    myCols = document.getElementById("ncols");
    myBombs = document.getElementById("nbombs");
    myCustom.addEventListener("set", function() {
        sessionStorage.setItem("nrows", this.value);
        sessionStorage.setItem("ncols", this.value);
        sessionStorage.setItem("nbombs", this.value);
    })
    sessionStorage.setItem("nrows", myRows.value);
    sessionStorage.setItem("ncols", myCols.value);
    sessionStorage.setItem("nbombs", myBombs.value);
    reload();
}

window.addEventListener('load', function() 
{
    StartGame();
});

function StartGame()
{
    Difficulty()
    components.flagged = components.numBombs;
    components.numSafe = (components.numRows * components.numCols) - components.numBombs;
    document.getElementById('bombs-left').innerHTML = components.flagged;
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
    if (!components.alive || components.victory)
    {
        return;
    }
    if (cell.textContent == "🚩" || cell.textContent == "?")
    {
        return;
    }
    if (cell.style.backgroundColor == 'darkgray')
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
        if (bombnum != null)
        {
            cell.style.color = components.colors[bombnum];
        }
        cell.textContent = bombnum;
        components.numSafe = components.numSafe - 1;
        if (components.numSafe == 0)
        {
            GameWin();
        }
    }
}


function CountTimer() 
{
    totalSeconds = totalSeconds + 5;
    document.getElementById("timersecs").innerHTML = totalSeconds;
}

function MouseDown()
{
    if (!components.alive || !components.victory)
    {
        return;
    }
    document.getElementById("face").textContent = "😮";
}
function MouseUp()
{
    if (!components.alive || !components.victory)
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
            components.flagged = components.flagged+1;
            document.getElementById("bombs-left").innerHTML = components.flagged;
            return;
        }
        cell.textContent = "🚩";
        components.flagged = components.flagged-1;
        document.getElementById("bombs-left").innerHTML = components.flagged;

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
        if (bombCell.bomb)
        {
            i--;
            continue;
        }
        console.log("Bomb at : "+nrow, ncol);
        bombCell.bomb = true;
    }

}

function Adjacent(cell)
{
    cellRow = cell.parentElement.rowIndex;
    cellCol = cell.cellIndex;
    amount = 0;

    if (components.numCols == 1 && components.numCols == 1)
    {
        return amount;
    }
    if (components.numCols == 1 && cellCol == 0)
    {
        if (document.getElementById("cell-"+(cellRow)+"-"+(cellCol+1)).bomb === true)
        {
            amount++;
        }
        return amount;
    }
    if (components.numCols == 1 && cellCol == components.numRows-1)
    {
        if (document.getElementById("cell-"+(cellRow)+"-"+(cellCol-1)).bomb === true)
        {
            amount++;
        }
        return amount;
    }
    if (components.numRows == 1 && cellRow == 0)
    {
        if (document.getElementById("cell-"+(cellRow+1)+"-"+(cellCol)).bomb === true)
        {
            amount++;
        }
        return amount;
    }
    if (components.numRows == 1 && cellRow == components.numCols-1)
    {
        if (document.getElementById("cell-"+(cellRow-1)+"-"+(cellCol)).bomb === true)
        {
            amount++;
        }
        return amount;
    }
    if (components.numCols == 1)
    {
        if (document.getElementById("cell-"+(cellRow)+"-"+(cellCol+1)).bomb === true)
        {
            amount++;
        }
        if (document.getElementById("cell-"+(cellRow)+"-"+(cellCol-1)).bomb === true)
        {
            amount++;
        }
        return amount;
    }
    if (components.numRows == 1)
    {
        if (document.getElementById("cell-"+(cellRow+1)+"-"+(cellCol)).bomb === true)
        {
            amount++;
        }
        if (document.getElementById("cell-"+(cellRow-1)+"-"+(cellCol)).bomb === true)
        {
            amount++;
        }
        return amount;
    }

    while (components.numRows != 1 || components.numCols != 1)
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
    
        if (amount == 0)
        {
            FloodFill();
        }

        return amount;
    }
}

function FloodFill()
{
    //FloodFill Algorithm to be coded here
}

function PlaySound(sound)
{
    audio = new Audio("Sounds/"+sound);
    audio.loop = false;
    audio.play();
}

function GameOver()
{
    //Add X-mark to false flags
    console.log("Game over!");
    PlaySound("TNT_old.mp3");
    clearInterval(CountTimer);
    components.alive = false;
    document.getElementById("face").textContent = "☠️";
    document.title = "You lost...";
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

function GameWin()
{
    console.log("Win!");
    PlaySound("Victory.mp3");
    document.title = "You win!";
    clearInterval(CountTimer);
    components.flagged = 0;
    document.getElementById("face").textContent = "😎";
    document.getElementById("bombs-left").innerHTML = components.flagged;
    for (let i = 0; i < components.numCols; i++)
    {
        for (let j = 0; j < components.numRows; j++)
        {
            cell = document.getElementById("cell-"+(i)+"-"+(j));
            if (cell.bomb == true)
            {
                cell.textContent = "🚩";
            }
        }
    }
}

function reload()
{
    window.location.reload();
}