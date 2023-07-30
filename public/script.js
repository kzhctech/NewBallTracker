const startingLocation = window.location.pathname.substring(1);
//alert(startingLocation);

var cmnty;
var cmnt;
var dtail;
var bat1img,bat2img,bowlerimg;


var ballPossition = "";
var ballEvent;
var bID = "";

/* Midwicket */


function midwiket(run){
  const ball = document.getElementById("ball");
  const filder = document.getElementById("f7");
  
  if(run < 4 || !run){
    ball.style.animation = "midwiket-ball 4s";
  }
  else{
    ball.style.animation = "midwiket-ball-boundary 4s";
  }
  
  filder.style.animation = "midwiket-filder 5s";
  
  setTimeout(function() {
    ball.style.animation = "";
  }, 4000);
  setTimeout(function() {
    filder.style.animation = "";
  }, 5000);
  
}


/* Extracover */

function deepExtracover(run){
  const ball = document.getElementById("ball");
  const filder = document.getElementById("f8");
  
  if(run < 4 || !run){
    ball.style.animation = "deepExtracover-ball 4s";
  }
  else{
    ball.style.animation = "deepExtracover-ball-boundary 4s";
  }
  
  filder.style.animation = "deepExtracover-filder 5s";
  
  setTimeout(function() {
    ball.style.animation = "";
  }, 4000);
  setTimeout(function() {
    filder.style.animation = "";
  }, 5000);
  
}


/* Thirdman */

  function thirdman(run){
  
  const ball = document.getElementById("ball");
  const filder = document.getElementById("f2");
  
  if(run < 4 || !run){
    ball.style.animation = "thirdman-ball 4s";
  }
  else{
    ball.style.animation = "thirdman-ball-boundary 4s";
  }
  
  filder.style.animation = "thirdman-filder 5s";
  
  setTimeout(function() {
    ball.style.animation = "";
  }, 4000);
  setTimeout(function() {
    filder.style.animation = "";
  }, 5000);
    
    
  }

/* squreLeg */

  function squreLeg(run){
  
  const ball = document.getElementById("ball");
  const filder = document.getElementById("f1");
  
  if(run < 4 || !run){
    ball.style.animation = "squreLeg-ball 4s";
  }
  else{
    ball.style.animation = "squreLeg-ball-boundary 4s";
  }
  
  filder.style.animation = "squreLeg-filder 5s";
  
  setTimeout(function() {
    ball.style.animation = "";
  }, 4000);
  setTimeout(function() {
    filder.style.animation = "";
  }, 5000);
  }



/*  point */

  function point(run){
  
  const ball = document.getElementById("ball");
  const filder = document.getElementById("f9");
  
  if(run < 4 || !run){
    ball.style.animation = "point-ball 4s";
  }
  else{
    ball.style.animation = "point-ball-boundary 4s";
  }
  
  filder.style.animation = "point-filder 5s";
  
  setTimeout(function() {
    ball.style.animation = "";
  }, 4000);
  setTimeout(function() {
    filder.style.animation = "";
  }, 5000);
  }

/*  midOff */

  function midOff(run){
   
  const ball = document.getElementById("ball");
  const filder = document.getElementById("f3");
  
  if(run < 4 || !run){
    ball.style.animation = "midOff-ball 4s";
  }
  else{
    ball.style.animation = "midOff-ball-boundary 4s";
  }
  
  filder.style.animation = "midOff-filder 5s";
  
  setTimeout(function() {
    ball.style.animation = "";
  }, 4000);
  setTimeout(function() {
    filder.style.animation = "";
  }, 5000);

  }

/*  midOn */

  function midOn(run){
   
  const ball = document.getElementById("ball");
  const filder = document.getElementById("f4");
  
  if(run < 4 || !run){
    ball.style.animation = "midOn-ball 4s";
  }
  else{
    ball.style.animation = "midOn-ball-boundary 4s";
  }
  
  filder.style.animation = "midOn-filder 5s";
  
  setTimeout(function() {
    ball.style.animation = "";
  }, 4000);
  setTimeout(function() {
    filder.style.animation = "";
  }, 5000);

  }


/* fineLeg */

  function fineLeg(run){
   
  const ball = document.getElementById("ball");
  const filder = document.getElementById("f5");
  
  if(run < 4 || !run){
    ball.style.animation = "fineLeg-ball 4s";
  }
  else{
    ball.style.animation = "fineLeg-ball-boundary 4s";
  }
  
  filder.style.animation = "fineLeg-filder 5s";
  
  setTimeout(function() {
    ball.style.animation = "";
  }, 4000);
  setTimeout(function() {
    filder.style.animation = "";
  }, 5000);

  }

