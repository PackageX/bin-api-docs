<html>
    <head>
      <!-- BoxItNow CSS -->
      <link rel="stylesheet" type="text/css" href="http://[API ENDPOINT]/css/bin.cache.min.css" />



      <!-- (Required) -->
      <!-- BoxItNow JS -->
      <script type="text/javascript" src="http://[API ENDPOINT]/js/bin.bootstrap.js"></script>


        <!-- CLIENT CSS -->
        <!--<link rel="stylesheet" type="text/css" href="spectrum.css" />-->
        <link rel="stylesheet" type="text/css" href="css/base.css" />

        <!-- CLIENT JS -->

        <!-- You can pre load the following, BIN will load if they are not already loaded -->
        <script type="text/javascript" src="//code.jquery.com/jquery-2.1.3.js"></script>


        <!--<script type="text/javascript" src="//code.jquery.com/ui/1.11.0/jquery-ui.js"></script>-->
        <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r72/three.js"></script>
        <!--<script type="text/javascript" src="spectrum.js"></script>-->


        <!-- EXAMPLE LOAD/CREATE SCRIPT -->
        <script>

        var newId = <?php echo $_GET['id'] ? $_GET['id'] : '60' ?>;
        var newType = '<?php echo $_GET['type'] ? $_GET['type'] : 'standard' ?>';

            //LOAD bin libraries
            BIN.Bootstrap.load({
                //the root of the BIN HOST site
                apiUrl: 'http://[API ENDPOINT]/',
                apiKey: '[API KEY]'

            }, function () {

                //Begin create studio
                BIN.Widgets.Create({
                    //can be: 'viewer' (3d viewer), 'studio' (3d design studio) , 'boxes' (My Boxes), 'media' (Media Manager)
                    type: 'viewer',
                    //(require)Html div to attach the widget to
                    tag: $('#viewer'),
                    //(require for design studio)design information to load
                    design: {
                        //(require) 'standard' or 'user'
                        type: newType,
                        //(require) id of item or resize
                        id: 60,
                    },

                    options:{
                        //Rotate Design on viewer start
                        //default/null = false
                        rotate: false,
                        //Initial Design rotate speed (radians [0,1])
                        //default/null = 0
                        rotateSpeed: .0,
                        //Initial Design viewing angle (degrees, [-180, 180])
                        //default/null = 0
                        startAngle: 45,
                        //Initial Design zoom ([.5,3])
                        //default/null = 1
                        zoom: 1,
                      },

                  //**(optional)
                  //**Fires after studio is loaded
                  	onLoad: function(userSessionHandle) {
                  	},
                });
            });
        </script>
        <title>Page</title>
    </head>
    <body>
        <!-- BEGIN PAGE -->
        <div id='header'>
              <?php include 'views/header.php'; ?>
        </div>
        <div id='body'>
            <?php include 'views/debug.php'; ?>
            <div id='viewer'></div>
            <div id='outres'></div>
        </div>
        <div id='footer'>
            footer
        </div>
        <!-- END PAGE -->




    </body>


</html>
