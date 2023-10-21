import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import firebase from "../database/firebaseDB";
import moment from "moment";
import { ListItem } from "react-native-elements";
import { Ionicons } from "@expo/vector-icons";

// import { useState } from "react";
// import DateTimePicker from "@react-native-community/datetimepicker";

class Addrecord extends Component {
  constructor() {
    super();

    this.saveCollection = firebase.firestore().collection("lists");

    this.state = {
      price: "",
      day: "",
      description: "",
      type: "",
      category: "",
      save_list: [],
    };
  }

  inputValueUpdate = (val, prop) => {
    const state = this.state;
    state[prop] = val;
    this.setState(state);
  };

  storeInfomation() {
    const timestamp = moment(this.state.day, "MM/D/YYYY").toDate(); // แปลงวันที่เป็น timestamp
    const price = parseFloat(this.state.price);

    this.saveCollection
      .add({
        price: price,
        day: timestamp,
        description: this.state.description,
        type: this.state.type,
        category: this.state.category,
      })
      .then((res) => {
        this.setState({
          price: "",
          day: "",
          description: "",
          type: "",
          category: "",
        });
      });
  }

  getCollection = (querySnapshot) => {
    const all_data = [];
    querySnapshot.forEach((res) => {
      const { price, day, description, type, category } = res.data();
      all_data.push({
        key: res.id,
        price,
        day,
        description,
        type,
        category,
      });
    });

    this.setState({
      save_list: all_data,
    });
  };

  componentDidMount() {
    this.unsubscribe = this.saveCollection.onSnapshot(this.getCollection);
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.rowSection}>
          <TextInput
            style={styles.smolinput}
            keyboardType="number-pad"
            value={this.state.price}
            onChangeText={(val) => this.inputValueUpdate(val, "price")}
            placeholder="จำนวน"
          />
          <TextInput
            style={styles.smolinput}
            value={this.state.day}
            onChangeText={(val) => this.inputValueUpdate(val, "day")}
            placeholder="ดด/วว/ปป"
          />
        </View>
        <TextInput
          style={styles.smolinput}
          value={this.state.category}
          onChangeText={(val) => this.inputValueUpdate(val, "category")}
          placeholder="หมวดหมู่"
        />
        <Text>รายละเอียด</Text>
        <TextInput
          style={styles.input}
          editable
          multiline
          numberOfLines={3}
          value={this.state.description}
          onChangeText={(val) => this.inputValueUpdate(val, "description")}
        />
        <View style={styles.rowSection}>
          <TouchableOpacity
            style={[
              styles.button,
              {
                backgroundColor: "#13C999",
              },
            ]}
            onPress={() => {
              this.inputValueUpdate("รายรับ", "type");
              this.storeInfomation();
            }}
          >
            <Text style={styles.text}>บันทึกรายรับ</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.button,
              {
                backgroundColor: "#FF6363",
              },
            ]}
            onPress={() => {
              this.inputValueUpdate("รายจ่าย", "type");
              this.storeInfomation();
            }}
          >
            <Text style={styles.text}>บันทึกรายจ่าย</Text>
          </TouchableOpacity>
        </View>

        <Text>รายการที่บันทึก</Text>
        <View
          style={{
            margin: 8,
            height: "100%",
            width: "90%",
            backgroundColor: "white",
            borderRadius: 20,
            justifyContent: "center",
            overflow: "hidden",
            alignSelf: "center",
            elevation: 8,
            flex: 6,
          }}
        >
          <ScrollView style={{ flex: 1 }}>
            {this.state.save_list.map((item, i) => {
              const sign = item.type === "รายรับ" ? "+฿" : "-฿";
              return (
                <TouchableOpacity key={i}>
                  <ListItem key={i} bottomDivider>
                    <ListItem.Content
                      style={{
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
                            : "podium-outline"
                        }
                        size={24}
                        color="black"
                        style={{ marginRight: 13, paddingTop: 8 }}
                      />
                      <View>
                        <ListItem.Title
                          style={{ fontSize: 16, textAlign: "left" }}
                        >
                          {item.category}
                        </ListItem.Title>

                        <ListItem.Subtitle
                          style={{ fontSize: 10, textAlign: "left" }}
                        >
                          {item.description}
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
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 40,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  rowSection: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#000",
    padding: 10,
    width: "80%",
    marginVertical: 10,
    borderRadius: 10,
  },
  smolinput: {
    borderWidth: 1,
    borderColor: "#000",
    padding: 10,
    width: "35%",
    marginVertical: 10,
    borderRadius: 10,
    margin: 5,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    elevation: 3,
    margin: 5,
  },
});

export default Addrecord;
