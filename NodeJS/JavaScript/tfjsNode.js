const tf = require('@tensorflow/tfjs-node');
async function LoadModel() {
    try {
        const model = await tf.loadLayersModel('file://Sinerva/ProjectSinerva/NodeJS/tfjs_model(final)/model.json');

        console.log(model);
        return model;
    } 
    catch (error) {
        console.error('Error loading the model:', error);
        throw error; 
    }
}

module.exports = {
  LoadModel: LoadModel
};
