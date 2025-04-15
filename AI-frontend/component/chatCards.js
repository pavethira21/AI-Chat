
import React, { useState } from 'react';
import { SafeAreaView, View, Text, FlatList, TextInput, TouchableOpacity, Image, ActivityIndicator, KeyboardAvoidingView, Platform,}from'react-native';
import { Ionicons } from '@expo/vector-icons';

const ChatCards = ({route}) => {
  const IP_Address = '192.168.1.17'; 
  const excercise = route?.params?.item
  console.log(excercise)
  const [message, setMessage] = useState('');
  const [convos, setConvos] = useState([
    {
      role: 'system',
      content:excercise.prompt,
    },
  ]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const updatedConvos = [
      ...convos,
      { role: 'user', content: message.trim() },
    ];

    setConvos(updatedConvos);
    setMessage('');
    setLoading(true);

    try {
      const res = await fetch(`http://${IP_Address}:5000/conversations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentId: '1',
          type: 'text',
          convos: updatedConvos,
          PhoneNumber: '8939221348',
        }),
      });

      const data = await res.json();

      setConvos((prev) => [
        ...prev,
        { role: 'assistant', content: data.message },
      ]);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  function renderMessage ({ item }) {
    if (item.role === 'system') return null;

    const isUser = item.role === 'user';
    return (
      <View
        style={{flexDirection: isUser ? 'row-reverse' : 'row',marginVertical: 5, alignItems: 'flex-end',
        }}
      >
        {!isUser && (
          <Image
            source={require('../assets/character.png')}style={{ height: 35, width: 35,borderRadius: 20,marginRight: 10,}}
          />
        )}

        <View
          style={{ backgroundColor: isUser ? '#A357EF' : '#3B3E45', padding: 10,borderRadius: 15,maxWidth: '75%',
          }}
        >
          <Text style={{ color: '#fff' }}>{item.content}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#121526' }}>
      <FlatList data={convos.slice(1)} keyExtractor={(_, index) => index.toString()}renderItem={renderMessage}contentContainerStyle={{ padding: 16 }}
      />

      {loading && (
        <ActivityIndicator size="large" color="#A357EF" style={{ marginBottom: 10 }} />
      )}

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{flexDirection: 'row',padding: 10,alignItems: 'center',backgroundColor: '#1c1f2e',
        }}
      >
        <TextInput
          style={{
            flex: 1,
            backgroundColor: '#fff',
            borderRadius: 20,
            paddingHorizontal: 15,
            paddingVertical: 10,
            fontSize: 16,
          }}
          placeholder="Type a message..."
          value={message}
          onChangeText={setMessage}
          multiline
        />
        <TouchableOpacity
          onPress={sendMessage}
          style={{
            marginLeft: 10,
            backgroundColor: '#9400D3',
            borderRadius: 25,
            padding: 12,
          }}
        >
          <Ionicons name="send" size={20} color="#fff" />
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatCards