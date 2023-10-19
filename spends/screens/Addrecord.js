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

class Addrecord extends Component {
  constructor() {
    super();

    this.saveCollection = firebase.firestore().collection("records");

    this.state = {
      money: "",
      date: "",
      info: "",
      type: "",
      save_list: [],
    };
  }

  inputValueUpdate = (val, prop) => {
    const state = this.state;
    state[prop] = val;
    this.setState(state);
  };

  storeIncome() {
    this.saveCollection
      .add({
        money: this.state.money,
        date: this.state.date,
        info: this.state.info,
        type: "รายรับ",
      })
      .then((res) => {
        this.setState({
          money: "",
          date: "",
          info: "",
          type: ""
        });
      });
  }

  storeExpenses() {
    this.saveCollection
      .add({
        money: this.state.money,
        date: this.state.date,
        info: this.state.info,
        type: "รายจ่าย",
      })
      .then((res) => {
        this.setState({
          money: "",
          date: "",
          info: "",
          type: ""
        });
      });
  }

  getCollection = (querySnapshot) => {
    const all_data = [];
    querySnapshot.forEach((res) => {
      const { money, date, info, type } = res.data();
      all_data.push({
        key: res.id,
        money,
        date,
        info,
        type,
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
            value={this.state.money}
            onChangeText={(val) => this.inputValueUpdate(val, "money")}
            placeholder="จำนวน"
          />
          <TextInput
            style={styles.smolinput}
            value={this.state.date}
            onChangeText={(val) => this.inputValueUpdate(val, "date")}
            placeholder="วันที่ / เดือน"
          />
        </View>
        <Text>รายละเอียด</Text>
        <TextInput
          style={styles.input}
          editable
          multiline
          numberOfLines={4}
          value={this.state.info}
          onChangeText={(val) => this.inputValueUpdate(val, "info")}
        />
        <View style={styles.rowSection}>
          <TouchableOpacity 
            style={{
              paddingVertical: 12,
              paddingHorizontal: 20,
              borderRadius: 10,
              elevation: 3,
              backgroundColor: "#13C999",
              margin: 5,
            }}
            onPress={() => this.storeIncome()}
          >
            <Text style={styles.text}>บันทึกรายรับ</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              paddingVertical: 12,
              paddingHorizontal: 20,
              borderRadius: 10,
              elevation: 3,
              backgroundColor: "#FF6363",
              margin: 5,
            }}
            onPress={() => this.storeExpenses()}
          >
            <Text style={styles.text}>บันทึกรายจ่าย</Text>
          </TouchableOpacity>
        </View>
        <Text>รายการที่บันทึก</Text>
        <ScrollView>
        {this.state.save_list.map((item, i) => {
          return (
            <Text>({item.date}) {item.type}: "{item.info}" {item.money} บาท</Text>
          );
        })}
      </ScrollView>
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
    flex: 1,
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
    backgroundColor: "#FF6363",
  },
});

export default Addrecord;
