import { BackHandler, NativeEventSubscription } from 'react-native';

let subscription: NativeEventSubscription | null = null;

const handleAndroidBackButton = (callback: () => void) => {
  subscription = BackHandler.addEventListener('hardwareBackPress', () => {
    callback();
    return true;
  });
};

const removeAndroidBackButtonHandler = () => {
  subscription?.remove();
  subscription = null;
};

export { handleAndroidBackButton, removeAndroidBackButtonHandler };
