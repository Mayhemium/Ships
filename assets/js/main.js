function mainLoop() {
	requestAnimationFrame(mainLoop);
	DEMO.update();
}

function onDocumentMouseDown(event) {
    event.preventDefault();

    var mouse = new THREE.Vector2(
        ( event.clientX / window.innerWidth ) * 2 - 1,
        - ( event.clientY / window.innerHeight ) * 2 + 1 );

    DEMO.ms_Raycaster.setFromCamera( mouse, DEMO.ms_Camera );
    var intersects1 = DEMO.ms_Chosen ? DEMO.ms_Raycaster.intersectObjects(DEMO.ms_Clickable_second) : DEMO.ms_Raycaster.intersectObjects(DEMO.ms_Clickable_first, true); //wybor elementow do klikania na podstawie DEMO.ms_Chosen

    if (intersects1.length > 0) {
        console.log(intersects1[0].object)
        var object = intersects1[0].object;
        try{
            while (object.name.indexOf("ship") == -1) {
                object = object.parent;
            }
            DEMO.ms_ShipSize = parseInt(object.name.split("ship")[1]);
            DEMO.ms_CurrentRotation = 0;
            DEMO.ms_ShipSelected = object.reference;
        } catch (e) { }
        if(DEMO.ms_Placeable)
            try{
                var position = {
                    x: intersects1[0].object.name.split("x:")[1].split("z:")[0],
                    z: intersects1[0].object.name.split("x:")[1].split("z:")[1]
                }
                DEMO.ms_ShipSelected.setPosition(position.x, position.z);
                DEMO.ms_ShipSelected.rotate(DEMO.ms_CurrentRotation);
                
                for (var i = (DEMO.ms_ShipSize - 1) ; i >= 0 ; i--) {
                    var marked;
                    switch (DEMO.ms_CurrentRotation) {
                        case 0:
                            marked = DEMO.ms_Scene.getObjectByName("x:" + position.x + "z:" + (parseInt(position.z) + i));
                            break;
                        case 1:
                            marked = DEMO.ms_Scene.getObjectByName("x:" + (parseInt(position.x) - i) + "z:" + position.z);
                            break;
                        case 2:
                            marked = DEMO.ms_Scene.getObjectByName("x:" + position.x + "z:" + (parseInt(position.z) - i));
                            break;
                        case 3:
                            marked = DEMO.ms_Scene.getObjectByName("x:" + (parseInt(position.x) + i) + "z:" + position.z);
                            break;
                    }
                    marked.occupied = true;
                }

                DEMO.ms_Ships.splice(DEMO.ms_Clickable_first.indexOf(DEMO.ms_ShipSelected), 1);
                if (DEMO.ms_Ships.length == 0) 
                    DEMO.ms_Chosen = true;
                
                DEMO.ms_ShipSelected = null;
                DEMO.ms_ShipSize = null;

            } catch (e) { console.log(e.message) }
    }
}

