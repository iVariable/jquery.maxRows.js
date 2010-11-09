/**
 * jQuery.maxRows
 * 
 * Limiting Maximum rows of content in textarea
 * 
 * Copyright (c) 2010 Vladimir Savenkov <iVariable@gmail.com>
 * Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) licenses.
 * 
 * Version: 0.1
 *
 * Demo and documentation: (LINK)
 */
(function($){
	
	var helpers = {
		
		checkAndMake: function( height ){
			var $this = $(this);
			var maxHeight = $this.data('maxHeight');						 
			while( $this.attr('scrollHeight') > maxHeight ){
				$this.val( $this.val().slice(0,-1) );								
			}									
		},
		
		determineMaxRowsByHeight: function(){
						
		},
		
		determineMaxHeightByRows: function( rows ){
			
		}		
		
	}
	
	var methods = {
		getMaxRows: function(){
			var result = {
				'maxRows': this.data('maxRows'),
				'maxHeight': this.data('maxHeight')
			};	
			return (result.maxHeight == null)?null:result;
		},
		
		setMaxRows: function( rows ){			
			var maxRows = parseInt( rows );
			if( maxRows == 'NaN' ) maxRows = -1;
			
			return this.each(function(){		
				var $this = $(this);
				if( $this.attr('type') != 'textarea' ) return;				
				var maxHeight = 0;
				var maxRowsThis = maxRows;
				if (maxRowsThis == -1) {
					maxRowsThis = helpers.determineMaxRowsByHeight.apply( $this );
					maxHeight = $this.attr('offsetHeight');					
				}else{
					maxHeight = helpers.determineMaxHeightByRows.apply( $this, [maxRowsThis] );
				};	
							
				if( maxRowsThis == 0 ){ // Remove row limit					
					$this.unbind( '.maxrows' );
					$this.removeData( 'maxRows' ).removeData( 'maxHeight' );
				}else{	
					
					$this.bind( 'keydown.maxrows', function( e ){																		
						helpers.checkAndMake.apply( this, arguments );						
					});
					$this.bind( 'keyup.maxrows', function( e ){																		
						helpers.checkAndMake.apply( this, arguments );						
					});
					
					$this.data('maxRows', maxRowsThis);
					$this.data('maxHeight', maxHeight);					
				}				
				
			});
		}
		
	}
	
    $.fn.maxRows = function(){
		var result;
		if( arguments.length == 0 ){
			result = methods.getMaxRows.apply( this );
		}else{
			result = methods.setMaxRows.apply( this, arguments );			
		}	
		return result;	
	}
})(jQuery);
