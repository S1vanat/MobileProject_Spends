import React, { Component } from "react";
import { ScrollView, Image, Touchable, TouchableOpacity, Button } from "react-native";
import firebase from "../database/firebaseDB";
import { ListItem } from "react-native-elements";

class Checklist extends Component {
  constructor() {
    super();

    this.subjCollection = firebase.firestore().collection("lists");

    this.state = {
      subject_list: [],
    };
  }

  getCollection = (querySnapshot) => {
    const all_data = [];
    querySnapshot.forEach((res) => {
      const { description, type, price, day, category } = res.data();
      // แปลง timestamp เป็น Date object
      const dateObject = new Date(day.seconds * 1000); // คูณด้วย 1000 เพื่อแปลงเป็นมิลลิวินาที
      all_data.push({
        key: res.id,
        description,
        type,
        price,
        day: dateObject, // แปลงเป็นสตริงที่แสดงวันที่และเวลา
        category,
      });
    });
  
    all_data.sort((a, b) => b.day - a.day);

    this.setState({
      subject_list: all_data,
    });
  };

  componentDidMount() {
    this.unsubscribe = this.subjCollection.onSnapshot(this.getCollection);
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    const { navigation } = this.props;
    return (
      <ScrollView>
        {this.state.subject_list.map((item, i) => {
          return (
            <TouchableOpacity key={i}>

              <ListItem key={i} bottomDivider>
                <ListItem.Content>
                  <ListItem.Title>{item.description} {item.price} บาท</ListItem.Title>
                  <ListItem.Subtitle>ประเภท: {item.type}</ListItem.Subtitle>
                  <ListItem.Subtitle>หมวดหมู่: {item.category}</ListItem.Subtitle>
                  <ListItem.Subtitle>วันที่: {item.day.toLocaleString('en-US')}</ListItem.Subtitle>
                </ListItem.Content>
                <ListItem.Chevron />
              </ListItem>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    );
  }
}

export default Checklist;
