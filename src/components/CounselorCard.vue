<template>
  <el-card class="counselor-card" shadow="hover" @click="$emit('click')">
    <div class="row">
      <el-avatar :size="56" :src="counselor.avatar">{{ counselor.name?.[0] }}</el-avatar>
      <div class="info">
        <div class="name-line">
          <span class="name">{{ counselor.name }}</span>
          <el-tag size="small" type="info">{{ counselor.title }}</el-tag>
        </div>
        <div class="meta">
          <el-rate :model-value="counselor.rating" disabled show-score :score-template="String(counselor.rating)" />
          <span class="muted">共 {{ counselor.ratingCount }} 评价</span>
        </div>
        <div class="tags">
          <el-tag v-for="s in counselor.specialties" :key="s" size="small" effect="plain" class="tag">{{ s }}</el-tag>
        </div>
        <div class="intro text-muted">{{ counselor.intro }}</div>
      </div>
      <div class="action">
        <el-button type="primary" size="small">查看详情</el-button>
        <div class="muted mt-8">可约 {{ counselor.availableSlotCount }} 时段</div>
      </div>
    </div>
  </el-card>
</template>

<script setup>
defineProps({ counselor: { type: Object, required: true } })
defineEmits(['click'])
</script>

<style scoped>
.counselor-card { cursor: pointer; margin-bottom: 12px; }
.row { display: flex; gap: 16px; }
.info { flex: 1; }
.name-line { display: flex; align-items: center; gap: 8px; }
.name { font-size: 18px; font-weight: 600; }
.meta { display: flex; align-items: center; gap: 12px; margin-top: 6px; }
.muted { color: #909399; font-size: 12px; }
.tags { margin-top: 8px; display: flex; gap: 6px; flex-wrap: wrap; }
.tag { margin-right: 0; }
.intro { margin-top: 8px; font-size: 13px; }
.action { display: flex; flex-direction: column; align-items: flex-end; justify-content: center; }
</style>
