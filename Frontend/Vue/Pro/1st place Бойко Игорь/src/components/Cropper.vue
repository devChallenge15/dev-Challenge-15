<template>
  <div class="cropper-container" @mouseup="stopResizeCropper()" @mousemove="resizeCropper($event)">
    <div class="loader" v-if="isLoadMode">
      <div class="lds-spinner" v-if="loading"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
      <div class="image-uplodaer" v-if="!loading">
        <input type="file" name="fileUplodaer" @change="uploadFile($event)">
        <span class="title">
          Загрузить изображение
        </span>
        <div class="error" v-if="!isValid">
          {{validationError}}
        </div>
      </div>
    </div>
    <div class="editor" v-else>
      <div class="menu">
        <h5>Тип кропа:</h5>
          <div 
            class="menu-item" 
            v-for="(el, index) in typeOfCrops" 
            :key="index" 
            @click="setType(el.type)"
            :class="{'active': currentType === el.type}"
            >
            {{el.name}}
          </div>
      </div>
      <div class="save-btn-container">
        <a 
          :href="croppedImageUrl" 
          v-if="imageUrl" 
          :download="imageName" 
          class="save-btn" 
          @click="saveImage()">
            Сохранить
        </a>
        <div class="quality" v-if="currentType !== 'mask'">
          <h5>Степень компрессии</h5>
          <div class="radio">
            <input type="radio" id="va06" value="0,6" v-model="quality">
            <label for="va06">Высокая</label>
          </div>
          <div class="radio">
            <input type="radio" id="va08" value="0,8" v-model="quality">
            <label for="va08">Средняя</label>
          </div>
          <div class="radio">
            <input type="radio" id="va1" value="1" v-model="quality">
            <label for="va1">Низкая</label>
          </div>
        </div>
      </div>
      

      <div class="image">
        <img :src="imageUrl"/>
        <div class="cropper"
          :style="{
            left: cropperProps.left ?  `${cropperProps.left}px` : 0,
            top:  cropperProps.top ? `${cropperProps.top}px` : 0,
            'box-shadow': cropperProps.shadowSize ? `2px 2px 2px ${cropperProps.shadowSize}px rgba(0,0,0,0.7)` : `2px 2px 2px 0px rgba(0,0,0,0.7)`,
            height: `${cropperProps.height}px`,
            width: `${cropperProps.width}px`,
            'border-radius': cropperProps.borderRadius
          }"
        > 
          <div class="cropper-action center" :class="{'round': currentType === 'mask'}"  @mousedown="startResizeCropper('center')"></div>
          <div class="cropper-action top" @mousedown="startResizeCropper('top')"></div>
          <div class="cropper-action bottom" @mousedown="startResizeCropper('bottom')"></div>
          <div class="cropper-action left" @mousedown="startResizeCropper('left')"></div>
          <div class="cropper-action right" @mousedown="startResizeCropper('right')"></div>
          <div 
            class="cropper-action leftTop" 
            @mousedown="startResizeCropper('leftTop')" 
            v-if="currentType === 'arbitrary'"
            ></div>
          <div 
            class="cropper-action leftBottom" 
            @mousedown="startResizeCropper('leftBottom')"
            v-if="currentType === 'arbitrary'"
            ></div>
          <div 
            class="cropper-action rightTop" 
            @mousedown="startResizeCropper('rightTop')"
            v-if="currentType === 'arbitrary'"
          ></div>
          <div 
            class="cropper-action rightBottom" 
            @mousedown="startResizeCropper('rightBottom')"
            v-if="currentType === 'arbitrary'"
          ></div>
        </div>
      </div>

    </div>
    
  </div>
</template>

