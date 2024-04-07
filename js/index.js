// hi iams




let pointsarr = [];
let tickYarr = [];
let tickXarr = [];

let tickYincrement = 10;
let tickXincrement = 10;

let lastfocus = "";

let xytable = document.getElementById('xytable');

let plotgraph = document.getElementById("plotgraph");

let leftDisp = document.getElementById("leftdisplay");
let rightDisp = document.getElementById("rightdisplay");
let histplot = document.getElementById("horizontalHistogramPlot");
let reshist = document.getElementById("residualHistogram");


window.scrollTo({ left: 0, behavior: 'smooth' })



let step = 1;
let bestFitSlope = 0;

let plotActive = true;

const sleep = ms => new Promise(res => setTimeout(res, ms));


function getcoord(percentX, percentY) {

  // let x = plotgraph.offsetLeft+percentX/100*plotgraph.offsetWidth+1.5;
  // let y = plotgraph.offsetTop+(1-(percentY/100))*plotgraph.offsetHeight+1.5;

  let x = percentX/100*plotgraph.offsetWidth+1.5;
  let y = (1-(percentY/100))*plotgraph.offsetHeight+1.5;

  return [x,y];
}

function getcoordadded(percentX, percentY) {

  // let x = plotgraph.offsetLeft+percentX/100*plotgraph.offsetWidth+1.5;
  // let y = plotgraph.offsetTop+(1-(percentY/100))*plotgraph.offsetHeight+1.5;

  let x = percentX/100*plotgraph.offsetWidth+1.5+(plotgraph.offsetLeft-histplot.offsetLeft);
  let y = (1-(percentY/100))*plotgraph.offsetHeight+1.5;

  return [x,y];
}

function getcoordsecond(id) {

  // let oldx = percentX/100*plotgraph.offsetWidth+1.5-(reshist.offsetLeft-plotgraph.offsetLeft);
  // let oldy = (1-(percentY/100))*plotgraph.offsetHeight+1.5;

  // // now recalculate

  // let x = - (reshist.offsetLeft - plotgraph.offsetLeft) + plotgraph.offsetWidth/2 - oldx;
  // let y = plotgraph.offsetHeight/2 - oldy;

  // let z = Math.sqrt(x*x+y*y);

  // let a = 180/Math.PI*Math.atan(x/y);
  // let tiltAngle = (Math.atan(bestFitSlope / 1)*180/Math.PI);
  // let b = (180 - tiltAngle - a);

  // let y1 = z * Math.cos(b*Math.PI/180);
  // let x1 = z * Math.sin(b*Math.PI/180);

  // let finalx = oldx - x + x1;
  // let finaly = oldy + y + y1;

  // var element = document.getElementById('myElement');
  // var topPos = element.getBoundingClientRect().top + window.scrollY;
  // var leftPos = element.getBoundingClientRect().left + window.scrollX;

  // actual point by absolute absolute

  var element = document.getElementById(id);
  var topPos = element.getBoundingClientRect().top + window.scrollY;
  var leftPos = element.getBoundingClientRect().left + window.scrollX;

  let x = -(leftPos - histplot.offsetLeft);
  let y = topPos - histplot.offsetTop;

  // reflect
  x += (-(histplot.offsetLeft-plotgraph.offsetLeft)-x)*2;

  // translate
  x -= window.innerWidth*1.91;

  return [x, y];
}

function getcoordHistogram(percentX, percentY) {

  // let x = histplot.offsetLeft+percentX/100*histplot.offsetWidth+1.5;
  // let y = histplot.offsetTop+(1-(percentY/100))*histplot.offsetHeight+1.5;

  let x = percentX/100*histplot.offsetWidth+1.5;
  let y = (1-(percentY/100))*histplot.offsetHeight+1.5;

  return [x,y];
}

