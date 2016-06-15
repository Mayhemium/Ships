function Net() {
    var client = io();
    client.on("start", function () {
        console.log("start")
    })
    client.on("login", function (data) {
        if (data.login) {
            console.log("logged as: " + data.name)
            document.getElementById("login").className = "hide";
            document.getElementById("panel").className = "hide";
            DEMO.raycastinit();
            DEMO.myturn = data.yourturn;
            console.log(DEMO.myturn)
        }else
            console.log("login fail: " + data.reason)
    })
    var last = null;
    client.on("emove", function (data) {
        if (DEMO.ms_Scene.getObjectByName("x:" + data.y + "z:" + Math.abs(parseInt(data.x) - 9)).shot) {
            //DEMO.ms_Scene.getObjectByName("x:" + data.y + "z:" + Math.abs(parseInt(data.x) - 9)).material.color = { r: 1, g: 0, b: 0 }
            last = null
        }
        if (last != null)
            last.material.color = last.color;
        last = DEMO.ms_Scene.getObjectByName("x:" + data.y + "z:" + Math.abs(parseInt(data.x)-9));
        last.color = DEMO.ms_Scene.getObjectByName("x:" + data.y + "z:" + Math.abs(parseInt(data.x) - 9)).material.color;
        if (!DEMO.ms_Scene.getObjectByName("x:" + data.y + "z:" + Math.abs(parseInt(data.x) - 9)).shot)
             DEMO.ms_Scene.getObjectByName("x:" + data.y + "z:" + Math.abs(parseInt(data.x) - 9)).material.color = { r: 0, g: 1, b: 0 }
       
    })
    client.on("eattack", function (data) {
        if (DEMO.ms_Scene.getObjectByName("x:" + data.y + "z:" + Math.abs(parseInt(data.x) - 9)).occupied) {
            client.emit("hit", {
                hit: true,
                x: data.x,
                y: data.y
            })
            DEMO.ms_Scene.getObjectByName("x:" + data.y + "z:" + Math.abs(parseInt(data.x) - 9)).material.color = { r: 1, g: 0, b: 0 };
            DEMO.ms_Scene.getObjectByName("x:" + data.y + "z:" + Math.abs(parseInt(data.x) - 9)).shot = true;
        }
        else {
            client.emit("hit", {
                hit: false,
                x: data.x,
                y: data.y
            })
            DEMO.ms_Scene.getObjectByName("x:" + data.y + "z:" + Math.abs(parseInt(data.x) - 9)).material.color = { r: 0, g: 0, b: 1 };
            DEMO.ms_Scene.getObjectByName("x:" + data.y + "z:" + Math.abs(parseInt(data.x) - 9)).shot = true;
        }
        DEMO.myturn = true;
    })
    client.on("ehit", function (data) {
        DEMO.ms_Clickable_second.splice(DEMO.ms_Clickable_second.indexOf(DEMO.ms_Scene.getObjectByName("attack_x:" + data.y + "y:" + data.x)), 1)
        DEMO.ms_LastObject = [];
        if (data.hit) {
            //console.log("hit: " + data.y + " " + data.x)
            DEMO.ms_Scene.getObjectByName("attack_x:" + data.y + "y:" + data.x).material.color = { r: 1, g: 0, b: 0 }
            DEMO.myturn = false;
        }
        else {
            //console.log("miss: " + data.y + " " + data.x)
            DEMO.ms_Scene.getObjectByName("attack_x:" + data.y + "y:" + data.x).material.color = { r: 0, g: 0, b: 0 }
            DEMO.myturn = false;
        }
        
    })
    this.login = function () {
        client.emit("login", {
            name: document.getElementById("name").value
        })
    }
    this.emit = function (event,objects) {
        client.emit(event, objects);
    }
}