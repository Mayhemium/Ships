var DEMO = {
	ms_Canvas: null,
	ms_Renderer: null,
	ms_Camera: null,
	ms_Scene: null,
	ms_Controls: null,
	ms_Water: null,
	ms_FilesDND: null,
	ms_Raycaster: null,
	ms_Clickable: [],

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
		this.ms_Camera.position.set(0, Math.max(inParameters.width * 1.5, inParameters.height) / 8, -inParameters.height);
		this.ms_Camera.lookAt(new THREE.Vector3(0, 0, 0));

		this.ms_Raycaster = new THREE.Raycaster();

		// Initialize Orbit control
		this.ms_Controls = new THREE.OrbitControls(this.ms_Camera, this.ms_Renderer.domElement);
		this.ms_Controls.userPan = false;
		this.ms_Controls.userPanSpeed = 0.0;
		this.ms_Controls.maxDistance = 5000.0;
		this.ms_Controls.maxPolarAngle = Math.PI * 0.495;

		// Add light
		var sunlight = new THREE.DirectionalLight(0xffff55, 1);
		sunlight.position.set(-600, 300, 600);
		this.ms_Scene.add(sunlight);

		// Create terrain
		this.loadTerrain(inParameters);

		//axis helper

		var axisHelper = new THREE.AxisHelper( 500 );
		this.ms_Scene.add( axisHelper );

		//create playground

		var pfMesh = new THREE.BoxGeometry( 300, 300, 25 );
		var pfMaterial = new THREE.MeshBasicMaterial( {color: 0x0000ff, side: THREE.DoubleSide, wireframe: true} );
		var pfMaterial2 = new THREE.MeshBasicMaterial( {color: 0xffffff, side: THREE.DoubleSide, wireframe: true} );

			for(var i=0; i<10; i++){
				for(var j=0;j<10;j++){
					var pf = new THREE.Mesh( pfMesh, pfMaterial );
					this.ms_Scene.add(pf)
					pf.rotation.x=Math.PI / 2;
					pf.position.set(-1750+((j-4)*300),0,((i-4)*300))
				}
			}

			for(var i=0; i<10; i++){
				for(var j=0;j<10;j++){
					var pf = new THREE.Mesh( pfMesh, pfMaterial2 );
					this.ms_Scene.add(pf)
					pf.rotation.x=Math.PI / 2;
					pf.position.set(1450+((j-4)*300),0,((i-4)*300))
				}
			}

		var pfEnemyMesh = new THREE.BoxGeometry( 100, 100, 100 );
		var pfEnemyMaterial = new THREE.MeshPhongMaterial({side: THREE.DoubleSide, map: THREE.ImageUtils.loadTexture('assets/img/wood.jpg') });



		for(var i=0; i<10; i++){
			for(var j=0; j<10; j++){
				var pfEnemy = new THREE.Mesh( pfEnemyMesh, pfEnemyMaterial );
				this.ms_Scene.add(pfEnemy)
				pfEnemy.position.set(50,450+((i-4)*100),((j-4)*100))
			}
		}

		for(var i=0; i<10; i++){
			for(var j=0; j<10; j++){
				var pfEnemy = new THREE.Mesh( pfEnemyMesh, pfEnemyMaterial );
				this.ms_Scene.add(pfEnemy)
				pfEnemy.position.set(-50,450+((i-4)*100),((j-4)*100))
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
				DEMO.ms_Clickable.push(DEMO.ms_FilesDND);

				DEMO.ms_FilesDND.position.y = 1200;
				DEMO.ms_Scene.add(DEMO.ms_FilesDND);
			}
		});

		var lH = new Lighthouse();
    console.log(lH)
    var lHMesh = new lH.getLighthouse();
    lHMesh.position.set(1500,50,-3000);
    this.ms_Scene.add(lHMesh);

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
		terrain.position.y = - inParameters.depth * 0.4;
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
