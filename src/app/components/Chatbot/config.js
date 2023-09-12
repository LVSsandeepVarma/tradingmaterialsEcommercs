import { createChatBotMessage } from "react-chatbot-kit";

const config = {
  botName: "FormBot",
  initialMessages: [
    createChatBotMessage("Hello! Please enter your email address."),
  ],
  customStyles: {
    botMessageBox: {
      backgroundColor: "#0084FF",
    },
    chatButton: {
      backgroundColor: "#0084FF",
    },
  },
  widgets: [],
};

export default config;
