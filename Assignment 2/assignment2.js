"use strict";

var canvas;
var gl;

var bufferTri, bufferRect,bufferRect1, bufferRect2,triVertices, rectVertices,rectVertices1,rectVertices2;
var vPosition,color,triangle,r=0,g=0,b=0;
var transformationMatrix, transformationMatrixLoc,translate_x=0,translate_y=0,scaleMatrix,scale=1,rotate=0;
var speed=1;

window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 2.0, 1.0, 1.0, 1.0 );
    
    //  Load shaders and initialize attribute buffers
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // Make the letters
    triVertices = [
        vec2(  -0.8,  -0.6 ),
        vec2(  -0.0,  -0.6),
        vec2(  -0.4, 0.4)
    ];

    rectVertices = [
        vec2(   0.1,  -0.2 ),
        vec2(  0.3,  -0.2 ),
        vec2(  0.1,  0.25 ),
        vec2(  0.3, 0.25)
    ];
	
	
	rectVertices1 = [
        vec2(  0.4,  -0.2 ),
        vec2(  0.6,  -0.2 ),
        vec2(  0.4,  0.2 ),
        vec2(  0.6,  0.2 )
    ];
	
    rectVertices2 = [
        vec2(  0.7,  -0.2 ),
        vec2(  0.9,  -0.2 ),
        vec2(  0.7,  0.2 ),
        vec2(  0.9,  0.2 )
    ];
	
   

    
    bufferTri = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferTri );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(triVertices), gl.STATIC_DRAW );
  
    
    bufferRect = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferRect );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(rectVertices), gl.STATIC_DRAW );
	
	 bufferRect1 = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferRect1 );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(rectVertices1), gl.STATIC_DRAW );
	
	 bufferRect2 = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferRect2 );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(rectVertices2), gl.STATIC_DRAW );

    vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    transformationMatrixLoc = gl.getUniformLocation( program, "transformationMatrix" );
	color = gl.getUniformLocation( program, "color" );

    document.getElementById("inp_objX").oninput = function(event) {
        translate_x =  document.getElementById("inp_objX").value;
    };
    document.getElementById("inp_objY").oninput = function(event) {
        translate_y = document.getElementById("inp_objY").value;
    };
    document.getElementById("inp_obj_scale").oninput = function(event) {
        scale = document.getElementById("inp_obj_scale").value;
    };
    document.getElementById("inp_obj_rotation").oninput = function(event) {
        rotate=document.getElementById("inp_obj_rotation").value;
    };
    document.getElementById("inp_wing_speed").oninput = function(event) {
        //TODO: fill here to adjust wing scale according to slider value
		speed = document.getElementById("inp_wing_speed").value;
		
    };
    document.getElementById("redSlider").oninput = function(event) {
        //TODO: fill here to adjust color according to slider value
		r=document.getElementById("redSlider").value;
		
    };
    document.getElementById("greenSlider").oninput = function(event) {
        //TODO: fill here to adjust color according to slider value
		g=document.getElementById("greenSlider").value;
    };
    document.getElementById("blueSlider").oninput = function(event) {
        //TODO: fill here to adjust color according to slider value
		b=document.getElementById("blueSlider").value;
    };

    render();

};

var r_amount=0;
var amount=0.5;
var speedAmount;

function render() {

    gl.clear( gl.COLOR_BUFFER_BIT );
 
	
    transformationMatrix = mat4();
	
    gl.uniformMatrix4fv( transformationMatrixLoc, false, flatten(transformationMatrix) );
	transformationMatrix = mult(translate(translate_x, translate_y, 0), scalem(scale, scale, 1));
	transformationMatrix=mult(transformationMatrix,rotateX(rotate));
	//r_amount=r_amount+0.5;
	transformationMatrix=mult(transformationMatrix,translate(-0.4,-0.26,0));
	transformationMatrix=mult(transformationMatrix,translate(0.4,0.1,0));
    gl.uniformMatrix4fv( transformationMatrixLoc, false, flatten(transformationMatrix));
	
	gl.uniform4fv(color,flatten([r,g,b,1]));
	
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferTri );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );

    gl.drawArrays( gl.TRIANGLE_STRIP, 0, 3 );
	 
	speedAmount= amount*speed;
	r_amount= r_amount+speedAmount;
	

	transformationMatrix=mult(transformationMatrix,translate(-0.59,0.2,0));
	transformationMatrix=mult(transformationMatrix,translate(0.2,0.125,0));
	transformationMatrix=mult(transformationMatrix,rotateZ(r_amount));
	transformationMatrix=mult(transformationMatrix,translate(-0.2,-0.125,0));
	
    gl.uniformMatrix4fv( transformationMatrixLoc, false, flatten(transformationMatrix) );
    gl.uniform4fv(color,flatten([0.68,0.68,0.68,1]));
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferRect);
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.drawArrays(gl.TRIANGLE_STRIP,0,4);
	

	
	transformationMatrix=mult(transformationMatrix,translate(0.45,-0.04,0));
	
	transformationMatrix=mult(transformationMatrix,rotateZ(240));
	transformationMatrix=mult(transformationMatrix,translate(-0.45,0.04,0));
	
	transformationMatrix=mult(transformationMatrix,translate(-0.08,-0.6,0));
    gl.uniformMatrix4fv( transformationMatrixLoc, false, flatten(transformationMatrix) );
	gl.uniform4fv(color,flatten([0,0,1,1]));
	gl.bindBuffer( gl.ARRAY_BUFFER, bufferRect1 );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.drawArrays( gl.TRIANGLE_STRIP, 0, 4 );
	
	transformationMatrix=mult(transformationMatrix,translate(0.80,-0.19,0));
	transformationMatrix=mult(transformationMatrix,rotateZ(-240));
  	transformationMatrix=mult(transformationMatrix,rotateZ(-65));
    transformationMatrix=mult(transformationMatrix,translate(-0.80,0.19,0));
	transformationMatrix=mult(transformationMatrix,translate(0.2,0.57,0));
	
    gl.uniformMatrix4fv( transformationMatrixLoc, false, flatten(transformationMatrix) );
	gl.uniform4fv(color,flatten([0,1,0,1]));
	gl.bindBuffer( gl.ARRAY_BUFFER, bufferRect2 );
	
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.drawArrays( gl.TRIANGLE_STRIP, 0, 4 );
	
	   
       
    

    window.requestAnimFrame(render);
	

	
}
