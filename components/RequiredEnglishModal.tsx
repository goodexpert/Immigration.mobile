import React from 'react';
import { StyleSheet, Modal, ModalProps, ScrollView, Text, View, Image } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

export interface RequiredEnglishModalProps extends ModalProps {
  onClose: () => void;
}

const RequiredEnglishModal: React.FC<RequiredEnglishModalProps> = (props) => {
  return (
    <>
      <Modal {...props} presentationStyle='overFullScreen'>
        <View style={styles.modalView}>
          <ScrollView style={styles.content}>
            <View style={styles.header}>
              <Text style={styles.titleText}>Required English level</Text>
              <TouchableOpacity onPress={props.onClose}>
                <FontAwesomeIcon icon={faTimes} color='white' />
              </TouchableOpacity>
            </View>
            <Text style={styles.sectionText}>👉 They have achieved the required English language test score.</Text>
            <Text style={styles.labelText}>&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp; IELTS overall score of 6.5 or more</Text>
            <Text style={styles.labelText}>&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp; TOEFL iBT overall score of 79 or more</Text>
            <Text style={styles.labelText}>
              &nbsp;&nbsp;•&nbsp;&nbsp;&nbsp; PTE Academic overall score of 58 or more
            </Text>
            <Text style={styles.labelText}>
              &nbsp;&nbsp;•&nbsp;&nbsp;&nbsp; Cambridge English B2 First (FCE) or B2 First for Schools (FCE for Schools)
              overall score of 176 or more
            </Text>
            <Text style={styles.labelText}>
              &nbsp;&nbsp;•&nbsp;&nbsp;&nbsp; OET Grade B or higher in all four skills (Listening, Reading, Writing, and
              Speaking)
            </Text>
            <Text style={styles.sectionText}>
              👉 They are a citizen of one of the following and have spent at least five years in work or education in
              one or more of those countries or Australia or New Zealand.
            </Text>
            <Text style={styles.labelText}>&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp; Canada</Text>
            <Text style={styles.labelText}>&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp; the Republic of Ireland</Text>
            <Text style={styles.labelText}>&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp; the United Kingdom</Text>
            <Text style={styles.labelText}>&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp; the United States of America</Text>
            <Text style={styles.sectionText}>
              👉 They have a recognised qualification comparable to a New Zealand level 7 bachelor's degree, gained in
              one of the following countries. It'll need to have involved at least 2 years of study in one or more of
              those countries.
            </Text>
            <Text style={styles.labelText}>&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp; Australia</Text>
            <Text style={styles.labelText}>&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp; Canada</Text>
            <Text style={styles.labelText}>&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp; New Zealand</Text>
            <Text style={styles.labelText}>&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp; the Republic of Ireland</Text>
            <Text style={styles.labelText}>&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp; the United Kingdom</Text>
            <Text style={styles.labelText}>&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp; the United States of America</Text>
            <Text style={styles.sectionText}>
              👉 They have a recognised qualification comparable to New Zealand level 8 or above, gained in one of the
              following countries. It'll need to have involved at least 1 year of study in one or more of those
              countries.
            </Text>
            <Text style={styles.labelText}>&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp; Australia</Text>
            <Text style={styles.labelText}>&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp; Canada</Text>
            <Text style={styles.labelText}>&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp; New Zealand</Text>
            <Text style={styles.labelText}>&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp; the Republic of Ireland</Text>
            <Text style={styles.labelText}>&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp; the United Kingdom</Text>
            <Text style={styles.labelText}>&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp; the United States of America</Text>
          </ScrollView>
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
  sectionText: {
    color: 'white',
    fontFamily: 'Avenir-Medium',
    fontSize: 14,
    fontWeight: '400',
    letterSpacing: 0,
    marginTop: 10,
    marginBottom: 10,
  },
  labelText: {
    color: 'white',
    fontFamily: 'Avenir-Medium',
    fontSize: 14,
    fontWeight: '400',
    letterSpacing: 0,
    marginBottom: 4,
  },
  handIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
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

export default RequiredEnglishModal;
