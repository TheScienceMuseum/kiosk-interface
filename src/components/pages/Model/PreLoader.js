import {
    each, get, has, set,
} from 'lodash';
import * as three from 'three';
import OBJLoader from './OBJLoader';
import MTLLoader from './MTLLoader';
import { ArticleTypes } from '../../../utils/Constants';

if (has(window, 'ModelStore')) {
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

            const mtlLoader = new THREE.MTLLoader();

            mtlLoader.setPath(asset.assetDirectory);
            mtlLoader.load(asset.mtl, (materials) => {
                materials.preload();
                const objLoader = new THREE.OBJLoader();

                objLoader.setMaterials(materials);
                objLoader.setPath(asset.assetDirectory);
                objLoader.load(
                    // resource URL
                    asset.obj,
                    // called when resource is loaded
                    (object) => {
                        const [assetPosX, assetPosY, assetPosZ] = asset.position;
                        const [rotationX, rotationY, rotationZ] = asset.rotation;

                        object.rotateX(THREE.Math.degToRad(rotationX));
                        object.rotateY(THREE.Math.degToRad(rotationY));
                        object.rotateZ(THREE.Math.degToRad(rotationZ));

                        object.position.set(assetPosX, assetPosY, assetPosZ);
                        object.scale.set(asset.scale, asset.scale, asset.scale);

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
            });
        });
    },
    getModel: modelName => get(window, `ModelStore.${modelName}`, null),
};
