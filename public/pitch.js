var lengthShort = document.querySelector('#Short');

var lengthYourker = document.querySelector('#Yourker');

var lengthLength = document.querySelector('#Length');

var lengthSlot = document.querySelector('#Slot');

var lengthLine = document.querySelector('#bm1');

var dirLine = document.querySelector('#bm2');

var field = document.querySelector('#myDiv');

var lengWrap = document.querySelector('#lenawrap');

var rightHand = true;

function toggleHand(){
  
  if (rightHand){
  field.classList.add("lefthand");
  lengWrap.classList.add("lefthand");
  rightHand = false;
  }else{
    field.classList.remove("lefthand");
  lengWrap.classList.remove("lefthand");
  rightHand = true;
  }
  
}

function animi(){
  lengthLine.style.display = "none";
  dirLine.style.display = "none";
  
  setTimeout(function() {
  lengthLine.style.display = "block";
  dirLine.style.display = "block";
  }, 10);
}


function removeLength(){
  lengthShort.classList.remove("show");
  lengthSlot.classList.remove("show");
  lengthYourker.classList.remove("show");
  lengthLength.classList.remove("show");
}


function pitch(pitching){
    if(!pitching){
  dirLine.style.left = "117px";
  lengthLine.style.left = "105px";
  lengthLine.style.transform = "rotateZ(12deg)";
  dirLine.style.transform = "rotateZ(12deg)";
  }
  else if(pitching == 'inline'){
  dirLine.style.left = "140px";
  lengthLine.style.left = "128px";
  lengthLine.style.transform = "rotateZ(12deg)";
  dirLine.style.transform = "rotateZ(12deg)";
  }
  else if(pitching == 'leg'){
  dirLine.style.left = "155px";
  lengthLine.style.left = "132px";
  lengthLine.style.transform = "rotateZ(22deg)";
  dirLine.style.transform = "rotateZ(22deg)";
  }
  
}


function Slot(pitching){
  
  animi();
  
  lengthLine.style.animationName = "lengthSlot";
  dirLine.style.animationName = "dirSlot";
  
  dirLine.style.bottom = "165px";
  
  pitch(pitching);
  
  removeLength();
  lengthSlot.classList.add("show");
}




function Short(pitching){
  
  animi();
  
  
  lengthLine.style.animationName = "length";
  dirLine.style.animationName = "direction";
  
  dirLine.style.bottom = "145px";
  
  pitch(pitching);
  
  removeLength();
  lengthShort.classList.add("show");
}





function Length(pitching){
  
  animi();
  
  
  lengthLine.style.animationName = "lengthLength";
  dirLine.style.animationName = "dirLength";
  
  dirLine.style.bottom = "155px";
  
  pitch(pitching);
  
  removeLength();
  lengthLength.classList.add("show");
}

function Yourker(pitching){
  
  animi();
  
  
  lengthLine.style.animationName = "lengthYourker";
  dirLine.style.animationName = "dirYourker";
  dirLine.style.bottom = "175px";
  
  pitch(pitching);
  
  removeLength();
  lengthYourker.classList.add("show");
}










