import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  MaterialIcons,
  FontAwesome5,
  MaterialCommunityIcons,
  Feather,
} from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useIsFocused } from '@react-navigation/native';
import { SwipeListView } from 'react-native-swipe-list-view';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function History() {
  const [leaveApplications, setLeaveApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editData, setEditData] = useState(null);
  const [editIndex, setEditIndex] = useState(null);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const isFocused = useIsFocused();

  useEffect(() => {
    const fetchLeaveApplications = async () => {
      try {
        const data = await AsyncStorage.getItem('leaveApplications');
        if (data) {
          setLeaveApplications(JSON.parse(data));
        } else {
          setLeaveApplications([]);
        }
      } catch (error) {
        console.error('Error fetching leave applications:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isFocused) {
      fetchLeaveApplications();
    }
  }, [isFocused]);

  const formatDate = (date) =>
    new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

  const renderLeaveIcon = (type) => {
    switch (type) {
      case 'Sick':
        return <MaterialIcons name="medical-services" size={36} color="#e11d48" />;
      case 'Casual':
        return <MaterialCommunityIcons name="umbrella-beach" size={36} color="#facc15" />;
      case 'Earned':
        return <FontAwesome5 name="briefcase" size={32} color="#10b981" />;
      default:
        return null;
    }
  };

  const deleteApplication = async (rowKey) => {
    const updated = leaveApplications.filter((_, index) => index !== rowKey);
    setLeaveApplications(updated);
    await AsyncStorage.setItem('leaveApplications', JSON.stringify(updated));
  };

  const openEditModal = (data, index) => {
    setEditData({ ...data });
    setEditIndex(index);
    setModalVisible(true);
  };

  const updateApplication = async () => {
    const updatedList = [...leaveApplications];
    updatedList[editIndex] = editData;
    setLeaveApplications(updatedList);
    await AsyncStorage.setItem('leaveApplications', JSON.stringify(updatedList));
    setModalVisible(false);
  };

  const renderItem = ({ item, index }) => (
    <View className="bg-white p-4 rounded-xl shadow-md border border-gray-300 mb-3 flex-row space-x-4 items-start">
      <View className="mt-1">{renderLeaveIcon(item.leaveType)}</View>
      <View className="flex-1 pl-3 space-y-2.5">
        <Text className="text-gray-800 font-semibold text-2xl">{item.name}</Text>
        <Text className="font-semibold text-xl text-blue-500">{item.leaveType} Leave</Text>
        <Text className="text-orange-600 mb-1 font-semibold text-xl">
          {item.startDate === item.endDate
            ? formatDate(item.startDate)
            : `${formatDate(item.startDate)} - ${formatDate(item.endDate)}`}
        </Text>
        <Text className="text-gray-500 text-xl">{item.reason}</Text>
        <TouchableOpacity
          className="absolute right-0 bottom-0 p-2"
          onPress={() => openEditModal(item, index)}
        >
          <Feather name="edit" size={22} color="#2563eb" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderHiddenItem = (data, rowMap) => (
    <TouchableOpacity
      className="bg-red-500 justify-center items-center w-24 h-36 rounded-xl ml-auto"
      onPress={() =>
        Alert.alert('Delete Confirmation', 'Are you sure you want to delete this entry?', [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Delete', style: 'destructive', onPress: () => deleteApplication(data.index) },
        ])
      }
    >
      <Text className="text-white font-bold">Delete</Text>
    </TouchableOpacity>
  );

  return (
    <LinearGradient colors={['#f0f4f8', '#d9e2ec']} style={{ flex: 1 }}>
      <View className="flex-1 p-4">
        {loading ? (
          <ActivityIndicator size="large" color="#2563eb" />
        ) : leaveApplications.length === 0 ? (
          <Text className="text-center text-gray-600 mt-10">
            No leave applications found.
          </Text>
        ) : (
          <SwipeListView
            data={leaveApplications}
            renderItem={renderItem}
            renderHiddenItem={renderHiddenItem}
            rightOpenValue={-96}
            disableRightSwipe
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
          />
        )}

        {/* Edit Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View className="flex-1 justify-center items-center bg-black bg-opacity-30">
            <View className="bg-white rounded-lg p-6 w-11/12">
              <ScrollView>
                <Text className="text-xl font-bold mb-4">Edit Leave Application</Text>

                <TextInput
                  placeholder="Name"
                  className="border border-gray-300 rounded-md px-3 py-2 mb-3 text-lg"
                  value={editData?.name}
                  onChangeText={(text) => setEditData({ ...editData, name: text })}
                />

                <TextInput
                  placeholder="Reason"
                  className="border border-gray-300 rounded-md px-3 py-2 mb-3 text-lg"
                  value={editData?.reason}
                  onChangeText={(text) => setEditData({ ...editData, reason: text })}
                />

                {/* Start Date Picker */}
                <TouchableOpacity
                  className="border border-gray-300 rounded-md p-2 mb-3"
                  onPress={() => setShowStartPicker(true)}
                >
                  <Text className="text-lg text-gray-700">
                    Start Date: {formatDate(editData?.startDate)}
                  </Text>
                </TouchableOpacity>
                {showStartPicker && (
                  <DateTimePicker
                    value={new Date(editData?.startDate)}
                    mode="date"
                    display="default"
                    minimumDate={new Date()}
                    onChange={(event, selectedDate) => {
                      setShowStartPicker(false);
                      if (selectedDate) {
                        setEditData({ ...editData, startDate: selectedDate.toISOString() });
                      }
                    }}
                  />
                )}

                {/* End Date Picker */}
                <TouchableOpacity
                  className="border border-gray-300 rounded-md p-2 mb-3"
                  onPress={() => setShowEndPicker(true)}
                >
                  <Text className="text-lg text-gray-700">
                    End Date: {formatDate(editData?.endDate)}
                  </Text>
                </TouchableOpacity>
                {showEndPicker && (
                  <DateTimePicker
                    value={new Date(editData?.endDate)}
                    mode="date"
                    display="default"
                    minimumDate={new Date()}
                    onChange={(event, selectedDate) => {
                      setShowEndPicker(false);
                      if (selectedDate) {
                        setEditData({ ...editData, endDate: selectedDate.toISOString() });
                      }
                    }}
                  />
                )}

                <TextInput
                  placeholder="Leave Type (Sick, Casual, Earned)"
                  className="border border-gray-300 rounded-md px-3 py-2 mb-4 text-lg"
                  value={editData?.leaveType}
                  onChangeText={(text) => setEditData({ ...editData, leaveType: text })}
                />

                <View className="flex-row justify-between space-x-4">
                  <TouchableOpacity onPress={() => setModalVisible(false)}>
                    <Text className="text-red-600 font-semibold text-lg">Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={updateApplication}>
                    <Text className="text-blue-600 font-semibold text-lg">Update</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>
      </View>
    </LinearGradient>
  );
}
