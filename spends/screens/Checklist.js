import React, { Component } from "react";
import {
  ScrollView,
  TouchableOpacity,
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
import moment from "moment";

class Checklist extends Component {
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
      { label: "ทุกเดือน", value: "all" },
      { label: "มกราคม", value: "January" },
      { label: "กุมภาพันธ์", value: "February" },
      { label: "มีนาคม", value: "March" },
      { label: "เมษายน", value: "April" },
      { label: "พฤษภาคม", value: "May" },
      { label: "มิถุนายน", value: "June" },
      { label: "กรกฏาคม", value: "July" },
      { label: "สิงหาคม", value: "August" },
      { label: "กันยายน", value: "September" },
      { label: "ตุลาคม", value: "October" },
      { label: "พฤษจิกายน", value: "November" },
      { label: "ธันวาคม", value: "December" },
    ];
    const types = [
      { label: "รวม", value: "all" },
      { label: "รายจ่าย", value: "รายจ่าย" },
      { label: "รายรับ", value: "รายรับ" },
    ];
    const categ = [];

    const filteredItems = this.state.subject_list.filter((item) => {
      const isMonthMatch =
        this.state.selectedMonth === "all" ||
        new Date(item.day).toLocaleString("en-US", { month: "long" }) ===
          this.state.selectedMonth;
      const isTypeMatch =
        this.state.selectedType === "all" ||
        item.type === this.state.selectedType;
      const isCateMatch =
        this.state.selectedCate === "all" ||
        item.category === this.state.selectedCate;
      return isMonthMatch && isTypeMatch && isCateMatch;
    });

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
      <View style={{ flex: 1, backgroundColor:'#ffd2ad' }}>
        {/* Dropdown เพื่อเลือกเดือน */}
        <Picker
          selectedValue={this.state.selectedMonth}
          onValueChange={(itemValue) => {
            this.setState({ selectedMonth: itemValue });
          }}
          style={{
            height: 50,
            width: 200,
            top: 0,
            zIndex: 1,
            left: 200,
          }}
        >
          {months.map((month, index) => (
            <Picker.Item key={index} label={month.label} value={month.value} />
          ))}
        </Picker>

        <Picker
          selectedValue={this.state.selectedType}
          onValueChange={(itemValue) => {
            this.setState({ selectedType: itemValue });
          }}
          style={{
            height: 50,
            width: 200,
            top: -50,
            zIndex: 1,
          }}
        >
          {types.map((type, index) => (
            <Picker.Item key={index} label={type.label} value={type.value} />
          ))}
        </Picker>

        <Picker
          selectedValue={this.state.selectedCate}
          onValueChange={(itemValue) => {
            this.setState({ selectedCate: itemValue });
          }}
          style={{
            height: 50,
            width: 200,
            alignSelf: "center",
            top: -50,
            zIndex: 1,
          }}
        >
          <Picker.Item label="หมวดหมู่" value="all" />
          {this.state.categories
            .filter((category) => {
              const type = this.state.selectedType;
              return (
                (type === "รายรับ" &&
                  this.state.subject_list.some(
                    (item) =>
                      item.category === category && item.type === "รายรับ"
                  )) ||
                (type === "รายจ่าย" &&
                  this.state.subject_list.some(
                    (item) =>
                      item.category === category && item.type === "รายจ่าย"
                  )) ||
                type === "all"
              );
            })
            .map((category, index) => (
              <Picker.Item key={index} label={category} value={category} />
            ))}
        </Picker>

        <View
          style={{
            marginTop: -40,
            margin: 8,
            height: 350,
            width: 370,
            backgroundColor: "white",
            borderRadius: 20,
            justifyContent: "center",
            overflow: "hidden",
            alignSelf: "center",
            elevation: 8,
            flex: 7,
            borderWidth:1
          }}
        >
          <ScrollView style={{ flex: 1 }}>
            {this.state.subject_list
              .filter((item) => {
                const isMonthMatch =
                  this.state.selectedMonth === "all" ||
                  new Date(item.day).toLocaleString("en-US", {
                    month: "long",
                  }) === this.state.selectedMonth;
                const isTypeMatch =
                  this.state.selectedType === "all" ||
                  item.type === this.state.selectedType;
                const isCateMatch =
                  this.state.selectedCate === "all" ||
                  item.category === this.state.selectedCate;
                return isMonthMatch && isTypeMatch && isCateMatch;
              })
              .map((item, i) => {
                const sign = item.type === "รายรับ" ? "+฿" : "-฿";
                return (
                  <TouchableOpacity
                    key={i}
                    onPress={() => this.toggleModal(item)}
                  >
                    <ListItem
                      key={i}
                      bottomDivider
                    
                    >
                      <Modal
                        visible={this.state.isModalVisible}
                        animationType="fade"
                        transparent
                      >
                        <View
                          style={{
                            backgroundColor: "rgba(33, 33, 33, 0.7)",
                            flex: 1,
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <View
                            style={{
                              backgroundColor: "white",
                              padding: 20,
                              borderRadius: 10,
                              height: "auto",
                              opacity: 1,
                            }}
                          >
                            {this.state.selectedItem && (
                              <>
                                <Text>
                                  ชนิด: {this.state.selectedItem.type}
                                </Text>
                                <Text>
                                  จำนวน: {this.state.selectedItem.price} ฿
                                </Text>
                                <Text>
                                  รายละเอียด:{" "}
                                  {this.state.selectedItem.description}
                                </Text>
                                <Text>
                                  หมวดหมู่: {this.state.selectedItem.category}
                                </Text>
                                <Text>
                                  วันที่:{" "}
                                  {moment(this.state.selectedItem.day).format(
                                    "MM/D/YY"
                                  )}
                                </Text>
                              </>
                            )}
                            <View
                              style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                                marginTop: 20,
                              }}
                            >
                              <TouchableOpacity
                                style={{
                                  // backgroundColor: "orange",
                                  paddingVertical: 10,
                                  paddingHorizontal: 20,
                                  borderRadius: 5,
                                }}
                                onPress={() => {
                                  this.toggleModal(null);
                                  this.props.navigation.navigate(
                                    "แก้ไขรายการ",
                                    {
                                      key: this.state.selectedItem.key,
                                      price: this.state.selectedItem.price,
                                      day: this.state.selectedItem.day,
                                      category:
                                        this.state.selectedItem.category,
                                      description:
                                        this.state.selectedItem.description,
                                      type: this.state.selectedItem.type,
                                    }
                                  );
                                }}
                              >
                                <Ionicons
                                  name="pencil-outline"
                                  size={24}
                                  color="black"
                                />
                              </TouchableOpacity>

                              <View
                                style={{
                                  flexDirection: "row",
                                  alignItems: "center",
                                }}
                              >
                                <TouchableOpacity
                                  style={{
                                    paddingVertical: 10,
                                    paddingHorizontal: 20,
                                    borderRadius: 5,
                                    marginRight: 10,
                                  }}
                                  onPress={() => {
                                    this.deleteSubject();
                                    this.toggleModal(null);
                                  }}
                                >
                                  <Ionicons
                                    name="trash-outline"
                                    size={24}
                                    color="black"
                                  />
                                </TouchableOpacity>

                                <TouchableOpacity
                                  style={{
                                    paddingVertical: 10,
                                    paddingHorizontal: 20,
                                    borderRadius: 5,
                                  }}
                                  onPress={() => this.toggleModal(null)}
                                >
                                  <Ionicons
                                    name="close"
                                    size={24}
                                    color="black"
                                  />
                                </TouchableOpacity>
                              </View>
                            </View>
                          </View>
                        </View>
                      </Modal>
                      <ListItem.Content
                        style={{
                          marginLeft: -15,
                          flexDirection: "row",
                          justifyContent: "space-between",
                          justifyContent: "flex-start",
                        }}
                      >
                        <Ionicons
                          name={
                            item.category === "เดินทาง"
                              ? "bicycle-outline"
                              : item.category === "อาหาร"
                              ? "fast-food-outline"
                              : item.category === "ผ่อนสินค้า"
                              ? "card-outline"
                              : item.category === "ซื้อของใช้"
                              ? "cart-outline"
                              : item.category === "ทำงาน"
                              ? "briefcase-outline"
                              : item.category === "สุขภาพ"
                              ? "medkit-outline"
                              : item.category === "นันทนาการ"
                              ? "film-outline"
                              : item.category === "การลงทุน"
                              ? "podium-outline"
                              : item.category === "การศึกษา"
                              ? "library-outline"
                              : item.category === "ที่พักอาศัย"
                              ? "home-outline"
                              : item.category === "โบนัส"
                              ? "cash-outline"
                              : item.category === "บำรุง"
                              ? "build-outline"
                              : "ellipsis-horizontal-circle-outline"
                          }
                          size={24}
                          color="black"
                          style={{ marginRight: 13, paddingTop: 5 }}
                        />
                        <View>
                          <ListItem.Title
                            style={{ fontSize: 16, textAlign: "left" }}
                          >
                            {item.description}
                          </ListItem.Title>

                          <ListItem.Subtitle
                            style={{ fontSize: 10, textAlign: "left" }}
                          >
                            หมวดหมู่: {item.category}
                          </ListItem.Subtitle>
                        </View>
                        <View style={{ flex: 1, alignItems: "flex-end" }}>
                          <ListItem.Title
                            style={{
                              textAlign: "right",
                              color: item.type === "รายรับ" ? "green" : "red", // เปลี่ยนสีตัวอักษรเป็นสีเขียวเมื่อเป็นรายรับ
                            }}
                          >
                            {sign}
                            {item.price}
                          </ListItem.Title>
                        </View>
                      </ListItem.Content>
                      <ListItem.Chevron />
                    </ListItem>
                  </TouchableOpacity>
                );
              })}
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
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            flex: 1.5,
            marginBottom: 16,
          }}
        >
          <Text style={{ textAlign: "center", padding: 5 }}>
            ใช้จ่ายไปทั้งหมด: {expensePercentage.toFixed(2)}%
          </Text>
          <ProgressBar
            width={300}
            height={15}
            backgroundColor="orange"
            value={expensePercentage}
            backgroundColorOnComplete="red"
            useNativeDriver={false}
            borderColor="black" // สีของกรอบ
            borderWidth={1} // ความหนาของกรอบ
          />
        </View>
      </View>
    );
  }
}

export default Checklist;
