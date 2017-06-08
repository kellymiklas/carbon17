/**
 * Created by Ellery on 6/7/17.
 */


// for the status toggle
var counter = 0;
function toggleStatus() {
    counter++;
    if (counter == 1) {
        showhide("a1");
    } else if (counter == 2) {
        showhide("a2");
    } else if (counter == 3) {
        showhide("a3");
    }
    else if (counter == 4) {
        showhide("a4");
    }
}



function unloadPIN() {
    var block = document.getElementById('PIN_section');
        block.style.display = 'none';
    var block2 = document.getElementById('junk');
        block2.style.display = 'none';
    var block3 = document.getElementById('buttonDiv');
        block3.style.display = 'none';
    var block4 = document.getElementById('overlay');
        block4.style.display = 'none';
}

function unloadCalibration() {
    var block = document.getElementById('calibration-screen');
        block.style.display = 'none';
}

function resetEyes() {
    for(var j = 1; j < 4; j++){
        document.getElementById('statusImg'+j).src = "https://d30y9cdsu7xlg0.cloudfront.net/png/204724-200.png";
    }
}

document.body.onmousedown = function() {
    ++mouseDown;
}

document.body.onmouseup = function() {
    --mouseDown;
}

var domID = "calibrateImg";
function showhide(domID) {
    //console.log(domID);
    var img = document.getElementById(domID);
    if (img.style.visibility === 'hidden') {
        // Currently hidden, make it visible
        img.style.visibility = "visible";
    } else {
        // Currently visible, make it hidden
        img.style.visibility = "hidden";
    }
}

for(var i = 0; i < 10; i++){
    var string = domID + i;
    showhide(string);
}

function removeLayers() {
    for(var i = 0; i < 10; i++){
        var string = domID + i;
        var img = document.getElementById(string);
        if (img.style.visibility === 'visible'){
            img.style.visibility = "hidden";
        }
    }
}

var w = window.innerWidth;
var h = window.innerHeight;
var init = 0;

// number of tries
var tries = 1;
var first = 0;
var second = 0;
var calibrationComplete = 0;
var sectorsVisited = [];
var calibratedSectors = [];
var sectorCounters = [];
var sectorClicks = [];
//how many ints have been added to the guess
var attemptCodeCounter = 0;
var addedCounter = 0;
//how many ints added to the secret code
//hard coded for now, later during initiate calibration
//it will set the secret password
var secretCodeCounter = 4;
//hard coded for now
var secretCode = [7, 8, 2, 2];
var mouseDown = 0;

var initiateCalibration = function() {
    alert("Drag your cursor and click three times " +
        "over each of the 9 grey boxes." +
        " When that box turns green, it has been calibrated.");
}

var removeIndexDivs = function() {
    showhide("junk");
    showhide("indexNavbar");
    showhide("calibrate");
    
}

var compareCodes = function(secretCode, sectorsVisited, sector) {
    for(i = secretCode.length; i--;) {
        if(secretCode[i] !== sectorsVisited[i]){
            tries++;
            if(tries > 3){
                alert("You have exceded your tries. Now exiting.");
				//Alert about being wrong, and explain that you card now has a hold on it.
            }
            else{
                // resetEyes();
                alert("Wrong entry " + secretCode);
                sectorsVisited.length = 0;
                addedCounter = 0;
                counter = 0;
                sectorCounters[sector-1] = 0;
				//Alert about being wrong and forgetting the code.
                return;
            }
        }
    }
    // match has been found
    webgazer.end();
    alert("Congrats! Match has been found for " + secretCode);
    unloadPIN("PIN_section");
    loadSuccess();
	//SUCCESS! Move them into the rest of the system.
}

var addToArray = function(sector) {
        sectorsVisited.push(sector);
        addedCounter++;
        toggleStatus();
        alert(sectorsVisited + " current sector vals");
        // if the added counter is equal to the true counter
        if(addedCounter == secretCodeCounter){
            compareCodes(secretCode, sectorsVisited, sector);
        }

}

var checkIfCalibrationComplete = function(calibratedSectors) {
    for(i = 0; i < 9; i++){
        if(calibratedSectors[i] == 0){
            return false;
        }
    }
	//Clean up this alert - AP
    alert("Calibration complete. Please enter passcode.");
    calibrationComplete = 1;
    unloadCalibration();
    removeLayers();
    loadPIN();
    return true;
}

