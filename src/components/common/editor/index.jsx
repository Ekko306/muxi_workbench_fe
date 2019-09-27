import React from "react";
import { Editor } from "@tinymce/tinymce-react";
import { getCookie } from "service/cookie";

/* eslint-disable */
import tinymce from "tinymce/tinymce";
/* eslint-enable */

import "tinymce/themes/silver/theme";
import "tinymce/plugins/image";
import "tinymce/plugins/lists";
import "tinymce/plugins/paste";
import "tinymce/plugins/table";
import "tinymce/plugins/imagetools";
import "tinymce/plugins/codesample";
import "tinymce/plugins/advlist";
import "tinymce/plugins/wordcount";
import "tinymce/plugins/textpattern";
import "tinymce/plugins/tabfocus";

// TODO 更换 CDN 地址

class RichTextEditor extends React.Component {
  handleChange = e => {
    const { onChange } = this.props;
    onChange(e.target.getContent());
  };

  uploadHandler = (blobInfo, success, failure) => {
    const xhr = new XMLHttpRequest();
    xhr.withCredentials = false;

    xhr.open("POST", "/api/v1.0/editor/image/");
    xhr.setRequestHeader("token", `${getCookie("workbench_token")}`);
    xhr.onload = () => {
      if (xhr.status !== 200) {
        failure(`HTTP Error: ${xhr.status}`);
        return;
      }
      const json = JSON.parse(xhr.responseText);

      if (!json || typeof json.image_url !== "string") {
        failure(`Invalid JSON: ${xhr.responseText}`);
        return;
      }

      success(json.image_url);
    };

    const formData = new FormData();
    formData.append("image", blobInfo.blob());
    xhr.send(formData);
  };

  render() {
    const { value } = this.props;
    return (
      <Editor
        initialValue={value}
        init={{
          height: 600,
          content_style: "body {    background-color: #fbfbfb;}",
          images_upload_handler: this.uploadHandler,
          language: "zh_CN",
          language_url: "https://upyingtou.com/v1/static/zh_CN.js",
          powerpaste_allow_local_images: true,
          paste_data_images: true,
          skin_url: "https://upyingtou.com/v1/static/skins/ui/oxide",
          body_class: "",
          textpattern_patterns: [
            { start: "*", end: "*", format: "italic" },
            { start: "**", end: "**", format: "bold" },
            {
              start: "~",
              end: "~",
              cmd: "createLink",
              value: "http://work.muxi-tech.xyz"
            },
            { start: "#", format: "h1" },
            { start: "##", format: "h2" },
            { start: "###", format: "h3" },
            { start: "####", format: "h4" },
            { start: "#####", format: "h5" },
            { start: "######", format: "h6" },
            { start: "* ", cmd: "InsertUnorderedList" },
            { start: "- ", cmd: "InsertUnorderedList" },
            { start: "+ ", cmd: "InsertUnorderedList" },
            {
              start: "1. ",
              cmd: "InsertOrderedList",
              value: { "list-style-type": "decimal" }
            },
            {
              start: "1) ",
              cmd: "InsertOrderedList",
              value: { "list-style-type": "decimal" }
            },
            {
              start: "a. ",
              cmd: "InsertOrderedList",
              value: { "list-style-type": "lower-alpha" }
            },
            {
              start: "a) ",
              cmd: "InsertOrderedList",
              value: { "list-style-type": "lower-alpha" }
            },
            {
              start: "i. ",
              cmd: "InsertOrderedList",
              value: { "list-style-type": "lower-roman" }
            },
            {
              start: "i) ",
              cmd: "InsertOrderedList",
              value: { "list-style-type": "lower-roman" }
            },
            { start: "---", replacement: "<hr/>" },
            { start: "--", replacement: "—" },
            { start: "-", replacement: "—" },
            { start: "(c)", replacement: "©" },
            { start: "//brb", replacement: "Be Right Back" },
            {
              start: "//heading",
              replacement:
                '<h1 style="color: blue">Heading here</h1> <h2>Author: Name here</h2> <p><em>Date: 01/01/2000</em></p> <hr />'
            }
          ],
          imagetools_cors_hosts: [
            "work.muxi-tech.xyz",
            "work.muxixyz.com",
            "ossworkbench.muxixyz.com"
          ],
          plugins:
            "tabfocus textpattern image paste lists table imagetools codesample advlist wordcount checklist",
          toolbar:
            "undo redo | bold italic formatselect | forecolor backcolor | alignleft aligncenter alignright  alignjustify | bullist numlist | image | codesample| wordcount"
        }}
        onChange={this.handleChange}
      />
    );
  }
}

export default RichTextEditor;
