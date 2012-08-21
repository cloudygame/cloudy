/*
*	If the game-game-lng is set on a HTML element, this code will change the element value to the proper language string;
*/


(function(namespace){

	var Lng	= function(){
	}


	Lng.initialize	= function(){
		this.loadFile('js/json/lng_hu.js');
		this.replace();
	}

	// replace the content of the marked elements
	Lng.replace	= function(){
		var elemArr	= $('[data-game-lng]="true"').each(function(){
			$(this).find('input, textarea').each(function() {
				game.Common.log('VAL_' + $(this).val);
			});		
			$(this).find(':not(input), :not(textarea)').each(function() {
				game.Common.log('OTHER_' + $(this).text);
			});		
		}); 
	}

	Lng.loadFile	= function( filename ){

		$.getScript(filename)
		.done(function() {
			game.Common.log('Successful loading language file via XMLHttpReq')
		})
		.fail(function() {

			var src = document.createElement('script');
			src.type = 'text/javascript';
			src.src = filename;
			src.onload = function(){
					game.Common.log('Unsuccessful XMLHttpReq language file loading -> loading local file ');
			};

			document.getElementsByTagName('head')[0].appendChild(src);

		});
	}

	namespace.Lng	= Lng;

}(game || (game	= {})));
var game;