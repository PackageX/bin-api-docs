<html>

<head>
  <!-- BoxItNow CSS -->
  <link rel="stylesheet" type="text/css" href="http://localhost/boxitnow/css/bin.cache.min.css" />
  <!--<link rel="stylesheet" type="text/css" href="http://dev.boxitnow.com/css/bin.cache.min.css" /> -->

  <!-- BoxItNow JS -->
   <script type="text/javascript" src="http://localhost/boxitnow/js/bin.bootstrap.js"></script>
  <!--<script type="text/javascript" src="http://dev.boxitnow.com/js/bin.bootstrap.js"></script> -->

  <!-- CLIENT CSS -->
  <!--<link rel="stylesheet" type="text/css" href="spectrum.css" />-->
  <style>
  	body {
    	margin: 0;
    	font-family: arial;
	}

	#header {
	    width: 100%;
	    text-align: center;
	    line-height: 150px;
	    height: 150px;
	    font-size: 30px;
	    border: 1px solid #444;
	    box-sizing: border-box;
	}

	#body {
	    min-height: 800px;
	    border: 0px solid #444;
	    position: relative;
	    box-sizing: border-box;
	}

	#tab {
	    position: absolute;
	    left: 0;
	    width: 20%;
	    top: 0;
	    bottom: 0;
	    border: 1px solid #444;
	    text-align: center;
	    line-height: 150px;
	    font-size: 30px;
	    box-sizing: border-box;
	}

	#studio, #viewer {
	    position: absolute;
	    right: 0;
	    width: 80%;
	    top: 0;
	    bottom: 0;
	    border: 1px solid #444;
	    box-sizing: border-box;
	    overflow: hidden;
	}

	#footer {
	    width: 100%;
	    text-align: center;
	    line-height: 150px;
	    height: 150px;
	    font-size: 30px;
	    border: 1px solid #444;
	    box-sizing: border-box;
	}


    .ctrls > div > .patternLabel {
      background-color:#000;
    }
    .ctrls > div > .reset {
      background-color:#000;
    }
    div.sp-patterns .ctrls > div > input[type="number"] {
      background-color:#000;
    }

    .ctrlLabel{
      background-color:#000;
    }



</style>

  <!-- CLIENT JS -->

  <!-- You can pre load the following, BIN will load if they are not already loaded -->
  <script type="text/javascript" src="//code.jquery.com/jquery-2.1.3.js"></script>
  <!--<script type="text/javascript" src="//code.jquery.com/ui/1.11.0/jquery-ui.js"></script>-->
  <!--<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r72/three.js"></script>-->
  <!--<script type="text/javascript" src="spectrum.js"></script>-->

  <!-- EXAMPLE USER INTEGRATION SCRIPT -->
  <script>

