import React from 'react';
import styled from 'styled-components/native';
import { Text, Button } from 'react-native';
import { Image } from '../components';
import {images} from '../utils/images';

const Container = styled.View`
    flex: 1;
    justify-content: center;
    align-items: center;
    background-color: ${({ theme }) => theme.background};
`;

const Login = ({ navigation }) => {
    return (
        <Container>
            <Image url={images.logo} imageStyle={{borderRadius: 8}}/>
            <Text style={{ fontSize: 30 }}>Login Screen</Text>
            <Button title="Signup" onPress={() => navigation.navigate('Signup')} />
        </Container>
    );
};

export default Login;