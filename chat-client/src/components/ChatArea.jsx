import React, { useContext, useEffect, useRef, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import MessageSelf from "./MessageSelf";
import MessageOthers from "./MessageOthers";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Skeleton from "@mui/material/Skeleton";
import axios from "axios";
import { myContext } from "./MainContainer";
import io from 'socket.io-client';
import { ChatState } from "../context/chatProvider";

const ENDPOINT = 'http://localhost:5000';

var socket, selectedChatCompare;

function ChatArea() {
  const lightTheme = useSelector((state) => state.themeKey);
  const [messageContent, setMessageContent] = useState("");
  const messagesEndRef = useRef(null);
  const dyParams = useParams();
  const [chat_id, chat_user] = dyParams._id.split("&");
  const userData = JSON.parse(localStorage.getItem("userData"));
  const [allMessages, setAllMessages] = useState([]);
  const { refresh, setRefresh } = useContext(myContext);
  const [loaded, setloaded] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState({});
  const [socketConnectionStatus, setSocketConnectionStatus] = useState(false);
  const [allMessagesCopy, setAllMessagesCopy] = useState([]);
  const { selectedChat, setSelectedChat, chats, setChats } = ChatState();
  const [status, setStatus] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", userData);
    socket.on('online users', (users) => {
      setOnlineUsers(users);
      console.log("Online Users : ", users);
    });
    socket.on('connected', () => {
      setSocketConnectionStatus(true);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const sendMessage = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userData.data.token}`,
        },
      };
      const { data } = await axios.post(
        "http://localhost:5000/message/",
        {
          sender: userData.data._id,
          content: messageContent,
          chatId: chat_id,
        },
        config
      );
      socket.emit('new message', data);
      setAllMessages((prevMessages) => [...prevMessages, data]);
      setMessageContent("");
      scrollToBottom();
    } catch (error) {
      console.error('Error sending message: ', error);
    }
  };

  useEffect(() => {
    socket.on("message received", (newMessage) => {
      if (selectedChatCompare && userData.data._id !== newMessage.sender._id) {
        setAllMessages((prevMessages) => [...prevMessages, newMessage]);
      }
      scrollToBottom();
      setRefresh(!refresh);
    });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [allMessages]);

  useEffect(() => {
    const config = {
      headers: {
        Authorization: `Bearer ${userData.data.token}`,
      },
    };
    axios
      .get(`http://localhost:5000/message/${chat_id}`, config)
      .then(({ data }) => {
        setAllMessages(data);
        setloaded(true);
        socket.emit('join chat', selectedChat._id);
      });

    setAllMessagesCopy(allMessages);
    selectedChatCompare = selectedChat;
  }, [chat_id, userData.data.token, refresh, selectedChat]);

  useEffect(() => {
    const onlineUserIds = Object.values(onlineUsers);
    if (onlineUserIds.includes(chat_id)) {
      setStatus(true);
    } else {
      setStatus(false);
    }
  }, [onlineUsers, chat_id]);

  if (!loaded) {
    return (
      <div
        style={{
          border: "20px",
          padding: "10px",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        <Skeleton
          variant="rectangular"
          sx={{ width: "100%", borderRadius: "10px" }}
          height={60}
        />
        <Skeleton
          variant="rectangular"
          sx={{
            width: "100%",
            borderRadius: "10px",
            flexGrow: "1",
          }}
        />
        <Skeleton
          variant="rectangular"
          sx={{ width: "100%", borderRadius: "10px" }}
          height={60}
        />
      </div>
    );
  } else {
    return (
      <div className={"chatArea-container" + (lightTheme ? "" : " dark")}>
        <div className={"chatArea-header" + (lightTheme ? "" : " dark")}>
          <p className={"con-icon" + (lightTheme ? "" : " dark")}>
            {chat_user[0]}
          </p>
          <div className={"header-text" + (lightTheme ? "" : " dark")}>
            <p className={"con-title" + (lightTheme ? "" : " dark")}>
              {chat_user}
              {status ? " (Online)" : " (Offline)"}
            </p>
          </div>
        </div>
        <div className={"messages-container" + (lightTheme ? "" : " dark")}>
          {allMessages
            .slice(0)
            .reverse()
            .map((message, index) => {
              const sender = message.sender;
              const self_id = userData.data._id;
              if (sender && sender._id === self_id) {
                return <MessageSelf props={message} key={index} />;
              } else {
                return <MessageOthers props={message} key={index} />;
              }
            })}
        </div>
        <div ref={messagesEndRef} className="BOTTOM" />
        <div className={"text-input-area" + (lightTheme ? "" : " dark")}>
          <input
            placeholder="Type a Message"
            className={"search-box" + (lightTheme ? "" : " dark")}
            value={messageContent}
            onChange={(e) => {
              setMessageContent(e.target.value);
            }}
            onKeyDown={(event) => {
              if (event.code === "Enter") {
                sendMessage();
                setMessageContent("");
                setRefresh(!refresh);
              }
            }}
          />
          <IconButton
            className={"icon" + (lightTheme ? "" : " dark")}
            onClick={() => {
              sendMessage();
              setRefresh(!refresh);
            }}
          >
            <SendIcon />
          </IconButton>
        </div>
      </div>
    );
  }
}

export default ChatArea;
