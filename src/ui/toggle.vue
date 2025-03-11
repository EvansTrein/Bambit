<template>
  <div class="toggle" @click="toggleTheme">
    <input type="checkbox" />
    <label></label>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits(["themeChanged"]);

const toggleTheme = () => {
  const isDarkMode = document.documentElement.classList.toggle("dark");
  emit("themeChanged", isDarkMode ? "dark" : "light");
};
</script>

<style scoped>
.toggle {
  position: relative;
  box-sizing: border-box;
}
.toggle input[type="checkbox"] {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 10;
  width: 100%;
  height: 100%;
  cursor: pointer;
  opacity: 0;
}
.toggle label {
  position: relative;
  display: flex;
  align-items: center;
  box-sizing: border-box;
}
.toggle label:before {
  content: "";
  width: 50px;
  height: 30px;
  position: relative;
  display: inline-block;
  background: #e6e6e6;
  border-radius: 46px;
  border: 2px solid #000;
  box-sizing: border-box;
  transition: 0.2s ease-in;
}
.toggle label:after {
  content: "";
  position: absolute;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  left: 3px;
  top: 3px;
  z-index: 2;
  background: #000;
  box-sizing: border-box;
  transition: 0.2s ease-in;
}
.toggle input[type="checkbox"]:checked + label:before {
  background: #000;
}
.toggle input[type="checkbox"]:checked + label:after {
  left: 24px;
  background: #e6e6e6;
}
</style>
