<script setup lang="ts">
import { ref, defineModel, defineProps, defineEmits } from "vue"
const model = defineModel<boolean>({ required: true })
defineProps<{
    label: string
    activeColor: string
    inactiveColor: string
}>()
const emit = defineEmits<{
    (e: 'labelclick'): void
}>()

const onClick = (e: MouseEvent) => {
    let t = <HTMLElement>(e.target)
    if (t.tagName != "LABEL") {
        return
    }
    emit("labelclick")
}

</script>
<template>
    <div class="van-cell van-field" @click="onClick">
        <div class="van-cell__title van-field__label">
            <label>{{ label }}</label>
        </div>
        <van-switch v-model="model" :active-color="activeColor" :inactive-color="inactiveColor" />
    </div>

</template>
<style scoped></style>