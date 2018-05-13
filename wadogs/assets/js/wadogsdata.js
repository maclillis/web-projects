function mapRange(input, in_min, in_max, out_min, out_max) {
  return (input - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
};

var panoramaImage = document.getElementById('ws-draggable-element');
var draggableElement = document.getElementById('ws-draggable-element');
var continuous = false;
var adWidth = 414;

var gyroToggle = document.getElementById('ws-gyro-toggle');
var gyroEnabled = true;

function setGyro(state) {
  gyroEnabled = state;
  if (gyroEnabled) {
    document.getElementById("swipe-icon").style.display = "block";
    document.getElementById("gyro-icon").style.display = "none";
  } else {
    document.getElementById("swipe-icon").style.display = "none";
    document.getElementById("gyro-icon").style.display = "block";
  }
}

gyroToggle.addEventListener('click', function () {
  if (gyroEnabled) {
    setGyro(false);
  } else {
    setGyro(true);
  }
});

/* Gyro.js */

var headingToPositionX = 70;

function setTransform( style, string ) {
  style.transform = style.WebkitTransform = style.mozTransform = style.msTransform = string;
}

function compassHeading(alpha, beta, gamma) {

  /* Convert degrees to radians */
  var alphaRad = alpha * (Math.PI / 180);
  var betaRad = beta * (Math.PI / 180);
  var gammaRad = gamma * (Math.PI / 180);

  /* Calculate equation components */
  var cA = Math.cos(alphaRad);
  var sA = Math.sin(alphaRad);
  var cB = Math.cos(betaRad);
  var sB = Math.sin(betaRad);
  var cG = Math.cos(gammaRad);
  var sG = Math.sin(gammaRad);

  /* Calculate A, B, C rotation components */
  var rA = -cA * sG - sA * sB * cG;
  var rB = -sA * sG + cA * sB * cG;
  var rC = -cB * cG;

  /* Calculate compass heading */
  var compassHeading = Math.atan(rA / rB);

  /* Convert from half unit circle to whole unit circle */
  if (rB < 0) {
    compassHeading += Math.PI;
  } else if (rA < 0) {
    compassHeading += 2 * Math.PI;
  }

  /* Convert radians to degrees */
  compassHeading *= 180 / Math.PI;

  return compassHeading;

}


window.addEventListener('deviceorientation', function(e) {

  var heading = null;

  if (e.alpha !== null) {
    heading = Math.round(compassHeading(e.alpha, e.beta, e.gamma));
    /* Make the heading reset to 180 instead of 0/360 */
    if (heading < 180) {
      heading += 180;
    } else {
      heading -= 180;
    }
  }

  /* Do something with 'heading'... */
  if (continuous) {
    headingToPositionX = Math.round(mapRange(heading,0,360,0,panoramaImage.clientWidth));
  } else {
    /* crop the range from 0-360 to 135-225 to make it more responsive, so user don't have to rotate 360° to see left/right ends of banner */
    headingToPositionX = Math.round(mapRange(heading,135,225,0,panoramaImage.clientWidth - adWidth));
    if (headingToPositionX > (panoramaImage.clientWidth - adWidth)) {
      trackGyro();
      headingToPositionX = panoramaImage.clientWidth - adWidth;
    } else if (headingToPositionX < 0){
      trackGyro();
      headingToPositionX = 0;
    }
  }

  if (gyroEnabled) {
    setTransform(draggableElement.style, "translate3d(" + -headingToPositionX + "px, 0px, 0px)");
  }

}, false);

/* Draggable / Gyro */

var animationDuration = 7;

var currentX, previousX;
var isFirstSwipe = true;

TweenMax.ticker.addEventListener("tick", function() {
  var currentX = Math.round(draggableElement.getBoundingClientRect().left);
  if (currentX === previousX) {
    return;
  }
  previousX = currentX;

  /* Continuous logic */
  if (continuous) {
    if (currentX === -panoramaImage.clientWidth) {
      TweenMax.set(draggableElement, {
        x: -1
      });
    } else if (currentX === 0) {
      TweenMax.set(draggableElement, {
        x: -(panoramaImage.clientWidth - 1)
      });
    }
  }
});

Draggable.create("#ws-draggable-element", {
  type: "x",
  bounds: document.getElementById("ws-wrapper"),
  throwProps: true,
  zIndexBoost: false,
  dragClickables: true,
  lockAxis: true,
  edgeResistance: 1,
  dragResistance: 0.2,
  onDragStart: function () {
    if (gyroEnabled) {
      setGyro(false);
    }
  }
});

    function randomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
    var rsLineAnimTl = new TimelineMax({repeat: -1}),
        rsLineReleaseSplitText = new SplitText("#ws-rs-text-01-", {type: "chars, words",charsClass: "charRelease++"}),
        rsLineUrlSplitText = new SplitText("#ws-rs-text-02-", {type: "chars, words",charsClass: "charUrl++"}),
        rsLinecharsRelease = rsLineReleaseSplitText.chars,
        rsLinecharsUrl = rsLineUrlSplitText.chars;

    rsLineAnimTl
      .staggerFromTo(rsLinecharsRelease, 0.1, {opacity: 0}, {opacity: 1}, 0.025)
      .fromTo(".charRelease19", 1, {opacity: 0}, {opacity: 1,repeat: 5,ease: Linear.easeNone})
      .set("#ws-rs-text-01-", {opacity: 0})
      .staggerFromTo(rsLinecharsUrl, 0.1, {opacity: 0}, {opacity: 1}, 0.025)
      .fromTo(".charUrl22", 1, {opacity: 0}, {opacity: 1,repeat: 5,ease: Linear.easeNone});

    var hotspotATl = new TimelineMax({paused: true}),
        hotspotASplitText = new SplitText("#ws-hotspot-split-text-01_", {type: "chars, words",charsClass: "hotspotAChars++"}),
        hotspotAChars = hotspotASplitText.chars;

    var hotspotBTl = new TimelineMax({paused: true}),
        hotspotBSplitText = new SplitText("#ws-hotspot-split-text-02_", {type: "chars, words",charsClass: "hotspotBChars++"}),
        hotspotBChars = hotspotBSplitText.chars;

    var hotspotCTl = new TimelineMax({paused: true}),
        hotspotCSplitText = new SplitText("#ws-hotspot-split-text-03_", {type: "chars, words",charsClass: "hotspotCChars++"}),
        hotspotCChars = hotspotCSplitText.chars;

    var hotspotDTl = new TimelineMax({paused: true}),
        hotspotDSplitText = new SplitText("#ws-hotspot-split-text-04_", {type: "chars, words",charsClass: "hotspotDChars++"}),
        hotspotDChars = hotspotDSplitText.chars;

    hotspotATl
      .fromTo("#ws-hotspot-content-01_", 0.3, {scaleX: 0}, {scaleX: 1,display: "block"})
      .fromTo("#ws-hotspsot-content-01_", 0.3, {widthPercent: "30%"}, {widthPercent: "100%"}, "-=0.2")
      .staggerFromTo(hotspotAChars, 0.1, {opacity: 0}, {opacity: 1}, 0.03)
      .fromTo(".hotspotAChars69", 1, {opacity: 0}, {opacity: 1,repeat: -1,ease: Linear.easeNone});

    hotspotBTl.
      fromTo("#ws-hotspot-content-02_", 0.3, {scaleX: 0}, {scaleX: 1,display: "block"})
      .fromTo("#ws-hotspsot-content-02_", 0.3, {widthPercent: "30%"}, {widthPercent: "100%"}, "-=0.2")
      .staggerFromTo(hotspotBChars, 0.1, {opacity: 0}, {opacity: 1}, 0.03)
      .fromTo(".hotspotBChars44", 1, {opacity: 0}, {opacity: 1,repeat: -1,ease: Linear.easeNone});

    hotspotCTl
      .fromTo("#ws-hotspot-content-03_", 0.3, {scaleX: 0}, {scaleX: 1,display: "block"})
      .fromTo("#ws-hotspsot-content-03_", 0.3, {widthPercent: "30%"}, {widthPercent: "100%"}, "-=0.2")
      .staggerFromTo(hotspotCChars, 0.1, {opacity: 0}, {opacity: 1}, 0.03)
      .fromTo(".hotspotCChars58", 1, {opacity: 0}, {opacity: 1,repeat: -1,ease: Linear.easeNone});

    hotspotDTl
      .fromTo("#ws-hotspot-content-04_", 0.3, {scaleX: 0}, {scaleX: 1,display: "block"})
      .fromTo("#ws-hotspsot-content-04_", 0.3, {widthPercent: "30%"}, {widthPercent: "100%"}, "-=0.2")
      .staggerFromTo(hotspotDChars, 0.1, {opacity: 0}, {opacity: 1}, 0.03)
      .fromTo(".hotspotDChars68", 1, {opacity: 0}, {opacity: 1,repeat: -1,ease: Linear.easeNone});

    var hotspotClickAreaA = document.getElementById("ws-hotspot-clickarea-01_");
    var hotspotClickAreaB = document.getElementById("ws-hotspot-clickarea-02_");
    var hotspotClickAreaC = document.getElementById("ws-hotspot-clickarea-03_");
    var hotspotClickAreaD = document.getElementById("ws-hotspot-clickarea-04_");
    var greyBackgroundClose = document.getElementById("ws-grey-background");

    hotspotClickAreaA.addEventListener("click", function() {
        hotspotATl.restart();
        TweenMax.fromTo("#ws-grey-background", 0.3, {opacity: 0}, {opacity: 0.3,display: "block"});
        TweenMax.set("#ws-hotspot-button-active-01_", {display: "block"});
        TweenMax.set("#ws-hotspot-button-01_", {display: "none"});
        TweenMax.set(".ws-touch-symbol", {display: "none"});
        closeHotspotsTimeout();
    });
    hotspotClickAreaB.addEventListener("click", function() {
        hotspotBTl.restart();
        TweenMax.fromTo("#ws-grey-background", 0.3, {opacity: 0}, {opacity: 0.3,display: "block"});
        TweenMax.set("#ws-hotspot-button-active-02_", {display: "block"});
        TweenMax.set("#ws-hotspot-button-02_", {display: "none"});
        TweenMax.set(".ws-touch-symbol", {display: "none"});
        closeHotspotsTimeout();
    });
    hotspotClickAreaC.addEventListener("click", function() {
        hotspotCTl.restart();
        TweenMax.fromTo("#ws-grey-background", 0.3, {opacity: 0}, {opacity: 0.3,display: "block"});
        TweenMax.set("#ws-hotspot-button-active-03_", {display: "block"});
        TweenMax.set("#ws-hotspot-button-03_", {display: "none"});
        TweenMax.set(".ws-touch-symbol", {display: "none"});
        closeHotspotsTimeout();
    });
    hotspotClickAreaD.addEventListener("click", function() {
        hotspotDTl.restart();
        TweenMax.fromTo("#ws-grey-background", 0.3, {opacity: 0}, {opacity: 0.3,display: "block"});
        TweenMax.set("#ws-hotspot-button-active-04_", {display: "block"});
        TweenMax.set("#ws-hotspot-button-04_", {display: "none"});
        TweenMax.set(".ws-touch-symbol", {display: "none"});
        closeHotspotsTimeout();
    });
    greyBackgroundClose.addEventListener("click", function() {
        closeHotspots();
        clearTimeout(activeHotspotsTimeout);
    });
    var activeHotspotsTimeout;

    function closeHotspotsTimeout() {
        activeHotspotsTimeout = setTimeout(function() {
            closeHotspots();
        }, 7000);
    }

    function closeHotspots() {
        TweenMax.set("#ws-hotspot-content-01_", {display: "none"});
        TweenMax.set("#ws-hotspot-content-02_", {display: "none"});
        TweenMax.set("#ws-hotspot-content-03_", {display: "none"});
        TweenMax.set("#ws-hotspot-content-04_", {display: "none"});
        TweenMax.set("#ws-hotspot-button-active-01_", {display: "none"});
        TweenMax.set("#ws-hotspot-button-active-02_", {display: "none"});
        TweenMax.set("#ws-hotspot-button-active-03_", {display: "none"});
        TweenMax.set("#ws-hotspot-button-active-04_", {display: "none"});
        TweenMax.set("#ws-hotspot-button-01_", {display: "block"});
        TweenMax.set("#ws-hotspot-button-02_", {display: "block"});
        TweenMax.set("#ws-hotspot-button-03_", {display: "block"});
        TweenMax.set("#ws-hotspot-button-04_", {display: "block"});
        TweenMax.set(".ws-touch-symbol", {display: "block"});
        TweenMax.set("#ws-grey-background", {display: "none"});
    }
    setInterval(function() {
        gsapGlitch(randomNumber(-70, 70), randomNumber(-150, 150));
    }, 4500);

    function gsapGlitch(random1, random2) {
        var OffsetOverlayTl = new TimelineMax({paused: true});
        OffsetOverlayTl
        .to('#ws-overlay', 0.1, {skewX: random1,ease: Power4.easeInOut})
        .to('#ws-overlay', 0.04, {skewX: 0,ease: Power4.easeInOut})
        .to('#ws-overlay', 0.04, {opacity: 0})
        .to('#ws-overlay', 0.04, {opacity: 1})
        .to('#ws-overlay', 0.04, {x: random2})
        .to('#ws-overlay', 0.04, {x: 0});
        OffsetOverlayTl.play();
    }
    hsRingTl = new TimelineMax({repeat: -1});
    hsRingTl
      .add(TweenMax.fromTo(".ws-touch-symbol", 1.5, {opacity: 1,scale: 0.7}, {opacity: 0,scale: 1.2}));
