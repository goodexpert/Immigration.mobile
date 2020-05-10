import React from 'react';
import { StyleSheet, ViewProps, Text, TouchableOpacity } from 'react-native';

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCircle } from '@fortawesome/free-regular-svg-icons';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';

// https://facebook.github.io/react-native/docs/checkbox.html
export interface CheckBoxProps extends ViewProps {
  /**
   * If true the user won't be able to toggle the checkbox. Default value is false.
   */
  disabled?: boolean;

  /**
   * Used in case the props change removes the component.
   */
  onChange?: (value: boolean) => void;

  /**
   * Invoked with the new value when the value changes.
   */
  onValueChange?: (value: boolean) => void;

  /**
   * Used to locate this view in end-to-end tests.
   */
  testID?: string;

  /**
   * The label of the checkbox.
   */
  label?: string | Element;

  /**
   * The value of the checkbox. If true the checkbox will be turned on. Default value is false.
   */
  value?: boolean;
}

const CheckBox: React.FC<CheckBoxProps> = (props) => {
  const [value, setValue] = React.useState(props.value);

  const onClicked = () => {
    const newVal = value ? false : true;

    if (props.onValueChange) {
      props.onValueChange(newVal);
    }
    setValue(newVal);
  };

  const getValueIcon = () => {
    return props.value ? faCheckCircle : faCircle;
  };

  React.useLayoutEffect(() => {
    if (props.value !== value) {
      setValue(props.value);
    }
  });

  return (
    <TouchableOpacity style={styles.checkBoxContainer} disabled={props.disabled} onPress={onClicked}>
      <FontAwesomeIcon icon={getValueIcon()} style={styles.checkBoxIcon} />
      <Text style={styles.labelText}>{props.label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  checkBoxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    minHeight: 48,
    paddingTop: 12,
    paddingBottom: 12,
  },
  checkBoxLabel: {
    fontFamily: 'Avenir-Medium',
    fontSize: 14,
    fontWeight: '600',
    marginRight: 30,
  },
  checkBoxIcon: {
    color: 'rgb(56, 59, 65)',
    marginRight: 8,
  },
  labelText: {
    color: 'black',
    fontFamily: 'Avenir-Medium',
    fontSize: 14,
    letterSpacing: 0,
  },
});

export default CheckBox;
