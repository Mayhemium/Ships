function ShipThree() {
    var colladaLoader = new THREE.ColladaLoader();
    var shipThree;
    var shipThreeContainer = new THREE.Object3D();
    function init() {
        colladaLoader.load(
          //"assets/models/lighthouse-textured.xml",
          "assets/models/ship3/ship3.xml",
          // gdy załadowany
          function (collada) {

              shipThree = collada.scene;

              // dostęp do meshów wewnątrz modelu
              // używamy gdy chcemy zrobić coś z elementami modelu
              // np podstawić materiał

              shipThree.traverse(function (child) {
                  if (child instanceof THREE.Mesh) {
                      //console.log("mesh " + child.id);

                      //glowna kolumna (marmur jasny)
                    /*  if (child.id == 222) {
                          child.material = new THREE.MeshPhongMaterial({ side: THREE.DoubleSide, map: THREE.ImageUtils.loadTexture('assets/textures/lighthouseTextures/18_BaseColor.jpg') });
                      }*/
                  }

              });

              shipThreeContainer.add(shipThree);

              //poprawki skali, położenia, obrotu
              shipThree.scale.set(700, 400, 800);
              shipThree.rotation.x = -Math.PI/2;

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

    this.getShipThree = function () {
        return shipThreeContainer;
    }

}
