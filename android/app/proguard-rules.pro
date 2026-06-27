# ProGuard rules for AlBostan Store
-keepattributes *Annotation*
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}
-keep class com.albostanstore.app.** { *; }
