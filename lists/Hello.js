const {
    File,
    Text,
    Slug,
    Relationship,
    Select,
    Password,
    Checkbox,
    CalendarDay,
    DateTime,
    Integer
  } = require('@keystonejs/fields');
  module.exports = {
    fields: {
      descript: {
        type: Text,
        label: "Lời chào"
      },
      descriptTA: {
        type: Text,
        label: "Hello"
      },
      title1: {
        type: Text,
        label: "TITLE 1"
      },
      title2: {
        type: Text,
        label: "TITLE 2"
      },
      title1TA: {
        type: Text,
        label: "TITLE 1 - ENG"
      },
      title2TA: {
        type: Text,
        label: "TITLE 2 - ENG"
      },
    },
    labelField: "name",
    access: {

    },
};