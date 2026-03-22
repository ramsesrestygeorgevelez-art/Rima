// the scene

import { RIMA } from "./namespace/org";

RIMA.createCamera({ fov: 75, aspect: window.innerWidth / window.innerHeight, near: 0.1, far: 1000 }, 'perspective');
RIMA.createObject('Box', {mesh: {width: 1, height: 1, depth: 1}, material: {color: 0x00ff00}});