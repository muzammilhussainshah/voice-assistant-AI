import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
} from 'react-native';
import Voice from '@react-native-community/voice';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { apiCall } from '../api/openAI';
import Features from '../components/features';
import Tts from 'react-native-tts';


const App = () => {
  const [result, setResult] = useState('');
  const [recording, setRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [speaking, setSpeaking] = useState(false);
  const scrollViewRef = useRef();

  const speechStartHandler = e => {
    console.log('speech start event', e);
  };
  const speechEndHandler = e => {
    setRecording(false);
    console.log('speech stop event', e);
  };
  const speechResultsHandler = e => {
    console.log('speech event: ',e);
    const text = e.value[0];
    setResult(text);
    
  };

  const speechErrorHandler = e=>{
    console.log('speech error: ',e);
  }

  
  const startRecording = async () => {
    setRecording(true);
    Tts.stop(); 
    try {
      await Voice.start('en-GB'); // en-US

    } catch (error) {
      console.log('error', error);
    }
  };
  const stopRecording = async () => {
    
    try {
      await Voice.stop();
      setRecording(false);
      fetchResponse();
    } catch (error) {
      console.log('error', error);
    }
  };
  const clear = () => {
    Tts.stop();
    setSpeaking(false);
    setLoading(false);
    setMessages([]);
  };

  const fetchResponse = async ()=>{
    if(result.trim().length>0){
      setLoading(true);
      let newMessages = [...messages];
      newMessages.push({role: 'user', content: result.trim()});
      setMessages([...newMessages]);

      // scroll to the bottom of the view
      updateScrollView();

      // fetching response from chatGPT with our prompt and old messages
      apiCall(result.trim(), newMessages).then(res=>{
        console.log('got api data');
        setLoading(false);
        if(res.success){
          setMessages([...res.data]);
          setResult('');
          updateScrollView();

          // now play the response to user
          startTextToSpeach(res.data[res.data.length-1]);
          
        }else{
          Alert.alert('Error', res.msg);
        }
        
      })
    }
  }



  const updateScrollView = ()=>{
    setTimeout(()=>{
      scrollViewRef?.current?.scrollToEnd({ animated: true });
    },200)
  }

  const startTextToSpeach = message=>{
    if(!message.content.includes('https')){
      setSpeaking(true);
      // playing response with the voice id and voice speed
      Tts.speak(message.content, {
        iosVoiceId: 'com.apple.ttsbundle.Samantha-compact',
        rate: 0.5,
      });
    }
  }
  

  const stopSpeaking = ()=>{
    Tts.stop();
    setSpeaking(false);
  }

  useEffect(() => {

    // voice handler events
    Voice.onSpeechStart = speechStartHandler;
    Voice.onSpeechEnd = speechEndHandler;
    Voice.onSpeechResults = speechResultsHandler;
    Voice.onSpeechError = speechErrorHandler;
    
    // text to speech events
    Tts.setDefaultLanguage('en-IE');
    Tts.addEventListener('tts-start', event => console.log('start', event));
    Tts.addEventListener('tts-finish', event => {console.log('finish', event); setSpeaking(false)});
    Tts.addEventListener('tts-cancel', event => console.log('cancel', event));

    
    
    return () => {
      // destroy the voice instance after component unmounts
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);


  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.container}>
        {/* bot icon */}
        <View style={styles.botIconContainer}>
          <Image  
              source={require('../../assets/images/bot.png')}
              style={styles.botIcon}
          />
        </View>

        {/* features || message history */}
        {messages.length > 0 ? (
          <View style={styles.assistantContainer}>
            <Text style={styles.assistantTitle}>Assistant</Text>

            <View style={styles.messageHistoryContainer}>
              <ScrollView
                ref={scrollViewRef}
                bounces={false}
                contentContainerStyle={{ flexGrow: 1 }}
                showsVerticalScrollIndicator={false}
              >
                {messages.map((message, index) => {
                  if (message.role === 'assistant') {
                    if (message.content.includes('https')) {
                      // result is an ai image
                      return (
                        <View key={index} style={styles.chatBubble}>
                          <Image  
                            source={{ uri: message.content }}
                            style={{ flex: 1, height: wp(60), width: wp(60) }}
                            resizeMode="contain"
                          />
                        </View>
                      );
                    } else {
                      // chat gpt response
                      return (
                        <View key={index} style={styles.chatBubble}>
                          <Text style={styles.chatBubbleText}>
                            {message.content}
                          </Text>
                        </View>
                      );
                    }
                  } else {
                    // user input text
                    return (
                      <View key={index} style={styles.userChatBubble}>
                        <Text style={styles.chatBubbleText}>
                          {message.content}
                        </Text>
                      </View>
                    );
                  }
                })}
              </ScrollView>
            </View>
          </View>
        ) : (
          <Features />
        )}

        {/* recording, clear and stop buttons */}
        <View style={styles.recordingContainer}>
          {loading ? (
            <Image 
              source={require('../../assets/images/loading.gif')}
              style={styles.loadingIcon}
            />
          ) : recording ? (
            <TouchableOpacity onPress={stopRecording} style={styles.recordingIcon}>
              {/* recording stop button */}
              <Image 
                source={require('../../assets/images/voiceLoading.gif')}
                style={styles.recordingIcon}
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={startRecording} style={styles.recordingIcon}>
              {/* recording start button */}
              <Image 
                source={require('../../assets/images/recordingIcon.png')}
                style={styles.recordingIcon}
              />
            </TouchableOpacity>
          )}

          {messages.length > 0 && (
            <TouchableOpacity onPress={clear} style={styles.clearButton}>
              <Text style={styles.buttonText}>Clear</Text>
            </TouchableOpacity>
          )}

          {speaking && (
            <TouchableOpacity onPress={stopSpeaking} style={styles.stopButton}>
              <Text style={styles.buttonText}>Stop</Text>
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  botIconContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  botIcon: {
    height: hp(15),
    width: hp(15),
  },
  assistantContainer: {
    flex: 1,
    flexDirection: 'column',
    // justifyContent: 'space-y',
  },
  assistantTitle: {
    color: 'gray',
    fontWeight: 'bold',
    marginLeft: wp(1),
    fontSize: wp(5),
  },
  messageHistoryContainer: {
    height: hp(58),
    backgroundColor: '#E5E7EB',
    borderRadius: hp(2),
    paddingHorizontal: hp(2),
    // paddingVertical: hp(1.5),
    // padding: hp(4),
  },
  chatBubble: {
    width: wp(70),
    backgroundColor: '#10B981',
    padding: hp(2),
    marginTop: hp(1),
    borderRadius: hp(2),
  },
  chatBubbleText: {
    color: '#1F2937',
    fontSize: wp(4),
  },
  userChatBubble: {
    alignSelf:'flex-end',
    width: wp(70),
    backgroundColor: 'white',
    padding: hp(2),
    borderRadius: hp(2),
    marginTop: hp(1),

  },
  recordingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordingIcon: {
    width: hp(10),
    height: hp(10),
    borderRadius: hp(5),
  },
  loadingIcon: {
    width: hp(10),
    height: hp(10),
  },
  clearButton: {
    backgroundColor: '#9CA3AF',
    borderRadius: hp(2),
    padding: hp(2),
    position: 'absolute',
    right: hp(2),
  },
  stopButton: {
    backgroundColor: '#EF4444',
    borderRadius: hp(2),
    padding: hp(2),
    position: 'absolute',
    left: hp(2),
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default App;