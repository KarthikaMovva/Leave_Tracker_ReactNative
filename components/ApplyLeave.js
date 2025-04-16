import React, { useState } from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Pressable,
  View,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';


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
      
      Toast.show({
        type: 'success',
        text1: 'Applied!!',
        text2: 'You applied a leave sucessfully🎉',
        position: 'top', 
        visibilityTime: 6000,
      });

      setName('');
      setLeaveType('');
      setStartDate(null);
      setEndDate(null);
      setReason('');
      setErrors({});
      navigation.navigate('History');
    } catch (error) {
      console.error('Error saving data:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Something went wrong. Try again❌',
      });
    }
  };

  return (
      <LinearGradient colors={['#f0f4f8', '#d9e2ec']} style={{ flex: 1 }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          className="flex-1"
        >
          <ScrollView contentContainerStyle={{ paddingBottom: 40 }} className="px-4 pt-4">
            <Text className="text-2xl font-bold text-center text-gray-800 mb-6">
              Leave Application Form
            </Text>

            <Text className="text-lg text-gray-700 font-semibold mb-1">Employee Name</Text>
            <TextInput
              className={`border rounded-lg p-3 bg-white text-base ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              } mb-2`}
              placeholder="Enter your name"
              value={name}
              onChangeText={(text) => {
                setName(text);
                if (errors.name) setErrors((prev) => ({ ...prev, name: null }));
              }}
            />
            {errors.name && <Text className="text-red-500 mb-2">{errors.name}</Text>}

            <Text className="text-lg text-gray-700 font-semibold mb-1">Leave Type</Text>
            <View
              className={`bg-white border rounded-lg mb-2 ${
                errors.leaveType ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <Picker
                selectedValue={leaveType}
                onValueChange={(value) => {
                  setLeaveType(value);
                  if (errors.leaveType) setErrors((prev) => ({ ...prev, leaveType: null }));
                }}
              >
                <Picker.Item label="Select leave type" value="" />
                <Picker.Item label="Sick Leave" value="Sick" />
                <Picker.Item label="Casual Leave" value="Casual" />
                <Picker.Item label="Earned Leave" value="Earned" />
              </Picker>
            </View>
            {errors.leaveType && <Text className="text-red-500 mb-2">{errors.leaveType}</Text>}

            <Text className="text-lg text-gray-700 font-semibold mb-1">Start Date</Text>
            <Pressable
              onPress={() => setShowStartPicker(true)}
              className={`p-3 border rounded-lg bg-white mb-2 ${
                errors.startDate ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <Text className="text-base text-gray-800">
                {startDate ? startDate.toDateString() : 'Select start date'}
              </Text>
            </Pressable>
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
                    if (errors.startDate) setErrors((prev) => ({ ...prev, startDate: null }));
                  }
                }}
              />
            )}
            {errors.startDate && <Text className="text-red-500 mb-2">{errors.startDate}</Text>}

            <Text className="text-lg text-gray-700 font-semibold mb-1">End Date</Text>
            <Pressable
              onPress={() => setShowEndPicker(true)}
              className={`p-3 border rounded-lg bg-white mb-2 ${
                errors.endDate ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <Text className="text-base text-gray-800">
                {endDate ? endDate.toDateString() : 'Select end date'}
              </Text>
            </Pressable>
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
                    if (errors.endDate) setErrors((prev) => ({ ...prev, endDate: null }));
                  }
                }}
              />
            )}
            {errors.endDate && <Text className="text-red-500 mb-2">{errors.endDate}</Text>}

            <Text className="text-lg text-gray-700 font-semibold mb-1">Reason</Text>
            <TextInput
              className={`border rounded-lg p-3 bg-white text-base h-24 ${
                errors.reason ? 'border-red-500' : 'border-gray-300'
              } mb-2`}
              placeholder="Enter reason for leave"
              value={reason}
              onChangeText={(text) => {
                setReason(text);
                if (errors.reason) setErrors((prev) => ({ ...prev, reason: null }));
              }}
              multiline
            />
            {errors.reason && <Text className="text-red-500 mb-2">{errors.reason}</Text>}

            <TouchableOpacity
              className="bg-blue-600 py-4 rounded-lg mt-2"
              onPress={handleSubmit}
            >
              <Text className="text-white text-center text-lg font-bold">Submit</Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
  );
}