/* gully */

  function gully(run){
   
  const ball = document.getElementById("ball");
  const filder = document.getElementById("f6");
  
  if(run < 4 || !run){
    ball.style.animation = "gully-ball 4s";
  }
  else{
    ball.style.animation = "gully-ball-boundary 4s";
  }
  
  filder.style.animation = "gully-filder 5s";
  
  setTimeout(function() {
    ball.style.animation = "";
  }, 4000);
  setTimeout(function() {
    filder.style.animation = "";
  }, 5000);

  }
  function showAD(){
    document.getElementById("adv").style.display = "block";
  }

  
  function hideAD(){
    document.getElementById("adv").style.display = "none";
  }


setInterval(function() {
  


let textTold = ballPossition;





var pitched;
  
  if(textTold.includes('inline') || textTold.includes('in line')){
    console.log('inline it is');
    pitched = "inline";
  }
  
  if(textTold.includes('leg') || textTold.includes('outside leg')){
    console.log('inline it is');
    pitched = "leg";
  }
  
  if(textTold.includes('of') || textTold.includes('outside of')){
    console.log('inline it is');
    pitched = "";
  }
  
  
  if(textTold.includes('your car')){
    console.log('ok');
    Yourker(pitched);
  }
  
  if(textTold.includes('plot') || textTold.includes('slot')){
    console.log('ok');
    Slot(pitched);
  }
  
  if(textTold.includes('length')){
    console.log('ok');
    Length(pitched);
  }
  
  if(textTold.includes('short')){
    console.log('ok');
    Short(pitched);
  }










  //alert(ballPossition);
  if (ballPossition.includes("point")) {
     point(ballEvent);
   }
   
   else if (ballPossition.includes("mid-on")) {
     midOn(ballEvent);
   }
 
   else if (ballPossition.includes("mid-of")) {
     midOff(ballEvent);
   }
 
   else if (ballPossition.includes("mid-wicket")) {
     midwiket(ballEvent);
   }
   
   else if (ballPossition.includes("square")) {
     squreLeg(ballEvent);
   }
   
   else if (ballPossition.includes("third")) {
     thirdman(ballEvent);
   }
   
   else if (ballPossition.includes("cover")) {
     deepExtracover(ballEvent);
   }
 
   else if (ballPossition.includes("long-on")) {
     midwiket(ballEvent);
   }
   else if (ballPossition.includes("long-of")) {
     deepExtracover(ballEvent);
   }
   else if (ballPossition.includes("fine-leg")) {
     fineLeg(ballEvent);
   }
   else if (ballPossition.includes("gully")) {
     gully(ballEvent);
   }
   console.log(ballPossition)
},6000)






function setPosition(pst,run,bcid){
  ballPossition = pst;
  ballEvent = run;



const element = document.getElementById(bcid);

if (element) {
  element.classList.add('active');

        setTimeout(() => {
    element.classList.remove('active');
  }, 500);
}

  //console.log(bcid,element);

}






function formatBadString(input) {



	if (input){
  // Remove the part before 'numberLast', where 'number' can be any digit
  const cleanedInput = input.replace(/.*?\d+Last/, '');

  // Clean up the input by removing extra spaces and line breaks
  const trimmedInput = cleanedInput.replace(/\s+/g, ' ').trim();

  // Split the cleaned input string by spaces
  const elementsArray = trimmedInput.split(' ');

  // Wrap each element with a div and assign an id of their index (adjusting IDs greater than or equal to 9)
  const wrappedElements = elementsArray.map((element, index) => {
    // Check if the element contains 'any number This'
    const thisMatch = element.match(/(\d+)This/);
    if (thisMatch) {
      const number = thisMatch[1];
      const text = element.replace(thisMatch[0], 'This');
      const adjustedIndex = index >= 9 ? index - 9 : index;
      const id = adjustedIndex === index ? `last-${adjustedIndex}` : `this-${adjustedIndex}`;
return [`<li class="page-item" id="${id}"><a class="page-link" href="#">${number}</a></li>`, `<li id="${id}"><a class="page-link" href="#">${text}</a></li>`];
    } else {
      const adjustedIndex = index >= 9 ? index - 9 : index;
      const id = adjustedIndex === index ? `last-${adjustedIndex}` : `this-${adjustedIndex}`;
      return `<li class="page-item" id="${id}"><a class="page-link" href="#">${element}</a></li>`;
    }
  });

  // Flatten the array and join the wrapped elements into a single string with line breaks
  return wrappedElements.flat().join('\n');


	}
}

// Test with the given string
const inputString = '98th Over: 0  0  0  0  0  0   = 099th Over: 0  0  0  0  0  0   = 0Last Over: 0  0  1  1  0  0   = 2This Over: 0  0  0   = 0';
const outputString = formatBadString(inputString);
console.log(outputString);

