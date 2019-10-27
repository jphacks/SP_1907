let innerHtml = '<a-scene id="touchDet" arjs="debugUIEnabled:false;"><a-assets>'
    + '<a-asset-item id="penguin" src="Models/Pinga.glb"></a-asset-item>'
    + '<a-asset-item id="syachi" src="Models/syachi.glb"></a-asset-item>'
    + '</a-assets>'
    // + '<a-entity id="animal" gltf-model="#penguin" animation-mixer position="0 0 2" rotation="0 0 0"'
    // + 'scale="1 1 1" visible="false"></a-entity>'
    + '<a-entity id="animal" gltf-model="#syachi" animation-mixer position="0 0 2" rotation="0 0 0"'
    + 'scale="1 1 1" visible="false"></a-entity>'
    + '<a-entity id="camera" camera position="0 0 0" look-controls></a-entity>'
    + '<a-box id="cube" scale="1 1 1" position="0 0 -3" color="red"></a-box>'
    + '</a-scene>';


let os = navigator.platform;                // OS名の取得
let osNum;
if (os === "iPhone" || os === "iPad" || os === "iPod") {     // iOSなら
    osNum = -1;
} else {
    osNum = 1;
}


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
    // $("#container").html(innerHtml);
    $("#ar-container").html(innerHtml);
    $('body').append(
        '<div style="position: fixed; bottom: 10px; width:100%; text-align: center; z-index: 1;color: grey;">'
        + '<div'
        + ' style="color: rgba(0, 0, 0, 0.9); background-color: rgba(127, 127, 127, 0.5); display: inline-block; padding: 0.5em; margin: 0.5em; text-align: left;">'
        + '<span style="display: block;"><button class="btn-primary" onclick="startAR()">MoveStart</button></span>'
        + '</div>'
        + '</div>'
    )
    setTimeout(
        setInterval(() => {
            if(flag){
                $('.container').toggleClass('display-none')
            }
        }, 3500)
    ,5000);
}

let flag = false;

let isMove = false;


window.addEventListener("devicemotion",
    // イベント発生
    function () {
        if (document.getElementById('camera') == null || !isMove) {
            return;
        }
        var camera = document.getElementById('camera');

        // x軸
        var accelx = event.acceleration.x.toFixed(3) * osNum;
        // y軸
        var accely = event.acceleration.y.toFixed(3) * osNum;
        // z軸
        var accelz = event.acceleration.z.toFixed(3) * osNum;

        let accel = [accelx, accely, accelz];
        let speed = [0, 0, 0];
        let difference = [0, 0, 0];

        let filterCoefficient = 0.9;
        let lowpassValue = 0;
        let highpassValue = 0;

        // 時間差分
        let timeSpan = 0.01;
        // ひとつ前の加速度
        let oldAccel = 0;
        //　加速度から算出した速度
        // let speed = 0;
        // ひとつ前の速度
        let oldSpeed = 0;
        // 速度から算出した変位
        // let difference = 0;

        for (let i = 0; i < accel.length; i++) {

            // ローパスフィルター(現在の値 = 係数 * ひとつ前の値 ＋ (1 - 係数) * センサの値)
            lowpassValue = lowpassValue * filterCoefficient + accel[i] * (1 - filterCoefficient);
            // ハイパスフィルター(センサの値 - ローパスフィルターの値)
            highpassValue = accel[i] - lowpassValue;

            // 速度計算(加速度を台形積分する)
            speed[i] = ((highpassValue + oldAccel) * timeSpan) / 2 + speed[i];
            oldAccel = highpassValue;

            // 変位計算(速度を台形積分する)
            difference[i] = ((speed[i] + oldSpeed) * timeSpan) / 2 + difference[i];
            oldSpeed = speed[i];

        }
        // $('#speed').html(`<p>speed</p><p>${speed[0].toFixed(2)}</p><p>${speed[1].toFixed(2)}</p><p>${speed[2].toFixed(2)}</p>`);

        // var rotz = event.rotationRate.alpha; //z方向
        // var rotx = event.rotationRate.beta; //x方向
        // var roty = event.rotationRate.gamma; // y方向

        var position = camera.getAttribute('position');
        var rotation = camera.getAttribute('rotation');

        // position.x += 10 * -speed[0];
        // position.y += 10 * speed[1];
        // position.z += 10 * -speed[2].toFixed(1);
        // position.z += difference[2];

        // 移動
        // position.x += Math.cos(rotation.y * (Math.PI / 180)) * 10 * speed[2];
        // position.y += 0;
        // position.z += Math.sin(rotation.y * (Math.PI / 180)) * 10 * speed[2];

        // $('#pos').text(`position = x:${position.x.toFixed(2)} y:${position.y.toFixed(2)} z:${position.z.toFixed(2)}`);

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
// base
let beseDistance = 0;
let baseCubeX = 0;
let baseCubeY = 0;
let baseCubeZ = 0;

let timeoutId;
// 平面規定処理--------------
// $(document).on('ready', '#touchDet', function (e) {

// });

$(document).on("touchmove", "#touchDet",
    function (event) {
        touchDetector = document.getElementById('touchDet');

        testCube = document.getElementById('cube');
        cubeScale = testCube.getAttribute('scale');
        cubePosition = testCube.getAttribute('position');
        var touches = event.changedTouches;

        if (touches.length > 1) {
            var x1 = touches[0].pageX;
            var y1 = touches[0].pageY;

            var x2 = touches[1].pageX;
            var y2 = touches[1].pageY;

            var distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));

            clearTimeout(timeoutId);

            if (beseDistance && baseCubeX && baseCubeY && baseCubeZ) {
                var scale = distance / beseDistance;

                if (scale && scale != Infinity) {
                    cubeScale.x = baseCubeX * scale;
                    cubeScale.y = baseCubeY * scale;
                    cubeScale.z = baseCubeZ * scale;
                }

                timeoutId = setTimeout(function () {
                    beseDistance = 0;
                    baseCubeX = 0;
                    baseCubeY = 0;
                    baseCubeZ = 0;
                }, 100);

            } else {
                beseDistance = distance;
                baseCubeX = cubeScale.x;
                baseCubeY = cubeScale.y;
                baseCubeZ = cubeScale.z;

            }
        }else if(touches.length == 1){
            var x = touches[0].pageX;
            var y = touches[0].pageY;
            
            position.y += y;

        }
    }
);

let startAR = function () {
    flag = true;

    testCube.setAttribute("visible", false)
    let animal = document.getElementById("animal");
    let position = testCube.getAttribute("position");
    isMove = true;

    animal.setAttribute('position', `${position.x} ${position.y} ${position.z}`);
    animal.setAttribute('scale', `${cubeScale.x * 0.1} ${cubeScale.y * 0.1} ${cubeScale.z * 0.1}`);
    animal.setAttribute('visible', true);
    // '<a-entity id="animal" gltf-model="#penguin" animation-mixer position="0 0 2" rotation="0 0 0" scale="1 1 1" visible="true"></a-entity>')
}