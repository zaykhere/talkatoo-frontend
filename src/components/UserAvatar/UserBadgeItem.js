import { Badge } from '@chakra-ui/react'
import React from 'react'
import { FaTimes } from "react-icons/fa";

const UserBadgeItem = ({user, handleFunction}) => {
  return (
    <Badge
    px={2}
    py={1}
    borderRadius="lg"
    m={1}
    mb={2}
    variant="solid"
    fontSize={12}
    colorScheme="purple"
    cursor="pointer"
    onClick={handleFunction}
    display={"flex"}
    alignItems={"center"}
  >
    {user.name}
    {/* {admin === user._id && <span> (Admin)</span>} */}
    <FaTimes style={{marginLeft: '5px'}} />
  </Badge>
  )
}

export default UserBadgeItem