/* Ad size, used for scaling and positioning */
var adWidth = 414;
var adHeight = 414;

/* Game settings */
var gameTime = 15; /* Time in seconds */

var johnWickElement = document.getElementById('ac-bayak_');
var johnWickCollidePosition = 0.74; /* In percent from left */

/* Falling objects settings */
var timeFall = 1; /* Time in seconds on fall animation */
var timeCollision = 0.5; /* Time in seconds on collision animation */
var timeCollisionBomb = 1; /* Time in seconds on enemy collision animation */
var minX = 20; /* Lowest x coordinate - left position from object center in percent. Avoid too low number since swipe at edge can trigger browser previous page */
var maxX = 80; /* Highest x coordinate - right position from object center in percent. Avoid too high number since swipe at edge can trigger browser next page */
var scoreCount = 0;
var fallObjectIndex = 0;
var fallingTimeline;

/* Array of objects containg element IDs (include "#"), points and setting if bomb or not, add your own settings if needed. */
/* Use e.g like this fallObjects[0].bomb to see if the first object is a bomb or not. */
var fallObjects = [{
  id: "#fall-object-01_",
  points: 1,
  bomb: false
}];

/* Finger trail settings */
var trailSize = 4; /* percent of banner width excluding glow */
var trailMinScale = 0.4; /* scale when trail disappears */
var maxTrails = 30; /* limit number of active trails */
var trailLifetime = 0.6; /* trail life in seconds */
var trailColor = "white"; /* Not used when using image as trail element */
var trailContainer = document.getElementById("trail-container_");

/* Do not edit */
var trailWidth = Math.round(adWidth * (trailSize / 100)); /* Sets it to pixel size */
var trailLength = Math.round(adWidth * (trailSize / 100)); /* Sets it to pixel size, will be stretched according to touch length */
var canCollide = true;
var activeTrails = 0;
var trailTotalCounter = 0;
/* Setting adContainer to wrapper since wsAdContainer is not available locally */
var adContainer = document.getElementById("wsAdContainer") || document.getElementById("wrapper_");
var xPrevious = 0;
var yPrevious = 0;
var isFirstTrail = true;
var scoreCounter = 0;
var gameCountdown = gameTime;
var scoreContainer = document.getElementById("score_");

