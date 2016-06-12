function ShipFour() {
    var colladaLoader = new THREE.ColladaLoader();
    var shipFour;
    var shipFourContainer = new THREE.Object3D();
    function init() {
        colladaLoader.load(
          //"assets/models/lighthouse-textured.xml",
          "assets/models/ship4/ship4.xml",
          // gdy załadowany
          function (collada) {

              shipFour = collada.scene;

              // dostęp do meshów wewnątrz modelu
              // używamy gdy chcemy zrobić coś z elementami modelu
              // np podstawić materiał

              shipFour.traverse(function (child) {
                  if (child instanceof THREE.Mesh) {
                      //console.log("mesh " + child.id);

                      //glowna kolumna (marmur jasny)
                    /*  if (child.id == 222) {
                          child.material = new THREE.MeshPhongMaterial({ side: THREE.DoubleSide, map: THREE.ImageUtils.loadTexture('assets/textures/lighthouseTextures/18_BaseColor.jpg') });
                      }*/
                  }

              });

              shipFourContainer.add(shipFour);

              //poprawki skali, położenia, obrotu
              shipFour.scale.set(950, 450, 800);
              shipFour.rotation.x = -Math.PI / 2;
              shipFour.position.set(0, 0, 100);
              var axisHelper = new THREE.AxisHelper(500);
              shipFourContainer.add(axisHelper);

          },
          // gdy model jest pobierany z serwera
	 //jest możliwe monitorowanie stanu jego pobierania
	 //i wykonanie jakiejś czynności dopiero po załadowaniu

          function (e) {
              //console.log("model " + e.loaded + "-" + e.total);
          }
      );
    }
    init();

    this.getShipFour = function () {
        return shipFourContainer;
    }

    this.rotate = function (count) {
        while (count > 0) {
            shipFourContainer.rotateY(Math.PI / 2);
            count--;
        }
    }

    this.setPosition = function (x, z) {
        shipFourContainer.position.set(-250 - 300 * x, -75, (z - 4) * 300);
    }

}