<script>
export default {
  name: 'Cropper',
  props: {
  },
  data() {
    return {
      formats: [
      'image/jpeg',
      'image/jpg'
      ],
      isValid: true,
      validationError: '',
      loading: false,
      isLoadMode: true,
      imageUrl: '',
      currentType: 'arbitrary',
      typeOfCrops: [
        {
          type: 'arbitrary',
          name: 'Произвольный'
        },
        {
          type: '1by1',
          name: '1 к 1'
        },
        {
          type: 'mask',
          name: 'Маска'
        }
      ],
      img: null,
      isActiveResizing: false,
      croppedImageUrl: '',
      cropperProps: {
        height: 60,
        width: 60
      },
      side: null,
      imageName: '',
      quality: 1
    }
  },
  methods: {
    uploadFile(event) {
      const file = event.target.files[0];
      if (!file) {
        return;
      }
      this.isValid = true;
      this.loading = true;
      if (!this.formats.find(el => el === file.type)) {
        this.isValid = false;
        this.validationError = 'Допустимые форматы изображения: jpg, jpeg.';
        this.loading = false;
        return;
      }
      if (file.size > 2097152) {
        this.isValid = false;
        this.validationError = 'Максимальный размер файла 2мб.';
        this.loading = false;
        return;
      }
      let fileReader = new FileReader();
      fileReader.onload = (e) => {
        this.img = new Image();
        this.img.src = e.target.result;
        this.loading = false;
        if (this.img.width > 1024 || this.img.height > 1024) {
          this.isValid = false;
          this.validationError = 'Разрешение изображения должно быть до 1024х1024.';
          return;
        }
        this.imageUrl = e.target.result;
        this.img.onload = () => {
          this.isLoadMode = false;
          this.setupCropper();
        }
      }
      fileReader.readAsDataURL(file)
    },
    setType(type) {
      this.currentType = type;
      this.setupCropper();
    },
    setupCropper() {
      if (this.currentType === 'mask') {
        this.cropperProps.borderRadius = '50%';
      } else {
        this.cropperProps.borderRadius = '0';
      }
      this.cropperProps.width = 60;
      this.cropperProps.height = 60;
      this.cropperProps.left = (this.img.width/2) - 30;
      this.cropperProps.top = (this.img.height/2) - 30;
      this.cropperProps.shadowSize = this.img.width > this.img.height ? this.img.width : this.img.height;
    },
    startResizeCropper(side) {
      this.side = side;
      this.isActiveResizing = true;
    },
    resizeCropper(event) {
      if (!this.isActiveResizing) {
        return;
      }
      switch (this.side) {
        case 'top': {
          if(this.currentType === 'arbitrary') {
            this.cropperProps.top = this.cropperProps.top + event.movementY;
            this.cropperProps.height = this.cropperProps.height - event.movementY;
          } else {
            this.cropperProps.top = this.cropperProps.top + event.movementY;
            this.cropperProps.height = this.cropperProps.height - (event.movementY * 2);
            this.cropperProps.left = this.cropperProps.left + event.movementY;
            this.cropperProps.width = this.cropperProps.width - (event.movementY * 2);
          }
          break;
        }
        case 'bottom': {
          if(this.currentType === 'arbitrary') {
            this.cropperProps.height = this.cropperProps.height + event.movementY;
          } else {
            this.cropperProps.height = this.cropperProps.height + (event.movementY * 2);
            this.cropperProps.top = this.cropperProps.top - event.movementY;
            this.cropperProps.left = this.cropperProps.left - event.movementY;
            this.cropperProps.width = this.cropperProps.width + (event.movementY * 2);
          }
          break;
        }
        case 'left': {
          if(this.currentType === 'arbitrary') {
            this.cropperProps.left = this.cropperProps.left + event.movementX;
            this.cropperProps.width = this.cropperProps.width - event.movementX;
          } else {
            this.cropperProps.left = this.cropperProps.left + event.movementX;
            this.cropperProps.width = this.cropperProps.width - (event.movementX * 2);
            this.cropperProps.height = this.cropperProps.height - (event.movementX * 2);
            this.cropperProps.top = this.cropperProps.top + event.movementX;
          }
          break;
        }
        case 'right': {
          if(this.currentType === 'arbitrary') {
            this.cropperProps.width = this.cropperProps.width + event.movementX;
          } else {
            this.cropperProps.width = this.cropperProps.width + (event.movementX * 2);
            this.cropperProps.left = this.cropperProps.left - event.movementX;
            this.cropperProps.height = this.cropperProps.height + (event.movementX * 2);
            this.cropperProps.top = this.cropperProps.top - event.movementX;
          }
          break;
        }
        case 'rightTop': {
          this.cropperProps.width = this.cropperProps.width + event.movementX;
          this.cropperProps.top = this.cropperProps.top + event.movementY;
          this.cropperProps.height = this.cropperProps.height - event.movementY;
          break;
        }
        case 'leftTop': {
          this.cropperProps.left = this.cropperProps.left + event.movementX;
          this.cropperProps.width = this.cropperProps.width - event.movementX;
          this.cropperProps.top = this.cropperProps.top + event.movementY;
          this.cropperProps.height = this.cropperProps.height - event.movementY;
          break;
        }
        case 'rightBottom': {
          this.cropperProps.width = this.cropperProps.width + event.movementX;
          this.cropperProps.height = this.cropperProps.height + event.movementY;
          break;
        }
        case 'leftBottom': {
          this.cropperProps.left = this.cropperProps.left + event.movementX;
          this.cropperProps.width = this.cropperProps.width - event.movementX;
          this.cropperProps.height = this.cropperProps.height + event.movementY;
          break;
        }
        case 'center': {
          this.cropperProps.left = this.cropperProps.left + event.movementX;
          this.cropperProps.top = this.cropperProps.top + event.movementY;
        }
      }
      this.$forceUpdate();

    },
    stopResizeCropper() {
      if (!this.isActiveResizing) {
        return;
      }
      this.isActiveResizing = false;
      this.side = null;
    },
    saveImage() {
        const tnCanvas = document.createElement('canvas');
        const tnCanvasContext = tnCanvas.getContext('2d');
        tnCanvas.width = this.cropperProps.width; 
        tnCanvas.height = this.cropperProps.height;
        const bufferCanvas = document.createElement('canvas');
        const bufferContext = bufferCanvas.getContext('2d');
        bufferCanvas.width = this.img.width;
        bufferCanvas.height = this.img.height;
        bufferContext.drawImage(this.img, 0, 0);
         
        if(this.currentType === 'mask') {
          this.imageName = 'crop.png';
          tnCanvasContext.arc(this.cropperProps.height / 2,this.cropperProps.height / 2,(this.cropperProps.height / 2),0,Math.PI*2,true);
          tnCanvasContext.clip();
        } else {
          this.imageName = 'crop.jpg';
        }
        tnCanvasContext.drawImage(
          bufferCanvas, 
          this.cropperProps.left,
          this.cropperProps.top,
          this.cropperProps.width * 1,
          this.cropperProps.height * 1,
          0,
          0,
          this.cropperProps.width,
          this.cropperProps.height
        );
        if(this.currentType === 'mask') {
           this.croppedImageUrl = tnCanvas.toDataURL();
        } else {
          this.croppedImageUrl = tnCanvas.toDataURL('image/jpeg', +this.quality);
        }
         
    }
  }
}
</script>


