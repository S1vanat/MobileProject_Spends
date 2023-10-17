import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  ScrollView,
} from "react-native";
export default function Lab3_1() {
  const [text, setText] = useState("");
  const [num, setNum] = useState("");
  const [date, setDate] = useState("");
  const [storage, setStorage] = useState([]);
  return (
    <View style={styles.container}>
      <View style={styles.searchSection}>
        <TextInput
          style={{
            borderWidth: 1,
            borderColor: "#000",
            padding: 10,
            width: "35%",
            marginVertical: 10,
          }}
          value={num}
          onChangeText={setNum}
          placeholder="จำนวน"
        />
        <TextInput
          style={{
            borderWidth: 1,
            borderColor: "#000",
            padding: 10,
            width: "35%",
            marginVertical: 10,
          }}
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
      <View style={{ width: "70%" }}>
        <Button
          onPress={() => {
            setStorage([...storage, { id: storage.length, name: text }]);
            setText("");
          }}
          title="บันทึกรายรับ"
        ></Button>
        <Button
          onPress={() => {
            setStorage([...storage, { id: storage.length, name: text }]);
            setText("");
          }}
          title="บันทึกรายจ่าย"
        ></Button>
      </View>
      <ScrollView>
        <Text>รายการที่บันทึก</Text>
        {storage.map((item) => {
          return (
            <View style={styles.view}>
              <Text style={{ fontSize: 18 }}>{item.name}</Text>
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
  searchSection: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#000",
    padding: 10,
    width: "70%",
    marginVertical: 10,
  },
});
