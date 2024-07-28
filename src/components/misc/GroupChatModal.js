import { Box, Button, FormControl, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import { ChatState } from '../../Context/ChatProvider';
import API from "../../api/API";
import UserListItem from "../UserAvatar/UserListItem";
import UserBadgeItem from '../UserAvatar/UserBadgeItem';

const GroupChatModal = ({children}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [groupChatName, setGroupChatName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const toast = useToast();

  const {user, chats, setChats} = ChatState();

  const handleSearch = async (query) => {
    if(!query) return;
    setSearch(query);

    try {
      setLoading(true);

      const {data} = await API.get(`/user?search=${query}`);
      setLoading(false);
      setSearchResult(data);

    } catch (error) {
      toast({
        title: "Error occured",
        description: error?.message || "Something went wrong",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: 'bottom-left'
      });
    }
  }

  const handleSubmit = async () => {
    if(!groupChatName || selectedUsers.length <=0) {
      toast({
        title: "Please fill all the fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: 'top'
      });
      return;
    }
    try {
      const {data} = await API.post("/chat/group", {
        name: groupChatName,
        users: JSON.stringify(selectedUsers.map((u) => u._id))
      });

      setChats([data, ...chats]);
      onClose();

      toast({
        title: "New Group Chat created",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: 'bottom'
      });

    } catch (error) {
      toast({
        title: "Failed to create the chat",
        description: error?.message || "Something went wrong",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: 'bottom'
      });
    }
  }

  const handleGroup = (userToAdd) => {
    if(selectedUsers.includes(userToAdd)) {
      toast({
        title: "User already added",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: 'top'
      });
      return;
    }
    setSelectedUsers([...selectedUsers, userToAdd]);
  }

  const handleDelete = (userToDelete) => {
    setSelectedUsers(selectedUsers.filter(sel => sel._id !== userToDelete._id));
  }

  return (
    <>
    <span onClick={onOpen}>{children}</span>

    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
      <ModalHeader
            fontSize="35px"
            fontFamily="Work sans"
            display="flex"
            justifyContent="center"
          >Create Group Chat</ModalHeader>
        <ModalCloseButton />
        <ModalBody display="flex" flexDir="column" alignItems="center">
        <FormControl>
              <Input
                placeholder="Chat Name"
                mb={3}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add Users eg: John, Piyush, Jane"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            
            <Box w="100%" display={"flex"} flexWrap={"wrap"}>
              {selectedUsers?.map((u) => (
                <UserBadgeItem key={user._id} user={u} handleFunction={() => handleDelete(u)} />
              ))}
            </Box>
            {loading ? (
              <div>
                <Spinner />
              </div>
            ): (
              searchResult?.slice(0,4).map((user) => (
                <UserListItem key={user._id} user={user} handleFunction={() => handleGroup(user)} />
              ))
            )}

        </ModalBody>

        <ModalFooter>
          <Button colorScheme='blue' onClick={handleSubmit}>
            Create Chat
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  </>
  )
}

export default GroupChatModal