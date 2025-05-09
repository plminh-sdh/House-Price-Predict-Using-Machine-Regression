import constants from './branding';

const buttons = {
  disabledButton: {
    primaryColor: constants.grey400,
    secondaryColor: constants.white,
  },

  redButton: {
    primaryColor: constants.red,
    secondaryColor: constants.white,
  },
  greenButton: {
    primaryColor: constants.green1,
    secondaryColor: constants.white,
  },
  greyButton: {
    primaryColor: constants.grey600,
    secondaryColor: constants.white,
  },
  green400Button: {
    primaryColor: constants.green400,
    secondaryColor: constants.white,
  },
  green200Button: {
    primaryColor: constants.green200,
  },
};
const inputs = {
  styledInput: {
    placeholderText: constants.grey400,
    limitPrimaryText: constants.green600,
    limitSecondaryText: constants.red,
    errorText: constants.red,
    successText: constants.green1,
    disableBackgroundColor: constants.grey100,
    disableTextColor: constants.grey500,
    disableBorderColor: constants.grey300,
  },
  greyInput: {
    primaryColor: constants.grey600,
    secondaryColor: constants.white,
  },
  whiteInput: {
    primaryColor: constants.white,
    secondaryColor: constants.green600,
  },
  lightGreyInput: {
    primaryColor: constants.grey400,
    secondaryColor: constants.white,
    tertiaryColor: constants.grey600,
  },
  dropdownInput: {
    background: constants.white,
    disabledBackground: constants.grey200,
    disabledText: constants.grey500,
    text: constants.green600,
    borderColor: constants.grey400,
    borderInvalidColor: constants.red,
  },
  switchInput: {
    primaryColor: constants.blue300,
    secondaryColor: constants.blue300tint25,
    borderColor: constants.grey400,
    disabledBackgroundColor: constants.grey400,
  },
  checkboxInput: {
    primaryColor: constants.blue300,
    secondaryColor: constants.blue300tint25,
  },
  fileInput: {
    primaryColor: constants.blue300,
    secondaryColor: constants.grey400,
    borderColor: constants.grey400,
    white: constants.white,
    red: constants.red,
  },
};

export const brand = {
  layout: {
    background: constants.grey100,
    text: constants.green600,
    headlines: constants.green600,
    redHighlightedText: constants.red,
  },
  pageHeader: {
    primaryBackground: constants.blue300,
    secondaryBackground: constants.grey100,
    userGreetingText: constants.grey100,
    text: constants.grey100,
  },
  pageFooter: {
    text: constants.green400,
  },
  spinnerColor: {
    background: constants.green200,
    secondaryBgColor: constants.green600,
  },

  fontFamily: {
    headlines: constants.fontFamilyHeadlines,
    body: constants.fontFamilyBody,
  },

  ...buttons,

  ...inputs,

  pagination: {
    primaryColor: constants.green600,
    primaryBackgroundColor: constants.white,
    primaryBorderColor: constants.grey300,
    secondaryColor: constants.green400,
    secondaryBorderColor: constants.green400,
    thirdColor: constants.grey600,
    disableBackgroundColor: constants.grey300,
    disableColor: constants.white,
    hoverColor: constants.green400,
    hoverTextColor: constants.white,
    boxShadowColor: constants.green400tint25,
  },

  subLabel: {
    primaryColor: constants.grey400,
  },

  breadcrumb: {
    link: constants.grey400,
    linkHover: constants.blue300,
    textActive: constants.blue300,
    separator: constants.blue300,
  },

  successNotification: {
    primaryColor: constants.green200,
    secondaryColor: constants.green600,
  },
  tooltip: {
    text: constants.black,
    background: constants.white,
  },
  section: {
    titleBackgroundColor: constants.blue300,
    titleTextColor: constants.grey100,
  },
  auth: {
    backgroundColor: constants.grey100,
  },
  editModal: {
    primaryColor: constants.blue300,
    headerTextColor: constants.white,
  },
  text: {
    primaryGreen: constants.green400,
  },
  tab: {
    primaryBackgroundColor: constants.grey200,
    secondaryBackgroundColor: constants.grey100,
    textColor: constants.grey500,
    borderColor: constants.grey400,
  },
};
