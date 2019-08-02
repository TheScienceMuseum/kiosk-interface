import {
    each, get, has, set,
} from 'lodash';
import * as three from 'three';
import OBJLoader from './OBJLoader';
import MTLLoader from './MTLLoader';
import { ArticleTypes } from '../../../utils/Constants';

if (!has(window, 'ModelStore')) {
    set(window, 'ModelStore', {});
}

export default {
    loadModels: () => {
        const THREE = three;

        OBJLoader(THREE);
        MTLLoader(THREE);

        each(get(window, 'appJson.content.contents', []), (article) => {
            if (article.type !== ArticleTypes.MODEL) {
                return;
            }
            const { asset } = article;

            const loader = new THREE.TextureLoader();
            loader.setPath(asset.assetDirectory);
            loader.load(
                asset.texture,
                (texture) => {
                    const material = new THREE.MeshBasicMaterial({
                        map: texture,
                    });
                    const objLoader = new THREE.OBJLoader();

                    objLoader.setPath(asset.assetDirectory);
                    objLoader.load(
                        // resource URL
                        asset.obj,
                        // called when resource is loaded
                        (object) => {
                            object.traverse((node) => {
                                if (node.isMesh) {
                                    // eslint-disable-next-line no-param-reassign
                                    node.material = material;
                                }
                            });
                            set(window, `ModelStore.${article.articleID}`, { asset, object });
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
                },
            );

            // const mtlLoader = new THREE.MTLLoader();
            //
            // mtlLoader.setPath(asset.assetDirectory);
            // mtlLoader.load(asset.mtl, (materials) => {
            //     materials.preload();
            //     const objLoader = new THREE.OBJLoader();
            //
            //     objLoader.setMaterials(materials);
            //     objLoader.setPath(asset.assetDirectory);
            //     objLoader.load(
            //         // resource URL
            //         asset.obj,
            //         // called when resource is loaded
            //         (object) => {
            //             set(window, `ModelStore.${article.articleID}`, { asset, object });
            //         },
            //         // called when loading is in progresses
            //         (xhr) => {
            //             console.log(`${xhr.loaded / xhr.total * 100}% loaded`);
            //         },
            //         // called when loading has errors
            //         (error) => {
            //             console.error(`An error happened: ${error.toString()}`);
            //         },
            //     );
            // });
        });
    },
    getModel: modelName => get(window, `ModelStore.${modelName}`, null),
};
