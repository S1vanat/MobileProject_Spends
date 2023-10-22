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
import { Ionicons } from "@expo/vector-icons";
// import Modal from 'react-native-modal';
import moment from "moment";

class Checklist extends Component {
  constructor() {
    super();

    this.subjCollection = firebase.firestore().collection("lists");

    this.state = {
      subject_list: [],
      selectedMonth: "all",
      selectedType: "all",
      selectedCate: "all",
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
    this.unsubscribe = this.subjCollection.onSnapshot(this.getCollection);
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  deleteSubject() {
    const delSubjDoc = firebase
      .firestore()
      .collection("lists")
      .doc(this.state.selectedItem.key);
    delSubjDoc.delete().then((res) => {
      Alert.alert(
        "Deleting Alert",
        "The subject was deleted!! Pls check your DB!!"
      );
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
      { label: "พฏษภาคม", value: "May" },
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
    const categ = [
      { label: "หมวดหมู่", value: "all" },
      { label: "ทำงาน", value: "ทำงาน" },
      { label: "การลงทุน", value: "การลงทุน" },
      { label: "โบนัส", value: "โบนัส" },

      { label: "อาหาร", value: "อาหาร" },
      { label: "เดินทาง", value: "เดินทาง" },
      { label: "ผ่อนสินค้า", value: "ผ่อนสินค้า" },
      { label: "ซื้อของใช้", value: "ซื้อของใช้" },
      { label: "สุขภาพ", value: "สุขภาพ" },
      { label: "บำรุง", value: "บำรุง" },
      { label: "การศึกษา", value: "การศึกษา" },
      { label: "ที่พักอาศัย", value: "ที่พักอาศัย" },
      { label: "นันทนาการ", value: "นันทนาการ" },
    ];

    const filteredItems = this.state.subject_list.filter((item) => {
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
    });

    const totalIncome = filteredItems
      .filter((item) => item.type === "รายรับ")
      .reduce((acc, item) => acc + item.price, 0);

    const totalExpense = filteredItems
      .filter((item) => item.type === "รายจ่าย")
      .reduce((acc, item) => acc + item.price, 0);

    const showIncomeView =
      this.state.selectedType === "รายรับ" || this.state.selectedType === "all";
    const showExpenseView =
      this.state.selectedType === "รายจ่าย" ||
      this.state.selectedType === "all";

    return (
      <View>
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
          {categ
            .filter((c) => {
              if (this.state.selectedType === "รายรับ") {
                return (
                  c.value === "ทำงาน" ||
                  c.value === "การลงทุน" ||
                  c.value === "all" ||
                  c.value === "โบนัส"
                );
              } else if (this.state.selectedType === "รายจ่าย") {
                return (
                  c.value === "อาหาร" ||
                  c.value === "เดินทาง" ||
                  c.value === "all" ||
                  c.value === "ผ่อนสินค้า" ||
                  c.value === "ซื้อของใช้" ||
                  c.value === "สุขภาพ" ||
                  c.value === "นันทนาการ" ||
                  c.value === "การศึกษา" ||
                  c.value === "ที่พักอาศัย" ||
                  c.value === "บำรุง"
                );
              }
              return true;
            })
            .map((categ, index) => (
              <Picker.Item
                key={index}
                label={categ.label}
                value={categ.value}
              />
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
                      // containerStyle={{
                      //   backgroundColor:
                      //     item.type === "รายจ่าย" ? "#fcc7c2" : "#ccfccf",
                      // }}
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
                                  this.props.navigation.navigate("แก้ไขรายการ");
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
                          {/* <ListItem.Subtitle style={{fontSize:10}}>
                            วันที่: {item.day.toLocaleString("en-US")}
                          </ListItem.Subtitle> */}
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
                {totalIncome} ฿
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
                {totalExpense} ฿
              </Text>
            </View>
          )}
        </View>
      </View>
    );
  }
}

export default Checklist;