var trackSector = function(sector) {
    // reset every value except for the one we're currently on
    for (i = 0; i < 9; i++) {
        if (i != sector - 1) {
            sectorCounters[i] = 0;
            if(calibrationComplete==1){
                var button = document.getElementById("button"+(i+1));
                button.classList.remove("toggleable-class");
                //console.log("removing" + button.getAttribute("id"));
            }
        }
    }

    // increment the counter
    if(calibrationComplete==1){
        //console.log(sector);
        document.getElementById("button"+sector).classList.add("toggleable-class");
    }
    sectorCounters[sector - 1]++;
    // if it has reached the threshold, add it officially
    if (calibrationComplete == 0 && mouseDown == 1) {
        sectorClicks[sector - 1]++;
        // console.log("click");
        if(sectorClicks[sector - 1] == 3){
            removeLayers();
            string = domID + sector;
            showhide(string);
            calibratedSectors[sector-1]++;
            if(checkIfCalibrationComplete(calibratedSectors) == true){
                console.log("Calibration Complete");
            }
        }
        // mouseDown--;
    }
    if (calibrationComplete == 1) {
        //console.log("HERE");
		document.body.onkeyup = function(e){
	    if(e.keyCode == 32){
			console.log("Sector selected.");
	    }
        addToArray(sector);
    }
}
}

var classifer = function(x, y){
    // leftmost column
    if(x < (w/5)){
        if(y < 3*h/8){
            trackSector(1);
        } else if(y < (3*h/4) && y > 3*h/8){
            trackSector(4);
        } else if (y > 3*h/4) {
            trackSector(7);
        }
    }

    // middle column
    if (2*w/5 < x && x < 4*w/5) {
        if(y < 3*h/8){
            trackSector(2);
        } else if(y < (3*h/4) && y > 3*h/8){
            trackSector(5);
        } else if (y > 3*h/4) {
            trackSector(8);
        }
    }

    // rightmost column
    if (4*w/5 < x) {
        if(y < 3*h/8){
            trackSector(3);
        } else if(y < (3*h/4) && y > 3*h/8){
            trackSector(6);
        } else if (y > 3*h/4) {
            trackSector(9);
        }
    }
}

var main = function() {
    initiateCalibration();
    webgazer.setRegression('ridge') /* currently must set regression and tracker */
        .setTracker('clmtrackr')
        .setGazeListener(function(data, clock) {
            if(calibrationComplete == 0 && data != null){
                if(first == 0){
                    first = 1;
                    showhide("calibrateImg0");
                }
                classifer(data.x, data.y);
            }
            else if(calibrationComplete == 1 && data != null){
                if(second == 0){
                    second = 1;
                }
                //webgazer.clearGazeListener();
                classifer(data.x, data.y);
            }
        })
        .begin()
        .showPredictionPoints(true); /* shows a square every 100 milliseconds where current prediction is */

    var width = window.innerWidth/5;
    var height = window.innerHeight/4;
    var topDist = '0px';
    var leftDist = '0px';

    var setup = function() {
		//VIDEO SET UP AND FORMATTING
        var video = document.getElementById('webgazerVideoFeed');
        video.style.display = 'block';
        video.style.position = 'absolute';
        video.style.top = topDist;
        video.style.left = leftDist;
        video.width = width;
        video.height = height;
        video.style.margin = '0px';

        webgazer.params.imgWidth = width;
        webgazer.params.imgHeight = height;

		//GREEN FACE OVERLAY
        var overlay = document.createElement('canvas');
        overlay.id = 'overlay';
        overlay.style.position = 'absolute';
        overlay.width = width;
        overlay.height = height;
        overlay.style.top = topDist;
        overlay.style.left = leftDist;
        overlay.style.margin = '0px';

        document.body.appendChild(overlay);

        var cl = webgazer.getTracker().clm;

        // initialize the empty array with zeroes
        function initializeArray() {
            for (i = 0; i < 9; i++) {
                sectorCounters.push(0);
                sectorClicks.push(0);
                calibratedSectors.push(0);
            }
        }

        function drawLoop() {
            requestAnimFrame(drawLoop);
            overlay.getContext('2d').clearRect(0,0,width,height);
            if (cl.getCurrentPosition()) {
                cl.draw(overlay);
            }
        }
        drawLoop();
        initializeArray();
    };

    function checkIfReady() {
        if (webgazer.isReady()) {
            setup();
        } else {
            setTimeout(checkIfReady, 100);
        }
    }
    setTimeout(checkIfReady,100);
};


window.onbeforeunload = function() {
    webgazer.end(); //Uncomment if you want to save the data even if you reload the page.
    window.localStorage.clear(); //Comment out if you want to save data across different sessions
}

var loadSuccess = function() {
    var xhr= new XMLHttpRequest();
    xhr.open('GET', 'mainMenu.html', true);
    xhr.onreadystatechange= function() {
        if (this.readyState!==4) return;
        if (this.status!==200) return;
        document.getElementById('success').innerHTML= this.responseText;
    };
    xhr.send();
}

var loadPIN = function() {
    var xhr= new XMLHttpRequest();
    xhr.open('GET', 'PIN.html', true);
    xhr.onreadystatechange= function() {
        if (this.readyState!==4) return;
        if (this.status!==200) return;
        document.getElementById('PIN_section').innerHTML= this.responseText;
    };
    xhr.send();
}