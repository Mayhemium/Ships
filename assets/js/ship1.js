function ShipOne() {
    var colladaLoader = new THREE.ColladaLoader();
    var shipOne;
    var shipContainer = new THREE.Object3D();
    shipContainer.name = "mine";
    function init() {
        colladaLoader.load(
          //"assets/models/lighthouse-textured.xml",
          "assets/models/ship1/ship1.xml",
          // gdy załadowany
          function (collada) {

              shipOne = collada.scene;

              // dostęp do meshów wewnątrz modelu
              // używamy gdy chcemy zrobić coś z elementami modelu
              // np podstawić materiał

              shipOne.traverse(function (child) {
                  if (child instanceof THREE.Mesh) {
                      console.log("mesh " + child.id);

                      //glowna kolumna (marmur jasny)
                    /*  if (child.id == 222) {
                          child.material = new THREE.MeshPhongMaterial({ side: THREE.DoubleSide, map: THREE.ImageUtils.loadTexture('assets/textures/lighthouseTextures/18_BaseColor.jpg') });
                      }*/
                  }

              });

              shipContainer.add(shipOne);

              //poprawki skali, położenia, obrotu
              shipOne.scale.set(1500, 1200, 2000);
              shipOne.rotation.x = -Math.PI / 2;
              shipOne.position.set(-5, 0, 800);
              var axisHelper = new THREE.AxisHelper(500);
              shipContainer.add(axisHelper);

          },
          // gdy model jest pobierany z serwera
	 //jest możliwe monitorowanie stanu jego pobierania
	 //i wykonanie jakiejś czynności dopiero po załadowaniu

          function (e) {
              console.log("model " + e.loaded + "-" + e.total);
          }
      );
    }
    init();

    this.getShipOne = function () {
        return shipContainer;
    }

    this.rotate = function (count) {
        while (count > 0) {
            shipContainer.rotateY(Math.PI / 2);
            count--;
        }
    }

    this.setPosition = function (x, z) {
        shipContainer.position.set(-250-300*x, -75, (z - 4) * 300);
    }

}
