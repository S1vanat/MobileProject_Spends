import React, { Component } from "react";
import {
  ScrollView,
  Image,
  Touchable,
  TouchableOpacity,
  Button,
  View,
  Text
} from "react-native";
import firebase from "../database/firebaseDB";
import { ListItem } from "react-native-elements";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";

class Checklist extends Component {
  constructor() {
    super();

    this.subjCollection = firebase.firestore().collection("lists");

    this.state = {
      subject_list: [],
      selectedMonth: "all",
      selectedType: "all",
      selectedCate: "all"
    };
  }

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
      { label: "ลงทุน", value: "การลงทุน" },

      { label: "อาหาร", value: "อาหาร" },
      { label: "เดินทาง", value: "เดินทาง" },
      { label: "ผ่อนสินค้า", value: "ผ่อนสินค้า" },
      { label: "ซื้อของใช้", value: "ซื้อของใช้" },
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
  
    const showIncomeView = this.state.selectedType === "รายรับ" || this.state.selectedType === "all";
    const showExpenseView = this.state.selectedType === "รายจ่าย" || this.state.selectedType === "all";

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
          {types
          .map((type, index) => (
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
                return c.value === "ทำงาน" || c.value === "ลงทุน" || c.value === "all";
              } else if (this.state.selectedType === "รายจ่าย") {
                return c.value === "อาหาร" || c.value === "เดินทาง" || c.value === "all" || c.value === "ผ่อนสินค้า" || c.value === "ซื้อของใช้";
              }
              return true;
            })
            .map((categ, index) => (
              <Picker.Item key={index} label={categ.label} value={categ.value} />
          ))}
        </Picker>

        <View
          style={{
            marginTop:-40,
            margin:8,
            height: 350,
            width: 370,
            backgroundColor:"white",
            borderRadius:20,
            justifyContent:"center",
            overflow: 'hidden',
            alignSelf: 'center',
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
                  <TouchableOpacity key={i}>
                    <ListItem
                      key={i}
                      bottomDivider
                      // containerStyle={{
                      //   backgroundColor:
                      //     item.type === "รายจ่าย" ? "#fcc7c2" : "#ccfccf",
                      // }}
                    >
                      <ListItem.Content
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          justifyContent: "flex-start"
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
                              : "podium-outline"
                          }
                          size={24}
                          color="black"
                          style={{ marginRight: 13,  paddingTop:8}}
                        />
                        <View>
                          <ListItem.Title style={{fontSize:16, textAlign: "left"}}>{item.description}</ListItem.Title>

                          <ListItem.Subtitle style={{fontSize:10, textAlign: "left"}}>
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
                            color: item.type === "รายรับ" ? "green" : "red" // เปลี่ยนสีตัวอักษรเป็นสีเขียวเมื่อเป็นรายรับ
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
        <View style={{ flexDirection: 'row', alignItems: 'center', alignSelf:"center" }}>
      {showIncomeView && (
        <View 
          style={{
            margin: 8,
            height: 100,
            width: 150,
            backgroundColor: "green",
            borderRadius: 20,
            overflow: 'hidden',
            elevation: 8,
          }}
        >
          <Text style={{ textAlign: 'center', fontSize: 25, color: 'white' , paddingTop:30}}>
            {totalIncome} ฿
          </Text>
        </View>
      )}

      {showExpenseView && (
        <View 
          style={{
            margin: 8,
            height: 100,
            width: 150,
            backgroundColor: "red",
            borderRadius: 20,
            overflow: 'hidden',
            elevation: 8,
          }}
        >
          <Text style={{ textAlign: 'center', fontSize: 25, color: 'white' , paddingTop:30}}>
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
