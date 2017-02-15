
/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.html or http://ckeditor.com/license
 */

CKEDITOR.editorConfig = function(config) {

    config.skin = 'flat';

    //Allow only Horizontal Resize
    config.resize_dir = 'vertical';

    //Set minimun height
    config.height = 'auto';

    //config.imageUploadUrl = '/wittyparrot/api/attachments/inlineImage/';

    config.allowedContent = true;
    config.extraAllowedContent = '*{*}';

    config.toolbar = 'WittyToolbar';
    config.readOnly = true;

    config.sharedSpaces= {
        top: 'commentToolbar'
    };
    //config.extraPlugins = '';

    config.removePlugins = 'acronym,image,image2,link,tabletools,tableresize,quicktable,table,'+
                            'wittyanchor,wittyupload,uploadimage,wittyembedwit,wittyemailembedwit';

    config.toolbar_WittyToolbar = [
        {
            name: 'annotation',
            items: ['Annotation']
        }
    ];

};

CKEDITOR.disableAutoInline = true;
