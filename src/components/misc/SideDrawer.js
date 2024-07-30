import { Avatar, Box, Button, Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay, Input, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Spinner, Text, Tooltip, useDisclosure, useToast } from '@chakra-ui/react';
import React, { useState } from 'react'
import { FaSearch, FaBell, FaChevronDown } from "react-icons/fa";
import { ChatState } from '../../Context/ChatProvider';
import ProfileModal from './ProfileModal';
import { useHistory } from 'react-router-dom';
import API from '../../api/API';
import ChatLoading from '../ChatLoading';
import UserListItem from '../UserAvatar/UserListItem';
import { getSender } from '../../utils/ChatLogics';
import NotificationBadge from 'react-notification-badge/lib/components/NotificationBadge';
import { Effect } from 'react-notification-badge';

const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const history = useHistory();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure()

  const {user, setSelectedChat, chats, setChats, notifications, setNotifications} = ChatState();

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    history.push("/");
  }

  const handleSearch = async () => {
    if(!search) {
      toast({
        title: "Please enter something to search",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: 'top-left'
      });
      return;
    }

    try {
      setLoading(true);

      const {data} = await API.get(`/user?search=${search}`);

      setLoading(false);
      setSearchResult(data);

    } catch (error) {
      toast({
        title: "Error occured",
        description: "Failed to load the search results" ,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: 'bottom-left'
      });
    }
  }

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);

      const {data} = await API.post("/chat", {userId});

      if(!chats?.find((c) => c.id === data._id)) {
        setChats([...chats, data]);
      }

      setSelectedChat(data)
      setLoadingChat(false);
      onClose();
    } catch (error) {
      toast({
        title: "Error fetching the chat",
        description: error?.message || "Something went wrong" ,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: 'bottom-left'
      });
    }
  }

  return (
    <>
    <Box display={'flex'} width={'100%'} bg={'white'} justifyContent={"space-between"} padding={'5px 10px 5px 10px'} alignItems={'center'}
    borderWidth={'5px'}
    >
      <Tooltip label='Search Users to Chat' hasArrow placement='bottom-end'>
        <Button variant="ghost" onClick={onOpen}>
          <FaSearch />
          <Text display={{base: 'none', md: 'flex'}} px={4}> 
            Search User
          </Text>
        </Button>
      </Tooltip>

      <Text fontSize={'2xl'} fontFamily={'Work Sans'}> Talk-A-Too </Text>
      <Box display={'flex'} alignItems={'center'}> 
        <Menu>
          <MenuButton p={1}>
            <NotificationBadge count={notifications.length} effect={Effect.SCALE}  />
            <FaBell fontSize={'1.5rem'} style={{margin: '16px'}} />
          </MenuButton>
          <MenuList pl={2}>
            {!notifications.length && "No New Messages"}
            {notifications.map((notif) => (
                <MenuItem
                  key={notif._id}
                  onClick={() => {
                    setSelectedChat(notif.chat);
                    setNotifications(notifications.filter((n) => n !== notif));
                  }}
                >
                  {notif.chat.isGroupChat
                    ? `New Message in ${notif.chat.chatName}`
                    : `New Message from ${getSender(user, notif.chat.users)}`}
                </MenuItem>
              ))}
          </MenuList>
        </Menu>
        <Menu>
          <MenuButton p={1} as={Button} rightIcon={<FaChevronDown />}>
            <Avatar size={'sm'} cursor='pointer' name={user.name} src={user.pic} />
          </MenuButton>
          <MenuList>
            <ProfileModal user={user}>
              <MenuItem> My Profile </MenuItem>
            </ProfileModal>
            
            <MenuDivider />
            <MenuItem onClick={logoutHandler}> Logout </MenuItem>
          </MenuList>
        </Menu>
      </Box>
    </Box>

    <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerHeader borderBottomWidth={"1px"}> Search Users </DrawerHeader>
        <DrawerBody>
        <Box display="flex" pb={2}>
          <Input
          placeholder='Search by name or email'
          mr={2}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          />
          <Button onClick={handleSearch}> Go </Button>
        </Box>

        {loading ? (
          <ChatLoading />
        ) : searchResult?.map((user) => (
          <UserListItem
            key={user._id}
            user={user}
            handleFunction={() => accessChat(user._id)}
          />
        ))}
        {loadingChat && (<Spinner display={"flex"} ml="auto" />)}
      </DrawerBody>
      </DrawerContent>
      
    </Drawer>

    </>
  )
}

export default SideDrawer