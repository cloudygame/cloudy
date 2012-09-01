
(function(namespace){

	var Menu	= function(){
	}


	// set menu navigation
	Menu.initialize	= function(){

		$('#pageGame').live('pagehide', function (event) { Menu.stopDrawing();});
		$('#pageGame').live('pageshow', function (event) { Menu.startDrawing();});


		$('#pageHome').bind('swipeleft', function(){
			$.mobile.changePage( "#pageSettings", { transition: "menuSlide"} );
		})
		
		$('#pageHome').bind('swiperight', function(){
			$.mobile.changePage( "#pageGame", { transition: "reverse menuSlide"} );
		})

		$('#pageSettings').bind('swipeleft', function(){
			$.mobile.changePage( "#pageGame", { transition: "menuSlide"} );
		})
		
		$('#pageSettings').bind('swiperight', function(){
			$.mobile.changePage( "#pageHome", { transition: "reverse menuSlide"} );
		})

		// turn off the swipe on the game screen because it interfere with game controls	
		$('#pageGame').bind('swipeleft', function(){
			// $.mobile.changePage( "#pageHome", { transition: "menuSlide"} );
		})

		$('#pageGame').bind('swiperight', function(){
			// $.mobile.changePage( "#pageSettings", { transition: "reverse menuSlide"} );
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
