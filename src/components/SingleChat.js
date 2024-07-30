import React, { useEffect, useState } from 'react'
import { ChatState } from '../Context/ChatProvider'
import { Box, FormControl, IconButton, Input, Spinner, Text, useToast } from '@chakra-ui/react';
import { IoMdArrowBack } from "react-icons/io";
import { getSender, getSenderFull } from '../utils/ChatLogics';
import ProfileModal from './misc/ProfileModal';
import UpdateGroupChatModal from './misc/UpdateGroupChatModal';
import API from '../api/API';
import ScrollableChat from './ScrollableChat';
import io from "socket.io-client";
import TypingIndicator from './misc/TypingIndicator';

const ENDPOINT = 'http://localhost:5000';
let socket, selectedChatCompare;

const SingleChat = ({fetchAgain, setFetchAgain}) => {
  const {user, selectedChat, setSelectedChat, notifications, setNotifications} = ChatState();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState();
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const toast = useToast();

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);

    socket.on('connected', () => setSocketConnected(true));

    socket.on('typing', () => setIsTyping(true));
    socket.on('stop-typing', () => setIsTyping(false));
  }, [])

  const fetchMessages = async() => {
    if(!selectedChat) return;

    try {
      setLoading(true);
      const {data} = await API.get(`/message/${selectedChat?._id}`);
      setMessages(data);
      
      socket.emit('join-chat', selectedChat._id);

    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
    finally{
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMessages();

    selectedChatCompare = selectedChat;
  }, [selectedChat])

  useEffect(() => {
    socket.on("message-received", (newMessageReceived) => {
      if(!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chat._id) {
        if(!notifications.includes(newMessageReceived)) {
          setNotifications([newMessageReceived, ...notifications]);
          setFetchAgain(!fetchAgain);
        }
      }
      else {
        setMessages([...messages, newMessageReceived]);
      } 
    }) 
  })
  
  

  const sendMessage = async (e) => {
    if(e.key === "Enter" && newMessage) {
      socket.emit("stop-typing", selectedChat._id);
      try {
        setNewMessage("");

        const {data} = await API.post('/message', {
          content: newMessage,
          chatId: selectedChat?._id
        });

        socket.emit('new-message', data);
        setMessages([...messages, data]);


      } catch (error) {
        toast({
          title: "Error Occured!",
          description: "Failed to send the Message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  }
  

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    // typing indicator logic 
    if(!socketConnected) return;

    if(!typing) {
      setTyping(true);
      socket.emit('typing', selectedChat._id);
    }

    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop-typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  }

  return (
    <>
      {selectedChat ? (
        <>
            <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              display={{base: 'flex', md: "none"}}
              icon={<IoMdArrowBack />}
              onClick={() => setSelectedChat("")}
            />
            {!selectedChat?.isGroupChat ? (
              <>
                {getSender(user, selectedChat?.users)}
                <ProfileModal user={getSenderFull(user, selectedChat?.users)} />
              </>
            ): (
              <>
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupChatModal fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} fetchMessages={fetchMessages} />
              </>
            )}
          </Text>
          <Box  display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden">
            {loading ? (
              <Spinner 
              size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                overflowY: 'scroll',
                scrollbarWidth: 'none'
              }}>
                <ScrollableChat messages={messages} />

              </div>
            )}

            <FormControl onKeyDown={sendMessage}
              id="first-name"
              isRequired
              mt={3}>

                {isTyping ? (
                  <TypingIndicator />
                ): null}

                 <Input
                variant="filled"
                bg="#E0E0E0"
                placeholder="Enter a message.."
                value={newMessage}
                onChange={typingHandler}
              />
            </FormControl>

          </Box>
        </>
      ) : (
        <Box display={"flex"} alignItems={"center"} justifyContent={"center"} h="100%">
          <Text fontSize={"3xl"} pb={3} fontFamily={"Work sans"}>
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  )
}

export default SingleChat