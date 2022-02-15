import React, { useContext, useState, useCallback, useEffect} from 'react';
import io from 'socket.io-client';
import useSound from 'use-sound';
import config from '../../../config';
import LatestMessagesContext from '../../../contexts/LatestMessages/LatestMessages';
import TypingMessage from './TypingMessage';
import Header from './Header';
import Footer from './Footer';
import Message from './Message';
import initialBottyMessage from '../../../common/constants/initialBottyMessage';
import '../styles/_messages.scss';

const connect_socket = io(
  config.BOT_SERVER_ENDPOINT,
  { transports: ['websocket', 'polling', 'flashsocket'] }
);

function Messages() {
  const [playSend] = useSound(config.SEND_AUDIO_URL);
  const [playReceive] = useSound(config.RECEIVE_AUDIO_URL);
  const [message, setMessage] = useState('');
  const [storage, setStorage] = useState([]);
  const [isTyping, setTyping] = useState(false);
  const [response, setResponse] = useState("");
  const [user] = useState("me");
  const [socket] = useState(connect_socket);
  
  const { messages, setLatestMessage } = useContext(LatestMessagesContext);
  
  useEffect(() => {
    socket.on("connect", () => {
      console.log('socket connect');
    });
  },[socket]);

  const onChangeMessage = (e) => {
    e.preventDefault();
    setMessage(e.target.value);
  };

  const sendMessage = useCallback(
    () => {
      setLatestMessage(user, message);
      setStorage((oldmessage) =>[...oldmessage, message]);
      playSend();
      socket.emit("user-message", message);
      socket.on("bot-typing", ()=>{
        setTyping(true);
      });
      socket.on("bot-message", (res) => {
        setTyping(false);
        playReceive();
        console.log(res);
        setResponse(res);
        setLatestMessage("bot", res);
      });
    },
    [message],
  );

  

  return (
    <div className="messages">
      <Header />
      <div className="messages__list" id="message-list">
        {
          <Message
            nextMessage={
              {
                "message": "How are you?",
                "user":"bot"
              }
            }
            message={
              {
                "message": initialBottyMessage,
                "id": 0,
                "user":"bot"
              }
            }
            botTyping={false}
          />
        }
        { 
          storage && storage.map( (text, index) => {
            if (text === message.me) {
              return(
                
                      <Message
                        nextMessage={
                          {
                            "message": messages.me,
                            "user":user
                          }
                        }
                        message={
                          {
                            "message": messages.bot, // context
                            "id": 2,
                            "user":"bot"
                          }
                        }
                        botTyping={isTyping}
                      />
                  
              )
            }else{
                return(
                  <Message
                    nextMessage={
                      {
                        "message": messages.bot,
                        "user":"bot"
                      }
                    }
                    message={
                      {
                        "message": text,
                        "id": index,
                        "user":user
                      }
                    }
                    botTyping={isTyping}
                  /> 
                )
              }
            }
          )
        }
        {
          (isTyping && <TypingMessage/>) || 
          (response && 
            <Message
              nextMessage={
                {
                  "message": messages.me,
                  "user":user
                }
              }
              message={
                {
                  "message": messages.bot, // context
                  "id": 2,
                  "user":"bot"
                }
              }
              botTyping={isTyping}
            />)

        }

      </div>
      <Footer message={message} sendMessage={sendMessage} onChangeMessage={(e)=>{onChangeMessage(e)}} />
    </div>
  );
}

export default Messages;

