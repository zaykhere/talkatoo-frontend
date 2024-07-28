import { VStack, Input, FormControl, FormLabel, InputRightElement, Button, InputGroup, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import API from '../../api/API';
import { useHistory } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  async function submitHandler(e) {
    e.preventDefault();

    if(!password || !email) {
      toast({
        title: "Please enter all the fields",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: 'top'
      })
    }

    else {
      try {
        setLoading(true);
        const response = await API.post("/user/login", {
          email,
          password
        });
        localStorage.setItem("userInfo", JSON.stringify(response.data));

      toast({
        title: "Login Successful!",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: 'top'
      })

      history.push("/chat");

      } catch (error) {
        toast({
          title: error.message,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: 'top'
        })
      }
      finally {
        setLoading(false);
      }

    }
  }

  return (
    <VStack spacing='5px' color='black'>

      <FormControl id='email' isRequired>
        <FormLabel>Email</FormLabel>
        <Input placeholder='Enter your Email'
          value={email}
          onChange={(e) => setEmail(e.target.value)} />
      </FormControl>
      <FormControl id='password' isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input type={showPassword ? 'text' : 'password'} value={password} placeholder='Enter your Password'
            onChange={(e) => setPassword(e.target.value)} />
          <InputRightElement width={'4.5rem'}>
            <Button h="1.75rem" size="sm" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>

      </FormControl>




      <Button disabled={loading} colorScheme='blue' width="100%" style={{ marginTop: 15 }} type='submit'
        onClick={submitHandler}>
        Login
      </Button>

      <Button style={{ marginTop: 10 }} variant="solid" colorScheme='red' width="100%"
      onClick={(e) => {
        setEmail("guest@example.com")
        setPassword("123456")
      }}>
        Login as Guest User
      </Button>

    </VStack>
  )
}

export default Login