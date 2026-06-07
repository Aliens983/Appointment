<template>
  <div class="bubble-row" :class="{ mine }">
    <el-avatar v-if="!mine" :size="36" class="avatar">{{ fromName?.[0] || '?' }}</el-avatar>
    <div class="bubble">{{ content }}</div>
    <el-avatar v-if="mine" :size="36" class="avatar">{{ fromName?.[0] || '我' }}</el-avatar>
  </div>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({
  content: String,
  isMine: Boolean,
  fromName: String
})
const mine = computed(() => props.isMine)
</script>

<style scoped>
.bubble-row { display: flex; gap: 8px; margin-bottom: 12px; align-items: flex-start; }
.bubble-row.mine { flex-direction: row-reverse; }
.bubble {
  max-width: 60%;
  padding: 10px 12px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
  word-break: break-word;
  line-height: 1.5;
}
.bubble-row.mine .bubble {
  background: #5b8def;
  color: #fff;
}
.avatar { flex-shrink: 0; background: #ebeef5; color: #606266; }
</style>