function getcoordResidual(percentX, percentY) {

  // let x = histplot.offsetLeft+percentX/100*histplot.offsetWidth+1.5;
  // let y = histplot.offsetTop+(1-(percentY/100))*histplot.offsetHeight+1.5;

  let x = percentX/100*reshist.offsetWidth+1.5;
  let y = (1-(percentY/100))*reshist.offsetHeight+1.5;

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
    obj.style.width = (w/100)*2.8+"%";
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

function duplicatePointDraw(x, y, n) {
  const num = n;

  [coordX, coordY] = getcoordadded(x,y);

  histplot.innerHTML += `<div id="movePoint${num}" class=point style="left: ${coordX}px; top: ${coordY}px;"></div>`;
}

function duplicatePointSecond(n) {
  const num = n;

  [coordX, coordY] = getcoordsecond("realPoint"+n);

  reshist.innerHTML += `<div id="resPoint${num}" class=point style="left: ${coordX}px; top: ${coordY}px;"></div>`;
}



function drawTickY(x, y, num, push=true) {
  if (push){
      tickYarr.push([x, y]);
  }

  [coordX, coordY] = getcoord(x,y);

  plotgraph.innerHTML += `
    <div id="labelY${num}" class=tickLabel style="left: ${coordX-0.035*window.innerWidth}px; top: ${coordY-9.75}px;">${goodNumber(y*(tickYincrement/10))}</div>
    <div id="tickY${num}" class=tickY style="left: ${coordX}px; top: ${coordY}px;"></div>`;
}

function drawTickHistogram(x, y, i) {

  [coordX, coordY] = getcoordHistogram(x,y);

  const num = i;

  histplot.innerHTML += `
    <div id="histLabel${num}" class=tickLabel style="left: ${coordX-0.035*window.innerWidth}px; top: ${coordY-9.75}px;">${goodNumber(y*(tickYincrement/10))}</div>
    <div id="histTick${num}" class=tickY style="left: ${coordX}px; top: ${coordY}px;"></div>`;
}

function drawTickRes(x, y, i) {

  [coordX, coordY] = getcoordResidual(x,y);

  const num = i;

  reshist.innerHTML += `
    <div id="resTick${num}" class=tickY style="left: ${coordX}px; top: ${coordY}px;"></div>`;
}

function drawTickX(x, y, i, push=true) {
  if (push){
      tickXarr.push([x, y]);
  }

  [coordX, coordY] = getcoord(x,y);

  plotgraph.innerHTML += `
  <div id="labelX${i}" class=tickLabel style="left: ${coordX-7.75}px; top: ${coordY}px;">${x*(tickXincrement/10)}</div>
  <div id="tickX${i}" class=tickX style="left: ${coordX}px; top: ${coordY-0.017*plotgraph.offsetHeight}px;"></div>`;
}


function handlezoom(){
  alert("scrolled");
}



function redraw(pointgrow = null){

  console.log(pointsarr);
  plotgraph.innerHTML = ``;

  drawBestFit();


  xytable.innerHTML = `
  <tr>
    <tr>
      <th><input type="text" name="woo" id="" value="X"></th>
      <th><input type="text" name="woo" id="" value="Y"></th>
    </tr>
  </tr>`;

  let i = 0;
  for (tick of tickYarr){
    drawTickY(tick[0], tick[1], i, false);
    i += 1;
  }

  i = 0;
  for (tick of tickXarr){
    drawTickX(tick[0], tick[1], i, false);
    i += 1;
  }

  console.log(pointgrow)

  i = 0;
  for (point of pointsarr){
    drawPoint(point[0]/tickXincrement*10, point[1]/tickYincrement*10, i, (pointgrow == i));
    let act = pointToActual(point[0]/tickXincrement*10, point[1]/tickYincrement*10);
    addToTable(act[0], act[1], i);
    i += 1;
  }

  xytable.innerHTML += `<tr id="pointaddbutton">
    <th>
      <a><button class=smallbtn style="margin-left: 100%; width: 50%; transform: translate(-50%,0);" onclick="addNewPoint();">Add Point</button></a>
    </th>
  </tr>`;


  if (step == 2){
    drawHistogram(false);
  }

  if (document.getElementById(lastfocus) != null){
    document.getElementById(lastfocus).focus();
  }
}

// lite redraw
function redrawlite(){

  let bfln = document.getElementById("bestfitline");
  while (bfln != null){
    bfln.remove();
    bfln = document.getElementById("bestfitline");
  }

  drawBestFit();


  // xytable.innerHTML = `
  // <tr>
  //   <tr>
  //     <th><input type="text" name="woo" id="" value="X"></th>
  //     <th><input type="text" name="woo" id="" value="Y"></th>
  //   </tr>
  // </tr>`;


  let i = pointsarr.length-1;

  console.log("point "+i+" being drawn");
  point = pointsarr[i];
  drawPoint(point[0]/tickXincrement*10, point[1]/tickYincrement*10, i, true);
  let act = pointToActual(point[0]/tickXincrement*10, point[1]/tickYincrement*10);
  addToTable(act[0], act[1], i);
  i += 1;

  let addbtn = document.getElementById("pointaddbutton");
  
  while (addbtn != null){
    addbtn.remove();
    addbtn = document.getElementById("pointaddbutton");
  }

  xytable.innerHTML += `<tr id="pointaddbutton">
    <th>
      <a><button class=smallbtn style="margin-left: 100%; width: 50%; transform: translate(-50%,0);" onclick="addNewPoint();">Add Point</button></a>
    </th>
  </tr>`;


  // this should never actually need to happen it should be blocked earlier
  // if (step == 2){
  //   drawHistogram(false);
  // }

  // we should not need to do this
  // if (document.getElementById(lastfocus) != null){
  //   document.getElementById(lastfocus).focus();
  // }
}

function initDraw(){
  let i = 10;
  let n = 0;
  while (i <= 100){
    drawTickY(0,i,n);
    n += 1;
    i += 10;
  }
  i = 10;
  n = 0;
  while (i <= 100){
    drawTickX(i, n, 0);
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

  if (!plotActive){
    return;
  }

  let newpts = convertToPercentage(event.clientX, event.clientY);
  pointsarr.push(newpts);

  drawBestFit();

  redrawlite();
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

  drawBestFit();

  redraw();
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
  thePoint.style.backgroundColor = "red";
  thePoint.style.zIndex = 10;

  if (step == 1){
    let tableRow = document.getElementById("tableRow"+num);
    tableRow.style.backgroundColor = "red";
  }
}

function revertPoint(num){

  let thePoint = document.getElementById("realPoint"+num);
  thePoint.style.backgroundColor = "#0d6efd";
  thePoint.style.zIndex = 1;

  if (step == 1){
    let tableRow = document.getElementById("tableRow"+num);
    tableRow.style.backgroundColor = "white";
  }
}

function addNewPoint(){
  let newpts = [0,0];
  pointsarr.push(newpts);
  drawBestFit();

  redraw(pointsarr.length-1);  
}

function deletePoint(num){
  pointsarr.splice(num, 1);

  drawBestFit();
  redraw();
}


function sum(arr){
  let s = 0;
  for (el of arr){
    s += el;
  }

  return s;
}

function splitArr(pointsarr){
  let arr1 = [];
  let arr2 = [];
  for (point of pointsarr){
    arr1.push(point[0]);
    arr2.push(point[1]);
  }

  return [arr1, arr2];
}


// best fit line solver
function bestFit(allPoints){

  [arrX, arrY] = splitArr(allPoints);

  let xbar = sum(arrX)/arrX.length;
  let ybar = sum(arrY)/arrY.length;

  let n = arrX.length;

  let numerator = 0;

  let i = 0;
  while (i < n){
    numerator += (arrX[i]*arrY[i]);
    i += 1;
  }
  numerator = numerator - n * xbar * ybar;


  let denominator = 0;

  i = 0;
  while (i < n){
    denominator += (arrX[i]*arrX[i]);
    i += 1;
  }
  denominator = denominator - n * xbar * xbar;


  let a = numerator/denominator;
  let b = ybar - a * xbar;

  console.log(" y = "+a+"x + "+b);

  bestFitSlope = a;

  return [a, b]
}

function ySolution(a, b, x){
  return a * x + b;
}

function drawBestFit(){

  if (pointsarr.length < 2){
    return;
  }

  let [a, b] = bestFit(pointsarr);


  let plotx1 = 0;
  let ploty1 = Math.round(plotgraph.offsetHeight-(ySolution(a, b, 0)/tickYincrement*10)*0.01*plotgraph.offsetHeight);

  let plotx2 = plotgraph.offsetWidth;
  let ploty2 = Math.round(plotgraph.offsetHeight-(ySolution(a, b, tickXincrement*10)/tickYincrement*10)*0.01*plotgraph.offsetHeight);


  plotgraph.innerHTML += `
  <svg id="bestfitline" height="100%" width="100%" xmlns="http://www.w3.org/2000/svg" style="position: absolute; left: 0px; top: 0px; z-index: -1;">
    <line x1="${plotx1}" y1="${ploty1}" x2="${plotx2}" y2="${ploty2}" style="stroke:red;stroke-width:3" />
  </svg> 
  `;
  
}

function nextAction(){
  if (step == 1){
    drawHistogram();
    plotgraph.style.cursor = "not-allowed";
    plotActive = false;
  } else if (step == 2){
    rotateHistogram();
  } else if (step == 3){
    tiltplotgraph();
  } else if (step == 4){
    drawResidualHistogram();
  }
  step += 1;
}


async function movePoint(point, x, y){
  let nowX = point.offsetLeft;
  let nowY = point.offsetTop;
  while (nowX > x+10){
    point.style.left = nowX+"px";
    point.style.top = nowY+"px";

    nowX += (x-nowX)/100;
    nowY += (y-nowY)/100;

    await sleep();
  }
}


async function movePointResidual(point, x, y){
  let nowX = point.offsetLeft;
  let nowY = point.offsetTop;
  while (nowX < x-10){
    point.style.left = nowX+"px";
    point.style.top = nowY+"px";

    nowX += (x-nowX)/100;
    nowY += (y-nowY)/100;

    await sleep();
  }
}

function drawHistogram(anim=true){
  leftDisp.innerHTML = `<h1>Distribution Histogram</h1>
  <div id="horizontalHistogramPlot" class="horizontalHistogramPlot"></div>`;

  histplot = document.getElementById("horizontalHistogramPlot");

  drawTickHistogram(0, 0, 0);

  let i = 1;
  for (tick of tickYarr){
    drawTickHistogram(tick[0], tick[1], i);
    i += 1;
  }

  i = 0;
  for (point of pointsarr){
    duplicatePointDraw(point[0]/tickXincrement*10, point[1]/tickYincrement*10, i);
    i += 1;
  }


  // calculate all the ending positions of each of the dots
  let catPoints = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

  let pointNum = 0;
  for (point of pointsarr){
    // determine the category

    let i = 0;
    while (i < 10){
      console.log("point",point[1], tickYincrement*(i+1));
      if (point[1] < tickYincrement*(i+1)){
        let endPos = [(window.innerWidth*0.02*catPoints[i]), (histplot.offsetHeight-((0.1*i+0.05)*histplot.offsetHeight))];
        catPoints[i] += 1;

        let thePt = document.getElementById("movePoint"+pointNum);

        if (anim){
          movePoint(thePt, endPos[0], endPos[1]);
        } else {
          thePt.style.left = endPos[0]+"px";
          thePt.style.top = endPos[1]+"px";
        }

        break;
      }
      i += 1;
    }

    pointNum += 1;
  }

}



function drawResidualHistogram(anim=true){
  rightDisp.innerHTML = `<h1>Distribution Histogram</h1>
  <div id="residualHistogram" class="horizontalHistogramPlot"></div>`;

  reshist = document.getElementById("residualHistogram");

  document.body.style.overflowX = "scroll";
  window.scrollTo({ left: 10000, behavior: 'smooth' })



  drawTickRes(0, 0, 0);

  let i = 1;
  for (tick of tickYarr){
    drawTickRes(tick[0], tick[1], i);
    i += 1;
  }


  i = 0;
  for (point of pointsarr){
    duplicatePointSecond(i);
    i += 1;
  }


  // calculate all the ending positions of each of the dots
  let catPoints = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

  let pointNum = 0;
  for (point of pointsarr){
    // determine the category

    let element = document.getElementById("resPoint"+pointNum);
    let actualTop = element.getBoundingClientRect().top + window.scrollY;

    // convert it

    let percentTop = (actualTop-reshist.offsetTop)/reshist.offsetHeight;

    console.log("PERCENT TOP"+percentTop);

    let i = 0;
    while (i < 10){
      if (percentTop < i/10){
        let endPos = [(window.innerWidth*0.02*catPoints[i]+reshist.offsetWidth*0.05), reshist.offsetHeight/10*(i-0.5)];
        catPoints[i] += 1;

        let thePt = document.getElementById("resPoint"+pointNum);

        if (anim){
          movePointResidual(thePt, endPos[0], endPos[1]);
        } else {
          thePt.style.left = endPos[0]+"px";
          thePt.style.top = endPos[1]+"px";
        }

        break;
      }
      i += 1;
    }

    pointNum += 1;
  }
}




async function rotateHistogram(){

  let i = 0;
  while (i <= 90){
    histplot.style.transform = "rotate(-"+i+"deg)";
    await sleep();
    i += 0.5;
  }

  // adjust all of the ticks

  // document.getElementById("histTick0").style.top = histplot.offsetLeft+histplot.offsetWidth*(0.9)+"px";
  // document.getElementById("histTick1").style.top = histplot.offsetLeft+histplot.offsetWidth*(0.8)+"px";



  // i = 0;
  // while (i < 11){
  //   document.getElementById("histTick"+i).style.top = histplot.offsetLeft+histplot.offsetWidth*(0.9-0.1*i)+"px";
  //   document.getElementById("histTick"+i).style.left = histplot.offsetTop-histplot.offsetHeight*0.3+"px";

  //   document.getElementById("histLabel"+i).style.top = histplot.offsetLeft+histplot.offsetWidth*(0.9-0.1*i)-0.007*window.innerWidth+"px";
  //   document.getElementById("histLabel"+i).style.left = histplot.offsetTop-histplot.offsetHeight*0.4+"px";
  //   i += 1;
  // }
}



async function tiltplotgraph(){

  let tiltAngle = Math.atan(bestFitSlope / 1)*180/Math.PI;

  // plotgraph.style.transform = "rotate("+tiltAngle+"deg)";

  let angle = 0;
  while ((angle < tiltAngle && tiltAngle > 0) || (angle > tiltAngle && tiltAngle < 0)){
    
    plotgraph.style.transform = "rotate("+angle+"deg)";

    await sleep();
    
    if (tiltAngle < 0){
      angle -= 0.5;
    } else {
      angle += 0.5;
    }
  }

  // let i = 0;
  // while (i < 10){
  //   document.getElementById("tickY"+i).style.top = i*plotgraph.offsetHeight/10+"px";
  //   document.getElementById("tickY"+i).style.left = 0+"px";
  //   document.getElementById("labelY"+i).style.top = (10-i)*plotgraph.offsetHeight/10-window.innerHeight*0.085+"px";
  //   document.getElementById("labelY"+i).style.left = -window.innerWidth*0.025+"px";

  //   document.getElementById("tickX"+i).style.top = plotgraph.offsetHeight+"px";
  //   document.getElementById("tickX"+i).style.left = (i+1)*plotgraph.offsetWidth/10+"px";
  //   document.getElementById("labelX"+i).style.top = plotgraph.offsetHeight+window.innerHeight*0.025+"px";
  //   document.getElementById("labelX"+i).style.left = i*plotgraph.offsetWidth/10+window.innerHeight*0.085+"px";
  //   i += 1;
  // }



  console.log("trying to tilt "+tiltAngle+" degrees");
}



// next add adapting to data when new point is entered

xytable.style.maxHeight = window.innerHeight*0.65+"px";


initDraw();


window.addEventListener("resize", redraw);
plotgraph.addEventListener("click", addpoint);
plotgraph.addEventListener("scroll", handlezoom);


