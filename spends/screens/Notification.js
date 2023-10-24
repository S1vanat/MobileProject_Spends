import React, { Component } from "react";
import {
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  View,
  Text,
} from "react-native";
import firebase from "../database/firebaseDB";
import { ListItem } from "react-native-elements";
import moment from "moment";
import { AntDesign } from "@expo/vector-icons";

class Notification extends Component {
  constructor() {
    super();

    this.subjCollection = firebase.firestore().collection("lists");

    this.state = {
      subject_list: [],
      budget: 0,
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
    setTimeout(() => {
      this.subjDoc = firebase
        .firestore()
        .collection("Budget")
        .doc("cyX7uvJ70PVdlU1ZayeR");
      this.subjDoc.get().then((res) => {
        if (res.exists) {
          const subj = res.data();
          this.setState({
            key: res.id,
            budget: subj.budget,
          });
        } else {
          console.log("Document does not exist!!");
        }
      });}, 0);
    this.unsubscribe = this.subjCollection.onSnapshot(this.getCollection);
  }

  componentDidUpdate() {
    setTimeout(() => {
      this.subjDoc = firebase
      .firestore()
      .collection("Budget")
      .doc("cyX7uvJ70PVdlU1ZayeR");
    this.subjDoc.get().then((res) => {
      if (res.exists) {
        const subj = res.data();
        this.setState({
          key: res.id,
          budget: subj.budget,
        });
      } else {
        console.log("Document does not exist!!");
      }
    });
    }, 0);
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    const totalExpense = this.state.subject_list
      .filter(
        (item) =>
          item.type === "รายจ่าย" &&
          new Date(item.day).toLocaleString("en-US", { month: "long" }) ===
            new Date().toLocaleString("en-US", { month: "long" })
      )
      .reduce((acc, item) => acc + item.price, 0);
    var showSen = totalExpense > this.state.budget;
    return (
      <View style={{ flex: 1 }}>
        {showSen && (
          <View style={styles.rowSection}>
            <AntDesign name="exclamationcircleo" size={24} color="red" />
            <Text
              style={{
                textAlign: "center",
                fontSize: 16,
                color: "black",
                fontWeight: "bold",
                padding: 5,
              }}
            >
              ค่าใช้จ่ายประจำเดือนถึงเกิณฑ์ที่คุณกำหนดไว้
            </Text>
          </View>
        )}
        <ScrollView style={{ flex: 1 }}>
          {this.state.subject_list.map((item, i) => {
            const sign = item.type === "รายรับ" ? "+฿" : "-฿";
            return (
              <ListItem key={i} bottomDivider>
                <ListItem.Content
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    justifyContent: "flex-start",
                  }}
                >
                  <View>
                    <ListItem.Title style={{ fontSize: 16, textAlign: "left" }}>
                      คุณได้บันทึก{item.type} : "{item.category}"
                    </ListItem.Title>
                    <ListItem.Subtitle style={{ fontSize: 10 }}>
                      วันที่: {moment(item.day).format("MM/D/YY")}
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
        <TouchableOpacity
          style={styles.button}
          onPress={() => this.props.navigation.navigate("แก้ไขการแจ้งเตือน")}
        >
          <Text style={{ fontWeight: "bold", color: "white" }}>ตั้งค่า</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    elevation: 3,
    margin: 5,
    backgroundColor: "#EC8032",
    position: "absolute",
    bottom: 10,
    right: 10,
    alignSelf: "flex-end",
    height: "10%",
  },
  rowSection: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    margin: 20,
  },
});

export default Notification;
