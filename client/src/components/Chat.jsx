import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

import styles from './../styles/ChatFC.module.scss'
import icon from './../images/emoji.svg'
import EmojiPicker from 'emoji-picker-react'
import Messages from './Messages'

const socket = io.connect("http://localhost:5000");

const Chat = () => {
  const { search } = useLocation();
  const [params, setParams] = useState({name:'',room:''});
  const [state,setState] = useState([])
  const [message,setMessage] = useState('')
  const [isOpen,setIsOpen] = useState(false)
  const [roomUsers,setRoomUsers] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    const searchParams = Object.fromEntries(new URLSearchParams(search));
    setParams(searchParams);
    socket.emit("join", searchParams);
  }, [search]);
  
  useEffect(() => {
    socket.on('message', ({data})=>{
      setState((_state) => ([..._state,data]))
    })
  }, []);

  useEffect(() => {
    socket.on('room', ( {data: {users} } )=>{
      console.log(users)
      setRoomUsers(users.length)
    })
  },[]);

  const leftRoom = () =>{
    socket.emit('leftRoom',{params});
    navigate('/')
  }
  const onEmojiClick = ({emoji}) =>{setMessage(`${message}${emoji}`)}
  const handleChange = ({target:{value}}) => setMessage(value)
  
  const handleSubmit = (e) =>{ 
    e.preventDefault()
  
    if(!message) return ;
    
    socket.emit('sendMessage',{message, params})
    setMessage('')
  }

  console.log(roomUsers)

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <div className={styles.title}>{params.room}</div>
        <div className={styles.users}> {roomUsers} users in this room</div>
        <button className={styles.left} onClick={leftRoom}>
          Left the room
        </button>
      </div>
      <div className={styles.messages}>
        <Messages messages={state} name={params.name} />
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.input}>
          <input
            type="text"
            name="message"
            value={message}
            className={styles.input}
            onChange={handleChange}
            id=""
            autoComplete="off"
            placeholder="Write your message"
            required
          />
        </div>

        <div className={styles.emoji}>
          <img onClick={() =>setIsOpen(!isOpen)} src={icon} alt="emoji" />

          { isOpen && 
            <div className={styles.emojies}>
              <EmojiPicker onEmojiClick={onEmojiClick}/>
            </div>
          }
        </div>
        <div className={styles.button}>
          <input type="submit" onSubmit={handleSubmit} value="Send a message" />
        </div>
      </form>
    </div>
  );
};

export default Chat;
