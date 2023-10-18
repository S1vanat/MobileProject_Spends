import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  ScrollView,
  TouchableOpacity,
} from "react-native";
export default function Lab3_1() {
  const [text, setText] = useState("");
  const [num, setNum] = useState("");
  const [date, setDate] = useState("");
  const [storage, setStorage] = useState([]);
  return (
    <View style={styles.container}>
      <View style={styles.rowSection}>
        <TextInput
          style={styles.smolinput}
          keyboardType="number-pad"
          value={num}
          onChangeText={setNum}
          placeholder="จำนวน"
        />
        <TextInput
          style={styles.smolinput}
          value={date}
          onChangeText={setDate}
          placeholder="วันที่ / เดือน"
        />
      </View>
      <Text>รายละเอียด</Text>
      <TextInput
        style={styles.input}
        editable
        multiline
        numberOfLines={4}
        value={text}
        onChangeText={setText}
      />
      <View style={styles.rowSection}>
        <TouchableOpacity
          style={{
            paddingVertical: 12,
            paddingHorizontal: 20,
            borderRadius: 10,
            elevation: 3,
            backgroundColor: "#13C999",
            margin: 5
          }}
          onPress={() => {
            setStorage([...storage, { id: storage.length, sen: "รายรับ", name: text, money: num, date: date }]);
            setText("");
            setNum("");
            setDate("");
          }}
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
            margin: 5
          }}
          onPress={() => {
            setStorage([...storage, { id: storage.length, sen: "รายจ่าย", name: text, money: num, date: date }]);
            setText("");
            setNum("");
            setDate("");
          }}
        >
          <Text style={styles.text}>บันทึกรายจ่าย</Text>
        </TouchableOpacity>
      </View>
      <ScrollView>
        <Text>รายการที่บันทึก</Text>
        {storage.map((item) => {
          return (
            <View style={styles.view}>
              <Text style={{ fontSize: 18 }}>({item.date}) {item.sen} : {item.name} {item.money} บาท</Text>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
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
