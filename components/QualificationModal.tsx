import React from 'react';
import { StyleSheet, Modal, ModalProps, Text, View, ListRenderItemInfo } from 'react-native';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

interface QualificationLevelItem {
  name: string;
  levelRange: string;
}

const items: Array<QualificationLevelItem> = [
  { name: 'Certificates', levelRange: 'Level 1 - 4' },
  { name: 'Diplomas', levelRange: 'Level 5 - 6' },
  { name: 'Diplomas,\n Bachelor’s Degree,\n Graduate Diplomas\n and Certificates', levelRange: 'Level 7' },
  { name: 'Postgraduate Diplomas\n and Certificates,\n Bachelor Honours Degree', levelRange: 'Level 8' },
  { name: 'Master’s Degree', levelRange: 'Level 9' },
  { name: 'Doctoral Degree', levelRange: 'Level 10' },
];

type ListRenderItem = ListRenderItemInfo<QualificationLevelItem>;

export interface QualificationModalProps extends ModalProps {
  onClose: () => void;
}

const QualificationModal: React.FC<QualificationModalProps> = (props) => {
  return (
    <>
      <Modal {...props} presentationStyle='overFullScreen'>
        <View style={styles.modalView}>
          <View style={styles.content}>
            <View style={styles.header}>
              <Text style={styles.titleText}>Qualification</Text>
              <TouchableOpacity onPress={props.onClose}>
                <FontAwesomeIcon icon={faTimes} color='white' />
              </TouchableOpacity>
            </View>
            <FlatList
              data={items}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item, index }: ListRenderItem) => (
                <View style={index % 2 === 0 ? styles.listItem : styles.listItemLighter}>
                  <Text style={styles.listItemText}>{item.name}</Text>
                  <Text style={styles.listItemText}>{item.levelRange}</Text>
                </View>
              )}
              scrollEnabled={false}
              contentContainerStyle={styles.listView}
            />
          </View>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Check the Qualifications list</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  modalView: {
    flex: 1,
    backgroundColor: 'black',
    opacity: 0.9,
  },
  content: {
    flex: 1,
    backgroundColor: 'transparent',
    paddingLeft: 30,
    paddingRight: 30,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 50,
  },
  titleText: {
    color: 'white',
    fontFamily: 'Avenir-Black',
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: 0,
    marginTop: 30,
    marginBottom: 16,
  },
  listView: {
    borderBottomColor: 'lightgrey',
    borderBottomWidth: 1,
    borderTopColor: 'lightgrey',
    borderTopWidth: 1,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 34,
    paddingTop: 6,
    paddingBottom: 6,
  },
  listItemLighter: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 34,
    paddingTop: 6,
    paddingBottom: 6,
  },
  listItemText: {
    color: 'white',
    fontFamily: 'Avenir-Medium',
    fontSize: 14,
    fontWeight: '400',
    letterSpacing: 0,
    paddingLeft: 10,
    paddingRight: 10,
  },
  separator: {
    backgroundColor: 'lightgrey',
    minHeight: 1,
  },
  button: {
    backgroundColor: 'rgb(82, 51, 255)',
    borderRadius: 28,
    paddingLeft: 16,
    paddingRight: 16,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 60,
    minHeight: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontFamily: 'Avenir-Heavy',
    fontSize: 16,
  },
});

export default QualificationModal;
