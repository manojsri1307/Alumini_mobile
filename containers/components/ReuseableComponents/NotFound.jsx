import {Image, StyleSheet, Text, View} from 'react-native';

const DisableScreen = () => {
  return (
    <View style={styles.contnet}>
      <View style={styles.mainContent}>
       <Image source={require("../../assets/404Img.jpg")} style={styles.DisableImg}/>
       <Text style={styles.text}><Text style={styles.text2}> Oops!</Text> Nothing to show here right now. </Text>
      </View>
    </View>
  );
};

  const styles = StyleSheet.create({
    contnet : {
      flex: 1,
      backgroundColor:"#fff"
    },
    mainContent:{
        alignSelf:"center",
        position:"relative",
        top:"25%"
    },
    text:{
        alignSelf:"center",
        marginTop:30,
        fontSize:12,
        fontWeight:400,
    },
    text2:{
        color:"red",
        fontWeight:800,
        fontSize:22,
    },
    DisableImg : {
        width:300,
        height:200,
        alignSelf:"center"

    }
  });
export default DisableScreen;
