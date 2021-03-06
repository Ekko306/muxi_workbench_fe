import { Store } from "store";
import ProjectService from "../../service/project";

export const Root = {
  folder: true,
  id: 0,
  name: "全部文件",
  router: [0],
  selected: true,
  finalSelected: true,
  child: [
    {
      folder: true,
      id: 1,
      name: "文件夹1",
      router: [0, 1],
      child: [
        {
          folder: true,
          id: 11,
          name: "文件夹1-1",
          router: [0, 1, 11],
          child: [
            {
              folder: true,
              id: 111,
              name: "文件夹1-1-1",
              router: [0, 1, 111],
              child: []
            },
            {
              folder: false,
              id: 112,
              name: "文件1-1-2.txt",
              router: [0, 1, 112]
            }
          ]
        },
        {
          id: 12,
          name: "文件夹1-2",
          router: [0, 1, 12],
          child: []
        }
      ]
    },
    {
      folder: true,
      id: 2,
      name: "文件夹2",
      router: [0, 2],
      child: [
        {
          folder: true,
          id: 21,
          name: "文件夹2-1",
          router: [0, 2, 21],
          child: []
        },
        {
          folder: false,
          id: 22,
          name: "文件2-2.pdf",
          router: [0, 2, 22]
        }
      ]
    },
    {
      folder: true,
      id: 3,
      name: "文件夹3",
      router: [0, 3],
      child: []
    },
    {
      folder: false,
      id: 4,
      name: "文件0-1.txt",
      router: [0, 4]
    },
    {
      folder: false,
      id: 5,
      name: "文件0-2.pdf",
      router: [0, 5]
    },
    {
      folder: false,
      id: 6,
      name: "文件0-3.psd",
      router: [0, 6]
    }
  ]
};

export function getRoot() {
  let root1 = Root;
  root1 = JSON.stringify(root1);
  root1 = JSON.parse(root1);
  ProjectService.getProjectFileTree();
  return root1;
}

const FileTreeRecursion = {
  searchNode(id, node, result, tester) {
    /* eslint-disable */
    if (node.id == id) {
      if (tester) {
        if (tester(node)) {
          result.node = node;
          return true;
        }
      } else {
        result.node = node;
        return true;
      }
    }
    /* eslint-enable */

    if (node.child) {
      for (let i = 0; i < node.child.length; i++) {
        if (FileTreeRecursion.searchNode(id, node.child[i], result, tester)) {
          return true;
        }
      }
    }
  },

  TraversalFileNode(node, result) {
    if (node.child) {
      node.child.forEach(el => {
        if (el.folder) {
          result.folder.push(el.id);
          FileTreeRecursion.TraversalFileNode(el, result);
        } else {
          result.file.push(el.id);
        }
      });
    }
  },

  TraversalDocNode(node, result) {
    if (node.child) {
      node.child.forEach(el => {
        if (el.folder) {
          result.folder.push(el.id);
          FileTreeRecursion.TraversalFileNode(el, result);
        } else {
          result.doc.push(el.id);
        }
      });
    }
  }
};

