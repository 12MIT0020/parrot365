CKEDITOR.plugins.add('custommessageplaceholder', {
    requires: 'widget',
    init: function (editor) {
        var pluginName = 'custommessageplaceholder';

        //CKEDITOR.dialog.add(pluginName, this.path + 'dialogs/acronym.js');

        editor.widgets.add(pluginName,{
            defaults: {},
            template:
                '<p id="custommessageplaceholder" style="color:rgb(236, 27, 82)">'+
                'This is custom message placeholder'+
                '</p>',
            dialog: pluginName,
            edit: function(evt) {
                evt.cancel();
            },
            upcast: function(element, data) {
                var shouldUpcast = false;
                if(element.name === 'p' &&
                   element.attributes.class === 'custom-message-placeholder') {
                    shouldUpcast = true;
                }
                return shouldUpcast;
            }
        });

        // editor.ui.addButton('CustomMessagePlaceholder', {
        //     label: 'Add Placeholder',
        //     command: pluginName,
        //     icon: this.path + 'custom-message-placeholder.png'
        // });
    }
});
