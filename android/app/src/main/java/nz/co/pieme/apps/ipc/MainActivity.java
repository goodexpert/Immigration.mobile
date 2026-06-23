package nz.co.pieme.apps.ipc;

import android.os.Bundle;
import android.util.Log;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint;
import com.facebook.react.defaults.DefaultReactActivityDelegate;
import com.google.android.gms.ads.MobileAds;

public class MainActivity extends ReactActivity {

  @Override
  protected String getMainComponentName() {
    return "Immigration";
  }

  @Override
  protected ReactActivityDelegate createReactActivityDelegate() {
    return new DefaultReactActivityDelegate(
        this,
        getMainComponentName(),
        DefaultNewArchitectureEntryPoint.getFabricEnabled());
  }

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    MobileAds.initialize(this, initializationStatus ->
        Log.d("Immigration", "MobileAds initialized: " + initializationStatus));
  }
}
