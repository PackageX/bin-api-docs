/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
// File:src/renderers/shaders/ShaderChunk/skinnormal_vertex.glsl


THREE.ShaderChunk[ 'skinnormal_vertex'] = "#ifdef USE_SKINNING\n\n	mat4 skinMatrix = mat4( 0.0 );\n	skinMatrix += boneMatX;\n	//skinMatrix += skinWeight.y * boneMatY;\n	//skinMatrix += skinWeight.z * boneMatZ;\n	//skinMatrix += skinWeight.w * boneMatW;\n	skinMatrix  = bindMatrixInverse * skinMatrix * bindMatrix;\n\n	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;\n\n#endif\n";

THREE.ShaderLib.phong.vertexShader = [
    "#define PHONG",
    "varying vec3 vViewPosition;",
    "#ifndef FLAT_SHADED",
    "	varying vec3 vNormal;",
    "#endif",
    THREE.ShaderChunk[ "common" ],
    THREE.ShaderChunk[ "uv_pars_vertex" ],
    THREE.ShaderChunk[ "uv2_pars_vertex" ],
    THREE.ShaderChunk[ "displacementmap_pars_vertex" ],
    THREE.ShaderChunk[ "envmap_pars_vertex" ],
    THREE.ShaderChunk[ "lights_phong_pars_vertex" ],
    THREE.ShaderChunk[ "color_pars_vertex" ],
    THREE.ShaderChunk[ "morphtarget_pars_vertex" ],
    THREE.ShaderChunk[ "skinning_pars_vertex" ],
    THREE.ShaderChunk[ "shadowmap_pars_vertex" ],
    THREE.ShaderChunk[ "logdepthbuf_pars_vertex" ],
    "void main() {",
    THREE.ShaderChunk[ "uv_vertex" ],
    THREE.ShaderChunk[ "uv2_vertex" ],
    THREE.ShaderChunk[ "color_vertex" ],
    THREE.ShaderChunk[ "beginnormal_vertex" ],
    THREE.ShaderChunk[ "morphnormal_vertex" ],
    THREE.ShaderChunk[ "skinbase_vertex" ],
    THREE.ShaderChunk[ "skinnormal_vertex" ],
    THREE.ShaderChunk[ "defaultnormal_vertex" ],
    "#ifndef FLAT_SHADED", // Normal computed with derivatives when FLAT_SHADED

    "	vNormal = normalize( transformedNormal );",
    "#endif",
    THREE.ShaderChunk[ "begin_vertex" ],
    THREE.ShaderChunk[ "displacementmap_vertex" ],
    THREE.ShaderChunk[ "morphtarget_vertex" ],
    THREE.ShaderChunk[ "skinning_vertex" ],
    THREE.ShaderChunk[ "project_vertex" ],
    THREE.ShaderChunk[ "logdepthbuf_vertex" ],
    "	vViewPosition = - mvPosition.xyz;",
    THREE.ShaderChunk[ "worldpos_vertex" ],
    THREE.ShaderChunk[ "envmap_vertex" ],
    THREE.ShaderChunk[ "lights_phong_vertex" ],
    THREE.ShaderChunk[ "shadowmap_vertex" ],
    "}"

].join("\n");

var worldScale = 800;

var BIN = BIN || {};

BIN.Create3dDesign = function (params) {

  console.log("Create 3d design params " + params);

    (params.enableZoom === undefined) && (params.enableZoom = false);
    (params.enableFold === undefined) && (params.enableFold = false);
    (params.initalScale === undefined) && (params.initalScale = 1.0);
    (params.initialState === undefined) && (params.initialState = 'folded');
    (params.spinSpeed === undefined) && (params.spinSpeed = 0.0);
    (params.rotateViewX === undefined) && (params.rotateViewX = 0.0);
    (params.rotateViewY === undefined) && (params.rotateViewY = 0.0);
    (params.mouseSpeed === undefined) && (params.mouseSpeed = 1.0);
    (params.designPath === undefined) && (params.designPath = "");
    (params.imagePath === undefined) && (params.imagePath = "");


    var view3d = new WebGlViewer3d(params.imagePath);

    view3d.enableZoom = params.enableZoom;
    view3d.enableFold = params.enableZoom;
    view3d.spinSpeed = params.spinSpeed * Math.PI / 180;

    view3d.currentScale *= params.initalScale;
    view3d.targetScale *= params.initalScale;
    view3d.initialState = params.initialState;
    view3d.imagePrefix = '';
    view3d.mouseSpeed = params.mouseSpeed;
    view3d.tagElement = params.targetDiv;
    view3d.webGLWidth = view3d.tagElement.width();
    view3d.webGLHeight = view3d.tagElement.height();
    view3d.viewAngleX += Math.PI + params.rotateViewX * Math.PI / 180;
    view3d.viewAngleY += params.rotateViewY * Math.PI / 180;
    view3d.initialize();
    view3d.animate();

    if (params.designPath !== '')
        params.designPath += "/";

    view3d.loadJsonPackage(params.designPath + params.designId + "_json.json", params.designPath + params.designId + "_png.png");
};

function webGlEnabled()
{
    if (!window.WebGLRenderingContext) {
        return false;
    }
    return true;
}


var rotate = false;
var rotateSpeed = 0.0;

// Define a class like this
function WebGlViewer3d(baseUrl) {

    // Add object properties like this
    this.baseUrl = baseUrl;

    this.data = null;

    this.enableZoom = true;
    this.enableFold = true;

    this.webGLWidth = 800;
    this.webGLHeight = 600;

    this.postEnd = true;

    this.angularSpeed = 0.2;
    this.lastTime = 0;
    this.angle = 0;
    this.boxAngle = 0;
    this.anglePrev = -1;
    this.foldIndex = 0;
    this.folding = true;
    this.foldMax = 0;
    this.nextAngle = 0;
    this.prevAngle = 0;

    this.viewAngleX = 0;
    this.viewAngleY = 0.71;
    this.mouseX = null;
    this.mouseY = null;
    this.mouseDown = false
    this.mouseDX = 0
    this.mouseDY = 0;
    this.touch_state = {};
    this.viewMomentumX = 0
    this.viewMomentumY = 0;

    this.baseScale = 1.0;
    this.targetScale = 1.5;
    this.currentScale = 1;
    this.pause = false;
    this.pauseTimer = 10000;

    this.spinSpeed = 0;
    this.doSpin = true;

    this.container = null;
    this.stats = null;
    this.camera = null;
    this.scene = null;
    this.projector = null;
    this.renderer = null;
    this.objects = [];
    this.spotlight = null;
    this.outsideTexture = null;
    this.insideTexture = null;
    this.insideSpecTexture = null;

    this.drawCanvas = null;
    this.drawContext = null;
    this.imageTest = null;

    this.center = new THREE.Vector3(0, 0, 0);
    this.centerTar = new THREE.Vector3(0, 0, 0);
    this.boundSize = new THREE.Vector3(0, 0, worldScale);
    this.boundsMin = null;
    this.boundsMax = null;

    this.lastPanel = null;
    this.lastPanelColor = new THREE.Color();

    this.col_R = 0;

    this.ambientLight = null;
    this.mainLight = null;
    this.updateImage = true;


    this.imageCanvas = null;

    this.lightBack = null;

    this.finishedLoading = null;
    this.finishedLoadingCount = 0;

    this.mouseSpeed = 1;


    this.adjustmentLag = 0.15;


    this.updateImageTick = 0;

    this.animSpin = rotate;//BIN.config.rotate ? BIN.config.rotate : 0; //rotate
    this.animSpinAdjusted = rotateSpeed;//BIN.config.rotateSpeed ? BIN.config.rotateSpeed : .01; //rotateSpeed
    this.animSpinMinSpeed = rotateSpeed;
    this.animSpinMaxSpeed = 0.01;

    this.fullScreen = false;

    this.ignoreClick = false;

    this.animSpinPre = 0;

    this.design = null;
    this.layoutTexture = null;

    this.tagElement = null;

    this.restoreElement = null;

    this.restoreWidth = 10;
    this.restoreHeight = 10;
    this.updateGeometryFunc = null;
    this.previewMode = false;
    this.panels = [];

    this.imagePrefix = 'js/design/';

    this.scaleX = 1;
    this.scaleY = 1;

    this.loadJsonPackage = function (json, img) {

        this.outsideTexture = THREE.ImageUtils.loadTexture(img);
        var that = this;
        $.get(json, null, function (data) {
            if (typeof data === "string")
                data = JSON.parse(data);
            that.loadJson(data);
            if (that.initialState === 'folded')
                that.angle = that.getMaxFold() + 0.9;
            else
                that.angle = 0;
        });
    };

    this.setWhiteInterior = function (enabled) {
        this.interior = enabled ? 'white' : '';
    };


}

