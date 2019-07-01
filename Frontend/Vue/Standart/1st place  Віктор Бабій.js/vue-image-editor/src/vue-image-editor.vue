<template>
  <div class="image-editor">
    <div class="image-editor__controls">
      <label for="file-upload" class="image-editor__custom-file-upload">Upload Image</label>
      <input id="file-upload" class="image-editor__upload-input" type="file" @change="changeFile" />
      <button class="image-editor__save-button" @click="saveImage">Save Image</button>
      <br>
      <div class="image-editor__crop-type" v-if="imageData">
        <select v-model="cropType" @change="handleCrop">
          <option value="size">Size</option>
          <option value="onepx">1x1</option>
          <option value="circle">Circle</option>
        </select>
      </div>
      <div class="image-editor__size" v-if="imageData">
        <input type="text" v-model="cropWidth">
        <br>
        <input type="text" v-model="cropHeight">
      </div>
    </div>

    <div class="image-editor__preview" v-show="imageData">
      <div class="image-editor__source-image">
        <img class="image-editor__image" :src="imageData" ref="image"/>
      </div>
      <canvas id="canvas" class="image-editor__crop"></canvas>
    </div>
  </div>
</template>

<script>
import { saveAs } from 'file-saver';

const SAVE_FILE_NAME = 'crooped.jpg';

export default {
  data() {
    return {
      preview: null,
      imageData: null,
      cropType: 'size',
      imageWidth: 100,
      imageHeigth: 100,
      cropWidth: 1024,
      cropHeight: 1024,
    };
  },
  props: {
    quality: {
      type: Number,
      default: 1,
    },
  },
  methods: {
    changeFile(e) {
      const { files } = e.target;
      const image = files[0];

      if (!this.isValidImage(image)) {
        alert('No valid image, 2mb, 1024x1024, jpg');
        return;
      }

      if (files && image) {
        const reader = new FileReader();

        reader.onload = (e) => {
          this.imageData = e.target.result;
        };

        reader.onloadend = () => {
          this.handleCrop();

          if (reader.error) {
            console.log(reader.error.message);
          }
        };

        reader.readAsDataURL(image);
      }
    },
    isValidImage(image) {
      const VALID_TYPE = 'image/jpeg';
      const VALID_SIZE = 2000000;
      const VALID_PROPERTIES = 1024;
      const imageWidth = this.$refs.image.width;
      const imageHeigth = this.$refs.image.height;

      return image.type === VALID_TYPE
        && image.size <= VALID_SIZE
        && imageWidth <= VALID_PROPERTIES
        && imageHeigth <= VALID_PROPERTIES;
    },
    handleCrop() {
      const canvas = document.getElementById('canvas');
      const ctx = canvas.getContext('2d');
      const image = new Image();
      image.src = this.imageData;
      canvas.width = this.$refs.image.width;
      canvas.height = this.$refs.image.height;

      ctx.drawImage(image, 0, 0, 400, 400, 0, 0, 100, 100);
    },
    saveImage() {
      const canvas = document.getElementById('canvas');

      canvas.toBlob((blob) => {
        saveAs(blob, SAVE_FILE_NAME);
      });
    },
  },
};
</script>

<style scoped>
  input,
  select {
    margin-bottom: 10px;
  }

  .image-editor {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    width: 100%;
  }

  .image-editor__controls {
    display: flex;
    width: 100%;
    justify-content: space-around;
  }

  .image-editor__upload-input {
    display: none;
  }

  .image-editor__custom-file-upload,
  .image-editor__save-button {
    cursor: pointer;
    display: block;
    width: 120px;
    height: 40px;
    background-color: rgba(0,0,0, 0.5);
    color: white;
    text-align: center;
    line-height: 40px;
    font-size: 16px;
    border-radius: 2px;
    margin-bottom: 15px;
    border: none;
  }

  .image-editor__custom-file-upload:hover,
  .image-editor__save-button:hover {
    background-color: rgba(0,0,0, 0.35);
  }

  .image-editor__preview{
    position: relative;
  }

  .image-editor__preview img{
    display: block;
    width: 100%;
  }

  .image-editor__image {
    cursor: pointer;
  }

  .image-editor__source-image:after{
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.6);
  }

  .image-editor__crop {
    position: absolute;
    top: 0;
    left: 0;
    cursor: move;
  }
</style>
