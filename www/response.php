<html>

<head>
  <!-- BoxItNow CSS -->
  <link rel="stylesheet" type="text/css" href="http://tim-dev.packagex.local/boxitnow/css/bin.cache.min.css" />
  <!-- <link rel="stylesheet" type="text/css" href="http://dev.boxitnow.com/css/bin.cache.min.css" /> -->

  <!-- BoxItNow JS -->
   <script type="text/javascript" src="http://tim-dev.packagex.local/boxitnow/js/bin.bootstrap.js"></script>
  <!-- <script type="text/javascript" src="http://dev.boxitnow.com/js/bin.bootstrap.js"></script> -->

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
//-- not sure what this is for.. my guess is to put a place to do examples of api calls for user create/login/merge, but otherwise, no idea

  </script>


  <!-- EXAMPLE LOAD/CREATE SCRIPT -->
  <script>

  var newId = <?php echo $_GET['id'] ? $_GET['id'] : '60' ?>;
  var newType = '<?php echo $_GET['type'] ? $_GET['type'] : 'standard' ?>';
  var newToken= '<?php echo $_POST['token'] ? $_POST['token'] : '2328e16dcef34fe4cb54a57aace29d05' ?>';
    //LOAD bin libraries
    BIN.Bootstrap.load({
      //the root of the BIN HOST site
      apiUrl: "https://dev.boxitnow.com/",
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




          //** Parameters are mapped from here to the studio verbatim, i.e.
          //** parameters{x : a} : data['Params['x']'] = a
          //**
          //** a = blank (""), space (" "), any string causes error 500
          //** Formally defined by the general definition
          //** parameters{...} = [(String x : int a,)*]
          //** or
          //** parameters{...} = [(String x : String a,)*]
          //** need to check params in code for "Finishes" and "Materials" or other string values???????????????????
          //** that may be passed along with these and prevent passing only integer values?????????????????????
          parameters: {
            Length: 14.12,
            Width: 14.01,
            Depth: 2.15,
            //Allowance: 1 //** Allowance doesn't update, undefined, causes artifacts //--is this in your example or just fpack?
          }
          //**Just want to keep this note for different design types
          //more than Length, Width, Depth, depending on design.

        },

        //(optional) for loading for design studio
        options: {
          //** 'simpleTEST', '', and (null) : all required a folder
          //**
          //** saving - default/null = folder required (false)
          //** Formally defined by the general
          //** user{...} = [(String a: String b)?]
          //** and more specifically for this case
          //** user{...} = [(saving: ('simple' | ''+.*)?]
          //** This is a case where we should change the input value to a boolean, from a string (since 'simple' is the only valid input string)
          //-- agreed.. boolean change make sense
              user: {
                saving: 'simple'
                //TODO: 3
                //'simple' saving does not require a folder selection
                //what is the other type?
                //null value? (not included)
                //default value (invalid, incorrect param)
              },
              //^^
              //^^ Defines whether or not to show score marks on flat views (Outside/Inside)
              //** "Show Scores" button is always enabled
              //^^
              //** showScores - null/default = true/enabled
              //^^
              //** Formally defined by the general
              //** defaultLayout{...} = [(String s : boolean a,)*]
              //** and for the specific case
              //** defaultLayout{...} = [(showScores : (true | false),)?]
              //-- showScores = true - button is present and selected by default, false - button is present deselected by default, "hidden" - button is not present
              //-- if we do this, we can add checks for the boolean value for on/off, string "hidden" for hidden, invalidate anything else
              defaultLayout: {
                //TODO: 4a
                showScores : false,
              },


              //^^ Defines custom settings for the user interface
              //^^
              //^^ initialTab - the tab to show when the studio first loads
              //^^ saveButtonText - the text label for the save button
              //^^ saveProgressText - the text label for the save button during a save operation
              //^^ saveFinishText - the text label for the save button after a successful save operation
              //^^
              //** null = default = specified (current)
              //** Formally defined by the general
              //** ui{...} = [(String s : String a,)*]
              //** and for the specific case
              //** ui{...} = [
              //**            (initialTab : (('measurements' | 'graphics' | export) | (''+.*)) ,)?
              //**            (saveButtonText : ''+.*,)?
              //**            (saveProgressText : ''+.*,)?
              //**            (saveFinishText : ''+.*,)?
              //**           ]
              ui: {
                initialTab: 'graphics', //{'measurements', 'graphics', 'export'}, null = 'measurements'
                saveButtonText: 'SAVE DESIGN',
                saveProgressText: 'Saving...',
                saveFinishText: 'DESIGN SAVED'
                //TODO: 4b
                //default and null values?
              },
	      //-- if ui array is null/not included, defaults should all be used. the rest is correct


              //^^ Defines custome settings for the resize interface (measurements section)
              //^^
              //^^ enable - whether or not to show the section
              //^^ modules - string array containing module names to be included
              //^^ trimParams - whether or not to trim *2* trailing zeroes from params
              //^^
              //** enable - doesn't have any effect???????????? also, null = (enable = true) several places in code.;
              //** 'mod_advanced' - seems to be the only module option available
              //** trimParams - enforces some kind of decimal precision constraint, looks like it just removes trailing zeroes from the inputs
              //**
              //** Formally defined by
              //** resizer{...} = [
              //**                  (enable : (true | false),)?
              //**                  (modules : [(('mod_advanced' | (''+.*)) ,)?]?
              //**                  (trimParams : (true | false),)?
              //**                ]
              resizer: {
                //TODO: 5
                enable: true,
		//-- enable should enable/disable the resizer effect. if true, all works as normal, if false, values for params are shown, but are read-only, displayed as text, not inputs
		//-- should default to true if not included
                modules: [], //options here?
		//-- trimParams should probably be renamed to setPrecision and be boolean(false)/int.  if boolean(false), then it does no trimming, if int, then it trims to x positions of precision.
		//-- should be a required option.
                trimParams: true //not sure what this does
              },


              //** Per the comment about option overrides -
              //** I think it will make the most sense going forward to have the widget be, by definition, a subset of the whitelabel to which it is attached.
              //** I believe that it is the easiest way to keep actions straight, both for us and for clients.
              //** Additional actions that are outside of that whitelabel would require another instance set up;
              //** Given that those are special cases then to begin with, it makes sense to separate them from the bulk, again both for us and for clients
              //**
              //^^ Defines custom settings for the export section
              //^^
              //^^ enable - whether or not to show the section
              //^^ modules - string array containing module names to be included
              //^^
              //**
              //** enable : null/default = true
              //** modules : null = all enabled; default ([]) = disabled;
              //** Formally defined by
              //** export{...} = [
              //**                  (enable : (true | false),)?
              //**                  (modules : [((('mod_share' | 'mod_email' | 'mod_ftp' )* | (''+.*)) ,)?])?
              //**                ]
              //**
              //**????????????????????? 'mod_printos' not a mod option?
              //-- mod_printos should definitely be an option.  and if we ever add other export options, they should be in there too.
              export: {
                //TODO: 6
                enabled: true,
                modules: ['mod_share', 'mod_email', 'mod_ftp'] //other options? printos? //-- yup, print os/export/etc.. all should be options to enable/disable here
                //-- biggest issue with having multiple instances for the same customer is potential issues with data access from 2 instances.. shouldn't be that much of a problem
                //-- but I haven't looked into it, so it's an unknown at this point.  Otherwise, I agree that these should be a subset of admin settings and shouldn't override
              },

              //^^ Defines custom settings for the graphics section
              //^^
              //^^ enable - whether or not to show the section
              //^^ useKraft - whether or not to "use kraft" -- not sure
              //^^ modules - string array containing module names to be included
              //^^
              //** enable : null/default = true
              //** useKraft :
              //** modules : null = all enabled; default ([]) = disabled;
              //**
              //** Formally defined by
              //** graphics{...} = [
              //**                  (enable : (true | false),)?
              //**                  (useKraft : (true | false),)?
              //**                  (modules : [((('mod_standard', 'mod_graphics', 'mod_text', 'mod_color', 'mod_panel', 'mod_pattern', 'mod_litho' )* | (''+.*)) ,)?])?
              //**                ]
              //-- as discussed, "useKraft" is depricated with Finishes and should come out.
              graphics: {
                //TODO: 7
                enabled: true,
                //-- should default to true if not included.
                useKraft: true, //not sure what this does
                modules: ['mod_standard', 'mod_graphics', 'mod_text', 'mod_color', 'mod_panel', 'mod_pattern', 'mod_litho']
                //null value (not included): all enabled
                //default value ([]): all disabled
                //specified value (['x', 'y']) : x, y enabled; z disabled;
              },

              //^^ Defines available views in the studio, and the label for the specified tab
              //^^
              //^^ String s - the text name of the view
              //^^ String a - the label text for the view tab
              //^^
              //** null value (not included) : disabled
              //** default value (null) : enabled, default title
              //** specified value ('X View') : enabled, title 'X View'
              //^^
              //** Formally defined by the general
              //** views{...} = [(String s : String a,)*]
              //** and for the specific case
              //** views{...} = [
              //**            ('3d' : (''+.* | null),)?
              //**            ('outside' : (''+.* | null),)?
              //**            ('inside' : (''+.* | null),)?
              //**            ('cad' : (''+.* | null),)?
              //**            ('details' : (''+.* | null),)?
              //**            ('fullscreen' : (''+.* | null),)?
              //**            ('2nd_view' : (''+.* | null),)?
              //**           ]
              views: {
                //TODO: 8
                '3d': '3D',
                'outside': 'Outside View',
                'inside': 'Inside View',
                'cad': null,
                'details': null,
                'fullscreen': null,
                '2nd_view': null
                //** no, I had null and default reversed -- leaving out "3d" will disable it, value of null will give default title, corrected version above
                //-- understood and agreed
              },

              //^^ Defines the labels for section tabs in the studio tool panel
              //^^
              //^^  measurements - the label text for the measurement section tab
              //^^  graphics - the label text for the graphics section tab
              //^^  export - the label text for the export section tab
              //^^
              //**TODO : 16
              //** ********************* (Missing from the other widget script) ******************
              //** null = default = specified (current)
              //** Formally defined by
              //** tabs{...} = [
              //**            (measurements : ''+.*,)?
              //**            (graphics : ''+.*,)?
              //**            (export : ''+.*,)?
              //**           ]
              tabs: {
                measurements : 'Default Dimensions',
                graphics : 'Default Graphics',
                export : 'Default <br /> Share',
              },
              //-- all good




              //^^ Defines custom settings for the details view
              //^^
              //^^ fields - list of form field titles and whether or not to enable the input?????
              //^^ hideAdvancedDims - whether or not to show the "advanced dimensions" form part
              //^^
              //** fields - null, default values do not seem to have any effect????????
              //** hideAdvancedDims - null/default = true
              //** 'Form'ally defined by
              //** form{...} = [
              //**              (fields : [(''+.* : (true | false),)*])?
              //**              (hideAdvancedDims : (true | false),)?
              //**             ]
              //-- null fields or null values seem to have no effect?
              //TODO: 9
              form: {
                fields: {
                  'Project Name': false,
                },
                hideAdvancedDims: true
              },


              //^^ Defines custom settings for finishes - the look and feel of the rendered design
              //^^
              //^^ enable - whether or not to include the setting
              //^^ label - the label text for the dropdown menu
              //^^ options - list of available options in dropdown menu, defined by
              //^^          - String title text
              //^^          - renderBase : colorized or cardboard look and feel
              //^^          - renderSurface : shiny or dull (reflective or not)
              //^^          - interior : ???
              //^^
              //** enable - null/default = false
              //** label - null/default = '' (empty string)
              //** options - null = error 500, default ({}) = empty
              //**
              //** Additionally, I can not tell if anything in the 'options' has an effect, it doesn't seem to
              //** except kraft, which does work as the renderBase option
              //** Formally defined by
              //** finishes{...} = [
              //**                  (enable : (true | false),)?
              //**                  (label : (''+.*)?,)?
              //**                  (options : [
              //**                              (''+.* : {
              //**                                        (renderBase : (('color' | 'kraft') | (''+.*)),)?
              //**                                        (renderSurface :  (('gloss') | (''+.*)),)?
              //**                                        (interior :  (('white') | (''+.*)),)?
              //**                                        }
              //**                               ,)*
              //**                            ],)?
              //**                ]
              //-- the 'options' area is effectively the same as the section in config/*.php where we define our finishes for the base site.. it just lets the devs
              //-- define the finishes options in the widget so we don't have to do it in config ourselves, or update when they want to add/change finishes available.
              //-- also, Kraft doesn't work as a renderbase option?  it should, or fpack wouldn't be able to have a kraft/kraft option, which I think they do.
              //-- maybe look at their embed script to see what they're passing for Kraft?
              finishes: {
                //TODO: 9
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
                    // double sided kraft //TODO:10 Why does this make it double sided kraft? //-- not sure.. may be depricated, verify in code
                    //-- did you get an answer to this from the code?
                    renderBase: 'kraft'
                  }
                }
              },

              //^^ Defines custom settings for materials
              //^^
              //^^ enable - whether or not the dropdown is available
              //^^
              //** enable - null/default = false
              //** Formally defined by the general
              //** materials{...} = [(String s : boolean a,)*]
              //** and for the specific case
              //** materials{...} = [(enable : (true | false),)?]
              //**
              //default/null value? false
              //** default value is actually false (disabled)
	      //-- interesting..  that should probably be swapped to true, but lets discuss going forward.. I think it was set to false initially because we were using the
	      //-- now depricated "useKraft" checkbox.
              materials: {
                enable: true
              }
            },


          //TODO: 12
          //Function event fires before or after action ( on success/error)?
          //e.g. buttonClick onSave or function return onSave?
          //**Fires after buttin click, before successful function return
		onSave : function() {
		},

		//(optional)after studio is loaded
		onLoad: function(userSessionHandle) { //TODO: 13 not sure what userSessionHandle is supposed to have //-- not sure either.  refer to fpack source or verify in code
		  $('#loading').hide();
		},


		//(optional)user does a resize
		//TODO: 14
		//Function event fires before or after action ( on success/error)? //-- post-resize, I belive and most likely on success.. i dont think we account for resize failure/error handling
		//**
		//** Fires on *successful* resize
		//** Nothing fires on error
		//-- should definitely provide feedback, or the option for the user to define how errors are handled/action to take on them.
		onResize: function(userSessionHandle, parameters) {
		},

		//(required)
		//TODO: 15
		//onExport says 'required', but is not implemented anywhere (and doesn't seem to have a problem with that)
		//Are there any parameters for this function call?
		//-- no clue.. i think it's for allowing customers to attach to the export option(s) to run code post export themselves, but should verify in code.
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

    <?php include 'views/header.php'; ?>

  </div>


  <div id='body'>

    <div id="loading" style="display:block;width:100%;height:100%;">
      <img style="position:absolute;left:45%;top:20%" src="images/loader.gif" />
    </div>

    <?php include 'views/debug.php'; ?>

    <div id='studio'></div>

  </div>

  <div id='footer'>
    footer
  </div>
  <!-- END PAGE -->
</body>

</html>
