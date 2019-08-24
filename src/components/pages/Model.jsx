import React from 'react';
import PropTypes from 'prop-types';
import {
    each, get, has, pick, values,
} from 'lodash';
import { TweenLite, Ease } from 'gsap/umd/TweenLite';
import * as TWEEN from '@tweenjs/tween.js';
import * as THREE from 'three';
import { Interaction } from 'three.interaction';
import * as OrbitController from './Model/OrbitController';
import PreLoader from './Model/PreLoader';
import { ScreenSize } from '../../utils/Constants';
import propTypes from '../../propTypes';

import '../../styles/components/pages/Model.scss';
import ZoomControls from '../ZoomControls';

class Model extends React.Component {
    constructor(props) {
        super(props);

        OrbitController(THREE);

        this.THREE = THREE;

        this.state = {
            cameraPosition: [
                0,
                0,
                0,
            ],
            cameraFocus: [
                0,
                0,
                0,
            ],
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
        const { asset, subpages, articleID } = this.props;
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
                cameraPosition: values(pick(this.camera.position, ['x', 'y', 'z'])),
                cameraFocus: values(pick(this.controls.target, ['x', 'y', 'z'])),
            }));
        });
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.25;
        this.controls.screenSpacePanning = false;
        this.controls.minDistance = 20;
        this.controls.maxDistance = 500;
        this.controls.update();

        this.modelHasLoaded(PreLoader.getModel(articleID).object);
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

        if (section < subpages.length) {
            const subpage = subpages[section];

            this.renderer.render(this.scene, this.camera);
            this.controls.update();

            const targetScroll = section * ScreenSize[window.appJson.aspect_ratio].height;
            const options = { scrollTop: targetScroll, ease: Ease.easeOut };
            TweenLite.to(this.scrollElem, 0.5, options);

            this.setCameraView(
                subpage.camera.position,
                get(subpage, 'hotspot.focus', get(subpage, 'hotspot.position', [0, 0, 0])),
            );
        }
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
        const { asset, subpages, onChangeCurrentPage } = this.props;

        each(subpages, (subpage, index) => {
            if (!has(subpage, 'hotspot')) {
                return;
            }

            const [posX, posY, posZ] = subpage.hotspot.position;
            const inactiveColour = asset.hotspot_inactive || 0xffff00;
            const activeColour = asset.hotspot_active || 0x0000ff;

            const geometry = new this.THREE.SphereGeometry(0.5, 16, 16);
            const material = new this.THREE.MeshBasicMaterial({ color: inactiveColour });
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
                sphere.material.color.set(inactiveColour);
                this.renderer.render(this.scene, this.camera);
            });

            sphere.on('mouseover', () => {
                sphere.material.color.set(activeColour);
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
        this.THREE.rotateLeft(0.393); // trial and error figure (degrees of theta)

        let animationFrame = null;

        const animate = () => {
            animationFrame = window.requestAnimationFrame(animate);
            this.controls.update();
        };

        animate();

        setTimeout(() => {
            window.cancelAnimationFrame(animationFrame);
        }, 500);
    }

    render() {
        const { subpages } = this.props;
        const { cameraPosition, cameraFocus } = this.state;

        return (
            <div className="Page PageModel">
                <div
                    className="ModelViewer"
                    ref={(ref) => {
                        this.viewerElem = ref;
                    }}
                    onPointerUp={(e) => {
                        // Ignore pointer up for hammerjs swiping on the model viewer
                        e.stopPropagation();
                    }}
                />
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
                    <p>
                        Position:
                        {JSON.stringify(cameraPosition)}
                    </p>
                    <p>
                        Target:
                        {JSON.stringify(cameraFocus)}
                    </p>
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
    articleID: PropTypes.string.isRequired,
    onChangeCurrentPage: PropTypes.func.isRequired,
};

Model.defaultProps = {
    currentSection: 0,
};

export default Model;
