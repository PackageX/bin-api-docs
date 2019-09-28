var categories;
var selectedItem;

$(document).on('ready', function () {

  var url = "https://tim-dev.packagex.local/boxitnow/api/category";
  var data = "";

  $.get(url, data, function (d) {

      categories = JSON.parse(d);
      var temp = JSON.parse(d);

      for(var i =0; i<temp.length; i++){
        var newTemp = "<div class='category' rel='" + i/*temp[i].categoryGroupRefNo*/ + "' >"
          + "<div class='imageBox'><img src='" + temp[i].image1 + "'</div>"
          + "<p class='CatName']]>" +   temp[i].categoryGroupName + " </p>"
          + "</div>";

          $('#categories').append(newTemp);
      }

      addCategoryClick();

  });

  $("#wizard-dialog").click(function () {
      $(this).hide();
  });
  $(".back-wizard").click(function (event) {
      event.stopPropagation();
  });
  $(".back-wizard #close").click(function (event) {
      $("#wizard-dialog").hide();
  });

  $(".show-wizard").click(function (event) {
      $("#wizard-dialog").show();
  });

  $("#view3d p").hide();

  $(".category").hover(function () {
      var category = categories[$(this).attr('rel')];
      $("#step1 #desc").html(category.desc);
      $("#preview #name").html(category.name);
  });

  $('.action-btn').click(function () {

        window.location ="test.php?id=" + selectedItem.itemRefNo;

  });

  $("#next").click(function () {

      $("#step1").hide("slide", {direction: "left"}, 200);
      $("#step2").show("slide", {direction: "right"}, 200);
      $(".ui-effects-wrapper").css({"margin-bottom": "-520px"});

      view3d.appendTo($("#step2 #view3d"));
  });

    $("#back").click(function () {
        $("#step2").hide("slide", {direction: "right"}, 200);
        $("#step1").show("slide", {direction: "left"}, 200);
        $(".ui-effects-wrapper").css({"margin-bottom": "-520px"});

        view3d.appendTo($("#step1 #view3d"));
    });


});
