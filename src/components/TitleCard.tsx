import React from 'react';
import {Text, View, StyleSheet} from 'react-native';

export default function TitleCard({title}: any) {
  return (
    <View>
      <Text style={styles.title}>
        {title ? title : "KARTHIK'S HEALING CENTRE"}
      </Text>
      {/* <Text style={styles.title}> ACCUPUNTURE </Text> */}
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#00790D',
  },
});
