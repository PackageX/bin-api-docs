<html>
    <head>
      <!-- BoxItNow CSS -->
      <link rel="stylesheet" type="text/css" href="http://tim-dev.packagex.local/boxitnow/css/bin.cache.min.css" />

      <!-- BoxItNow JS -->
      <script type="text/javascript" src="http://tim-dev.packagex.local/boxitnow/js/bin.bootstrap.js"></script>

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
                apiUrl: 'http://tim-dev.packagex.local/boxitnow/',
                apiKey: "VGL6TmfXuFMprVPy"

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
                        id: newId,
                    },

                    options:{
                        //rotate on start
                        rotate: false,
                        //Initial rotate speed
                        rotateSpeed: 0,
                        //Initial viewing angle
                        startAngle: 45,
                      }

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
