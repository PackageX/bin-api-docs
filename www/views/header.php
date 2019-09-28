<style>

#main-menu {

  background-color:#cccccc;
  width:100%;
}

  #main-menu ul > li{

    float:left;
    margin:20;
    color:#00ff00;
  }


  #login, #guest {
    z-index:9999;
  }

  #register {
    z-index:9999;
  }

</style>


<div id="main-menu" class="grid_7">
            <ul>
                <li><a href="categories.php">Categories</a></li>
                <li><a href="media.php" >Media Manager</a></li>
                <li><a href="boxes.php" >My Boxes</a></li>
                <li><a href="javascript:void(0)" class="" onclick="javascript:toggleLogin();">Login</a>
							<li><a href="javascript:void(0)" class="" onclick="javascript:toggleSignup();">Sign Up</a>
                <li><a href="javascript:void(0)" class="" onclick="javascript:toggleGuest();">Continue as a Guest</a>
            </ul>



            <section id="login" style="display:none;position:absolute;top:25px;right:0;background-color:#ffffff">
							<div class="container">

									<div class="col-md-12 text-center" style="">
											<h3 class="section-title wow fadeInUp">Let's go.</h3>
											<p class="subheading wow fadeInUp">Log in or register to start using Box It Now.</p>
									</div>

									<div class="row">
											<div class="col-md-5 text-left">
													<form method="post" action="http://fantastapack.boxitnow.com/api/login" name="LoginForm" id="LoginForm">
															<fieldset>
																	<input type="text" name="LoginForm[username]" id="LoginForm_username" placeholder="Username/Email"/>
																	<input type="password" name="LoginForm[password]" id="LoginForm_password" placeholder="Password" value="anything"/>
															</fieldset>
															<img id="loginimg" src="images/login.gif" style="display: none;" />
															<input type="submit" class="active" id="submit-login" value="Log In" />
															<a id="forgot-password" class="cantLogin link" tabindex="-1" href="javascript:void();" style="float: right;">Forgot Password?</a>
															<span id="login-error" style="display:none">There was an error with your credentials. Please try again.</span>
															<input type="hidden" name="LoginForm[oauth]" id="oauth" placeholder="oauth" value=""/>
															<input type="hidden" name="LoginForm[oauthId]" id="oauthId" placeholder="oauthId" value=""/>
															<input type="hidden" name="LoginForm[token]" id="token" placeholder="token" value=""/>
													</form>
									</div>
							</div>
					</section>


          <section id="register" style="display:none;position:absolute;top:25px;right:0;background-color:#ffffff">
            <div class="container">

                <div class="col-md-12 text-center" style="">
                    <h3 class="section-title wow fadeInUp">Hey There.</h3>
                    <p class="subheading wow fadeInUp">Log in or register to start using Box It Now.</p>
                </div>

                <div class="row">
                    <div class="col-md-5 text-left">
                        <form method="post" action="api/register" name="registerform" id="registerform">
                            <fieldset>
                                <input type="text" name="RegisterForm[username]" id="RegisterForm_username" placeholder="Username/Email"/>
                                <input type="password" name="RegisterForm[password]" id="RegisterForm_password" placeholder="Anything" value="anything"/>
                                <input type="hidden" name="RegisterForm[activate]" id="RegisterForm_activate" value="true" />
                            </fieldset>
                            <img id="loginimg" src="images/login.gif" style="display: none;" />
                            <input type="submit" class="active" id="submit-register" value="Log In" />
                            <span id="register-error" style="display:none">There was an error with your credentials. Please try again.</span>

                        </form>
                </div>
            </div>
        </section>


        <section id="guest" style="display:none;position:absolute;top:25px;right:0;background-color:#ffffff">
          <div class="container">

              <div class="col-md-12 text-center" style="">
                  <h3 class="section-title wow fadeInUp">Hello Stranger.</h3>
                  <p class="subheading wow fadeInUp">Start using Box It Now.</p>
              </div>

              <div class="row">
                  <div class="col-md-5 text-left">
                      <form method="post" action="http://localhost/boxitnow/api/register" name="guestForm" id="guestForm">
                          <fieldset>
                              <input type="hidden" name="RegisterForm[email]" id="GuestForm_email" placeholder="Username/Email"/>
                              <input type="hidden" name="RegisterForm[username]" id="GuestForm_username" placeholder="Username/Email"/>
                              <input type="hidden" name="RegisterForm[password]" id="GuestForm_password" placeholder="Anything" value="anything"/>
                              <input type="hidden" name="RegisterForm[activate]" id="GuestForm_activate" value="true" />
                              <input type="hidden" name="RegisterForm[ephemeral]" id="GuestForm_ephemeral" value="true" />
                          </fieldset>
                          <img id="loginimg" src="images/login.gif" style="display: none;" />
                          <input type="submit" class="active" id="submit-guest" value="Log In" />
                          <span id="register-error" style="display:none">There was an error with your credentials. Please try again.</span>

                      </form>
              </div>
          </div>
      </section>
</div>




<script type="text/javascript">

  var user;


	function toggleLogin(){
		$('#login').toggle();
	}

  function toggleSignup(){
		$('#register').toggle();
	}

  function toggleGuest(){
		$('#guest').toggle();
	}

  $(function() {
    $('#guestForm').on('submit', function (event) {
									event.preventDefault();

                  console.log($('#guestForm').serialize());

									$('#login-error').hide();
									$.post($('#guestForm').attr('action'), $('#guestForm').serialize(), function (res) {
											console.log(res);
                      <?php if(isset($_GET['debugBIN'])): ?>
                        if(res.errors){
                          $('#result').html("Error");
                          $('#data').html(JSON.stringify(res.errors));
                        }
                        else{
                            $('#result').html("Success");
                            $('#data').html(JSON.stringify(res));
                        }
                      <?php endif; ?>

											if (res.result === "success") {

												// window.location.href = 'category';
                        console.log("Success");

                        user = res.data.token; //User token to pass

											}
											 else {
													//limg.hide();
													//lsub.show();
													$('#login-error').show();
											}
									});
							});




              $('#loginForm').on('submit', function (event) {
          									event.preventDefault();

                            console.log($('#loginForm').serialize());

          									$('#login-error').hide();
          									$.post($('#loginForm').attr('action'), $('#loginForm').serialize(), function (res) {
          											console.log(res);
                                <?php if(isset($_GET['debugBIN'])): ?>
                                  if(res.errors){
                                    $('#result').html("Error");
                                    $('#data').html(JSON.stringify(res.errors));
                                  }
                                  else{
                                      $('#result').html("Success");
                                      $('#data').html(JSON.stringify(res));
                                  }
                                <?php endif; ?>

          											if (res.result === "success") {

          												// window.location.href = 'category';
                                  console.log("Success");

                                  user = res.data.token; //User token to pass

          											}
          											 else {
          													//limg.hide();
          													//lsub.show();
          													$('#login-error').show();
          											}
          									});
          							});



    //  $('#GuestForm_username').val(Date.now() + "@bin.bin");
    //  $('#GuestForm_email').val(Date.now() + "@bin.bin");
    //  $('#guestForm').submit();

    });




  </script>
