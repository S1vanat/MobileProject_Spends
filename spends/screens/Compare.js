import React, { Component } from "react";
import { ScrollView, View, Text, Alert } from "react-native";

import firebase from "../database/firebaseDB";
import { ListItem } from "react-native-elements";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";
import ProgressBar from "react-native-progress-bar-animated";
// import Modal from 'react-native-modal';

class CustomPicker extends Component {
  render() {
    const { selectedMonth, onValueChange, months } = this.props;
    return (
      <Picker
        selectedValue={selectedMonth}
        onValueChange={(itemValue) => onValueChange(itemValue)}
        style={{ height: 50, width: 200, zIndex: 1, top: 0, left: 80 }}
      >
        {months.map((month, index) => (
          <Picker.Item key={index} label={month.label} value={month.value} />
        ))}
      </Picker>
    );
  }
}

class Prepare extends Component {
  constructor() {
    super();

    this.subjCollection = firebase.firestore().collection("lists");

    this.state = {
      subject_list: [],
      selectedMonth1: "all",
      selectedMonth2: "all",
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

    const filteredItems1 = this.state.subject_list.filter((item) => {
      const isMonthMatch1 =
        this.state.selectedMonth1 === "all" ||
        new Date(item.day).toLocaleString("en-US", { month: "long" }) ===
          this.state.selectedMonth1;

      return isMonthMatch1;
    });

    const filteredItems2 = this.state.subject_list.filter((item) => {
      const isMonthMatch2 =
        this.state.selectedMonth2 === "all" ||
        new Date(item.day).toLocaleString("en-US", { month: "long" }) ===
          this.state.selectedMonth2;

      return isMonthMatch2;
    });

    const categoryTotals1 = filteredItems1.reduce((acc, item) => {
      if (acc[item.category]) {
        acc[item.category] += item.price;
      } else {
        acc[item.category] = item.price;
      }
      return acc;
    }, {});

    const categoryTotals2 = filteredItems2.reduce((acc, item) => {
      if (acc[item.category]) {
        acc[item.category] += item.price;
      } else {
        acc[item.category] = item.price;
      }
      return acc;
    }, {});

    const showIncome = filteredItems1
      .filter((item) => item.type === "รายรับ")
      .reduce((acc, item) => acc + item.price, 0);

    const showExpense = filteredItems1
      .filter((item) => item.type === "รายจ่าย")
      .reduce((acc, item) => acc + item.price, 0);

    const showIncome1 = filteredItems2
      .filter((item) => item.type === "รายรับ")
      .reduce((acc, item) => acc + item.price, 0);

    const showExpense1 = filteredItems2
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

    const expensePercentage = (showExpense / showIncome) * 100;
    const expensePercentage1 = (showExpense1 / showIncome1) * 100;

    return (
      <View style={{ flex: 1, backgroundColor: "#ffd2ad" }}>
        <View
          style={{
            marginTop:15,
            height: 180,
            width: 370,
            backgroundColor: "white",
            borderRadius: 20,
            justifyContent: "center",
            overflow: "hidden",
            alignSelf: "center",
            elevation: 8,
          }}
        >
          
          <ScrollView style={{ flex: 1 }}>
            {Object.entries(categoryTotals1).map(([category, total], index) => (
              <ListItem key={index} bottomDivider>
                <ListItem.Content
                  style={{
                    marginLeft: 0,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    justifyContent: "flex-start",
                  }}
                >
                  <Ionicons
                    name={
                      category === "เดินทาง"
                        ? "bicycle-outline"
                        : category === "อาหาร"
                        ? "fast-food-outline"
                        : category === "ผ่อนสินค้า"
                        ? "card-outline"
                        : category === "ซื้อของใช้"
                        ? "cart-outline"
                        : category === "ทำงาน"
                        ? "briefcase-outline"
                        : category === "สุขภาพ"
                        ? "medkit-outline"
                        : category === "นันทนาการ"
                        ? "film-outline"
                        : category === "การลงทุน"
                        ? "podium-outline"
                        : category === "การศึกษา"
                        ? "library-outline"
                        : category === "ที่พักอาศัย"
                        ? "home-outline"
                        : category === "โบนัส"
                        ? "cash-outline"
                        : category === "บำรุง"
                        ? "build-outline"
                        : "ellipsis-horizontal-circle-outline"
                    }
                    size={24}
                    color="black"
                    style={{ marginRight: 13, paddingTop: 2 }}
                  />
                  <View style={{ flex: 1 }}>
                    <ListItem.Title style={{ fontSize: 16, textAlign: "left" }}>
                      {category}
                    </ListItem.Title>
                    {/* <ListItem.Subtitle style={{ fontSize: 10, textAlign: "left" }}>รวมยอด: {total}</ListItem.Subtitle> */}
                  </View>
                  <View style={{ flex: 1, alignItems: "flex-end" }}>
                    <ListItem.Title
                      style={{
                        textAlign: "right",
                        color:
                          category === "ลงทุน" ||
                          category === "ทำงาน" ||
                          category === "โบนัส"
                            ? "green"
                            : "red",
                      }}
                    >
                      {total + " ฿"}
                    </ListItem.Title>
                  </View>
                </ListItem.Content>
                <ListItem.Chevron />
              </ListItem>
            ))}
          </ScrollView>
          <CustomPicker
            selectedMonth={this.state.selectedMonth1}
            onValueChange={(itemValue) => {
              this.setState({ selectedMonth1: itemValue });
            }}
            months={months}
          />
        </View>
        {/* รวมเงิน */}
        {/* เปรียบเทียบตรงนี้ */}
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            height: 200,
            width: 370,
            backgroundColor: "white",
            borderRadius: 20,
            overflow: "hidden",
            elevation: 8,
            margin: 12,
            paddingBottom: 10,
            paddingTop: 10,
            borderWidth: 1,
          }}
        >
          <Text style={{ textAlign: "center", padding: 5 }}>
            {expensePercentage.toFixed(2)}%
          </Text>
          <ProgressBar
            width={250}
            height={20}
            backgroundColor="orange"
            value={expensePercentage}
            backgroundColorOnComplete="red"
            borderRadius={5}
            useNativeDriver={true}
          />
          <View
            style={{
              position: "absolute",
              top: "55%",
              height: 1,
              width: "100%",
              backgroundColor: "black",
            }}
          />
          <Ionicons
            style={{ position: "absolute", top: 23, right: 23 }}
            name="add-circle-outline"
            size={32}
            color="green"
          ></Ionicons>
          <Ionicons
            style={{ position: "absolute", top: 23, left: 25 }}
            name="remove-circle-outline"
            size={32}
            color="red"
          ></Ionicons>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              alignSelf: "center",
              paddingBottom:42
            }}
          >
            {showExpenseView && (
              <Text
                style={{
                  textAlign: "center",
                  fontSize: 15,
                  color: "black",
                  
                }}
              >
                {showExpense} ฿-
              </Text>
            )}
            {showIncomeView && (
              <Text
                style={{
                  textAlign: "center",
                  fontSize: 15,
                  color: "black",
                }}
              >
                {showIncome} ฿
              </Text>
            )}
            
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              alignSelf: "center",
            }}
          >
            
            {showExpenseView && (
              <Text
                style={{
                  textAlign: "center",
                  fontSize: 15,
                  color: "black",
                  paddingTop: 20,
                }}
              >
                {showExpense1} ฿-
                {showIncomeView && (
              <Text
                style={{
                  textAlign: "center",
                  fontSize: 15,
                  color: "black",
                  paddingTop: 20,
                }}
              >
                {showIncome1} ฿
              </Text>
            )}
              </Text>
            )}
          </View>
          <ProgressBar
            width={250}
            height={20}
            backgroundColor="orange"
            value={expensePercentage1}
            backgroundColorOnComplete="red"
            borderRadius={5}
            useNativeDriver={true}
          />
          <Text style={{ textAlign: "center", padding: 5 }}>
            {expensePercentage1.toFixed(2)}%
          </Text>
          <Ionicons
            style={{ position: "absolute", bottom: 22, right: 22 }}
            name="add-circle-outline"
            size={32}
            color="green"
          ></Ionicons>
          <Ionicons
            style={{ position: "absolute", bottom: 23, left: 25 }}
            name="remove-circle-outline"
            size={32}
            color="red"
          ></Ionicons>
        </View>
        {/* จบเปรียบเทียบ */}
        <View
          style={{
            height: 180,
            width: 370,
            backgroundColor: "white",
            borderRadius: 20,
            justifyContent: "center",
            overflow: "hidden",
            alignSelf: "center",
            elevation: 8,
          }}
        >
          <CustomPicker
            selectedMonth={this.state.selectedMonth2}
            onValueChange={(itemValue) => {
              this.setState({ selectedMonth2: itemValue });
            }}
            months={months}
          />
          <ScrollView style={{ flex: 1 }}>
            {Object.entries(categoryTotals2).map(([category, total], index) => (
              <ListItem key={index} bottomDivider>
                <ListItem.Content
                  style={{
                    marginLeft: 0,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    justifyContent: "flex-start",
                  }}
                >
                  <Ionicons
                    name={
                      category === "เดินทาง"
                        ? "bicycle-outline"
                        : category === "อาหาร"
                        ? "fast-food-outline"
                        : category === "ผ่อนสินค้า"
                        ? "card-outline"
                        : category === "ซื้อของใช้"
                        ? "cart-outline"
                        : category === "ทำงาน"
                        ? "briefcase-outline"
                        : category === "สุขภาพ"
                        ? "medkit-outline"
                        : category === "นันทนาการ"
                        ? "film-outline"
                        : category === "การลงทุน"
                        ? "podium-outline"
                        : category === "การศึกษา"
                        ? "library-outline"
                        : category === "ที่พักอาศัย"
                        ? "home-outline"
                        : category === "โบนัส"
                        ? "cash-outline"
                        : category === "บำรุง"
                        ? "build-outline"
                        : "ellipsis-horizontal-circle-outline"
                    }
                    size={24}
                    color="black"
                    style={{ marginRight: 13, paddingTop: 2 }}
                  />
                  <View style={{ flex: 1 }}>
                    <ListItem.Title style={{ fontSize: 16, textAlign: "left" }}>
                      {category}
                    </ListItem.Title>
                  </View>
                  <View style={{ flex: 1, alignItems: "flex-end" }}>
                    <ListItem.Title
                      style={{
                        textAlign: "right",
                        color:
                          category === "ลงทุน" ||
                          category === "ทำงาน" ||
                          category === "โบนัส"
                            ? "green"
                            : "red",
                      }}
                    >
                      {total + " ฿"}
                    </ListItem.Title>
                  </View>
                </ListItem.Content>
                <ListItem.Chevron />
              </ListItem>
            ))}
          </ScrollView>
        </View>
      </View>
    );
  }
}

export default Prepare;
