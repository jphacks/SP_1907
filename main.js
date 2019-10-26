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