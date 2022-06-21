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
  const { Wysiwyg } = require('@keystonejs/fields-wysiwyg-tinymce');
  const { LocalFileAdapter } = require('@keystonejs/file-adapters');
  const fileAdapter = new LocalFileAdapter({
    src: './app/public/file',
    path: '/file',
  });

  module.exports = {
    fields: {
      marker: {
        type: Relationship,
        ref: "Marker.projects",
        many: false,
        isRequired: true
      },
      title: {
        type: Text
      },
      content: {
        type: Wysiwyg
      },
      image: {
        type: File,
        adapter: fileAdapter,
        hooks: {
          beforeChange: async ({ existingItem }) => {
            if (existingItem && existingItem.image) {
              await fileAdapter.delete(existingItem.image);
            }
          },
        },  
      },
      url: {
        type: Text
      }
    },
    labelField: "title",
    hooks: {
      afterDelete: async ({ existingItem }) => {
        if (existingItem.image) {
          await fileAdapter.delete(existingItem.image);
        }
      },
    },
    // List-level access controls
    access: {

    },
};