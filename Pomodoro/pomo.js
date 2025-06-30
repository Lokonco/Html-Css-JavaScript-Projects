//Variables 
//const targetDate = new Date() //Make this user input 
//targetDate.setHours(targetDate.getHours() + 1);
let intervalId = null;
let targetDate = null;


//Function to get html elements
function getTimeSegmentElements(segmentElement){
    const segmentDisplay = segmentElement.querySelector('.segment-display');
    const segmentDisplayTop = segmentDisplay.querySelector('.segment-display-top');
    const segmentDisplayBottom = segmentDisplay.querySelector('.segment-display-bottom');
    const segmentOverlay = segmentDisplay.querySelector('.segment-overlay');
    const segmentOverlayTop = segmentOverlay.querySelector('.segment-overlay-top');
    const segmentOverlayBottom = segmentOverlay.querySelector('.segment-overlay-bottom');
    return{
        segmentDisplay,
        segmentDisplayTop,
        segmentDisplayBottom,
        segmentOverlay,
        segmentOverlayTop,
        segmentOverlayBottom
    };
}


//Function to update numbers on screen
function updateSegmentValues(displayElement, overlayElement, value){
    displayElement.textContent = value;
    overlayElement.textContent = value;
}


//Animation logic
function updateTimeSegment(segmentElement, timeValue){
    const segmentElements = getTimeSegmentElements(segmentElement);

    if (parseInt(segmentElements.segmentDisplayTop.textContent, 10) === timeValue){
        return;
    }

    //Starting the animation
    segmentElements.segmentOverlay.classList.add('flip');
    
    
    updateSegmentValues(segmentElements.segmentDisplayTop, segmentElements.segmentOverlayBottom,
        timeValue); 

    //Function to clear eventListener and remove flip class and update elements
    function finishAnimation(){
        segmentElements.segmentOverlay.classList.remove('flip');

        updateSegmentValues(segmentElements.segmentDisplayBottom, 
            segmentElements.segmentOverlayTop,
            timeValue);

        this.removeEventListener('animationend', finishAnimation);
    }

    segmentElements.segmentOverlay.addEventListener('animationend', finishAnimation);
}


//Function to display 2 numbers
function updateTimeSection(sectionID, timeValue){
    const firstNum = Math.floor(timeValue / 10) || 0;
    const secondNum = timeValue % 10 || 0;
    const sectionElement = document.getElementById(sectionID);
    const timeSegments = sectionElement.querySelectorAll('.time-segment');
    updateTimeSegment(timeSegments[0], firstNum);
    updateTimeSegment(timeSegments[1], secondNum);
}

//Function for user input
function getUserInput(){
    const hours = parseInt(document.getElementById('input-hours').value) || 0;
    const minutes = parseInt(document.getElementById('input-minutes').value) || 0;
    const seconds = parseInt(document.getElementById('input-seconds').value) || 0;

    const now = new Date();
    now.setHours(now.getHours() + hours);
    now.setMinutes(now.getMinutes() + minutes);
    now.setSeconds(now.getSeconds() + seconds);
    return now;
} 

//Function for start button
function startTimer(){
    if(intervalId) return; //Timer is already running
    targetDate = getUserInput();
    intervalId = setInterval(() =>{
        const isComplete = updateAllSegments();
        if(isComplete){
            clearInterval(intervalId);
            intervalId = null;
        }
    }, 1000);
    updateAllSegments();
    document.getElementById('pauseButton').disabled = false;
}


//Function for pause button
function pauseTimer(){
    if(intervalId){
        clearInterval(intervalId);
        intervalId = null;
    }
}

//Function for reset button
function resetTimer(){
    pauseTimer();
    targetDate = null;
    //Reset display
    updateTimeSection('hours',0);
    updateTimeSection('minutes',0);
    updateTimeSection('seconds',0);
}

//Function for preset buttons
function setPreset(h, m, s){
    document.getElementById('input-hours').value = h;
    document.getElementById('input-minutes').value = m;
    document.getElementById('input-seconds').value = s;
}

//Function to calc time remaining
function getTimeRemaining(targetDateTime){
    const nowTime = Date.now();
    const complete = nowTime >= targetDateTime;

    if(complete){return{complete, seconds: 0, minutes: 0, hours:0};}

    const secondsRemaining = Math.floor((targetDateTime-nowTime) / 1000);
    const hours = Math.floor(secondsRemaining / 60 / 60);
    const minutes = Math.floor(secondsRemaining / 60) - hours * 60;
    const seconds = secondsRemaining % 60;
    return {complete, seconds, minutes, hours};
}


//Function to update all nums
function updateAllSegments(){
    const timeRemainingBits = getTimeRemaining(new Date(targetDate).getTime());
    updateTimeSection('seconds', timeRemainingBits.seconds);
    updateTimeSection('minutes', timeRemainingBits.minutes);
    updateTimeSection('hours', timeRemainingBits.hours);
    return timeRemainingBits.complete;
}

// Default times 
updateTimeSection('hours', 0);
updateTimeSection('minutes', 0);
updateTimeSection('seconds', 0);
