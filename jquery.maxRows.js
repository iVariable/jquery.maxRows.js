/**	
 * jQuery.maxRows
 * 
 * Limiting Maximum rows of content in textarea
 * 
 * Copyright (c) 2010 Vladimir Savenkov <iVariable@gmail.com>
 * Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) licenses.
 * 
 * Version: 0.2
 *
 * Demo and documentation: (LINK)
 */
(function($){
	
	var helpers = {
		
		determineMaxRowsByHeight: function( height, clone ){
			var text = '';
			clone.height(height).val(text).scrollTop(10000);
			var scrollHeight = clone.scrollTop();
			var rows = 0;
			while( scrollHeight < height ){
				rows++;text += "1\n";
				scrollHeight = clone.val(text).scrollTop();
			}			
			return rows;
		},
		
		determineMaxHeightByRows: function( rows, clone ){
			var text = '';
			for(var i=0; i<rows; i++)text += "1\n";
			clone.height(0).val(text).scrollTop(10000);
			return clone.scrollTop()-1;						
		}		
		
	}
	
	var methods = {
		getMaxRows: function(){					
			return this.map(function(){
				$this = $(this);
				var result = {
					'maxRows': $this.data('maxRows'),
					'maxHeight': $this.data('maxHeight'),
					'clone': $this.data('clone')
				};
				return (result.maxHeight == null)?null:result;
			});
			
		},
		
		setMaxRows: function( rows ){			
			var maxRows = parseInt( rows );
			if( maxRows == 'NaN' ) maxRows = -1;
			
			return this.each(function(){		
				var $this = textarea = $(this);
				if( $this.attr('type') != 'textarea' ) return;

				// Need clone of textarea, hidden off screen:
                var clone = (function(){
                    
                    // Properties which may effect space taken up by chracters:
                    var props = ['height','width','lineHeight','textDecoration','letterSpacing'],
                        propOb = {};
                        
                    // Create object of styles to apply:
                    $.each(props, function(i, prop){
                        propOb[prop] = textarea.css(prop);
                    });
                    
                    // Clone the actual textarea removing unique properties
                    // and insert before original textarea:
                    return textarea.clone().removeAttr('id').removeAttr('name').css({
                        position: 'absolute',
                        top: 0,
                        left: -9999,
						resize:'none',
						'overflow-y':'hidden'
                    }).css(propOb).attr('tabIndex','-1').insertBefore(textarea);
					
                })()

				
				var maxHeight = 0;
				var maxRowsThis = maxRows;
				if (maxRowsThis == -1) {
					maxHeight = $this.attr('offsetHeight');
					maxRowsThis = helpers.determineMaxRowsByHeight.apply( $this, [maxHeight, clone] );
				}else{
					maxHeight = helpers.determineMaxHeightByRows.apply( $this, [maxRowsThis, clone] );
				};	
				
				$this.unbind( '.maxrows' );
				$this.removeData( 'maxRows' ).removeData( 'maxHeight' ).removeData( 'clone' );
				
				if( maxRowsThis != 0 ){					
					
					var checkSize = function() {						
						$this = $(this);						
	                    // Prepare the clone:
	                    clone.height(0).val($this.val()).scrollTop(10000);						
	                    // Find the height of text:
	                    var textHeight = clone.scrollTop();
						var i = 0;
						while( textHeight > maxHeight ){
							$this.val( $this.val().slice(0,-1) );
							clone.height(0).val($this.val()).scrollTop(10000);
							textHeight = clone.scrollTop();
							if ( ($this.val() == '') )break;							
						}
	                };

					
					$this.bind( 'keydown.maxrows change.maxrows keyup.maxrows', checkSize );
					
					$this.data('maxRows', maxRowsThis);
					$this.data('maxHeight', maxHeight);
					$this.data('clone', clone);
					
					$this.trigger( 'keydown.maxrows' );
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
