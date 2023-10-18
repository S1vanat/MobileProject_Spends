import React, { Component } from "react";
import { ScrollView, Image, Touchable, TouchableOpacity } from "react-native";
import firebase from "../database/firebaseDB";
import { ListItem } from "react-native-elements";
// import Example03 from "./Example03";

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
      // console.log("res: ", res);
      // console.log("res.data() : ", res.data());

      const { description, type } = res.data();
      all_data.push({
        key: res.id,
        description,
        type,
      });
    });
    // console.log("all_data : ", all_data);
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
                  <ListItem.Title>{item.description}</ListItem.Title>
                  <ListItem.Subtitle>{item.type}</ListItem.Subtitle>
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
