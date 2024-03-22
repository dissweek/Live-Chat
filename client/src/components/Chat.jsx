import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
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
  
  console.log(params)
  console.log(state)

  const onEmojiClick = ({emoji}) =>{setMessage(`${message}${emoji}`)}

  const handleChange = ({target:{value}}) => setMessage(value)
  const handleSubmit = () =>{
    

  }

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <div className={styles.title}>{params.room}</div>
        <div className={styles.users}> 4 users in this room</div>
        <button className={styles.left} onClick={() => {}}>
          Left the room
        </button>
      </div>
      <div className={styles.messages}>
        <Messages messages={state} name={params.name} />
      </div>

      <form className={styles.form}>
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
