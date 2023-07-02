const photoContainer = document.getElementById('photo-container');
const existingPhoto = document.getElementById('existing-photo');
const uploadedPhoto = document.getElementById('uploaded-photo');
const fileInput = document.getElementById('file-input');
const saveButton = document.getElementById('save-button');
saveButton.addEventListener('click', saveMergedImage);

//existing-photo未将其设置为可拖动和可调整大小的元素
existingPhoto.setAttribute('draggable', 'true');
existingPhoto.addEventListener('dragstart', dragStart);
existingPhoto.addEventListener('dragend', dragEnd);
existingPhoto.addEventListener('mousedown', mouseDown);
existingPhoto.addEventListener('mouseup', mouseUp);

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

//existing-photo未将其设置为可拖动和可调整大小的元素
existingPhoto.setAttribute('draggable', 'true');
existingPhoto.addEventListener('dragstart', dragStart);
existingPhoto.addEventListener('dragend', dragEnd);
existingPhoto.addEventListener('mousedown', mouseDown);
existingPhoto.addEventListener('mouseup', mouseUp);
existingPhoto.addEventListener('mousemove', existingPhotoMouseMove);


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

// 获取保存按钮元素（新加，为了保存图片）
const saveButton = document.getElementById('save-button');

// 绑定点击事件监听器（新加，为了保存图片）
saveButton.addEventListener('click', saveMergedImage);

// 在全局范围内声明变量
let selectedImage = null;
let initialWidth = 0;
let initialHeight = 0;
let selectionBox = null;
let mouseX = 0;
let mouseY = 0

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
  initialWidth = selectedImage.offsetWidth;
  initialHeight = selectedImage.offsetHeight;
  

// 创建选中框元素
  selectionBox = document.createElement('div');
  selectionBox.classList.add('selection-box');
  selectionBox.style.left = event.clientX + 'px';
  selectionBox.style.top = event.clientY + 'px';
  selectionBox.style.width = '0';
  selectionBox.style.height = '0';
  photoContainer.appendChild(selectionBox);

  // 记录鼠标按下时的坐标
  mouseX = event.clientX;
  mouseY = event.clientY;

  // 阻止事件冒泡，避免与拖动事件冲突
  event.stopPropagation();
}

// 鼠标松开时的处理函数
function mouseUp(event) {
  selectedImage = null;

  // 移除选中框元素
  if (selectionBox) {
    photoContainer.removeChild(selectionBox);
    selectionBox = null;
  }

  event.stopPropagation();
}

// 鼠标移动时的处理函数
function mouseMove(event) {
  if (selectedImage) {
    const deltaX = event.clientX - selectedImage.offsetLeft;
    const deltaY = event.clientY - selectedImage.offsetTop;

    // 在鼠标移动时更新图片的位置
if (selectedImage && selectionBox) {
  const deltaX = event.clientX - mouseX;
  const deltaY = event.clientY - mouseY;

  // 更新图片的位置
  selectedImage.style.left = selectedImage.offsetLeft + deltaX + 'px';
  selectedImage.style.top = selectedImage.offsetTop + deltaY + 'px';

  // 更新鼠标按下时的坐标
  mouseX = event.clientX;
  mouseY = event.clientY;
}

  if (selectionBox) {
    // 计算选中框的宽度和高度
    const width = event.clientX - mouseX;
    const height = event.clientY - mouseY;

    // 更新选中框的位置和尺寸
    selectionBox.style.width = Math.abs(width) + 'px';
    selectionBox.style.height = Math.abs(height) + 'px';
    selectionBox.style.left = width > 0 ? mouseX + 'px' : event.clientX + 'px';
    selectionBox.style.top = height > 0 ? mouseY + 'px' : event.clientY + 'px';
  }

  event.stopPropagation();
}

// 给所有图片元素添加事件监听器
const images = document.querySelectorAll('#photo-container img');
images.forEach((image) => {
  image.addEventListener('dragstart', dragStart); // 监听拖动开始事件，启动拖动操作
  image.addEventListener('dragend', dragEnd); // 监听拖动结束事件，完成拖动操作
  image.addEventListener('mousedown', mouseDown); // 监听鼠标按下事件，记录选中的图片
});

// 添加全局的鼠标移动事件监听器
document.addEventListener('mousemove', mouseMove); // 监听鼠标移动事件，实现图片的拖动和选中框的绘制
  
// 在鼠标松开时移除全局的鼠标移动事件监听器
document.addEventListener('mouseup', mouseUp);

// 在CSS中定义
.selection-box {
  position: absolute;
  border: 2px dashed #000;
  background-color: transparent;
  pointer-events: none;
}
