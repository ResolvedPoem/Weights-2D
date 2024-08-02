var pillarSpacing = 1.5;
/*
Rock Influence Guidelines
  A String indicates location of the rock
  1 will RAISE the pillar in that relative location to the rock
  -1 will LOWER the pillar in that relative location to the rock
  0 will DO NOTHING to the pillar in that relative location to the rock
*/
var rockInfluence = [
  [
    [0,1,1],
    [1,'graphite',0],
    [0,1,1]
  ],
  [
    [0,1,0],
    [1,'obsidian',1],
    [0,1,0]
  ],
  [
    [1,1,0],
    [0,'lapis',0],
    [0,1,1]
  ],
  [
    [1,0,1],
    [1,'emerald',1],
    [0,1,0]
  ],
  [
    [1,1,1],
    [0,'ruby',0],
    [0,0,0]
  ],
];

var pillarsCurrentStance = [
  [-1,-1,1,-1],
  [0,-1,-1,0],
  [-1,-1,-1,-1],
  [-1,0,-1,1],
];

var testArray1 = [
  [1,2,3,4],
  [0,0,0,0],
  [0,0,-1,0],
  [0,0,0,0],
];

var testArray2 = [
  [1,0,0],
  [0,5,3],
  [0,0,3],
];



function sumArrays(array1, array2) {
  let result = [];
  for(let i = 0; i < array1.length; i++) {
    let start = [array1[i], array2[i] ? array2[i] : Array(array1[i].length).fill(0)];
    let sum = start.reduce((a, b) => a.map((v, i) => v + (b[i] ? b[i] : 0)));
    result.push(sum);
  }
  return result;
}

var colorRepresentation = { down:`#F10EAF`, balanced:`#7C638E`, up:`#FAE01F`};
var grid = {rows:pillarsCurrentStance.length, columns:pillarsCurrentStance[0].length, rocks:Object.keys(rockInfluence).length};

window.onload = (event) => {
//in case I want to make something run at launch
  let gameArea = document.getElementById('gameArea');
  //generate Platforms
  for(let rowNum = 0; rowNum < grid.rows; rowNum++) {
    for(let columnNum = 0; columnNum < grid.columns; columnNum++) {
      let newPillar = document.createElement('div');
      gameArea.appendChild(newPillar);
      newPillar.classList.add(`pillar`);
      newPillar.style.top = (window.innerHeight - (grid.rows * (newPillar.clientHeight * pillarSpacing))) / 2 + rowNum * (newPillar.clientHeight * pillarSpacing) + "px";
      newPillar.style.left = (window.innerWidth - (grid.columns * (newPillar.clientWidth * pillarSpacing))) / 2 + columnNum * (newPillar.clientHeight * pillarSpacing) + "px";
      if(pillarsCurrentStance[rowNum][columnNum] > 0) {
        newPillar.style.backgroundColor = colorRepresentation.up;
      } else if (pillarsCurrentStance[rowNum][columnNum] < 0) {
        newPillar.style.backgroundColor = colorRepresentation.down;
      } else {
        newPillar.style.backgroundColor = colorRepresentation.balanced;
      }
      newPillar.id = `${rowNum}, ${columnNum}`;
    }
  }
  //generate x Rocks
  for(let rockNum = 0; rockNum < grid.rocks; rockNum++) {
    let newRock = document.createElement(`div`);
    gameArea.appendChild(newRock);
    newRock.classList.add("rockArray");
    newRock.style.top = 100 + rockNum * 125 + "px";
    newRock.style.left = 100 + "px";
    dragElement(newRock);
    //loop through the rock array
    for(let rockRow = 0; rockRow < rockInfluence[rockNum].length; rockRow++) {
      for(let rockItem = 0; rockItem < rockInfluence[rockNum][rockRow].length; rockItem++) {
        //console.log(rockInfluence[rockNum][rockRow][rockItem]);
        let newInfluence = document.createElement(`div`);
        newRock.appendChild(newInfluence);
        newInfluence.classList.add("rock");
        newInfluence.style.top = rockRow * 150 + "px";
        newInfluence.style.left = rockItem * 150 + "px";
        if(typeof rockInfluence[rockNum][rockRow][rockItem] != `string`) {
          newInfluence.style.opacity = `.0`;
          newInfluence.influence = rockInfluence[rockNum][rockRow][rockItem];
        } else {
          newRock.mainRock = newInfluence;
          newRock.mainTopGap = rockRow * 150;
          newRock.mainLeftGap = rockItem * 150;
          newInfluence.influence = -1;
          newInfluence.style.zIndex = 10;
          newInfluence.style.backgroundImage = `url(./images/${rockInfluence[rockNum][rockRow][rockItem]}.png)`;
          switch (rockInfluence[rockNum][rockRow][rockItem]) {
            case 'graphite':
              newInfluence.style.backgroundColor = `gray`;
              break;
            case 'obsidian':
              newInfluence.style.backgroundColor = `purple`;
              break;
            case 'lapis':
              newInfluence.style.backgroundColor = `cyan`;
              break;
            case 'emerald':
              newInfluence.style.backgroundColor = `green`;
              break;
            case 'ruby':
              newInfluence.style.backgroundColor = `red`;
              break;
            default:
              newInfluence.style.backgroundColor = `#493c3c`;

          }
        }
      }
    }
  }
  // generateRandomStart();
}

