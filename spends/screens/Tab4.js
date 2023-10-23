import React, { Component } from "react";
import {
  ScrollView,
  Image,
  Touchable,
  TouchableOpacity,
  Button,
  View,
  Text,
  Modal,
  Alert,
} from "react-native";

import firebase from "../database/firebaseDB";
import { ListItem } from "react-native-elements";
import { Picker } from "@react-native-picker/picker";
import ProgressBar from "react-native-progress-bar-animated";
import { Ionicons } from "@expo/vector-icons";
// import Modal from 'react-native-modal';
import moment from "moment";

class Tab4 extends Component {
  constructor() {
    super();

    this.subjCollection = firebase.firestore().collection("lists");
    this.budgCollection = firebase.firestore().collection("Budget");

    this.state = {
      subject_list: [],
      selectedMonth: "all",
      selectedType: "all",
      selectedCate: "all",
      categories: [],
      selectedItem: null, // เพิ่ม state สำหรับเก็บข้อมูลรายการที่ถูกเลือก
      isModalVisible: false, // เพิ่ม state สำหรับตรวจสอบว่า Modal ควรแสดงหรือไม่
    };
  }

  toggleModal = (item) => {
    this.setState((prevState) => ({
      isModalVisible: !prevState.isModalVisible,
      selectedItem: item, // เซ็ตข้อมูลรายการที่ถูกเลือกใน state
    }));
  };

  getCollection = (querySnapshot) => {
    const all_data = [];
    querySnapshot.forEach((res) => {
      const { description, type, price, day, category } = res.data();
      const dateObject = new Date(day.seconds * 1000);
      all_data.push({
        key: res.id,
        description,
        type,
        price,
        day: dateObject,
        category,
      });
    });

    all_data.sort((a, b) => b.day - a.day);

    this.setState({
      subject_list: all_data,
    });
  };

  componentDidMount() {
    this.unsubscribeCategories = this.subjCollection.onSnapshot(
      (querySnapshot) => {
        const categories = [];
        querySnapshot.forEach((doc) => {
          const { category } = doc.data();
          if (!categories.includes(category)) {
            categories.push(category);
          }
        });
        this.setState({ categories }); // เซ็ตข้อมูลหมวดหมู่ใน state
      }
    );

    this.unsubscribeItems = this.subjCollection.onSnapshot(this.getCollection);
  }

  componentWillUnmount() {
    this.unsubscribeCategories();
    this.unsubscribeItems();
  }

  deleteSubject() {
    const delSubjDoc = firebase
      .firestore()
      .collection("lists")
      .doc(this.state.selectedItem.key);
    delSubjDoc.delete().then((res) => {
      Alert.alert("Deleting Alert", "ลบรายการแล้ว");
    });
  }

