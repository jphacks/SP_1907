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

        let sx = 0;
        let sy = 0;
        let sz = 0;

        let pos = [posx, posy, posz];
        let posSpeed = [sx, sy, sz];

        let filterCoefficient = 0.9;
        let lowpassValue = 0;
        let highpassValue = 0;

        // 時間差分
        let timeSpan = 0.1;
        // ひとつ前の加速度
        let oldAccel = 0;
        //　加速度から算出した速度
        // let speed = 0;
        // ひとつ前の速度
        let oldSpeed = 0;
        // 速度から算出した変位
        let difference = 0;

        for (let i = 0; i < pos.length; i++) {

            // ローパスフィルター(現在の値 = 係数 * ひとつ前の値 ＋ (1 - 係数) * センサの値)
            lowpassValue = lowpassValue * filterCoefficient + pos[i] * (1 - filterCoefficient);
            // ハイパスフィルター(センサの値 - ローパスフィルターの値)
            highpassValue = pos[i] - lowpassValue;

            // 速度計算(加速度を台形積分する)
            posSpeed[i] = ((highpassValue + oldAccel) * timeSpan) / 2 + posSpeed[i];
            oldAccel = highpassValue;

            // 変位計算(速度を台形積分する)
            difference = ((posSpeed[i] + oldSpeed) * timeSpan) / 2 + difference;
            oldSpeed = posSpeed[i];

        }

        // var rotz = event.rotationRate.alpha; //z方向
        // var rotx = event.rotationRate.beta; //x方向
        // var roty = event.rotationRate.gamma; // y方向

        var camera = document.getElementById('camera');

        var position = camera.getAttribute('position');
        // var rotation = camera.getAttribute('rotation');

        position.x += posSpeed[1];
        position.y += posSpeed[2];
        position.z += posSpeed[3];

        // rotation.x = rotx;
        // rotation.y = roty;
        // rotation.z = rotz;

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