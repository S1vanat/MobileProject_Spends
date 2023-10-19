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

class Home extends Component {
  render() {
    return (
      <ScrollView style={{ flex: 1 }}>
        <View style={styles.container}>
          <Text style={{ fontSize: 30, fontWeight: "bold", padding: 10 }}>
            รายการที่แนะนำ
          </Text>
          <TouchableOpacity style={styles.card} onPress={() => this.props.navigation.navigate("เพิ่มรายการ")}>
            <ImageBackground
              imageStyle={{ borderRadius: 10 }}
              source={require("../assets/1000image.png")}
              style={styles.backgroundImage}
            >
              <Text style={styles.imageText}>บันทึก</Text>
            </ImageBackground>
              <Text>บันทึกรายรับ - รายจ่ายของคุณ</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.card} onPress={() => this.props.navigation.navigate("ตรวจสอบ")}>
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
            <Text>คุณใช้จ่ายไปแล้ว</Text>
            {/* ตรงนี้เดี๋ยวใส่เปอเซ้นที่จ่ายไปแล้ว */}
          </TouchableOpacity>
          {/* <View style={styles.card}>
        <Text>คุณใช้จ่ายไปแล้ว</Text>
      </View> */}

          <Text style={{ fontSize: 20, padding: 20 }}>รายการอื่นๆ</Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.smolcard}>
              <View style={styles.insmolcard}>
                <Ionicons name="bar-chart-outline" size={32} color="orange" />
              </View>
              <Text style={styles.textsmol}>สถิติ</Text>
            </View>

            <TouchableOpacity style={styles.smolcard} onPress={() => this.props.navigation.navigate("เปรียบเทียบ")}>
              <View style={styles.insmolcard}>
                <Ionicons name="podium-outline" size={32} color="orange" />
              </View>
              <Text style={styles.textsmol}>เปรียบเทียบรายจ่าย</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.smolcard} onPress={() => this.props.navigation.navigate("การแจ้งเตือน")}>
              <View style={styles.insmolcard}>
                <Ionicons name="calendar-outline" size={32} color="orange" />
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
