import React, {useEffect, useState} from 'react';
import {View, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import {
  ActivityIndicator,
  Avatar,
  Portal,
  Text,
  Title,
} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTheme} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import {useActivities, useLoading} from '../hooks';
import ActivitiesChart from '../components/charts/ActivitiesChart';
import {initialActivities, prepareActivities} from '../utils/FitnessUtils';
import i18n from '../locales';
import {tempSteps, tempCalories, tempDistances} from '../demo/data';

const ActivitiesScreen = ({navigation}) => {
  const {colors} = useTheme();
  const [activities, setActivities] = useState(initialActivities());

  const {loading, setLoadingF} = useLoading();
  const {demoAvailable, steps, calories, distances, getActivitiesF} =
    useActivities();

  useEffect(() => {
    setLoadingF(true);
    getActivitiesF();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    handleChangeData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [steps, calories, distances]);

  function handleChangeData() {
    if (demoAvailable) {
      const data = prepareActivities({
        steps: tempSteps,
        calories: tempCalories,
        distances: tempDistances,
      });
      setActivities(data);
    } else {
      const data = prepareActivities({steps, calories, distances});
      setActivities(data);
    }
  }

  function handleItemClick(item) {
    navigation.push('ActivitiesDetail', {item: item, title: item.day});
  }

  const renderItem = ({item}) => {
    return (
      <TouchableOpacity onPress={() => handleItemClick(item)}>
        <LinearGradient
          style={style.itemContainer}
          colors={[colors.gradient1, colors.gradient2]}
          start={{x: 0, y: 1}}
          end={{x: 1, y: 0}}>
          <Avatar.Icon size={40} icon="walk" />
          <View style={style.itemTextContainer}>
            <Text style={style.itemText}>{i18n.t('steps')}</Text>
            <Title style={style.itemTitle}>
              {item.steps} {i18n.t('steps')}
            </Title>
          </View>
          <Text style={style.itemDayText}>
            {item.day} {'>'}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={style.container}>
      <View style={style.container}>
        <ActivitiesChart value={activities.day0} />
        <FlatList
          style={style.listContainer}
          data={Object.values(activities)}
          keyExtractor={item => item.day}
          renderItem={renderItem}
          ListHeaderComponent={<Title>{i18n.t('workouts')}</Title>}
        />
        {loading && (
          <Portal>
            <ActivityIndicator
              animating={true}
              size="large"
              style={style.loadingContainer}
            />
          </Portal>
        )}
      </View>
    </SafeAreaView>
  );
};

const style = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  loadingContainer: {
    flex: 1,
    width: '100%',
    alignSelf: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  listContainer: {
    margin: 8,
  },
  itemContainer: {
    width: '100%',
    height: 80,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginVertical: 1,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: 'grey',
  },
  itemTextContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginLeft: 8,
  },
  itemText: {
    color: '#fff',
  },
  itemTitle: {
    color: '#fff',
  },
  itemDayText: {
    fontSize: 10,
    color: '#fff',
    marginLeft: 'auto',
  },
});

export default ActivitiesScreen;
