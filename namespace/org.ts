import * as THREE from 'three';

export namespace RIMA {
    // Type definitions for camera parameters
    export interface PerspectiveCameraParams {
        fov: number;
        aspect: number;
        near: number;
        far: number;
    }

    export interface OrthographicCameraParams {
        left: number;
        right: number;
        top: number;
        bottom: number;
        near: number;
        far: number;
    }

    export type CameraParams = PerspectiveCameraParams | OrthographicCameraParams | {};

    /**
     * Camera functionality.
     * 
     * @param params - The parameters for the camera.
     * @param type - The type of camera to create (e.g., 'perspective', 'orthographic', 'original').
     */
    export function createCamera(
        params: CameraParams,
        type: "perspective" | "orthographic" | "original"
    ): THREE.PerspectiveCamera | THREE.OrthographicCamera | THREE.Camera {
        if (type === 'perspective') {
            const { fov, aspect, near, far } = params as PerspectiveCameraParams;
            return new THREE.PerspectiveCamera(fov, aspect, near, far);
        }
        if (type === 'orthographic') {
            const { left, right, top, bottom, near, far } = params as OrthographicCameraParams;
            return new THREE.OrthographicCamera(left, right, top, bottom, near, far);
        }
        if (type === 'original') {
            return new THREE.Camera();
        }
        throw new Error(`Unsupported camera type: ${type}`);
    }

    // Type definitions for object parameters
    export interface MeshParams {
        Box: { width: number; height: number; depth: number };
        Sphere: { radius: number; widthSegments: number; heightSegments: number };
        Plane: { width: number; height: number };
        Cylinder: { radiusTop: number; radiusBottom: number; height: number; radialSegments: number };
        Torus: { radius: number; tube: number; radialSegments: number; tubularSegments: number };
    }

    export interface MaterialParams {
        color: number;
        wireframe?: boolean;
        transparent?: boolean;
        opacity?: number;
    }

    export interface ObjectParams<T extends keyof MeshParams> {
        mesh: MeshParams[T];
        material: MaterialParams;
    }

    export type ObjectType = 'Box' | 'Sphere' | 'Plane' | 'Cylinder' | 'Torus';

    /**
     * Creates a 3D object based on the specified type.
     * 
     * @param type - The type of the object (e.g., 'Box', 'Sphere', 'Plane', 'Cylinder', 'Torus').
     * @param params - Configuration parameters for the object.
     * @example
     * const obj = RIMA.createObject('Box', {mesh: {width: 1, height: 1, depth: 1}, material: {color: 0x00ff00}});
     */
    export function createObject(type: ObjectType, params: ObjectParams<ObjectType>): THREE.Mesh {
        const { mesh, material } = params;
        let geometry: THREE.BufferGeometry;

        switch (type) {
            case 'Box': {
                const boxMesh = mesh as MeshParams['Box'];
                geometry = new THREE.BoxGeometry(boxMesh.width, boxMesh.height, boxMesh.depth);
                break;
            }
            case 'Sphere': {
                const sphereMesh = mesh as MeshParams['Sphere'];
                geometry = new THREE.SphereGeometry(sphereMesh.radius, sphereMesh.widthSegments, sphereMesh.heightSegments);
                break;
            }
            case 'Plane': {
                const planeMesh = mesh as MeshParams['Plane'];
                geometry = new THREE.PlaneGeometry(planeMesh.width, planeMesh.height);
                break;
            }
            case 'Cylinder': {
                const cylinderMesh = mesh as MeshParams['Cylinder'];
                geometry = new THREE.CylinderGeometry(
                    cylinderMesh.radiusTop,
                    cylinderMesh.radiusBottom,
                    cylinderMesh.height,
                    cylinderMesh.radialSegments
                );
                break;
            }
            case 'Torus': {
                const torusMesh = mesh as MeshParams['Torus'];
                geometry = new THREE.TorusGeometry(
                    torusMesh.radius,
                    torusMesh.tube,
                    torusMesh.radialSegments,
                    torusMesh.tubularSegments
                );
                break;
            }
            default:
                throw new Error(`Unsupported object type: ${type}`);
        }

        const mat = new THREE.MeshBasicMaterial({
            color: material.color,
            wireframe: material.wireframe,
            transparent: material.transparent,
            opacity: material.opacity
        });

        return new THREE.Mesh(geometry, mat);
    }

    /**
     * Event handling functionality.
     * 
     * @example
     * const event = new RIMAEvent('onStart', { message: 'Game started!' });
     * event.addEvent('onStart', (data) => {
     *     console.log(data.message); // Output: Game started!
     * });
     */
    export class RIMAEvent {
        private eventsListeners: Map<string, ((data: any) => void)[]> = new Map();
        private effects: Effect[] = [];

        constructor(public type: string, public data: any) {}

        /**
         * Adds an event listener for the specified event type.
         */
        addEvent(type: string, callback: (data: any) => void): void {
            if (!this.eventsListeners.has(type)) {
                this.eventsListeners.set(type, []);
            }
            this.eventsListeners.get(type)!.push(callback);

            // Immediately trigger if this is the current event type
            if (this.type === type) {
                callback(this.data);
            }
        }

