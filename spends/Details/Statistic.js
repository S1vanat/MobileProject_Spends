import React, { Component } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import firebase from "../database/firebaseDB";
import ProgressBar from "react-native-progress-bar-animated";
import { Picker } from "@react-native-picker/picker";

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

  countExpense() {
    const filteredExpenses = this.state.save_list.filter(
      (item) => item.type === "รายจ่าย" && this.isMonthMatch(item.day)
    );
    return filteredExpenses.length;
  }

  countIncome() {
    const filteredIncomes = this.state.save_list.filter(
      (item) => item.type === "รายรับ" && this.isMonthMatch(item.day)
    );
    return filteredIncomes.length;
  }

  isMonthMatch(date) {
    if (this.state.selectedMonth === "all") {
      return true;
    }
    const month = new Date(date).toLocaleString("en-US", { month: "long" });
    return month === this.state.selectedMonth;
  }

  render() {
    const months = [
      { label: "ทุกเดือน", value: "all" },
      { label: "มกราคม", value: "January" },
      { label: "กุมภาพันธ์", value: "February" },
      { label: "มีนาคม", value: "March" },
      { label: "เมษายน", value: "April" },
      { label: "พฏษภาคม", value: "May" },
      { label: "มิถุนายน", value: "June" },
      { label: "กรกฏาคม", value: "July" },
      { label: "สิงหาคม", value: "August" },
      { label: "กันยายน", value: "September" },
      { label: "ตุลาคม", value: "October" },
      { label: "พฤษจิกายน", value: "November" },
      { label: "ธันวาคม", value: "December" },
    ];

    const totalExpenses = this.countExpense();
    const totalIncomes = this.countIncome();

    return (
      <View style={styles.container}>
        <Picker
          selectedValue={this.state.selectedMonth}
          onValueChange={(itemValue) => {
            this.setState({ selectedMonth: itemValue });
          }}
          style={{
            height: 50,
            width: 200,
            top: 0,
            zIndex: 1,
            left: 0,
          }}
        >
          {months.map((month, index) => (
            <Picker.Item key={index} label={month.label} value={month.value} />
          ))}
        </Picker>
        
        <View style={{ flexDirection: "row" }}>

        <View
            style={[
              styles.frame,
              {
                width: "22%",
                marginTop: 10,
                marginBottom: 10,
                height: 120,
                borderWidth: 1,
                backgroundColor:'#b6faa2'
              },
            ]}
          >
            <Text style={{ fontSize: 15, alignSelf: "center" }}>รายรับ</Text>
            <Text
              style={{ fontSize: 40, fontWeight: "bold", alignSelf: "center" }}
            >
              {totalIncomes}
            </Text>
            <Text style={{ alignSelf: "center" }}>รายการ</Text>
          </View>
          <View
            style={[
              styles.frame,
              {
                width: "45%",
                marginTop: 10,
                marginBottom: 10,
                height: 120,
                borderWidth: 1,
              },
            ]}
          >
            <Text style={{ fontSize: 20, alignSelf: "center" }}>
              รายการทั้งหมด
            </Text>
            <Text
              style={{ fontSize: 40, fontWeight: "bold", alignSelf: "center" }}
            >
              {totalIncomes + totalExpenses}
            </Text>
            <Text style={{ alignSelf: "center" }}>
              รายการ
            </Text>
           
          </View>

          <View
            style={[
              styles.frame,
              {
                width: "22%",
                marginTop: 10,
                marginBottom: 10,
                height: 120,
                borderWidth: 1,
                backgroundColor:'#f28f8f'
              },
            ]}
          >
            <Text style={{ fontSize: 15, alignSelf: "center" }}>รายจ่าย</Text>
            <Text
              style={{ fontSize: 40, fontWeight: "bold", alignSelf: "center" }}
            >
              {totalExpenses}
            </Text>
            <Text style={{ alignSelf: "center" }}>รายการ</Text>
          </View>
        </View>

        <ScrollView style={styles.frame}>
          {/* เดือน 1 */}
          <View style={styles.graph}>
            <Text style={styles.textMonth}>มกราคม</Text>
            <ProgressBar
              width={190}
              height={15}
              backgroundColor="orange"
              value={
                (this.totalExpense("January") / this.totalIncome("January")) *
                100
              }
              backgroundColorOnComplete="red"
              borderRadius={5}
              useNativeDriver={true}
            />
            <Text style={{ paddingLeft: 10 }}>
              {(
                (this.totalExpense("January") / this.totalIncome("January")) *
                100
              ).toFixed(2)}
              %
            </Text>
          </View>

          {/* เดือน 2 */}
          <View style={styles.graph}>
            <Text style={styles.textMonth}>กุมภาพันธ์</Text>
            <ProgressBar
              width={190}
              height={15}
              backgroundColor="orange"
              value={
                (this.totalExpense("February") / this.totalIncome("February")) *
                100
              }
              backgroundColorOnComplete="red"
              borderRadius={5}
              useNativeDriver={true}
            />
            <Text style={{ paddingLeft: 10 }}>
              {(
                (this.totalExpense("February") / this.totalIncome("February")) *
                100
              ).toFixed(2)}
              %
            </Text>
          </View>

          {/* เดือน 3 */}
          <View style={styles.graph}>
            <Text style={styles.textMonth}>มีนาคม</Text>
            <ProgressBar
              width={190}
              height={15}
              backgroundColor="orange"
              value={
                (this.totalExpense("March") / this.totalIncome("March")) * 100
              }
              backgroundColorOnComplete="red"
              borderRadius={5}
              useNativeDriver={true}
            />
            <Text style={{ paddingLeft: 10 }}>
              {(
                (this.totalExpense("March") / this.totalIncome("March")) *
                100
              ).toFixed(2)}
              %
            </Text>
          </View>

          {/* เดือน 4 */}
          <View style={styles.graph}>
            <Text style={styles.textMonth}>เมษายน</Text>
            <ProgressBar
              width={190}
              height={15}
              backgroundColor="orange"
              value={
                (this.totalExpense("April") / this.totalIncome("April")) * 100
              }
              backgroundColorOnComplete="red"
              borderRadius={5}
              useNativeDriver={true}
            />
            <Text style={{ paddingLeft: 10 }}>
              {(
                (this.totalExpense("April") / this.totalIncome("April")) *
                100
              ).toFixed(2)}
              %
            </Text>
          </View>

          {/* เดือน 5 */}
          <View style={styles.graph}>
            <Text style={styles.textMonth}>พฏษภาคม</Text>
            <ProgressBar
              width={190}
              height={15}
              backgroundColor="orange"
              value={(this.totalExpense("May") / this.totalIncome("May")) * 100}
              backgroundColorOnComplete="red"
              borderRadius={5}
              useNativeDriver={true}
            />
            <Text style={{ paddingLeft: 10 }}>
              {(
                (this.totalExpense("May") / this.totalIncome("May")) *
                100
              ).toFixed(2)}
              %
            </Text>
          </View>

          {/* เดือน 6 */}
          <View style={styles.graph}>
            <Text style={styles.textMonth}>มิถุนายน</Text>
            <ProgressBar
              width={190}
              height={15}
              backgroundColor="orange"
              value={
                (this.totalExpense("June") / this.totalIncome("June")) * 100
              }
              backgroundColorOnComplete="red"
              borderRadius={5}
              useNativeDriver={true}
            />
            <Text style={{ paddingLeft: 10 }}>
              {(
                (this.totalExpense("June") / this.totalIncome("June")) *
                100
              ).toFixed(2)}
              %
            </Text>
          </View>

          {/* เดือน 7 */}
          <View style={styles.graph}>
            <Text style={styles.textMonth}>กรกฏาคม</Text>
            <ProgressBar
              width={190}
              height={15}
              backgroundColor="orange"
              value={
                (this.totalExpense("July") / this.totalIncome("July")) * 100
              }
              backgroundColorOnComplete="red"
              borderRadius={5}
              useNativeDriver={true}
            />
            <Text style={{ paddingLeft: 10 }}>
              {(
                (this.totalExpense("July") / this.totalIncome("July")) *
                100
              ).toFixed(2)}
              %
            </Text>
          </View>

          {/* เดือน 8 */}
          <View style={styles.graph}>
            <Text style={styles.textMonth}>สิงหาคม</Text>
            <ProgressBar
              width={190}
              height={15}
              backgroundColor="orange"
              value={
                (this.totalExpense("August") / this.totalIncome("August")) * 100
              }
              backgroundColorOnComplete="red"
              borderRadius={5}
              useNativeDriver={true}
            />
            <Text style={{ paddingLeft: 10 }}>
              {(
                (this.totalExpense("August") / this.totalIncome("August")) *
                100
              ).toFixed(2)}
              %
            </Text>
          </View>

          {/* เดือน 9 */}
          <View style={styles.graph}>
            <Text style={styles.textMonth}>กันยายน</Text>
            <ProgressBar
              width={190}
              height={15}
              backgroundColor="orange"
              value={
                (this.totalExpense("September") /
                  this.totalIncome("September")) *
                100
              }
              backgroundColorOnComplete="red"
              borderRadius={5}
              useNativeDriver={true}
            />
            <Text style={{ paddingLeft: 10 }}>
              {(
                (this.totalExpense("September") /
                  this.totalIncome("September")) *
                100
              ).toFixed(2)}
              %
            </Text>
          </View>

          {/* เดือน 10 */}
          <View style={styles.graph}>
            <Text style={styles.textMonth}>ตุลาคม</Text>
            <ProgressBar
              width={190}
              height={15}
              backgroundColor="orange"
              value={
                (this.totalExpense("October") / this.totalIncome("October")) *
                100
              }
              backgroundColorOnComplete="red"
              borderRadius={5}
              useNativeDriver={true}
            />
            <Text style={{ paddingLeft: 10 }}>
              {(
                (this.totalExpense("October") / this.totalIncome("October")) *
                100
              ).toFixed(2)}
              %
            </Text>
          </View>

          {/* เดือน 11 */}
          <View style={styles.graph}>
            <Text style={styles.textMonth}>พฤษจิกายน</Text>
            <ProgressBar
              width={190}
              height={15}
              backgroundColor="orange"
              value={
                (this.totalExpense("November") / this.totalIncome("November")) *
                100
              }
              backgroundColorOnComplete="red"
              borderRadius={5}
              useNativeDriver={true}
            />
            <Text style={{ paddingLeft: 10 }}>
              {(
                (this.totalExpense("November") / this.totalIncome("November")) *
                100
              ).toFixed(2)}
              %
            </Text>
          </View>

          {/* เดือน 12 */}
          <View style={styles.graph}>
            <Text style={styles.textMonth}>ธันวาคม</Text>
            <ProgressBar
              width={190}
              height={15}
              backgroundColor="orange"
              value={
                (this.totalExpense("December") / this.totalIncome("December")) *
                100
              }
              backgroundColorOnComplete="red"
              borderRadius={5}
              useNativeDriver={true}
            />
            <Text style={{ paddingLeft: 10 }}>
              {(
                (this.totalExpense("December") / this.totalIncome("December")) *
                100
              ).toFixed(2)}
              %
            </Text>
          </View>
        </ScrollView>
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
    marginBottom:15,
    width: "90%",
    borderRadius: 10,
    backgroundColor: "#F6F6F6",
  },
  textMonth: {
    padding: 5,
    width: 85,
  },
});

export default Statistic;
