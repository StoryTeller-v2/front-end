import { View, StyleSheet } from 'react-native';
import React from 'react';
import * as Progress from 'react-native-progress';

const ProgressBar = ({ pages, now }) => {
  return (
    <View style={styles.barView}>
      <View style={styles.bar}>
        <Progress.Bar
          progress={now / pages}
          width={null}
          height={10}
          color={'rgba(255, 140, 67, 1)'}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  barView: {
    width: '90%',
    flexDirection: 'row',
    margin: (0, 'auto'),
    position: 'absolute',
    bottom: '5%',
    left: '5%',
  },
  bar: {
    margin: ('10px', 0),
    flex: 1,
  },
});

export default ProgressBar;
