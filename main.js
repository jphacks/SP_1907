// document.getElementById("request_permission").addEventListener("click", function(){
//     if (
//       DeviceMotionEvent &&
//       DeviceMotionEvent.requestPermission &&
//       typeof DeviceMotionEvent.requestPermission === 'function'
//     ) {
//       DeviceMotionEvent.requestPermission();
//     }
//     if (
//       DeviceOrientationEvent &&
//       DeviceOrientationEvent.requestPermission &&
//       typeof DeviceOrientationEvent.requestPermission === 'function'
//     ) {
//       DeviceOrientationEvent.requestPermission();
//     }
//   })

//   new way ------------------------------------------------------

  //ジャイロセンサー確認
var isGyro=false;
if((window.DeviceOrientationEvent)&&('ontouchstart' in window)){
	isGyro=true;
}

//PCなど非ジャイロ
if(!isGyro){
	setCanvas();

//一応ジャイロ持ちデバイス
}else{
	//ジャイロ動作確認
	var resGyro=false;
	window.addEventListener("deviceorientation",doGyro,false);
	function doGyro(){
		resGyro=true;
		window.removeEventListener("deviceorientation",doGyro,false);
	}

	//数秒後に判定
	setTimeout(function(){
		//ジャイロが動いた
		if(resGyro){
			setCanvas();

		//ジャイロ持ってるくせに動かなかった
		}else{
			//iOS13+方式ならクリックイベントを要求
			if(typeof DeviceOrientationEvent.requestPermission==="function"){
				//ユーザアクションを得るための要素を表示
				cv._start.show();
				cv._start.on("click",function(){
					cv._start.hide();
					DeviceOrientationEvent.requestPermission().then(res => {
						//「動作と方向」が許可された
						if(res==="granted"){
							setCanvas();
						//「動作と方向」が許可されなかった
						}else{
							isGyro=false;
							setCanvas();
						}
					});
				});

			//iOS13+じゃない
			}else{
				//早くアップデートしてもらうのを祈りながら諦める
				isGyro=false;
				setCanvas();
			}
		}
	},300);
}