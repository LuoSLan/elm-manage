<template>
  <div>
    <HeadTop />
    <div class="edit_container">
      <quill-editor
        ref="myQuillEditor"
        v-model="content"
        :options="editorOption"
        @blur="onEditorBlur($event)"
        @focus="onEditorFocus($event)"
        @ready="onEditorReady($event)"
      />
    </div>
    <div class="submit_btn">
      <el-button type="primary" @click="submit">提交</el-button>
    </div>
  </div>
</template>

<script>
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";

import { quillEditor } from "vue-quill-editor";

export default {
  name: "VueEdit",
  components: {
    quillEditor,
  },
  data() {
    return {
      content: "<p>文本编辑</p>",
      editorOption: {
        /* quill options */
      },
    };
  },
  computed: {
    editor() {
      return this.$refs.myQuillEditor.quill;
    },
  },
  mounted() {
    console.log("this is current quill instance object", this.myQuillEditor);
  },
  methods: {
    submit() {
      console.log(this.content);
      this.$message.success("提交成功！");
    },

    onEditorBlur(quill) {
      // console.log("editor blur!", quill);
    },
    onEditorFocus(quill) {
      // console.log("editor focus!", quill);
    },
    onEditorReady(quill) {
      // console.log("editor ready!", quill);
    },
  },
};
</script>

<style>
.edit_container {
  padding: 40px;
  height: 400px;
}
.quill-editor {
  height: 100%;
}
.submit_btn {
  margin-top: 30px;
  text-align: center;
}
</style>