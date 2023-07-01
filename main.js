const photoContainer = document.getElementById('photo-container');
const existingPhoto = document.getElementById('existing-photo');
const uploadedPhoto = document.getElementById('uploaded-photo');
const fileInput = document.getElementById('file-input');
const saveButton = document.getElementById('save-button');
saveButton.addEventListener('click', saveMergedImage);

// 阻止浏览器默认的拖放行为
photoContainer.addEventListener('dragover', (event) => {
  event.preventDefault();
});

// 处理拖放事件
photoContainer.addEventListener('drop', (event) => {
  event.preventDefault();

  const file = event.dataTransfer.files[0];
  handleImage(file);
});

// 处理文件选择事件
fileInput.addEventListener('change', (event) => {
  const file = event.target.files[0];
  handleImage(file);
});

// 定义一个数组来存储上传的图片
let uploadedPhotos = [];

function handleImage(file) {
  const reader = new FileReader();

  reader.onload = function (event) {
    const uploadedImage = new Image();
    uploadedImage.src = event.target.result;
    uploadedImage.onload = function () {
      // 允许改变大小和位置
      uploadedImage.setAttribute('draggable', 'true');
      uploadedImage.style.cursor = 'move';

      // 通过事件监听器实现拖动和调整大小的功能
      uploadedImage.addEventListener('dragstart', dragStart);
      uploadedImage.addEventListener('dragend', dragEnd);
      uploadedImage.addEventListener('mousedown', mouseDown);
      uploadedImage.addEventListener('mouseup', mouseUp);

      // 将图片添加到容器中
      photoContainer.appendChild(uploadedImage);
      
      // 将图片添加到数组中
      uploadedPhotos.push(uploadedImage);
    };
  };

  reader.readAsDataURL(file);
}


// 保存合并后的照片
function saveMergedImage() {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  // 设置画布的宽度和高度为容器的宽度和高度
  canvas.width = photoContainer.offsetWidth;
  canvas.height = photoContainer.offsetHeight;

  // 首先绘制已有的照片
  context.drawImage(existingPhoto, 0, 0);

  // 遍历上传的图片，依次绘制到画布上
  for (let i = 0; i < uploadedPhotos.length; i++) {
    const uploadedImage = uploadedPhotos[i];
    context.drawImage(
      uploadedImage,
      uploadedImage.offsetLeft,
      uploadedImage.offsetTop,
      uploadedImage.offsetWidth,
      uploadedImage.offsetHeight
    );
  }

  // 将合并后的照片保存为文件
  const mergedImage = canvas.toDataURL('image/png');
  const downloadLink = document.createElement('a');
  downloadLink.href = mergedImage;
  downloadLink.download = 'merged_image.png';
  downloadLink.click();
}


// 拖动开始时的处理函数
function dragStart(event) {
  this.style.opacity = '0.5'; // 设置拖动时的不透明度
  // 添加其他拖动开始时的逻辑
}

// 拖动结束时的处理函数
function dragEnd(event) {
  this.style.opacity = '1'; // 恢复元素的不透明度
  // 添加其他拖动结束时的逻辑
}

// 鼠标按下时的处理函数
function mouseDown(event) {
  // 添加鼠标按下时的逻辑
}

// 鼠标松开时的处理函数
function mouseUp(event) {
  // 添加鼠标松开时的逻辑
}
