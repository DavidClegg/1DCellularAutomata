const size = 500;
const height = size;
const width = size;
const canvas = document.querySelector("canvas");
canvas.height = height;
canvas.width = width;
const context = canvas.getContext("2d");

window.onload = () => {
  // When the window loads this figures out if the device is landscape or portrait and uses css to correctly size the canvas to the window
  // I don't actually know if there is a css property that would have done this for me
  window.innerHeight > window.innerWidth ?
  canvas.style.setProperty("width", `100%`) :
  canvas.style.setProperty("height",`${window.innerHeight*0.9}px`)
}

let game = new Array(width);
game.fill(0); // Initialise the first line as all 0's
let hue = 0;
let hueDir = 1;
let CC = `hsl(${hue}, 100%, 50%)`;
let colours = [CC, "#114"];
let rule = '10000001'.split("");
    /* Fun rules:
    [10110110] | 109 | Boxes
    [10100110] | Rule 166 | Greek Mountain
    [10010010] | Temple pattern
    [10010110] |  Very beautiful
    [01010110] |  WOW
    [11100101] | short
    */
function update(){
    // create new array
    if(hue > 90)
    {
      hueDir = -1
      console.log("going down")
    } else if (hue < 1)
    {
      hueDir = 1
      console.log("going up")
    }
    hue = (hue+(hueDir/20));
    CC = `hsl(${hue+315}, 50%, 50%)`;
    colours = [CC, "#114"];
    // repeat
    for(let iteration = 0; iteration < speed; iteration++) // This controls the speed of the update by increasing the number of lines generated per update.
    {
      let image = context.getImageData(0,0,width,height); // Gets the previous image.
      context.putImageData(image, 0, -1); // Shifts the image up by 1 line.
      let newArray = [];
      for(let x = 0; x < game.length; x++){ // Loops through the
        // Drawing the current game line
        context.fillStyle = colours[game[x]]; // Each pixel is coloured based on it's value
        context.fillRect(x, height - 1, 1, 1); // This creates the pixel
        // Creates the next game line
        let parents;
        let answer = 0;
        switch(x){ // Handling edge cases
          case 0: // The first index only has 2 parents so the first parent is set to 0
          parents = [0, game[x],game[x+1]];
          answer = parseInt(parents.join(""),2); // concats the parents and treats them as a set of 3 bits, which then is treated as an int. 101 => 5 for example.
          newArray[x] = rule[answer]; // sets that index for the newArray to either 1 or 0 depending on the rule.

          case (game.length- 1): // This handles the last item in the array as an edge case.
          parents = [game[x-1],game[x], 0];
          answer = parseInt(parents.join(""),2);
          newArray[x] = rule[answer];

          default: // This simply takes the index and handles it the same as above
          parents = [game[x-1],game[x],game[x+1]];
          answer = parseInt(parents.join(""),2);
          newArray[x] = rule[answer];

        }
      }
      game = newArray; // this sets the game line to the next line
    }
    if(go){ // this allows me to pause/play
        // run update again
        requestAnimationFrame(update)
        //go = false
    }
}

function run(){
    go = true;
    update();
}

let go = true; // Bool to control whether or not the animation plays
let speed = 1; // Speed of the animation

// Elements for Event Listeners
const speedInput = document.querySelector("#speed");
const playBtn = document.querySelector("#Play");
const pauseBtn = document.querySelector("#Pause");
speedInput.addEventListener("input",()=>{
    // When the speed input changes set the new speed
    speed = speedInput.value;
})
playBtn.addEventListener("click", e=>{
  run();
  playBtn.className = "hide";
  pauseBtn.className = "show";
});
pauseBtn.addEventListener("click", e=>{
  go = false;
  playBtn.className = "show";
  pauseBtn.className = "hide";
});
