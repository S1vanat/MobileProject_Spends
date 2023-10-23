import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";
import firebase from "../database/firebaseDB";
import moment from "moment";

class SetNotification extends Component {
  constructor() {
    super();

    this.saveCollection = firebase.firestore().collection("lists");

    this.state = {
      price: "",
      day: "",
      description: "",
      type: "",
      category: "",
      maxExpense: "",
      save_list: [],
    };
  }

  inputValueUpdate = (val, prop) => {
    const state = this.state;
    state[prop] = val;
    this.setState(state);
  };

  updateSubject() {
    const updateSubjDoc = firebase
      .firestore()
      .collection("records")
      .doc("JuozgbXbLV7bnxmwVDVn");
    updateSubjDoc.set({
      maxExpense: this.state.maxExpense,
    });
  }

  getCollection = (querySnapshot) => {
    const all_data = [];
    querySnapshot.forEach((res) => {
      const { price, day, description, type, category } = res.data();
      const dateObject = new Date(day.seconds * 1000);
      all_data.push({
        key: res.id,
        price,
        day: dateObject,
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
    const subjDoc = firebase
      .firestore()
      .collection("records")
      .doc("JuozgbXbLV7bnxmwVDVn");
    subjDoc.get().then((res) => {
      if (res.exists) {
        const subj = res.data();
        this.setState({
          key: res.id,
          maxExpense: subj.maxExpense,
        });
      } else {
        console.log("Document does not exist!!");
      }
    });
    this.unsubscribe = this.saveCollection.onSnapshot(this.getCollection);
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    const totalExpense = this.state.save_list
      .filter(
        (item) =>
          item.type === "รายจ่าย" &&
          new Date(item.day).toLocaleString("en-US", { month: "long" }) ===
            new Date().toLocaleString("en-US", { month: "long" })
      )
      .reduce((acc, item) => acc + item.price, 0);
    return (
      <View style={styles.container}>
        <Text>ตั้งค่ารายจ่ายสูงสุด</Text>
        <TextInput
          style={styles.smolinput}
          keyboardType="number-pad"
          value={this.state.maxExpense.toString()}
          onChangeText={(val) => this.inputValueUpdate(Number(val), "maxExpense")}
          placeholder="จำนวน"
        />
        <TouchableOpacity
          style={[
            styles.button,
            {
              backgroundColor: "#EC8032",
            },
          ]}
          onPress={() => {
            this.updateSubject();
          }}
        >
          <Text>ยืนยันการแจ้งเตือน</Text>
        </TouchableOpacity>
        <View>
          <Text>ปัจจุบัน: {totalExpense} bath</Text>
        </View>
        <View>
          <Text>ใช้ได้อีก: {this.state.maxExpense - totalExpense} bath</Text>
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

export default SetNotification;