function onDocumentMouseMove(event) {
    event.preventDefault();
    if (DEMO.ms_LastObject)
        for (var j = 0; j < DEMO.ms_LastObject.length; j++) {
             DEMO.ms_LastObject[j].material = DEMO.ms_LastMaterial.clone();
        }

    var mouse = new THREE.Vector2(
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1);

    DEMO.ms_Raycaster.setFromCamera(mouse, DEMO.ms_Camera);
    var intersects = DEMO.ms_Chosen ? DEMO.ms_Raycaster.intersectObjects(DEMO.ms_Clickable_second) : DEMO.ms_Raycaster.intersectObjects(DEMO.ms_Clickable_first, true); //wybor elementow do klikania na podstawie DEMO.ms_Chosen

    if (intersects.length > 0) {
        var object = intersects[0].object;

        if (DEMO.ms_Chosen) {
            DEMO.ms_LastMaterial = object.material.clone();
            intersects[0].object.material.color = { r: 0, g: 0, b: 1 };
            DEMO.ms_LastObject = [intersects[0].object];
        } else {


            try {
                var position = {
                    x: intersects[0].object.name.split("x:")[1].split("z:")[0],
                    z: intersects[0].object.name.split("x:")[1].split("z:")[1]
                }
            } catch (e) { }
            try {
                DEMO.ms_LastObject = [];
                DEMO.ms_Placeable = false;
                var marked = null;
                var occupied = false;
                for (var i =  0; i <= (DEMO.ms_ShipSize - 1) ; i++) {
                    switch (DEMO.ms_CurrentRotation) {
                        case 0:
                            marked = DEMO.ms_Scene.getObjectByName("x:" + position.x + "z:" + (parseInt(position.z) + i));
                            break;
                        case 1:
                            marked = DEMO.ms_Scene.getObjectByName("x:" + (parseInt(position.x) - i) + "z:" + position.z);
                            break;
                        case 2:
                            marked = DEMO.ms_Scene.getObjectByName("x:" + position.x + "z:" + (parseInt(position.z) - i));
                            break;
                        case 3:
                            marked = DEMO.ms_Scene.getObjectByName("x:" + (parseInt(position.x) + i) + "z:" + position.z);
                            break;
                    }

                    marked.material.color = { r: 1, g: 0, b: 0 };
                    DEMO.ms_LastObject.push(marked);
                }
                for (var i = (DEMO.ms_ShipSize - 1) ; i >= 0 ; i--) {
                    switch (DEMO.ms_CurrentRotation) {
                        case 0:
                            marked = DEMO.ms_Scene.getObjectByName("x:" + position.x + "z:" + (parseInt(position.z) + i));
                            break;
                        case 1:
                            marked = DEMO.ms_Scene.getObjectByName("x:" + (parseInt(position.x) - i) + "z:" + position.z);
                            break;
                        case 2:
                            marked = DEMO.ms_Scene.getObjectByName("x:" + position.x + "z:" + (parseInt(position.z) - i));
                            break;
                        case 3:
                            marked = DEMO.ms_Scene.getObjectByName("x:" + (parseInt(position.x) + i) + "z:" + position.z);
                            break;
                    }

                    if (marked.occupied) {
                        marked.material.color = { r: 1, g: 0, b: 0 };
                        occupied = true;
                    } else {
                        marked.material.color = { r: 0, g: 0, b: 1 };
                    }
                    DEMO.ms_LastObject.push(marked);
                }
                if(!occupied)
                    DEMO.ms_Placeable = true;
            } catch (e) {
                //console.log(e.message)
            }

        }

        //DEMO.ms_LastMaterial = object.material.clone();
        //intersects[0].object.material.color = { r: 0, g: 0, b: 1 };
        //DEMO.ms_LastObject = intersects[0];
    }
}

function onDocumentKeyDown(event) {
    var key = event.keyCode;
    switch(key){
        case 82:
            if (DEMO.ms_ShipSelected) {
                DEMO.ms_CurrentRotation < 3 ? DEMO.ms_CurrentRotation++ : DEMO.ms_CurrentRotation = 0;
                
                if (DEMO.ms_LastObject)
                    for (var j = 0; j < DEMO.ms_LastObject.length; j++) {
                        DEMO.ms_LastObject[j].material = DEMO.ms_LastMaterial.clone();
                    }
            }
            break;
    }
}

$(function() {
	WINDOW.initialize();

	document.addEventListener('click', onDocumentMouseDown, false);
	document.addEventListener('mousemove', onDocumentMouseMove, false);
	document.addEventListener('keydown', onDocumentKeyDown, false);

	var parameters = {
		alea: RAND_MT,
		generator: PN_GENERATOR,
		width: 2000,
		height: 2000,
		widthSegments: 250,
		heightSegments: 250,
		depth: 1000,
		param: 4,
		filterparam: 1,
		filter: [ CIRCLE_FILTER ],
		postgen: [ MOUNTAINS_COLORS ],
		effect: [ DESTRUCTURE_EFFECT ]
	};

	DEMO.initialize('canvas-3d', parameters);

	WINDOW.resizeCallback = function(inWidth, inHeight) { DEMO.resize(inWidth, inHeight); };
	DEMO.resize(WINDOW.ms_Width, WINDOW.ms_Height);

	mainLoop();
});
