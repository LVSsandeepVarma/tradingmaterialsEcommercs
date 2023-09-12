/* eslint-disable react/prop-types */
import React from 'react';

// eslint-disable-next-line no-unused-vars
const MessageParser = ({ children, actions }) => {
    const parse = (message) => {
        console.log(message, children, "bot")
      if (message) {
        actions.handleEmailMesssage()
      }else{
        actions.handleEmailMesssage()
      }
    };


  
    return (
      <div>
        {React.Children.map(children, (child) => {
          return React.cloneElement(child, {
            parse: parse,
            actions: {},
          });
        })}
      </div>
    );
  };

export default MessageParser;