WebGlViewer3d.prototype.loadMesh = function (finishLoadingFunc)
{
    if (!this.design)
        return false;

    this.design.update('loadedMesh');
    if (finishLoadingFunc)
        finishLoadingFunc();

    return true;
};

WebGlViewer3d.prototype.clearMesh = function ()
{
    for (var i in this.objects) {
        this.scene.remove(this.objects[i]);
    }
    this.objects = [];
};

WebGlViewer3d.prototype.setUpdateGeometry = function (updateGeometryFunc)
{
    this.updateGeometryFunc = updateGeometryFunc;
};


WebGlViewer3d.prototype.useForceReload = function () {
    return false;
};


WebGlViewer3d.prototype.update = function (section, design) {
    if (section === 'geometry')
    {
        if (this.updateGeometryFunc)
            this.updateGeometryFunc();
    }
};

WebGlViewer3d.prototype._loadMesh = function ()
{
    this.design.update('loadedMesh');
};

WebGlViewer3d.prototype.resize = function (w, h) {
    this.webGLWidth = w;
    this.webGLHeight = h;
    if (this.renderer)
        this.renderer.setSize(this.webGLWidth, this.webGLHeight);
}


WebGlViewer3d.prototype.restoreFullScreen = function ()
{
    this.resize(this.restoreWidth, this.restoreHeight);
    this.appendTo(this.restoreElement);
    $("#full-3d-panel").hide();
};



WebGlViewer3d.prototype.showFullscreen = function ()
{
    this.restoreElement = this.tagElement;
    this.restoreWidth = this.renderer.domElement.width;
    this.restoreHeight = this.renderer.domElement.height;
    this.resize($("#full-3d-panel").width(), $("#full-3d-panel").height());
    this.appendTo($("#full-3d-panel"));
    $("#full-3d-panel").show();

};

WebGlViewer3d.prototype.placeAt = function (tagElement) {
    this.tagElement = tagElement;
    if (this.renderer)
        this.tagElement.html($(this.renderer.domElement));
};

WebGlViewer3d.prototype.appendTo = function (tagElement) {
    this.tagElement = tagElement;
    if (this.renderer)
        this.tagElement.append($(this.renderer.domElement));
};


WebGlViewer3d.prototype.initializeView = function (design, layoutTexture, finishLoadingFunc) {
    this.design = design;
    this.layoutTexture = layoutTexture;

    this.initialize();

    if (finishLoadingFunc)
        finishLoadingFunc();

}



WebGlViewer3d.prototype.initialize = function () {

    /* if (!this.design)
     BIN.log("no design set");
     if (!this.layoutTexture)
     BIN.log("no layout set");*/

    if (this.renderer)
        return false;

    this._loadScene(this.layoutTexture, {
        inside: this.baseUrl + '/' + this.imagePrefix + 'cardboard.jpg',
        insideShine: this.baseUrl + '/' + this.imagePrefix + 'specular.jpg',
        side: this.baseUrl + '/' + this.imagePrefix + 'corrugate.png'
    });

    this.loadMesh();

    return true;

}

WebGlViewer3d.prototype.callback = function (event, obj) {
    //if (event !== 'beforeCommit')
    // this.reloadLayoutTexture();
};

WebGlViewer3d.prototype.loadLayoutTexture = function (layoutTexture)
{
    /* this.layoutTexture = layoutTexture;
     if (this.layoutTexture)
     {
     this.layoutTexture.subscribe('updated', this);
     this.layoutTexture.subscribe('beforeCommit', this);
     }
     this.reloadLayoutTexture();*/

};

WebGlViewer3d.prototype.reloadLayoutTexture = function ()
{
    //this.outsideTexture = new THREE.Texture(this.layoutTexture.getCanvas());
    // this.outsideTexture.needsUpdate = true;
    /*if (this.layoutTexture)
     {
     this.layoutTexture.loadInitialize();
     if (this.layoutTexture.isCanvas())
     {
     if (!this.outsideTexture)
     {
     }
     } else if (this.layoutTexture.isFile()) {
     this.outsideTexture = new THREE.Texture(this.layoutTexture.getFile());
     this.outsideTexture.needsUpdate = true;
     } else {
     this.outsideTexture = this.insideTexture;
     }
     this.updateImage = true;

     } else
     {
     this.outsideTexture = this.insideTexture;
     }*/
};

WebGlViewer3d.prototype._loadScene = function (layoutTexture, texturePaths) {

    if (this.outsideTexture)
        return;

    THREE.ImageUtils.crossOrigin = '';
    this.kraftTexture = THREE.ImageUtils.loadTexture(texturePaths.inside, null, function () {
    });

    if (!this.insideTexture)
        this.insideTexture = this.kraftTexture
    if (!this.outsideTexture)
        this.outsideTexture = this.kraftTexture
    this.loadLayoutTexture(layoutTexture);
    this.insideTexture.wrapS = this.insideTexture.wrapT = THREE.MirroredRepeatWrapping;
    this.insideSpecTexture = THREE.ImageUtils.loadTexture(texturePaths.insideShine, null, function () {
    });
    this.insideSpecTexture.wrapS = this.insideSpecTexture.wrapT = THREE.MirroredRepeatWrapping;
    this.sideTexture = THREE.ImageUtils.loadTexture(texturePaths.side, null, function () {
    });
    this.sideTexture.wrapS = THREE.RepeatWrapping;
    this.sideTexture.wrapT = THREE.RepeatWrapping;
    this.renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialiasing: true,
        antialias: true,
        preserveDrawingBuffer: true
    });
    this.renderer.setSize(this.webGLWidth, this.webGLHeight);
    //this.renderer.shadowMapEnabled = false;

    if (this.tagElement)
        this.tagElement.append($(this.renderer.domElement));

    this.initInput(this.renderer.domElement);

    this.scene = new THREE.Scene();

    this.lightBack = new THREE.DirectionalLight(0x333333);
    this.lightBack.position.set(-20, 80, 100);
    this.lightBack.target.position.copy(this.scene.position);
    this.scene.add(this.lightBack);

    this.ambientLight = new THREE.AmbientLight(0x4f4f4f);
    this.scene.add(this.ambientLight);

    // spotlight #1 -- yellow, dark shadow
    this.spotlight = new THREE.DirectionalLight(0xaaaaaa);
    this.spotlight.position.set(660, 350, 1000);
    this.spotlight.target.position.copy(this.scene.position);
    this.spotlight.shadowDarkness = 0.5;
    this.spotlight.intensity = 2;
    // must enable shadow casting ability for the light
    this.spotlight.castShadow = true;
    //spotlight.target = scene;
    this.scene.add(this.spotlight);
};