// function generateRandomStart() {
//   let 
//   for(let rockNum = 0; rockNum < grid.rocks; rockNum++) {

//     console.log(rockInfluence[rockNum]);
//   }
//   for(let pillarRow = 0; pillarRow < pillarsCurrentStance.length; pillarRow++) {
//     for(let pillarItem = 0; pillarItem < pillarsCurrentStance[pillarRow].length; pillarItem++) {
//       console.log(pillarsCurrentStance[pillarRow][pillarItem]);
//     }
//   }

// }

function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById(elmnt.id + "header")) {
    // if present, the header is where you move the DIV from:
    document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
  } else {
    // otherwise, move the DIV from anywhere inside the DIV:
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    // Array.from(document.querySelectorAll(`.rockArray`)).forEach((div) => {
    //   if(div.style.zIndex > elmnt.style.zIndex && div.id != elmnt.id) {
    //     div.style.zIndex = div.style.zIndex-1;
    //   }
    // });
    // elmnt.style.zIndex = Array.from(document.querySelectorAll(`.rockArray`)).length + 4;
    let touchingPillar = overlayCheck(elmnt.mainRock, "pillar");
    if(touchingPillar[0]) {
      for (const influencer of elmnt.childNodes) {
        let affectingPillar = overlayCheck(influencer, "pillar");
        if(affectingPillar[0]) {
          pillarsCurrentStance[affectingPillar[0].id.split(", ")[0]][affectingPillar[0].id.split(", ")[1]] -= influencer.influence;
          //affectingPillar[0].innerHTML = pillarsCurrentStance[affectingPillar[0].id.split(", ")[0]][affectingPillar[0].id.split(", ")[1]];
          if(pillarsCurrentStance[affectingPillar[0].id.split(", ")[0]][affectingPillar[0].id.split(", ")[1]] > 0) {
            affectingPillar[0].style.backgroundColor = colorRepresentation.up;
          } else if (pillarsCurrentStance[affectingPillar[0].id.split(", ")[0]][affectingPillar[0].id.split(", ")[1]] < 0) {
            affectingPillar[0].style.backgroundColor = colorRepresentation.down;
          } else {
            affectingPillar[0].style.backgroundColor = colorRepresentation.balanced;
          }
        }
      }
    }
    // let touchingPillar = overlayCheck(elmnt, "pillar");
    // if(touchingPillar[0]) {
    //   touchingPillar[0].style.backgroundColor = colorRepresentation[pillarsDefaultStance[touchingPillar[0].id.split(", ")[0]][touchingPillar[0].id.split(", ")[1]]];
    //   pillarsCurrentStance[touchingPillar[0].id.split(", ")[0]][touchingPillar[0].id.split(", ")[1]] = pillarsDefaultStance[touchingPillar[0].id.split(", ")[0]][touchingPillar[0].id.split(", ")[1]];
    // }
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
    // elmnt.style.zIndex = Array.from(document.querySelectorAll(`.rockArray`)).length + 2;
    // let touchingPillar = overlayCheck(elmnt, "pillar");
    // if(touchingPillar[0]) {
    //   elmnt.style.top = touchingPillar[0].offsetTop + touchingPillar[0].clientHeight/2 - elmnt.clientHeight/2 + "px";
    //   elmnt.style.left = touchingPillar[0].offsetLeft + touchingPillar[0].clientWidth/2 - elmnt.clientWidth/2 + "px";
    //   pillarsCurrentStance[touchingPillar[0].id.split(", ")[0]][touchingPillar[0].id.split(", ")[1]] = pillarsCurrentStance[touchingPillar[0].id.split(", ")[0]][touchingPillar[0].id.split(", ")[1]]-1 < -1 ? -1 : pillarsCurrentStance[touchingPillar[0].id.split(", ")[0]][touchingPillar[0].id.split(", ")[1]]-1;
    //   touchingPillar[0].style.backgroundColor = colorRepresentation[pillarsCurrentStance[touchingPillar[0].id.split(", ")[0]][touchingPillar[0].id.split(", ")[1]]];
    // }
    let touchingPillar = overlayCheck(elmnt.mainRock, "pillar");
    if(touchingPillar[0]) {
      elmnt.style.top = touchingPillar[0].offsetTop - elmnt.mainTopGap + touchingPillar[0].clientHeight/2 - elmnt.mainRock.clientHeight/2 + "px";
      elmnt.style.left = touchingPillar[0].offsetLeft - elmnt.mainLeftGap + touchingPillar[0].clientWidth/2 - elmnt.mainRock.clientWidth/2 + "px";
      for (const influencer of elmnt.childNodes) {
        let affectingPillar = overlayCheck(influencer, "pillar");
        if(affectingPillar[0]) {
          pillarsCurrentStance[affectingPillar[0].id.split(", ")[0]][affectingPillar[0].id.split(", ")[1]] += influencer.influence;
          //affectingPillar[0].innerHTML = pillarsCurrentStance[affectingPillar[0].id.split(", ")[0]][affectingPillar[0].id.split(", ")[1]];
          if(pillarsCurrentStance[affectingPillar[0].id.split(", ")[0]][affectingPillar[0].id.split(", ")[1]] > 0) {
            affectingPillar[0].style.backgroundColor = colorRepresentation.up;
          } else if (pillarsCurrentStance[affectingPillar[0].id.split(", ")[0]][affectingPillar[0].id.split(", ")[1]] < 0) {
            affectingPillar[0].style.backgroundColor = colorRepresentation.down;
          } else {
            affectingPillar[0].style.backgroundColor = colorRepresentation.balanced;
          }
        }
      }
    }
  }
}

function overlayCheck(div, tagToCheck) {
  let points = Array.from(document.querySelectorAll(`.${tagToCheck}`));
  points.sort((a, b) => {
    let topfirst = a.style.top.replace("px","") - b.style.top.replace("px","");
    let leftfirst = a.style.left.replace("px","") - b.style.left.replace("px","");
    return leftfirst;
  });

  let allOverlaps = [];

  let rightPos = (elem) => elem.getBoundingClientRect().right;
  let leftPos = (elem) => elem.getBoundingClientRect().left;
  let topPos = (elem) => elem.getBoundingClientRect().top;
  let btmPos = (elem) => elem.getBoundingClientRect().bottom;

  for (let i = 0; i < points.length; i++) {
    let isOverlapping = !(
    rightPos(div) < leftPos(points[i]) ||
    leftPos(div) > rightPos(points[i]) ||
    btmPos(div) < topPos(points[i]) ||
    topPos(div) > btmPos(points[i])
    );

    if (isOverlapping) {
      allOverlaps.push(points[i]);
    }
  }
  return allOverlaps;
}