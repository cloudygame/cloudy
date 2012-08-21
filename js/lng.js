/*
*	Language - localization
*
*	Every tag content text will be replaced with [data-game-localize] = its localized version.
*
*
*/


(function(namespace){

	var Lng	= new Object;

	Lng.filename	= null;
	Lng.browserLang	= null;
	Lng.tmpJqElem	= null;

	// load the lang file depending on browser and use it
	Lng.initialize	= function( callback ){
		// load only once
		if ( this.filename == null ){
			this.browserLang = (navigator.language) ? navigator.language : navigator.userLanguage; 
			this.loadFile( this.browserLang, callback );
			game.Common.log('Browser language:' + this.browserLang + ' -- loading: ' + this.filename);
		}

	}


	/*
	* localize inside the given element
	*
	* Sz@páshalmaz: 
	*	A jquerymobile nem parsolja végig a teljes tartalmat, csak az aktuálisan megjelenítendő lapcsokáját.
	*	Csakhogy mikor átforgatja, kicseréli a HTML tageket!! így qrvára nem lehet ID-val hivatkozni a tartalmakra.
	*	Tehát pl. $('#id').text('valami') szétqrja a megjelenítést.
	*	Ezért mindig csak az aktuális lapot lehet átfordítani a megfelelő nyelvre. 
	*	Csakhogy az aktuális lap előtt lefutó eventjébe rakva a forgatást, a js nyelvi fájl még nem töltődik be.
	*	Ezért kell a szüttyögés a callbackkal.
	*/

	Lng.replace	= function( jqElem ){
		if (this.filename == null){
			this.tmpJqElem	= jqElem;
			this.initialize( function(){ game.Lng.replace(game.Lng.tmpJqElem) } );
		}else{
			var elemArr = jqElem.find('[data-game-localize]').each(function() {
				var tmpSrcStr	= $(this).attr('data-game-localize');
				var tmpTo		= globals.LNG_JSON[tmpSrcStr];

				if ($(this).is('input, textarea, option')) {
					var newStr	= typeof tmpTo == 'undefined' ? '__' + $(this).val() + '__' : tmpTo ;
					$(this).val(newStr);
	// game.Common.log('LNG val: ' + tmpSrcStr + ' = ' + tmpTo );
				} else if( $(this).is('h1')){
					var newStr	= typeof tmpTo == 'undefined' ? '__' + $(this).text() + '__' : tmpTo ;
					$(this).text(newStr);
				} else {
					var newStr	= typeof tmpTo == 'undefined' ? '__' + $(this).text() + '__' : tmpTo ;
					$(this).find('.ui-btn-text').text(newStr);
	// game.Common.log('LNG text: ' + tmpSrcStr + ' = ' + tmpTo );
				}
			});

		}
	
	}


	/*
	*	try to load file with jquery via XMLHttpRequest and on fail try to load it another (ugly?) way
	*/
	Lng.loadFile	= function( lng, callback ){

		fn	= 'js/json/lng_' + lng.substr(0,2) + '.js';

		$.getScript(fn)
		.done(function() {
			game.Common.log('Successful loading language file via XMLHttpReq : ' + fn + ' callback : ' + typeof callback );
			if ( typeof callback != 'undefined' ){
				callback.call();
			}
		})
		.fail(function() {

			var src = document.createElement('script');
			src.type = 'text/javascript';
			src.src = fn;
			src.onload = function(){
				game.Common.log('Unsuccessful XMLHttpReq language file loading -> loading local file : ' + fn);
				if ( typeof callback != 'undefined' ){
					callback.call();
				}
			};

			document.getElementsByTagName('head')[0].appendChild(src);

		});

		this.filename	= fn;

	}

	namespace.Lng	= Lng;

}(game || (game	= {})));
var game;