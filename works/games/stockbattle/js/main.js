"use strict";

const app = new PIXI.Application({
    width: 1500,
    height: 770
});
document.body.appendChild(app.view);

// constants
const sceneWidth = app.view.width;
const sceneHeight = app.view.height;	

app.loader.
    add([
        "images/man.jpg",
        "images/pointing_up.jpg",
        "images/pointing_down.jpg",
        "images/oldman.jpg",
        "images/background.jpg",
        "images/background2.jpg",
        "images/background3.jpg",
        "images/doctor.jpg"
        
    ]);

app.loader.onProgress.add(e => { console.log(`progress=${e.progress}`) });
app.loader.onComplete.add(setup);
app.loader.load();

let stage;

//variables
//All three scenes
let startScene;
let gameScene;
let gameOverScene;

//Various labels
let scoreLabel;
let lifeLabel;
let gameOverScoreLabel;
let levelLabel;
let snarkyLabel;

//The player and their variables
let player;
let life = 5;
let score = 0;
let level = 0;

//Music and sound effects
let bgm;
let bgm2;
let bgm3;
let ouch;
let cheer;
let levelup;

//Arrays for the villains and doctors
let villains = [];
let doctors = [];

//The speed that the villains use
let velocity = 120;

//A sprite for the background
let background;
let background2;
let background3;

//These are checks for when the space button is pressed down
let spacebar_pressed = false;

window.onkeydown = function(event) {
    if (event.keyCode == 32) {
        spacebar_pressed = true;
    };
};
window.onkeyup = function() {
    if (event.keyCode == 32) {
        spacebar_pressed = false;
    };
}

function setup() {
    stage = app.stage;

    background = new BackGround();
    stage.addChild(background)

    background2 = new BackGround2();
    background2.visible = false;
    stage.addChild(background2);

    background3 = new BackGround3();
    background3.visible = false;
    stage.addChild(background3);

    startScene = new PIXI.Container();
    stage.addChild(startScene);


    gameScene = new PIXI.Container();
    gameScene.visible = false;
    stage.addChild(gameScene);

    gameOverScene = new PIXI.Container();
    gameOverScene.visible = false;
    stage.addChild(gameOverScene);

    createLabelsAndButtons();

    player = new Player();
    gameScene.addChild(player);

    bgm = new Howl({
        src: ['sounds/fight.mp3']
    });

    bgm2 = new Howl({
        src: ['sounds/fight2.mp3']
    });

    bgm3 = new Howl({
        src: ['sounds/fight3.mp3']
    });

    ouch = new Howl({
        src: ['sounds/no.mp3']
    });

    cheer = new Howl({
        src: ['sounds/yes.mp3']
    });

    levelup = new Howl({
        src: ['sounds/level.mp3']
    });

    app.ticker.add(gameLoop);
}

