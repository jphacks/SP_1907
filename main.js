let innerHtml = '<a-scene><a-assets>    <a-asset-item id="model" src="Models/syachi.glb"></a-asset-item></a-assets><a-entity gltf-model="#model" animation-mixer position="-0.55 0 -1" rotation="0 140 -10"    scale="1 1 1" visible="true"></a-entity><a-entity id="camera" camera position="0 0 0"></a-entity></a-scene>';

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


// window.addEventListener("devicemotion",
//     // イベント発生
//     function () {
//         alert("OK");
//         // x軸
//         var x = event.acceleration.x;
//         // y軸
//         var y = event.acceleration.y;
//         // z軸
//         var z = event.acceleration.z;

//         var camera = document.getElementById('camera');

//         camera
//         var position = camera.getAttribute('position');
//         var rotation = camera.getAttribute('rotation');

//         position.x += x;
//         position.z += z;
//         camera.setAttribute('position', position);
//     });

let test = function (posx, posy) {
    var camera = document.getElementById('camera');
    var position = camera.getAttribute('position');

    position.x += posx;
    position.z += posy;
    camera.setAttribute('position', position);

}