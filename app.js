let remoteWindow = document.getElementById('remote-window');
let channelName = localStorage.getItem('channelname');
let handleFail = function(err){
    console.log('Error: ', err);    
}
document.getElementById('dissconnect-call').onclick = () =>  {
    client.leave();
    if (client.leave) {
        window.location.href = 'signin.html'
    }
}
var isMuted = false;
document.getElementById('toggle-mic').onclick = () =>  {
    if (isMuted) {
        isMuted = false;
        globalStream.enableAudio();
    } else {
        isMuted = true;
        globalStream.muteAudio();
    }
}
var isCameraOn = true;
document.getElementById('toggle-camera').onclick = () => {
    if(isCameraOn){
        isCameraOn=false;
        globalStream.muteVideo();
        document.getElementById('camera-icon').classList.remove('bi-camera-video-fill')
        document.getElementById('camera-icon').classList.add('bi-camera-video-off-fill')
    }
    else{
        isCameraOn = true;
        globalStream.enableVideo();
    }
}
function removeVideosStream(evt){
    let stream = evt.stream;
    stream.stop();
    let removeDiv = document.getElementById('remote-window');
    removeDiv.parentNode.removeChild(removeDiv);
    console.log('remote stream removed');
}
let client = AgoraRTC.createClient({
    mode :'live',
    codec : 'h264',
});
 
let stream = AgoraRTC.createStream({
    streamID :0,
    audio : true,
    video : true,
    screen : false,
});
client.init('22adce6824424359a83f03e29b0daa73',function(){
    console.log('Success');
});

client.join(null, channelName, null, function(uid){
    let localStream = AgoraRTC.createStream({
        streamID : uid,
        audio : true,
        video : true,
        screen : false,
    });
    globalStream = localStream;

    localStream.init(function(){
        localStream.play("self-window");
        client.publish(localStream, handleFail);

        client.on('stream-added', (evt) =>{
            client.subscribe(evt.stream, handleFail);
        });
        client.on('stream-subscribed',(evt) =>{
            let stream = evt.stream;
            stream.play('remote-window')
        });
    })
}, handleFail);