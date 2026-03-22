import * as THREE from 'three';

export namespace RIMA {
    /**
     * Camera functionality.
     * 
     * @param params - The parameters for the camera.
     * @param type - The type of camera to create (e.g., 'perspective', 'orthographic', 'original').
     */
    export function createCamera(params: {}, type: "perspective" | "orthographic" | "original"){

        if (type === 'perspective') {
            const { fov, aspect, near, far } = params as { fov: number; aspect: number; near: number; far: number };
            return new THREE.PerspectiveCamera(fov, aspect, near, far);
        }
        if (type === 'orthographic') {
            const { left, right, top, bottom, near, far } = params as { left: number; right: number; top: number; bottom: number; near: number; far: number };
            return new THREE.OrthographicCamera(left, right, top, bottom, near, far);
        }
        if (type === 'original'){

            return new THREE.Camera()
        }
        throw new Error(`Unsupported camera type: ${type}`);
    }
    /**
     * 
     * @param type The type of the object. For example: 
     * @example const obj = RIMA.createObject('Box', {mesh: {width: 1, height: 1, depth: 1}, material: {color: 0x00ff00}});
     * @param params Configuration parameters for the object. For example:
     * @example {mesh: {width: 1, height: 1, depth: 1}, material: {color: 0x00ff00}}
     * 
     */
    export function createObject(type: string, params: {}){
        if (type === 'Box') {
            const { mesh, material } = params as { mesh: { width: number; height: number; depth: number }; material: { color: number } };
            const geometry = new THREE.BoxGeometry(mesh.width, mesh.height, mesh.depth);
            const mat = new THREE.MeshBasicMaterial({ color: material.color });
            return new THREE.Mesh(geometry, mat);
        } else if (type === 'Sphere') {
            const { mesh, material } = params as { mesh: { radius: number; widthSegments: number; heightSegments: number }; material: { color: number } };
            const geometry = new THREE.SphereGeometry(mesh.radius, mesh.widthSegments, mesh.heightSegments);
            const mat = new THREE.MeshBasicMaterial({ color: material.color });
            return new THREE.Mesh(geometry, mat);
        } else if (type === 'Plane') {
            const { mesh, material } = params as { mesh: { width: number; height: number }; material: { color: number } };
            const geometry = new THREE.PlaneGeometry(mesh.width, mesh.height);
            const mat = new THREE.MeshBasicMaterial({ color: material.color });
            return new THREE.Mesh(geometry, mat);
        } else if (type === 'Cylinder') {
            const { mesh, material } = params as { mesh: { radiusTop: number; radiusBottom: number; height: number; radialSegments: number }; material: { color: number } };
            const geometry = new THREE.CylinderGeometry(mesh.radiusTop, mesh.radiusBottom, mesh.height, mesh.radialSegments);
            const mat = new THREE.MeshBasicMaterial({ color: material.color });
            return new THREE.Mesh(geometry, mat);
        } else if (type === 'Torus') {
            const { mesh, material } = params as { mesh: { radius: number; tube: number; radialSegments: number; tubularSegments: number }; material: { color: number } };
            const geometry = new THREE.TorusGeometry(mesh.radius, mesh.tube, mesh.radialSegments, mesh.tubularSegments);
            const mat = new THREE.MeshBasicMaterial({ color: material.color });
            return new THREE.Mesh(geometry, mat);
        }

        throw new Error(`Unsupported object type: ${type}`);
    }

    /**
     * Event handling functionality.
     * 
     * @param type - The type of event (e.g., 'onStart', 'onUpdate').
     * @param data - The data associated with the event.
     * @example
     * const event = new RIMAEvent('onStart', { message: 'Game started!' });
     * event.addEvent('onStart', (data) => {
     *     console.log(data.message); // Output: Game started!
     * });
     */
    export class RIMAEvent {
        constructor(public type: string, public data: any) {}
        addEvent(type: string, callback: (data: any) => void) {
            // Implementation for adding event listeners

            const eventsListeners: { [key: string]: ((data: any) => void)[] } = {};

            if (!eventsListeners[type]) {
                eventsListeners[type] = [];
            }
            eventsListeners[type].push(callback);

            if (this.type === "onStart") {
                callback(this.data);
            }
        }
        addEffectListener(effect: typeof Effect, callback: (data: any) => void) {
            // Implementation for adding effect listeners
            
            const effects: typeof Effect[] = [];

            effects.push(effect);
            
            if (effects.includes(effect)) {
                callback(effect);
            }

    }
}
    export class Effect {
        constructor(public name: string) {}

        startEffect() {
            // the effect from three.js

            const effect = new THREE.Points(new THREE.BufferGeometry(), new THREE.PointsMaterial({ color: 0xffffff }));
            return effect;
        }

    }
}