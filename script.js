var r = 100;
var g = 100;
var b = 100;
var color = "rgb(" + r + ", " + g + ", " + b + ")";
var numColorsToDisplay = 10; // Change this value based on preference

// Selecting the HTML element and store it as a variable.
var colorBox = document.getElementById('color-box');
var statement = document.getElementById('statement');
var submitButton = document.getElementById('button');
const rgbValue = document.getElementById('rgb-value');
const copied = document.getElementById('copied');

var colorContainer = document.querySelector('.color-container');
var colorInfoContainer = document.querySelector('.color-info-container');
var colorInfo = document.querySelector('.color-info');

const preview = document.getElementById('preview');
const rSliderValue = document.getElementById('r-value');
const gSliderValue = document.getElementById('g-value');
const bSliderValue = document.getElementById('b-value');

// Default color (black)
colorBox.style.backgroundColor = color;

// On Event
submitButton.addEventListener("click", function() {
    updateColor();
    updateSliders();
    updatePreview();
});

function updateColor(rgbObject) {
    copied.style.display = 'none';

    if(!rgbObject) {
    r = Math.round(Math.random() * 255);
    g = Math.round(Math.random() * 255);
    b = Math.round(Math.random() * 255);
    } else {
        r = rgbObject.r;
        g = rgbObject.g;
        b = rgbObject.b;
    }
    color = "rgb(" + r + ", " + g + ", " + b + ")";

    // Set the slider values
    rSliderValue.textContent = r;
    gSliderValue.textContent = g;
    bSliderValue.textContent = b;

    // Define a threshold for considering a color as "redish," "bluish," or "greenish"
    var difference = 50;

    // Check if it's redish
    if (r > g + difference && r > b + difference) {
        statement.textContent = "The color is reddish";
    } 
    // Check if it's bluish
    else if (b > r + difference && b > g + difference) {
        statement.textContent = "The color is bluish";
    } 
    // Check if it's greenish
    else if (g > r + difference && g > b + difference) {
        statement.textContent = "The color is greenish";
    } 
    // If none of the conditions are met, it's a combination of colors
    else {
        statement.textContent = "The color is a combination of red, green, and blue";
    }

    // Change the color of the main color box.
    colorBox.style.backgroundColor = color;

    // Update the rgb value in the color box.
    rgbValue.textContent = color;

    // Create similar colors (rgb values) and create an array.
    var similarColorsArray = generateSimilarColors(r, g, b, numColorsToDisplay);

    // Create color squares dynamically using the similar colors
    colorContainer.innerHTML = '';
    similarColorsArray.forEach(function(color) {
        createColorSquare(color);
    });
}

function generateSimilarColors(r, g, b, numColors) {
    // Create an array to store similar colors
    var similarColors = [];

    // Generate random similar colors
    while (similarColors.length < numColors) {
        var randomR = getRandomValue(0, 255);
        var randomG = getRandomValue(0, 255);
        var randomB = getRandomValue(0, 255);

        var distance = calculateColorDistance(r, g, b, randomR, randomG, randomB);

        // Adjust this threshold based on your preference
        if (distance < 110) {
            similarColors.push({ r: randomR, g: randomG, b: randomB });
        }
    }
    return similarColors;
}

// Helper function to calculate Euclidean distance between two colors
function calculateColorDistance(r1, g1, b1, r2, g2, b2) {
    return Math.sqrt(Math.pow(r2 - r1, 2) + Math.pow(g2 - g1, 2) + Math.pow(b2 - b1, 2));
}

