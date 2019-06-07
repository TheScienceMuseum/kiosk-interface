import React from 'react';
import PropTypes from 'prop-types';
import {
    each, has, pick,
} from 'lodash';
import { TweenLite, Ease } from 'gsap/umd/TweenLite';
import * as TWEEN from '@tweenjs/tween.js';
import * as THREE from 'three';
import { Interaction } from 'three.interaction';
import * as OBJLoader from './Model/OBJLoader';
import * as MTLLoader from './Model/MTLLoader';
import * as OrbitController from './Model/OrbitController';
import { ScreenSize } from '../../utils/Constants';
import propTypes from '../../propTypes';

import '../../styles/components/pages/Model.scss';
import ZoomControls from '../ZoomControls';

class Model extends React.Component {
    constructor(props) {
        super(props);


        OBJLoader(THREE);
        MTLLoader(THREE);
        OrbitController(THREE);

        this.THREE = THREE;

        this.state = {
            cameraPosition: {
                x: 0,
                y: 0,
                z: 0,
            },
        };

        this.scale = 1;
        this.minZoom = 1;
        this.maxZoom = 20;

        this.createTriggers = this.createTriggers.bind(this);
        this.handleRotate90 = this.handleRotate90.bind(this);
        this.handleZoomChange = this.handleZoomChange.bind(this);
        this.handleZoomIn = this.handleZoomIn.bind(this);
        this.handleZoomOut = this.handleZoomOut.bind(this);
        this.modelHasLoaded = this.modelHasLoaded.bind(this);
        this.setCameraView = this.setCameraView.bind(this);
        this.setDisplayedSection = this.setDisplayedSection.bind(this);
    }

    componentDidMount() {
        const width = this.viewerElem.clientWidth;
        const height = this.viewerElem.clientHeight;
        const { asset, subpages } = this.props;
        const [posX, posY, posZ] = subpages[0].camera.position;

        console.log('starting position', [posX, posY, posZ]);

        this.scene = new this.THREE.Scene();
        this.camera = new this.THREE.PerspectiveCamera(
            45,
            width / height,
            0.1,
            1000,
        );

        this.renderer = new this.THREE.WebGLRenderer({ antialias: true });
        this.renderer.setClearColor(asset.background || '#aaa');
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(width, height);

        this.interaction = new Interaction(this.renderer, this.scene, this.camera);

        this.viewerElem.appendChild(this.renderer.domElement);

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
        this.controls.minDistance = 60;
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
                    console.error(`An error happened: ${error.toString()}`);
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
        this.viewerElem.removeChild(this.renderer.domElement);
    }

    setCameraView(position, target, speed = 1000) {
        const currentPosition = pick(this.camera.position, ['x', 'y', 'z']);
        const [newPosX, newPosY, newPosZ] = position;

        const currentTarget = pick(this.controls.target, ['x', 'y', 'z']);
        const [newTargetX, newTargetY, newTargetZ] = target;

        console.log('moving from', currentPosition, 'to', position);

        TWEEN.removeAll();

        let animationFrame = null;

        const positionTween = new TWEEN.Tween(currentPosition)
            .to({
                x: newPosX,
                y: newPosY,
                z: newPosZ,
            }, speed)
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

        const targetTween = new TWEEN.Tween(currentTarget)
            .to({
                x: newTargetX,
                y: newTargetY,
                z: newTargetZ,
            }, speed)
            .easing(TWEEN.Easing.Linear.None)
            .onUpdate(() => {
                this.controls.target = new this.THREE.Vector3(
                    currentTarget.x,
                    currentTarget.y,
                    currentTarget.z,
                );
            })
            .start();

        const animate = (time) => {
            animationFrame = window.requestAnimationFrame(animate);
            targetTween.update(time);
            positionTween.update(time);
        };

        animate();
    }