BIN.GetAllowance = function() {
    var allowanceObj = document.getElementById('Params_Allowance');
    if (allowanceObj) {
        return allowanceObj.value*1;
    }
    return 0.163;
};


WebGlViewer3d.prototype.loadJson = function (parts, vars, useMetric) {

    var data = parts;

    if (!parts.panels)
        return;

    var options = {};
    if (BIN.Designs && data.parameters && BIN.Designs[data.parameters.id]) {
        options = BIN.Designs[data.parameters.id];
    }

    var allowanceObj = document.getElementById('Params_Allowance');

    var tx1 = (0.18);
    var tx2 = (0.1);
    var paperboard = false;

    var mulX = worldScale;
    var mulY = worldScale;
    var mulZ = worldScale;

    if (data.options && data.options.flip_z) {
        mulZ *= -1;
        mulY *= -1;
    }

    var realScale = parts.parameters.Scale;



    if (allowanceObj && parts.parameters.MaterialName) {
        var materialIndex = 0;
        for (var i in matName)
            if (matName[i] == parts.parameters.MaterialName)
                materialIndex = i;
        if (!parts.parameters.Allowance)
            parts.parameters.Allowance = mats[materialIndex];
        if (parts.parameters.Allowance*1 < 0.0001)
            parts.parameters.Allowance = 0.0625;
        allowanceObj.value = parts.parameters.Allowance;


        var matObj = document.getElementById('material');
        matObj.value = materialIndex;
        //var matObj = document.getElementById('material');
        //matObj.value = matName[parts.parameters.MaterialName];
        //allowanceObj.value = matObj[matObj.value];
    }

    var allowance = -parts.parameters.Allowance / realScale;// -3.125;

    if (allowanceObj)
    {
        var allowanceText = allowanceObj.value;
        allowance = -(allowanceText === "" ? 0.0625 : allowanceText) / realScale;

        if (useMetric)
            allowance /= 25.4;

        var matObj = document.getElementById('material');
        var name = matName[matObj.value];
        if (name)
        {
            if (name.indexOf("/") > -1)
            {
                tx1 = 0.27;
            }
            if (name.toLowerCase().indexOf("paperboard") > -1)
            {
                paperboard = true;
            }
        }
    }

    /*allowance = allowance * 1;
     if (allowance !== allowance)
     allowance = 0;
     allowance = -Math.max(0.00625 / realScale, -allowance);*/

    allowance *= 1.25;

    var thickness = 0.5 * allowance;


    for (var j = 0; j < this.objects.length; j++)
    {
        this.scene.remove(this.objects[j]);
    }
    this.panels = [];
    this.objects = [];

    var outsideGeom = new THREE.Geometry();

    var vertex_count = 0;

    this.bones = [];
    for (var j = 0; j < parts.panels.length; j++)
    {
        var panel = parts.panels[j];
        var bone = new THREE.Bone();
        var bone2 = new THREE.Bone();
        bone.x = (panel.joint_point1.x + panel.joint_point2.x) * mulX * 0.5;
        bone.y = (panel.joint_point1.y + panel.joint_point2.y) * mulY * 0.5;


        var cx = 0;
        var cy = 0;
        for (var k = 0; k < panel.vertices.length; k += 1)
        {
            cx += panel.vertices[k].x * mulX;
            cy += panel.vertices[k].y * mulY;
        }
        cx /= panel.vertices.length;
        cy /= panel.vertices.length;

        bone.cx = cx;
        bone.cy = cy;

        //bone.x = cx;
        //bone.y = cy;

        bone.position.x = bone.x;
        bone.position.y = bone.y;

        bone.add(bone2);
        panel.bone = bone2;
        this.bones.push(bone);
        this.bones.push(bone2);
    }
    //BIN.log('panels')
    //BIN.log(parts.panels);
    //BIN.log(this.bones[0].position);

    this.bones[0].position.x = this.bones[0].cx;
    this.bones[0].position.y = this.bones[0].cy;

    this.bones[0].x = this.bones[0].position.x;
    this.bones[0].y = this.bones[0].position.y;

    this.scaleX = 0;
    this.scaleY = 0;

    for (var j = 0; j < parts.panels.length; j++)
    {
        var panel = parts.panels[j];

        for (var k = 0; k < panel.vertices.length; k += 1)
        {
            var v1 = panel.vertices[k];
            this.scaleX = Math.max(this.scaleX, v1.x);
            this.scaleY = Math.max(this.scaleY, v1.y);
        }

        var shared = [];
        var info = [];

        for (var k = 0; k < panel.vertices.length; k += 1)
        {
            shared[k] = [];
        }

        for (var k = 0; k < panel.mapping.length; k += 1)
        {
            var map = panel.mapping[k];
            shared[map.target_vertex].push(map.panel);
        }

        for (var k = 0; k < panel.vertices.length; k += 1)
        {
            var g = shared[k];
            var val = 1 / (1 + g.length);
            var vert = {};
            vert.i = new THREE.Vector4(j * 2 + 1, 0, 0, 0);
            vert.w = new THREE.Vector4(val, 0, 0, 0);

            //if (g.length ==2) {
            //  console.log('point', k);
            //}

            if (!parts.parameters.disable_blend) {
                if (g.length === 1) {
                    vert.i = new THREE.Vector4(j * 2 + 1, g[0] * 2 + 1, 0, 0);
                    vert.w = new THREE.Vector4(val, val, 0, 0);
                } else if (g.length === 2) {
                    vert.i = new THREE.Vector4(j * 2 + 1, g[0] * 2 + 1, g[1] * 2 + 1, 0);
                    vert.w = new THREE.Vector4(val, val, val, 0);
                } else if (g.length === 3) {
                    vert.i = new THREE.Vector4(j * 2 + 1, g[0] * 2 + 1, g[1] * 2 + 1, g[2] * 2 + 1);
                    vert.w = new THREE.Vector4(val, val, val, val);
                }//*/

                if (g.length > 3)
                    throw "ERROR";
            }
            info[k] = vert;
        }

        panel.shared = shared;
        panel.info = info;

    }



    for (var j = 0; j < parts.panels.length; j++)
    {
        var panel = parts.panels[j];

        if (panel.parent >= 0)
        {

            this.bones[j * 2].position.x -= this.bones[panel.parent * 2].x;
            this.bones[j * 2].position.y -= this.bones[panel.parent * 2].y;
            this.bones[panel.parent * 2 + 1].add(this.bones[j * 2]);
        }

        for (var k = 0; k < panel.vertices.length; k += 1)
        {
            var v1 = panel.vertices[k];
            var info = panel.info[k];

            outsideGeom.vertices.push(new THREE.Vector3(v1.x * mulX, v1.y * mulY, -thickness * mulZ));
            outsideGeom.skinIndices.push(info.i);
            outsideGeom.skinWeights.push(info.w);
        }
        for (var k = 0; k < panel.vertices.length; k += 1)
        {
            var v1 = panel.vertices[k];
            var info = panel.info[k];

            outsideGeom.vertices.push(new THREE.Vector3(v1.x * mulX, v1.y * mulY, thickness * mulZ));
            outsideGeom.skinIndices.push(info.i);
            outsideGeom.skinWeights.push(info.w);
        }

        var ts = 4;

        for (var k = 0; k < panel.indices.length; k += 3)
        {
            var v1 = panel.vertices[panel.indices[k + 0]];
            var v2 = panel.vertices[panel.indices[k + 1]];
            var v3 = panel.vertices[panel.indices[k + 2]];
            //*
            var face1 = new THREE.Face3(
                    panel.indices[k + 0] + vertex_count,
                    panel.indices[k + 1] + vertex_count,
                    panel.indices[k + 2] + vertex_count, undefined, undefined, 1);
            outsideGeom.faces.push(face1);

            if (BIN.Studio && BIN.Studio.InsideCanvas) {
                //*
                outsideGeom.faceVertexUvs[0].push([
                    new THREE.Vector2(1 - v1.x, 1 - v1.y),
                    new THREE.Vector2(1 - v2.x, 1 - v2.y),
                    new THREE.Vector2(1 - v3.x, 1 - v3.y)]);//*/

            } else {
                //*
                outsideGeom.faceVertexUvs[0].push([
                    new THREE.Vector2(ts * v1.x, ts * (1 - v1.y)),
                    new THREE.Vector2(ts * v2.x, ts * (1 - v2.y)),
                    new THREE.Vector2(ts * v3.x, ts * (1 - v3.y))]);//*/
            }


            var face2 = new THREE.Face3(
                    panel.indices[k + 0] + vertex_count + panel.vertices.length,
                    panel.indices[k + 1] + vertex_count + panel.vertices.length,
                    panel.indices[k + 2] + vertex_count + panel.vertices.length, undefined, undefined, 0);
            outsideGeom.faces.push(face2);
            outsideGeom.faceVertexUvs[0].push([
                new THREE.Vector2(v1.x, 1 - v1.y),
                new THREE.Vector2(v2.x, 1 - v2.y),
                new THREE.Vector2(v3.x, 1 - v3.y)]);
            //*/

        }

        vertex_count += panel.vertices.length * 2;



        for (var k = 0; k < panel.vertices.length; k += 1)
        {
            var l = (k + 1) % panel.vertices.length;
            var v1 = panel.vertices[k];
            var v2 = panel.vertices[l];
            var info = panel.info[k];

            outsideGeom.vertices.push(new THREE.Vector3(v1.x * mulX, v1.y * mulY, thickness * mulZ));
            outsideGeom.vertices.push(new THREE.Vector3(v1.x * mulX, v1.y * mulY, -thickness * mulZ));
            outsideGeom.skinIndices.push(info.i);
            outsideGeom.skinWeights.push(info.w);
            outsideGeom.skinIndices.push(info.i);
            outsideGeom.skinWeights.push(info.w);
        }

        var ty = 0;

        var gs = panel.groups || [panel.vertices.length], s = 0;

        for (var h in gs) {
            var g = gs[h];
            for (var k = 0; k < g; k += 1)
                    //for (var k = 0; k < panel.vertices.length; k += 1)
                    {
                        //var l = (k + 1) % panel.vertices.length;

                        var i0 = k + s;
                        var i1 = (k + 1) % g + s;

                        var v1 = panel.vertices[i0];
                        var v2 = panel.vertices[i1];

                        var dx2 = v1.x - v2.x;
                        var dy2 = v1.y - v2.y;
                        var ll = Math.sqrt(dx2 * dx2 + dy2 * dy2);

                        if (true) {
                            var tt = i0;
                            i0 = i1;
                            i1 = tt;
                        }

                        var v11 = vertex_count + i0 * 2;
                        var v21 = vertex_count + i0 * 2 + 1;
                        var v22 = vertex_count + i1 * 2 + 1;
                        var v12 = vertex_count + i1 * 2;

                        if (h == 0) {
                            //    v21++;
                            //  v22++;
                        } else {
                            //v11++;
                            //v12++;
                        }


                        var ty2 = v1.x;
                        var ty1 = v2.x;

                        ty1 *= 15;
                        ty2 *= 15;

                        var face1 = new THREE.Face3(
                                v11,
                                v21,
                                v22, [new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 1, 0)], undefined, 2);
                        outsideGeom.faces.push(face1);
                        outsideGeom.faceVertexUvs[0].push([
                            new THREE.Vector2(tx1, ty1),
                            new THREE.Vector2(tx2, ty1),
                            new THREE.Vector2(tx2, ty2)]);
                        var face2 = new THREE.Face3(
                                v22,
                                v12,
                                v11, [new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 1, 0)], undefined, 2);
                        outsideGeom.faces.push(face2);
                        outsideGeom.faceVertexUvs[0].push([
                            new THREE.Vector2(tx2, ty2),
                            new THREE.Vector2(tx1, ty2),
                            new THREE.Vector2(tx1, ty1)]);

                        ty += ll;
                    }
            s += g;
        }
        vertex_count += panel.vertices.length * 2;


    }

    outsideGeom.computeFaceNormals();
    outsideGeom.computeVertexNormals();

    var materialOutside = new THREE.MeshPhongMaterial({skinning: true, color: 0xc0bbb3, side: THREE.FrontSide, map: this.outsideTexture, specularMap: this.insideSpecTexture});
    var materialInside = new THREE.MeshPhongMaterial({skinning: true, color: 0xb0aaa3, side: THREE.BackSide, map: this.insideTexture, specularMap: this.insideSpecTexture});
    //var materialInside = new THREE.MeshPhongMaterial({skinning: true, color: 0xb0aaa3, side: THREE.BackSide, specularMap: this.insideSpecTexture});
    var materialSide = new THREE.MeshPhongMaterial({skinning: true, color: 0xb0aaa3, side: THREE.BackSide, map: this.sideTexture, specularMap: this.sideTexture});

    if (paperboard)
        materialSide = materialInside;

    this.meshOutside = new THREE.SkinnedMesh(outsideGeom, new THREE.MeshFaceMaterial([materialOutside, materialInside, materialSide]));

    this.setWhiteInterior = function (enabled) {
        materialInside.map = enabled ? null : this.insideTexture;
        materialInside.needsUpdate = true;
        this.interior = enabled ? 'white' : '';
    };

    if (this.interior === 'white') {
        this.setWhiteInterior(true);
    }

    this.materialInside = materialInside;
    this.materialOutside = materialOutside;



    this.skeleton = new THREE.Skeleton(this.bones);
    this.meshOutside.add(this.bones[ 0 ]);
    this.meshOutside.bind(this.skeleton);//this.bones[ 0 ]);//this.skeleton);

    //setTimeout(function(){
    this.scene.add(this.meshOutside);
    //},500);
    this.objects.push(this.meshOutside);

    for (var j = 0; j < parts.panels.length; j++)
    {
        var panelObj = new THREE.Geometry();
        var panel = parts.panels[j];
        panelObj.children = [];
        panelObj.parent = null;
        panelObj.foldManual = false;
        panelObj.foldPt0 = new THREE.Vector3(panel.joint_point1.x * mulX, panel.joint_point1.y * mulY, 0);
        panelObj.foldPt1 = new THREE.Vector3(panel.joint_point2.x * mulX, panel.joint_point2.y * mulY, 0);

        var dx = (panel.joint_point1.x - panel.joint_point2.x) * mulX;
        var dy = (panel.joint_point1.y - panel.joint_point2.y) * mulY;
        var dl = Math.sqrt(dx * dx + dy * dy);

        panelObj.foldDir = new THREE.Vector3(dx / dl, dy / dl, 0);

        panelObj.foldAngle = 0;
        panelObj.fold = [];
        panelObj.fold = panel.folds;
        for (var k = 0; k < panelObj.fold.length; k += 1)
        {
            var a = panelObj.fold[k].angle;
            if (options.panels) {
                if (Math.abs(a) < 4)
                    a = 0;
                if (Math.abs(Math.abs(a) - 90) < 4)
                    a = 90 * Math.sign(a);

                if (options.panels[panel.rid]) {
                    var da = options.panels[panel.rid];
                    a += da;
                }
            }
            //if (BIN.Design && BIN.Design[])

            panelObj.fold[k].angle = a * (Math.PI / 180);// + Math.random() * 0.25) * (Math.PI / 180);
        }

        /*
         var gs = panel.groups || [panel.vertices.length], s = 0;
         for (var h in gs) {
         var g = gs[h];
         for (var k = s; k < s + g; k += 1)
         //for (var k = 0; k < panel.vertices.length; k += 1)
         {
         //var l = (k + 1) % panel.vertices.length;
         var l = (k - s + 1) % g + s;
         }
         }//*/
        //*

        for (var k = 0; k < panel.vertices.length; k += 1)
        {
            var v1 = panel.vertices[k];
            panelObj.vertices.push(new THREE.Vector3(v1.x * mulX, v1.y * mulY, 0.5 * allowance));
            panelObj.vertices.push(new THREE.Vector3(v1.x * mulX, v1.y * mulY, -0.5 * allowance));
        }

        panelObj.mainMatrix = new THREE.Matrix4();

        this.panels[panel.id] = panelObj;
    }

    for (var j = 0; j < parts.panels.length; j++)
    {
        var panel = parts.panels[j];
        if (panel.parent >= 0)
        {
            this.panels[panel.id].parent = this.panels[panel.parent];
            this.panels[panel.parent].children.push(this.panels[panel.id]);
        }
    }


    var al = this.adjustmentLag;
    this.adjustmentLag = 1;
    this.calcBoundary();

    this.center.x = this.centerTar.x;
    this.center.y = this.centerTar.y;
    this.center.z = this.centerTar.z;

    //this.updatePanel(this.panels[0]);

    this.outsideTexture.needsUpdate = true;

    this.meshOutside.position.x = -this.center.x;
    this.meshOutside.position.y = -this.center.y;
    this.meshOutside.position.z = -this.center.z;

    for (var i = 1; i < this.skeleton.bones.length / 2; i++) {
        var panel = this.panels[i];
        var rot = panel.foldAngle;//  (1+Math.sin(time * 0.0009))*0.25*Math.PI;
        foldDir = {x: 1, y: 0};
        var foldDir = panel.foldDir;

        var axis = new THREE.Vector3(0, 0, 0);
        axis.subVectors(panel.foldPt0, panel.foldPt1);
        axis.normalize();
        this.skeleton.bones[ i * 2 + 1].setRotationFromAxisAngle(axis, panel.foldAngle);
    }
    this.adjustmentLag = al;

};

