export const MODEL = {
  informationLinks: {
    GIT_HUB: "https://github.com/iktina/question-answering-long-seq-service",
    USER_GUIDE: "https://github.com/iktina/question-answering-long-seq-service",
    ORIGINAL_PROJECT: "https://github.com/iktina/question-answering-long-seq-service",
  },
  state: {
    response: undefined,
    numberInputValue: "",
    textInputValue: "",
    status: {
      isAllRequirementsMet: false,
      errors: [],
    },
  },
  restrictions: {
    rangeRestrictions: {
      ONLY_LATINS_TEXT_LENGTH: {
        min: 1,
        max: 100,
      },
      ONLY_NUMBERS_TEXT_LENGTH: {
        min: 1,
        max: 10,
      },
    },
    valueRestrictions: {
      ONLY_LATINS_REGEX: {
        value: "^[a-zA-Z]+$",
        errorKey: "ONLY_LATINS_REGEX_ERROR",
      },
      ONLY_NUMBERS_REGEX: {
        value: "^[0-9]+$",
        errorKey: "ONLY_NUMBERS_REGEX_ERROR",
      },
    }
  },
  service: {
    METHOD: "example_service",
  },
}

export const BLOCKS = {
    inputBlocks: {
      NUMBERS_INPUT: {
        type: "text-area",
        id: "number-input",
        name: "numberInputValue",
        rows: 3,
        edit: true,
        stateKey: "numberInputValue",
        handleFunctionKey: "handleTextInput",
        helperFunctionKey: "inputMaxLengthHelperFunction",
        rangeRestrictionKey: "ONLY_NUMBERS_TEXT_LENGTH",
        labelKey: "NUMBER_INPUT",
      },
      TEXT_INPUT: {
        type: "text-area",
        id: "text-input",
        name: "textInputValue",
        rows: 3,
        edit: true,
        stateKey: "textInputValue",
        handleFunctionKey: "handleTextInput",
        helperFunctionKey: "inputMaxLengthHelperFunction",
        rangeRestrictionKey: "ONLY_LATINS_TEXT_LENGTH",
        labelKey: "TEXT_INPUT",
      },
    },
    outputBlocks: {
      SERVICE_OUTPUT: {
        type: "text-area",
        id: "service-response",
        name: "service-response",
        rows: 3,
        edit: false,
        stateKey: "response",
        labelKey: "SERVICE_OUTPUT",
      },
      USER_TEXT_INPUT: {
        type: "text-area",
        id: "textInput",
        name: "textInput",
        rows: 3,
        edit: false,
        stateKey: "textInputValue",
        labelKey: "TEXT_INPUT",
      },
      USER_NUMBER_INPUT: {
        type: "text-area",
        id: "numberInput",
        name: "numberInput",
        rows: 3,
        edit: false,
        stateKey: "numberInputValue",
        labelKey: "NUMBER_INPUT",
      },
    },
    informationBlocks: {
      CODE: {
        labelKey: "VIEW_CODE",
        linkKey: "gitHub",
        svgPath:
          "M12.007 0C6.12 0 1.1 4.27.157 10.08c-.944 5.813 2.468 11.45 8.054 13.312.19.064.397.033.555-.084.16-.117.25-.304.244-.5v-2.042c-3.33.735-4.037-1.56-4.037-1.56-.22-.726-.694-1.35-1.334-1.756-1.096-.75.074-.735.074-.735.773.103 1.454.557 1.846 1.23.694 1.21 2.23 1.638 3.45.96.056-.61.327-1.178.766-1.605-2.67-.3-5.462-1.335-5.462-6.002-.02-1.193.42-2.35 1.23-3.226-.327-1.015-.27-2.116.166-3.09 0 0 1.006-.33 3.3 1.23 1.966-.538 4.04-.538 6.003 0 2.295-1.5 3.3-1.23 3.3-1.23.445 1.006.49 2.144.12 3.18.81.877 1.25 2.033 1.23 3.226 0 4.607-2.805 5.627-5.476 5.927.578.583.88 1.386.825 2.206v3.29c-.005.2.092.393.26.507.164.115.377.14.565.063 5.568-1.88 8.956-7.514 8.007-13.313C22.892 4.267 17.884.007 12.008 0z",
      },
      GUIDE: {
        labelKey: "USER_GUIDE",
        linkKey: "userGuide",
        svgPath:
          "M 12 2 C 6.48 2 2 6.48 2 12 s 4.48 10 10 10 s 10 -4.48 10 -10 S 17.52 2 12 2 Z m 1 15 h -2 v -6 h 2 v 6 Z m 0 -8 h -2 V 7 h 2 v 2 Z",
      },
      PROJECT: {
        labelKey: "ORIGINAL_PROJECT",
        linkKey: "originalProject",
        svgPath:
          "M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm0 11.701c0 2.857-1.869 4.779-4.5 5.299l-.498-1.063c1.219-.459 2.001-1.822 2.001-2.929h-2.003v-5.008h5v3.701zm6 0c0 2.857-1.869 4.779-4.5 5.299l-.498-1.063c1.219-.459 2.001-1.822 2.001-2.929h-2.003v-5.008h5v3.701z",
      },
    },
}

const { rangeRestrictions } = MODEL.restrictions;
export const LABELS = {
  common: {
    CHARS: "characters",
    TEXT_INPUT: "Only Latin",
    NUMBER_INPUT: "Only number",
    SERVICE_OUTPUT: "Result is",
    VIEW_CODE: "View code on Github",
    USER_GUIDE: "User's guide",
    ORIGINAL_PROJECT: "View original project",
    INVOKE_BUTTON: "Invoke",
  },
  status: {
    NO_RESPONSE: "Something went wrong...",
  },
  errors: {
    ONLY_NUMBERS_REGEX_ERROR: `The First input must contain only numbers! No more than ${rangeRestrictions.ONLY_NUMBERS_TEXT_LENGTH.max} characters`,
    ONLY_LATINS_REGEX_ERROR: `The Second input must contain only latin letters! No more than ${rangeRestrictions.ONLY_LATINS_TEXT_LENGTH.max} characters`,
  }
}