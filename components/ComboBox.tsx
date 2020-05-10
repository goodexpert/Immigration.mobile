import React from 'react';
import { StyleSheet, ViewProps, Text, TouchableOpacity } from 'react-native';

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import ActionSheet from './ActionSheet';

export interface Item {
  label?: string;
  value?: string;
}

export interface ComboBoxProps extends ViewProps {
  /**
   * If true the user won't be able to toggle the checkbox. Default value is false.
   */
  disabled?: boolean;

  /**
   * Invoked with the new selected index when the selection changes.
   */
  onItemSelected?: (index: number) => void;

  /**
   * The string that will be rendered before text input has been entered
   */
  placeholder?: string;

  /**
   * For simplicity, data is just a plain array. If you want to use something else,
   * like an immutable list, use the underlying VirtualizedList directly.
   */
  data: ReadonlyArray<string> | null | undefined;

  /**
   * The index in props.values of the combobox to be (pre)selected.
   */
  selectedIndex: number | null | undefined;

  /**
   * The label of the checkbox.
   */
  label?: string;

  /**
   * The value of the checkbox. If true the checkbox will be turned on. Default value is false.
   */
  value?: boolean;
}

const ComboBox: React.FC<ComboBoxProps> = (props) => {
  const [visiblePicker, setVisiblePicker] = React.useState(false);
  const [selectedIndex, setSelectedIndex] = React.useState(
    props.selectedIndex !== null ? (props.selectedIndex as number) : -1
  );

  const onItemClicked = (index: number) => {
    if (index !== -1 && index !== selectedIndex) {
      if (props.onItemSelected) {
        props.onItemSelected(index);
      }
      setSelectedIndex(index);
    }
    setVisiblePicker(false);
  };

  const getTextLabel = () => {
    return selectedIndex < 0 ? props.placeholder : props.data ? props.data[selectedIndex] : '';
  };

  return (
    <>
      <TouchableOpacity style={styles.comboBoxContainer} onPress={() => setVisiblePicker(true)}>
        <Text style={selectedIndex === -1 ? styles.placeHolderTextColor : styles.labelText}>{getTextLabel()}</Text>
        <FontAwesomeIcon icon={faChevronDown} style={styles.comboBoxIcon} />
      </TouchableOpacity>
      <ActionSheet
        options={props.data}
        title={props.placeholder}
        visible={visiblePicker}
        onItemClicked={onItemClicked}
      />
    </>
  );
};

const styles = StyleSheet.create({
  comboBoxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 38,
    marginBottom: 12,
    borderBottomColor: 'rgb(0, 0, 0)',
    borderBottomWidth: 1.0,
  },
  placeHolderTextColor: {
    color: 'rgba(26, 24, 36, 0.5)',
    fontFamily: 'Avenir-Medium',
    fontSize: 16,
    letterSpacing: 0,
  },
  labelText: {
    color: 'black',
    fontFamily: 'Avenir-Medium',
    fontSize: 16,
    letterSpacing: 0,
  },
  comboBoxIcon: {
    color: 'rgb(56, 59, 65)',
  },
});

export default ComboBox;
