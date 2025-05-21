const { StyleSheet } = require("react-native");
const colors = require("./colors");
const tailwindCoreColors = require("./tailwindCoreColors");
export const globalStyles = StyleSheet.create({
  shadowSm: {
    shadowColor: "#929396",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.19,
    shadowRadius: 5.62,
    elevation: 6,
  },
  shadowMd: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,

    elevation: 6,
  },
});

export const Theme = {
  colors,
  ...tailwindCoreColors,
};
