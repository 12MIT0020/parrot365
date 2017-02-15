
/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.html or http://ckeditor.com/license
 */

CKEDITOR.editorConfig = function(config) {

    config.skin = 'flat';

    config.startupFocus = false;
    //Enable Spell Checker
    config.disableNativeSpellChecker = false;

    //Load custom font file
    config.contentsCss = '/scripts/external-libraries/ckeditor/font.css';

    //Allow only Horizontal Resize
    config.resize_dir = 'vertical';

    //Disable resize option
    config.resize_enabled = false;

    //Set minimun height
    //config.minHeight = '560px';
    //config.height = 'auto';

    //Preserve Font Styles and Backgrounds When Pasting from Word
    config.pasteFromWordRemoveFontStyles = false;
    config.pasteFromWordRemoveStyles = false;
    config.pasteFromWordNumberedHeadingToList = true;

    config.allowedContent = true;
    config.extraAllowedContent = '*{*}';

    config.toolbar = 'WittyToolbar';

    //config.enterMode = CKEDITOR.ENTER_P;
    //config.enterMode = CKEDITOR.ENTER_BR;
    //config.shiftEnterMode = CKEDITOR.ENTER_P;
    config.enterMode = CKEDITOR.ENTER_DIV;
    config.shiftEnterMode = CKEDITOR.ENTER_DIV;

    config.extraPlugins = 'wittyembedwit';
    // config.extraPlugins = 'acronym'; //need a new build after qa - webapp + parrot365

    config.imageUploadUrl = '/api/wittyparrot/api/attachments/inlineImage/';

    config.oembed_WrapperClass = 'embededContent';
    config.oembed_maxWidth = '560';
    config.oembed_maxHeight = '315';

    config.disallowedContent = 'script, iframe';

    //If pasted content has any of these styles don't remove it
    config.pasteFilter = null;

    config.sharedSpaces= {
        top: 'editorToolbar'
    };

    config.line_height = "1em;1.1em;1.2em;1.3em;1.4em;1.5em";
    //config.removePlugins = 'annotation,resize';
    config.removePlugins = 'annotation,resize,wittyemailembedwit';

    config.toolbar_WittyToolbar = [
        {
            name: 'basicstyles',
            items: ['Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript', '-', 'RemoveFormat']
        },
        {
            name: 'revert',
            items: ['Undo', 'Redo']
        },
        '/',
        {
            name: 'paragraph',
            items: ['NumberedList', 'BulletedList', 'Indent', 'Outdent']
        }, {
            name: 'justify',
            items: ['JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock', '-']
        },
        {
            name: 'anchor',
            items: ['WittyAnchor']
        },
        '/',
        {
            name: 'insert',
            items: ['Table', 'oembed', 'PageBreak', 'Wittyupload', 'Acronym']
        }, {
            name: 'links',
            items: ['Link', 'Unlink', 'wittyhotlinks', 'wittywebview']
        },
        '/',
        {
            name: 'styles',
            items: ['Format', 'Font', 'FontSize', 'DefaultFontStyle', 'TextColor', 'BGColor']

        },
        {
            name: 'clipboard',
            items: ['Cut', 'Paste', 'PasteText', 'PasteFromWord', '-', 'Wittyprint']
        }
    ];

    config.fontSize_sizes = '8/8.0pt;9/9.0pt;10/10.0pt;11/11.0pt;12/12.0pt;14/14.0pt;16/16.0pt;'+
        '18/18.0pt;20/20.0pt;22/22.0pt;24/24.0pt;26/26.0pt;28/28.0pt;36/36.0pt;48/48.0pt;72/72.0pt;';

};

CKEDITOR.disableAutoInline = true;
CKEDITOR.dtd.$editable.span = 1;
