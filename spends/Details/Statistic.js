import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";
import firebase from "../database/firebaseDB";
import ProgressBar from "react-native-progress-bar-animated";

class Statistic extends Component {
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

  totalExpense(month) {
    return this.state.save_list
      .filter(
        (item) =>
          item.type === "รายจ่าย" &&
          new Date(item.day).toLocaleString("en-US", { month: "long" }) ===
            month
      )
      .reduce((acc, item) => acc + item.price, 0);
  }

  totalIncome(month) {
    return this.state.save_list
      .filter(
        (item) =>
          item.type === "รายรับ" &&
          new Date(item.day).toLocaleString("en-US", { month: "long" }) ===
            month
      )
      .reduce((acc, item) => acc + item.price, 0);
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={[styles.frame, { width: "55%", margin: 10, flex: 1 }]}>
          <Text>กราฟสรุปรายรับ-รายจ่ายในปีนี้</Text>
        </View>
        <View style={styles.frame}>
          {/* เดือน 1 */}
          <View style={styles.graph}>
            <Text style={styles.textMonth}>มกราคม</Text>
            <ProgressBar
              width={200}
              height={15}
              backgroundColor="#B09FFF"
              value={
                (this.totalExpense("January") / this.totalIncome("January")) *
                100
              }
              backgroundColorOnComplete="red"
              borderRadius={5}
              useNativeDriver={true}
            />
          </View>

          {/* เดือน 2 */}
          <View style={styles.graph}>
            <Text style={styles.textMonth}>กุมภาพันธ์</Text>
            <ProgressBar
              width={200}
              height={15}
              backgroundColor="#B09FFF"
              value={
                (this.totalExpense("February") / this.totalIncome("February")) *
                100
              }
              backgroundColorOnComplete="red"
              borderRadius={5}
              useNativeDriver={true}
            />
          </View>

          {/* เดือน 3 */}
          <View style={styles.graph}>
            <Text style={styles.textMonth}>มีนาคม</Text>
            <ProgressBar
              width={200}
              height={15}
              backgroundColor="#B09FFF"
              value={
                (this.totalExpense("March") / this.totalIncome("March")) * 100
              }
              backgroundColorOnComplete="red"
              borderRadius={5}
              useNativeDriver={true}
            />
          </View>

          {/* เดือน 4 */}
          <View style={styles.graph}>
            <Text style={styles.textMonth}>เมษายน</Text>
            <ProgressBar
              width={200}
              height={15}
              backgroundColor="#B09FFF"
              value={
                (this.totalExpense("April") / this.totalIncome("April")) * 100
              }
              backgroundColorOnComplete="red"
              borderRadius={5}
              useNativeDriver={true}
            />
          </View>

          {/* เดือน 5 */}
          <View style={styles.graph}>
            <Text style={styles.textMonth}>พฏษภาคม</Text>
            <ProgressBar
              width={200}
              height={15}
              backgroundColor="#B09FFF"
              value={(this.totalExpense("May") / this.totalIncome("May")) * 100}
              backgroundColorOnComplete="red"
              borderRadius={5}
              useNativeDriver={true}
            />
          </View>

          {/* เดือน 6 */}
          <View style={styles.graph}>
            <Text style={styles.textMonth}>มิถุนายน</Text>
            <ProgressBar
              width={200}
              height={15}
              backgroundColor="#B09FFF"
              value={
                (this.totalExpense("June") / this.totalIncome("June")) * 100
              }
              backgroundColorOnComplete="red"
              borderRadius={5}
              useNativeDriver={true}
            />
          </View>

          {/* เดือน 7 */}
          <View style={styles.graph}>
            <Text style={styles.textMonth}>กรกฏาคม</Text>
            <ProgressBar
              width={200}
              height={15}
              backgroundColor="#B09FFF"
              value={
                (this.totalExpense("July") / this.totalIncome("July")) * 100
              }
              backgroundColorOnComplete="red"
              borderRadius={5}
              useNativeDriver={true}
            />
          </View>

          {/* เดือน 8 */}
          <View style={styles.graph}>
            <Text style={styles.textMonth}>สิงหาคม</Text>
            <ProgressBar
              width={200}
              height={15}
              backgroundColor="#B09FFF"
              value={
                (this.totalExpense("August") / this.totalIncome("August")) * 100
              }
              backgroundColorOnComplete="red"
              borderRadius={5}
              useNativeDriver={true}
            />
          </View>

          {/* เดือน 9 */}
          <View style={styles.graph}>
            <Text style={styles.textMonth}>กันยายน</Text>
            <ProgressBar
              width={200}
              height={15}
              backgroundColor="#B09FFF"
              value={
                (this.totalExpense("September") /
                  this.totalIncome("September")) *
                100
              }
              backgroundColorOnComplete="red"
              borderRadius={5}
              useNativeDriver={true}
            />
          </View>

          {/* เดือน 10 */}
          <View style={styles.graph}>
            <Text style={styles.textMonth}>ตุลาคม</Text>
            <ProgressBar
              width={200}
              height={15}
              backgroundColor="#B09FFF"
              value={
                (this.totalExpense("October") / this.totalIncome("October")) *
                100
              }
              backgroundColorOnComplete="red"
              borderRadius={5}
              useNativeDriver={true}
            />
          </View>

          {/* เดือน 11 */}
          <View style={styles.graph}>
            <Text style={styles.textMonth}>พฤษจิกายน</Text>
            <ProgressBar
              width={200}
              height={15}
              backgroundColor="#B09FFF"
              value={
                (this.totalExpense("November") / this.totalIncome("November")) *
                100
              }
              backgroundColorOnComplete="red"
              borderRadius={5}
              useNativeDriver={true}
            />
          </View>

          {/* เดือน 12 */}
          <View style={styles.graph}>
            <Text style={styles.textMonth}>ธันวาคม</Text>
            <ProgressBar
              width={200}
              height={15}
              backgroundColor="#B09FFF"
              value={
                (this.totalExpense("December") / this.totalIncome("December")) *
                100
              }
              backgroundColorOnComplete="red"
              borderRadius={5}
              useNativeDriver={true}
            />
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffd2ad",
  },
  graph: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  frame: {
    padding: 10,
    width: "80%",
    borderRadius: 10,
    backgroundColor: "#F6F6F6",
  },
  textMonth: {
    padding: 5,
    width: 85,
  },
});

export default Statistic;
