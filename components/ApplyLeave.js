import React, { useState } from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  Pressable,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { LinearGradient } from 'expo-linear-gradient';

export default function LeaveForm() {
  const [name, setName] = useState('');
  const [leaveType, setLeaveType] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [reason, setReason] = useState('');
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const handleSubmit = () => {
    console.log({
      name,
      leaveType,
      startDate: startDate.toDateString(),
      endDate: endDate.toDateString(),
      reason,
    });
     setName('');
    setLeaveType('');
    setStartDate(new Date());
    setEndDate(new Date());
    setReason('');
  };
  

  return (
    <LinearGradient
    colors={["#7dd3fc", "#bae6fd", "#fff"]}
      className="flex-1"
    >
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
          <Picker.Item label="Annual Leave" value="Annual" />
        </Picker>

        <Text className="text-base mb-1 text-gray-700">Start Date</Text>
        <Pressable
          onPress={() => setShowStartPicker(true)}
          className="p-2 border border-gray-300 rounded-md bg-white mb-4"
        >
          <Text>{startDate.toDateString()}</Text>
        </Pressable>
        {showStartPicker && (
          <DateTimePicker
            value={startDate}
            mode="date"
            display="default"
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
          <Text>{endDate.toDateString()}</Text>
        </Pressable>
        {showEndPicker && (
          <DateTimePicker
            value={endDate}
            mode="date"
            display="default"
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
