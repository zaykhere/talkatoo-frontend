import { VStack, Input, FormControl, FormLabel, InputRightElement, Button, InputGroup, useToast, FormErrorMessage } from '@chakra-ui/react'
import React, { useState } from 'react'
import axios from "axios"
import { useForm } from "react-hook-form";
import API from '../../api/API';
import { useHistory } from 'react-router-dom';

function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pic, setPic] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const history = useHistory();

  const { register, handleSubmit, formState: { errors } } = useForm();

  console.log(errors);

  const onSubmit = data => console.log(data);

  function postDetails(pic) {
    if(!pic) {
      toast({
        title: "Please choose an image",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: 'top-right'
      })

      return;
    }
    if(pic.type === "image/jpeg" || pic.type === "image/png")
      setPic(pic);
  }

  async function submitHandler(data) {
    const {name, email, password} = data;
    if(!name || !email || !password) {
      return;
    }

    const formData = new FormData();
    
    pic && formData.append("pic", pic);
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password)
    try {
      setLoading(true);
      const {response} = await API.post("/user/register", formData);
      localStorage.setItem("userInfo", JSON.stringify(response));

      toast({
        title: "Registration Successful!",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: 'top'
      });

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
    finally{
      setLoading(false);
    }
    
  }

  return (
    <VStack spacing='5px' color='black'>
      <form onSubmit={handleSubmit(submitHandler)} style={{width: "100%"}}>
      <FormControl id='first-name' isRequired isInvalid={errors?.name?.message}>
        <FormLabel>Name</FormLabel>
        <Input
        {...register("name", { required: 'Please enter name', maxLength: 120 })}
        placeholder='Enter your Name'
        onChange={(e) => setName(e.target.value)} />
        <FormErrorMessage>
              {errors.name && errors.name.message}
            </FormErrorMessage>
      </FormControl>
      <FormControl id='email' isRequired isInvalid={errors?.email?.message}>
        <FormLabel>Email</FormLabel>
        <Input 
        {...register("email", { required: 'Please enter email', pattern: {
          value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
          message: 'Invalid email address'
        } })}
        type="email" placeholder='Enter your Email'
        onChange={(e) => setEmail(e.target.value)} />
        <FormErrorMessage>
              {errors.email && errors.email.message}
            </FormErrorMessage>
      </FormControl>
      <FormControl id='password' isRequired isInvalid={errors?.password?.message}>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input {...register("password", { required: 'Please enter password', maxLength: {
            value: 32,
            message: "Maximum value of password should be 32 characters long.",
          }, minLength: {
            value: 6,
            message: "Minimum value of password should be 6 characters long.",
          } })} type={showPassword ? 'text' : 'password'} placeholder='Enter your Password'
            onChange={(e) => setPassword(e.target.value)} />
          <InputRightElement width={'4.5rem'}>
            <Button h="1.75rem" size="sm" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
          <br />
         
        </InputGroup>
        <FormErrorMessage>
              {errors.password && errors.password.message}
            </FormErrorMessage>
      </FormControl>
      <FormControl id='confirm-password' isRequired isInvalid={errors?.confirmPassword?.message}>
        <FormLabel>Confirm Password</FormLabel>
        <Input
         {...register("confirmPassword", { required: 'Please confirm password', maxLength: {
          value: 32,
          message: "Maximum value of password should be 32 characters long.",
        }, minLength: {
          value: 6,
          message: "Minimum value of password should be 6 characters long.",
        }})}
         type='password' placeholder='Confirm your password'
        onChange={(e) => setConfirmPassword(e.target.value)} />
        {/* <p> {errors.confirmPassword.message} </p> */}
        <FormErrorMessage>
              {errors.confirmPassword && errors.confirmPassword.message}
            </FormErrorMessage>
      </FormControl>

      <FormControl id="pic">
        <FormLabel>Upload your Picture</FormLabel>
        <Input type="file" p={1.5} accept="image/*" onChange={(e) => {postDetails(e.target.files[0])}} />
      </FormControl>

      <Button disabled={loading} colorScheme='blue' width="100%" style={{marginTop: 15}} type='submit'
      onClick={submitHandler}>
        Sign Up
      </Button>
      </form>
    </VStack>
  )
}

export default Signup