const tf = require('@tensorflow/tfjs-node');
const fs = require('fs');
async function LoadModel() {
    try {
        const model = await tf.loadLayersModel('file://Sinerva/ProjectSinerva/NodeJS/tfjs_model(final)/model.json');
        console.log(tf.version);
        return model;
    } 
    catch (error) {
        console.error('Error loading the model:', error);
        throw error; // Optional: rethrow the error for further handling
    }
}

module.exports = {
  LoadModel: LoadModel
};