WebGlViewer3d.prototype.setInteriorCanvas = function (canvas) {
    this.insideTexture = new THREE.Texture(canvas);
    this.insideTexture.doUpdate = true;
    if (this.materialInside) {
        this.materialInside.map = this.insideTexture;
        this.materialInside.needsUpdate = true;
    }
};

WebGlViewer3d.prototype.setExteriorCanvas = function (canvas) {
    this.outsideTexture = new THREE.Texture(canvas);
    this.outsideTexture.doUpdate = true;
    if (this.materialOutside) {
        this.materialOutside.map = this.outsideTexture;
        this.materialOutside.needsUpdate = true;
    }
};

var _msFrameCost = 0;
var _msFrame = 0;
var _lastTime = Date.now();
var fpsCheckInterval;



WebGlViewer3d.prototype.setRotation = function (rotation, rotationSpeed){

  this.animSpin = rotation;
  this.animSpinAdjusted = rotationSpeed;
  this.animSpinMinSpeed = rotationSpeed;

}


// this function is executed on each animation frame
WebGlViewer3d.prototype.animate = function () {

    var time = Date.now();// (new Date()).getTime();
    var timeDiff = time - this.lastTime;
    this.lastTime = time;


    var tag = this.tagElement || $("#mainViewer3d");
    var cw = tag.width();
    var ch = tag.height();
    if (cw && ch)
    {
        this.webGLWidth = cw;
        this.webGLHeight = ch;
        if (this.renderer)
            this.renderer.setSize(this.webGLWidth, this.webGLHeight);
    }

    // update

    this.pauseTimer += timeDiff;
    var angleChange = this.angularSpeed * timeDiff * 2 * Math.PI / 1000;// * 20;
    if (BIN.DebugDesign)
        angleChange *= (BIN.FoldSpeed || 0.2);
    else
        angleChange *= (BIN.FoldSpeed || 1);
    if (angleChange > 1)
        angleChange = 0;

    //if (!BIN.DebugDesign || this.angle < 2.0)
    this.angle += angleChange;


    var m1 = new THREE.Matrix4();
    m1.makeRotationZ(this.angle);

    var m2 = new THREE.Matrix4();
    m2.makeTranslation(-400, -300, 0);



    if (this.panels.length > 0)
    {
        this.updatePanel(this.panels[0]);
        this.anglePrev = this.angle;
        if (this.angle >= this.nextAngle)
        {
            this.nextAngle = Math.floor(this.angle) + 1;
            this.prevAngle = this.nextAngle - 1;
        }
        if (this.angle < this.prevAngle)
        {
            this.prevAngle = Math.floor(this.angle);
            this.nextAngle = this.prevAngle + 1;
        }
        this.calcBoundary();
        this.center.x = this.centerTar.x;
        this.center.y = this.centerTar.y;
        this.center.z = this.centerTar.z;
        this.updatePanel(this.panels[0]);

    }


    this.center.x += (this.centerTar.x - this.center.x) * 0.025;
    this.center.y += (this.centerTar.y - this.center.y) * 0.025;
    this.center.z += (this.centerTar.z - this.center.z) * 0.025;

    if (this.lastPanel)
    {
        this.lastPanel.panel.foldAngle += this.viewMomentumX * 0.25;
        this.lastPanel.panel.foldManual = true;
        this.viewMomentumX *= 0.6;
        this.viewMomentumY *= 0.6;
    } else {
        if (!this.fullScreen)
            this.animSpinAdjusted = this.animSpinMinSpeed;//BIN.config.rotateSpeed ? BIN.config.rotateSpeed : 0;//this.animSpinAdjusted = 0;
        this.viewAngleX += this.viewMomentumX + this.animSpinAdjusted;
        this.boxAngle += this.viewMomentumX + this.animSpinAdjusted;
        this.viewAngleY += this.viewMomentumY;

        this.animSpinAdjusted += (this.animSpin - this.animSpinAdjusted) * 0.1;

        if (this.updateImage && this.outsideTexture) //&& this.updateImageTick > 3
        {
            this.updateImage = false;
            this.updateImageTick = 0;
        }
        if (this.insideTexture.doUpdate) {
            this.insideTexture.needsUpdate = true;
        }
        if (this.outsideTexture.doUpdate) {
            this.outsideTexture.needsUpdate = true;
        }
        this.updateImageTick++;

    }

    if (this.doSpin)
        this.viewAngleX += this.spinSpeed;

    if (this.mouseDown)
    {
        this.viewMomentumX *= 0.0;
        this.viewMomentumY *= 0.0;
    } else
    {
        this.viewMomentumX *= 0.696;
        this.viewMomentumY *= 0.696;
    }
    this.currentScale += (this.targetScale - this.currentScale) * 0.3;

    if (this.viewAngleY < -Math.PI / 2)
        this.viewAngleY = -Math.PI / 2;
    if (this.viewAngleY > Math.PI / 2)
        this.viewAngleY = Math.PI / 2;

    this.camera = new THREE.PerspectiveCamera(40, this.webGLWidth / this.webGLHeight, 2 * this.currentScale, 2500 * Math.max(1, this.currentScale));
    var scale = 1.8 * Math.max(this.boundSize.x, Math.max(this.boundSize.y, this.boundSize.z)) / worldScale;

    this.camera.up = new THREE.Vector3(0, 0, 1);

    var boxAngle2 = this.viewAngleX;//this.boxAngle;// + Math.PI / 2;

    this.spotlight.position.set((760 * Math.cos(boxAngle2) - 450 * Math.sin(boxAngle2)) * Math.cos(this.viewAngleY), (-450 * Math.cos(boxAngle2) + 760 * Math.sin(boxAngle2)) * Math.cos(this.viewAngleY), 1000 * Math.sin(this.viewAngleY) + 400);

    this.camera.position.y = scale * ((-450 * Math.cos(this.viewAngleX) + 400 * Math.sin(this.viewAngleX)) * Math.cos(this.viewAngleY)) * this.currentScale;
    this.camera.position.x = scale * ((400 * Math.cos(this.viewAngleX) + 450 * Math.sin(this.viewAngleX)) * Math.cos(this.viewAngleY)) * this.currentScale;
    this.camera.position.z = scale * 600 * Math.sin(this.viewAngleY) * this.currentScale + this.center.z;

    this.camera.lookAt(new THREE.Vector3(0, 0, this.center.z));

    this.camera.near = 2 * this.currentScale;
    this.camera.far = 1500 * Math.max(1, this.currentScale);

    if (this.skeleton)
    {
        this.meshOutside.position.x = -this.center.x;
        this.meshOutside.position.y = -this.center.y;

        for (var i = 1; i < this.skeleton.bones.length / 2; i++) {
            var panel = this.panels[i];
            var axis = new THREE.Vector3(0, 0, 0);
            axis.subVectors(panel.foldPt0, panel.foldPt1);
            axis.normalize();
            this.skeleton.bones[ i * 2 + 1].setRotationFromAxisAngle(axis, panel.foldAngle);
        }
    }
    if (this.skeletonHelper)
    {
        this.skeletonHelper.update();
    }


    this.renderer.render(this.scene, this.camera);

    var ct = Date.now();
    var dt = (ct - _lastTime);
    var dtCost = (ct - time);
    _lastTime = ct;
    _msFrame += (dt * 1.0 - _msFrame * 1.0) * 0.05;
    _msFrameCost += (dtCost * 1.0 - _msFrameCost * 1.0) * 0.05;

    /*if (!fpsCheckInterval) {
     fpsCheckInterval = setInterval(function () {
     console.log(1000/_msFrame, _msFrameCost)
     }, 1500);
     }*/

    var __webglObj = this;
    requestAnimationFrame(function () {
        __webglObj.animate();
    });
};



