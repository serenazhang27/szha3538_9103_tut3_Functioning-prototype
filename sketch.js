let spiralCircles = [];
let circleDiameter = 250;
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(2, 85, 122);

  // adjust X spacing and Y spacing based on circle diameters as well as xOffset and adaptive grid layout to fit the window size.
  let xSpacing = circleDiameter + 15;
  let ySpacing = circleDiameter + 15;
  let xOffset = -width / 2; 
  
 // SpiralCircle objects in a grid
  for (let y = circleDiameter / 2; y <= height + circleDiameter; y += ySpacing) {
    for (let x = xOffset; x <= width + circleDiameter; x += xSpacing) {
      let spiralCircle = new SpiralCircle(x, y, circleDiameter);
      spiralCircles.push(spiralCircle);
    }
    xOffset += circleDiameter / 2; 

  }
}

function draw() {
  background(2, 85, 122); // background color
  time += 0.01; // Increment time for smooth movement

  for (let i = 0; i < spiralCircles.length; i++) {
    spiralCircles[i].display(time); // Pass `time` to animate each SpiralCircle
  }
}

//Reorganized the structure of the circles and removed duplicate parts to make it cleaner

class SpiralCircle {
  //use constructor to define a basic color
  constructor(x, y, diameter) {
    //update to store the initial x and y position
    this.baseX = x;
    this.baseY = y;
    this.diameter = diameter;
    this.radius = diameter / 2; // Added radius property for use in spirals


    // pre-generate random colours for the dots to aviod the strobe
    this.dotColors = [];
    let dotCount = 40;
    for (let i = 0; i < dotCount; i++) {
      this.dotColors.push(color(random(255), random(100), random(255))); // Store random red colours
    }

    // Set a base color for the gradient
    this.baseColor = color(random(150, 255), random(150, 255), random(150, 255));


    // New code for initializing gradient colors
    // This technique is from https://www.w3schools.com/jsref/jsref_fill.asp
    this.diametColors = new Array(10).fill(this.baseColor);

  }

  display(time) {

    // Update diametColors using Perlin noise for a dynamic gradient effect
    for (let i = 0; i < this.diametColors.length; i++) {
      let rNoise = noise(this.baseX * 0.01, time * 0.5 + i) * 50;
      let gNoise = noise(this.baseY * 0.01, time * 0.5 + i + 10) * 50;
      let bNoise = noise((this.baseX + this.baseY) * 0.01, time * 0.1 + i + 20) * 50;

      let r = red(this.diametColors[i]) + rNoise - 25; 
      let g = green(this.diametColors[i]) + gNoise - 25;
      let b = blue(this.diametColors[i]) + bNoise - 25;

      // Limit color values to ensure they remain within valid RGB range
      this.diametColors[i] = color(constrain(r, 100, 255), constrain(g, 100, 255), constrain(b, 100, 255));
    }



    // use perlin noise in x and y for Spiral animtaion movement
    let xOffset = noise(this.baseX * 0.01, time) * 50; // x offset for 'wave-like' movement
    let yOffset = noise(this.baseY * 0.01, time) * 50; // y offset for 'wave-like' movement
    let x = this.baseX + xOffset;
    let y = this.baseY + yOffset;

    // use perlin noise to diameter for smooth pulsation
    let diameterOffset = noise(this.diameter * 0.01, time + 5) * 50;
    let radius = (this.diameter + diameterOffset) / 2;

    // the adjusted x, y, and radius to the drawing methods
    this.drawPattern(x, y, radius, time);
    this.drawOuterRing(x, y, radius, time);
    this.drawDynamicSpirals(x, y, radius, time);
  }

  drawPattern(x, y, radius, time) {
    let numCircles = 10;
    let dotCount = 40;

    for (let i = 0; i < numCircles; i++) {
      let currentDiameter = radius * 2 - i * 30;

      fill(this.diametColors[i]);
      noStroke();
      ellipse(x, y, currentDiameter);

      // Draw dots around the circle using sin() and cos() for smooth radial movement
      for (let j = 0; j < dotCount; j++) {
        let angle = map(j, 0, dotCount, 0, TWO_PI);
        let offset = sin(time + j * 0.1) * 5;
        let dotX = x + cos(angle) * (currentDiameter / 2 + offset);
        let dotY = y + sin(angle) * (currentDiameter / 2 + offset);

        fill(this.dotColors[j]); // Use pre-generated colors for the inside dots
        ellipse(dotX, dotY, 6); // Draw the dots
      }
    }
  }

  drawOuterRing(x, y, radius, time) {
    let outerDotCount = 32;
    let outerRadius = (radius * 2 + 60) / 2.35;
    let colors = [
      color(255, 0, 0), // Red
      color(255, 165, 0), // Orange
      color(255, 255, 0)  // Yellow
    ];

    for (let j = 0; j < outerDotCount; j++) {
      let angle = map(j, 0, outerDotCount, 0, TWO_PI);
      let offset = cos(time + j * 0.1) * 10; // Radial movement
      let outerDotX = x + cos(angle) * (outerRadius + offset);
      let outerDotY = y + sin(angle) * (outerRadius + offset);

      fill(colors[j % colors.length]);
      noStroke();
      ellipse(outerDotX, outerDotY, 10, 8);
    }
  }

  drawThreeCircles(x, y, radius, time) {
    let sizes = [20, 13, 5];

    // Apply Perlin noise to slightly modify sizes over time for dynamic effect
    let sizeNoiseFactor = noise(x * 0.01, y * 0.01, time) * 5; // Adjust size using Perlin noise
    let dynamicSize1 = sizes[0] + sizeNoiseFactor;
    let dynamicSize2 = sizes[1] + sizeNoiseFactor;
    let dynamicSize3 = sizes[2] + sizeNoiseFactor;

    // Draw the three circles with dynamic sizes
    fill(255, 69, 0); // Orange
    noStroke();
    circle(x, y, dynamicSize1);

    fill(0); // Black
    noStroke();
    circle(x, y, dynamicSize2);

    fill(255); // White
    noStroke();
    circle(x, y, dynamicSize3);
  }


  drawDynamicSpirals(x, y, radius, time) {
    let spiralSize = radius * 0.8;
    let angleStep = TWO_PI / 20; // change this for tighter spirals
    let angleOffset = PI / 190; // shift the spiral

    stroke(255, 0, 0); // Solid red line
    strokeWeight(3.5);
    noFill();

    beginShape(); // Begin shape for drawing the spiral 
    for (let i = 0; i < 20; i++) {
      let noiseFactor = noise(x * 0.01, y * 0.01, time + i * 0.1);
      let angle = i * angleStep + time * 0.5 + angleOffset + noiseFactor * TWO_PI;
      let spiralX = x + cos(angle) * spiralSize * (i / 20) * noiseFactor;
      let spiralY = y + sin(angle) * spiralSize * (i / 20) * noiseFactor;
      vertex(spiralX, spiralY);
    }
    endShape();
  }
}



