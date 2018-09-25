$(window).ready(function(){
    // onload
    start();
    update();
});

class Screen{
    init(cnv){
        this.canvas = cnv;
        this.ctx = this.canvas.getContext("2d");
        
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    get FPS(){
        return 60;
    }

    w(){
        return this.canvas.width;
    }

    h(){
        return this.canvas.height;
    }
}

class Player{
    init(){
        this.w = 50;
        this.h = 50;

        this.x = s.w() / 2 - this.w / 2;
        this.y = s.h() / 2 - this.h / 2;
    }

    update(){
        s.ctx.fillRect(this.x, this.y, this.w, this.h);

        if(keys[87]){ // W
            this.y -= this.speed;
        }
        if(keys[83]){ // S
            this.y += this.speed;
        }
        if(keys[65]){ // A
            this.x -= this.speed;
        }
        if(keys[68]){ // D
            this.x += this.speed;
        }
    }

    get speed(){
        return 10;
    }
}

class Dot{
    constructor(){
        this.w = 25;
        this.h = 25;

        this.x = randomNum(0, s.w() - this.w);
        this.y = randomNum(0, s.h() - this.h);
    }

    update(){
        s.ctx.fillRect(this.x, this.y, this.w, this.h);

        if(intersect(this, player)){
            return true; // die
        }

        return false;
    }
}

var s = new Screen();

var player = new Player();

var keys = [];
var mouse = [];

var dots = [];
var nDotCoold = 60;
var nDotCooldClock = nDotCoold;
var score = 0;

var over = false;

function start(){
    s.init(document.getElementById("game"));

    player.init();

    document.body.addEventListener("keydown", function(e){
        keys[e.keyCode] = true;
    });
    document.body.addEventListener("keyup", function(e){
        keys[e.keyCode] = false;
    });

    document.body.addEventListener("mousedown", function(e){
        if(e.button == 0){
            mouse[0] = true; // left
        }
        else if(e.mouse == 1){
            mouse[1] = true; // mid
        }
        else{
            mouse[2] = true; // right
        }
    });
    document.body.addEventListener("mouseup", function(e){
        if(e.button == 0){
            mouse[0] = false; // left
        }
        else if(e.mouse == 1){
            mouse[1] = false; // mid
        }
        else{
            mouse[2] = false; // right
        }
    });
}

function update(){
    if(over)
        return false; // stop the game

    setTimeout(function(){
        update();  
    }, 1000 / s.FPS);

    // update

    s.ctx.clearRect(0, 0, s.w(), s.h());
    player.update();

    for(var i = 0; i < dots.length; i++){
        if(dots[i].update() === true){
            dots.splice(i, 1);
            score++;
            i--;
        }
    }

    if(nDotCooldClock <= 0){
        dots.push(new Dot());

        if(nDotCoold > 20)
            nDotCooldClock -= 0.5;

        nDotCooldClock = nDotCoold;
    }
    else
        nDotCooldClock--;

    if(dots.length > 10){
        over = true;
        $("body").append("<div style='text-align: center; width: 100%; color: red; font-size: 2.0vw; font-family: consolas; position: absolute; top: 2%; left: 0;'>Game Over</div>");
    }

    $("#score").html("score: " + score);
}

window.onresize = function(){
    // wszystko
    obj.x *= s.w() / oldW;
    obj.y *= s.h() / oldH;
    // ...

    oldW = s.w();
    oldH = s.h();
}

function randomNum(min, max){
    return Math.random() * (max - min) + min;
}

function intersect(e1, e2) {
    if (e1.x + e1.w > e2.x && e1.x < e2.x + e2.w && e1.y + e1.h > e2.y && e1.y < e2.y + e2.h) {
        return true;
    }
    return false;
}