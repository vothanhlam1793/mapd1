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
      note: {
        type: Text
      },
      projects: {
        type: Relationship,
        many: true,
        ref: "Project.marker"
      }
    },
    // List-level access controls
    access: {
    //   read: access.userIsAdminOrOwner,
    //   update: access.userIsAdminOrOwner,
    //   create: access.userIsAdmin,
    //   delete: access.userIsAdmin,
    //   auth: true,
    },
};