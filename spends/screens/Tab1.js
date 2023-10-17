import React from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";
const Tab1 = (props) => {
  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 30, fontWeight: "bold" }}>รายการที่แนะนำ</Text>
      <View style={styles.card}>
        <Text>บันทึก</Text>
      </View>
      <View style={styles.card}>
        <Text>ตรวจสอบราการ</Text>
      </View>
      <View style={styles.card}>
        <Text>คุณใช้จ่ายไปแล้ว</Text>
      </View>

      <Text style={{ fontSize: 20 }}>รายการอื่นๆ</Text>

      <View style={styles.rowSection}>
        <View style={styles.smolcard}>
          <Text>สถิติ</Text>
        </View>
        <View style={styles.smolcard}>
          <Text>เปรียบเทียบรายจ่าย</Text>
        </View>
        <View style={styles.smolcard}>
          <Text>ตารางการแจ้งเตือน</Text>
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    marginVertical: 30,
    flex: 1,
    alignItems: "center",
  },
  rowSection: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: 300,
    maxWidth: "80%",
    alignItems: "center",
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    shadowOpacity: 0.26,
    backgroundColor: "white",
    padding: 20,
    elevation: 8,
    borderRadius: 20,
    margin: 5
  },
  smolcard: {
    width: 100,
    maxWidth: "80%",
    height: 100,
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
    margin: 5
  },
});
export default Tab1;
