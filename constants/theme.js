import { Dimensions } from "react-native";
const { width, height } = Dimensions.get("window");
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

export const COLORS = {
    // base colors
    primary: "#00943D", 

    secondary: "#2f4858",   
    lightsecondary: "#E0E0E0", 
    darksecondary: "#7F7F7F", 

    white: '#FFFFFF',
    black: "#000000",
    
    tertiary: "#1F2937",

    transparent: "transparent",

    red: "#FF4134",
    lightRed: "#FFF1F0",

    green: "#66D59A",
    ivory: "#FFFFF0"
};

export const SIZES = {
    // global sizes
    base: 8,
    font: 14,
    radius: 10,
    padding: hp(1),
    paddingY: hp(1),
    paddingX: wp(1),
    padding2: 12,

    // font sizes
    largeTitle: 50,
    h1: hp(4),
    h2: hp(3),
    h3: hp(2.2),
    h4: hp(2),
    body1: hp(2.4),
    body2: hp(2),
    body3: hp(1.8),
    body4: hp(1.6),
    body5: hp(1.5),

    // app dimensions
    width: wp(100),
    height: hp(100)
};

export const FONTS = {
    largeTitle: { fontSize: SIZES.largeTitle, lineHeight: 55 },
    h1: {  fontSize: SIZES.h1, lineHeight: 36 },
    h2: {  fontSize: SIZES.h2, lineHeight: 30 },
    h3: {  fontSize: SIZES.h3, lineHeight: 22 },
    h4: {  fontSize: SIZES.h4, lineHeight: 22 },
    body1: {  fontSize: SIZES.body1, lineHeight: 36 },
    body2: {  fontSize: SIZES.body2, lineHeight: 30 },
    body3: {  fontSize: SIZES.body3, lineHeight: 22 },
    body4: {  fontSize: SIZES.body4, lineHeight: 22 },
    body5: {  fontSize: SIZES.body5, lineHeight: 22 },
};

const appTheme = { COLORS, SIZES, FONTS };

export default appTheme;