    setDisplayedSection(section) {
        const { subpages } = this.props;
        const subpage = subpages[section];

        this.renderer.render(this.scene, this.camera);
        this.controls.update();

        const targetScroll = section * ScreenSize.height;
        const options = { scrollTop: targetScroll, ease: Ease.easeOut };
        TweenLite.to(this.scrollElem, 0.5, options);

        this.lastScale = 1;
        this.scale = 1;
        this.minZoom = 1;
        this.maxZoom = 10;
        this.initialPositionVector = (new this.THREE.Vector3(0, 0, 0))
            .fromArray(subpage.camera.position);

        this.setCameraView(
            subpage.camera.position,
            has(subpage, 'hotspot')
                ? subpage.hotspot.position
                : [0, 0, 0],
        );
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

        this.createTriggers();
        this.setDisplayedSection(0);
    }

    createTriggers() {
        const { subpages, onChangeCurrentPage } = this.props;

        each(subpages, (subpage, index) => {
            if (!has(subpage, 'hotspot')) {
                return;
            }

            const [posX, posY, posZ] = subpage.hotspot.position;

            const geometry = new this.THREE.SphereGeometry(5, 32, 32);
            const material = new this.THREE.MeshBasicMaterial({ color: 0xffff00 });
            const sphere = new this.THREE.Mesh(geometry, material);
            sphere.position.set(posX, posY, posZ);
            this.scene.add(sphere);

            sphere.on('click', () => {
                console.log('clicked hotspot for page', subpage.pageID);
                onChangeCurrentPage(index);
            });

            sphere.on('touchstart', () => {
                console.log('touched hotspot for page', subpage.pageID);
                onChangeCurrentPage(index);
            });

            sphere.on('mouseout', () => {
                sphere.material.color.setHex(0xffff00);
                this.renderer.render(this.scene, this.camera);
            });

            sphere.on('mouseover', () => {
                sphere.material.color.setHex(0x0000ff);
                this.renderer.render(this.scene, this.camera);
            });
        });
    }

    handleZoomIn() {
        if (this.scale >= this.maxZoom) {
            return;
        }

        this.scale += 1;
        this.THREE.dollyOut();
    }

    handleZoomOut() {
        if (this.scale <= this.minZoom) {
            return;
        }

        this.scale -= 1;
        this.THREE.dollyIn();
    }

    handleZoomChange(event) {
        const newScale = parseInt(event.target.value, 10);
        const oldScale = this.scale;

        const diff = newScale - oldScale;

        if (diff < 0) {
            this.handleZoomOut();
        } else if (diff > 0) {
            this.handleZoomIn();
        }
    }

    handleRotate90() {
        this.THREE.rotateLeft(0.25);
        this.controls.update();
    }

    render() {
        const { subpages } = this.props;
        const { cameraPosition } = this.state;

        return (
            <div className="Page PageModel">
                <div className="ModelViewer" ref={(ref) => { this.viewerElem = ref; }} />
                <div className="ModelControls">
                    <button
                        className="Button Button--icon"
                        type="button"
                        onClick={this.handleRotate90}
                    >
                        <i className="icon-rotate" />
                    </button>
                    <ZoomControls
                        zoomIn={this.handleZoomIn}
                        zoomOut={this.handleZoomOut}
                        imageMinZoom={this.minZoom}
                        imageMaxZoom={this.maxZoom}
                        handleZoomChange={this.handleZoomChange}
                        currentScale={this.scale}
                        step={1}
                    />
                </div>
                <div className="ModelText" ref={(ref) => { this.scrollElem = ref; }}>
                    {subpages.map(subpage => (
                        <div key={subpage.pageID} id={`article-subpage-${subpage.pageID}`}>
                            <h2>{subpage.title}</h2>
                            {/* eslint-disable react/no-array-index-key, react/no-danger */}
                            {subpage.content.map((line, idx) => (
                                <p
                                    key={`page-${subpage.pageID}-${idx}`}
                                    dangerouslySetInnerHTML={{ __html: line }}
                                />
                            ))}
                            {/* eslint-enable react/no-array-index-key, react/no-danger */}
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
    currentSection: PropTypes.number,
    asset: propTypes.modelAsset.isRequired,
    subpages: PropTypes.arrayOf(PropTypes.shape({
        pageID: PropTypes.string.isRequired,
    })).isRequired,
    onChangeCurrentPage: PropTypes.func.isRequired,
};

Model.defaultProps = {
    currentSection: 0,
};

export default Model;
