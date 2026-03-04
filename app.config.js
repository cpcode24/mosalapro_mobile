export default {
  expo: {
    name: "MosalaPro Mobile",
    slug: "mosalapro-mobile",
    version: "1.0.0",
    platforms: ["ios", "android", "web"],
    android: {
      package: "com.mosalapro.mobile"
    },
    ios: {
      bundleIdentifier: "com.mosalapro.mobile",
      supportsTablet: true,
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false
      }
    },
    plugins: [
      [
        "@stripe/stripe-react-native",
        {
          merchantIdentifier: "merchant.com.mosalapro.mobile",
          enableGooglePay: true
        }
      ]
    ],
    web: {
      bundler: "metro"
    },
    jsEngine: "hermes",
    assetBundlePatterns: [
      "**/*"
    ],
    extra: {
      eas: {
        projectId: "6f5821f6-7e51-45fc-ac95-6f65eb28c490"
      }
    },
    orientation: "portrait"
  }
};