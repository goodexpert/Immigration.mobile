import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal, FlatList, ListRenderItemInfo } from 'react-native';

export type OnItemClicked = (index: number) => void;
export interface ActionSheetProp {
  visible: boolean;
  options: ReadonlyArray<string> | null | undefined;
  // cancelButtonIndex: number;
  // destructiveButtonIndex: number;
  title: string | null | undefined;
  // message: string | null;
  onItemClicked: OnItemClicked | undefined;
}

const renderItem = ({ item, index, separators }: ListRenderItemInfo<string>, onItemClicked: OnItemClicked) => {
  return (
    <TouchableOpacity onPress={() => onItemClicked(index)}>
      <View style={styles.listItem}>
        <Text style={styles.listItemTitle}>{item}</Text>
      </View>
    </TouchableOpacity>
  );
};

const renderItemSeparator: React.FC = () => {
  return <View style={styles.separator} />;
};

const ActionSheet: React.FC<ActionSheetProp> = (props) => {
  const { title } = props;
  const onItemClicked: OnItemClicked = (index) => {
    if (props.onItemClicked) {
      props.onItemClicked(index);
    }
  };

  return (
    <Modal animationType='fade' transparent={true} visible={props.visible}>
      <TouchableOpacity style={styles.actionSheet} onPress={() => onItemClicked(-1)}>
        <View style={styles.modalView}>
          <View style={styles.content}>
            {title !== null ? (
              <>
                <TouchableOpacity style={styles.titleLayout} onPress={() => {}}>
                  <Text style={styles.titleText}>{title}</Text>
                </TouchableOpacity>
                <View style={styles.separator} />
              </>
            ) : (
              <></>
            )}
            <FlatList
              data={props.options}
              ItemSeparatorComponent={renderItemSeparator}
              keyExtractor={(item, index) => index.toString()}
              renderItem={(item: ListRenderItemInfo<string>) => renderItem(item, onItemClicked)}
              scrollEnabled={false}
              style={styles.listView}
            />
          </View>
          <TouchableOpacity style={styles.button} onPress={() => onItemClicked(-1)}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  actionSheet: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    flex: 1,
    alignItems: 'center',
  },
  modalView: {
    position: 'absolute',
    bottom: 32,
    padding: 16,
    minWidth: '100%',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  titleText: {
    fontFamily: 'Avenir-Black',
    fontSize: 16,
    fontWeight: '800',
    paddingTop: 6,
    paddingBottom: 6,
  },
  titleLayout: {
    backgroundColor: 'white',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  content: {
    backgroundColor: 'white',
    borderRadius: 8,
  },
  listView: {
    marginLeft: 16,
    marginRight: 16,
  },
  listItem: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    minHeight: 48,
    paddingTop: 6,
    paddingBottom: 6,
  },
  listItemTitle: {
    fontFamily: 'Avenir-Medium',
    fontSize: 16,
    fontWeight: '600',
  },
  separator: {
    backgroundColor: 'lightgrey',
    minHeight: 1,
  },
  button: {
    backgroundColor: 'white',
    borderRadius: 8,
    paddingLeft: 16,
    paddingRight: 16,
    marginTop: 8,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontFamily: 'Avenir-Medium',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ActionSheet;
