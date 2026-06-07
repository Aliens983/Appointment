<template>
  <div class="container page" v-loading="loading">
    <h2 class="title">在线留言</h2>
    <el-card>
      <EmptyState v-if="!loading && list.length === 0" text="还没有会话,去咨询师详情页发起对话吧" />
      <div v-for="c in list" :key="c.id" class="conv-item" @click="$router.push(`/messages/${c.id}`)">
        <el-badge :value="c.unreadCount" :hidden="!c.unreadCount">
          <el-avatar :size="44" :src="c.counselor?.avatar">{{ c.counselor?.name?.[0] }}</el-avatar>
        </el-badge>
        <div class="conv-info">
          <div class="line1">
            <span class="name">{{ c.counselor?.name }}</span>
            <span v-if="c.isAnonymous" class="tag-anon">[匿名]</span>
            <span class="muted time">{{ c.lastMessage ? fmtDateTime(c.lastMessage.createdAt) : '' }}</span>
          </div>
          <div class="line2 muted">{{ c.lastMessage?.content || '暂无消息' }}</div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import EmptyState from '@/components/EmptyState.vue'
import { fmtDateTime } from '@/utils/format'

const store = useStore()
const list = ref([])
const loading = ref(false)

async function load() {
  loading.value = true
  try {
    list.value = await store.dispatch('message/fetchConversations')
  } finally { loading.value = false }
}

onMounted(load)
</script>

<style scoped>
.title { margin: 0 0 16px; }
.conv-item { display: flex; gap: 12px; padding: 12px 0; border-bottom: 1px solid #ebeef5; cursor: pointer; }
.conv-item:hover { background: #fafafa; }
.conv-item:last-child { border-bottom: none; }
.conv-info { flex: 1; min-width: 0; }
.line1 { display: flex; align-items: center; gap: 8px; }
.name { font-weight: 600; }
.tag-anon { color: #e6a23c; font-size: 12px; }
.muted { color: #909399; font-size: 13px; }
.time { margin-left: auto; }
.line2 { margin-top: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
</style>
