import React from 'react';
import PropTypes from 'prop-types';
import { each } from 'lodash';
import * as TWEEN from '@tweenjs/tween.js';
import * as THREE from 'three';
import { Interaction } from 'three.interaction';
import * as OBJLoader from './Model/OBJLoader';
import * as MTLLoader from './Model/MTLLoader';
import * as OrbitController from './Model/OrbitController';
import propTypes from '../../propTypes';

import '../../styles/components/pages/Model.scss';

class Model extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            cameraPosition: {
                x: 0,
                y: 0,
                z: 0,
            },
        };

        OBJLoader(THREE);
        MTLLoader(THREE);
        OrbitController(THREE);

        this.THREE = THREE;

        this.modelHasLoaded = this.modelHasLoaded.bind(this);
        this.setCameraView = this.setCameraView.bind(this);
        this.setDisplayedSection = this.setDisplayedSection.bind(this);
    }

    componentDidMount() {
        const width = this.mount.clientWidth;
        const height = this.mount.clientHeight;
        const { asset, subpages } = this.props;
        const [posX, posY, posZ] = subpages[0].camera.position;

        console.log('starting position', [posX, posY, posZ]);

        this.scene = new this.THREE.Scene();
        this.camera = new this.THREE.PerspectiveCamera(
            75,
            width / height,
            0.1,
            1000,
        );

        this.renderer = new this.THREE.WebGLRenderer({ antialias: true });
        this.renderer.setClearColor('#aaa');
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(width, height);

        this.mount.appendChild(this.renderer.domElement);

        this.controls = new this.THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.addEventListener('change', () => {
            this.renderer.render(this.scene, this.camera);
            this.setState(prevState => ({
                ...prevState,
                cameraPosition: this.camera.position,
            }));
        });
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.25;
        this.controls.screenSpacePanning = false;
        this.controls.minDistance = 2;
        this.controls.maxDistance = 500;
        this.controls.update();

        const mtlLoader = new this.THREE.MTLLoader();

        mtlLoader.setPath(asset.assetDirectory);
        mtlLoader.load(asset.mtl, (materials) => {
            materials.preload();
            const objLoader = new this.THREE.OBJLoader();

            objLoader.setMaterials(materials);
            objLoader.setPath(asset.assetDirectory);
            objLoader.load(
                // resource URL
                asset.obj,
                // called when resource is loaded
                (object) => {
                    this.modelHasLoaded(object);
                },
                // called when loading is in progresses
                (xhr) => {
                    console.log(`${xhr.loaded / xhr.total * 100}% loaded`);
                },
                // called when loading has errors
                (error) => {
                    console.log(`An error happened: ${error.toString()}`);
                },
            );
        });
    }

    componentWillReceiveProps(nextProps) {
        const { currentSection } = this.props;

        if (nextProps.currentSection !== currentSection) {
            this.setDisplayedSection(nextProps.currentSection);
        }
    }

    componentWillUnmount() {
        this.mount.removeChild(this.renderer.domElement);
    }

    setCameraView(position) {
        const currentPosition = {
            x: this.camera.position.x,
            y: this.camera.position.y,
            z: this.camera.position.z,
        };

        // console.log('moving from', currentPosition, 'to', position);

        TWEEN.removeAll();

        let animationFrame = null;

        const tween = new TWEEN.Tween(currentPosition)
            .to({
                x: position[0],
                y: position[1],
                z: position[2],
            }, 2000)
            .easing(TWEEN.Easing.Linear.None)
            .onUpdate(() => {
                this.camera.position.set(currentPosition.x, currentPosition.y, currentPosition.z);
                this.controls.update();
                // console.log('tween update', currentPosition);
            })
            .onComplete(() => {
                window.cancelAnimationFrame(animationFrame);
                // console.log('tween complete');
            })
            .start();

        const animate = (time) => {
            animationFrame = window.requestAnimationFrame(animate);
            tween.update(time);
        };

        animate();
    }

    setDisplayedSection(section) {
        const { subpages } = this.props;
        const subpage = subpages[section];

        this.setCameraView(subpage.camera.position, subpage.camera.rotation);
    }

    modelHasLoaded(object) {
        const { asset } = this.props;
        const [assetPosX, assetPosY, assetPosZ] = asset.position;

        this.object = object;

        this.object.rotateX(this.THREE.Math.degToRad(asset.rotation[0]));
        this.object.rotateY(this.THREE.Math.degToRad(asset.rotation[1]));
        this.object.rotateZ(this.THREE.Math.degToRad(asset.rotation[2]));
        this.object.position.set(assetPosX, assetPosY, assetPosZ);
        this.scene.add(this.object);

        const light = new this.THREE.AmbientLight(0xffffff, 1);
        this.scene.add(light);

        this.setDisplayedSection(0);
    }

    render() {
        const { subpages } = this.props;
        const { cameraPosition } = this.state;

        return (
            <div
                className="Page PageModel"
                ref={(mount) => {
                    if (mount) {
                        const [viewer] = mount.getElementsByClassName('ModelViewer');
                        this.mount = viewer;
                    } else {
                        this.mount = null;
                    }
                }}
            >
                <div className="ModelViewer" />
                <div className="ModelText">
                    {subpages.map(subpage => (
                        <div key={subpage.pageID}>
                            <h2>{subpage.title}</h2>
                            {subpage.content.map((line, idx) => (
                                <p
                                    key={`page-${subpage.pageID}-${idx}`}
                                >
                                    {line}
                                </p>
                            ))}
                        </div>
                    ))}
                </div>

                <div
                    className="DebugPanel"
                    style={{
                        position: 'absolute',
                        right: 0,
                    }}
                >
                    <p>{JSON.stringify(cameraPosition)}</p>
                </div>
            </div>
        );
    }
}

Model.propTypes = {
    // currentSection: PropTypes.number,
    asset: propTypes.modelAsset.isRequired,
    subpages: PropTypes.array.isRequired,
};

export default Model;
