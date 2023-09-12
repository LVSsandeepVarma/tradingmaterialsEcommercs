import React from "react"
import config from './config.js';
import MessageParser from './messageParser.js';
import ActionProvider from './actionProvide.js';
import Chatbot from 'react-chatbot-kit';
import 'react-chatbot-kit/build/main.css';


export default function ChatForm(){
  return (
    <div>
      <Chatbot
        config={config}
        messageParser={MessageParser}
        actionProvider={ActionProvider}
      />
    </div>
  );
}