        /**
         * Removes an event listener.
         */
        removeEvent(type: string, callback: (data: any) => void): boolean {
            const listeners = this.eventsListeners.get(type);
            if (listeners) {
                const index = listeners.indexOf(callback);
                if (index > -1) {
                    listeners.splice(index, 1);
                    return true;
                }
            }
            return false;
        }

        /**
         * Triggers all listeners for a specific event type.
         */
        trigger(type: string, data?: any): void {
            const listeners = this.eventsListeners.get(type);
            if (listeners) {
                listeners.forEach(callback => callback(data ?? this.data));
            }
        }

        /**
         * Adds a GUI event listener to an HTML element.
         */
        addGUIListener(type: string, elem: HTMLElement, callback: (event?: Event) => void): void {
            const eventMap: Record<string, string> = {
                onClick: 'click',
                onMouseOver: 'mouseover',
                onMouseOut: 'mouseout',
                onMouseDown: 'mousedown',
                onMouseUp: 'mouseup',
                onKeyDown: 'keydown',
                onKeyUp: 'keyup'
            };

            const eventName = eventMap[type] || type;
            elem.addEventListener(eventName, callback as EventListener);
        }

        /**
         * Removes a GUI event listener from an HTML element.
         */
        removeGUIListener(type: string, elem: HTMLElement, callback: (event?: Event) => void): void {
            const eventMap: Record<string, string> = {
                onClick: 'click',
                onMouseOver: 'mouseover',
                onMouseOut: 'mouseout',
                onMouseDown: 'mousedown',
                onMouseUp: 'mouseup',
                onKeyDown: 'keydown',
                onKeyUp: 'keyup'
            };

            const eventName = eventMap[type] || type;
            elem.removeEventListener(eventName, callback as EventListener);
        }

        /**
         * Adds an effect listener.
         */
        addEffectListener(effect: Effect, callback: (data: Effect) => void): void {
            this.effects.push(effect);
            callback(effect);
        }

        /**
         * Removes an effect listener.
         */
        removeEffectListener(effect: Effect): boolean {
            const index = this.effects.indexOf(effect);
            if (index > -1) {
                this.effects.splice(index, 1);
                return true;
            }
            return false;
        }
    }

    /**
     * Effect class for creating visual effects.
     */
    export class Effect {
        private points: THREE.Points | null = null;

        constructor(public name: string, public color: number = 0xffffff) {}

        /**
         * Starts the effect and returns a THREE.Points object.
         */
        startEffect(positions?: Float32Array): THREE.Points {
            const geometry = new THREE.BufferGeometry();
            
            if (positions) {
                geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            } else {
                // Default: create a simple particle system
                const defaultPositions = new Float32Array([
                    0, 0, 0,
                    1, 0, 0,
                    0, 1, 0,
                    0, 0, 1
                ]);
                geometry.setAttribute('position', new THREE.BufferAttribute(defaultPositions, 3));
            }

            const material = new THREE.PointsMaterial({
                color: this.color,
                size: 0.1,
                sizeAttenuation: true
            });

            this.points = new THREE.Points(geometry, material);
            return this.points;
        }

        /**
         * Updates the effect with new positions.
         */
        updateEffect(positions: Float32Array): void {
            if (this.points) {
                const geometry = this.points.geometry as THREE.BufferGeometry;
                geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
                geometry.attributes.position.needsUpdate = true;
            }
        }

        /**
         * Disposes of the effect resources.
         */
        dispose(): void {
            if (this.points) {
                this.points.geometry.dispose();
                (this.points.material as THREE.PointsMaterial).dispose();
                this.points = null;
            }
        }
    }

    /**
     * GUI component creation and management.
     */
    export class RimaGUI {
        private container: HTMLElement | null = null;

        constructor(public name: string) {}

        /**
         * Creates a component with applied CSS styles.
         */
        createComponent(elem: HTMLElement, css: Array<Partial<CSSStyleDeclaration>>): HTMLElement {
            css.forEach((style) => {
                Object.assign(elem.style, style);
            });
            return elem;
        }

        /**
         * Creates a button element.
         */
        createButton(text: string, css?: Partial<CSSStyleDeclaration>): HTMLButtonElement {
            const button = document.createElement('button');
            button.textContent = text;
            if (css) {
                Object.assign(button.style, css);
            }
            return button;
        }

        /**
         * Creates a div element.
         */
        createDiv(css?: Partial<CSSStyleDeclaration>): HTMLDivElement {
            const div = document.createElement('div');
            if (css) {
                Object.assign(div.style, css);
            }
            return div;
        }

        /**
         * Creates a text input element.
         */
        createInput(placeholder?: string, css?: Partial<CSSStyleDeclaration>): HTMLInputElement {
            const input = document.createElement('input');
            input.type = 'text';
            if (placeholder) {
                input.placeholder = placeholder;
            }
            if (css) {
                Object.assign(input.style, css);
            }
            return input;
        }

        /**
         * Sets the container for GUI elements.
         */
        setContainer(container: HTMLElement): void {
            this.container = container;
        }

        /**
         * Appends an element to the container.
         */
        appendToContainer(elem: HTMLElement): void {
            if (this.container) {
                this.container.appendChild(elem);
            } else {
                document.body.appendChild(elem);
            }
        }
    }
}
