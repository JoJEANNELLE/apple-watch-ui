import "./style.less";
import { DragGesture } from "@use-gesture/vanilla"
import gsap from "gsap";

// Params
const numberRow = 10;
const numberItembyRow = 10;

let currentIdx = Math.floor((numberRow*numberItembyRow) / 2) + Math.floor((numberItembyRow) / 2);

// Sizes
let windowW = null;
let windowH = null;
let cercleSize = null;
let menuW = null;
let menuH = null;

// Posititon
let menuPosition = {x: 0, y: 0}
let dragValue = {x: 0, y: 0}
let limitPosition = { min: {x: null, y: null}, max: {x: null, y: null} }

let gesture = null;

// Dom Element
let wrapperMenu = document.querySelector(".Menu_wrapper");
let rowsMenu = document.getElementsByClassName("Menu_row");
let itemsMenu = document.getElementsByClassName("Menu_item");

initMenu();

function initMenu() {
  setTimeout(() => {
    createMenu();
    setMenu();
    bindDragGesture();
  }, "1000");
}

function createMenu() {

  for (let idx = 0; idx < numberRow; idx++) {
    const row = document.createElement("div");
    row.className = "Menu_row";
    for (let i = 0; i < numberItembyRow; i++) {
      const item = document.createElement("div");
      item.className = "Menu_item";
      item.style.backgroundImage = `url(https://picsum.photos/id/${idx + 1}${i + 1}/${300}/${300})`;
      item.className = "Menu_item";
      row.appendChild(item);
    }
    wrapperMenu.appendChild(row);
  }
}

function setMenu() {
  windowW = window.innerWidth;
  windowH = window.innerHeight;

  cercleSize = windowW/3;
  menuW = cercleSize * numberItembyRow + cercleSize / 2;
  menuH = cercleSize * numberRow;

  wrapperMenu.style.width = menuW + "px";
  wrapperMenu.style.height = menuH + "px";

  setMaxLeftPosition();

  Array.prototype.forEach.call(itemsMenu, function(item) {
    item.style.width = cercleSize + "px";
    item.style.height = cercleSize + "px";
  })

  Array.prototype.forEach.call(rowsMenu, function(row, index) {
    if (index % 2 == 0) {
      row.style.marginLeft = cercleSize / 2 + "px";
    }
  })

  const newValues = centerToIndex(currentIdx);
  updateSliderPosition(newValues, 0)
  menuPosition = newValues
  dragValue = menuPosition
}

function bindDragGesture() {
  gesture = new DragGesture(wrapperMenu, onDragHandler)
}

function setMaxLeftPosition() {
  limitPosition.max.x = (windowW/2) - (cercleSize/2);
  limitPosition.max.y = (windowH/2) - (cercleSize/2);
  limitPosition.min.x = (windowW/2) - menuW + (cercleSize/2);
  limitPosition.min.y = (windowH/2) - menuH + (cercleSize/2);
}

function onDragHandler(event) {
  const active = event.active

  if (active) {
    dragValue.x += event.delta[0] * 1.5
    dragValue.y += event.delta[1] * 1.5

    const menuTranslation = getMenuPositionByDragValue(dragValue)
    menuPosition = menuTranslation
    updateSliderPosition(menuTranslation, 0)
  }else {
    const newValues = findNearestIdx();
    updateSliderPosition(newValues)
    menuPosition = newValues
    dragValue = menuPosition
  }
}

function findNearestIdx() {
  const list = getDistList()
  const index = list.indexOf(Math.min.apply( Math, list ))
  return centerToIndex(index)
}

function centerToIndex(index) {
  currentIdx = index

  const rowIdx = Math.floor(index / numberItembyRow) + 1
  const caseIdx = index - ((rowIdx - 1)*numberItembyRow) + 1
  const marge = (rowIdx - 1) % 2 == 0 ? cercleSize/2 : 0

  return {
    x: (windowW/2) - caseIdx*cercleSize + cercleSize/2 - marge,
    y: (windowH/2) - rowIdx*cercleSize + cercleSize/2,
  }
}

function getMenuPositionByDragValue(values) {
  return {
    x: clamp(limitPosition.min.x, values.x, limitPosition.max.x),
    y: clamp(limitPosition.min.y, values.y, limitPosition.max.y),
  }
}

function getDistList() {
  const distList = [];
  Array.prototype.forEach.call(itemsMenu, function(item) {
    const itemBound = item.getBoundingClientRect();
    const dx = (itemBound.x+(itemBound.width/2)) - windowW/2;
    const dy = (itemBound.y+(itemBound.height/2)) - windowH/2;
    const dist = Math.sqrt(dx * dx + dy * dy);
    distList.push(dist)
  });
  return distList
}

function updateSliderPosition(values, duration = 0.5) {
  gsap.killTweensOf(wrapperMenu)
  gsap.to(wrapperMenu, {
    x: values.x,
    y: values.y,
    duration,
    ease: "power3.out",
  })
}

function raf() {
  const list = getDistList()

  const nearestID = list.indexOf(Math.min.apply( Math, list ))

  list.forEach((dist, idx) => {

    let scale = .5
    const diff = (window.innerWidth / 2) - dist

    if(diff >= 0) {
      const sup = ((diff * 50) / (window.innerWidth / 2))
      scale = scale + (sup/100)
    }

    itemsMenu[idx].classList.remove('active')
    if(idx === nearestID) {
      itemsMenu[idx].classList.add('active')
    }

    itemsMenu[idx].style.transform = `scale(${scale})`;
  })

  window.requestAnimationFrame(raf);
}

function onResizeHandler() {
  setMenu()
}

window.requestAnimationFrame(raf);
window.addEventListener("resize", onResizeHandler)

// Utils
const clamp = (min, num, max) => Math.min(Math.max(num, min), max);






