import {vec3, vec4} from 'gl-matrix';
import * as Stats from 'stats-js';
import * as DAT from 'dat-gui';
import Icosphere from './geometry/Icosphere';
import Square from './geometry/Square';
import OpenGLRenderer from './rendering/gl/OpenGLRenderer';
import Camera from './Camera';
import {setGL} from './globals';
import ShaderProgram, {Shader} from './rendering/gl/ShaderProgram';
import Cube from './geometry/cube';

// Define an object with application parameters and button callbacks
// This will be referred to by dat.GUI's functions that add GUI elements.
const controls = {
  tesselations: 5,
  'Load Scene': loadScene, // A function pointer, essentially
  color: [1,0,0],
  customShader: false,
  object: 1,
};

let icosphere: Icosphere;
let square: Square;
let cube: Cube;
let prevTesselations: number = 5;
let prevColor: number[] = [1,0,0];
let time: number = 0;
let prevObj: number = 1;
let tessChange: boolean = false;

function loadScene() {
  if (prevObj == 1) {
    cube = new Cube(vec3.fromValues(0,0,0));
    cube.create();
  }
  else if (prevObj == 2) {
    icosphere = new Icosphere(vec3.fromValues(0, 0, 0), 1, prevTesselations);
    console.log(`control ${controls.tesselations}`);
    console.log(`control ${prevTesselations}`);
    icosphere.create();
  }
  else {
    square = new Square(vec3.fromValues(0, 0, 0));
    square.create();
  }
}

function main() {
  // Initial display for framerate
  const stats = Stats();
  stats.setMode(0);
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.left = '0px';
  stats.domElement.style.top = '0px';
  document.body.appendChild(stats.domElement);

  // Add controls to the gui
  const gui = new DAT.GUI();
  gui.add(controls, 'tesselations', 0, 8).step(1);
  gui.add(controls, 'Load Scene');
  gui.addColor(controls, 'color');
  gui.add(controls, 'customShader');
  gui.add(controls, 'object', 1, 3).step(1);

  // get canvas and webgl context
  const canvas = <HTMLCanvasElement> document.getElementById('canvas');
  const gl = <WebGL2RenderingContext> canvas.getContext('webgl2');
  if (!gl) {
    alert('WebGL 2 not supported!');
  }
  // `setGL` is a function imported above which sets the value of `gl` in the `globals.ts` module.
  // Later, we can import `gl` from `globals.ts` to access it
  setGL(gl);

  // Initial call to load scene
  loadScene();

  const camera = new Camera(vec3.fromValues(0, 0, 5), vec3.fromValues(0, 0, 0));

  const renderer = new OpenGLRenderer(canvas);
  renderer.setClearColor(0.2, 0.2, 0.2, 1);
  gl.enable(gl.DEPTH_TEST);

  const lambert = new ShaderProgram([
    new Shader(gl.VERTEX_SHADER, require('./shaders/lambert-vert.glsl')),
    new Shader(gl.FRAGMENT_SHADER, require('./shaders/lambert-frag.glsl')),
  ]);
  const custom = new ShaderProgram([
    new Shader(gl.VERTEX_SHADER, require('./shaders/deform-vert.glsl')),
    new Shader(gl.FRAGMENT_SHADER, require('./shaders/deform-frag.glsl')),
  ]);
  let shaderProg: ShaderProgram = lambert;

  // This function will be called every frame
  function tick() {
    time++;
    camera.update();
    stats.begin();
    gl.viewport(0, 0, window.innerWidth, window.innerHeight);
    renderer.clear();
    if(controls.tesselations != prevTesselations)
    {
      prevTesselations = controls.tesselations;
      icosphere = new Icosphere(vec3.fromValues(0, 0, 0), 1, prevTesselations);
      icosphere.create();
      tessChange = true;
    }
    if(controls.color != prevColor) {
      //update color
      prevColor = controls.color;
    }
    if(controls.customShader == true) {
      //render with custom shader
      shaderProg = custom;
    }
    else {
      //render with lambert shader
      shaderProg = lambert;
    }
    if(controls.object != prevObj || tessChange) {
      //update obj
      if (tessChange) {
        console.log(`tess changed`);
      }
      prevObj = controls.object;
      tessChange = false;
      loadScene();
    }
    if (prevObj == 1) {
      renderer.render(camera, shaderProg, [cube], 
        vec4.fromValues(prevColor[0],prevColor[1],prevColor[2],1), time);
    }
    else if(prevObj == 2) {
      renderer.render(camera, shaderProg, [icosphere], 
        vec4.fromValues(prevColor[0],prevColor[1],prevColor[2],1), time);
    }
    else {
      renderer.render(camera, shaderProg, [square], 
        vec4.fromValues(prevColor[0],prevColor[1],prevColor[2],1), time);
    }
      
    stats.end();

    // Tell the browser to call `tick` again whenever it renders a new frame
    requestAnimationFrame(tick);
  }

  window.addEventListener('resize', function() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.setAspectRatio(window.innerWidth / window.innerHeight);
    camera.updateProjectionMatrix();
  }, false);

  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.setAspectRatio(window.innerWidth / window.innerHeight);
  camera.updateProjectionMatrix();

  // Start the render loop
  tick();
}

main();
