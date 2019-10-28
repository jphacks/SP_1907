// OS名取得
let os = navigator.platform;
// デバイスによって加速度の軸が違うので、それの調整用
let osNum;
// OS判定
if (os === "iPhone" || os === "iPad" || os === "iPod") {
    osNum = -1;
} else {
    osNum = 1;
}

// ARシーンを動的に出すためのhtmlテキスト（iOS対策）
let innerHtml = '<a-scene id="touchDet" vr-mode-ui="enabled: false" arjs="debugUIEnabled:false;"><a-assets>'
    + '<a-asset-item id="syachi" src="Models/syachi.glb"></a-asset-item>'
    + '<a-asset-item id="tiger" src="Models/Tiger.glb"></a-asset-item>'
    + '<a-asset-item id="grass" src="Models/Grass3.glb"></a-asset-item>'
    + '<a-asset-item id="penguin" src="Models/Pengin.glb"></a-asset-item>'
    + '</a-assets>'
    + '<a-entity class="animal" id="animal-penguin" gltf-model="#penguin" animation-mixer position="0 0 2" rotation="0 90 0"'
    + 'scale="1 1 1" visible="false"></a-entity>'
    + '<a-entity class="animal" id="animal-syachi" gltf-model="#syachi" animation-mixer position="0 0 2" rotation="0 90 0"'
    + 'scale="1 1 1" visible="false"></a-entity>'
    + '<a-entity class="animal" id="animal-tiger" gltf-model="#tiger" animation-mixer position="0 0 2" rotation="0 0 0"'
    + 'scale="1 1 1" visible="false"></a-entity>'
    + '<a-entity id="obj-grass" gltf-model="#grass" animation-mixer position="0 0.35 -1" scale="1 1 1" rotation="0 0 0"'
    + 'scale="1 1 1" visible="false"></a-entity>'
    + '<a-entity id="camera" camera position="0 0 0" look-controls></a-entity>'
    + '<a-box id="cube" scale="1 1 1" position="0 0 -3" color="red"></a-box>'
    + '</a-scene>';

// 画像のプリロード
$('<img src="img/caution.png">');

// iOSだった時にモーション取得するための関数
request_permission = function () {
    $('#start').addClass('display-none');
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
    // ar-containerにA-frameのhtml表示
    $('#ar-container').html(innerHtml);

    showAnimalButton();
    initAnimals();

    // syachi = document.getElementById('animal-syachi');
    // penguin = document.getElementById('animal-penguin');
    // tiger = document.getElementById('animal-tiger');
    // grass = document.getElementById('obj-grass');

    // syachi.addEventListener('animation-loop', function () {
    //     showWater();
    // });

    // tiger.addEventListener('animation-loop', function () {

    //     grass.setAttribute('visible', false);
    //     setTimeout(() => {
    //         if (!isGrass) {
    //             return;
    //         }
    //         grass.setAttribute('visible', true);
    //     }, 2600);
    // });
}

/**
 * 動物たちを最初は止めておく
 */
let initAnimals = function () {
    let animalSet = document.getElementsByClassName("animal");
    for (let i = 0; i < animalSet.length; i++) {
        const element = animalSet[i];
        element.setAttribute("animation-mixer", { timeScale: 0 })
    }
}

/**
 * 動物を表示させるボタンを表示させる
 */
let showAnimalButton = function () {
    // シーンが表示されるまでボタン表示しない
    let id = setInterval(() => {
        if (!($('video').length)) {
            return;
        } else {
            clearInterval(id);
        }
        // 動物ボタンの表示
        $('body').append(
            '<div style="position: fixed; bottom: 10px; width:100%; text-align: center; z-index: 1;color: grey;">'
            + '<div'
            + ' style="color: rgba(0, 0, 0, 0.9); background-color: rgba(127, 127, 127, 0.5); display: inline-block; padding: 0.5em; margin: 0.5em; text-align: left;">'
            + '<span style="display: block;">'
            + '<button id="syachi-btn" class="btn-primary"style="font-size:5vw;">シャチ</button>'
            + '<button id="penguin-btn" class="btn-primary"style="font-size:5vw;">ペンギン</button>'
            + '<button id="tiger-btn" class="btn-primary"style="font-size:5vw;">トラ</button>'
            + '</span>'
            + '</div>'
            + '</div>'
        )
        // 各ボタンに
        $('#syachi-btn').on('click', function () {
            startAR('syachi');
        });
        $('#penguin-btn').on('click', function () {
            startAR('penguin');
        });
        $('#tiger-btn').on('click', function () {
            startAR('tiger');
        });
    }, 1000);
}

// スマホの加速度を取得するか否か
let isMove = false;

window.addEventListener('devicemotion',
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
        var position = camera.getAttribute('position');
        var rotation = camera.getAttribute('rotation');

        camera.setAttribute('position', position);
    });

let beseDistance = 0;
let baseCubeX = 0;
let baseCubeY = 0;
let baseCubeZ = 0;

let cubeScale = { x: 1, y: 1, z: 1 };
let cubePosition = { x: 0, y: 0, z: -3 };

let timeoutId;

// 平面規定処理--------------
$(document).on("touchmove", "#touchDet",
    function (event) {
        touchDetector = document.getElementById('touchDet');

        cube = document.getElementById('cube');
        cubeScale = cube.getAttribute('scale');
        cubePosition = cube.getAttribute('position');
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
        }
    }
);

/**
 * シャチが飛び込んだ時に水しぶきを上げる
 * 一定時間後に水しぶきを表示させる
 */
let showWater = function () {
    $('.container').addClass('display-none');
    setTimeout(() => {
        $('.container').removeClass('display-none');
    }, 5000);
}

/**
 * 動物を表示させる。
 * @param {string} name 表示する動物名 
 */
let startAR = function (name) {
    cube.setAttribute('visible', false);
    $('.btn-primary').addClass('display-none');


    let modifyScale = 0;

    switch (name) {
        case 'syachi':
            animal = syachi;
            modifyScale = 0.1;
            // 最初の一回はボタン押下時に呼び出す
            showWater();
            // 以降はループごとに呼び出す
            animal.addEventListener('animation-loop', function () {
                showWater();
            });
            break;
        case 'penguin':
            animal = penguin;
            modifyScale = 0.1;
            break;
        case 'tiger':
            animal = tiger;
            modifyScale = 1;
            // 最初の一回はボタン押下時に呼び出す
            setTimeout(() => {
                grass.setAttribute('visible', true);
            }, 2600);
            // 以降はループごとに呼び出す
            tiger.addEventListener('animation-loop', function () {
                grass.setAttribute('visible', false);
                setTimeout(() => {
                    grass.setAttribute('visible', true);
                }, 2600);
            });
                break;
        default:
            break;
    }
    isMove = true;

    animal.setAttribute('position', `${cubePosition.x} ${cubePosition.y} ${cubePosition.z}`);
    animal.setAttribute('scale', `${cubeScale.x * modifyScale} ${cubeScale.y * modifyScale} ${cubeScale.z * modifyScale}`);
    animal.setAttribute('animation-mixer', { timeScale: 1 });
    animal.setAttribute('visible', true);
}

$(window).on('load orientationchange resize', function () {
    if (Math.abs(window.orientation) === 90) {
        // 横向きになったときの処理
        $('#caution').addClass("display-none");
    } else {
        // 縦向きになったときの処理
        $('#caution').removeClass("display-none");
    }
});