WebGlViewer3d.prototype.boundCheck = function (p, m) {

    var v = new THREE.Vector3(p.x, p.y, p.z);
    v.applyMatrix4(m);
    if (this.boundsMin == null)
    {
        this.boundsMin = new THREE.Vector3(v.x, v.y, v.z);
        this.boundsMax = new THREE.Vector3(v.x, v.y, v.z);
    } else
    {
        this.boundsMin.min(v);
        this.boundsMax.max(v);

    }
};

WebGlViewer3d.prototype.calcBoundary = function () {
    this.boundsMin = null;
    this.boundsMax = null;

    for (var i = 0; i < this.panels.length; i++) {
        var panel = this.panels[i];
        for (var j in panel.vertices) {
            this.boundCheck(panel.vertices[j], panel.mainMatrix);
        }
    }

    this.boundSize.subVectors(this.boundsMax, this.boundsMin);
    this.centerTar.addVectors(this.boundsMax, this.boundsMin);
    this.centerTar.multiplyScalar(0.5);
};

WebGlViewer3d.prototype.resetFold = function () {

    this.angle = Math.min(this.angle, this.foldMax + 1);
    this.angle = Math.max(this.angle, 0);
};

WebGlViewer3d.prototype.getMaxFold = function (panel) {
    panel = panel || this.panels[0];
    this.foldMax = Math.max(this.foldMax, panel.fold[this.foldIndex].order);
    for (var i in panel.children) {
        var pan = panel.children[i];
        this.getMaxFold(pan);
    }
    return this.foldMax;
}
WebGlViewer3d.prototype.updatePanel = function (panel) {
    if (panel == null)
        return;
    var p = new THREE.Vector3(0, 0, 0);
    if (panel.parent != null && panel.parent.foldPt0 != null)
        p = panel.parent.foldPt0;
    var p2 = new THREE.Vector3(0, 0, 0);
    var rot = new THREE.Matrix4();

    if (panel.foldAngle == null)
        panel.foldAngle = 0;

    var t1 = new THREE.Matrix4();
    var t2 = new THREE.Matrix4();

    if (panel.foldPt0 != null)
    {
        p2 = panel.foldPt0;

        var axis = new THREE.Vector3(0, 0, 1);
        axis.subVectors(panel.foldPt0, panel.foldPt1);
        axis.normalize();


        if (!panel.foldManual) {

            this.foldMax = Math.max(this.foldMax, panel.fold[this.foldIndex].order);
            var fa = 0;
            if (this.angle >= panel.fold[this.foldIndex].order)
                fa = panel.fold[this.foldIndex].angle;


            var fn = 0;
            if (this.angle - this.anglePrev > 0)
            {
                if (this.angle + 1 >= panel.fold[this.foldIndex].order)
                    fn = panel.fold[this.foldIndex].angle;
            } else
            {
                fn = fa;
                fa = panel.fold[this.foldIndex].angle;
                if (this.angle - 1 <= panel.fold[this.foldIndex].order)
                    fa = 0;

            }
            var dif = 0;//angle - (panel.foldCur-1);
            if (fn != fa)
                dif = this.angle - Math.floor(this.angle);
            panel.foldAngle += (fa * (1 - dif) + fn * dif - panel.foldAngle);// * this.adjustmentLag;
        } else
        {
            if (panel.fold[this.foldIndex].angle > 0)
            {
                panel.foldAngle = Math.max(0, panel.foldAngle);
                panel.foldAngle = Math.min(Math.max(panel.fold[1].angle, panel.fold[0].angle), panel.foldAngle);
            } else
            {
                panel.foldAngle = Math.max(panel.fold[this.foldIndex].angle, panel.foldAngle);
                panel.foldAngle = Math.min(0, panel.foldAngle);
            }
        }

        rot.makeRotationAxis(axis, panel.foldAngle);

        t1.makeTranslation(-p2.x, -p2.y, -p2.z);
        t2.makeTranslation(p2.x, p2.y, p2.z);
    } else {
        rot.makeRotationX(Math.PI);
        t1.makeTranslation(-0, -0, 90);
    }

    var m3 = new THREE.Matrix4();
    m3.multiplyMatrices(t2, rot);
    m3.multiplyMatrices(m3, t1);
    if (panel.parent)
        m3.multiplyMatrices(panel.parent.mainMatrix, m3);
    //else


    panel.mainMatrix = new THREE.Matrix4();
    panel.mainMatrix.copy(m3);

    t1.makeTranslation(-this.center.x, -this.center.y, -this.center.z);

    m3.multiplyMatrices(t1, m3);

    for (var i in panel.children) {
        var pan = panel.children[i];
        this.updatePanel(pan);
    }
};