/* Get a random number between, and including, min and max". Used for random positioning, rotation etc */
function randomNr(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

/* Get offset from top most parent, usually it stops at first element with position absolute. */
function getTotalOffset(element) {
  offsetTop = element.offsetTop;
  offsetLeft = element.offsetLeft;
  if (element.offsetParent) {
    do {
      element = element.offsetParent;
      offsetTop += element.offsetTop;
      offsetLeft += element.offsetLeft;
    } while (element.offsetParent);
    return {
      totalOffsetTop: offsetTop,
      totalOffsetLeft: offsetLeft
    };
  }
}

/* Greensock timeline with random falling objects */
function fallingObjects() {
  /* Reset the timeline */
  fallingTimeline = new TimelineMax();
  /* Get a random object id */
  fallObjectIndex = randomNr(0, fallObjects.length - 1);
  /* Random x position in percent */
  var yPosition = Math.round(randomNr(minX, maxX) * (adWidth / 100));
  /* Size of fall object */
  var fallObject = document.getElementById(fallObjects[fallObjectIndex].id.replace("#", ""));
  var fallObjectSize = {
    width: fallObject.offsetWidth,
    height: fallObject.offsetHeight
  };
  /* Calculate element center by removing half of the element width */
  yPosition = yPosition - fallObjectSize.height / 2;

  /* Object animation */
  fallingTimeline
    .set(fallObjects[fallObjectIndex].id, {
      clearProps: "all"
    })
    .fromTo(fallObjects[fallObjectIndex].id, timeFall, {
      top: yPosition,
      left: -fallObjectSize.width,
      rotation: 0
    }, {
      left: (adWidth * johnWickCollidePosition) - fallObjectSize.width,
      ease: Linear.easeNone,
      onComplete: moveJohn
    });
  /* set canCollide to true to enable colliosions */
  canCollide = true;
}

function moveJohn() {
  johnWickCollidePosition += 0.1;
  var johnPosition = Number(johnWickElement.style.left.replace("px", "")) + 0.1 * adWidth;

  /* Update score */
  scoreCounter--;
  scoreContainer.innerHTML = scoreCounter;

  johnWickElement.style.left = johnPosition + "px";

  document.getElementById('splat_').style.display = "inline-block";
  fade("out", "splat_");

  if (johnPosition / adWidth >= 0.4) {
    clearInterval(timerInterval);
    return gameEnd();
  }

  fallingObjects();
}
/* Do something on collision */
function collision() {
  var tweenTime = timeCollision;
  /* Check if bomb */
  if (fallObjects[fallObjectIndex].bomb) {
    tweenTime = timeCollisionBomb;
    /* Bomb collision animation */
    TweenMax.to(fallObjects[fallObjectIndex].id, tweenTime, {
      opacity: 0,
      scale: 2,
      ease: RoughEase.ease.config({
        template: Power0.easeNone,
        strength: 1,
        points: 50,
        taper: "none",
        randomize: false,
        clamp: false
      })
    });
  } else {
    /* Collision animation */
    TweenMax.to(fallObjects[fallObjectIndex].id, tweenTime, {
      rotation: randomNr(-360, 360),
      opacity: 0,
      scale: 2
    });
  }
  /* Update score */
  scoreCounter += fallObjects[fallObjectIndex].points;
  scoreContainer.innerHTML = scoreCounter;
  /* Pause the falling animation and then start it again after collision animation duration */
  fallingTimeline.stop();
  /* Start new falling object as long as countdown is not ended */
  timeFall = timeFall <= 0.1 ? 0.1 : timeFall-0.05;

  if (gameCountdown !== 0) {
    setTimeout(function() {
      fallingObjects();
    }, tweenTime * 1000);
  }
}

/* Trail to viualize where you swipe */
function fingerTrail(e) {
  /* Only allow a certain amount of trails set in maxTrails */
  if (activeTrails < maxTrails) {
    /* Number of currently active trails */
    activeTrails++;
    /* trailTotalCounter used to set unique IDs on trails, needed to remove them when killed */
    trailTotalCounter++;
    /* Offset we need in order to subtract it from pageX and pageY */
    var adContainerOffset = getTotalOffset(adContainer);
    var adOffsetLeft = adContainerOffset.totalOffsetLeft;
    var adOffsetTop = adContainerOffset.totalOffsetTop;
    /* Touch position */
    var x = Math.round(e.pageX - adOffsetLeft);
    var y = Math.round(e.pageY - adOffsetTop);
    /* Angle since last position */
    var dx = xPrevious - x;
    var dy = yPrevious - y;
    var angle = (Math.atan2(dy, dx) * 180 / Math.PI) - 90;
    /* Save position to calculate angle for next trail */
    xPrevious = x;
    yPrevious = y;
    /* Adjust trail length, except for first trail element, i.e if isFirstTrail */
    var trailLengthAdjusted = trailLength;
    if (!isFirstTrail) {
      if (Math.abs(dx) > Math.abs(dy)) {
        trailLengthAdjusted = trailLength + Math.abs(dx * 2);
      } else {
        trailLengthAdjusted = trailLength + Math.abs(dy * 2);
      }
    }
    isFirstTrail = false;
    /* Center trail at touch event */
    var xCentered = x - trailWidth / 2;
    var yCentered = y - trailLengthAdjusted / 2;

    /* Setup trail element */
    /* Create div element, remove when using image instead */
    var trailElement = document.createElement("div");
    trailElement.style.cssText = "width:" + trailWidth + "px;height:" + trailLengthAdjusted + "px;left:" + xCentered + "px;top:" + yCentered + "px;transform: rotate(" + angle + "deg);background:" + trailColor +
      ";/*-webkit-box-shadow: 0px 0px " + Math.round(adWidth * 0.04) + "px " + Math.round(adWidth * 0.04) + "px " + trailColor + ";-moz-box-shadow: 0px 0px " + Math.round(adWidth * 0.04) + "px " + Math.round(adWidth * 0.04) + "px " +
      trailColor + ";box-shadow: 0px 0px " + Math.round(adWidth * 0.04) + "px " + Math.round(adWidth * 0.04) + "px " + trailColor + ";*/-webkit-border-radius: 50%;-moz-border-radius: 50%;border-radius: 50%;";

    /* Create trail */
    /* Set a unique ID */
    trailElement.setAttribute("id", "trail-element-nr" + trailTotalCounter);
    /* Append it to the trailContainer */
    trailContainer.appendChild(trailElement);
    /* Include trail ID so other functions can Tween it and later kill it */
    startTrail(document.getElementById("trail-element-nr" + trailTotalCounter));
  }
}

/* Trail animation */
function startTrail(trail) {
  /* Trail animation */
  TweenMax.fromTo("#" + trail.id, trailLifetime, {
    opacity: 1,
    scale: 1
  }, {
    opacity: 0,
    scale: trailMinScale,
    ease: Power3.easeIn
  });
  /* Kill the trail after time set in ms, i.e after total animation length */
  killTrail(trail, trailLifetime * 1000);
}
/* Remove trail */
function killTrail(trail, life) {
  setTimeout(function() {
    trail.parentNode.removeChild(trail);
    activeTrails--;
  }, life);
}

/* Draggable */
var draggables = Draggable.create("#drag-element_", {
  type: "x,y",
  trigger: "#banner_",
  onDragStart: function() {
    isFirstTrail = true;
  },
  onDrag: function(e) {
    fingerTrail(e);
    /* Check if any of the fallObjects collide with trail */
    if (Draggable.hitTest(fallObjects[fallObjectIndex].id, "#" + document.getElementById("trail-element-nr" + trailTotalCounter).id) && canCollide) {
      canCollide = false;
      collision();
    }
  }
});

/* Disable/Enable draggables. "draggables" is an array so multiple draggables will get index 0, 1, 2 and so on.
Value can be true or false */
function draggableToggle(index, value) {
  draggables[index].enabled(value);
}
/* Disable draggable from start */
draggableToggle(0, false);

/* Game end when timer is 0 */
function gameEnd() {
  /* Track game end and points, replace "-" with "ADEVENTS_MINUS_REPLACEMENT" since "-" will split the track event */
  //var scoreTrack = scoreCounter.toString().replace("-", "ADEVENTS_MINUS_REPLACEMENT");
  /* Disable draggable */
  draggableToggle(0, false);
  /* Hide score container */
  fade("out", scoreContainer.id);
  /* Stop and reset falling objects */
  fallingTimeline.stop();
  for (var i = 0; i < fallObjects.length; i++) {
    TweenMax.set(fallObjects[i].id, {
      clearProps: "all"
    });
  }
  acEndMenuAnimTl.play();
  /* Print final score */
  document.getElementById("end-points-wrapper").innerHTML = "<div class=end-points_ style='pointer-events:none;'>" + scoreCounter + "</div>";
  /* Show end banner */
  fade("in", "end-screen_");
}

/* On Startbanner click, hide startDiv and track event  */
function startGame(mode) {
  /* Enable draggable */
  draggableToggle(0, true);
  /* Reset stuff if game is played again */
  if (mode === "restart") {
    acGameLandscapeAnimTl.restart();
    acGameStormAnimTl.restart();
    /* Reset John position */
    johnWickElement.style.left = 0;
    johnWickCollidePosition = 0.74;
    timeFall = 1;
    /* Reset game timer and countdown bar */
    gameCountdown = gameTime;
    TweenMax.to("#timer_", 1, {
      width: "100%",
      ease: Linear.easeNone
    });
  } else {
  }
  /* Reset score */
  scoreCounter = 0;
  fade("in", scoreContainer.id);
  scoreContainer.innerHTML = scoreCounter;
  /* Start falling objects after 1.5 seconds */
  setTimeout(function() {
    fallingObjects();
  }, 1500);
  /* Start timer */
  gameTimer();
}

/* Fade in or out game screens */
function fade(direction, id) {
  if (direction === "in") {
    document.getElementById(id).style.display = "block";
    TweenMax.fromTo("#" + id, 0.5, {
      opacity: 0,
      scale: 1.5
    }, {
      opacity: 1,
      scale: 1
    });
  } else if (direction === "out") {
    TweenMax.fromTo("#" + id, 0.5, {
      opacity: 1,
      scale: 1
    }, {
      opacity: 0,
      scale: 1.5
    });
    setTimeout(function() {
      document.getElementById(id).style.display = "none";
    }, 500);
  }
}

/* Timer to limit game time */
var timerInterval;

function gameTimer() {
  timerInterval = setInterval(function() {
    if (gameCountdown === 0) {
      /* Time is out */
      clearInterval(timerInterval);
      gameEnd();
      /* Reset timer bar color */
      setTimeout(function() {
        TweenMax.set("#timer_", {
          clearProps: "backgroundColor"
        });
      }, 1000);
    }
    /* Count down 1 second every second */
    gameCountdown--;
    /* Setup timer bar */
    var timerPercent = (gameCountdown / gameTime) * 100;
    var timerHue = (gameCountdown / gameTime) * 100; /* Where 100 is start hue */
    TweenMax.to("#timer_", 1, {
      backgroundColor: "hsla(0, 0%, 100%, 1)",
      width: timerPercent + "%",
      ease: Linear.easeNone
    });
  }, 1000);
}

/* Custom function for play again since we need to hide and reset some stuff */
function playAgain() {
  startGame("restart");
}

/* On end banner click, track event and go to destination url */
function endBannerClick() {
}

/* GREENSOCK ANIMATIONS */

/* Start Animations */
var acStartBackgAnimTl = new TimelineMax({
  repeat: -1,
  paused: true
});
var acStartMenuAnimTl = new TimelineMax();
var acStartGameBtnAnimTl = new TimelineMax({
  paused: true
});
var acReadMoreBtnAnimTl = new TimelineMax({
  paused: true
});

var acEndMenuAnimTl = new TimelineMax({
  paused: true
});
var acEndPlayAgainBtnAnimTl = new TimelineMax({
  paused: true
});
var acEndReadMoreBtnAnimTl = new TimelineMax({
  paused: true
});

var acGameLandscapeAnimTl = new TimelineMax({
  paused: true
});
var acGameStormAnimTl = new TimelineMax({
  paused: true
});

function startBackG() {
  acStartBackgAnimTl.play();
}

function reverseStartGameMenu() {
  acStartMenuAnimTl.reverse();
}

function reverseEndGameMenu() {
  acEndMenuAnimTl.reverse();
}

function playAgainAnim() {
  TweenMax.set("#end-again-btn-active", {
    display: "none"
  });
  acGameLandscapeAnimTl.progress(1, false);
  acGameStormAnimTl.progress(1, false);
  playAgain();
}

function stopAllStartAnim() {
  acStartBackgAnimTl.stop();

  document.getElementById("game-intstructions").style.display = "block";

  setTimeout(function() {

    document.getElementById("game-intstructions").style.display = "none";
    startGame();
  }, 3000);

  acGameLandscapeAnimTl.restart();
  acGameStormAnimTl.restart();
}

acStartBackgAnimTl.fromTo("#start-backg-01", 10, {
    scale: 1
  }, {
    scale: 1.20,
    ease: Linear.easeNone
  })
  .to("#start-backg-01", 1, {
    opacity: 0
  }, "-=3.00")
  .fromTo("#start-backg-02", 10, {
    xPercent: 0
  }, {
    xPercent: 5,
    ease: Linear.easeNone
  }, "-=4.00")
  .to("#start-backg-02", 1, {
    opacity: 0
  }, "-=3.00")
  .fromTo("#start-backg-03", 10, {
    scale: 1
  }, {
    scale: 1.13,
    ease: Linear.easeNone
  }, "-=4.00")
  .to("#start-backg-03", 1, {
    opacity: 0
  }, "-=3.00")
  .fromTo("#start-backg-04", 10, {
    xPercent: 0
  }, {
    xPercent: -5,
    ease: Linear.easeNone
  }, "-=4.00")
  .to("#start-backg-04", 1, {
    opacity: 0
  }, "-=3.00")
  .to("#start-backg-static", 1, {
    opacity: 1
  }, "-=5.00");

acStartMenuAnimTl.fromTo(["#start-btn", "#start-btn-active"], 0.5, {
    yPercent: 450
  }, {
    yPercent: 0
  })
  .fromTo(["#start-readmore-btn", "#start-readmore-btn-active"], 0.5, {
    yPercent: 450
  }, {
    yPercent: 0,
    onComplete: startBackG
  }, "-=0.4")
  .fromTo("#start-menu-bar-left", 0.7, {
    xPercent: -100
  }, {
    xPercent: 0
  })
  .fromTo("#start-menu-bar-right", 0.7, {
    xPercent: 100
  }, {
    xPercent: 0
  }, "-=0.7");

acStartGameBtnAnimTl.fromTo("#start-btn-active", 0.7, {
  opacity: 0
}, {
  opacity: 1,
  display: "block",
  onComplete: reverseStartGameMenu
});
acReadMoreBtnAnimTl.fromTo("#start-readmore-btn-active", 0.7, {
  opacity: 0
}, {
  opacity: 1,
  display: "block",
  onComplete: reverseStartGameMenu
});

acEndMenuAnimTl.fromTo(["#end-again-btn", "#end-again-btn-active"], 0.5, {
    yPercent: 450
  }, {
    yPercent: 0
  })
  .fromTo(["#end-readmore-btn", "#end-readmore-btn-active"], 0.5, {
    yPercent: 450
  }, {
    yPercent: 0
  }, "-=0.4")
  .fromTo("#end-menu-bar-left", 0.7, {
    xPercent: -100
  }, {
    xPercent: 0
  })
  .fromTo("#end-menu-bar-right", 0.7, {
    xPercent: 100
  }, {
    xPercent: 0
  }, "-=0.7");


acEndPlayAgainBtnAnimTl.fromTo("#end-again-btn-active", 0.7, {
  opacity: 0
}, {
  opacity: 1,
  display: "block",
  onComplete: reverseEndGameMenu
});
acEndReadMoreBtnAnimTl.fromTo("#end-readmore-btn-active", 0.7, {
  opacity: 0
}, {
  opacity: 1,
  display: "block",
  onComplete: reverseEndGameMenu
});

acGameLandscapeAnimTl.fromTo("#game-landscape", 15, {
  xPercent: 0
}, {
  xPercent: 8,
  ease: Linear.easeNone
});

acGameStormAnimTl.to("#game-storm", 10, {
  xPercent: -50,
  ease: Linear.easeNone
});

/* Element onclicks, setup all onclicks here */
document.getElementById("start-btn").addEventListener("click", function() {
  acStartGameBtnAnimTl.play();
  TweenMax.fromTo("#start-screen_", 1.2, {
    opacity: 1
  }, {
    opacity: 0,
    delay: 2,
    onComplete: stopAllStartAnim
  });
});
document.getElementById("end-screen_").addEventListener("click", function() {});
document.getElementById("end-again-btn").addEventListener("click", function() {
  acEndPlayAgainBtnAnimTl.restart();
  TweenMax.fromTo("#end-screen_", 0.7, {
    opacity: 1
  }, {
    opacity: 0,
    delay: 2.5,
    onComplete: playAgainAnim
  });
});
