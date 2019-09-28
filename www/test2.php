<html>

<head>
  <!-- BoxItNow CSS -->
  <link rel="stylesheet" type="text/css" href="http://localhost/boxitnow/css/bin.cache.min.css" />

  <!-- BoxItNow JS -->
  <script type="text/javascript" src="http://localhost/boxitnow/js/bin.bootstrap.js"></script>

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
</style>

  <!-- CLIENT JS -->

  <!-- You can pre load the following, BIN will load if they are not already loaded -->
  <!--<script type="text/javascript" src="//code.jquery.com/jquery-2.1.3.js"></script>-->
  <!--<script type="text/javascript" src="//code.jquery.com/ui/1.11.0/jquery-ui.js"></script>-->
  <!--<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r72/three.js"></script>-->
  <!--<script type="text/javascript" src="spectrum.js"></script>-->

  <!-- EXAMPLE USER INTEGRATION SCRIPT -->
  <script>


  </script>


  <!-- EXAMPLE LOAD/CREATE SCRIPT -->
  <script>

  var newId = <?php echo $_GET['test'] ? $_GET['test'] : '60' ?>;

  <?php
  $type = $_GET['type'];
  $tag = $_GET['tag'];
  $token = $_GET['token'];
  $options = $_GET['options'];


   ?>
    //LOAD bin libraries
    BIN.Bootstrap.load({
      //the root of the BIN HOST site
	  //http://localhost/bindev/
	  //https://staging.boxitnow.com/
      apiUrl: 'http://localhost/boxitnow/',
      apiKey: "VGL6TmfXuFMprVPy"

    }, function() {

      //Begin create studio
      BIN.Widgets.Create({
        //can be: 'viewer' (3d viewer), 'studio' (3d design studio) , 'boxes' (My Boxes), 'media' (Media Manager)
        type: '<?php echo $type ?>',
        //(require)Html div to attach the widget to
        tag: $('#<?php echo $tag ?>'),
        //(optional) required if loading user design, user media or user projects
        userToken: '<?php echo $token ?>',
        //(require for design studio)design information to load
        <?php if(isset($design)): ?>
        design: {
          //(require) 'standard' or 'user'
          type: 'standard',
          //(require) id of item or resize
          id: newId,
          //(optional)
          parameters: {
            Length: "15.1",
          }
        },
        <?php endif; ?>


        <?php if(isset($option1)): ?>
        //(optional) for loading for design studio

        options: {
              user: {
                saving: 'simple'
              },
              defaultLayout: {
                showScores: false
              },
              ui: {
                initialTab: 'graphics',
                saveButtonText: 'SAVE DESIGN',
                saveProgressText: 'Saving...',
                saveFinishText: 'DESIGN SAVED'
              },
              resizer: {
                enabled: true,
                modules: [],
                trimParams: true
              },
              export: {
                enabled: true,
                modules: ['mod_share']
              },
              views: {
                '3d': '3D',
                'outside': 'Outside View',
                'inside': 'Inside View',
                'cad': null,
                'details': null,
                'fullscreen': null,
                '2nd_view': null
              },
              form: {
                fields: {
                  'Project Name': false
                },
                hideAdvancedDims: true
              },
              finishes: {
                enable: true,
                label: 'Materials',
                options: {
                  'Standard White': {
                    renderBase: 'color',
                    interior: 'white'
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
                    // double sided kraft
                    renderBase: 'kraft'
                  }
                }
              },
              materials: {
                enable: false
              },
              graphics: {
                enabled: true,
                useKraft: false,
                modules: ['mod_standard', 'mod_graphics', 'mod_text', 'mod_color', 'mod_panel', 'mod_pattern']
              }
            },

            <?php else: ?>

            options : {

              target : 'test.php',

            }

            <?php endif; ?>
            /*
		onSave : function() {

		},
        //(optional)after studio is loaded
        onLoad: function(userSessionHandle) {},
        //(optional)user does a resize
        onResize: function(userSessionHandle, parameters) {
          console.log(parameters);
        },
        //(required)
        */

      });
    });
  </script>
  <title>Page</title>
</head>

<body>
  <!-- BEGIN PAGE -->
  <div id='header'>
    header
  </div>
  <div id='body'>
    <div id='tab'>tab</div>
    <div id='studio'></div>
  </div>
  <div id='footer'>
    footer
  </div>
  <!-- END PAGE -->
</body>

</html>