function ShipTwo() {
    var colladaLoader = new THREE.ColladaLoader();
    var shipTwo;
    var shipTwoContainer = new THREE.Object3D();
    function init() {
        colladaLoader.load(
          //"assets/models/lighthouse-textured.xml",
          "assets/models/ship2/ship2.xml",
          // gdy załadowany
          function (collada) {

              shipTwo = collada.scene;

              // dostęp do meshów wewnątrz modelu
              // używamy gdy chcemy zrobić coś z elementami modelu
              // np podstawić materiał

              shipTwo.traverse(function (child) {
                  if (child instanceof THREE.Mesh) {
                      //console.log("mesh " + child.id);

                      //glowna kolumna (marmur jasny)
                    /*  if (child.id == 222) {
                          child.material = new THREE.MeshPhongMaterial({ side: THREE.DoubleSide, map: THREE.ImageUtils.loadTexture('assets/textures/lighthouseTextures/18_BaseColor.jpg') });
                      }*/
                  }

              });

              shipTwoContainer.add(shipTwo);

              //poprawki skali, położenia, obrotu
              shipTwo.scale.set(950, 500, 600);
              shipTwo.rotation.x = -Math.PI / 2;
              shipTwo.position.set(0, 0, 400);
              //var axisHelper = new THREE.AxisHelper(500);
              //shipTwoContainer.add(axisHelper);

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

    this.getShip = function () {
        return shipTwoContainer;
    }

    this.rotate = function (count) {
        shipTwoContainer.rotation.y = count * (Math.PI / 2);
    }

    this.setPosition = function (x, z) {
        shipTwoContainer.position.set(-250 - 300 * x, -75, (z - 4) * 300);
    }

}
