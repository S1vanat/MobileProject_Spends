import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import firebase from "../database/firebaseDB";
import ProgressBar from "react-native-progress-bar-animated";

class Home extends Component {
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
      .collection("Budget")
      .doc("cyX7uvJ70PVdlU1ZayeR");
    subjDoc.get().then((res) => {
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
    this.unsubscribe = this.saveCollection.onSnapshot(this.getCollection);
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
      <ScrollView style={{ flex: 1 }}>
        <View style={styles.container}>
          <Text style={{ fontSize: 30, fontWeight: "bold", padding: 10 }}>
            รายการที่แนะนำ
          </Text>
          <TouchableOpacity
            style={styles.card}
            onPress={() => this.props.navigation.navigate("เพิ่มรายการ")}
          >
            <ImageBackground
              imageStyle={{ borderRadius: 10 }}
              source={require("../assets/1000image.png")}
              style={styles.backgroundImage}
            >
              <Text style={styles.imageText}>บันทึก</Text>
            </ImageBackground>
            <Text>บันทึกรายรับ - รายจ่ายของคุณ</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.card}
            onPress={() => this.props.navigation.navigate("ตรวจสอบ")}
          >
            <ImageBackground
              source={require("../assets/1001.png")}
              imageStyle={{ borderRadius: 10 }}
              style={{
                width: "100%",
                height: 180,
                marginBottom: 10,
                borderRadius: 10,
              }}
            >
              <Text style={styles.imageText}>ตรวจสอบรายการ</Text>
            </ImageBackground>
            <Text style={{ margin: 5 }}>
              เดือนนี้คุณใช้จ่ายไปแล้ว (
              {((totalExpense / this.state.budget) * 100).toFixed(2)}%)
            </Text>
            {/* ตรงนี้เดี๋ยวใส่เปอเซ้นที่จ่ายไปแล้ว */}
            <ProgressBar
              width={275}
              height={15}
              backgroundColor="#B09FFF"
              value={(totalExpense / this.state.budget) * 100}
              backgroundColorOnComplete="red"
              borderRadius={5}
              useNativeDriver={true}
            />
          </TouchableOpacity>

          <Text style={{ fontSize: 20, padding: 20 }}>รายการอื่นๆ</Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity
              style={styles.smolcard}
              onPress={() =>
                this.props.navigation.navigate("สถิติในแต่ละเดือน")
              }
            >
              <View style={styles.insmolcard}>
                <Ionicons name="bar-chart-outline" size={32} color="#EC8032" />
              </View>
              <Text style={styles.textsmol}>สถิติ</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.smolcard}
              onPress={() => this.props.navigation.navigate("เปรียบเทียบ")}
            >
              <View style={styles.insmolcard}>
                <Ionicons name="podium-outline" size={32} color="#EC8032" />
              </View>
              <Text style={styles.textsmol}>เปรียบเทียบรายจ่าย</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.smolcard}
              onPress={() => this.props.navigation.navigate("การแจ้งเตือน")}
            >
              <View style={styles.insmolcard}>
                <Ionicons name="calendar-outline" size={32} color="#EC8032" />
              </View>
              <Text style={styles.textsmol}>ตารางการแจ้งเตือน</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 30,
    flex: 1,
    alignItems: "center",
  },
  backgroundImage: {
    width: "100%",
    height: 120,
    justifyContent: "center",
    marginBottom: 10,
  },
  imageText: {
    fontSize: 16,
    width: 10,
    color: "white",
    textAlign: "center",
    position: "absolute",
    top: "30%",
    left: 0,
    right: 0,
    paddingRight: 260,
    padding: 10,
    borderRadius: 10,
  },
  rowSection: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: 350,
    maxWidth: "80%",
    alignItems: "center",
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    shadowOpacity: 0.26,
    backgroundColor: "white",
    paddingBottom: 20,
    elevation: 8,
    borderRadius: 20,
    margin: 10,
  },
  smolcard: {
    width: 145,
    maxWidth: "80%",
    height: 120,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    shadowOpacity: 0.26,
    backgroundColor: "white",
    padding: 10,
    elevation: 8,
    borderRadius: 20,
    margin: 5,
  },
  textsmol: {
    paddingTop: 10,
  },
  insmolcard: {
    backgroundColor: "#fae4d9",
    borderRadius: 10,
    width: 80,
    height: 55,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
});
export default Home;
