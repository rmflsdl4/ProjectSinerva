const tf = require('@tensorflow/tfjs-node');
const fs = require('fs');
async function LoadModel(){
  // 모델 로드
  const model = await tf.loadLayersModel('file://Sinerva/ProjectSinerva/NodeJS/tfjs_model(final)/model.json');
  console.log(tf.version);
}
module.exports = {
  LoadModel: LoadModel
};
