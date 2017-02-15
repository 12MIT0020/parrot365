CKEDITOR.plugins.add('wittyannexure',
{
	requires : ['richcombo'],
	init : function( editor )
	{
		// console.log('wittyannexure is loaded and ready');
		//  array of strings to choose from that'll be inserted into the editor
		var strings = [];
		strings.push(['@@FAQ::displayList()@@', 'FAQs', 'FAQs']);
		strings.push(['@@Glossary::displayList()@@', 'Glossary', 'Glossary']);
		strings.push(['@@CareerCourse::displayList()@@', 'Career Courses', 'Career Courses']);
		strings.push(['@@CareerProfile::displayList()@@', 'Career Profiles', 'Career Profiles']);

		// add the menu to the editor
		editor.ui.addRichCombo('wittyannexure',
		{
			label: 		'Insert Annexure',
			title: 		'Insert Annexure',
			voiceLabel: 'Insert Annexure',
			className: 	'cke_format',
			multiSelect:false,
			panel:
			{
				css: [ editor.config.contentsCss, CKEDITOR.skin.getPath('editor') ],
				voiceLabel: editor.lang.panelVoiceLabel
			},

			init: function()
			{
				this.startGroup( "Insert Annexure" );
				for (var i in strings)
				{
					this.add(strings[i][0], strings[i][1], strings[i][2]);
				}
			},

			onClick: function( value )
			{
				editor.focus();
				editor.fire( 'saveSnapshot' );
				editor.insertHtml(value);
				editor.fire( 'saveSnapshot' );
			}
		});
	}
});
