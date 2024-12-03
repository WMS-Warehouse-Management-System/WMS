const imageInput = document.getElementById('image-input');
const uploadedImage = document.getElementById('uploaded-image');

imageInput.addEventListener('change', function() {
  const file = this.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      uploadedImage.src = e.target.result;
      uploadedImage.style.display = 'block';
    }
    reader.readAsDataURL(file);
  }
});