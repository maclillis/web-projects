(function() {
var gameDrag;
var gameStartCheck = true;
var gameWinCheck = true;
var fallingCandy;
var fallingCandySpeed = 1.7;
var overlapThreshold = "-10";

var scoreCount = {score:0},
    scoreDisplay = document.getElementById("game-counter"),
    finalScoreDisplay = document.getElementById("game-final-score");

var gameClock = {counter: 30},
    clockDisplay = document.getElementById("game-clock") ;

/* START SCREEN
************************/

 var initAnimTl = new TimelineMax();
 var backgroundAnimLoopTl = new TimelineMax({repeat:-1});
 var gameStartAnimTl = new TimelineMax();
 var endAnimTl = new TimelineMax();

     initAnimTl
        .fromTo("#game-title-catch", 0.6, {scale:0}, {scale: 1})
        .fromTo("#game-title-candy", 0.6, {scale:0}, {scale: 1}, "-=0.3")
        .fromTo("#game-title-the", 0.6, {scale:0, rotationZ:0, rotationY: 500}, {scale: 1, rotationZ:0, rotationY:0})
        .fromTo("#game-title-basket", 0.3, {yPercent: -600}, {yPercent:0});

function startGame() {
    gameStartAnimTl

    .set("#game-start-titles", {display: "none"})
    .set("#game-basket-wrapper", {display: "block"})
    .set("#game-basket", {display: "block"})
    .fromTo("#game-drapes-left", 0.9, {xPercent:0}, {xPercent:-300, ease:Power0.none})
    .fromTo("#game-drapes-right", 0.9, {xPercent:0}, {xPercent:300, ease:Power0.none}, "-=0.9")
    .fromTo("#game-drapes-over", 1.4, {yPercent:0}, {yPercent:-100, ease:Power0.none}, "-=0.9")
    .set("#game-start-screen", {display: "none"})
    .to("#game-instructions", 0.6, {autoAlpha:1}, "-=1.1")
    .addPause()
    .fromTo("#game-start-countdown-ready", 0.6, {scale:0,opacity:1}, {scale:2}, "+=1.00")
    .to("#game-start-countdown-ready", 0.6, {opacity:0}, "-=0.3")
    .fromTo("#game-start-countdown-set", 0.6, {scale:0, opacity:1}, {scale:2})
    .to("#game-start-countdown-set", 0.6, {opacity:0}, "-=0.3")
    .fromTo("#game-start-countdown-go", 0.6, {scale:0, opacity:1}, {scale:2})
    .to("#game-start-countdown-go", 0.6, {opacity:0, delay:0.5}, "-=0.3")
    .set("#game-instructions", {display: "none"})
    .add(gameEngine);
}

function startGameAgain() {
    TweenMax.set(["#game-hud", "#game-basket"], {display: "block"});
    TweenMax.set(["#game-end-screen", "#oneup-blue","#oneup-green", "#oneup-yellow"], {display: "none"});
    TweenMax.set([oneStarRating, twoStarRating, threeStarRating, fourStarRating, fiveStarRating], {scale:0, autoAlpha:0, rotation: 0});
    TweenMax.set(["#game-end-cta-more", "#game-end-cta-play"], {scale:0});
    TweenMax.set("#game-instructions", {display: "block"});
    TweenMax.set("#game-basket-wrapper", {x:0});

    scoreCount = {score:0};
    scoreDisplay = document.getElementById("game-counter");

    gameClock = {counter: 29};
    clockDisplay = document.getElementById("game-clock");

    finalScoreDisplay.innerHTML = "0";
    scoreDisplay.innerHTML = "0";

    fallingCandySpeed = 1.7;

    TweenMax.set(["#game-minutes, #game-clock"], {color:"#FFFFFF"});

    startGame();
    gameStartAnimTl.play();


}

function backgroundAnimLoop(){
    backgroundAnimLoopTl

    .fromTo("#game-world", 4, {background:"rgb(66, 137, 186)", delay:1}, {background:"rgb(201,153,191)"})
    .to("#game-world", 4, {background:"rgb(107,168,150)"})
    .to("#game-world", 4, {background:"rgb(193, 203, 109)"})
    .to("#game-world", 4, {background:"rgb(156,213,246)"})
    .to("#game-world", 4, {background:"rgb(66, 137, 186)"});
}

function candyFillBasket(){
    if (scoreCount.score === 5){
        TweenMax.set("#game-basket", {src:"assets/basket_f1.png"});
    } else if (scoreCount.score === 10){
        TweenMax.set("#game-basket", {src:"assets/basket_f2.png"});
    } else if (scoreCount.score === 15){
        TweenMax.set("#game-basket", {src:"assets/basket_f3.png"});
    }
}

function scoreUpdateHandler() {
    scoreDisplay.innerHTML = scoreCount.score;

    /*Increase difficulty. Higher score, faster the candy will fall*/
    fallingCandySpeed = fallingCandySpeed - 0.050;

    candyFillBasket();

}

function finalScoreUpdateHandler(){
    finalScoreDisplay.innerHTML = scoreCount.score;
}

function gameCollision(){

          if(Draggable.hitTest("#game-basket", ".yellow-candy", 10, overlapThreshold)){
            TweenMax.set(".yellow-candy", {display: "none"});
            TweenMax.set(".yellow-candy", {display: "block", delay:1});

            /* Counter */
            TweenMax.set(scoreCount, {score: "+=1", roundProps:"score", onUpdate:scoreUpdateHandler});

            /* +1 animation */
            TweenMax.fromTo("#oneup-yellow", 1.2, {display: "block", scale:0, y:0, opacity:1}, {scale:1, opacity:0, y:-60});
          }
          if(Draggable.hitTest("#game-basket", ".lollipop-candy", 10, overlapThreshold)){
            TweenMax.set(".lollipop-candy", {display: "none"});
            TweenMax.set(".lollipop-candy", {display: "block", delay:1});

            /* Counter */
            TweenMax.set(scoreCount, {score: "+=1", roundProps:"score", onUpdate:scoreUpdateHandler});

            /* +1 animation */
            TweenMax.fromTo("#oneup-lollipop", 1.2, {display: "block", scale:0, y:0, opacity:1}, {scale:1, opacity:0, y:-60});
          }
          if(Draggable.hitTest("#game-basket", ".choco-candy", 10, overlapThreshold)){
            TweenMax.set(".choco-candy", {display: "none"});
            TweenMax.set(".choco-candy", {display: "block", delay:1});

            /* Counter */
            TweenMax.set(scoreCount, {score: "+=1", roundProps:"score", onUpdate:scoreUpdateHandler});

            /* +1 animation */
            TweenMax.fromTo("#oneup-choco", 1.2, {display: "block", scale:0, y:0, opacity:1}, {scale:1, opacity:0, y:-60});
          }
      }

    /* THE BASKET
    ***********************/

     var gameDrag = Draggable.create("#game-basket-wrapper", {
        type:"x",
        bounds: document.getElementById("game-world"),
        throwProps:true,
        edgeResistence: 1,
        force3D:true,
        onDrag:function(){
        },
        onDragEnd:function() {
            TweenLite.ticker.removeEventListener("tick", gameCollision);
        },
        onDragStart:function() {
            TweenMax.set("#game-instructions", {display:"none"});
            gameStartAnimTl.play();
            TweenLite.ticker.addEventListener("tick", gameCollision);
        }
    });

    gameDrag[0].addEventListener("press", onPress);

function onPress() {
  gameCollision();
}

/* GAME LOGIC
***********************/

function gameEngine() {

    /* THE HUD */

    function CountUpdateHandler() {
      clockDisplay.innerHTML = gameClock.counter;
    }

    TweenMax.to(gameClock, 29, {counter: 0, roundProps:"counter", onUpdate:CountUpdateHandler, onComplete:gameOver, ease:Linear.easeNone});

    /*Call back to indicate that it is only 10 seconds left.*/
    TweenMax.delayedCall(19, clockChange);

    function clockChange(){
        TweenMax.fromTo(["#game-minutes, #game-clock"], 1, {color:"#FFFFFF"}, {color:"#E83553", repeat:-1});
    }

    /* FALLING CANDY
    ************************/
    var fallingCandySpeedCheck;
    var randomX = 0;
    var minX = 20;
    var maxX = 285;
    var candies = [".choco-candy", ".yellow-candy", ".lollipop-candy"];
    var randomCandyID = 0;

    function randNmbr(min, max){
        return Math.floor(Math.random() * (max - min+1)) + min;
    }

    function randomCandy(){
        randomX = randNmbr(minX, maxX);
        randomCandyID = randNmbr(0, candies.length-1);

        fallingCandy = TweenMax.fromTo(candies[randomCandyID], fallingCandySpeed, {x: randomX, y: -200, rotation: 0}, {y: 700, rotation: randNmbr(-720, 720), onComplete:randomCandy});
    }
    randomCandy();

    backgroundAnimLoop();


}

/* END SCREEN
***********************/

/* Calculate Star Rating and Animate them accordingly depending on the score */

var oneStarRating = [document.getElementById("game-end-star-1_"),
                    document.getElementById("game-end-empty-star-2_"),
                    document.getElementById("game-end-empty-star-3_"),
                    document.getElementById("game-end-empty-star-4_"),
                    document.getElementById("game-end-empty-star-5_")];

var twoStarRating = [document.getElementById("game-end-star-1_"),
                    document.getElementById("game-end-star-2_"),
                    document.getElementById("game-end-empty-star-3_"),
                    document.getElementById("game-end-empty-star-4_"),
                    document.getElementById("game-end-empty-star-5_")];

var threeStarRating = [document.getElementById("game-end-star-1_"),
                      document.getElementById("game-end-star-2_"),
                      document.getElementById("game-end-star-3_"),
                     document.getElementById("game-end-empty-star-4_"),
                     document.getElementById("game-end-empty-star-5_")];

var fourStarRating = [document.getElementById("game-end-star-1_"),
                     document.getElementById("game-end-star-2_"),
                     document.getElementById("game-end-star-3_"),
                     document.getElementById("game-end-star-4_"),
                     document.getElementById("game-end-empty-star-5_")];

var fiveStarRating = [document.getElementById("game-end-star-1_"),
                     document.getElementById("game-end-star-2_"),
                     document.getElementById("game-end-star-3_"),
                     document.getElementById("game-end-star-4_"),
                     document.getElementById("game-end-star-5_")];

function animateStars(){

      if (scoreCount.score >= 0 && scoreCount.score <= 5 ) {
        TweenMax.staggerTo(oneStarRating, 0.5, {autoAlpha:1, rotation:180, scale:1, ease:Bounce.easeOut}, 0.2);
    } else if (scoreCount.score >= 6 && scoreCount.score <= 8 ){
        TweenMax.staggerTo(twoStarRating, 0.5, {autoAlpha:1, rotation:180, scale:1, ease:Bounce.easeOut}, 0.2);
    } else if (scoreCount.score >= 9 && scoreCount.score <= 12){
        TweenMax.staggerTo(threeStarRating, 0.5, {autoAlpha:1, rotation:180, scale:1, ease:Bounce.easeOut}, 0.2);
    } else if (scoreCount.score >= 13 && scoreCount.score <= 15) {
        TweenMax.staggerTo(fourStarRating, 0.5, {autoAlpha:1, rotation:180, scale:1, ease:Bounce.easeOut}, 0.2);
    } else if (scoreCount.score >= 16) {
        TweenMax.staggerTo(fiveStarRating, 0.5, {autoAlpha:1, rotation:180, scale:1, ease:Bounce.easeOut}, 0.2);
    }
}

function gameOver() {
    /*console.log("game finished!");
    On zero time, kill all animations and draggable elements.*/
    TweenMax.pauseAll();

    /* RESETTING GAME CHANGES */
    TweenMax.set(["#game-basket-wrapper", "#game-basket", "#game-hud"], {display:"none"});
    TweenMax.set([fallingCandy, "#oneup-lollipop", "#oneup-choco", "#oneup-yellow"], {y: -200});
    /*Make the bag empty again*/
    TweenMax.set("#game-basket", {src:"assets/basket.png"});

    endAnimTl
        .set(["#game-end-cta-more", "#game-end-cta-play"], {scale:0})
        .set("#game-end-screen", {display:"block"})
        .fromTo("#game-end-drapes-left", 0.6, {xPercent:-300}, {xPercent:0, ease:Power0.none})
        .fromTo("#game-end-drapes-right", 0.6, {xPercent:300}, {xPercent:0, ease:Power0.none}, "-=0.6")
        .fromTo("#game-end-drapes-over", 1.4, {yPercent:-100}, {yPercent:0, ease:Power0.none}, "-=0.6")
        .fromTo("#game-timesup-text", 0.6, {scale:0}, {scale:1, ease:Elastic.easeOut}, "-=0.3")
        .fromTo("#game-timesup-overlay", 0.6, {autoAlpha:0}, {autoAlpha:1})
        .fromTo("#game-final-score", 0.6, {scale:0}, {scale:1, ease:Elastic.easeOut}, "-=0.5")
        .add(animateStars, "+=1.00")
        .staggerTo(["#game-end-cta-play", "#game-end-cta-more"], 0.5, {scale:1, ease:Power0.none}, 0.4, "+=1.5");

    TweenMax.to(scoreCount, 1.2, {startAt:{score:"0"}, score: scoreCount.score, roundProps:"score", onUpdate:finalScoreUpdateHandler, ease:Linear.easeNone, delay: 2.2});

}

function wsCtaPlayAgainButton(){
    startGameAgain();
}

/* Element onclicks, setup all onclicks here */
document.getElementById("game-title-basketWrapper").addEventListener("click", function() {
  startGame();
});
document.getElementById("game-end-cta-play").addEventListener("click", function() {
  wsCtaPlayAgainButton();
});

}());
