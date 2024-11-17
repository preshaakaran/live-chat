import React, { useContext, useEffect, useState } from 'react';
import './myStyles.css';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import NightlightIcon from '@mui/icons-material/Nightlight';
import SearchIcon from '@mui/icons-material/Search';
import LightModeIcon from '@mui/icons-material/LightMode';
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../Features/themeSlice';
import { myContext } from './MainContainer';
import axios from 'axios';
import { ChatState } from '../context/chatProvider';

const Sidebar = () => {
  const navigate = useNavigate();
  const nav = useNavigate();
  const dispatch = useDispatch();
  const lightTheme = useSelector(state => state.themeKey);

  const { refresh, setRefresh, triggerRefresh } = useContext(myContext);
  const [users, setUsers] = useState([]);
  const [conversations, setConversations] = useState([]);
  const userData = JSON.parse(localStorage.getItem("userData"));

  const { selectedChat, setSelectedChat, chats, setChats } = ChatState();

  if (!userData) {
    console.log("User not Authenticated");
    nav("/");
  }

  const user = userData.data;

  useEffect(() => {
    console.log("Sidebar : ", user);

    const fetchConversations = () => {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        params: {
          senderId: user._id,
        }
      };

      const configs = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      try {
        axios.get("http://localhost:5000/chat/", config).then((response) => {
          setConversations(response.data);
          setChats(response.data);
        });
      } catch (error) {
        console.log("Error in fetching Conversations : ", error);
      }

      axios.get("http://localhost:5000/user/fetchUsers", configs).then((data) => {
        setUsers(data.data);
      });
    };
    fetchConversations();
  }, [user.token, user._id, refresh]);

  return (
    <div className='sidebar'>
      <div className={'sb-header' + (lightTheme ? "" : " dark")}>
        <div className='other-icons'>
          <div className=''>
            <IconButton onClick={() => { nav("/app/welcome"); }}>
              <AccountCircleIcon className={"icon" + (lightTheme ? "" : " dark")} />
            </IconButton>
          </div>

          <div>
            <IconButton onClick={() => { navigate("/app/users") }}>
              <PersonAddIcon className={"icon" + (lightTheme ? "" : " dark")} />
            </IconButton>

            <IconButton onClick={() => dispatch(toggleTheme())}>
              {lightTheme && <NightlightIcon className={"icon" + (lightTheme ? "" : " dark")} />}
              {!lightTheme && <LightModeIcon className={"icon" + (lightTheme ? "" : " dark")} />}
            </IconButton>

            <IconButton onClick={() => {
              localStorage.removeItem("userData");
              navigate("/");
            }}>
              <ExitToAppIcon className={"icon" + (lightTheme ? "" : " dark")} />
            </IconButton>
          </div>
        </div>
      </div>

      <div className={"sb-conversations" + (lightTheme ? "" : " dark")}>
        {console.log("Conversations : ", conversations)}
        {console.log("Users : ", users)}

        {conversations.map((conversation, index) => {

          const participantNames = conversation.participantIds
            .filter(participantId => participantId !== user._id)
            .map(participantId => {
              const user = users.find(user => user._id === participantId);
              return user ? user : null; 
            });

          if (participantNames.length === 0 || !participantNames[0]) {
            return null;
          }

          if (conversation.latestMessage === undefined || conversation.latestMessage) {
            return (
              <div key={index} className="conversation-container" onClick={() => {
                setSelectedChat(conversation);
                navigate(
                  "chat/" + participantNames[0]._id + "&" + participantNames[0].name
                );
              }}>
                <p className={"con-icon" + (lightTheme ? "" : " dark")}>
                  {participantNames[0] ? participantNames[0].name[0] : ''}
                </p>
                <p className={"con-title" + (lightTheme ? "" : " dark")}>
                  {participantNames[0] ? participantNames[0].name : ''}
                </p>
                <p className="con-lastMessage">
                  {participantNames[0] ? participantNames[0]._id : ''}
                </p>
              </div>
            );
          }

          return null; 
        })}
      </div>
    </div>
  );
};

export default Sidebar;
