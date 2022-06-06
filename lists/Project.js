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
  } = require('@keystonejs/fields');
  module.exports = {
    fields: {
      marker: {
        type: Relationship,
        ref: "Marker.projects",
        many: false
      },
      title: {
        type: Text
      },
      content: {
        type: Text
      }
    },
    // List-level access controls
    access: {

    },
};