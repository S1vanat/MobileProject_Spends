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
import { Alert } from "react-native";

class ChecklistDetail extends Component {
  constructor() {
    super();

    this.state = {
      price: "",
      day: "",
      description: "",
      type: "",
      category: "",
      save_list: [],
    };
  }

  componentDidMount() {
    const subjDoc = firebase
      .firestore()
      .collection("lists")
      .doc(this.props.route.params.key);
    subjDoc.get().then((res) => {
      if (res.exists) {
        const subj = res.data();
        const dateObject = new Date(subj.day.seconds * 1000);
        this.setState({
          key: res.id,
          price: subj.price,
          day: dateObject,
          category: subj.category,
          description: subj.description,
        });
      } else {
        console.log("Document does not exist!!");
      }
    });
  }

  inputValueUpdate = (val, prop) => {
    const state = this.state;
    state[prop] = val;
    this.setState(state);
  };

  updateSubject() {
    const updateSubjDoc = firebase
      .firestore()
      .collection("lists")
      .doc(this.state.key);
    const timestamp = moment(this.state.day, "MM/D/YYYY").toDate();
    updateSubjDoc.set({
      price: this.state.price,
      day: timestamp,
      description: this.state.description,
      category: this.state.category,
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.rowSection}>
          <TextInput
            style={styles.smolinput}
            keyboardType="number-pad"
            value={this.state.price.toString()}
            onChangeText={(val) => this.inputValueUpdate(val, "price")}
            placeholder="จำนวน"
          />
          <TextInput
            style={styles.smolinput}
            value={moment(this.state.day).format("MM/D/YY")}
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
              this.updateSubject();
              this.props.navigation.navigate("ตรวจสอบ");
            }}
          >
            <Text>ยืนยันการแก้ไข</Text>
          </TouchableOpacity>
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

export default ChecklistDetail;
