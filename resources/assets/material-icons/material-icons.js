import React, {StyleSheet, Dimensions, PixelRatio} from "react-native";
const {width, height, scale} = Dimensions.get("window"),
    vw = width / 100,
    vh = height / 100,
    vmin = Math.min(vw, vh),
    vmax = Math.max(vw, vh);

export default StyleSheet.create({
    "material-icons": {
        "fontFamily": "'Material Icons'",
        "fontWeight": "normal",
        "fontStyle": "normal",
        "fontSize": 24,
        "display": "inline-block",
        "width": 1,
        "height": 1,
        "lineHeight": 1,
        "textTransform": "none",
        "letterSpacing": "normal",
        "WebkitFontSmoothing": "antialiased",
        "textRendering": "optimizeLegibility",
        "MozOsxFontSmoothing": "grayscale",
        "fontFeatureSettings": "'liga'"
    }
});