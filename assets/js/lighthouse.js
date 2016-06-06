function Lighthouse() {
    var colladaLoader = new THREE.ColladaLoader();
    var lighthouse;
    var container = new THREE.Object3D();
    function init() {
        colladaLoader.load(
          //"assets/models/lighthouse-textured.xml",
          "assets/models/lighthouse/untitled.xml",
          // gdy załadowany
          function (collada) {

              lighthouse = collada.scene;

              // dostęp do meshów wewnątrz modelu
              // używamy gdy chcemy zrobić coś z elementami modelu
              // np podstawić materiał

              lighthouse.traverse(function (child) {
                  //if (child instanceof THREE.Mesh) {
                  //    console.log("mesh " + child.name);
                  //}

              });

              container.add(lighthouse);

              //poprawki skali, położenia, obrotu
              lighthouse.scale.set(200, 200, 200);
              lighthouse.rotation.x = -Math.PI/2;

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

    this.getLighthouse = function () {
        return container;
    }

}
