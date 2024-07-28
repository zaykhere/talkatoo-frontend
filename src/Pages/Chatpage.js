import axios from 'axios'
import React, { useEffect, useState } from 'react'
import API from '../api/API';
import { ChatState } from '../Context/ChatProvider';
import { Box } from '@chakra-ui/react';
import SideDrawer from '../components/misc/SideDrawer';
import MyChats from '../components/misc/MyChats';
import ChatBox from '../components/misc/ChatBox';

function Chatpage() {
  const {user} = ChatState();
  const [fetchAgain, setFetchAgain] = useState(false);

  return (
    <div style={{width: '100%'}}>
      {user && <SideDrawer />}
      <Box display={'flex'} width={'100%'} height={"92vh"} justifyContent={"space-between"} padding={'10px'}>
        {user && <MyChats fetchAgain={fetchAgain} />}
        {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
      </Box>
    </div>
  )
}

export default Chatpage