// Helper function to get a random value within a range
function getRandomValue(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Event listener for color square container (event delegation)
colorContainer.addEventListener('mouseover', function(event) {
    // Check if the mouseover target is a color square
    if (event.target.classList.contains('color-square')) {
        var colorSquare = event.target;
        var color = getColorFromSquare(colorSquare);

        // Display color information
        colorInfo.textContent = `RGB: ${color.r}, ${color.g}, ${color.b}`;
        colorInfo.style.display = 'block';
    }
});

colorContainer.addEventListener('mouseout', function() {
    // Clear color information when the mouse leaves the color square container
    colorInfo.textContent = '';
    colorInfo.style.display = 'none';
});

// Event listener for color square container (event delegation)
colorContainer.addEventListener('click', function(event) {
    // Check if the click target is a color square
    if (event.target.classList.contains('color-square')) {
        var colorSquare = event.target;
        var color = getColorFromSquare(colorSquare);
        updateColor(color);
        updateSliders();
        updatePreview();
    }
});

colorBox.addEventListener('click', function() {
    copied.style.display = 'block';
    var copyInput = rgbValue.textContent;
    // Create a temporary textarea element
    var textarea = document.createElement('textarea');

    // Set the value of the textarea to the text content of the div
    textarea.value = copyInput;
    document.body.appendChild(textarea);

    textarea.select();
    textarea.setSelectionRange(0, 99999);
    try {
        // Use the asynchronous Clipboard API to copy the selected text
        document.execCommand('copy');
        // alert('RGB Value copied to clipboard: ' + copyInput);
        copied.innerHTML = `The value copied to clipboard: <br><span class="value">${copyInput}</span>`
        copied.style.color = color;
        copied.classList.remove('fade-out'); // Remove fade-out class if it was added before
        // Fade out after 5 seconds
        setTimeout(function() {
            copied.classList.add('fade-out');
        }, 4000);

    } catch (err) {
        console.error('Unable to copy to clipboard', err);
    } finally {
        // Remove the temporary textarea
        document.body.removeChild(textarea);
    }
});


preview.addEventListener('click', function() { 
    const previewColor = {r: rSliderValue.textContent, g: gSliderValue.textContent, b: bSliderValue.textContent};
    updateColor(previewColor);
});

// Creating each color square, taking an rgb object {r: g: b:} as the parameter
function createColorSquare(color) {
    // Create a new div element
    var colorSquare = document.createElement('div');

    // Set the background color based on the color object
    colorSquare.style.backgroundColor = `rgb(${color.r}, ${color.g}, ${color.b})`;

    // Add a class for styling
    colorSquare.classList.add('color-square');
    // Append the color square to the body or another container element
    colorContainer.appendChild(colorSquare);

}

function getColorFromSquare(square) {
    var colorString = square.style.backgroundColor;
    var matches = colorString.match(/\d+/g);

    if (matches && matches.length === 3) {
        return {
            r: parseInt(matches[0]),
            g: parseInt(matches[1]),
            b: parseInt(matches[2])
        };
    } else {
        return null;
    }
}


function setupSlider(sliderBoxId, sliderId, thumbId, valueId, red, green, blue) {
    const sliderBox = document.getElementById(sliderBoxId);
    const slider = document.getElementById(sliderId);
    const thumb = document.getElementById(thumbId);
    const value = document.getElementById(valueId);

    // Initial values
    let currentValue;
     if (valueId == 'r-value' && red) {
        currentValue = red;
    } else if (valueId == 'g-value' && green) {
        currentValue = green;
    } else if (valueId == 'b-value' && blue) {
        currentValue = blue;
    } else {
        currentValue = 100;
    }

    let isDragging = false;

    function updateThumbPosition() {
        const sliderRect = sliderBox.getBoundingClientRect();
        const thumbWidth = thumb.offsetWidth;
        let percentage = (currentValue / 255) * 100 - thumbWidth / sliderRect.width * 100;

        // Ensure the thumb stays within the valid range [0, 100]
        percentage = Math.max(0, Math.min(100, percentage));

        thumb.style.left = `${percentage}%`;
    }

    function updateValue() {
        value.textContent = currentValue;
    }

    function updatePreviewColor() {
        let previewColor;
        if (valueId == 'r-value') {
            r = currentValue;
            previewColor = "rgb(" + r + ", " + g + ", " + b + ")";
        } else if (valueId == 'g-value') {
            g = currentValue;
            previewColor = "rgb(" + r + ", " + g + ", " + b + ")";
        } else {
            b = currentValue;
            previewColor = "rgb(" + r + ", " + g + ", " + b + ")";
        }
        console.log(previewColor);
        preview.style.backgroundColor = previewColor;
    }

    function handleMouseDown(event) {
        isDragging = true;
        handleMouseMove(event);
    }

    function handleMouseUp() {
        isDragging = false;
    }

    function handleMouseMove(event) {
        if (isDragging) {
            const sliderRect = sliderBox.getBoundingClientRect();
            //const thumbWidth = thumb.offsetWidth;
            let percentage = (event.clientX - sliderRect.left) / sliderRect.width;
            currentValue = Math.round(percentage * 255);
            currentValue = Math.min(255, Math.max(0, currentValue)); // Ensure value is within bounds
            updateThumbPosition();
            updateValue();
            updatePreviewColor();
        }
    }

    slider.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mousemove', handleMouseMove);

    updateThumbPosition();
    updateValue();
    
    
}



function updateSliders() {
// Set up sliders
setupSlider('r-slider-box', 'r-slider', 'r-slider-thumb', 'r-value', r, g, b);
setupSlider('g-slider-box', 'g-slider', 'g-slider-thumb', 'g-value', r, g, b);
setupSlider('b-slider-box', 'b-slider', 'b-slider-thumb', 'b-value', r, g, b);
}

updateSliders();

function updatePreview() {
    preview.style.backgroundColor = color;
}