export const FileTree = {
  // 请求文件树
  getFileTree(pid) {
    return ProjectService.getProjectFileTree(pid)
      .then(res => {
        if (res.filetree) {
          return JSON.parse(res.filetree);
        }
        return [];
      })
      .catch(error => {
        Store.dispatch({
          type: "substituteWrongInfo",
          payload: error
        });
      });
  },

  // 请求文档树
  getDocTree(pid) {
    return ProjectService.getProjectDocTree(pid)
      .then(res => {
        if (res.doctree) {
          return JSON.parse(res.doctree);
        }
        return [];
      })
      .catch(error => {
        Store.dispatch({
          type: "substituteWrongInfo",
          payload: error
        });
      });
  },

  // 初始化节点均没有被选中
  initNodeSelected(node) {
    const nodeTemp = node;
    nodeTemp.selected = false;
    for (let i = 0; i < nodeTemp.child.length; i += 1) {
      nodeTemp.child[i].selected = false;
      if (nodeTemp.child[i].child && nodeTemp.child[i].child.length) {
        FileTree.initNodeSelected(nodeTemp.child[i]);
      }
    }
  },

  // 初始化节点是否是最终被选中的
  initNodeFinalSelected(node) {
    const nodeTemp = node;
    nodeTemp.finalSelected = false;
    for (let i = 0; i < nodeTemp.child.length; i += 1) {
      nodeTemp.child[i].finalSelected = false;
      if (nodeTemp.child[i].child && nodeTemp.child[i].child.length) {
        FileTree.initNodeFinalSelected(nodeTemp.child[i]);
      }
    }
  },

  // 查找节点
  searchNode(id, root) {
    // 在root的树中找到对应id的节点
    // 成功返回该节点，失败返回null
    /* eslint-disable */
    let temp = { node: null };
    /* eslint-enable */

    FileTreeRecursion.searchNode(id, root, temp);
    return temp.node;
  },

  // 查找文档节点
  searchFolder(id, root) {
    // 在root的树中找到对应id的节点
    // 成功返回该节点，失败返回null
    /* eslint-disable */
    let temp = { node: null };
    /* eslint-enable */

    FileTreeRecursion.searchNode(id, root, temp, item => !!item.folder);
    return temp.node;
  },

  // 返回某个文件节点下的id：{folder: [id1, id2, ...], file: [id1, id2, ...]}
  findFileIdList(id, root) {
    const parentNode = FileTree.searchNode(id, root);
    if (parentNode === null || !parentNode.folder) {
      return false;
    }
    return {
      folder: parentNode.child
        .filter(el => el.folder)
        .map(el1 => parseInt(el1.id, 0)),
      file: parentNode.child
        .filter(el => !el.folder)
        .map(el1 => parseInt(el1.id, 0))
    };
  },

  // 返回文件树节点下档所有id：{folder: [id1, id2, ...], file: [id1, id2, ...]}
  findAllFileList(id, root) {
    const parentNode = FileTree.searchNode(id, root);
    if (parentNode === null || !parentNode.folder) {
      return false;
    }
    const result = { folder: [id], file: [] };
    FileTreeRecursion.TraversalFileNode(parentNode, result);
    return result;
  },

  // 返回某个文档节点下的id：{folder: [id1, id2, ...], doc: [id1, id2, ...]}
  findDocIdList(id, root) {
    const parentNode = FileTree.searchFolder(id, root);
    // console.log(parentNode);
    if (parentNode === null || !parentNode.folder) {
      return false;
    }
    return {
      folder: parentNode.child
        .filter(el => el.folder)
        .map(el1 => parseInt(el1.id, 0)),
      doc: parentNode.child
        .filter(el => !el.folder)
        .map(el1 => parseInt(el1.id, 0))
    };
  },

  // 返回文档树节点下所有id：{folder: [id1, id2, ...], doc: [id1, id2, ...]}
  findAllDocList(id, root) {
    const parentNode = FileTree.searchNode(id, root);
    if (parentNode === null || !parentNode.folder) {
      return false;
    }
    const result = { folder: [id], doc: [] };
    FileTreeRecursion.TraversalDocNode(parentNode, result);
    return result;
  },

  // 插入节点
  insertNode(node, id, root) {
    // 在root的树中插入node节点，该节点的父节点的id为id，成功返回新节点，失败返回false
    const parentNode = FileTree.searchNode(id, root);
    if (parentNode === null || !parentNode.folder) {
      return false;
    }
    const nodeTemp = node;
    nodeTemp.router = parentNode.router.concat(node.id);
    parentNode.child.push(nodeTemp);
    return root;
  },

  // 删除节点
  deleteNode(id, root) {
    // 在树root中删除id为id的节点，成功返回Obj{删除的节点, 新节点}，失败返回false
    /* eslint-disable */
    if (id == 0) {
      /* eslint-disable */
      // 无法删除根节点
      return false;
    }
    const node = FileTree.searchNode(id, root);
    if (node === null) {
      return false;
    }
    const nodeDeleted = Object.assign({}, node);
    const parentId = nodeDeleted.router[nodeDeleted.router.length - 2];
    const parentNode = FileTree.searchNode(parentId, root);
    for (let i = 0; i < parentNode.child.length; i += 1) {
      /* eslint-disable */
      if (parentNode.child[i].id == id) {
        /* eslint-disable */
        parentNode.child.splice(i, 1);
        break;
      }
    }
    return { root, nodeDeleted };
  },

  // 移动节点
  moveNode(id, parentId, root) {
    // 在树root中找到id为id的节点，并把以这个节点为根节点的树移动到id为parentId的节点下，作为它的子树
    // 成功返回true，失败返回false
    const deletedRoot = FileTree.deleteNode(id, root);
    if (!deletedRoot) {
      return false;
    }
    return FileTree.insertNode(
      deletedRoot.nodeDeleted,
      parentId,
      deletedRoot.root
    );
  }
};