function createLabelsAndButtons(){
    let buttonStyle = new PIXI.TextStyle({
        fill: 0x65000b,
        fontSize: 48,
        fontFamily: "Comic Sans MS"
    });

    //1 - set up 'StartScene'
    //1A - make top start label
    let startLabel1 = new PIXI.Text("Stock Battle!");
    startLabel1.style = new PIXI.TextStyle({
        fill: 0xffd1dc,
        fontSize: 96,
        fontFamily: "Comic Sans MS",
        stroke: 0x6f00ff,
        strokeThickness: 6
    });
    startLabel1.x = 450;
    startLabel1.y = 120;
    startScene.addChild(startLabel1);

    //1B - make middle start label
    let startLabel2 = new PIXI.Text("Use the mouse to move and space to jump!");
    startLabel2.style = new PIXI.TextStyle({
        fill: 0xffd1dc,
        fontSize: 32,
        fontFamily: "Comic Sans MS",
        stroke: 0x6f00ff,
        strokeThickness: 6 
    });
    startLabel2.x = 440;
    startLabel2.y = 300;
    startScene.addChild(startLabel2);

    //1C - make start game button
    let startButton = new PIXI.Text("Go!");
    startButton.style = buttonStyle;
    startButton.x = 700;
    startButton.y = sceneHeight - 100;
    startButton.interactive = true;
    startButton.buttonMode = true;
    startButton.on("pointerup", startGame);
    startButton.on('pointerover', e => e.target.alpha = 0.7);
    startButton.on('pointerout', e => e.currentTarget.alpha = 1.0);
    startScene.addChild(startButton);

    //2 - set up 'gameScene'
    let textStyle = new PIXI.TextStyle({
        fill: 0xffd1dc,
        fontSize: 30,
        fontFamily: "Comic Sans MS",
        stroke: 0x6f00ff,
        strokeThickness: 2
    });

    //2A - make score label
    scoreLabel = new PIXI.Text();
    scoreLabel.style = textStyle;
    scoreLabel.x = 9;
    scoreLabel.y = 60;
    gameScene.addChild(scoreLabel);
    increaseScoreBy(0);

    //2B - make life label
    lifeLabel = new PIXI.Text();
    lifeLabel.style = textStyle;
    lifeLabel.x = 10;
    lifeLabel.y = 20;
    gameScene.addChild(lifeLabel);
    decreaseLifeBy(0);

    //2C - make level label
    levelLabel = new PIXI.Text();
    levelLabel.style = textStyle;
    levelLabel.x = 10;
    levelLabel.y = 100;
    gameScene.addChild(levelLabel);

    //2D - make snarky comment label
    snarkyLabel = new PIXI.Text();
    snarkyLabel.style = textStyle;
    snarkyLabel.x = 10;
    snarkyLabel.y = 140;
    gameScene.addChild(snarkyLabel);

    // 3 - set up `gameOverScene`
// 3A - make game over text
let gameOverText = new PIXI.Text("Game Over! The Stocks took over!");
textStyle = new PIXI.TextStyle({
	fill: 0xffd1dc,
	fontSize: 64,
	fontFamily: "Comic Sans MS",
	stroke: 0x6f00ff,
	strokeThickness: 6
});
gameOverText.style = textStyle;
gameOverText.x = 260;
gameOverText.y = sceneHeight/2 - 160;
gameOverScene.addChild(gameOverText);

//3A2 - Game over score
gameOverScoreLabel = new PIXI.Text();
gameOverScoreLabel.style = textStyle;
gameOverScoreLabel.x = 450;
gameOverScoreLabel.y = 400;
gameOverScene.addChild(gameOverScoreLabel);

// 3B - make "play again?" button
let playAgainButton = new PIXI.Text("Play Again?");
playAgainButton.style = buttonStyle;
playAgainButton.x = 650;
playAgainButton.y = sceneHeight - 100;
playAgainButton.interactive = true;
playAgainButton.buttonMode = true;
playAgainButton.on("pointerup",startGame); // startGame is a function reference
playAgainButton.on('pointerover',e=>e.target.alpha = 0.7); // concise arrow function with no brackets
playAgainButton.on('pointerout',e=>e.currentTarget.alpha = 1.0); // ditto
gameOverScene.addChild(playAgainButton);
}

function startGame(){
    startScene.visible = false;
    gameOverScene.visible = false;
    gameScene.visible = true;
    background.visible = true;
    background2.visible = false;
    background2.visible = false;
    score = 0;
    life = 5;
    level = 0;
    increaseScoreBy(0);
    decreaseLifeBy(0);
    player.x = 0;
    player.y = 500;
    velocity = 120;
    newLevel();
    //bgm.play();
    //bgm.loop = true;
}