//TODO: 1
//this is always blank?

  </script>


  <!-- EXAMPLE LOAD/CREATE SCRIPT -->
  <script>

  function decode(s) {
    return decodeURIComponent(s.split("+").join(" "));
  }

  var urlVars = {};
  document.location.search.replace(/\??(?:([^=]+)=([^&]*)&?)/g, function () {

    urlVars[decode(arguments[1])] = decode(arguments[2]);

    console.log(urlVars);

  });



  var newId = urlVars['id'] ? urlVars['id'] : 60;

  var newType = urlVars['type'] ? urlVars['type'] : 'standard';

  var newToken = urlVars['token'] ? urlVars['token'] : '2328e16dcef34fe4cb54a57aace29d05';

    //LOAD bin libraries
    BIN.Bootstrap.load({
      //the root of the BIN HOST site
      apiUrl: "https://localhost/boxitnow/",
      apiKey: "VGL6TmfXuFMprVPy"

    }, function() {

      //Begin create studio
      BIN.Widgets.Create({
        //can be: 'viewer' (3d viewer), 'studio' (3d design studio) , 'boxes' (My Boxes), 'media' (Media Manager)
        type: 'studio',
        //(require) Html div to attach the widget to
        tag: $('#studio'),
        //(optional) required if loading user design, user media or user projects
        userToken: newToken,
        //(require for design studio)design information to load
        design: {
          //(require) 'standard' or 'user'
          type: newType,
          //(require) id of item or resize
          id: newId,
          //(optional)


          //TODO: 2
          //How to show number of options here?
          //Full list, more options, example params?
          parameters: {
            Length: "15.1",
          }
          //Probalby more than Length, Width, Depth, depending on design.
          //Null value? (not included)
          //default values? (for params that are not included)
        },

        //(optional) for loading for design studio
        options: {
              user: {
                saving: 'simple'
                //TODO: 3
                //'simple' saving does not require a folder selection
                //what is the other type?
                //null value? (not included)
                //default value (invalid, incorrect param)
              },
              defaultLayout: {
                showScores: false
                //TODO: 4a
                //more?
              },
              ui: {
                // corresponds to resizer, export, graphics views
                initialTab: 'graphics', //{'measurements', 'graphics', 'export'}
                saveButtonText: 'SAVE DESIGN',
                saveProgressText: 'Saving...',
                saveFinishText: 'DESIGN SAVED'
                //TODO: 4b
                //default and null values?
              },
              resizer: {
                //TODO: 5
                enabled: true,
                modules: [], //options here?
                trimParams: true //not sure what this does
              },
              export: {
                //TODO: 6
                enabled: true,
                modules: ['mod_share, mod_ftp'] //other options? printos?
                //ftp is disabled in general?
                //these are also (possibly only) controlled in the admin site settings
              },
              graphics: {
                //TODO: 7
                enabled: true,
                useKraft: false, //not sure what this does
                modules: ['mod_standard', 'mod_graphics', 'mod_text', 'mod_color', 'mod_panel', 'mod_pattern']
                //null value (not included): all enabled
                //default value ([]): all disabled
                //specified value (['x', 'y']) : x, y enabled; z disabled;
              },
              views: {
                //TODO: 8
                '3d': '3D',
                'outside': 'Outside View',
                'inside': 'Inside View',
                'cad': null,
                'details': null,
                'fullscreen': null,
                '2nd_view': null
                //null value (not included) : enabled, default title
                //default value (null) : disabled
                //specified value ('X View') : enabled, title 'X View'
              },

              //TODO: 9
              //not entirely sure what form refers to generally
              form: {
                fields: {
                  'Project Name': false //not sure what this does
                },
                hideAdvancedDims: true
              },
              finishes: {
                //TODO: 9
                enable: true,
                label: 'Materials', //label default/null values?
                options: {
                  'Standard White': { //mapping?? 'Standard White' is what value/title/name
                    renderBase: 'color',  //renderbase default/null values?
                    interior: 'white'  //interior default/null values?
                    //null renderSurface : default/null values?
                  },
                  'Premium White': {
                    renderBase: 'color',
                    interior: 'white'
                  },
                  'Premium White with Gloss Ink Finish': {
                    renderBase: 'color',
                    renderSurface: 'gloss',
                    interior: 'white'
                  },
                  'Kraft': {
                    // double sided kraft //TODO:10 Why does this make it double sided kraft?
                    renderBase: 'kraft'
                  }
                }
              },
              //TODO: 11
              //Finishes/Materials naming convention...
              //The only reason I can keep this straight is because I think of them as the two different dropdowns
              //but they should follow a more divisive naming convention

              //default/null value?
              materials: {
                enable: false
              }
            },


          //TODO: 12
          //Function event fires before or after action ( on success/error)?
          //e.g. buttonClick onSave or function return onSave?
    		onSave : function() {

    		},

        //(optional)after studio is loaded
        onLoad: function(userSessionHandle) { //TODO: 13 not sure what userSessionHandle is supposed to have
          $('#loading').hide();
        },

        //(optional)user does a resize
        //TODO: 14
        //Function event fires before or after action ( on success/error)?
        onResize: function(userSessionHandle, parameters) {
          console.log(parameters);
        },

        //(required)
        //TODO: 15
        //onExport says 'required', but is not implemented anywhere (and doesn't seem to have a problem with that)
        //Are there any parameters for this function call?
        //Function event fires before or after action ( on success/error)?
        //
        /*
        onExport: function() {},
        */

      });
    });
  </script>
  <title>Page</title>
</head>

<body>
  <!-- BEGIN PAGE -->
  <div id='header'>

    <div id="nav" data-include="nav"></div>

  </div>


  <div id='body'>

    <div id="loading" data-include="loading"></div>

    <div id='studio'></div>

  </div>

  <div id='footer'>
    footer
  </div>
  <!-- END PAGE -->



  <script type='text/javascript' src="js/htmlInclude.js" ></script>
</body>

</html>
