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
      save_list: [],
    };
  }

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
    this.unsubscribe = this.saveCollection.onSnapshot(this.getCollection);
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    const totalIncome = this.state.save_list
      .filter((item) => item.type === "รายรับ" && new Date(item.day).toLocaleString("en-US", { month: "long" }) === new Date().toLocaleString("en-US", { month: "long" }))
      .reduce((acc, item) => acc + item.price, 0);

    const totalExpense = this.state.save_list
      .filter((item) => item.type === "รายจ่าย" && new Date(item.day).toLocaleString("en-US", { month: "long" }) === new Date().toLocaleString("en-US", { month: "long" }))
      .reduce((acc, item) => acc + item.price, 0);
    return (
      <View style={styles.container}>
        <View style={styles.rowSection}>
          <TextInput
            style={styles.smolinput}
            keyboardType="number-pad"
            value={this.state.price.toString()}
            onChangeText={(val) => this.inputValueUpdate(Number(val), "price")}
            placeholder="จำนวน"
          />
          <TextInput
            style={styles.smolinput}
            value={this.state.day}
            onChangeText={(val) => this.inputValueUpdate(val, "day")}
            placeholder={moment(this.state.day).format("MM/D/YY")}
          />
        </View>

        <TextInput
          style={styles.smolinput}
          value={this.state.category}
          onChangeText={(val) => this.inputValueUpdate(val, "category")}
          placeholder="หมวดหมู่"
        />

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
                backgroundColor: "#EC8032",
              },
            ]}
            onPress={() => {
              this.updateSubject();
              this.props.navigation.navigate("ตรวจสอบ");
            }}
          >
            <Text>ยืนยันการแจ้งเตือน</Text>
          </TouchableOpacity>
        </View>
        <View>
          <Text>+{totalIncome}</Text>
        </View>
        <View>
          <Text>-{totalExpense}</Text>
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