function gameLoop(){
    // #1 - Calculate "delta time"
    let dt = 1/app.ticker.FPS;
    if (dt > 1/12) dt=1/12;
    let mousePosition = app.renderer.plugins.interaction.mouse.global;

    let amt = 10 * dt;

    let newX = lerp(player.x, mousePosition.x, amt);
    let newY = lerp(player.y, mousePosition.y, amt);
    //keep the man on screen with clamp
    let w2 = player.width/2;
    let h2 = player.height/2;
    player.x = clamp(newX, 0 + w2, sceneWidth-w2);


    //Check for spacebar press and move player up and down
    if (spacebar_pressed)  
    {
        player.y -=10;
        player.lookUp();
        if (player.y <= 0)
        {
            player.y = 0;
        }
    }
    else{
        player.y +=5;
        player.lookDown();
        if (player.y >= sceneHeight - 80)
        {
            player.y = sceneHeight - 80 ;  
            player.standard();
        }
    }

    //The if statement is so no one moves during the title and game over screen
    if (gameScene.visible == true){
        //Villain collision checks and removal of villains
        for (let v of villains){
            v.move(dt);
            if (rectsIntersect(player, v)){
                ouch.play();
                gameScene.removeChild(v);
                v.active = false;
                decreaseLifeBy(1);
            }
            if (v.x <= 0){
                gameScene.removeChild(v);
                v.active = false;
                increaseScoreBy(5);
            }
        }

        //Doctor collision and removal of doctors
        for (let d of doctors){
            d.move(dt);
            if (rectsIntersect(player, d)){
                cheer.play();
                gameScene.removeChild(d);
                d.active = false;
                increaseLifeBy(1);
            }
            if (d.x <=0){
                gameScene.removeChild(d);
                d.active = false;
            }
        }

        villains = villains.filter(v=>v.active);
        doctors = doctors.filter(d=>d.active);

        //If everyone is gone, go to next level
        if (villains.length == 0 && doctors.length == 0){
            newLevel();
        }
    }

    //Check for a dead player
    if (life <= 0){
        end();
        return;
    }
}

//Creates new level and spawns enemies and docs
function newLevel(){
    levelup.play();
    level += 1;
    velocity += 40;
    createEnemies(level * 2 );
    createDoctors();
    levelLabel.text = `Level: ${level}`;

    //The music should stop by this point
    
    if (level == 1){
        bgm.play();
        background.visible = true;
        background2.visible = false;
        background2.visible = false;
        snarkyLabel.text = "If you lose this early, I'll laugh at you.";
    }
    
    if (level == 8){
        bgm.pause();
        bgm2.play();
        background.visible = false;
        background2.visible = true;
        snarkyLabel.text = "You're not half bad! But I'm better!";
    }

    if (level == 13){
        bgm2.pause();
        bgm3.play();
        background2.visible = false;
        background3.visible = true;
        snarkyLabel.text = "Dang, you're pretty good! I'm still better, though.";
    }

    if (level == 20){
        bgm3.play();
        snarkyLabel.text = "I do not think I made it this far. Go you!";
    }
}

function createEnemies(numEnemies){
    for (let i = 0; i < numEnemies; i ++){
        let number = level *0.75;
        //Create enemies
        let b = new Evil();
        b.x = Math.random() * (sceneWidth * number - sceneWidth) + sceneWidth;
        b.y = Math.random() * (sceneHeight -20);
        b.speed = velocity;
        villains.push(b);
        gameScene.addChild(b);
    }
}

function createDoctors(){
    for (let i = 0; i < 2; i ++){
        let number = level * 0.75;
        let d = new Doctor();
        d.x = Math.random() * (sceneWidth * number - sceneWidth) + sceneWidth;
        d.y = Math.random() * (sceneHeight -20);
        d.speed = velocity;
        doctors.push(d);
        gameScene.addChild(d);
    }
}

function decreaseLifeBy(value){
    life -= value;
    life = parseInt(life);
    lifeLabel.text = `Life: ${life}`;
    
}

function increaseLifeBy(value){
    life += value;
    life = parseInt(life);
    lifeLabel.text = `Life: ${life}`;  
}

function increaseScoreBy(value){
    score += value;
    scoreLabel.text = `Score: ${score}`;
}

function rectsIntersect(a, b) {
    return !(
        ((a.y + a.height) < (b.y)) ||
        (a.y > (b.y + b.height)) ||
        ((a.x + a.width) < b.x) ||
        (a.x > (b.x + b.width))
    );
}

function end() {
    villains.forEach(v=>gameScene.removeChild(v));
    villains = [];

    doctors.forEach(d=>gameScene.removeChild(d));
    doctors = [];

    gameOverScene.visible = true;
    gameScene.visible = false;

    bgm.pause();
    bgm.currentTime = 0;

    bgm2.pause();
    bgm2.load();

    bgm3.pause();
    bgm3.load();


    gameOverScoreLabel.text = "Your final score: " + score;

    
}

