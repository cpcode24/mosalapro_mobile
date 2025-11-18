export default {
  name: "mosalapro-mobile",
  displayName: "MosalaPro Mobile",
  platforms: ["ios", "android", "web"],
  web: {
    bundler: "metro"
  },
  metro: {
    resolver: {
      alias: {
        "react-native-pager-view": "./src/components/PagerViewWrapper.js"
      },
      platforms: ["ios", "android", "web"]
    }
  },
  jsEngine: "hermes"
};