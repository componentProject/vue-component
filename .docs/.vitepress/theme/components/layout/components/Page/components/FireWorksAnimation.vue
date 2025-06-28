<template>
  <div v-if="showFireworksAnimation" class="pyro">
    <div class="before" />
    <div class="after" />
  </div>
</template>

<script lang="ts" setup>
import { useData } from 'vitepress'

const { theme } = useData()

// get fireworks animation control
const showFireworksAnimation = theme.value.showFireworksAnimation
</script>

<style scoped>
.pyro {
  box-sizing: border-box;
}

.pyro > .before,
.pyro > .after {
  position: absolute;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  box-shadow:
    0 0 #fff,
    0 0 #fff,
    0 0 #fff,
    0 0 #fff,
    0 0 #fff,
    0 0 #fff,
    0 0 #fff,
    0 0 #fff,
    0 0 #fff,
    0 0 #fff,
    0 0 #fff,
    0 0 #fff,
    0 0 #fff,
    0 0 #fff,
    0 0 #fff,
    0 0 #fff,
    0 0 #fff,
    0 0 #fff,
    0 0 #fff,
    0 0 #fff,
    0 0 #fff,
    0 0 #fff,
    0 0 #fff,
    0 0 #fff,
    0 0 #fff,
    0 0 #fff,
    0 0 #fff,
    0 0 #fff,
    0 0 #fff,
    0 0 #fff,
    0 0 #fff,
    0 0 #fff,
    0 0 #fff,
    0 0 #fff,
    0 0 #fff,
    0 0 #fff,
    0 0 #fff,
    0 0 #fff,
    0 0 #fff,
    0 0 #fff,
    0 0 #fff,
    0 0 #fff,
    0 0 #fff,
    0 0 #fff,
    0 0 #fff,
    0 0 #fff,
    0 0 #fff,
    0 0 #fff,
    0 0 #fff,
    0 0 #fff,
    0 0 #fff,
    0 0 #fff,
    0 0 #fff,
    0 0 #fff,
    0 0 #fff,
    0 0 #fff,
    0 0 #fff,
    0 0 #fff,
    0 0 #fff,
    0 0 #fff,
    0 0 #fff;
  animation:
    1s bang ease-out infinite backwards,
    1s gravity ease-in infinite backwards,
    5s position linear infinite backwards;
}

.pyro > .after {
  animation-delay: 1.25s, 1.25s, 1.25s;
  animation-duration: 1.25s, 1.25s, 6.25s;
}

@keyframes bang {
  to {
    box-shadow:
      161px -30px #0fd,
      -157px -164px #ff7300,
      -201px 28px #0040ff,
      221px -184px #ff00e1,
      72px 27px blue,
      8px -82px #ff0062,
      140px -252px #fa0,
      -14px 7px #7b00ff,
      -162px 46px #ff0900,
      -211px -33px #ff7b00,
      81px -109px #0037ff,
      82px -308px #ff9100,
      235px -94px #00a2ff,
      -149px -58px #e600ff,
      138px -260px #04f,
      -93px -290px #3cff00,
      -234px -82px #ff1e00,
      -16px 16px #c0f,
      214px -298px #00eaff,
      -192px -18px #0cf,
      20px -227px #ff00ae,
      6px -30px #ff0048,
      175px 14px #ffe100,
      -185px -285px #0dff00,
      242px -269px #f05,
      86px -1px #5100ff,
      228px -314px #00ff80,
      229px -48px #00ff4d,
      -55px -266px #ff001e,
      68px -252px #3c00ff,
      -134px -215px #0f1,
      37px -160px #00ffe1,
      -223px -265px #f03,
      184px -123px #ffd000,
      -18px -46px #009dff,
      228px -220px #00ffb3,
      67px -75px #d900ff,
      130px 53px #ffc800,
      -56px -97px #b7ff00,
      -89px -139px #0fc,
      -174px -79px #3cff00,
      -141px -254px #ff0048,
      98px -110px #0026ff,
      -66px -293px #ffc400,
      156px -258px #001aff,
      138px -170px #00ffd9,
      -228px -171px #0f1,
      163px -274px #ffea00,
      150px -112px #03f,
      -55px 33px #0048ff,
      -36px 66px #b7ff00,
      118px -160px #00ff6a,
      29px -28px #90f,
      137px 2px #002fff,
      242px -164px #ff0059,
      -158px 10px #f0c,
      -62px -231px #0f1,
      -64px -111px #c8ff00,
      -207px 44px #51ff00,
      -69px 9px #ff00ae,
      -83px -9px #60f;
  }
}

@keyframes gravity {
  to {
    transform: translateY(200px);
    opacity: 0;
  }
}

@keyframes position {
  0%,
  19.9% {
    margin-top: -10%;
    margin-left: 40%;
  }

  20%,
  39.9% {
    margin-top: 20%;
    margin-left: 30%;
  }

  40%,
  59.9% {
    margin-top: 10%;
    margin-left: 70%;
  }

  60%,
  79.9% {
    margin-top: 20%;
    margin-left: 20%;
  }

  80%,
  99.9% {
    margin-top: 20%;
    margin-left: 80%;
  }
}
</style>
