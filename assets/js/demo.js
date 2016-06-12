var DEMO = {
	ms_Canvas: null,
	ms_Renderer: null,
	ms_Camera: null,
	ms_Scene: null,
	ms_Controls: null,
	ms_Water: null,
	ms_FilesDND: null,
	ms_Raycaster: null,
	ms_Clickable_first: [],
	ms_Clickable_second: [],
	ms_Chosen: false,
	ms_LastMaterial: new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide, wireframe: true }),
	ms_ShipSelected: null,
	ms_ShipSize: null,
	ms_CurrentRotation: 0,
	ms_Placeable: null,
    ms_Ships:[],

    enable: (function enable() {
        try {
            var aCanvas = document.createElement('canvas');
            return !! window.WebGLRenderingContext && (aCanvas.getContext('webgl') || aCanvas.getContext('experimental-webgl'));
        }
        catch(e) {
            return false;
        }
    })(),

	initialize: function initialize(inIdCanvas, inParameters) {
		this.ms_Canvas = $('#'+inIdCanvas);

		// Initialize Renderer, Camera, Projector and Scene
		this.ms_Renderer = this.enable? new THREE.WebGLRenderer() : new THREE.CanvasRenderer();
		this.ms_Canvas.html(this.ms_Renderer.domElement);
		this.ms_Scene = new THREE.Scene();

		this.ms_Camera = new THREE.PerspectiveCamera(55.0, WINDOW.ms_Width / WINDOW.ms_Height, 0.5, 3000000);
		this.ms_Camera.position.set(-inParameters.height*3, Math.max(inParameters.width*1.5, inParameters.height), 0);
		//this.ms_Camera.lookAt({x:10000, y:10000, z:10000});

		this.ms_Raycaster = new THREE.Raycaster();

		// Initialize Orbit control
		this.ms_Controls = new THREE.OrbitControls(this.ms_Camera, this.ms_Renderer.domElement);
		this.ms_Controls.userPan = false;
		this.ms_Controls.userPanSpeed = 0.0;
		this.ms_Controls.maxDistance = 10000.0;
		this.ms_Controls.maxPolarAngle = Math.PI * 0.495;

		// Add light
		var sunlight = new THREE.DirectionalLight(0xffff55, 1);
		sunlight.position.set(-600, 300, 600);
		this.ms_Scene.add(sunlight);

		// Create terrain
		this.loadTerrain(inParameters);

		//axis helper

		var axisHelper = new THREE.AxisHelper( 50000 );
		this.ms_Scene.add( axisHelper );

		//create playground

		var pfMesh = new THREE.BoxGeometry(300, 300, 25);

			for(var i=0; i<10; i++){
			    for (var j = 0; j < 10; j++) {
			        var pfMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide, wireframe: true });
					var pf = new THREE.Mesh( pfMesh, pfMaterial );
					this.ms_Scene.add(pf);
					this.ms_Clickable_first.push(pf);
					pf.rotation.x=Math.PI / 2;
					pf.position.set(-1750 + ((j - 4) * 300), 0, ((i - 4) * 300))
					pf.name = "x:" + (9 - j) + "z:" + i;
					pf.occupied = false;
				}
			}

			//for(var i=0; i<10; i++){
			//    for (var j = 0; j < 10; j++) {
			//        var pfMaterial2 = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide, wireframe: true });
			//		var pf = new THREE.Mesh( pfMesh, pfMaterial2 );
			//		this.ms_Scene.add(pf);
			//		this.ms_Clickable_first.push(pf);
			//		pf.rotation.x=Math.PI / 2;
			//		pf.position.set(1450+((j-4)*300),0,((i-4)*300))
			//	}
			//}

		var pfEnemyMesh = new THREE.BoxGeometry( 100, 300, 300 );



		//for(var i=0; i<10; i++){
		//    for (var j = 0; j < 10; j++) {
		//		var pfEnemy = new THREE.Mesh( pfEnemyMesh, pfEnemyMaterial );
		//		this.ms_Scene.add(pfEnemy)
		//		this.ms_Clickable_second.push(pfEnemy);
		//		pfEnemy.position.set(50,1350+((i-4)*300),((j-4)*300))
		//	}
	    //}

		var loader = new THREE.ImageUtils.loadTexture('assets/img/wood.jpg');
		this.ms_Wood = new THREE.MeshPhongMaterial({ side: THREE.DoubleSide, map: loader });
		for(var i=0; i<10; i++){
		    for (var j = 0; j < 10; j++) {
		        var pfEnemyMaterial = new THREE.MeshPhongMaterial({ side: THREE.DoubleSide, map: loader });
		        //var pfEnemyMaterial = copyMaterial(pfEnemyMaterial1);
		        var pfEnemy = new THREE.Mesh(pfEnemyMesh, pfEnemyMaterial);
				this.ms_Scene.add(pfEnemy)
				this.ms_Clickable_second.push(pfEnemy);
				pfEnemy.position.set(-50, 1350 + ((i - 4) * 300), ((j - 4) * 300))
				pfEnemy.name = "attack_x:"+i+"y:"+j;
			}
		}


		// Load textures
		var waterNormals = new THREE.ImageUtils.loadTexture('assets/img/waternormals.jpg');
		waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping;

		// Load filesdnd texture
		new Konami(function() {
			if(DEMO.ms_FilesDND == null)
			{
				var aTextureFDND = THREE.ImageUtils.loadTexture("assets/img/filesdnd_ad.png");
				aTextureFDND.minFilter = THREE.LinearFilter;
				DEMO.ms_FilesDND = new THREE.Mesh(new THREE.PlaneGeometry(1000, 1000), new THREE.MeshBasicMaterial({ map : aTextureFDND, transparent: true, side : THREE.DoubleSide }));

				// Mesh callback
				DEMO.ms_FilesDND.callback = function() { window.open("http://www.filesdnd.com"); }
				DEMO.ms_Clickable_second.push(DEMO.ms_FilesDND);

				DEMO.ms_FilesDND.position.y = 1200;
				DEMO.ms_Scene.add(DEMO.ms_FilesDND);
			}
		});

		var lH = new Lighthouse();
        var lHMesh = new lH.getLighthouse();
        lHMesh.position.set(1500,0,-3000);
        this.ms_Scene.add(lHMesh);

		    //ladowanie statkow

        var shipFirst = new ShipOne();
        var shipFirstMesh = shipFirst.getShip();
        shipFirstMesh.reference = shipFirst;
        shipFirstMesh.name = "ship6";
        shipFirstMesh.position.set(-250, -75, 2100);
		//shipFirst.setPosition(1,1);                   ustawienie statku na planszy (x,z)
		//shipFirst.rotate(3);                          obrot statku o 90 stopni z ruchem wskazowek zegara, zmienna - ilosc obrotow
		this.ms_Scene.add(shipFirstMesh);
		this.ms_Clickable_first.push(shipFirstMesh);
		this.ms_ShipSelected = shipFirst;
		this.ms_ShipSize = 6;
		this.ms_Ships.push(shipFirstMesh);


		var shipSec = new ShipTwo();
		var shipSecMesh = shipSec.getShip();
		shipSecMesh.reference = shipSec;
		shipSecMesh.name = "ship4";
		shipSecMesh.position.set(-850, -75, 2100);
	    //shipSec.setPosition(1,1);                   
		//shipSec.rotate(3);
		this.ms_Scene.add(shipSecMesh);
		this.ms_Clickable_first.push(shipSecMesh);
		this.ms_Ships.push(shipSecMesh);
	    
		var shipThird = new ShipThree();
		var shipThirdMesh = shipThird.getShip();
		shipThirdMesh.reference = shipThird;
		shipThirdMesh.name = "ship3";
		shipThirdMesh.position.set(-1450, -25, 2100);
	    //shipThird.setPosition(1,1);                   
		//shipThird.rotate(3);
		this.ms_Scene.add(shipThirdMesh);
		this.ms_Clickable_first.push(shipThirdMesh);
		this.ms_Ships.push(shipThirdMesh);
	    
		var shipFourth = new ShipFour();
		var shipFourthMesh = shipFourth.getShip();
		shipFourthMesh.reference = shipFourth;
		shipFourthMesh.name = "ship2";
		shipFourthMesh.position.set(-2050, -20, 2100);
	    //shipFourth.setPosition(1,1);                   
	    //shipFourth.rotate(3);
		this.ms_Scene.add(shipFourthMesh);
		this.ms_Clickable_first.push(shipFourthMesh);
		this.ms_Ships.push(shipFourthMesh);
        
		// Create the water effect
		this.ms_Water = new THREE.Water(this.ms_Renderer, this.ms_Camera, this.ms_Scene, {
			textureWidth: 512,
			textureHeight: 512,
			waterNormals: waterNormals,
			alpha: 	1.0,
			sunDirection: sunlight.position.normalize(),
			sunColor: 0xffffff,
			waterColor: 0x001e0f,
			distortionScale: 50.0
		});
		var aMeshMirror = new THREE.Mesh(
			new THREE.PlaneBufferGeometry(inParameters.width * 500, inParameters.height * 500, 10, 10),
			this.ms_Water.material
		);
		aMeshMirror.add(this.ms_Water);
		aMeshMirror.rotation.x = - Math.PI * 0.5;
		this.ms_Scene.add(aMeshMirror);

		this.loadSkyBox();
	},



	loadSkyBox: function loadSkyBox() {
		var aCubeMap = THREE.ImageUtils.loadTextureCube([
		  'assets/img/px.jpg',
		  'assets/img/nx.jpg',
		  'assets/img/py.jpg',
		  'assets/img/ny.jpg',
		  'assets/img/pz.jpg',
		  'assets/img/nz.jpg'
		]);
		aCubeMap.format = THREE.RGBFormat;

		var aShader = THREE.ShaderLib['cube'];
		aShader.uniforms['tCube'].value = aCubeMap;

		var aSkyBoxMaterial = new THREE.ShaderMaterial({
		  fragmentShader: aShader.fragmentShader,
		  vertexShader: aShader.vertexShader,
		  uniforms: aShader.uniforms,
		  depthWrite: false,
		  side: THREE.BackSide
		});

		var aSkybox = new THREE.Mesh(
		  new THREE.BoxGeometry(1000000, 1000000, 1000000),
		  aSkyBoxMaterial
		);

		this.ms_Scene.add(aSkybox);
	},

	loadTerrain: function loadTerrain(inParameters) {
		var terrainGeo = TERRAINGEN.Get(inParameters);
		var terrainMaterial = new THREE.MeshPhongMaterial({ vertexColors: THREE.VertexColors, shading: THREE.FlatShading, side: THREE.DoubleSide });

		var terrain = new THREE.Mesh(terrainGeo, terrainMaterial);
		terrain.position.x = 1500;
		terrain.position.y = - inParameters.depth * 0.2;
		terrain.position.z = -3000;
		this.ms_Scene.add(terrain);
	},

	display: function display() {
		this.ms_Water.render();
		this.ms_Renderer.render(this.ms_Scene, this.ms_Camera);
	},

	update: function update() {
		if (this.ms_FilesDND != null) {
			this.ms_FilesDND.rotation.y += 0.01;
		}
		this.ms_Water.material.uniforms.time.value += 1.0 / 60.0;
		this.ms_Controls.update();
		this.display();
	},

	resize: function resize(inWidth, inHeight) {
		this.ms_Camera.aspect =  inWidth / inHeight;
		this.ms_Camera.updateProjectionMatrix();
		this.ms_Renderer.setSize(inWidth, inHeight);
		this.ms_Canvas.html(this.ms_Renderer.domElement);
		this.display();
	}

};
