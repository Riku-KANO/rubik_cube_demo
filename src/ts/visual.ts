import { Search, State, isMoveAvailable, isSolved, moveNames, moves, scrambleToState, solvedState,invFace } from "./ida_star";
import * as THREE from "https://unpkg.com/three@0.143.0/build/three.module.js";
import { OrbitControls } from "https://unpkg.com/three@0.143.0/examples/js/controls/OrbitControls.js";

const material_tmp = {
  "xneg": 0xff0000,
  "xpos": 0x00ff00,
  "yneg": 0x0000ff,
  "ypos": 0xffff00,
  "zneg": 0xff00ff,
  "zpos": 0x00ffff,
  "other": 0x000000,
};

class Cube {
  public state: State;
  public materials;
  public geometry;
  public meshes;
  public group;
  constructor(_state: State, _material) {
    this.state = _state;
    this.materials = _material;
    this.geometry = 
    this.meshes = new Array(3);
    this.group = new THREE.Group();
    let geometry = new THREE.BoxGeometry();
    for(let x = -1; x <= 1; ++x ) {
      for(let y = -1; y <= 1; ++y) {
        for(let z = -1; z <= 1; ++z) {
        geometry.attributes.position = [2 * x, 2 * y, 2 * z];
          let material = [];
          for(let i = 0; i < 6; ++i) material.push(new THREE.MeshLambertMaterial( {color: _material["other"]} ));
          if(x == -1) material[0] = new THREE.MeshLambertMaterial( {color: _material["xneg"]} );
          else if(x == 1) material[5] = new THREE.MeshLambertMaterial( {color: _material["xpos"]} );
          if(y == -1) material[1] = new THREE.MeshLambertMaterial( {color: _material["yneg"]} );
          else if(y == 1) material[3] = new THREE.MeshLambertMaterial( {color: _material["ypos"]} );
          if(z == -1) material[2] = new THREE.MeshLambertMaterial( {color: _material["zneg"]} );
          else if(z == 1) material[4] = new THREE.MeshLambertMaterial( {color: _material["zpos"]} );
          let mesh = new THREE.Mesh(geometry, material);
          this.group.add(mesh);
        }
      }
    }
  }
}

class Scene {
  public scene;
  public camera;
  public renderer;
  public container;
  public controls;
  public cube: Cube;
  public width = window.innerWidth;
  public height = window.innerHeight;

  constructor(_state: State) {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera();
    this.scene.add( this.camera );
    this.renderer = new THREE.WebGLRenderer({antialias: true});
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.width, this.height); 
    this.container = document.getElementById("container");
    this.container.appendChild(this.renderer.domElement);
    this.renderer.autoClear = false;

    this.controls = new THREE.OrbitControls(this.camera, document.body); // todo: check the 2nd argument
    this.cube = new Cube(_state);
    window.addEventListener("resize", this.onWindowResize );
  }


  runAnimation() {
    return;
  }

  private onWindowResize() {
    this.width = document.getElementById("container").clientWidth;
    this.height = document.getElementById("container").clientHeight;
    this.renderer.setSize(this.width, this.height);
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
    return ;
  }
}