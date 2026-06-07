<template>
  <el-card class="ap-card" shadow="hover">
    <div class="header-row">
      <div class="left">
        <el-tag :type="statusInfo.type" size="small">{{ statusInfo.label }}</el-tag>
        <el-tag v-if="item.isAnonymous" type="warning" size="small" effect="plain">匿名</el-tag>
        <el-tag v-if="item.urgency" :type="urgencyInfo.type" size="small" effect="plain">{{ urgencyInfo.label }}</el-tag>
      </div>
      <div class="right text-muted">#{{ item.id }}</div>
    </div>
    <div class="body">
      <div class="topic">主题:{{ item.topic }}</div>
      <div class="muted">咨询师:{{ item.counselor?.name }} · {{ item.counselor?.title }}</div>
      <div class="muted">时间:{{ fmtDateTime(item.start) }} - {{ fmtTime(item.end) }}</div>
    </div>
    <div class="actions">
      <el-button size="small" @click="$emit('detail', item)">查看详情</el-button>
      <el-button v-if="item.status === 'upcoming'" size="small" type="danger" plain @click="$emit('cancel', item)">取消</el-button>
      <el-button v-if="item.status === 'completed' && !item.score" size="small" type="primary" @click="$emit('review', item)">去评价</el-button>
    </div>
  </el-card>
</template>

<script setup>
import { computed } from 'vue'
import { APPOINTMENT_STATUS, URGENCY } from '@/utils/constants'
import { fmtDateTime, fmtTime } from '@/utils/format'

const props = defineProps({ item: { type: Object, required: true } })
defineEmits(['detail', 'cancel', 'review'])

const statusInfo = computed(() => APPOINTMENT_STATUS[props.item.status] || { label: props.item.status, type: 'info' })
const urgencyInfo = computed(() => URGENCY[props.item.urgency] || { label: '', type: 'info' })
</script>

<style scoped>
.ap-card { margin-bottom: 12px; }
.header-row { display: flex; justify-content: space-between; align-items: center; }
.left { display: flex; gap: 6px; }
.body { margin: 12px 0; }
.topic { font-size: 15px; font-weight: 600; margin-bottom: 4px; }
.muted { color: #909399; font-size: 13px; line-height: 1.7; }
.actions { display: flex; gap: 8px; }
</style>
