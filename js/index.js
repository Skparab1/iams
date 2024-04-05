// hi iams




let pointsarr = [];
let tickYarr = [];
let tickXarr = [];

let tickYincrement = 10;
let tickXincrement = 10;

let lastfocus = "";

let xytable = document.getElementById('xytable');

let plotgraph = document.getElementById("plotgraph");


const sleep = ms => new Promise(res => setTimeout(res, ms));


function getcoord(percentX, percentY) {

  let x = plotgraph.offsetLeft+percentX/100*plotgraph.offsetWidth+1.5;
  let y = plotgraph.offsetTop+(1-(percentY/100))*plotgraph.offsetHeight+1.5;

  return [x,y];
}

function goodNumber(num){
  if (num < 100){
    return "&nbsp&nbsp"+String(num);
  }

  return String(num);
}

async function growPoint(id){

  let obj = document.getElementById(id);

  let w = 1;
  while (w < 100){
    obj.style.width = (w/100)*1.2+"%";
    await sleep();
    w += (110-w)/20;
  }
} 


function drawPoint(x, y, n, grow) {
  const num = n;

  [coordX, coordY] = getcoord(x,y);

  plotgraph.innerHTML += `<div onmouseover="glowPoint(${num});" onmouseout="revertPoint(${num});" id="realPoint${num}" class=point style="left: ${coordX}px; top: ${coordY}px;"></div>`;

  if (grow){
    growPoint("realPoint"+num);
  }

}


function drawTickY(x, y, push=true) {
  if (push){
      tickYarr.push([x, y]);
  }

  [coordX, coordY] = getcoord(x,y);

  plotgraph.innerHTML += `
    <div class=tickLabel style="left: ${coordX-0.035*window.innerWidth}px; top: ${coordY-9.75}px;">${goodNumber(y*(tickYincrement/10))}</div>
    <div class=tickY style="left: ${coordX}px; top: ${coordY}px;"></div>`;
}

function drawTickX(x, y, push=true) {
  if (push){
      tickXarr.push([x, y]);
  }

  [coordX, coordY] = getcoord(x,y);

  plotgraph.innerHTML += `
  <div class=tickLabel style="left: ${coordX-7.75}px; top: ${coordY+0.02*window.innerHeight}px;">${x*(tickXincrement/10)}</div>
  <div class=tickX style="left: ${coordX}px; top: ${coordY}px;"></div>`;
}


function handlezoom(){
  alert("scrolled");
}



function redraw(pointgrow = null){

  console.log(pointsarr);
  plotgraph.innerHTML = ``;
  xytable.innerHTML = `
  <tr>
    <tr>
      <th><input type="text" name="woo" id="" value="X"></th>
      <th><input type="text" name="woo" id="" value="Y"></th>
    </tr>
  </tr>`;

  for (tick of tickYarr){
    drawTickY(tick[0], tick[1], false);
  }
  for (tick of tickXarr){
    drawTickX(tick[0], tick[1], false);
  }

  console.log(pointgrow)

  let i = 0;
  for (point of pointsarr){
    drawPoint(point[0]/tickXincrement*10, point[1]/tickYincrement*10, i, (pointgrow == i));
    let act = pointToActual(point[0]/tickXincrement*10, point[1]/tickYincrement*10);
    addToTable(act[0], act[1], i);
    i += 1;
  }

  xytable.innerHTML += `<tr>
    <th>
      <a><button class=smallbtn style="margin-left: 100%; width: 50%; transform: translate(-50%,0);" onclick="addNewPoint();">Add Point</button></a>
    </th>
  </tr>`;

  document.getElementById(lastfocus).focus();
}

function initDraw(){
  let i = 10;
  while (i <= 100){
    drawTickY(0,i);
    i += 10;
  }
  i = 10;
  while (i <= 100){
    drawTickX(i,0);
    i += 10;
  }
}

function convertToPercentage(absoluteX, absoluteY){
  let x = absoluteX - plotgraph.offsetLeft - 1.5;
  x = x/plotgraph.offsetWidth*100;

  let y = absoluteY - plotgraph.offsetTop;
  y = (1-y/plotgraph.offsetHeight)*100-2;

  return [x*tickXincrement/10,y*tickYincrement/10];
}

function addpoint(event){
  let newpts = convertToPercentage(event.clientX, event.clientY);
  pointsarr.push(newpts);
  redraw(pointsarr.length-1);
}


function monitorChange(pointNum){
  console.log(pointNum, pointsarr);

  let getx = parseFloat(document.getElementById("X"+(pointNum)).value);
  let gety = parseFloat(document.getElementById("Y"+(pointNum)).value);

  while (getx > tickXincrement*10){
    tickXincrement = tickXincrement + 10;
  }


  while (gety > tickYincrement*10){
    tickYincrement = tickYincrement + 10;
  }


  pointsarr[pointNum] = [getx,gety];
  redraw(-1);
}

function pointToActual(x,y){
  return[x/10*tickXincrement, y/10*tickYincrement];
}

function addToTable(x,y,index){

  const idx = index;

  // onmouseover="selectPoint(${idx});"

  xytable.innerHTML += `
    <tr id="tableRow${idx}" onmouseover="glowPoint(${idx});" onmouseout="revertPoint(${idx});">
      <td><input type="number" step="0.01" name="" id="X${idx}" value="${x.toFixed(2)}" onchange="lastfocus = 'X${idx}'; monitorChange(${idx});"></td>
      <td><input type="number" step="0.01" name="" id="Y${idx}" value="${y.toFixed(2)}" onchange="lastfocus = 'Y${idx}'; monitorChange(${idx});"></td>
      <td onclick="deletePoint(${idx});" style="border-radius: 25px;"><p style="margin: 0px; padding: 0px; padding-left: 10px; padding-right: 10px; cursor: pointer; border-radius: 25px; font-size: 75%;">delete</p></td>
    </tr>`

  // xytable.scrollTo({ top: 10000, behavior: 'smooth' })
}


function glowPoint(num){
  // document.getElementById("tablerow"+num).style.backgroundColor = "red";
  let thePoint = document.getElementById("realPoint"+num);
  let tableRow = document.getElementById("tableRow"+num);

  tableRow.style.backgroundColor = "red";
  thePoint.style.backgroundColor = "red";
  thePoint.style.zIndex = 10;

}

function revertPoint(num){
  let thePoint = document.getElementById("realPoint"+num);
  let tableRow = document.getElementById("tableRow"+num);

  tableRow.style.backgroundColor = "white";
  thePoint.style.backgroundColor = "#0d6efd";
  thePoint.style.zIndex = 1;
}

function addNewPoint(){
  let newpts = [0,0];
  pointsarr.push(newpts);
  redraw();
}

function deletePoint(num){
  pointsarr.splice(num, 1);
  redraw();
}


// next add adapting to data when new point is entered

xytable.style.maxHeight = window.innerHeight*0.65+"px";


initDraw();


window.addEventListener("resize", redraw);
plotgraph.addEventListener("click", addpoint);
plotgraph.addEventListener("scroll", handlezoom);


