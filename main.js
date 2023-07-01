const dropZone = document.getElementById('drop-zone');
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

// 阻止浏览器默认的拖放行为
dropZone.addEventListener('dragover', (event) => {
  event.preventDefault();
});

// 处理拖放事件
dropZone.addEventListener('drop', (event) => {
  event.preventDefault();
  
  const file = event.dataTransfer.files[0];
  const reader = new FileReader();
  
  reader.onload = function (event) {
    const image = new Image();
    image.onload = function () {
      canvas.width = image.width;
      canvas.height = image.height;
      context.drawImage(image, 0, 0);
      
      // 在这里可以添加照片合并的逻辑
      // 可以使用 context.drawImage() 将拖入的照片绘制到 canvas 上
      
      // 示例：绘制一个红色矩形
      context.fillStyle = 'red';
      context.fillRect(0, 0, 100, 100);
      
      // 将合并后的照片保存为文件
      const mergedImage = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.href = mergedImage;
      downloadLink.download = 'merged_image.png';
      downloadLink.click();
    };
    image.src = event.target.result;
  };
  
  reader.readAsDataURL(file);
});
