import React, { useState, useRef, useEffect } from 'react';
import { Alert } from 'react-native';
import styled from 'styled-components/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Image, Input, Button } from '../components';
import { validateEmail, removeWhitespace } from '../utils/common';
import { images } from '../utils/images';
import { signup } from '../utils/firebase';

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.background};
  padding: 40px 20px;
`;

const ErrorText = styled.Text`
  align-items: flex-start;
  width: 100%;
  height: 20px;
  margin-bottom: 10px;
  line-height: 20px;
  color: ${({ theme }) => theme.errorText};
`;

const Signup = ({ navigation }) => {
  const [photoUrl, setPhotoUrl] = useState(images.photo);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [disabled, setDisabled] = useState(true);

  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const passwordConfirmRef = useRef(null);
  const didMountRef = useRef();

useEffect(() => {
  if (didMountRef.current) {
    let _errorMessage = '';

    if (!name) {
      _errorMessage = 'Please enter your name.';
    } else if (!validateEmail(email)) {
      _errorMessage = 'Please verify your email.';
    } else if (password.length < 6) {
      _errorMessage = 'The password must contain 6 characters at least.';
    } else if (password !== passwordConfirm) {
      _errorMessage = 'Passwords need to match.';
    } else {
      _errorMessage = '';
    }

    setErrorMessage(_errorMessage);
  } else {
    didMountRef.current = true;
  }
}, [name, email, password, passwordConfirm]);
  useEffect(() => {
    setDisabled(!(name && email && password && passwordConfirm && !errorMessage));
  }, [name, email, password, passwordConfirm, errorMessage]);

  const _handleSignupButtonPress = async () => {
    try {
      if (disabled) return;

      const trimmedName = name.trim();
      const trimmedEmail = removeWhitespace(email);
      const trimmedPassword = removeWhitespace(password);

      if (!trimmedName) {
        Alert.alert('Signup Error', 'Please enter your name.');
        return;
      }
      if (!validateEmail(trimmedEmail)) {
        Alert.alert('Signup Error', 'Please verify your email.');
        return;
      }
      if (trimmedPassword.length < 6) {
        Alert.alert('Signup Error', 'The password must contain 6 characters at least.');
        return;
      }
      if (trimmedPassword !== removeWhitespace(passwordConfirm)) {
        Alert.alert('Signup Error', 'Passwords need to match.');
        return;
      }

      const user = await signup({
        email: trimmedEmail,
        password: trimmedPassword,
        name: trimmedName,
        photoUrl,
      });

      Alert.alert('Signup Success', user?.email ?? trimmedEmail);
      navigation.navigate('Login');
    } catch (e) {
      Alert.alert('Signup Error', e?.message ?? 'Unknown error');
    }
  };

  return (
    <KeyboardAwareScrollView 
      contentContainerStyle={{ flex: 1 }}
      extraScrollHeight={20}
    >
      <Container>
        <Image
        rounded 
        url={photoUrl} 
        showButton
        onChangeImage = {url => setPhotoUrl(url)}
        />

        <Input
          label="Name"
          value={name}
          onChangeText={text => setName(text)}
          onSubmitEditing={() => {
            setName(name.trim());
            emailRef.current?.focus();
          }}
          onBlur={() => setName(name.trim())}
          placeholder="Name"
          returnKeyType="next"
        />

        <Input
          ref={emailRef}
          label="Email"
          value={email}
          onChangeText={text => setEmail(removeWhitespace(text))}
          onSubmitEditing={() => passwordRef.current?.focus()}
          placeholder="Email"
          returnKeyType="next"
        />

        <Input
          ref={passwordRef}
          label="Password"
          value={password}
          onChangeText={text => setPassword(removeWhitespace(text))}
          onSubmitEditing={() => passwordConfirmRef.current?.focus()}
          placeholder="Password"
          returnKeyType="done"
          isPassword
        />

        <Input
          ref={passwordConfirmRef}
          label="Password Confirm"
          value={passwordConfirm}
          onChangeText={text => setPasswordConfirm(removeWhitespace(text))}
          onSubmitEditing={_handleSignupButtonPress}
          placeholder="Password"
          returnKeyType="done"
          isPassword
        />

        <ErrorText>{errorMessage}</ErrorText>

        <Button
          title="Signup"
          onPress={_handleSignupButtonPress}
          disabled={disabled}
        />
      </Container>
    </KeyboardAwareScrollView>
  );
};

export default Signup;