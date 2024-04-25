import React from 'react';
import {Link} from 'react-router-dom';






function HomePage() {
    return (
        <div className='Home-div'>
            <h1>Welcome To NexaChat</h1>
            <hr />
            <h3>This is The Place Where Conversations Come Alive</h3>
            <div className="info">
                <h3>your gateway to seamless video calls. Whether it’s catching up with loved ones or collaborating with colleagues,    NexaChat bridges the gap, one pixel at a time. Dive into meaningful conversations—anytime, anywhere. Let’s connect! 🚀👋
                </h3>
            </div>
            <div className="instructions">
                <h2>How to Experience NexaChat ?</h2>
                <div className='inner'>
                    <i className="ri-check-double-fill" /><h3>Hosting a new meet ? Generate A unique Code for Each meetings & Paste it </h3>
                    <i className="ri-check-double-fill" /><h3>If u already have a code then just paste it , Join & enjoy</h3>
                    <i className="ri-check-double-fill" /><h3><b>if You Created meet </b>: After Joining wait for 2nd person to join , when u see someone joined call Press the call button on bottom left wait until u see a blank rectangle , if ur getting a blank rectangle then press green call button on right bottom </h3>
                    <i className="ri-check-double-fill" /><h3><b>if You are joining by code </b>: After Joining wait for 2nd person to Connect call , press green button on right bottom side when it is visible </h3>
                </div>
            </div>
            <button className='button'><Link to='/lobby' className='l'>
                <span className="box">
                    Next 
                </span>
                </Link>
            </button>
        </div>
    )
}

export default HomePage