  render() {
    const { navigation } = this.props;
    const months = [
      
      { label: "มกราคม", value: "January" },
      { label: "กุมภาพันธ์", value: "February" },
      { label: "มีนาคม", value: "March" },
      { label: "เมษายน", value: "April" },
      { label: "พฏษภาคม", value: "May" },
      { label: "มิถุนายน", value: "June" },
      { label: "กรกฏาคม", value: "July" },
      { label: "สิงหาคม", value: "August" },
      { label: "กันยายน", value: "September" },
      { label: "ตุลาคม", value: "October" },
      { label: "พฤษจิกายน", value: "November" },
      { label: "ธันวาคม", value: "December" },
    ];
    
    const filteredItems = this.state.subject_list.filter((item) => {
      const isMonthMatch =
        this.state.selectedMonth === "all" ||
        new Date(item.day).toLocaleString("en-US", { month: "long" }) ===
          this.state.selectedMonth;
      return isMonthMatch
    });

    const categoryTotals = filteredItems.reduce((acc, item) => {
        if (acc[item.category]) {
          acc[item.category] += item.price;
        } else {
          acc[item.category] = item.price;
        }
        return acc;
      }, {});

    const showIncome = filteredItems
      .filter((item) => item.type === "รายรับ")
      .reduce((acc, item) => acc + item.price, 0);

    const showExpense = filteredItems
      .filter((item) => item.type === "รายจ่าย")
      .reduce((acc, item) => acc + item.price, 0);

    const allIncomeItems = this.state.subject_list.filter(
      (item) => item.type === "รายรับ"
    );
    const allExpenseItems = this.state.subject_list.filter(
      (item) => item.type === "รายจ่าย"
    );

    const totalIncome = allIncomeItems.reduce(
      (acc, item) => acc + item.price,
      0
    );
    const totalExpense = allExpenseItems.reduce(
      (acc, item) => acc + item.price,
      0
    );

    const showIncomeView =
      this.state.selectedType === "รายรับ" || this.state.selectedType === "all";
    const showExpenseView =
      this.state.selectedType === "รายจ่าย" ||
      this.state.selectedType === "all";

    const expensePercentage = (totalExpense / totalIncome) * 100;

    return (
      <View style={{ flex: 1, }}>
        {/* Dropdown เพื่อเลือกเดือน */}

        <View
          style={{
            
            height: 200,
            width: 370,
            backgroundColor: "white",
            borderRadius: 20,
            justifyContent: "center",
            overflow: "hidden",
            alignSelf: "center",
            elevation: 8,
            
          }}
        >
        <Picker
          selectedValue={this.state.selectedMonth}
          onValueChange={(itemValue) => {
            this.setState({ selectedMonth: itemValue });
          }}
          style={{
            height: 50,
            width: 200,
            zIndex:1,
            top: 0,
            
            left: 80,
          }}
        >
          {months.map((month, index) => (
            <Picker.Item key={index} label={month.label} value={month.value} />
          ))}
        </Picker>
        <ScrollView style={{ flex: 1 }}>
  {Object.entries(categoryTotals).map(([category, total], index) => (
    <ListItem key={index} bottomDivider>
      <ListItem.Content
        style={{
          marginLeft: 0,
          flexDirection: "row",
          justifyContent: "space-between",
          justifyContent: "flex-start",
        }}
      >
        <View style={{ flex: 1 }}>
          <ListItem.Title style={{ fontSize: 16, textAlign: "left" }}>{category}</ListItem.Title>
          {/* <ListItem.Subtitle style={{ fontSize: 10, textAlign: "left" }}>รวมยอด: {total}</ListItem.Subtitle> */}
        </View>
        <View style={{ flex: 1, alignItems: "flex-end" }}>
          <ListItem.Title style={{ textAlign: "right" }}>
            {total+' ฿'}
          </ListItem.Title>
        </View>
      </ListItem.Content>
      <ListItem.Chevron />
    </ListItem>
  ))}
</ScrollView>

        </View>
        {/* รวมเงิน */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            alignSelf: "center",
          }}
        >
          {showIncomeView && (
            <View
              style={{
                margin: 8,
                height: 70,
                width: 150,
                backgroundColor: "#13C999",
                borderRadius: 20,
                overflow: "hidden",
                elevation: 8,
              }}
            >
              <Text
                style={{
                  textAlign: "center",
                  fontSize: 25,
                  color: "white",
                  paddingTop: 20,
                }}
              >
                {showIncome} ฿
              </Text>
            </View>
          )}

          {showExpenseView && (
            <View
              style={{
                margin: 8,
                height: 70,
                width: 150,
                backgroundColor: "#FF6363",
                borderRadius: 20,
                overflow: "hidden",
                elevation: 8,
              }}
            >
              <Text
                style={{
                  textAlign: "center",
                  fontSize: 25,
                  color: "white",
                  paddingTop: 20,
                }}
              >
                {showExpense} ฿
              </Text>
            </View>
          )}
        </View>
      </View>
    );
  }
}

export default Tab4;
