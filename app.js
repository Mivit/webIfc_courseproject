import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { IfcViewerAPI } from 'web-ifc-viewer';
import { Color } from 'three';

const container = document.getElementById('viewer-container');
let viewer = new IfcViewerAPI({container, backgroundColor: new Color(0xffffff)});

// viewer.axes.setAxes();
// viewer.grid.setGrid({size: 100});

loadIfc('../models/01.ifc');
let models = [];

async function loadIfc(url) {
  const model = await viewer.IFC.loadIfcUrl(url, true);
  models.push(model);
}

var modal = document.querySelector(".modal");
var listModal = document.querySelector(".list-modal");
var infoModal = document.querySelector(".info-modal");
var homeButton = document.getElementById("home-button");
var uploadButton = document.getElementById("upload-button");
var listButton = document.getElementById("list-button");
var infoButton = document.getElementById("info-button");
var closeButton1 = document.querySelector(".close-button1");
var closeButton2 = document.querySelector(".close-button2");
var model1 = document.getElementById("list1");
var model2 = document.getElementById("list2");
var model3 = document.getElementById("list3");
var pic1 = document.getElementById("pic1");
var pic2 = document.getElementById("pic2");
var pic3 = document.getElementById("pic3");

let pickedElement = null;

function loadHome() {
  releaseMemory();
  viewer = new IfcViewerAPI({container, backgroundColor: new Color(0xffffff)});
  loadIfc('../models/01.ifc');
};

function toggleModal() {
  modal.classList.toggle("show-modal");
}

function toggleListModal() {
  listModal.classList.toggle("show-modal");  
};

function toggleInfoModal() {
  infoModal.classList.toggle("show-modal");  
}


function closeModal(event) {
  switch (event.target.parentElement.parentElement) {
    case modal:
      modal.classList.toggle("show-modal");
      break;
    case listModal:
      listModal.classList.toggle("show-modal");
      break;    
    default:
      break;
  }
}

function loadModel(event) { 
  let path = '';
  
  switch (event.target) {
    case model1:
    case pic1:
      path = '../models/01.ifc';
      break;
    case model2:
    case pic2:
      path = '../models/revit_basic_model.ifc';
      break;
    case model3:
    case pic3:
      path = '../models/coordview_1.ifc';
      break;
    default:
      break;
  } 

  releaseMemory();
  viewer = new IfcViewerAPI({container, backgroundColor: new Color(0xffffff)});
  loadIfc(path.toString());
  toggleListModal();
}

function windowOnClick(event) {
  switch (event.target) {
    case modal:
      toggleModal();
      break;
    case listModal:
      toggleListModal();  
      break;
    case infoModal:
      toggleInfoModal();  
      break;
    default:
      break;
  }
}

function buttonPressed(event) {
  switch (event.key) {
    case "Escape":
      console.log("escape pressed");
      viewer.IFC.selector.unpickIfcItems();
      viewer.IFC.selector.unHighlightIfcItems();
      if (listModal.classList.contains("show-modal")) {
        toggleListModal(); 
      } else if(modal.classList.contains("show-modal")) {
        toggleModal();
      } else {
        propsGUI.style.border = "none";
        removeAllChildren(propsGUI);

      }
      break;
    default:
      break;
  }
}

homeButton.addEventListener("click", loadHome);
uploadButton.addEventListener("click", toggleModal);
listButton.addEventListener("click", toggleListModal);
closeButton1.addEventListener("click", closeModal);
closeButton2.addEventListener("click", closeModal);
model1.addEventListener("click", loadModel);
model2.addEventListener("click", loadModel);
model3.addEventListener("click", loadModel);
window.addEventListener("click", windowOnClick);
window.addEventListener("keydown", buttonPressed);

// handle upload
const upload = document.getElementById('upload');
upload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    const ifcURL = URL.createObjectURL(file);
    releaseMemory();
    viewer = new IfcViewerAPI({container, backgroundColor: new Color(0xffffff) });
    loadIfc(ifcURL); 
    toggleModal();
});

async function releaseMemory() {
  await viewer.dispose();

  models.length = 0;
}


window.oncontextmenu = async (event) => {
  event.preventDefault();
  event.stopPropagation();
  const result = await viewer.IFC.selector.highlightIfcItem(event);
  if (!result) return;
  const { modelID, id } = result;
  const props = await viewer.IFC.getProperties(modelID, id, true, false);
  // console.log(props);
  createPropertiesMenu(props, event);
  return false;
};

const propsGUI = document.getElementById("ifc-property-menu");

function createPropertiesMenu(properties, event) {
  // console.log(properties);
  // console.log(propsGUI);

  removeAllChildren(propsGUI);

  propsGUI.style.top = "51%";
  propsGUI.style.left = "51%";

  delete properties.psets;
  delete properties.mats;
  delete properties.type;


  for (let key in properties) {
      createPropertyEntry(key, properties[key], event);
  }

}

function createPropertyEntry(key, value, event) {
  const propContainer = document.createElement("div");
  propContainer.classList.add("ifc-property-item");

  if(value === null || value === undefined) value = "undefined";
  else if(value.value) value = value.value;

  const keyElement = document.createElement("div");
  keyElement.textContent = key;
  propContainer.appendChild(keyElement);

  const valueElement = document.createElement("div");
  valueElement.classList.add("ifc-property-value");
  valueElement.textContent = value;
  // console.log(valueElement);
  propContainer.appendChild(valueElement);

  propsGUI.appendChild(propContainer);
}

function removeAllChildren(element) {
  while (element.firstChild) {
      element.removeChild(element.firstChild);
  }
}