<style scoped lang="scss">
  .cropper-container{
    width: 100%;
    height: 100vh;
    background: lightgray; 
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    .image-uplodaer{
       position: relative;
       padding: 8px 16px;
       border-radius: 2px;
       border: dotted 1px gray;
       cursor: pointer;
       input[type=file]{
         position: absolute;
         top: 0;
         left: 0;
         bottom: 0;
         right: 0;
         opacity: 0;
         height: 100%;
         cursor: pointer;
         width: 100%;
       }
       .error{
         position: absolute;
         top: 48px;
         color: red;
       }
    }
    .editor{
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      .image{
        position: relative;
        overflow: hidden;
        user-select: none;
        .cropper{
          border: solid 1px black;
          position: absolute;
          background: transparent;
          &-action{
            position: absolute;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: blue;
            border: solid 2px black;
            &:hover{
              cursor: pointer;
            }
            &.top{
              top: -7px;
              left: 50%;
              transform: translateX(-50%);
            }
            &.bottom{
              bottom: -7px;
              left: 50%;
              transform: translateX(-50%);
            }
            &.left{
              left: -7px;
              top: 50%;
              transform: translateY(-50%);
            }
            &.right{
              right: -7px;
              top: 50%;
              transform: translateY(-50%);
            }
            &.rightTop{
                top: -7px;
                right: -7px;
            }
            &.leftTop{
               top: -7px;
               left: -7px;
            }
            &.rightBottom{
               right: -7px;
               bottom: -7px;
            }
            &.leftBottom{
              bottom: -7px;
              left: -7px;
            }
            &.center{
              top: 0;
              bottom: 0;
              left: 0;
              right: 0;
              width: 100%;
              height: 100%;
              border-radius: 0%;
              background: transparent;
              border: none;
              &.round{
                border-radius: 50%;
              }
            }
          }
        }
      }
      .save-btn-container{
        position: fixed;
        z-index: 997;
        top: 0;
        left: 50%;
        transform: translateX(-50%);
        text-align: center;
        .save-btn{
          background: white;
          padding: 8px 16px;
          display: inline-block;
          box-shadow: 2px 2px 2px rgba(0,0,0,0.7);
          text-decoration: none;
          color: black;
          font-weight: bold;
        }
        .quality{
          margin-top: 16px;
          .radio{
            display: inline-block;
            vertical-align: top;
            margin: 4px;
            &:hover{
              cursot: pointer;
            }
          }
        }
      }
      .menu{
        position: fixed;
        z-index: 997;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        background: white;
        box-shadow: 1px 1px 1px black;
        border-radius: 2px;
        h5{
          padding: 8px;
          font-weight: bold;
        }
        &-item{
          padding: 8px;
          &:hover{
            cursor: pointer;
          }
          &.active,&:hover{
            background: lightgray;
          }
        }
      }
    }

    .lds-spinner {
      color: official;
      display: inline-block;
      position: relative;
      width: 64px;
      height: 64px;
    }
    .lds-spinner div {
      transform-origin: 32px 32px;
      animation: lds-spinner 1.2s linear infinite;
    }
    .lds-spinner div:after {
      content: " ";
      display: block;
      position: absolute;
      top: 3px;
      left: 29px;
      width: 5px;
      height: 14px;
      border-radius: 20%;
      background: #fff;
    }
    .lds-spinner div:nth-child(1) {
      transform: rotate(0deg);
      animation-delay: -1.1s;
    }
    .lds-spinner div:nth-child(2) {
      transform: rotate(30deg);
      animation-delay: -1s;
    }
    .lds-spinner div:nth-child(3) {
      transform: rotate(60deg);
      animation-delay: -0.9s;
    }
    .lds-spinner div:nth-child(4) {
      transform: rotate(90deg);
      animation-delay: -0.8s;
    }
    .lds-spinner div:nth-child(5) {
      transform: rotate(120deg);
      animation-delay: -0.7s;
    }
    .lds-spinner div:nth-child(6) {
      transform: rotate(150deg);
      animation-delay: -0.6s;
    }
    .lds-spinner div:nth-child(7) {
      transform: rotate(180deg);
      animation-delay: -0.5s;
    }
    .lds-spinner div:nth-child(8) {
      transform: rotate(210deg);
      animation-delay: -0.4s;
    }
    .lds-spinner div:nth-child(9) {
      transform: rotate(240deg);
      animation-delay: -0.3s;
    }
    .lds-spinner div:nth-child(10) {
      transform: rotate(270deg);
      animation-delay: -0.2s;
    }
    .lds-spinner div:nth-child(11) {
      transform: rotate(300deg);
      animation-delay: -0.1s;
    }
    .lds-spinner div:nth-child(12) {
      transform: rotate(330deg);
      animation-delay: 0s;
    }
    @keyframes lds-spinner {
      0% {
        opacity: 1;
      }
      100% {
        opacity: 0;
      }
    }
  }
</style>
