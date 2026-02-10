<script lang="ts" setup>
import type {NodeViewProps} from "@halo-dev/richtext-editor";
import { NodeViewWrapper } from "@halo-dev/richtext-editor";
import '@xhhaocom/timeline-view';
import {computed, h} from "vue";
import {
  VButton,
  VEmpty
} from "@halo-dev/components";
import TablerClock from "~icons/tabler/clock";

const props = defineProps<NodeViewProps>();

const groupName = computed({
  get: () => {
    return (props.node?.attrs.groupName as string) || '';
  },
  set: (value: string) => {
    props.updateAttributes({ groupName: value });
  }
});

const orientation = computed(() => {
  return (props.node?.attrs.orientation as 'vertical' | 'horizontal' | 'alternating') || 'vertical';
});

const title = computed({
  get: () => {
    return (props.node?.attrs.title as string) || '';
  },
  set: (value: string) => {
    props.updateAttributes({ title: value });
  }
});

const fontSize = computed({
  get: () => {
    return (props.node?.attrs.fontSize as 'small' | 'medium' | 'large') || 'medium';
  },
  set: (value: 'small' | 'medium' | 'large') => {
    props.updateAttributes({ fontSize: value });
  }
});

const timelineComponent = computed(() => {
  if (!groupName.value) {
    return null;
  }
  return h('timeline-view', {
    'group-name': groupName.value,
    orientation: orientation.value,
    title: title.value,
    'font-size': fontSize.value,
  });
});
</script>

<template>
  <node-view-wrapper
    as="div"
    :class="['timeline-view-container', {'timeline-view-container--selected': selected}]">
    <div class="timeline-view-nav">
      <div class="timeline-view-nav-start">
        <div class=":uno: flex items-center gap-2">
          <TablerClock class=":uno: size-4" />
          <span>时间轴</span>
        </div>
      </div>
      <div class="timeline-view-nav-end :uno: flex flex-wrap items-center gap-3">
        <!-- 分组优先，放在最左边 -->
        <FormKit
          v-model="groupName"
          type="select"
          name="groupName"
          :multiple="false"
          clearable
          searchable
          placeholder="请选择分组"
          action="/apis/api.timeline.xhhao.com/v1alpha1/timelinegroups"
          :request-option="{
            method: 'GET',
            pageField: 'page',
            sizeField: 'size',
            totalField: 'total',
            itemsField: 'items',
            labelField: 'spec.displayName',
            valueField: 'metadata.name',
          }"
          :classes="{
            wrapper: 'timeline-group-select-wrapper',
            input: 'timeline-group-select-input',
          }"
        />
        <!-- 中间是时间轴标题 -->
        <FormKit
          v-model="title"
          type="text"
          name="title"
          placeholder="时间轴标题（可选）"
          :classes="{
            wrapper: 'timeline-title-input-wrapper',
            input: 'timeline-title-input',
          }"
        />
        <!-- 右侧是字号选择 -->
        <FormKit
          v-model="fontSize"
          type="select"
          name="fontSize"
          :options="[
            { label: '小', value: 'small' },
            { label: '中', value: 'medium' },
            { label: '大', value: 'large' },
          ]"
          :classes="{
            wrapper: 'timeline-font-size-wrapper',
            input: 'timeline-font-size-input',
          }"
        />
      </div>
    </div>
    <div class="timeline-view-preview">
      <component
        v-if="groupName"
        :is="timelineComponent"
        :key="groupName"
      />
      <VEmpty
        v-else
        message="请在上方选择分组"
        title="未选择分组"
      />
    </div>
  </node-view-wrapper>
</template>

<style>
.timeline-view-container {
  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color);
  box-shadow: var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow, 0 0 #0000);
  --tw-ring-opacity: 1;
  --tw-ring-color: rgb(229 231 235 / var(--tw-ring-opacity));
  border-radius: 4px;
  overflow: hidden;
  margin-top: .75em
}

.timeline-view-container--selected {
  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);
  box-shadow: var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow, 0 0 #0000);
  --tw-ring-color: inherit
}

.timeline-view-nav {
  border-bottom: 1px #e7e7e7 solid;
  display: flex;
  padding: 5px 10px;
  align-items: center;
}

.timeline-view-nav-start {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
}

.timeline-view-nav-end {
  justify-content: flex-end;
}

  .timeline-view-preview {
    padding: 5px 10px;
    background: transparent;
  }

  .timeline-view-preview timeline-view {
    display: block;
  }

  /* 通过 CSS 变量确保编辑器中的时间轴样式与前端一致 */
  .timeline-view-preview {
    --timeline-bg-color: transparent;
    --timeline-bg-color-hover: #f9fafb;
  }

  /* 深色主题下的变量 */
  .dark .timeline-view-preview,
  [data-theme="dark"] .timeline-view-preview,
  html.dark .timeline-view-preview {
    --timeline-bg-color: transparent;
    --timeline-bg-color-hover: #1f2937;
  }

.timeline-title-input-wrapper {
  min-width: 140px;
  max-width: 200px;
}

.timeline-title-input {
  font-size: 14px;
}

.timeline-font-size-wrapper {
  min-width: 72px;
}

.timeline-font-size-input {
  font-size: 14px;
}

.timeline-group-select-wrapper {
  min-width: 200px;
}

.timeline-group-select-input {
  font-size: 14px;
}
</style>