WebGlViewer3d.prototype.initInput = function (element) {

    this.hasMouseCtx = false;

    element.viewer3d = this;
    element.onmousedown = this.mousedown;//"mousedown(event);"
    element.onmouseout = this.mouseout;//"mouseup(event);"
    element.onmouseup = this.mouseup;//"mouseup(event);"
    element.onmousemove = this.mousemove;//"mousemove(event);"
    element.ontouchend = this.do_touchend;
    element.ontouchstart = this.do_touchstart;
    element.ontouchmove = this.do_touchmove;

    /* element.onpointermove = function (e) {
     if (e.pointerType !== "touch")
     return;
     }
     element.onpointerdown = function (e) {
     if (e.pointerType !== "touch")
     return;
     }
     element.onpointerup = function (e) {
     if (e.pointerType !== "touch")
     return;
     }*/

    //if (window.addEventListener)
    //document.addEventListener('DOMMouseScroll', this.sceneZoom, false);
    this.viewer3d = this;
    //element.onmousewheel = this.sceneZoom;
    var that = this;
    $(element).on('mousewheel DOMMouseScroll', function (event) {
        that.sceneZoom(event.originalEvent);
    });

};


WebGlViewer3d.prototype.sceneZoom = function (event) {
    if (!this.viewer3d)
        return;

    if (!this.viewer3d.hasMouseCtx)
        return;
    event.preventDefault();
    var delta = 0;

    if (!event)
        event = window.event;
    // normalize the delta
    if (event.wheelDelta) {

        // IE and Opera
        delta = -event.wheelDelta / 60;

    } else if (event.detail) {

// W3C
        delta = event.detail / 2;
    }

    var scale = Math.pow(1.1, delta);
    if (this.viewer3d.enableZoom)
        this.viewer3d.targetScale = scale * this.viewer3d.targetScale;

    if(this.viewer3d.targetScale > 3){
      this.viewer3d.targetScale = 3;
    }

    if(this.viewer3d.targetScale < .5){
      this.viewer3d.targetScale = .5;
    }
};

