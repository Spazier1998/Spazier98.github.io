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

// 用于存储当前选中的图片
let selectedImage = null;

// 拖动开始时的处理函数
function dragStart(event) {
  selectedImage = this;
  this.style.opacity = '0.5'; // 设置拖动时的不透明度
  event.dataTransfer.setData('text/plain', ''); // 设置拖动数据
}

// 拖动结束时的处理函数
function dragEnd(event) {
  selectedImage = null;
  this.style.opacity = '1'; // 恢复元素的不透明度
}

// 鼠标按下时的处理函数
function mouseDown(event) {
  selectedImage = this;
  // 记录鼠标按下时的初始位置等信息
  // 可以实现选中框和其他逻辑
}

// 鼠标松开时的处理函数
function mouseUp(event) {
  selectedImage = null;
  // 处理鼠标松开后的逻辑
}

// 鼠标移动时的处理函数
function mouseMove(event) {
  if (selectedImage) {
    // 根据鼠标移动的距离来更新图片的位置
    // 可以实现拖动图片的效果
  }
}

// 给所有图片元素添加事件监听器
const images = document.querySelectorAll('#photo-container img');
images.forEach((image) => {
  image.addEventListener('dragstart', dragStart); // 监听拖动开始事件，启动拖动操作
  image.addEventListener('dragend', dragEnd); // 监听拖动结束事件，完成拖动操作
  image.addEventListener('mousedown', mouseDown); // 监听鼠标按下事件，记录选中的图片
});

// 添加全局的鼠标移动事件监听器
document.addEventListener('mousemove', mouseMove); // 监听鼠标移动事件，实现图片的拖动

// 你可以根据需要进一步完善这些事件处理函数，例如实现选中框、改变大小等功能
