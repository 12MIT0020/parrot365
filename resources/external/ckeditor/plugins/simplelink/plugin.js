CKEDITOR.plugins.add("SimpleLink",{icons:"simplelink",init:function(a){a.addCommand("simplelink",new CKEDITOR.dialogCommand("simplelinkDialog"));a.ui.addButton("SimpleLink",{label:"Add a link",icons:"simplelink",command:"simplelink"});CKEDITOR.dialog.add("simplelinkDialog",this.path+"dialogs/simplelink.js")}});