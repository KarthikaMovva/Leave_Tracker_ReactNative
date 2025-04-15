import React, { useState } from 'react';
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

export default function LeaveForm({ navigation }) {
  const [name, setName] = useState('');
  const [leaveType, setLeaveType] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [reason, setReason] = useState('');
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSubmit = async () => {
    let valid = true;
    const newErrors = {};

    if (!name.trim()) {
      newErrors.name = 'Please enter your name.';
      valid = false;
    }

    if (!leaveType) {
      newErrors.leaveType = 'Please select a leave type.';
      valid = false;
    }

    if (!(startDate instanceof Date && !isNaN(startDate))) {
      newErrors.startDate = 'Invalid start date.';
      valid = false;
    }

    if (!(endDate instanceof Date && !isNaN(endDate))) {
      newErrors.endDate = 'Invalid end date.';
      valid = false;
    }

    if (startDate && endDate && endDate < startDate) {
      newErrors.endDate = 'End date cannot be earlier than start date.';
      valid = false;
    }

    if (!reason.trim()) {
      newErrors.reason = 'Please enter the reason for leave.';
      valid = false;
    }

    setErrors(newErrors);

    if (!valid) return;

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
      setErrors({});
      navigation.navigate('History');
    } catch (error) {
      console.error('Error saving data:', error);
      Alert.alert('Error', 'Something went wrong while saving your data.');
    }
  };

  return (
    <LinearGradient colors={['#f0f4f8', '#d9e2ec']} className="flex-1">
      <ScrollView className="p-4">
        <Text className="text-2xl font-bold text-gray-800 mb-6 text-center text-3xl">
          Leave Application Form
        </Text>

        {/* Name */}
        <Text className="text-base mb-1 text-gray-700 font-semibold text-xl">Employee Name</Text>
        <TextInput
          className={`border rounded-md p-2 mb-1 bg-white text-xl ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
          placeholder="Enter your name"
          value={name}
          onChangeText={(text) => {
            setName(text);
            if (errors.name) setErrors(prev => ({ ...prev, name: null }));
          }}
        />
        {errors.name && <Text className="text-red-500 mb-2">{errors.name}</Text>}

        {/* Leave Type */}
        <Text className="text-base mb-1 text-gray-700 font-semibold text-xl">Leave Type</Text>
        <Picker
          selectedValue={leaveType}
          onValueChange={(itemValue) => {
            setLeaveType(itemValue);
            if (errors.leaveType) setErrors(prev => ({ ...prev, leaveType: null }));
          }}
          style={{
            backgroundColor: 'white',
            borderRadius: 8,
            marginBottom: errors.leaveType ? 4 : 16,
            borderColor: errors.leaveType ? 'red' : '#ccc',
            borderWidth: 1,
          }}
        >
          <Picker.Item label="Select leave type" value="" />
          <Picker.Item label="Sick Leave" value="Sick" />
          <Picker.Item label="Casual Leave" value="Casual" />
          <Picker.Item label="Earned Leave" value="Earned" />
        </Picker>
        {errors.leaveType && <Text className="text-red-500 mb-2">{errors.leaveType}</Text>}

        {/* Start Date */}
        <Text className="text-base mb-1 text-gray-700 text-xl font-semibold">Start Date</Text>
        <Pressable
          onPress={() => setShowStartPicker(true)}
          className={`p-2 border rounded-md bg-white mb-1 ${errors.startDate ? 'border-red-500' : 'border-gray-300'}`}
        >
          <Text className="text-xl">
            {startDate ? startDate.toDateString() : 'Select start date'}
          </Text>
        </Pressable>
        {errors.startDate && <Text className="text-red-500 mb-2">{errors.startDate}</Text>}
        {showStartPicker && (
          <DateTimePicker
            value={startDate || new Date()}
            mode="date"
            display="default"
            minimumDate={new Date()}
            onChange={(event, date) => {
              setShowStartPicker(false);
              if (date) {
                setStartDate(date);
                if (errors.startDate) setErrors(prev => ({ ...prev, startDate: null }));
              }
            }}
          />
        )}

        {/* End Date */}
        <Text className="text-base mb-1 text-gray-700 text-xl font-semibold">End Date</Text>
        <Pressable
          onPress={() => setShowEndPicker(true)}
          className={`p-2 border rounded-md bg-white mb-1 ${errors.endDate ? 'border-red-500' : 'border-gray-300'}`}
        >
          <Text className="text-xl">
            {endDate ? endDate.toDateString() : 'Select end date'}
          </Text>
        </Pressable>
        {errors.endDate && <Text className="text-red-500 mb-2">{errors.endDate}</Text>}
        {showEndPicker && (
          <DateTimePicker
            value={endDate || new Date()}
            mode="date"
            display="default"
            minimumDate={startDate || new Date()}
            onChange={(event, date) => {
              setShowEndPicker(false);
              if (date) {
                setEndDate(date);
                if (errors.endDate) setErrors(prev => ({ ...prev, endDate: null }));
              }
            }}
          />
        )}

        {/* Reason */}
        <Text className="text-base mb-1 text-gray-700 text-xl font-semibold">Reason</Text>
        <TextInput
          className={`border rounded-md p-2 mb-1 h-24 bg-white text-xl ${errors.reason ? 'border-red-500' : 'border-gray-300'}`}
          placeholder="Enter reason for leave"
          value={reason}
          onChangeText={(text) => {
            setReason(text);
            if (errors.reason) setErrors(prev => ({ ...prev, reason: null }));
          }}
          multiline
        />
        {errors.reason && <Text className="text-red-500 mb-2">{errors.reason}</Text>}

        {/* Submit Button */}
        <TouchableOpacity
          className="bg-[#3f72af] p-3 rounded-md mt-2"
          onPress={handleSubmit}
        >
          <Text className="text-white text-center font-bold text-3xl">Submit</Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
}
