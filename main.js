window.addEventListener("devicemotion", function(evt){

    //加速度
    var x = evt.acceleration.x;
    var y = evt.acceleration.y;
    var z = evt.acceleration.z;


    //傾き
    var xg = evt.accelerationIncludingGravity.x;
    var yg = evt.accelerationIncludingGravity.y;
    var zg = evt.accelerationIncludingGravity.z;

    //回転値
    var a = evt.rotationRate.alpha; //z方向
    var b = evt.rotationRate.beta; //x方向
    var g = evt.rotationRate.gamma; // y方向

    var txt  = "x:"+x+"<br>";
        txt += "y:"+y+"<br>";
        txt += "z:"+z+"<br>";

        txt += "傾きx:"+xg+"<br>";
        txt += "傾きy:"+yg+"<br>";
        txt += "傾きz:"+zg+"<br>";

        txt += "alpha(z):"+a+"<br>";
        txt += "beta(x):"+b+"<br>";
        txt += "gamma(y):"+g+"<br>";

    console.log(txt);

}, true);