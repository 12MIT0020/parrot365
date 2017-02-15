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

    config.extraPlugins = 'wittyemailembedwit,wittyannexure';
    config.removePlugins = 'annotation,wittyembedwit,acronym';

    config.toolbar_WittyToolbar = [
        {name: 'basicstyles', items: ['Bold', 'Italic', 'Strike', 'Subscript', 'Superscript', '-']},
        {name: 'paragraph', items: ['NumberedList', 'BulletedList', 'Indent', 'Outdent']},
        {name: 'tools', items: ['Maximize', '-']},
        {name: 'justify', items: ['JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock', '-']},
        {name: 'insert', items: ['Table','oembed']},
        {name: 'links', items: ['Link', 'Unlink']},
        {name: 'clipboard', items: ['Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-']},
        {name: 'revert', items: ['Undo', 'Redo']},
        {name: 'oembed', items: ['Oembed']},
        {name: 'styles', items: [ 'Format', 'Font', 'FontSize' ] },
        {name: 'colors', items: ['TextColor', 'BGColor']},
        // {name: 'signature', items: ['wittyannexure']},
    ];
};

//Prevent CKEditor from making every element with contenteditable as inline editor
CKEDITOR.disableAutoInline = true;

//CKEDITOR.inline('editable');

/*
 CKEDITOR.inline( 'editable1', {
 customConfig: 'editableConfig.js'
 } );
 */

//CKEDITOR.config.allowedContent = true;


CKEDITOR.on('instanceReady', function ( evt ) {

    /*    event.editor.document.on('drop', function (evt) {
        console.log(CKEDITOR.instances.editable.getSelection().getStartElement().$);
    });


    evt.editor.dataProcessor.dataFilter.addRules( {
        elements : {
            div : function( element ) {
                element.attributes.style = 'color: yellow;'
            }
        }
    });

    evt.editor.dataProcessor.htmlFilter.addRules( {
        elements : {
            div : function( element ) {
                console.log(element);
                element.attributes.style = 'font-size:' + 72 + 'px;'
            }
        }
    });
    */


    //CKEDITOR.instances.editable.insertText('some text here');
    //CKEDITOR.config.fontSize_sizes = '8/0.5em;9/0.55em;10/0.625em;11/0.7em;12/0.725em;';
});
