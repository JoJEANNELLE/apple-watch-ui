import "./style.less";

const numberRow = 5;
const numberItembyRow = 5;
const numberCircle = numberRow * numberItembyRow;
const cercleSize = 400;

let posX = 0;
let posY = 0;
let startX = 0;
let startY = 0;
let mouseX = 0;
let mouseY = 0;
let oldOffsetX = 0;
let oldOffsetY = 0;
let offsetX = 0;
let offsetY = 0;

const windowW = window.innerWidth;
const windowH = window.innerHeight;

const menuW = cercleSize*numberItembyRow;
const menuH = cercleSize*numberRow;

const Wrapper = document.querySelector(".Menu_wrapper")

initMenu();

function initMenu() {
  Wrapper.style.transform = `translate(0px, 0px)`

  // Create circle
  for (let i = 0; i < numberRow; i++) {
    const row = document.createElement('div');
    row.className = 'Menu_row';
    
    for (let i = 0; i < numberItembyRow; i++) {
      const item = document.createElement('div');
      item.className = 'Menu_item';
      item.style.width = cercleSize+'px';
      item.style.height = cercleSize+'px';
      item.className = 'Menu_item';
      item.textContent = i;
      row.appendChild(item); 
    }
    Wrapper.appendChild(row); 
  }

  // Set size & position
  Wrapper.style.width = menuW+'px';
  Wrapper.style.height = menuH+'px';
  const currentBound = document.getElementsByClassName("Menu_item")[12].getBoundingClientRect();
  posX = (windowW/2) - (currentBound.x+(currentBound.width/2));
  posY = (windowH/2) - (currentBound.y+(currentBound.height/2));
  Wrapper.style.transform = `translate(${posX}px, ${posY}px)`
}

window.addEventListener("mousedown", handleClick);

function handleClick(e) {
  window.addEventListener("mousemove", handleMouse);
  window.addEventListener("mouseup", handleRelease);
  startX = e.clientX;
  startY = e.clientY;
  oldOffsetX = 0;
  oldOffsetY = 0;
  offsetX = 0;
  offsetY = 0;
  Wrapper.style.cursor = "grabbing";
}

function handleMouse(e) {
  mouseX = e.clientX;
  mouseY = e.clientY;
  offsetX = oldOffsetX + mouseX - startX;
  offsetY = oldOffsetY + mouseY - startY;
  Wrapper.style.transform = `translate(${posX+offsetX}px, ${posY+offsetY}px)`
}

function handleRelease() {
  window.removeEventListener("mouseup", handleRelease);
  window.removeEventListener("mousemove", handleMouse);
  posX = posX+offsetX
  posY = posY+offsetY
  Wrapper.style.cursor = "grab";
}



