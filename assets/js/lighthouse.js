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
                  if (child instanceof THREE.Mesh) {
                      console.log("mesh " + child.id);
                      ///ZAKOMENTOWAŁAM NA RAZIE, BO MULI JAK OSTATNI SKURWYSYN
                      //396 nieoteksturowany!!!!!
                      //glowna kolumna (marmur jasny)
                      if (child.id == 352) {
                        child.material = new THREE.MeshPhongMaterial({ color: 0xeae8dc });
                      }
                      //drewno
                      if (child.id == 354 || child.id == 410 ||child.id == 408 || child.id == 356 || child.id == 358 || child.id == 362 || child.id == 370 || child.id == 372 || child.id == 376 || child.id == 378 || child.id == 384 || child.id == 402) {
                        child.material = new THREE.MeshPhongMaterial({ color: 0xad8658 });
                      }
                      //czerwony
                      if (child.id == 360 || child.id == 364 || child.id == 382 || child.id == 390 || child.id == 398 || child.id == 404) {
                        child.material = new THREE.MeshPhongMaterial({ color: 0xbe1f1f });
                      }
                      //stal
                      if (child.id == 366 || child.id == 368 || child.id == 380 || child.id == 386 || child.id == 406) {
                        child.material = new THREE.MeshPhongMaterial({ color: 0x8f8f8f });
                      }
                      //ciemny marmur
                      if (child.id == 374 || child.id == 388 || child.id == 392 || child.id == 394) {
                        child.material = new THREE.MeshPhongMaterial({ color: 0x3a3a3a });
                      }
                      if (child.id == 412) {
                          child.material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
                          //child.material = new THREE.MeshPhongMaterial({ side: THREE.DoubleSide, map: THREE.ImageUtils.loadTexture('assets/js/modelTextures/lighthouseTextures/stal.jpg') });
                      }
                  }

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
              //console.log("model " + e.loaded + "-" + e.total);
          }
      );
    }
    init();

    this.getLighthouse = function () {
        return container;
    }

}
