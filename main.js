let innerHtml = '<a-scene><a-assets>    <a-asset-item id="model" src="Models/syachi.glb"></a-asset-item></a-assets><a-entity gltf-model="#model" animation-mixer position="-0.55 0 -1" rotation="0 140 -10"    scale="1 1 1" visible="true"></a-entity><a-entity id="camera" camera position="0 0 0" look-controls></a-entity></a-scene>';

// $(window).click(request_permission());

request_permission = function () {
    if (
        DeviceMotionEvent &&
        DeviceMotionEvent.requestPermission &&
        typeof DeviceMotionEvent.requestPermission === 'function'
    ) {
        DeviceMotionEvent.requestPermission();
    }
    if (
        DeviceOrientationEvent &&
        DeviceOrientationEvent.requestPermission &&
        typeof DeviceOrientationEvent.requestPermission === 'function'
    ) {
        DeviceOrientationEvent.requestPermission();
    }
    $("body").html(innerHtml);
}


window.addEventListener("devicemotion",
    // イベント発生
    function () {
        // x軸
        var posx = event.acceleration.x;
        // y軸
        var posy = event.acceleration.y;
        // z軸
        var posz = event.acceleration.z;

        var rotz = event.rotationRate.alpha; //z方向
        var rotx = event.rotationRate.beta; //x方向
        var roty = event.rotationRate.gamma; // y方向

        var camera = document.getElementById('camera');

        var position = camera.getAttribute('position');
        // var rotation = camera.getAttribute('rotation');

        position.x += posx;
        position.z += posz;

        rotation.x = rotx;
        rotation.y = roty;
        rotation.z = rotz;

        camera.setAttribute('position', position);
        // camera.setAttribute('rotation', rotation);
    });

// let test = function (posx, posy) {
//     var camera = document.getElementById('camera');
//     var position = camera.getAttribute('position');

//     position.x += posx;
//     position.z += posy;
//     camera.setAttribute('position', position);

// }