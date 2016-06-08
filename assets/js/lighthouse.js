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
                      //266 nieoteksturowany!!!!!
                      //glowna kolumna (marmur jasny)
                    /*  if (child.id == 222) {
                          child.material = new THREE.MeshPhongMaterial({ side: THREE.DoubleSide, map: THREE.ImageUtils.loadTexture('assets/textures/lighthouseTextures/18_BaseColor.jpg') });
                      }
                      //drewno
                      if (child.id == 224 || child.id == 226 || child.id == 228 || child.id == 232 || child.id == 240 || child.id == 242 || child.id == 246 || child.id == 248 || child.id == 254 || child.id == 272) {
                          child.material = new THREE.MeshPhongMaterial({ side: THREE.DoubleSide, map: THREE.ImageUtils.loadTexture('assets/textures/lighthouseTextures/8_BaseColor.jpg') });
                      }
                      //czerwony
                      if (child.id == 230 || child.id == 234 || child.id == 252 || child.id == 260 || child.id == 268 || child.id == 274) {
                          child.material = new THREE.MeshPhongMaterial({ side: THREE.DoubleSide, map: THREE.ImageUtils.loadTexture('assets/textures/lighthouseTextures/19_BaseColor.jpg') });
                      }
                      //stal
                      if (child.id == 236 || child.id == 238 || child.id == 250 || child.id == 256 || child.id == 276) {
                          child.material = new THREE.MeshPhongMaterial({ side: THREE.DoubleSide, map: THREE.ImageUtils.loadTexture('assets/textures/lighthouseTextures/stal.jpg') });
                      }
                      //ciemny marmur
                      if (child.id == 244 || child.id == 258 || child.id == 262 || child.id == 264) {
                          child.material = new THREE.MeshPhongMaterial({ side: THREE.DoubleSide, map: THREE.ImageUtils.loadTexture('assets/textures/lighthouseTextures/2_BaseColor.jpg') });
                      }
                      if (child.id == 278) {
                          child.material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
                          //child.material = new THREE.MeshPhongMaterial({ side: THREE.DoubleSide, map: THREE.ImageUtils.loadTexture('assets/js/modelTextures/lighthouseTextures/stal.jpg') });
                      }*/
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
              console.log("model " + e.loaded + "-" + e.total);
          }
      );
    }
    init();

    this.getLighthouse = function () {
        return container;
    }

}
