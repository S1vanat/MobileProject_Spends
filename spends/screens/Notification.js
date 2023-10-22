import React, { Component } from "react";
import {
  StyleSheet,
  ScrollView,
  Image,
  Touchable,
  TouchableOpacity,
  Button,
  View,
  Text,
} from "react-native";
import firebase from "../database/firebaseDB";
import { ListItem } from "react-native-elements";
import moment from "moment";

class Notification extends Component {
  constructor() {
    super();

    this.subjCollection = firebase.firestore().collection("lists");

    this.state = {
      subject_list: [],
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
    return (
      <View style={{ flex: 1 }}>
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
});

export default Notification;
