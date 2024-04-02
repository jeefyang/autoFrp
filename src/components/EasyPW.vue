<script setup lang="ts">
import { ref, defineModel, defineProps, defineEmits } from "vue"
const isPassword = ref(true)
const model = defineModel<string>({ required: true })
defineProps<{
    label: string
    placeholder: string
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
    <van-field v-model="model" :type="isPassword ? 'password' : 'text'" :label="label" :placeholder="placeholder"
        clearable @click="onClick">
        <template v-slot:right-icon>
            <span class="solts" @click="isPassword = !isPassword">
                <van-icon name="eye" v-if="!isPassword" />
                <van-icon name="closed-eye" v-else />
            </span>
        </template>
    </van-field>

</template>
<style scoped></style>