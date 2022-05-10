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
      name: { type: Text },
      username: {
        type: Text,
        isUnique: true,
      },
      password: {
        type: Password,
      },
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