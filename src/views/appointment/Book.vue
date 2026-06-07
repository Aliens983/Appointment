<template>
  <div class="container page" v-loading="loading">
    <el-page-header @back="$router.back()" content="选择预约时段" />

    <el-card class="mt-16">
      <el-steps :active="1" finish-status="success" class="mb-16">
        <el-step title="选择时段" />
        <el-step title="填写表单" />
        <el-step title="预约完成" />
      </el-steps>

      <el-row :gutter="16">
        <el-col :xs="24" :md="8">
          <h4>选择日期</h4>
          <el-date-picker
            v-model="date"
            type="date"
            placeholder="选择日期"
            :disabled-date="disabledDate"
            value-format="YYYY-MM-DD"
            @change="onDateChange"
            style="width: 100%"
          />
        </el-col>
        <el-col :xs="24" :md="16">
          <h4>当日可约时段</h4>
          <div v-if="currentSlots.length === 0" class="muted">该日期暂无可约时段</div>
          <div class="slot-grid">
            <el-button
              v-for="s in currentSlots"
              :key="s.slotId"
              :type="selected?.slotId === s.slotId ? 'primary' : 'default'"
              :disabled="!s.available"
              @click="selectSlot(s)"
            >{{ fmtTime(s.start) }} - {{ fmtTime(s.end) }}</el-button>
          </div>
        </el-col>
      </el-row>
    </el-card>

    <div class="footer-action">
      <el-button type="primary" size="large" :disabled="!selected" @click="next">下一步:填写表单</el-button>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import dayjs from 'dayjs'
import { fmtTime } from '@/utils/format'

const route = useRoute()
const router = useRouter()
const store = useStore()
const loading = ref(false)
const date = ref('')
const slots = ref([])
const selected = ref(null)

const currentSlots = computed(() => slots.value.find(d => d.date === date.value)?.slots || [])

function disabledDate(d) {
  const today = dayjs().startOf('day')
  return dayjs(d).isBefore(today) || dayjs(d).isAfter(today.add(7, 'day'))
}

async function load() {
  loading.value = true
  try {
    const data = await store.dispatch('counselor/fetchSlots', route.params.counselorId)
    slots.value = data.days || []
    if (slots.value.length) date.value = slots.value[0].date
  } finally { loading.value = false }
}

function onDateChange() { selected.value = null }
function selectSlot(s) { if (s.available) selected.value = s }
function next() { router.push(`/appointment/form/${selected.value.slotId}`) }

watch(currentSlots, list => {
  if (!list.find(s => s.slotId === selected.value?.slotId)) selected.value = null
})

onMounted(load)
</script>

<style scoped>
.muted { color: #909399; }
.slot-grid { display: flex; flex-wrap: wrap; gap: 8px; }
.footer-action { text-align: center; margin-top: 24px; }
</style>
