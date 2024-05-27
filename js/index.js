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
let realres = document.getElementById("realres");


window.scrollTo({ left: 0, behavior: 'smooth' })



let step = 1;
let bestFitSlope = 0;

let plotActive = true;
let leftArrowReserved = false;

// and i will proceed to use var ahem ritam
var allowClick = true;
var keyArr = ["", "", "", "", "", "", "", "", ""];

var storea;
var storeb;
var residualArr = [];

var sdResiduals, sdY, meanResiduals, meanY;

const sleep = ms => new Promise(res => setTimeout(res, ms));


function getcoord(percentX, percentY) {

  // let x = plotgraph.offsetLeft+percentX/100*plotgraph.offsetWidth+1.5;
  // let y = plotgraph.offsetTop+(1-(percentY/100))*plotgraph.offsetHeight+1.5;

  let x = percentX/100*plotgraph.offsetWidth;
  let y = (1-(percentY/100))*plotgraph.offsetHeight;

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


  var element = document.getElementById(id);

  let retx = element.offsetLeft;

  let rety = element.offsetTop;
  
  retx -= (reshist.getBoundingClientRect().left-realres.getBoundingClientRect().left);

  retx += realres.offsetWidth/5;

  return [retx, rety];
}



function getcoordTiltRes(id) {

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
  let y = topPos - histplot.offsetTop+histplot.offsetHeight*0.035;

  // reflect
  x += (-(histplot.offsetLeft-plotgraph.offsetLeft)-x)*2;

  // translate
  x -= window.innerWidth*1.94;

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

function getcoordRealRes(percentX, percentY) {

  // let x = histplot.offsetLeft+percentX/100*histplot.offsetWidth+1.5;
  // let y = histplot.offsetTop+(1-(percentY/100))*histplot.offsetHeight+1.5;

  let x = percentX/100*realres.offsetWidth+1.5;
  let y = (1-(percentY/100))*realres.offsetHeight+1.5;

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

  plotgraph.innerHTML += `<span title="(${pointsarr[n][0].toFixed(2)},${pointsarr[n][1].toFixed(2)})"><div onclick="allowClick = false; deletePoint(${num});" onmouseover="glowPoint(${num});" onmouseout="revertPoint(${num});" id="realPoint${num}" class=point style="left: ${coordX}px; top: ${coordY}px;"></div></span>`;

  if (grow){
    growPoint("realPoint"+num);
  }
}

function duplicatePointDraw(x, y, n) {
  const num = n;

  [coordX, coordY] = getcoordadded(x,y);

  histplot.innerHTML += `<span title="(${pointsarr[n][0].toFixed(2)},${pointsarr[n][1].toFixed(2)})"><div id="movePoint${num}" class=point onmouseover="glowPoint(${num});" onmouseout="revertPoint(${num});" style="left: ${coordX}px; top: ${coordY}px;"></div></span>`;
}

function duplicatePointSecond(n) {
  const num = n;

  [coordX, coordY] = getcoordsecond("realResPoint"+n);

  reshist.innerHTML += `<span title="(${pointsarr[n][0].toFixed(2)},${pointsarr[n][1].toFixed(2)}) Residual: ${residualArr[n].toFixed(2)}"><div id="resPoint${num}" class=point onmouseover="glowPoint(${num});" onmouseout="revertPoint(${num});" style="left: ${coordX}px; top: ${coordY}px;"></div></span>`;
}

function duplicatePointRes(x, y, n) {
  const num = n;

  [coordX, coordY] = getcoordTiltRes("realPoint"+n);

  realres.innerHTML += `<span title="(${pointsarr[n][0].toFixed(2)},${pointsarr[n][1].toFixed(2)}) Residual: ${residualArr[n].toFixed(2)}"><div id="realResPoint${num}" class=point onmouseover="glowPoint(${num});" onmouseout="revertPoint(${num});" style="left: ${coordX}px; top: ${coordY}px;"></div></span>`;
}




function drawTickY(x, y, num, push=true) {
  if (push){
      tickYarr.push([x, y]);
  }

  [coordX, coordY] = getcoord(x,y);

  plotgraph.innerHTML += `
    <div id="labelY${num}" class=tickLabel style="left: ${coordX-0.035*window.innerWidth}px; top: ${coordY-9.75}px;">${goodNumber(Math.round(y*(tickYincrement/10)))}</div>
    <div id="tickY${num}" class=tickY style="left: ${coordX}px; top: ${coordY}px;"></div>`;
}

function drawTickHistogram(x, y, i) {

  [coordX, coordY] = getcoordHistogram(x,y);

  const num = i;

  histplot.innerHTML += `
    <div id="histLabel${num}" class=tickLabel style="left: ${coordX-0.035*window.innerWidth}px; top: ${coordY-9.75}px;">${goodNumber(Math.round(y*(tickYincrement/10)))}</div>
    <div id="histTick${num}" class=tickY style="left: ${coordX}px; top: ${coordY}px;"></div>`;
}

function drawTickRes(x, y, i) {

  [coordX, coordY] = getcoordResidual(x,y);

  const num = i;

  reshist.innerHTML += `
    <div id="resLabel${num}" class=tickLabel style="left: ${coordX-0.035*window.innerWidth}px; top: ${coordY-9.75}px;">${goodNumber(Math.round((y*(tickYincrement/10))-tickYincrement*5))}</div>
    <div id="resTick${num}" class=tickY style="left: ${coordX}px; top: ${coordY}px;"></div>`;
}


function drawTickRealRes(x, y, i) {

  [coordX, coordY] = getcoordRealRes(x,y);

  const num = i;

  realres.innerHTML += `
    <div id="resLabel${num}" class=tickLabel style="left: ${coordX-0.035*window.innerWidth}px; top: ${coordY-9.75}px;">${goodNumber(Math.round((y*(tickYincrement/10))-tickYincrement*5))}</div>
    <div id="resTick${num}" class=tickY style="left: ${coordX}px; top: ${coordY}px;"></div>`;
}

function drawTickRealResX(x, y, i) {

  [coordX, coordY] = getcoordRealRes(x,y);

  const num = i;

  realres.innerHTML += `
  <div id="resLabel${num}" class=tickLabel style="left: ${coordX-7.75}px; top: ${coordY+0.015*window.innerHeight}px;">${Math.round(x*(tickXincrement/10))}</div>
  <div id="resTickX${num}" class=tickX style="left: ${coordX}px; top: ${coordY}px;"></div>`;
}

function drawTickX(x, y, i, push=true) {
  if (push){
      tickXarr.push([x, y]);
  }

  [coordX, coordY] = getcoord(x,y);

  plotgraph.innerHTML += `
  <div id="labelX${i}" class=tickLabel style="left: ${coordX-7.75}px; top: ${coordY}px;">${Math.round(x*(tickXincrement/10))}</div>
  <div id="tickX${i}" class=tickX style="left: ${coordX}px; top: ${coordY-0.017*plotgraph.offsetHeight}px;"></div>`;
}

function drawResid(x, y, num){

  console.log("in resid");
  
  let [coordX, coordY] = getcoord(x,y);

  let resid = pointsarr[num][1] - ySolution(pointsarr[num][0]);

  const w = pointsarr[num][0]/tickXincrement*10+0.7+"%";
  let storeh = resid/tickYincrement*10+0.05;
  //const h = (resid/tickYincrement*10+0.05)+"%";

  // alert(storeh, resid);

  let offset;

  if (resid >= 0){
    offset = ySolution(pointsarr[num][0])/tickYincrement*10+"%";
  } else {
    storeh = -storeh;

    offset = pointsarr[num][1]/tickYincrement*10+"%";
  }

  storeh = storeh + "%";


  const h = storeh;

  const offsetuse = offset;

  console.log("middle of resid");

  residualArr.push(resid);


  plotgraph.innerHTML += `
  <div id="residualLine${num}" class=residualLine style="width: ${w}; height: ${h}; bottom: ${offsetuse}"></div>`;

}




async function drawResidReal(num){

  let resid = residualArr[num]

  const w = pointsarr[num][0]/tickXincrement*10+0.7+"%";
  let storeh = resid/tickYincrement*10+0.05;
  //const h = (resid/tickYincrement*10+0.05)+"%";

  // alert(storeh, resid);

  let offset;

  if (resid >= 0){
    offset = 50-1+"%";
  } else {

    storeh = -storeh;
    offset = 50+resid/tickYincrement*10+"%";
  }

  storeh = storeh + "%";


  const h = storeh;

  const offsetuse = offset;

  console.log("middle of resid");

  residualArr.push(resid);

  let realResRes = document.getElementById("realResRes");

  realResRes.innerHTML += `
  <div id="residualLine${num}" class=residualLine style="width: ${w}; height: ${h}; bottom: ${offsetuse}"></div>`;

}


function allowPointClick(){
  allowClick = true;
}


function reserveLeftArrow(){
  leftArrowReserved = true;
}

function unreserveLeftArrow(){
  leftArrowReserved = false;
}


function redraw(pointgrow = null){

  console.log(pointsarr);
  plotgraph.innerHTML = ``;

  drawBestFit();


  xytable.innerHTML = `
  <tr>
    <tr>
      <th><h1 onfocus="reserveLeftArrow();" onfocusout="unreserveLeftArrow();" class="pointInput xyCol">X</h1></th>
      <th><h1 onfocus="reserveLeftArrow();" onfocusout="unreserveLeftArrow();" class="pointInput xyCol">Y</h1></th>
      <td onclick="deleteAll();" style="border-radius: 0px;"><p style="margin: 0px; padding: 0px; padding-left: 10px; padding-right: 10px; cursor: pointer; border-radius: 25px; font-size: 75%; color: var(--contrast);">Delete All</p></td>
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

  plotgraph.innerHTML += `<div id="tickedBox" class="tickedBox"></div>`;

  xytable.innerHTML += `<tr id="pointaddbutton">
    <th>
      <a><button class="smallbtn" id="addpoint" onclick="addNewPoint()";>Add Point</button></a>
    </th>
  </tr>`;


  if (step == 2){
    drawHistogram(false);
  }

  if (lastfocus.substring(0,1) == "X"){
    newfocus = "Y"+lastfocus.substring(1);
  } else {
    newfocus = "X"+(parseInt(lastfocus.substring(1))+1);
  }

  if (document.getElementById(newfocus) != null){
    document.getElementById(newfocus).focus();
    // if (document.getElementById(newfocus).value == 0.00){
    //   document.getElementById(newfocus).value = "";
    // }
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
      <a><button class="smallbtn" id="addpoint" onclick="addNewPoint();">Add Point</button></a>
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

  if (!plotActive || !allowClick){
    allowPointClick();
    return;
  }

  let newpts = convertToPercentage(event.clientX+window.scrollX, event.clientY+window.scrollY);
  pointsarr.push(newpts);

  drawBestFit();

  saveData();

  redrawlite();
}


function addpointResource(x, y){

  let newpts = [x,y];
  pointsarr.push(newpts);

  console.log(pointsarr);

  drawBestFit();

  redrawlite();
}


function monitorChange(pointNum){
  console.log(pointNum, pointsarr);

  let getx = parseFloat(document.getElementById("X"+(pointNum)).value);
  let gety = parseFloat(document.getElementById("Y"+(pointNum)).value);

  while (getx > tickXincrement*10){
    tickXincrement = tickXincrement + 1;
  }


  while (gety > tickYincrement*10){
    tickYincrement = tickYincrement + 1;
  }


  pointsarr[pointNum] = [getx,gety];

  drawBestFit();

  redraw();

  saveData();
}

function checkForChange(){
  
  for (point of pointsarr){
    
    while (point[0] > tickXincrement*10){
      tickXincrement = tickXincrement + 1;
    }

    while (point[1] > tickYincrement*10){
      tickYincrement = tickYincrement + 1;
    }
  }
}

function pointToActual(x,y){
  return[x/10*tickXincrement, y/10*tickYincrement];
}

function addToTable(x,y,index){

  const idx = index;

  // onmouseover="selectPoint(${idx});"

  xytable.innerHTML += `
    <tr id="tableRow${idx}" onmouseover="glowPoint(${idx});" onmouseout="revertPoint(${idx});">
      <td><input class="pointInput" onfocus="reserveLeftArrow();" onfocusout="unreserveLeftArrow();" type="number" step="0.01" name="" id="X${idx}" value="${x.toFixed(2)}" onchange="lastfocus = 'X${idx}'; monitorChange(${idx});"></td>
      <td><input class="pointInput" onfocus="reserveLeftArrow();" onfocusout="unreserveLeftArrow();" type="number" step="0.01" name="" id="Y${idx}" value="${y.toFixed(2)}" onchange="lastfocus = 'Y${idx}'; monitorChange(${idx});"></td>
      <td onclick="deletePoint(${idx});" style="border-radius: 25px;"><p style="margin: 0px; padding: 0px; padding-left: 10px; padding-right: 10px; cursor: pointer; border-radius: 25px; font-size: 75%; color: var(--contrast);">delete</p></td>
    </tr>`

  // xytable.scrollTo({ top: 10000, behavior: 'smooth' })
}


function lightenPoint(id){
  try {
    let thePoint = document.getElementById(id);
    thePoint.style.backgroundColor = "red";
    thePoint.style.zIndex = 10;
  } catch (error) {
    // probably doesnt matter
  }
}

function darkenPoint(id){
  try {
    let thePoint = document.getElementById(id);
    thePoint.style.backgroundColor = "#0d6efd";
    thePoint.style.zIndex = 1;
  } catch (error) {
    // probably doesnt matter
  }
}

function glowPoint(num){
  lightenPoint("realPoint"+num);
  lightenPoint("movePoint"+num);
  lightenPoint("realResPoint"+num);
  lightenPoint("resPoint"+num);


  let tickedBox = document.getElementById("tickedBox");
  tickedBox.style.width = pointsarr[num][0]/tickXincrement*10+0.7+"%";
  tickedBox.style.height = pointsarr[num][1]/tickYincrement*10+0.05+"%";
  console.log("scrolled called");

  if (step == 1){
    let tableRow = document.getElementById("tableRow"+num);
    tableRow.style.backgroundColor = "red";

    console.log("scrolled out", xytable.offsetHeight, xytable.scrollY, tableRow.offsetTop);

    if (xytable.offsetHeight + xytable.scrollTop <= tableRow.offsetTop){
      console.log("scrolled");
      xytable.scrollTo({ top: tableRow.offsetTop+xytable.offsetHeight, behavior: 'smooth' })
    } else if (xytable.scrollTop >= tableRow.offsetTop){
      console.log("scrolled");
      xytable.scrollTo({ top: tableRow.offsetTop, behavior: 'smooth' })
    }
  }
}

function revertPoint(num){

  darkenPoint("realPoint"+num);
  darkenPoint("movePoint"+num);
  darkenPoint("realResPoint"+num);
  darkenPoint("resPoint"+num);

  let tickedBox = document.getElementById("tickedBox");

  tickedBox.style.width = "0%";
  tickedBox.style.height = "0%";


  if (step == 1){
    let tableRow = document.getElementById("tableRow"+num);
    tableRow.style.backgroundColor = "rgba(0,0,0,0)";
  }
}

async function addNewPoint(){
  let newpts = [0,0];
  pointsarr.push(newpts);
  drawBestFit();

  let beforeScroll = xytable.scrollTop;

  redraw(pointsarr.length-1);  

  xytable.scrollTo({ top: beforeScroll, behavior: 'instant' });

  saveData();

  // ok effect but looks kind of cheap
  // not sure if i want to invest in a glow
  // glowPoint(pointsarr.length-1);

  // await sleep(1000);

  // revertPoint(pointsarr.length-1);
}

function deletePoint(num){
  pointsarr.splice(num, 1);

  console.log("HEEERR");


  let beforeScroll = xytable.scrollTop;

  drawBestFit();
  redraw();

  saveData();

  console.log(beforeScroll);

  xytable.scrollTo({ top: beforeScroll, behavior: 'instant' });
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

  let sumY = 0;

  let i = 0;
  while (i < n){
    numerator += (arrX[i]*arrY[i]);
    sumY += arrY[i];
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

  bestFitSlope = a * tickXincrement / tickYincrement;

  // do rsquared

  let regressionSquaredError = 0;
  let totalSquaredError = 0;

  let meanY = sumY/n;


  i = 0;
  while (i < pointsarr.length){
    regressionSquaredError += Math.pow((pointsarr[i][1]-ySolution(pointsarr[i][0])), 2);
    totalSquaredError += Math.pow((pointsarr[i][1]-meanY), 2);
    i += 1;
  }

  let rSquared = 1 - (regressionSquaredError / totalSquaredError);

  // console.log(regressionSquaredError, totalSquaredError);


  let disp = document.getElementById("bfequation");

  if (a == 0 && b == 0){
    disp.innerHTML = "ŷ = 0 &nbsp&nbsp •  &nbsp&nbsp  r² = " + Math.round(rSquared * 100) / 100;
  } else if (a == 0){
    disp.innerHTML = "ŷ = " + Math.round(b * 100) / 100 + "  &nbsp&nbsp  •  &nbsp&nbsp  r² = " + Math.round(rSquared * 100) / 100;
  } else if (b == 0){
    disp.innerHTML = "ŷ = " + Math.round(a * 100) / 100 + "x" + " &nbsp&nbsp   •   &nbsp&nbsp r² = " + Math.round(rSquared * 100) / 100;
  } else if (a < 0){
    disp.innerHTML = "ŷ = " + Math.round(b * 100) / 100 + " - " + Math.abs(Math.round(a * 100) / 100) + "x" + " &nbsp&nbsp   •  &nbsp&nbsp  r² = " + Math.round(rSquared * 100) / 100;
  } else if (a > 0){
    disp.innerHTML = "ŷ = " + (Math.round(b * 100) / 100) + " + " + Math.round(a * 100) / 100 + "x" + " &nbsp&nbsp   •  &nbsp&nbsp  r² = " + Math.round(rSquared * 100) / 100;
  }

  return [a, b]
}

function ySolution(x){
  return storea * x + storeb;
}


function getStandardDeviation (array) {
  const n = array.length
  const mean = array.reduce((a, b) => a + b) / n
  return Math.sqrt(array.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n)
}


function drawBestFit(){

  if (pointsarr.length < 2){
    return;
  }

  let [a, b] = bestFit(pointsarr);

  storea = a;
  storeb = b;


  let plotx1 = 0;
  let ploty1 = Math.round(plotgraph.offsetHeight-(ySolution(0)/tickYincrement*10)*0.01*plotgraph.offsetHeight);

  let plotx2 = plotgraph.offsetWidth;
  let ploty2 = Math.round(plotgraph.offsetHeight-(ySolution(tickXincrement*10)/tickYincrement*10)*0.01*plotgraph.offsetHeight);


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
    drawResidualPlot();
  } else if (step == 5){
    drawResidualHistogram();
  } else if (step == 6){
    rotateResiduals();
  } else if (step == 7){
    shiftPanels();
  } else if (step == 8){
    shrinkPlots();
    document.getElementById("controlPanel").style.display = "none";
  }
  step += 1;
}


//NOOOOOOOTTT
// function previousAction(){
//   // steop will always be 2 or higher

//   if (step == 2){ // do the reverse of drawHistogram
//     reverseDrawHistogram();
//     plotgraph.style.cursor = "crosshair";
//     plotActive = true;
//   } else if (step == 2){
//     rotateHistogram();
//   } else if (step == 3){
//     tiltplotgraph();
//   } else if (step == 4){
//     drawResidualHistogram();
//   } else if (step == 5){
//     rotateResiduals();
//   } else if (step == 6){
//     shiftPanels();
//   } else if (step == 7){
//     shrinkPlots();
//   } else if (step == 8){
//     squarePlots();
//   }
//   step -= 1;
// }


async function movePoint(point, x, y){
  let nowX = point.offsetLeft;
  let nowY = point.offsetTop;
  while ((nowX > x+10 && nowX > x) || (nowX < x-2 && nowX < x)){
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
  while (nowX < x){
    point.style.left = nowX+"px";
    point.style.top = nowY+"px";

    nowX += (x-nowX+10)/100;
    nowY += (y-nowY+10)/100;

    await sleep();
  }
}



function drawHistogram(anim=true){

  leftDisp.innerHTML = `
  <h1 id="disthistlabel">Distribution Histogram</h1>
  <div id="horizontalHistogramPlot" class="horizontalHistogramPlot">
    <h1 id="disthistlabelinternal"></h1>
  </div>`;

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
    drawResid(point[0]/tickXincrement*10, point[1]/tickYincrement*10, i);
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

function reverseDrawHistogram(anim=true){

  // change this to xytable, then redraw xytable (MAY NEED TO GET THE ELEMENT AGAIN)
  // leftDisp.innerHTML = `
  // <h1 id="disthistlabel">Distribution Histogram</h1>
  // <div id="horizontalHistogramPlot" class="horizontalHistogramPlot">
  //   <h1 id="disthistlabelinternal"></h1>
  // </div>`;

  let pointNum = 0;
  for (point of pointsarr){
    // determine the category
    let endPos = getcoordadded(point[0]/tickXincrement*10, point[1]/tickYincrement*10);

    // alert(endPos);

    let thePt = document.getElementById("movePoint"+pointNum);

    if (anim){
      movePoint(thePt, endPos[0], endPos[1]);
    } else {
      thePt.style.left = endPos[0]+"px";
      thePt.style.top = endPos[1]+"px";
    }

    pointNum += 1;
  }
}



async function drawResidualPlot(anim=true){
  realres = document.getElementById("realres");

  document.body.style.overflowX = "scroll";
  window.scrollTo({ left: window.innerWidth/2, behavior: 'smooth' })



  drawTickRealRes(0, 0, 0);

  let i = 1;
  for (tick of tickYarr){
    drawTickRealRes(tick[0], tick[1], i);
    i += 1;
  }

  i = 1;
  for (tick of [10, 20, 30, 40, 50, 60, 70, 80, 90, 100]){
    drawTickRealResX(tick, 50, i);
    i += 1;
  }

  i = 0;
  while (i < pointsarr.length){
    duplicatePointRes(pointsarr[i][0]/tickXincrement*10, residualArr[i]/tickYincrement*10+50, i);
    drawResidReal(i);
    // const num = i;

    // const endPos = [pointsarr[num][0]/tickXincrement*10, residualArr[num]/tickYincrement*10+50];
    // const thePt = document.getElementById("realResPoint"+num);
    // movePointResidual(thePt, endPos[0], endPos[1]);
    i += 1;
  }


  // let endCoordinates = [pointsarr[i][0]/tickXincrement*10, residualArr[i]/tickYincrement*10+50];


  // calculate all the ending positions of each of the dots
  let pointNum = 0;
  for (point of pointsarr){
    
    let endPos = [pointsarr[pointNum][0]/tickXincrement*10, residualArr[pointNum]/tickYincrement*10+50];

    endPos[1] = -endPos[1]+100;

    let thePt = document.getElementById("realResPoint"+pointNum);
    movePointResidual(thePt, endPos[0]/100*realres.offsetHeight, endPos[1]/100*realres.offsetHeight);

    pointNum += 1;
  }

  let realResRes = document.getElementById("realResRes");

  i = 0;
  while (i < 100){
    realResRes.style.opacity = i/100;

    await sleep();
    i += 0.18;
  }
}

function drawResidualHistogram(anim=true){
  rightDisp.innerHTML = `
  <h1 id="reshistlabel">Residuals Histogram</h1>
  <div id="residualHistogram" class="residualHistogram">
  <h1 id="reshistlabelinternal" style="width: 150%"></h1>
  </div>`;

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

    // let percentTop = (actualTop-reshist.offsetTop+reshist.offsetHeight*0.125)/reshist.offsetHeight;

    let i = 0;
    while (i < 10){
      // determine if this is the correct level for it

      let checklevel = -(i-5)*tickYincrement;

      if (residualArr[pointNum] > checklevel){
        let endPos = [(window.innerWidth*0.02*catPoints[i]+reshist.offsetWidth*0.05), reshist.offsetHeight*((i-0.5)/10)];
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
    i += (95-i)/70;
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



async function rotateResiduals(){

  let i = 0;
  while (i <= 90){
    reshist.style.transform = "rotate(-"+i+"deg) translateX("+(-(-(i/90)*30+12.5))+"%)";
    await sleep();
    i += (95-i)/70;
  }
}


async function shiftPanels(){
  let i = 0;

  let pglabel = document.getElementById("pglabel");
  let mdisp = document.getElementById("middledisplay");
  let rsdisp = document.getElementById("resdisp");


  window.scrollTo({ left: 0, behavior: 'smooth' })

  while (i < 100){
    plotgraph.style.opacity = (100-i)/100;
    rsdisp.style.opacity = (100-i)/100;
    pglabel.style.opacity = (100-i)/100;
    await sleep();
    i += 1;
  }

  document.body.style.overflowX = "hidden";

  i = 33
  while (i > 0){
    mdisp.style.width = i+"%";
    rsdisp.style.width = i+"%";
    await sleep();
    i -= 1;
  }

  let rh = document.getElementById("reshistlabel");
  let dh = document.getElementById("disthistlabel");

  i = 100
  while (i > 0){
    rh.style.opacity = i/100;
    dh.style.opacity = i/100;
    await sleep();
    i -= 1;
  }

  rh = document.getElementById("reshistlabelinternal");
  dh = document.getElementById("disthistlabelinternal");

  rh.style.transform = "rotate(90deg) translate(30% , 200%)";
  dh.style.transform = "rotate(90deg) translate(45% , 15%)";


  rh.innerHTML = "Variability of residuals";
  dh.innerHTML = "Variability of y-values";

  calcStats();

  rh.innerHTML += `<br><span class='bfequation' id='bfequation'>Mean: ${meanResiduals.toFixed(2)} • SD: ${sdResiduals.toFixed(2)}</span>`
  dh.innerHTML += `<br><span class='bfequation' id='bfequation'>Mean: ${meanY.toFixed(2)} • SD: ${sdY.toFixed(2)}</span>`


  i = 0
  while (i < 100){
    rh.style.opacity = i/100;
    dh.style.opacity = i/100;
    await sleep();
    i += 1;
  }
}

async function shrinkPlots(){
  let i = 100;

  let startTransRes = reshist.style.transform;
  let startTransHist = histplot.style.transform;


  while (i > 60){

    reshist.style.transform = startTransRes + "scale("+i/100+")";
    histplot.style.transform = startTransHist + "scale("+i/100+")";

    await sleep();
    i -= 0.5;
  }

  let allDisp = document.getElementById("alldisplays");

  allDisp.innerHTML += "<div id='endpanel' class='endpanel'></div>";

  let endPanel = document.getElementById("endpanel");

  endPanel.innerHTML = `<div class="endexplain">R² = 1 - </div> <div class="endplot" id="destination1" style="border-bottom: 4px solid var(--contrast);"></div> <div class="endplot" id="destination2"></div><div class="summary">
  
  R² is the variability in y-values explained by the variability in x-values. The residuals represent the variability in y-values that is not explained by variability in x-values.
  The variance of the residuals over the variance of the y values represents the proportion of the variability in y-values that is not explained by the variability in x-values.
  1 - this value leads to R².

  <br>
  <br>
  
  R² = 1 - 
  <span class=fractionContainer>
    <span class="red">(Variance of residuals)</span>
    <span class=fractionInternal>(variance of y values)</span>
  </span>

  <br>

  R² = 1 - 
  <span class=fractionContainer>
    <span class="red">(SD of residuals)²</span>
    <span class=fractionInternal>(SD of y values)²</span>
  </span>

  <br>

  R² = 1 - 
  <span class=fractionContainer>
    <span class="red">(${(sdResiduals).toFixed(2)})²</span>
    <span class=fractionInternal>(${(sdY).toFixed(2)})²</span>
  </span>

  <br>

  R² = 1 - 
  <span class=fractionContainer>
    <span class="red">(${(sdResiduals*sdResiduals).toFixed(2)})</span>
    <span class=fractionInternal>(${(sdY*sdY).toFixed(2)})</span>
  </span>

  <br>

  R² = 1 - ${(sdResiduals*sdResiduals/(sdY*sdY)).toFixed(2)}

  <br>

  R² = ${(1-(sdResiduals*sdResiduals/(sdY*sdY))).toFixed(2)}
  
  </div>`; 


  let destination1 = document.getElementById("destination1");
  let destination2 = document.getElementById("destination2");

  startTransRes = reshist.style.transform;
  startTransHist = histplot.style.transform;
  let initDiffx = destination1.getBoundingClientRect().left+destination1.getBoundingClientRect().width*1.12-histplot.getBoundingClientRect().left;
  let initDiffy = -destination1.getBoundingClientRect().height*0.25+histplot.getBoundingClientRect().top;

  let initDiffx1 = destination2.getBoundingClientRect().left-destination2.getBoundingClientRect().width*2.45-reshist.getBoundingClientRect().left;
  let initDiffy1 = destination2.getBoundingClientRect().top*-0.75-destination2.getBoundingClientRect().height-reshist.getBoundingClientRect().top;


  console.log(initDiffx, initDiffy, initDiffx1, initDiffy1);

  // this is one of the stranges bugs ive ever seen
  // for some reason i need to redefine these in order for it to work
  histplot = document.getElementById("horizontalHistogramPlot");
  reshist = document.getElementById("residualHistogram");



  i = 0;
  while (i < 100){

    console.log("in the loop");

    histplot.style.transform = startTransHist + "translateY("+(i/100*initDiffx)+"px) translateX("+(-i/100*initDiffy)+"px)";

    reshist.style.transform = startTransRes + " translateY("+(i/100*initDiffx1)+"px) translateX("+(-i/100*initDiffy1)+"px)";


    await sleep();
    i += 1;
  }

  await squarePlots();

}


function calcStats(){
  sdResiduals = getStandardDeviation(residualArr);
  meanResiduals = residualArr.reduce((a, b) => a + b) / pointsarr.length;


  let yArr = [];

  for (el of pointsarr){
    yArr.push(el[1]);
  }

  sdY = getStandardDeviation(yArr);
  meanY = yArr.reduce((a, b) => a + b) / pointsarr.length;

}


async function squarePlots(){

  let scaledSdRes = sdResiduals/tickYincrement*10;
  let scaledMeanRes = meanResiduals/tickYincrement*10;
  let scaledSdY = sdY/tickYincrement*10;
  let scaledMeanY = meanY/tickYincrement*10;


  reshist.innerHTML += `          <div id="varianceBox2" class="varianceBox" style="top: ${(scaledMeanRes-scaledSdRes/2+50)}%; width: ${scaledSdRes}%; height: ${scaledSdRes}%;"></div>`

  histplot.innerHTML += `          <div id="varianceBox" class="varianceBox" style="border-color: rgb(0, 174, 255); bottom: ${scaledMeanY-scaledSdY/2}%; width: ${scaledSdY}%; height: ${scaledSdY}%;"></div>`



}


// function dragPoint(event){
//   // try to drag a point

//   alert("being dragged");

//   if (!plotActive){
//     return;
//   }

//   let thePoint = document.getElementById("realPoint"+num);


//   let newpts = convertToPercentage(event.clientX+window.scrollX, event.clientY+window.scrollY);
//   pointsarr[num] = (newpts);

//   thePoint.style.left = pointsarr[num][0]/tickXincrement*10+"px";
//   thePoint.style.top = pointsarr[num][1]/tickYincrement*10+"px";
// }




function closeOthers(thisEl){
  let els = ["preloadedSelect", "testSelect", "preferences", "instructions", "music", "shareData"];
  for (el of els){
    if (document.getElementById(el).style.display == "block" && el != thisEl){
      closeel(el);
    }
  }
}

// open whatever dialog
function openel(el){
  closeOthers();
  openscreen();
  document.getElementById(el).style.display = 'block';
  document.getElementById(el).style.opacity = 1;
  document.getElementById(el).style.top = '25%';
}

function closeel(el){
  closescreen();
  //document.getElementById('solutions').style.display = 'none';
  document.getElementById(el).style.opacity = 0;
  document.getElementById(el).style.top = '100%';
}

// open the background backdrop when a dialog is opened
function openscreen(){
  let el = document.getElementById("screen");
  el.style.display = "block";
  el.style.opacity = 0.4;
}

// close the background backdrop
function closescreen(){
  let el = document.getElementById("screen");
  el.style.display = "none";
  el.style.opacity = 0;
}

// change the theme from dark to light or override for setting it to whatever the saved theme is
function toggletheme(override){
  var r = document.querySelector(':root');

  // get elapsed time since last time a toggle was clicked
  let endtime = new Date();
  var timediff = endtime - lasttoggle; 
  lasttoggle = endtime;

  // if we are not changing to the saved theme and the user just pressed the theme change then dont change
  // this is there because something toggle theme used to get called two times in a row and cancel itself out
  if (timediff < 333 && !override){
      return;
  }

  // console.log('changeing from  '+theme);
  if (theme == 'dark'){
      // make light
      theme = 'light';
      localStorage.setItem('bttheme','light');
      document.getElementById('theme').textContent = "Theme: (light)";
      r.style.setProperty('--bg', 'white');
      r.style.setProperty('--contrast', 'black');
      r.style.setProperty('--main', '#0d6efd');
      r.style.setProperty('--slight', 'rgb(220,220,220)');
  } else {
      // make dark
      theme = 'dark';
      localStorage.setItem('bttheme','dark');
      document.getElementById('theme').textContent = "Theme: (dark)";
      r.style.setProperty('--bg', 'black');
      r.style.setProperty('--contrast', 'white');
      r.style.setProperty('--main', '#0d6efd');
      r.style.setProperty('--slight', 'rgb(40, 40, 40)');
  }
}

// force the theme to change to dark, if thats the saved theme
function forcedark(){
  theme = 'dark';
  localStorage.setItem('bttheme','dark');
  document.getElementById('theme').textContent = "Theme: (dark)";
  
  var r = document.querySelector(':root');
  r.style.setProperty('--bg', 'black');
  r.style.setProperty('--contrast', 'white');
  r.style.setProperty('--main', '#0d6efd');
  r.style.setProperty('--slight', 'rgb(40, 40, 40)');
}

function usePreloadedData(data){

  pointsarr = [];
  tickXincrement = 1;
  tickYincrement = 1;
  redraw();

  let i = 0;
  while (i < data.x.length){
    addpointResource(data.x[i],data.y[i])
    // pointsarr.push([data.x[i],data.y[i]]);
    i += 1;
  }

  checkForChange();
  drawBestFit();
  redraw();

  saveData();

  console.log(pointsarr);
}


async function useSavedData(dataX, dataY){

  pointsarr = [];
  tickXincrement = 1;
  tickYincrement = 1;
  redraw();

  let i = 0;
  while (i < dataX.length){
    addpointResource(parseFloat(dataX[i]),parseFloat(dataY[i]));
    console.log(pointsarr);

    // pointsarr.push([data.x[i],data.y[i]]);
    i += 1;
  }

  checkForChange();
  drawBestFit();
  redraw();

  saveData();

  closeel("loading");
  
  console.log(pointsarr);
}

function getRandomData(){
  let randX = [];
  let randY = [];

  let i = 0;
  let limit = Math.floor(Math.random()*30+10);
  let limitX = Math.floor(Math.random()*300+50);
  let limitY = Math.floor(Math.random()*300+50);
  while (i < limit){
    randX.push(Math.floor(Math.random() * limitX));
    randY.push(Math.floor(Math.random() * limitY));
    i += 1;
  }

  return {
    x: randX,
    y: randY
  }
}

async function selectProblem(nm){

  if (step > 2){
    if (window.confirm("Changing datasets will erase your current progress. Are you sure you want to continue?")) {
      
    } else {
      return;
    }
  }
  
  for (problem of allPreloaded){
    if (problem.name == nm){
      usePreloadedData(problem);
      break;
    }
  }
  for (problem of allSamples){
    if (nm == "Random Data"){
      usePreloadedData(getRandomData());
      break;
    }
    if (problem.name == nm){
      usePreloadedData(problem);
      break;
    }
  }

  saveData();



  if (step > 2){
    location.reload();
  }
}


function displayPreloaded(){

  let disp = document.getElementById("preloadedSelect");

  let i = 0;
  while (i < allPreloaded.length){
    let currentrow = `<div style="display: flex">`;

    let j = 0;
    while (j < 3 && i < allPreloaded.length){
      problem = allPreloaded[i];

      currentrow += `<div class="preloadedOption" onclick="closeel('preloadedSelect'); selectProblem('${problem.name}');">${problem.name}      <img src="./assets/problems/${problem.img}" width="100%" alt="image of stats problem with table"></div>`;

      j += 1; 
      i += 1;
    }

    currentrow += `</div>`;


    disp.innerHTML += currentrow;
  }


  disp.innerHTML += `<div class="close" onclick="closeel('preloadedSelect'); closescreen();">Close</div>`;
}


function displaySamples(){

  let disp = document.getElementById("testSelect");

  let i = 0;
  while (i < allSamples.length){
    let currentrow = `<div style="display: flex">`;

    let j = 0;
    while (j < 3 && i < allSamples.length){
      problem = allSamples[i];

      currentrow += `<div class="preloadedOption" onclick="closeel('testSelect'); selectProblem('${problem.name}');">${problem.name}      <img src="./assets/problems/${problem.img}" width="100%" alt="image of a scatterplot with data"></div>`;

      j += 1; 
      i += 1;
    }

    currentrow += `</div>`;


    disp.innerHTML += currentrow;
  }


  disp.innerHTML += `<div class="close" onclick="closeel('testSelect'); closescreen();">Close</div>`;
}


function saveData(){
  let stringX = "";
  let stringY = "";

  let i = 0;
  for (point of pointsarr){
    stringX += point[0];
    stringY += point[1];

    if (i != pointsarr.length-1){
      stringX += ",";
      stringY += ",";
    }

    i += 1;
  }

  if (stringX.substring(stringX.length-1, stringX.length) == ","){
    stringX = stringX.substring(0, stringX.length-1);
  }

  if (stringY.substring(stringY.length-1, stringY.length) == ","){
    stringY = stringY.substring(0, stringY.length-1);
  }

  localStorage.setItem("IamsPointsX",stringX);
  localStorage.setItem("IamsPointsY",stringY);
}


function deleteAll(){
  pointsarr = [];
  saveData();
  location.reload();
}


function createShareLink(){
  let sl = document.getElementById("shareLink");

  let lnk = "";

  let stringX = "";
  let stringY = "";

  let i = 0;
  for (point of pointsarr){
    stringX += point[0].toFixed(2);
    stringY += point[1].toFixed(2);

    if (i != pointsarr.length-1){
      stringX += ",";
      stringY += ",";
    }
  }

  stringX = stringX.substring(0, stringX.length-1);
  stringY = stringY.substring(0, stringY.length-1);


  lnk = window.location.href + "?X=" + stringX + "&Y=" + stringY;

  sl.textContent = lnk;
}

// load the settings from localstorage
let theme = localStorage.getItem('bttheme');
let angle = localStorage.getItem('btangle');
let demospeed = localStorage.getItem('btspeed');
let loadX = localStorage.getItem("IamsPointsX");
let loadY = localStorage.getItem("IamsPointsY");


let ur = window.location.href;

if (ur.includes("?")){

  let splt = ur.split("?");
  ur = splt[0];
  splt = splt[1].split("&");


  openel("loading");

  if (window.confirm("Using this dataset will erase your current data. Do you want to continue?")) {
    openel("loading");
    let extractedX = splt[0].replace("X=","");
    let extractedY = splt[1].replace("Y=","");

    extractedY = extractedY.substring(0, extractedY.length-1);
    extractedX = extractedX.substring(0, extractedX.length-1);


    localStorage.setItem("IamsPointsX",extractedX);
    localStorage.setItem("IamsPointsY",extractedY);
  }

  window.open(ur,"_self");
} else {

  if (loadX == null || loadX == "" || loadX == NaN){
    pointsarr = [];
    redraw();
  } else if (loadX != null && loadY != null){


    if (loadX.substring(loadX.length-1,loadX.length) == ","){
      loadX = loadX.substring(0, loadX.length-1);
    }
    if (loadY.substring(loadY.length-1,loadY.length) == ","){
      loadY = loadY.substring(0, loadY.length-1);
    }

    loadX = loadX.split(",");
    loadY = loadY.split(",");
  
    useSavedData(loadX, loadY);
  }  
}





if (loadX == null || loadX == "" || loadX == NaN){
  pointsarr = [];
  redraw();
}




let lasttoggle = new Date();

if (theme == null){
    localStorage.setItem("bttheme",'light');
    theme = 'light';
} else if (theme == 'dark'){
    forcedark();
}


let startUp = localStorage.getItem("IamsFirstUse");

if (startUp == null){
  openel("instructions");
  localStorage.setItem("IamsFirstUse","StartedUp");
}


// next add adapting to data when new point is entered

xytable.style.maxHeight = window.innerHeight*0.65+"px";


initDraw();

displayPreloaded();
displaySamples();


(async () => {
  fetch((`https://skparabapi-1-x8164494.deta.app/increment?key=iamsrsquared`))
    .then(response => {
        return response.json();
    })
    .then(data => {
        console.log(data);
    })
})();


window.addEventListener("resize", redraw);
plotgraph.addEventListener("click", addpoint);
plotgraph.addEventListener("mousemove", allowPointClick);


window.addEventListener("keydown", (event) => {
  if (event.isComposing || event.keyCode === 229) {
    return;
  }

  let actkey = event.code.replace("Key","");

  if (actkey == "ArrowRight" && !leftArrowReserved){
    nextAction();
  }

  keyArr.push(actkey);
  keyArr.shift();

  console.log(keyArr);

  let target = ["I", "A", "M", "S", "M", "U", "S", "I", "C"];

  let i = 0;
  let found = true;
  while (i < target.length){
    if (target[i] != keyArr[i]){
      found = false;
      break;
    }
    i += 1;
  }
  if (found){
    openel("music");
  }
});
