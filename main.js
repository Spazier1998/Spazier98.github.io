const photoContainer = document.getElementById('photo-container');
const existingPhoto = document.getElementById('existing-photo');
const uploadedPhoto = document.getElementById('uploaded-photo');
const fileInput = document.getElementById('file-input');

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

// 处理图片操作的逻辑
function handleImage(file) {
  const reader = new FileReader();

  reader.onload = function (event) {
    uploadedPhoto.src = event.target.result;
    uploadedPhoto.onload = function () {
      // 允许改变大小和位置
      uploadedPhoto.setAttribute('draggable', 'true');
      uploadedPhoto.style.cursor = 'move';

      // 通过事件监听器实现拖动和调整大小的功能
      uploadedPhoto.addEventListener('dragstart', dragStart);
      uploadedPhoto.addEventListener('dragend', dragEnd);
      uploadedPhoto.addEventListener('mousedown', mouseDown);
      uploadedPhoto.addEventListener('mouseup', mouseUp);

      // 将合并后的照片保存为文件
      saveMergedImage();
    };
  };

  reader.readAsDataURL(file);
}

// 保存合并后的照片
function saveMergedImage() {
  const canvas = document.createElement('canvas');
  canvas.width = photoContainer.offsetWidth;
  canvas.height = photoContainer.offsetHeight;
  const context = canvas.getContext('2d');

  context.drawImage(existingPhoto, 0, 0);
  context.drawImage(uploadedPhoto, uploadedPhoto.offsetLeft, uploadedPhoto.offsetTop, uploadedPhoto.offsetWidth, uploadedPhoto.offsetHeight);

  const mergedImage = canvas.toDataURL('image/png');
  const downloadLink = document.createElement('a');
  downloadLink.href = mergedImage;
  downloadLink.download = 'merged_image.png';
  downloadLink.click();
}

// 拖动开始时的处理函数
function dragStart(event) {
  this.style.opacity
