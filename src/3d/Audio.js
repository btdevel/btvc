import React from 'react'
import * as THREE from 'three'
export const audioListener = new THREE.AudioListener();


function addAudio(object, url, loop = true, volume = 0.5) {
    const audio = new THREE.Audio(audioListener);
    object.add(audio);

    const loader = new THREE.AudioLoader();
    loader.load(url,
        function (audioBuffer) {
            audio.setBuffer(audioBuffer);
            audio.setLoop(true)
            audio.setVolume(0.07)
            audio.play();
        },
        function (xhr) {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },
        function (err) {
            console.log('An error happened');
        }
    );
}


// const sound = new THREE.PositionalAudio( listener );
// const audioLoader = new THREE.AudioLoader();
// audioLoader.load( 'sounds/song.ogg', function( buffer ) {
// 	sound.setBuffer( buffer );
// 	sound.setRefDistance( 20 );
// 	sound.play();
// });

export function AmbientAudio({ url }) {
    const sphere = new THREE.SphereBufferGeometry(20, 32, 16);
    const material = new THREE.MeshPhongMaterial({ color: 0xff2200 });
    const mesh = new THREE.Mesh(sphere, material);
    addAudio(mesh, url)
    return <primitive object={mesh} />
}
