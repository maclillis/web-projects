var adWidth = 375;
var wsJackpot = 0;
var wsCounter = 30;
var zIndex01 = 199;
var zIndex02 = 198;
var qty = 01;
var moneyElem;
var money;
var moneyWrapper;
var initMoneyAnimTl = new TimelineMax({paused: true});
var endMoneyAnimTl = new TimelineMax({paused: true});
var gameClock = {counter: 30},
    clockDisplay = document.getElementById("ws-counter") ;

initMoneyAnimTl
.set("#ws-start-bill-curl", {display: "none"})
.to("#ws-text-overlay", 0.5, {opacity: 0})
.to(".ws-start-big-bill", 0.5, {yPercent: 100}, "-=0.5")
.set("#ws-swiping-moneybanner", {display: "block",delay: 0.2})
.fromTo(["#ws-expanded-bills", "#ws-expanded-single-bill-01", "#ws-expanded-single-bill-02"], 0.5, {yPercent: 200}, {yPercent: 0})
.set("#ws-hand", {display: "block"});

endMoneyAnimTl
.to(["#ws-expanded-numbers-background", "#ws-expanded-background", "#ws-jackpot-numbers", "#throwing-money-wrapper"], 0.5, {opacity: 0,display: "none"})
.to(["#ws-expanded-bills", "#ws-expanded-single-bill-01", "#ws-expanded-single-bill-02"], 0.5, {yPercent: 600}, "-=0.5")
.to(["#ws-endbanner", "#ws-end-text-overlay"], 0.5, {display: "block",opacity: 1}, "-=0.5")
.add(endCounter);

/* Animations & Functions */

/* Game clock */
function CountUpdateHandler() {
  clockDisplay.innerHTML = gameClock.counter;
}

function initMoneyGame() {
  initMoneyAnimTl.play();

  TweenMax.to(gameClock, 29, {counter: 0, roundProps:"counter", onUpdate:CountUpdateHandler, onComplete:endMoneyGame, ease:Linear.easeNone});
}

function endMoneyGame() {
  document.getElementById("ws-counter").style.display = "none";
  document.getElementById("ws-jackpot-numbers").innerHTML = wsJackpot + " €";
  draggableBill01[0].disable();
  draggableBill02[0].disable();
  setTimeout(function() {
    endMoneyAnimTl.play();
  }, 1000);

  TweenMax.set("#ws-hand", {display: "none"});
}
/* Opening Money Curl */
TweenMax.fromTo("#ws-start-bill-curl", 0.6, {opacity: 0}, {opacity: 1,repeat: -1,yoyo: true,repeatDelay: 1});
/* Swipe Symbol Animation */
TweenMax.fromTo("#ws-hand", 1.2, {yPercent: 0,opacity: 0}, {yPercent: -80,opacity: 0.8,repeat: -1,repeatDelay: 1});

/* Event listeners */
document.getElementById("ws-startbanner").addEventListener("click", initMoneyGame);
document.getElementById("ws-swiping-moneybanner").addEventListener('touchmove', function(e) {
  e.preventDefault();
}, false);
document.getElementById("ws-expanded-single-bill-01").addEventListener("touchstart", function() {
  TweenMax.set("#ws-hand", {display: "none"});
});

function randNmbr(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function setZIndexCard01() {
  document.getElementById("ws-expanded-single-bill-01").style.zIndex = zIndex01--;
}

function setZIndexCard02() {
  document.getElementById("ws-expanded-single-bill-02").style.zIndex = zIndex02--;
}

function increaseJackpot() {

  document.getElementById("ws-jackpot-numbers").innerHTML = (wsJackpot += 50) + " €";

  TweenMax.fromTo("#ws-jackpot-numbers", 0.7, {scale: 1.2,color: "#ef1911"}, {scale: 1,color: "#f3d031",yoyo: true,delay: 0.1});
}
/* Draggables */
var draggableBill01 = Draggable.create("#ws-expanded-single-bill-01", {
  type: "y",
  throwProps: true,
  zIndexBoost: false,
  bounds: {
    minY: Math.round(-0.32 * adWidth)
  },
  edgeResistance: 1,
  dragResistance: 0.3,
  lockAxis: true,
  onDragStart: function() {
    TweenMax.set("#ws-hand", {display: "none"});
  },
  onDragEnd: function() {
    if (this.endY < -30) {
      TweenMax.to("#" + this.target.id, 0.3, {yPercent: -100,scale: 0.4,rotation: randNmbr(-20, 20),onComplete: moneyRainGen});
      increaseJackpot();
      setTimeout(function() {
        TweenMax.set("#ws-expanded-single-bill-01", {y: "0%",scale: 1,rotation: 0,onComplete: setZIndexCard01});
      }, 350);
    }
  }
});
var draggableBill02 = Draggable.create("#ws-expanded-single-bill-02", {
  type: "y",
  throwProps: true,
  zIndexBoost: false,
  bounds: {minY: Math.round(-0.32 * adWidth)},
  edgeResistance: 1,
  dragResistance: 0.3,
  lockAxis: true,
  onDragEnd: function() {
    if (this.endY < -30) {
      TweenMax.to("#" + this.target.id, 0.3, {yPercent: -100,scale: 0.4,rotation: randNmbr(-20, 20),onComplete: moneyRainGen});
      increaseJackpot();
      setTimeout(function() {
        TweenMax.set("#ws-expanded-single-bill-02", {y: "0%",scale: 1,rotation: 0,onComplete: setZIndexCard02});
      }, 350);
    }
  }
});

/* Discarded  money */
function moneyRainGen() {

  setTimeout(function() {
    moneyWrapper = document.getElementById("throwing-money-wrapper");
    money = document.createElement("div");
    moneyWrapper.appendChild(money);
    money.setAttribute("class", "money");
    money.setAttribute("id", "money" + qty);
    money.setAttribute("style",
      "position:absolute;width:20%;height:22%;background:url('assets/img/expanded_small_bill.jpg');background-size:100%;background-repeat:no-repeat;top:-30%;left:30%;transform: rotate(0deg);-webkit-transform:rotate(-90deg);"
    );

    setTimeout(function() {
      TweenMax.set(money, {left: randNmbr(0, 100) + "%"});
      TweenMax.to(money, randNmbr(2, 3), {yPercent: 600,rotation: randNmbr(45, -45),scale: 0.4,opacity: 0,ease: Linear.easeNone});
      var billWiggle = TweenMax.fromTo(money, 0.8, {xPercent: randNmbr(-50, 50)}, {xPercent: randNmbr(50, -50),repeat: -1,yoyo: true,ease: Power1.easeInOut});
    }, 200);
    qty++;
  }, 300);

}

/* End Counting Up */
function endCounterAnim() {
  TweenMax.fromTo("#ws-end-counting-up", 0.4, {scale: 1}, {scale: 1.2, yoyo: true,repeat: 1});
  counterDisplay.innerHTML = wsJackpot;
}
var endCounterValue = {score: 0},
  counterDisplay = document.getElementById("ws-end-counting-up");

function endCounter() {
  TweenLite.to(endCounterValue, 0.7, {score: "+=" + wsJackpot,roundProps: "score",onUpdate: updateHandler,ease: Linear.easeNone,onComplete: endCounterAnim});
}

function updateHandler() {
  counterDisplay.innerHTML = endCounterValue.score;
}

/* Handle start on click */
document.getElementById("ws-wrapper").addEventListener("click", initMoneyGame);
