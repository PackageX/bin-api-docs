
<?php if (isset($_GET['debugBIN'])): ?>

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


  #tab {
      position: absolute;
      left: 0;
      width: 20%;
      top: 0;
      bottom: 0;
      border: 1px solid #444;
      text-align: left;
      font-size: 10px;
      box-sizing: border-box;
      overflow: scroll;
      word-wrap: break-word;
      z-index: 9999;
      background-color: #fff;
  }


</style>
<div id='tab'>

    <div id="debug-menu" class="grid_7">
                <ul>
                    <li><a href="#">Action 1</a></li>
                    <li><a href="#">Action 2</a></li>
                    <li><a href="#">Action 3</a></li>
                </ul>
    </div>


    <div id="debug-output">

      <div id="result"></div>

      <div id="data"></div>

    </div>


</div>


<?php endif; ?>
