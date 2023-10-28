const tf = require('@tensorflow/tfjs-node');
const modelPath = 'tfjs_model(final)/model.json';

async function LoadModel() {
    try {
        const model = await tf.loadLayersModel(`file://${modelPath}`);

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