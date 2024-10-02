class Player extends PIXI.Sprite {
    constructor (x = 0, y = 500) {
        super(app.loader.resources["images/man.jpg"].texture);
        this.anchor.set(.5, .5);
        this.scale.set(1);
        this.x = x;
        this.y = y;
        this.width = 100;
        this.height = 150;
    }

    //Various functions are used to change the player's sprites based on their actions
    lookUp(){ 
        this.texture = app.loader.resources["images/pointing_up.jpg"].texture;
    }

    lookDown(){
        this.texture = app.loader.resources["images/pointing_down.jpg"].texture;
    }

    standard(){
        this.texture = app.loader.resources["images/man.jpg"].texture;
    }
    
}

//The villain class.  Both the villain and doctor have a function to move to the left
class Evil extends PIXI.Sprite {
    constructor (x = 1200, y = 400) {
        super(app.loader.resources["images/oldman.jpg"].texture);
        this.anchor.set(.5, .5);
        this.scale.set(1);
        this.x = x;
        this.y = y;    

        this.speed = 150;
        this.active = true;
    }

    move(dt=1/60){
        this.x -= this.speed * dt;
    }
}

//The doctor class
class Doctor extends PIXI.Sprite {
    constructor (x = 1200, y = 400) {
        super(app.loader.resources["images/doctor.jpg"].texture);
        this.anchor.set(.5, .5);
        this.scale.set(1);
        this.x = x;
        this.y = y;   
        this.width = 200;
        this.height = 200; 

        this.speed = 150;
        this.active = true;
    }

    move(dt=1/60){
        this.x -= this.speed * dt;
    }
}

//The background classes
class BackGround extends PIXI.Sprite {
    constructor (x = 750, y = 395) {
        super(app.loader.resources["images/background.jpg"].texture);
        this.anchor.set(.5, .5);
        this.scale.set(1);
        this.x = x;
        this.y = y;  
    }
}

class BackGround2 extends PIXI.Sprite {
    constructor (x = 750, y = 395) {
        super(app.loader.resources["images/background2.jpg"].texture);
        this.anchor.set(.5, .5);
        this.scale.set(1);
        this.x = x;
        this.y = y;  
    }
}

class BackGround3 extends PIXI.Sprite {
    constructor (x = 750, y = 395) {
        super(app.loader.resources["images/background3.jpg"].texture);
        this.anchor.set(.5, .5);
        this.scale.set(1);
        this.x = x;
        this.y = y;  
    }
}
