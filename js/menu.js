
(function(namespace){

	var Menu	= function(){
	}


	// set menu navigation
	Menu.initialize	= function(){
		$('#pageHome').bind('swipe', function(){
			$.mobile.changePage( "#pageSettings", { transition: "menuSlide"} );
		})

		$('#pageSettings').bind('swipeleft', function(){
			$.mobile.changePage( "#pageGame", { transition: "menuSlide"} );
		})
		
		$('#pageSettings').bind('swiperight', function(){
			$.mobile.changePage( "#pageHome", { transition: "menuSlide"} );
		})
		
		$('#pageGame').bind('swipeleft', function(){
			$.mobile.changePage( "#pageHome", { transition: "menuSlide"} );
		})

		$('#pageGame').bind('swiperight', function(){
			$.mobile.changePage( "#pageSettings", { transition: "menuSlide"} );
		})
	}

	Menu.startDrawing	= function(){
		globals.STOP_TICK_DRAW	= false;
		$('#btnDrawStart').css('visibility', 'hidden');
		$('#btnDrawStop').css('visibility', 'visible');
	}

	Menu.stopDrawing	= function(){
		globals.STOP_TICK_DRAW	= true;
		$('#btnDrawStop').css('visibility', 'hidden');
		$('#btnDrawStart').css('visibility', 'visible');
	}

	namespace.Menu	= Menu;

}(game || (game	= {})));
var game;