WebGlViewer3d.prototype.mouseout = function (event) {
    this.viewer3d.mouseup(event);
    this.viewer3d.hasMouseCtx = false;
};

WebGlViewer3d.prototype.mouseclick = function (event) {
    event.preventDefault();


    if (this.viewer3d.ignoreClick) {
        this.viewer3d.ignoreClick = false;
        return;
    }
    if (this.viewer3d.animSpin == 0)
        this.viewer3d.animSpin = this.animSpinMaxSpeed;
    else
        this.viewer3d.animSpin = 0;
};

WebGlViewer3d.prototype.mouseup = function (event) {
    var viewer = this.viewer3d;
    if (viewer == null)
        viewer = this;
    event.preventDefault();
    viewer.mouseDown = false;
    viewer.animSpin = viewer.animSpinPre;

    viewer.spinTimeout = setTimeout(function () {
        viewer.doSpin = true;
    }, 5 * 1000);
};
WebGlViewer3d.prototype.mousedown = function (event) {
    event.preventDefault();
    this.viewer3d.mouseX = event.pageX;
    this.viewer3d.mouseY = event.pageY;
    this.viewer3d.mouseDown = true;
    clearTimeout(this.viewer3d.spinTimeout);
    this.viewer3d.doSpin = false;
    this.viewer3d.baseScale = this.viewer3d.targetScale;
    if (this.viewer3d.pauseTimer < 500)
    {
        if (this.viewer3d.enableFold) {
            this.viewer3d.resetFold();
            this.viewer3d.angularSpeed = -this.viewer3d.angularSpeed;
        }
//pause = !pause;
    }
    this.viewer3d.pauseTimer = 0;
    this.viewer3d.animSpinPre = this.viewer3d.animSpin;

    this.viewer3d.animSpin = 0;
//   down(event);

};

WebGlViewer3d.prototype.down = function (event) {
    var obj = $(this.viewer3d.renderer.domElement);
    var px = event.clientX - obj.offset().left + document.body.scrollLeft;
    var py = event.clientY - obj.offset().top + document.body.scrollTop;
    var vector = new THREE.Vector3((px / this.viewer3d.renderer.domElement.width) * 2 - 1, -(py / this.viewer3d.renderer.domElement.height) * 2 + 1, 0.5);
    this.projector.unprojectVector(vector, this.viewer3d.camera);
    var raycaster = new THREE.Raycaster(this.viewer3d.camera.position, vector.sub(this.viewer3d.camera.position).normalize());

    var intersects = raycaster.intersectObjects(this.viewer3d.objects);

    if (this.viewer3d.lastPanel != null)
        this.viewer3d.lastPanel.material.color.copy(this.viewer3d.lastPanelColor);
    this.viewer3d.lastPanel = null;
    if (intersects.length > 0) {
        this.viewer3d.lastPanel = intersects[ 0 ].object;
        this.viewer3d.lastPanelColor.copy(lastPanel.material.color);
        this.viewer3d.lastPanel.material.color.setHex(0xffffff);
    }
};

