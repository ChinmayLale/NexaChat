import React, { useEffect, useCallback, useState } from "react";
import ReactPlayer from "react-player";
import peer from './peer';
import { useSocket } from "./SocketProvider";




function Room() {
  const socket = useSocket();
  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const [myStream, setMyStream] = useState();
  const [userName , setUserName] = useState("SomeOne")
  const [remoteStream, setRemoteStream] = useState();
  const [visible , setVisible] = useState(true);
  const [muted, setMuted] = useState(false); // Add a new state for muted status
  const [video , setVideo] = useState(false);

  const handleMute = () => {
    if (myStream) {
      myStream.getAudioTracks()[0].enabled = !muted;
      setMuted(!muted);
      console.log('Mute State : '+muted);
    }
  };

  const handleVideo = () =>{
    if (myStream) {
      myStream.getVideoTracks()[0].enabled = !video;
      setVideo(!video);
      console.log('Video State : '+video);
    }
  }

  const handleUserJoined = useCallback(({ email, id }) => {
    console.log(`Email ${email} joined room`);
    setUserName(email);
    setRemoteSocketId(id);
  }, []);

  const handleCallUser = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    const offer = await peer.getOffer();
    socket.emit("user:call", { to: remoteSocketId, offer });
    setMyStream(stream);
  }, [remoteSocketId, socket]);

  const handleIncommingCall = useCallback(
    async ({ from, offer }) => {
      setRemoteSocketId(from);
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      setMyStream(stream);
      console.log(`Incoming Call`, from, offer);
      const ans = await peer.getAnswer(offer);
      socket.emit("call:accepted", { to: from, ans });
      // sendStreams();  // Trying ro join and send stream at same time 
    },
    [socket]
  );

  const sendStreams = useCallback(() => {
    for (const track of myStream.getTracks()) {
      peer.peer.addTrack(track, myStream);
    }
    if(visible){
    setVisible(false);
    const temp = document.getElementById('sendvideo');
    temp.style.display = 'block';
    }
  }, [myStream,visible]);

  const handleCallAccepted = useCallback(
    ({ from, ans }) => {
      peer.setLocalDescription(ans);
      console.log("Call Accepted!");
      sendStreams();
    },
    [sendStreams]
  );

  const handleNegoNeeded = useCallback(async () => {
    const offer = await peer.getOffer();
    socket.emit("peer:nego:needed", { offer, to: remoteSocketId });
  }, [remoteSocketId, socket]);

  useEffect(() => {
    peer.peer.addEventListener("negotiationneeded", handleNegoNeeded);
    return () => {
      peer.peer.removeEventListener("negotiationneeded", handleNegoNeeded);
    };
  }, [handleNegoNeeded]);

  const handleNegoNeedIncomming = useCallback(
    async ({ from, offer }) => {
      const ans = await peer.getAnswer(offer);
      socket.emit("peer:nego:done", { to: from, ans });
    },
    [socket]
  );

  const handleNegoNeedFinal = useCallback(async ({ ans }) => {
    await peer.setLocalDescription(ans);
  }, []);


  const handleEndCall = useCallback(async () => {
    try {
      await peer.close();
      setRemoteStream(null);
      if (myStream) { // Check if myStream exists before stopping it
        myStream.getTracks().forEach(track => track.stop());
        setMyStream(null);
      }
      socket.emit("call:ended", { to: remoteSocketId });
    } catch (error) {
      console.error("Error ending call:", error);
    }
  }, [socket, remoteSocketId, setRemoteStream, setMyStream, myStream]);



  useEffect(() => {
    peer.peer.addEventListener("track", async (ev) => {
      const remoteStream = ev.streams;
      console.log("GOT TRACKS!!");
      setRemoteStream(remoteStream[0]);
    });
  }, []);

  useEffect(() => {
    socket.on("user:joined", handleUserJoined);
    socket.on("incomming:call", handleIncommingCall);
    socket.on("call:accepted", handleCallAccepted);
    socket.on("peer:nego:needed", handleNegoNeedIncomming);
    socket.on("peer:nego:final", handleNegoNeedFinal);

    return () => {
      socket.off("user:joined", handleUserJoined);
      socket.off("incomming:call", handleIncommingCall);
      socket.off("call:accepted", handleCallAccepted);
      socket.off("peer:nego:needed", handleNegoNeedIncomming);
      socket.off("peer:nego:final", handleNegoNeedFinal);
    };
  }, [
    socket,
    handleUserJoined,
    handleIncommingCall,
    handleCallAccepted,
    handleNegoNeedIncomming,
    handleNegoNeedFinal,
  ]);










  return (
    <div className="room_main">
      {!remoteSocketId ? (<h1 >Waiting for someone to join the call</h1>) : (null)}
      {remoteSocketId  ? (<h1 id="status" style={{display:remoteStream?'none':'block'}}>{userName} joined the room , Start a Call by pressing green Button</h1>) : (<h1>Loading....</h1>)}
      {/* {myStream && <button onClick={sendStreams} id="sendvideo" className="btn" >Connect</button>} */}
     
      {myStream && (
        <>
          {/* <h1>My Stream</h1> */}
          <ReactPlayer
            playing
            muted
            className="selfStream"
            url={myStream}
          />
        </>
      )}
      {remoteStream && (
        <>
          {/* <h1>Remote Stream</h1> */}
          <ReactPlayer
            playing
            className="remoteStream"
            url={remoteStream}
          />
          
        </>
      )}
      
      <div className="btndiv">
      {remoteSocketId && !myStream  && <button id='callup' onClick={handleCallUser} className="callup"><i class="ri-phone-fill"></i></button>}
      <button className="mute" onClick={()=>{handleMute()}}><i class="ri-mic-line"></i></button>
      <button className="video" onClick={()=>{handleVideo()}}><i class="ri-video-on-line"></i></button>
      {remoteStream && <button onClick={handleEndCall} className="endcall"><i class="ri-home-line"></i></button>}
      {myStream && <button onClick={sendStreams} id="sendvideo" className="sendvideo" ><i class="ri-arrow-left-right-line"></i></button>}
      </div>
    </div>
  )
}

export default Room