import React, { useState } from 'react';
import CustomInput from './input';

// eslint-disable-next-line react/prop-types
const ActionProvider = ({ createChatBotMessage, setState, children }) => {
  const [messages, setMessages] = useState([]);

  const handleEmailMessage = (userMessage) => {
    if (!isValidEmail(userMessage)) {
        console.log(userMessage, "bot")
      const emailBotMessage = createChatBotMessage(CustomInput());
      updateChatbotState(emailBotMessage);
    } else {
      const errorMessage = createChatBotMessage("Sorry, the entered email address is not valid. Please try again.");
      updateChatbotState(errorMessage);
    }
  };

  const handleMobileMessage = (userMessage) => {
    if (isValidMobile(userMessage)) {
      const mobileBotMessage = createChatBotMessage("Great! Now, please enter your Mobile number.");
      updateChatbotState(mobileBotMessage);
    } else {
      const errorMessage = createChatBotMessage("Sorry, the entered mobile number is not valid. Please try again.");
      updateChatbotState(errorMessage);
    }
  };

  const updateChatbotState = (message) => {
    setMessages([...messages, message]);
    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, message],
    }));
  };

  // Validate email function
  const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  // Validate mobile number function (example)
  const isValidMobile = (mobile) => {
    const regex = /^[0-9]{10}$/; // Change this regex based on your validation criteria
    return regex.test(mobile);
  };

  // Pass the handleEmailMessage and handleMobileMessage functions to child components
  const actions = {
    handleEmailMessage,
    handleMobileMessage,
  };

  return (
    <div>
      {React.Children.map(children, (child) => {
        return React.cloneElement(child, {
          actions,
        });
      })}
    </div>
  );
};

export default ActionProvider;
