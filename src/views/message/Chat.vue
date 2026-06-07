<template>
  <div class="container page chat-page" v-loading="loading">
    <el-page-header @back="$router.back()" :content="title" />

    <el-card class="mt-16 chat-card">
      <div class="messages" ref="msgBoxRef">
        <EmptyState v-if="!loading && messages.length === 0" text="还没有消息,开始聊吧" />
        <MessageBubble
          v-for="m in messages"
          :key="m.id"
          :content="m.content"
          :is-mine="m.isMine"
          :from-name="m.isMine ? (me?.nickname || '我') : counselorName"
        />
      </div>
      <div class="composer">
        <el-input
          v-model="text"
          type="textarea"
          :rows="2"
          placeholder="说点什么吧…(Ctrl+Enter 发送)"
          @keydown.ctrl.enter="send"
        />
        <el-button type="primary" :disabled="!text.trim()" @click="send">发送</el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import MessageBubble from '@/components/MessageBubble.vue'
import EmptyState from '@/components/EmptyState.vue'

const route = useRoute()
const store = useStore()
const loading = ref(false)
const messages = ref([])
const text = ref('')
const msgBoxRef = ref()

const me = computed(() => store.state.user.profile)
const conversations = computed(() => store.state.message.conversations)
const currentConv = computed(() => conversations.value.find(c => c.id === Number(route.params.id)))
const counselorName = computed(() => currentConv.value?.counselor?.name || '咨询师')
const title = computed(() => `与 ${counselorName.value} 聊天`)

async function load() {
  loading.value = true
  try {
    await store.dispatch('message/fetchConversations')
    messages.value = await store.dispatch('message/fetchMessages', Number(route.params.id))
    scrollBottom()
  } finally { loading.value = false }
}

function scrollBottom() {
  nextTick(() => {
    if (msgBoxRef.value) msgBoxRef.value.scrollTop = msgBoxRef.value.scrollHeight
  })
}

async function send() {
  const content = text.value.trim()
  if (!content) return
  await store.dispatch('message/send', { id: Number(route.params.id), content })
  text.value = ''
  scrollBottom()
}

watch(() => route.params.id, load)

onMounted(load)
</script>

<style scoped>
.chat-page { display: flex; flex-direction: column; }
.chat-card { display: flex; flex-direction: column; height: calc(100vh - 200px); }
.messages { flex: 1; overflow-y: auto; padding: 16px; background: #f5f7fa; border-radius: 4px; }
.composer { display: flex; gap: 8px; margin-top: 12px; align-items: flex-end; }
</style>
