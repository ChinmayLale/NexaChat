import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import './lobby.css';
import { useSocket } from './SocketProvider';
// import Doubts from '../assets/doubts1.svg';




function Lobby() {

    const [email, setEmail] = useState('');
    const [room, setRoom] = useState('');
    const [roomcode , setRoomCode] = useState('');
    const subjects = ['Java', "Python", 'HTML', 'CSS', "React", "Cybersecurity", "Data Science", "Other"]
    const socket = useSocket();
    // console.log(socket);
    const navigate = useNavigate();


    const handleSubmit = () => {
        console.log(`Email : ${email}`);
        console.log(`Room : ${room}`);
        socket.emit('room:join', { email, room });
    }


    const handleJoinRoom = useCallback((data) => {
        const { email, room } = data;
        console.log("Data From Handle Room");
        console.log(email, room);
        navigate(`/room/${room}`);

    }, [navigate])

    useEffect(() => {
        socket.on('room:join', handleJoinRoom);
        return () => {
            socket.off("room:join")
        }
    }, [socket, handleJoinRoom])



    const GetSubject = (val) => {
        alert(`Confirm ${subjects[val]} ?`)
        const setSubject = document.getElementById('room');
        setSubject.value = val;
        setRoom(subjects[val]);
    }

    const generateRandomCode = () => {
        const characters = 'abcdefghijklmnopqrstuvwxyz1234567890';
        const randomCode1 = Array.from({ length: 3 }, () => {
          const randomChar = characters[Math.floor(Math.random() * characters.length)];
          return randomChar;
        }).join('');

        const randomCode2 = Array.from({ length: 3 }, () => {
            const randomChar = characters[Math.floor(Math.random() * characters.length)];
            return randomChar;
          }).join('');

        const randomCode3 = Array.from({ length: 3 }, () => {
            const randomChar = characters[Math.floor(Math.random() * characters.length)];
            return randomChar;
          }).join('');
      
        return `${randomCode1}-${randomCode2}-${randomCode3}`;
      };


      const handleCopyClick = async () => {
        try {
            await navigator.clipboard.writeText(roomcode);
            alert("Copied to clipboard!");
        } catch (err) {
            console.error(
                "Unable to copy to clipboard.",
                err
            );
            alert("Copy to clipboard failed.");
        }
    };
      const PasteCode = (roomcode) =>{
        setRoom(roomcode);
        handleCopyClick();
      }
    return (
        <div className='lobby-main'>
            <div className="lobby">
                <h2 style={{ textAlign: 'center' }}>Generate Meet Code Or Paste it if you have one </h2>
                <div class="input-group">
                    <input required="" type="text" name="text" autocomplete="off" class="input" id='email' value={email} onChange={(e) => { setEmail(e.target.value) }} />
                    <label class="user-label">User-Name</label>
                </div>
                <div class="input-group">
                    <input required="" type="text" name="text" autocomplete="off" class="input" id='room' value={room} onChange={(e) => { setRoom(e.target.value) }} />
                    <label class="user-label">Room-Code</label>
                </div>
                <div class="scene" onClick={() => { handleSubmit() }}>
                    <div class="cube">
                        <span class="side top">Now</span>
                        <span class="side front">Join <span></span><i className="ri-phone-line"></i></span>
                    </div>
                </div>
                <h2 style={{ textAlign: 'center' }}>Or</h2>
                <button className='btn' onClick={()=>{setRoomCode(generateRandomCode())}}>Generate Code</button>
                {roomcode && <div className='code'><h2 style={{ textAlign: 'center' }}>{roomcode}</h2><i class="ri-clipboard-fill" onClick={()=>{PasteCode(roomcode)}}></i></div>}
            </div>

        </div>
    )
}

export default Lobby