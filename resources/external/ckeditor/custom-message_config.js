/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.html or http://ckeditor.com/license
 */
CKEDITOR.editorConfig = function (config) {

    config.skin = 'flat';

    config.startupFocus  = false;
    //Enable Spell Checker
    config.disableNativeSpellChecker = false;

    //Load custom font file
    config.contentsCss = '/scripts/Wits/external-libraries/ckeditor/font.css';

    config.font_defaultLabel = 'Calibri';
    config.fontSize_defaultLabel = '12pt';

    //Allow only Horizontal Resize
    config.resize_dir = 'vertical';

    //Disable resize option
    config.resize_enabled = false;

    //Set minimun height
    config.height = 'auto';
    config.imageUploadUrl = '/api/wittyparrot/api/attachments/inlineImage/';

    //Preserve Font Styles and Backgrounds When Pasting from Word
    config.pasteFromWordRemoveFontStyles = false;
    config.pasteFromWordRemoveStyles = false;
    config.pasteFromWordNumberedHeadingToList = true;

    config.allowedContent = true;
    config.extraAllowedContent = '*{*}';

    config.toolbar = 'WittyToolbar';

    config.enterMode = CKEDITOR.ENTER_P;
    config.shiftEnterMode = CKEDITOR.ENTER_P;

    config.dropMode = 'plainContent';

    config.oembed_WrapperClass = 'embededContent';
    config.oembed_maxWidth = '560';
    config.oembed_maxHeight = '315';

    config.disallowedContent = 'script';

    config.line_height="1em;1.1em;1.2em;1.3em;1.4em;1.5em" ;

    config.extraPlugins = 'custommessageplaceholder';
    config.removePlugins = 'annotation,wittyembedwit,wittyemailembedwit';

    config.toolbar_WittyToolbar = [
        {name: 'basicstyles', items: ['Bold', 'Italic', 'Strike', '-']},
        {name: 'paragraph', items: ['NumberedList', 'BulletedList']},
        {name: 'links', items: ['Link', 'Unlink']},
        {name: 'colors', items: ['TextColor']},
        {name: 'placeholder',items: ['CustomMessagePlaceholder']}
    ];
};

//Prevent CKEditor from making every element with contenteditable as inline editor
CKEDITOR.disableAutoInline = true;
