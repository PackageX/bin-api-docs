var view3d = new WebGlViewer3d("https://tim-dev.packagex.local/boxitnow/");
view3d.mouseSpeed = 4;
view3d.tagElement = $("#step1 #view3d");
view3d.webGLWidth = view3d.tagElement.width();
view3d.webGLHeight = view3d.tagElement.height();
view3d.viewAngleX += Math.PI;
view3d.initialize();
view3d.animate();

console.log("Success?");
