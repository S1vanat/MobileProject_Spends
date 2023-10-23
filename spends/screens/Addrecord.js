import React, { Component } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Button,
} from "react-native";
import firebase from "../database/firebaseDB";
import moment from "moment";
import { ListItem } from "react-native-elements";
import { Ionicons } from "@expo/vector-icons";
import { Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";

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
      newCategory: "", // สถานะเพิ่มเมื่อผู้ใช้เพิ่มหมวดหมู่ใหม่
      categories: [
        "ลงทุน",
        "ทำงาน",
        "โบนัส",
        "สุขภาพ",
        "นันทนาการ",
        "บำรุง",
        "ที่พักอาศัย",
        "เดินทาง",
        "อาหาร",
        "ผ่อนสินค้า",
        "ซื้อของใช้",
        "การศึกษา",
      ],
    };
  }

  addNewCategory = () => {
    if (this.state.newCategory) {
      const newCategories = [...this.state.categories, this.state.newCategory];
      this.setState({
        categories: newCategories,
        newCategory: "",
      });
    }
  };

  // ให้ผู้ใช้ป้อนหมวดหมู่ใหม่
  renderAddCategoryInput = () => {
    return (
      <View>
        <TextInput
          style={[styles.input, { width: "100%" }]}
          value={this.state.newCategory}
          onChangeText={(text) => this.setState({ newCategory: text })}
          placeholder="เพิ่มหมวดหมู่ใหม่"
        />
        <Button style={{borderRadius:10}} title="เพิ่ม" onPress={this.addNewCategory} />
      </View>
    );
  };

  inputValueUpdate = (val, prop) => {
    const state = this.state;
    state[prop] = val;
    this.setState(state);
  };

  storeInfomation() {
    const timestamp = moment(this.state.day, "MM/D/YYYY").toDate();
    const { price, day, description, type, category } = this.state;

    if (!price || !day || !description || !type || !category) {
      // ถ้าข้อมูลไม่ครบถ้วน
      Alert.alert("แจ้งเตือน", "กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    this.saveCollection
      .add({
        price: parseFloat(price),
        day: timestamp,
        description: description,
        type: type,
        category: category,
      })
      .then((res) => {
        this.setState({
          price: "",
          day: "",
          description: "",
          type: "",
          category: "",
        });
        Alert.alert("สำเร็จ", "บันทึกข้อมูลเรียบร้อยแล้ว");
      })
      .catch((error) => {
        console.error("Error adding document: ", error);
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

    all_data.sort((a, b) => b.day - a.day);

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
        {/* กรอกข้อมูล */}
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

        {/* ดรอปดาวของหมวดหมู่เพิ่มรายการ */}
        <Picker
          selectedValue={this.state.category}
          onValueChange={(itemValue, itemIndex) =>
            this.inputValueUpdate(itemValue, "category")
          }
          style={styles.smolinput}
        >
          {this.state.categories.map((category, index) => (
            <Picker.Item key={index} label={category} value={category} />
          ))}
        </Picker>
        <View>{this.renderAddCategoryInput()}</View>

        <TextInput
          style={styles.input}
          editable
          multiline
          numberOfLines={1}
          value={this.state.description}
          onChangeText={(val) => this.inputValueUpdate(val, "description")}
          placeholder="คำอธิบาย"
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
            <Ionicons
              name="add-circle-outline"
              size={32}
              color="white"
            ></Ionicons>
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
            <Ionicons
              name="remove-circle-outline"
              size={32}
              color="white"
            ></Ionicons>
          </TouchableOpacity>
        </View>

        <View style={styles.list}>
          <ScrollView style={{ flex: 1 }}>
            {this.state.save_list.map((item, i) => {
              const sign = item.type === "รายรับ" ? "+฿" : "-฿";
              const formattedDate = moment(item.day.toDate()).format("MM/D/YY");
              return (
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
                        ({formattedDate})
                        {/* {item.day.toLocaleString("en-US")} */}
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
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffd2ad",
  },
  rowSection: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#000",
    padding: 15,
    width: "80%",
    marginVertical: 10,
    borderRadius: 10,
    backgroundColor: "white",
  },
  smolinput: {
    borderWidth: 1,
    borderColor: "#000",
    padding: 10,
    width: "35%",
    marginVertical: 10,
    borderRadius: 10,
    margin: 5,
    backgroundColor: "white",
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
  list: {
    marginBottom: 25,
    marginTop: 15,
    width: "90%",
    backgroundColor: "white",
    borderRadius: 20,
    justifyContent: "center",
    overflow: "hidden",
    alignSelf: "center",
    elevation: 8,
    flex: 1,
  },
});

export default Addrecord;
