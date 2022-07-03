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
        type: Text, 
        label: "Tên dự án"
      },
      place: {
        type: Text,
        label: "Địa điểm"
      },
      category: {
        type: Text,
        label: "Thể loại công trình"
      },
      work: {
        type: Text,
        label: "Hạng mục"
      },
      year: {
        type: Text,
        label: "Năm hoàn thành"
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
      titleTA: {
        type: Text, 
        label: "Name project"
      },
      placeTA: {
        type: Text,
        label: "Place project"
      },
      categoryTA: {
        type: Text,
        label: "Category project"
      },
      workTA: {
        type: Text,
        label: "Work Project"
      },
      url: {
        type: Text
      },
      content: {
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