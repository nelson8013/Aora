import { View, Text, ScrollView, TouchableOpacity, Image, Alert } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import FormField from '../../components/FormField'
import CustomButton from '../../components/CustomButton'
import { Video, ResizeMode } from 'expo-av'
import { icons } from '../../constants'
import { router } from 'expo-router'
import { createVideo } from '../../lib/appwrite'
import {useGlobalContext } from '../../context/GlobalProvider'
import * as ImagePicker from 'expo-image-picker'

const Create = () => {
  const { user} = useGlobalContext()
  const [uploading, setUploading] = useState(false)
  const [form, setForm] = useState({
    title: '',
    video: null,
    thumbnail: null,
    prompt: ''
  })

  const openPicker = async (selectType) => {
   let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: selectType === 'image' ? ImagePicker.MediaTypeOptions.Images : ImagePicker.MediaTypeOptions.Videos,
      aspect: [4,3],
      quality: 1
   })

    if(!result.canceled){
      if(selectType === 'image'){
        setForm({...form, thumbnail: result.assets[0]})
      }

      if(selectType === 'video'){
        setForm({...form, video: result.assets[0]})
      }
    }
  }

  /* The create video isn't working */
  const submit = async () => {
    // if(  form.title || form.video || form.thumbnail ||form.prompt){
    //   Alert.alert('All fields are required')
    //   return
    // }

    setUploading(true)

    try {
        const newVideo = await createVideo({...form, userId: user.$id})


        Alert.alert('Success', 'Video created successfully')

        router.push('/')
    } catch (error) {
      Alert.alert('Error', error.message)
    }finally{
      setForm({
        title: '',
        video: null,
        thumbnail: null,
        prompt: ''
      })

      setUploading(false);
    }
  }

  return (
   <SafeAreaView className="bg-primary h-full">
      <ScrollView className="px-4 my-6">
        <Text className="text-2xl text-white font-psemibold">Upload Video</Text>

        <FormField 
          title="Video Tile"
          value={form.title}
          placeholder="Give your video a catch title..."
          handleChangeText={(event) => setForm({...form, title: event})}
          otherStyles="mt-10"
        />
        <View className="mt-7 space-y-2">
          <Text className="text-base text-gray-100 font-pmedium">Upload Video</Text>
          <TouchableOpacity onPress={() => openPicker('video')}>
            {form.video ? (
              <Video 
                  resizeMode={ResizeMode.COVER} 
                  className="w-full h-64 rounded-2xl" 
                  source={{uri: form.video.uri}}
              />
            ) : (
              <View className="w-full h-40 px-4 bg-black-100 rounded-2xl justify-center items-center">
                <View className="w-14 h-14 border border-dashed border-secondary justify-center items-center">
                  <Image className="w-1/2 h-1/2" source={icons.upload} resizeMode='contain'/>
                </View>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <View className="mt-7 space-y-2">
          <Text className="text-base text-gray-100 font-pmedium">Thumbnail Image</Text>

          <TouchableOpacity onPress={() => openPicker('image')}>
          {form.thumbnail ? (
            <Image 
                resizeMode='cover'
                className="w-full h-64 rounded-2xl" 
                source={{uri: form.thumbnail.uri}}
            />
          ) : (
            <View 
                className="w-full h-16 px-4 bg-black-100 rounded-2xl justify-center items-center border-2 border-black-200 flex-row space-x-2">
              <Image className="w-5 h-5" source={icons.upload} resizeMode='contain'/>
              <Text className="text-gray-100 text-sm font-pmedium">Choose a file</Text>
            </View>
          )}
        </TouchableOpacity>
        </View>

        <FormField 
          title="AI Prompt"
          value={form.prompt}
          placeholder="The prompt you used to create this video"
          handleChangeText={(event) => setForm({...form, prompt: event})}
          otherStyles="mt-5"
       />

       <CustomButton 
          title="Submit & Publish"
          handlePress={submit}
          containerStyles="mt-7" 
          isLoading={uploading}
       />
      </ScrollView>
   </SafeAreaView>
  )
}

export default Create