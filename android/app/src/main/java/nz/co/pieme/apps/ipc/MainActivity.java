package nz.co.pieme.apps.ipc;

import android.os.Bundle;
import android.util.Log;

import com.facebook.react.ReactActivity;
import com.google.android.gms.ads.MobileAds;

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "Immigration";
  }

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    MobileAds.initialize(this, (initializationStatus) -> {
      Log.d("Immigration", "initializationStatus: " + initializationStatus);
    });
  }
}
