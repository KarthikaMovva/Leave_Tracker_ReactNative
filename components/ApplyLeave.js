import React, { useState, useEffect } from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Pressable,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LeaveForm() {
  const [name, setName] = useState('');
  const [leaveType, setLeaveType] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [reason, setReason] = useState('');
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const handleSubmit = async () => {
    // Basic validations
    if (!name.trim()) {
      Alert.alert('Validation Error', 'Please enter your name.');
      return;
    }

    if (!leaveType) {
      Alert.alert('Validation Error', 'Please select a leave type.');
      return;
    }

    if (!startDate) {
      Alert.alert('Validation Error', 'Please select a start date.');
      return;
    }

    if (!endDate) {
      Alert.alert('Validation Error', 'Please select an end date.');
      return;
    }

    if (endDate < startDate) {
      Alert.alert('Validation Error', 'End date cannot be earlier than start date.');
      return;
    }

    if (!reason.trim()) {
      Alert.alert('Validation Error', 'Please enter the reason for leave.');
      return;
    }

    const leaveData = {
      name,
      leaveType,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      reason,
    };

    try {
      const data = await AsyncStorage.getItem('leaveApplications');
      const existingData = data ? JSON.parse(data) : [];

      existingData.push(leaveData);

      await AsyncStorage.setItem('leaveApplications', JSON.stringify(existingData));

      Alert.alert('Success', 'Leave application submitted successfully!');
      setName('');
      setLeaveType('');
      setStartDate(null);
      setEndDate(null);
      setReason('');

      checkStorage();
    } catch (error) {
      console.error('Error saving data:', error);
      Alert.alert('Error', 'Something went wrong while saving your data.');
    }
  };

  const checkStorage = async () => {
    try {
      const data = await AsyncStorage.getItem('leaveApplications');
      const parsed = data ? JSON.parse(data) : [];
      console.log('📦 Stored Leave Applications:', parsed);
    } catch (error) {
      console.error('Error reading AsyncStorage:', error);
    }
  };

  return (
    <LinearGradient colors={['#7dd3fc', '#bae6fd', '#fff']} className="flex-1">
      <ScrollView className="p-4">
        <Text className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Leave Application Form
        </Text>

        <Text className="text-base mb-1 text-gray-700">Employee Name</Text>
        <TextInput
          className="border border-gray-300 rounded-md p-2 mb-4 bg-white"
          placeholder="Enter your name"
          value={name}
          onChangeText={setName}
        />

        <Text className="text-base mb-1 text-gray-700">Leave Type</Text>
        <Picker
          selectedValue={leaveType}
          onValueChange={(itemValue) => setLeaveType(itemValue)}
          style={{ backgroundColor: 'white', borderRadius: 8, marginBottom: 16 }}
        >
          <Picker.Item label="Select leave type" value="" />
          <Picker.Item label="Sick Leave" value="Sick" />
          <Picker.Item label="Casual Leave" value="Casual" />
          <Picker.Item label="Earned Leave" value="Earned" />
        </Picker>

        <Text className="text-base mb-1 text-gray-700">Start Date</Text>
        <Pressable
          onPress={() => setShowStartPicker(true)}
          className="p-2 border border-gray-300 rounded-md bg-white mb-4"
        >
          <Text>{startDate ? startDate.toDateString() : 'Select start date'}</Text>
        </Pressable>
        {showStartPicker && (
          <DateTimePicker
            value={startDate || new Date()}
            mode="date"
            display="default"
            minimumDate={new Date()}
            onChange={(event, date) => {
              setShowStartPicker(false);
              if (date) setStartDate(date);
            }}
          />
        )}

        <Text className="text-base mb-1 text-gray-700">End Date</Text>
        <Pressable
          onPress={() => setShowEndPicker(true)}
          className="p-2 border border-gray-300 rounded-md bg-white mb-4"
        >
          <Text>{endDate ? endDate.toDateString() : 'Select end date'}</Text>
        </Pressable>
        {showEndPicker && (
          <DateTimePicker
            value={endDate || new Date()}
            mode="date"
            display="default"
            minimumDate={startDate || new Date()}
            onChange={(event, date) => {
              setShowEndPicker(false);
              if (date) setEndDate(date);
            }}
          />
        )}

        <Text className="text-base mb-1 text-gray-700">Reason</Text>
        <TextInput
          className="border border-gray-300 rounded-md p-2 mb-4 h-24 bg-white text-start"
          placeholder="Enter reason for leave"
          value={reason}
          onChangeText={setReason}
          multiline
        />

        <TouchableOpacity
          className="bg-blue-600 p-3 rounded-md mt-2"
          onPress={handleSubmit}
        >
          <Text className="text-white text-center font-semibold">Submit</Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
}
