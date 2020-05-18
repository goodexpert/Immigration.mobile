import React from 'react';
import { StyleSheet, Modal, ModalProps, Text, View, Linking, TouchableOpacity } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

export interface ExperienceMoalProps extends ModalProps {
  onClose: () => void;
}

const ExperienceModal: React.FC<ExperienceMoalProps> = (props) => {
  const URL =
    'https://www.immigration.govt.nz/new-zealand-visas/apply-for-a-visa/tools-and-information/work-and-employment/full-occupation-list';
  const onPress = () => {
    Linking.openURL(URL).catch((err) => console.error('An error occurred', err));
  };

  return (
    <>
      <Modal {...props} presentationStyle='overFullScreen' transparent={true}>
        <View style={styles.modalView}>
          <View style={styles.content}>
            <View style={styles.header}>
              <Text style={styles.titleText}>Work experience</Text>
              <TouchableOpacity style={styles.closeButton} onPress={props.onClose}>
                <FontAwesomeIcon icon={faTimes} color='white' />
              </TouchableOpacity>
            </View>
            <Text style={styles.labelText}>
              Search your occupation on the ANZSCO list to find the job that best matches the work experience you are
              claiming points for.
            </Text>
          </View>
          <TouchableOpacity style={styles.button} onPress={onPress}>
            <Text style={styles.buttonText}>Search my occupation</Text>
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
  closeButton: {
    color: 'rgb(0, 0, 0)',
    padding: 20,
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
  labelText: {
    color: 'white',
    fontFamily: 'Avenir-Medium',
    fontSize: 14,
    fontWeight: '400',
    letterSpacing: 0,
    marginBottom: 4,
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

export default ExperienceModal;