WebGlViewer3d.prototype.do_touchend = function (event) {
    event.preventDefault();
    this.viewer3d.mouseDown = false;
    this.viewer3d.animSpin = this.viewer3d.animSpinPre;
};

WebGlViewer3d.prototype.mousemove = function (event) {

    event.preventDefault();
    if (this.viewer3d.mouseDown)
    {
        this.viewer3d.ignoreClick = true;

        this.viewer3d.mouseDX = event.pageX - this.viewer3d.mouseX;
        this.viewer3d.mouseDY = event.pageY - this.viewer3d.mouseY;
        this.viewer3d.mouseX = event.pageX;
        this.viewer3d.mouseY = event.pageY;
        this.viewer3d.viewMomentumX = -this.viewer3d.mouseDX * 0.015 * this.viewer3d.mouseSpeed;//(mouseDX*0.01 - viewMomentumX)*0.2;
        this.viewer3d.viewMomentumY = this.viewer3d.mouseDY * 0.015 * this.viewer3d.mouseSpeed;         //   animSpin = 0;


    }
    this.viewer3d.hasMouseCtx = true;
};
var touch_state = {};

WebGlViewer3d.prototype.do_touchstart = function (event) {
    event.preventDefault();
    try
    {
        touch_state.nlast = event.touches.length;
        if (event.touches.length === 1) {
            var touch = event.touches[0];
            touch_state.xlast = touch.pageX;
            touch_state.ylast = touch.pageY;
            if (this.viewer3d.pauseTimer < 500)
                this.viewer3d.pause = !this.viewer3d.pause;
            this.viewer3d.pauseTimer = 0;
            this.viewer3d.mouseDown = true;

            if (!event.clientX)
            {
                event.clientX = touch.pageX;
                event.clientY = touch.pageY;
            }
            //  down(event);
        }
        if (event.touches.length === 2) {
            touch_state.line = get_line(event.touches);
            this.viewer3d.baseScale = this.viewer3d.targetScale;
        }
        if (event.touches.length === 3) {
            touch_state.bbox = get_bbox(event.touches);
            touch_state.done = 0;
        }

        this.viewer3d.animSpinPre = this.viewer3d.animSpin;

        this.viewer3d.animSpin = 0;
    } catch (e) {
        alert(e);
    }

};

WebGlViewer3d.prototype.do_touchmove = function (event) {
    event.preventDefault();
    try
    {
        if (event.touches.length != touch_state.nlast) {
            this.viewer3d.do_touchstart(event);
            return;
        }
        if (event.touches.length === 1) {


            var touch = event.touches[0];

            this.viewer3d.viewMomentumX = -(touch.pageX - touch_state.xlast) * 0.015;//(mouseDX*0.01 - viewMomentumX)*0.2;
            this.viewer3d.viewMomentumY = (touch.pageY - touch_state.ylast) * 0.015;

            touch_state.xlast = touch.pageX;
            touch_state.ylast = touch.pageY;

        }
        if (event.touches.length === 2) {
            var line = get_line(event.touches);
            var scale = line.length / touch_state.line.length;
            if (scale != 1) {
                this.viewer3d.targetScale = this.viewer3d.targetScale / scale;                 //scale_scene(scale);
            }
            // rotscene(0,0,delta_angle(line.angle,touch_state.line.angle));
            var dx = touch_state.line.pt1.x - touch_state.line.pt0.x;
            var dy = touch_state.line.pt1.y - touch_state.line.pt0.y;
            var dlen = Math.sqrt(dx * dx + dy * dy);
            dx /= dlen;
            dy /= dlen;
            var a = -dy;
            var b = dx;
            var c = -(a * touch_state.line.ctrpt.x + b * touch_state.line.ctrpt.y);
            var d = a * line.ctrpt.x + b * line.ctrpt.y + c;

            touch_state.line = line;
            //  update_scene();
        }
        if (event.touches.length === 3) {
            bbox = get_bbox(event.touches);
            if (touch_state.done)
                return;


            if (touch_state.bbox.area * 2 < bbox.area) {
                //fold(-1);
                this.viewer3d.resetFold();
                if (this.viewer3d.angularSpeed < 0)
                    this.viewer3d.angle = 0;

                this.viewer3d.angularSpeed = -Math.abs(this.viewer3d.angularSpeed);
                touch_state.done = 1;
            }
            if (bbox.area * 2 < touch_state.bbox.area) {
                //fold(1);

                this.viewer3d.resetFold();
                if (this.viewer3d.angularSpeed > 0)
                    this.viewer3d.angle = this.viewer3d.foldMax;
                touch_state.done = 1;
                this.viewer3d.angularSpeed = Math.abs(this.viewer3d.angularSpeed);
            }
        }
    } catch (e) {
        BIN.log(e);
    }
};

function get_bbox(touches) {
    var xmin = touches[0].pageX;
    var xmax = touches[0].pageX;
    var ymin = touches[0].pageY;
    var ymax = touches[0].pageY;
    for (var i = 1; i < touches.length; i++) {
        var x = touches[i].pageX;
        var y = touches[i].pageY;
        if (x < xmin)
            xmin = x;
        if (xmax < x)
            xmax = x;
        if (y < ymin)
            ymin = y;
        if (ymax < y)
            ymax = y;
    }
    return {
        xmin: xmin,
        xmax: xmax,
        ymin: ymin,
        ymax: ymax,
        width: xmax - xmin,
        height: ymax - ymin,
        area: (xmax - xmin) * (ymax - ymin)
    };
}

function atan_degrees(x, y) {
    return 90 * Math.atan2(y, x) / Math.atan2(1, 0);
}

function delta_angle(ang1, ang0) {
    var delta = ang1 - ang0;
    if (360 < delta)
        delta -= 360;
    if (delta < -360)
        delta += 360;
    return delta;
}
function new_point(x, y) {
    return {x: x, y: y};
}

function get_line(touches) {
    var pt0 = new_point(touches[0].pageX, touches[0].pageY);
    var pt1 = new_point(touches[1].pageX, touches[1].pageY);
    var dx = pt1.x - pt0.x;
    var dy = pt1.y - pt0.y;
    return  {
        pt0: pt0,
        pt1: pt1,
        delta: new_point(dx, dy),
        ctrpt: new_point((pt0.x + pt1.x) / 2, (pt0.y + pt1.y) / 2),
        angle: atan_degrees(dx, dy),
        length: Math.sqrt(dx * dx + dy * dy)}
}

THREE.Object3D.prototype.setMatrix = function () {

    var m1 = new THREE.Matrix4();
    return function (matrix) {
        this.matrix = matrix;
        this.position.setFromMatrixPosition(this.matrix);
        this.scale.setFromMatrixScale(this.matrix);
        m1.extractRotation(this.matrix);
        this.setRotationFromMatrix(m1);
    };

}();
