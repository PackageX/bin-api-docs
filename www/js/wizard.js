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
          + "<p class='CatName'>" +   temp[i].categoryGroupName + " </p>"
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

        window.location ="studio.html?id=" + selectedItem.itemRefNo;

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


function addCategoryClick(){

  $(".category").click(function () {

      $("#items").addClass("active");
      $(".category").removeClass('selected');
      $(this).addClass('selected');
      var is = $("#items");
      is.empty();
      var category = categories[$(this).attr('rel')];

      getCategoryInfo(category.categoryGroupRefNo);

      var textStep_1_2 = "Now choose a style.";
      $("#substep1").html(textStep_1_2);


  });


}

var items;

function getCategoryInfo(cid){

  var data = "";
  var url = "https://tim-dev.packagex.local/boxitnow/api/category/"+cid;

  $.get(url, data, function (d) {

      console.log(d);
      items = JSON.parse(JSON.stringify(d));
      items = items.items;

      var is = $("#items");
      is.empty();

      var its = items;
      for (var i in its) {
          var item = its[i];
          console.log(item);
          var src = item.nid + "/" + item.nid + "_3d.png";
          var img = ' <div class="imageBox" ><img src=' + item.image + ' /></div>';
          is.append('<div class="item" rel="' + i + '" >' + img + '<p class="BoxName">' + item.itemShortDesc + '</p>' + '</div>');
      }

      addItemClick();
  });
}


function addItemClick(){

  $(".item").click(function () {

    $('.wizard-btn').show();

      $("#view3d p").show();
      $("#step1 #next").addClass("active");
      var textStep_1_3 = "Click \"NEXT\" to start customizing your item.";
      $("#substep1").html(textStep_1_3);
      $(".item").removeClass('selected');
      $(this).addClass('selected');

      var item = items[$(this).attr('rel')];
      selectedItem = item;

      $("#step1 #desc").html(item.itemShortDesc);
      $("#step2 #desc").html(item.itemLongDesc2);
      $("#preview #name").html(item.itemShortDesc);

      var src = 'https://tim-dev.packagex.local/data/site/design/' + item.itemQuickDesc + "/" + item.itemQuickDesc + "_json.json";

      $.get(src, null, function (data) {

          var dataObj = JSON.parse(JSON.stringify(data));

          view3d.loadJson(dataObj);
          view3d.angle = view3d.getMaxFold() + 0.9;

          $("#value1").html(data.parameters.Length || 'N/A');
          $("#value2").html(data.parameters.Width || 'N/A');
          $("#value3").html(data.parameters.Depth || 'N/A');
          $("#value5").html(data.parameters.Allowance || 'N/A');
          var key;
          for (var i in data.parameters) {
              if (i === "Radius") {
                  key = i;
                  break;
              }
              if ((i !== 'Length') && (i !== 'Width') && (i !== 'Depth') && (i !== 'Allowance') &&
                      (i !== 'Scale') && (i !== 'allowance') && (i !== 'clean_panels'))
                  key = i;

          }

          $("#param6").html(key || '');
          $("#value6").html(data.parameters[key] || '');



      });
  });
}
