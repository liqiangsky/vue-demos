<template>
  <div class="container" @mouseout="out">
    <div
      @mouseenter="enter(i)"
      class="box"
      v-for="(ele, i) in urls"
      :key="i"
      :style="{
        width: getWidth(),
        left: getLeft(i),
        zIndex: i,
        backgroundColor: `rgb(${parseInt(Math.random()*256)},${parseInt(Math.random()*256)},${parseInt(Math.random()*256)})`,
      }"
    >
      <h1 style="position: absolute; color: red;">{{ i }}</h1>
      <!-- <img style="width: 100%" :src="ele" alt="" /> -->
    </div>
  </div>
</template>
<script>
export default {
  name: "Accordion",
  data() {
    return {
      activeIndex: -1,
      urls: [
        "https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg",
        "https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg",
        "https://fuss10.elemecdn.com/0/6f/e35ff375812e6b0020b6b4e8f9583jpeg.jpeg",
        "https://fuss10.elemecdn.com/9/bb/e27858e973f5d7d3904835f46abbdjpeg.jpeg",
        "https://fuss10.elemecdn.com/d/e6/c4d93a3805b3ce3f323f7974e6f78jpeg.jpeg",
        "https://fuss10.elemecdn.com/3/28/bbf893f792f03a54408b3b7a7ebf0jpeg.jpeg",
        "https://fuss10.elemecdn.com/2/11/6535bcfb26e4c79b48ddde44f4b6fjpeg.jpeg",
      ],
    };
  },
  computed: {
    getInterval() {
      return 100 / this.urls.length;
    },
    getIntervalHalf() {
      return this.getInterval / 2;
    },
  },
  methods: {
    getWidth() {
      return `calc(${100 - (this.urls.length - 1) * this.getIntervalHalf}%)`;
    },
    getLeft(i) {
      if (this.activeIndex === -1) {
        return `calc(${this.getInterval * i}%)`;
      } else if (this.activeIndex >= i) {
        return `calc(${this.getInterval * i - i * this.getIntervalHalf}%)`;
      } else {
        return `calc(${
          this.getInterval * i + (this.urls.length - i) * this.getIntervalHalf
        }%)`;
      }
    },
    enter(i) {
      this.activeIndex = i;
    },
    out() {
      this.activeIndex = -1;
    },
  },
};
</script>
<style>
.container {
  margin: 4% 2%;
  box-sizing: border-box;
  height: 48vh;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
}
.container:before {
  background-color: rgba(0, 0, 0, 0.4);
}

.box {
  width: 100%;
  height: 100%;
  position: absolute;
  transition: 0.5s;
  box-shadow: 0 20px 30px rgba(0, 0, 0, 0.1);
}

.box > img {
  height: 100%;
  vertical-align: middle;
  transition: 0.5s;
}

.box > span {
  font-size: 3.8vh;
  display: block;
  text-align: center;
  height: 10vh;
  line-height: 2.6;
}

.active {
  flex: 1 1 15%;
}

.active > img {
  width: 100%;
  height: 100%;
}
</style>