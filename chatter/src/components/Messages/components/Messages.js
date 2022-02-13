import React, { useContext, useState, useCallback, useEffect} from 'react';
import io from 'socket.io-client';
import useSound from 'use-sound';
import config from '../../../config';
import LatestMessagesContext from '../../../contexts/LatestMessages/LatestMessages';
import TypingMessage from './TypingMessage';
import Header from './Header';
import Footer from './Footer';
import Message from './Message';
import '../styles/_messages.scss';

const socket = io(
  config.BOT_SERVER_ENDPOINT,
  { transports: ['websocket', 'polling', 'flashsocket'] }
);

function Messages() {
  const [playSend] = useSound(config.SEND_AUDIO_URL);
  const [playReceive] = useSound(config.RECEIVE_AUDIO_URL);
  const [message, setMessage] = useState('');
  const [storage, setStorage] = useState([]);
  const [response, setResponse] = useState("");

  const { setLatestMessage } = useContext(LatestMessagesContext);

  useEffect(() => {
    // algo
  });

  const onChangeMessage = (e) => {
    e.preventDefault();
    setMessage(e.target.value);
  };

  const sendMessage = useCallback(
    () => {
      setStorage((oldmessage) =>[...oldmessage, message]);
      console.log(storage);
      // socket.on("user-message", () => {
      //   socket.send(message);
      // });
      // socket.on("user-message", data => {
      //   setResponse(data);
      // });
      //console.log(response);
    },
    [message, storage],
  );

  

  return (
    <div className="messages">
      <Header />
      <div className="messages__list" id="message-list">
        { 
          storage && storage.map( (mess, index) => {
              return(
                <Message
                  nextMessage={":)"}
                  message={
                    {
                      "message":mess,
                      "id": index,
                      "user":"me"
                    }
                  }
                  botTyping={true}
                />
              )
            }
          )
        }
      </div>
      <Footer message={message} sendMessage={sendMessage} onChangeMessage={(e)=>{onChangeMessage(e)}} />
    </div>
  );
}

export default Messages;
