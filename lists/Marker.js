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
      x: {
        type: Integer
      },
      y: {
        type: Integer
      },
      name: {
        type: Text
      },
      nameTA: {
        type: Text,
        label: "Tên tiếng anh"
      },
      note: {
        type: Text
      },
      projects: {
        type: Relationship,
        many: true,
        ref: "Project.marker"
      }
    },
    labelField: "name",
    access: {

    },
};