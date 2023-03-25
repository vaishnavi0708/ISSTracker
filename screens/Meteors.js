import React, { Component } from 'react';
import { Text, View, Alert, SafeAreaView, FlatList, StyleSheet, StatusBar, ImageBackground, Dimensions, Image } from 'react-native';
import axios from 'axios';




export default class MeteorScreen extends Component {
constructor(props){
super()
this.state={
  meteors:{}
};
}
componentDidMount(){
this.getMeteorInfo();
}

getMeteorInfo=()=>{
    axios
    .get("https://api.nasa.gov/neo/rest/v1/feed?api_key=bzlFeqTGVJ0QxflF4jCCp7CxGNVUR0HIVmeyQpjI")
    .then(response=> {
       this.setState({meteors: response.data.near_earth_objects})
    })
    .catch(error=>{
     Alert.alert(error.message)
    })
    
}

keyExtractor=(item,index)=>{
    index.toString();
}

renderItem=({item})=>{
    let meteor = item
    let bgImg,speed,size
    if(meteor.threatScore <30){
     bgImg=require("../assets/meteor_bg1.png");
     speed = require("../assets/meteor_speed1.gif");
     size = 100;
    }else if(meteor.threatScore<75){
     bgImg=require("../assets/meteor_bg2.png");
     speed=require("../assets/meteor_speed2.gif");
     size = 150;
    }else{
     bgImg=require("../assets/meteor_bg3.png");
     speed=require("../assets/meteor_speed3.gif");
     size = 250;
    }
 return(
    <View>
        <ImageBackground source={bgImg} style={styles.bgImage}>
         <View style={styles.gifContainer}>
          <Image source ={speed} style={{width:size,height:size,alignSelf:"center"}}></Image>
          <View>
            <Text style={[styles.cardTitle,{marginTop:340, marginLeft: 50}]}> {item.name} </Text>
            <Text style={[styles.cardText,{marginTop:10, marginLeft: 50}]}>Closest to Earth - {item.close_approach_data[0].close_approach_date_full}</Text>
            <Text style={[styles.cardText,{marginTop:5, marginLeft: 50}]}>Minimum diameter(km) - {item.estimated_diameter.kilometers.estimated_diameter_min}</Text>
            <Text style={[styles.cardText,{marginTop:5, marginLeft: 50}]}>Maximum diameter(km) - {item.estimated_diameter.kilometers.estimated_diameter_max}</Text>
            <Text style={[styles.cardText,{marginTop:5, marginLeft: 50}]}>Velocity(km/hr) - {item.close_approach_data[0].relative_velocity.kilometers_per_hour}</Text>
            <Text style={[styles.cardText,{marginTop:5, marginLeft: 50}]}>Missing Earth By (km) - {item.close_approach_data[0].miss_distance.kilometers}</Text>
          </View>
         </View>
        </ImageBackground>
    </View>
 )
}

    render() {
        if (Object.keys(this.state.meteors).length === 0) {
            return (
                <View
                    style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center"
                    }}>
                    <Text>Loading</Text>
                </View>
            )}
            else{
        let meteorArray = Object.keys(this.state.meteors)
        .map(meteor_date=>{
            return this.state.meteors[meteor_date]
        })
        let meteors= [].concat.apply([],meteorArray)
       

        meteors.forEach(element => {
            let diameter = (element.estimated_diameter.kilometers.estimated_diameter_min + element.estimated_diameter.kilometers.estimated_diameter_max)/2
            let threat_Score = (diameter/element.close_approach_data[0].miss_distance.kilometers)*1000000000
            element.threatScore = threat_Score
        
        });
        meteors.sort(function(a, b){return b.threatScore - a.threatScore});
        meteors = meteors.slice(0,10);
        console.log(meteors)

        return (
             <View style={ styles.container }>
                <SafeAreaView style={styles.droidSafeArea }/>
            <FlatList
            keyExtractor={this.keyExtractor}
            data={meteors}
            renderItem={this.renderItem}
            horizontal={true}
          />
            </View>
        )  
      }}
}
const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    droidSafeArea: {
        marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
    },
    bgImage:{
        flex: 1,
        resizeMode: 'cover',
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height
    },
    gifContainer:{
     justifyContent: "center",
     alignItems:"center",
     flex:1
    },
    cardTitle:{
        fontSize: 30,
        fontWeight: "bold",
        color: "white"
    },
    cardText:{
        color:"yellow"
    }

})









