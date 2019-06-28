$( function() {
    var dateFormat = "mm/dd/yy",
      from = $( "#from" )
        .datepicker({
          defaultDate: "+1w",
          changeMonth: true,
          numberOfMonths: 1
        })
        .on( "change", function() {
          to.datepicker( "option", "minDate", getDate( this ) );
        }),
      to = $( "#to" ).datepicker({
        defaultDate: "+1w",
        changeMonth: true,
        numberOfMonths: 1
      })
      .on( "change", function() {
        from.datepicker( "option", "maxDate", getDate( this ) );
      });
 
    function getDate( element ) {
      var date;
      try {
        date = $.datepicker.parseDate( dateFormat, element.value );
      } catch( error ) {
        date = null;
      }
 
      return date;
    }
  } );
  
  /* Slider */
   $( function() {
    $( "#slider-range" ).slider({
      range: true,
      min: 0,
      max: 24,
      values: [ 8, 12 ],
      slide: function( event, ui ) {
        $( "#time" ).val( "hrs:" + ui.values[ 0 ] + " - hrs:" + ui.values[ 1 ] );
      }
    });
    $( "#time" ).val( "hrs:" + $( "#slider-range" ).slider( "values", 0 ) +
      " - hrs:" + $( "#slider-range" ).slider( "values", 1 ) );
	  
	  /* Second Slider */
	    $( "#slider-range2" ).slider({
      range: true,
      min: 0,
      max: 24,
      values: [ 13, 22 ],
      slide: function( event, ui ) {
        $( "#time2" ).val( "hrs:" + ui.values[ 0 ] + " - hrs:" + ui.values[ 1 ] );
      }
    });
    $( "#time2" ).val( "hrs:" + $( "#slider-range2" ).slider( "values", 0 ) +
      " - hrs:" + $( "#slider-range2" ).slider( "values", 1 ) );
	    } );