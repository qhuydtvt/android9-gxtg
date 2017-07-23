// module.exports = [
//   {
//     name: "Linh ka",
//     age: 19,
//     image: "https://hoc24.vn/images/avt/avt139535_256by256.jpg"
//   },
//   {
//     name: "Quân Kun",
//     age: 21,
//     image: "http://vip.img.cdn.keeng.vn/medias/singer/2014/03/05/fca37d9e995b8d17c8da104b92dc8628400e22fc.jpg"
//   },
//   {
//     name: "Lệ rơi",
//     age: 24,
//     image: "http://cms.kienthuc.net.vn/uploaded/ngoclinh/2015_06_01/newfolder3/tai-san-sau-mot-nam-doi-doi-than-toc-cua-le-roi-hinh-11.jpg"
//   }
// ];

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var hottieSchema = new Schema({
  name: String,
  age: Number,
  image: String
});

var hottieModel  = mongoose.model("Hottie", hottieSchema);

module.exports = hottieModel;
