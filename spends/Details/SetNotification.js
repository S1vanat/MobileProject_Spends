import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";
import firebase from "../database/firebaseDB";
import ProgressBar from "react-native-progress-bar-animated";

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
      budget: "",
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
      .collection("Budget")
      .doc("cyX7uvJ70PVdlU1ZayeR");
    updateSubjDoc.set({
      budget: this.state.budget,
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
        <Text style={{ fontWeight: "bold", fontSize: 16 }}>ตั้งค่ารายจ่ายสูงสุด</Text>
        <TextInput
          style={styles.smolinput}
          keyboardType="number-pad"
          value={this.state.budget.toString()}
          onChangeText={(val) => this.inputValueUpdate(Number(val), "budget")}
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
            this.props.navigation.navigate("แจ้งเตือน");
            this.updateSubject();
          }}
        >
          <Text style={{ fontWeight: "bold", color: "white" }}>ยืนยันการแจ้งเตือน</Text>
        </TouchableOpacity>
        <View style={styles.frame}>
          <View style={styles.rowSection}>
            <Text style={{ fontWeight: "bold", padding: 2 }}>ปัจจุบัน:</Text>
            <Text style={{ padding: 2 }}>
              {totalExpense} ฿ (
              {((totalExpense / this.state.budget) * 100).toFixed(2)}%)
            </Text>
          </View>
          <View style={styles.rowSection}>
            <Text style={{ fontWeight: "bold", padding: 2 }}>ใช้ได้อีก:</Text>
            <Text style={{ padding: 2 }}>
              {Math.max((this.state.budget - totalExpense), 0)} ฿ (
              {(
                Math.min(Math.max((this.state.budget - totalExpense) / this.state.budget * 100, 0), 100)
              ).toFixed(2)}
              %)
            </Text>
          </View>
          <ProgressBar
            width={268}
            height={15}
            backgroundColor="orange"
            value={Math.min((totalExpense / this.state.budget) * 100, 100)}
            
            borderRadius={5}
            useNativeDriver={true}
          />
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
  },
  frame: {
    padding: 10,
    width: "80%",
    borderRadius: 10,
    backgroundColor: "white",
    margin: 10,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    shadowOpacity: 0.26,
    elevation: 8,
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
});

export default SetNotification;
