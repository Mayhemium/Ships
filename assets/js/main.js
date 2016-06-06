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
    var intersects = DEMO.ms_Chosen ? DEMO.ms_Raycaster.intersectObjects(DEMO.ms_Clickable_second) : DEMO.ms_Raycaster.intersectObjects(DEMO.ms_Clickable_first, false); //wybor elementow do klikania na podstawie DEMO.ms_Chosen

    if (intersects.length > 0) {
        console.log(intersects[0])
    }
}

function onDocumentMouseMove(event) {
    event.preventDefault();
    if (DEMO.ms_Last)
        DEMO.ms_Last.object.material = new THREE.MeshPhongMaterial({ side: THREE.DoubleSide, map: DEMO.ms_Enemyloader });;

    var mouse = new THREE.Vector2(
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1);

    DEMO.ms_Raycaster.setFromCamera(mouse, DEMO.ms_Camera);
    var intersects = DEMO.ms_Chosen ? DEMO.ms_Raycaster.intersectObjects(DEMO.ms_Clickable_second) : DEMO.ms_Raycaster.intersectObjects(DEMO.ms_Clickable_first,false); //wybor elementow do klikania na podstawie DEMO.ms_Chosen

    if (intersects.length > 0) {
        intersects[0].object.material.color = { r: 0, g: 0, b: 1 };
        DEMO.ms_Last = intersects[0];
    }
}

$(function() {
	WINDOW.initialize();

	document.addEventListener('click', onDocumentMouseDown, false);
	document.addEventListener('mousemove', onDocumentMouseMove, false);

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
