![logo](https://raw.githubusercontent.com/Muxi-X/muxi_workbench_fe/master/logo.png)

木犀团队出品的团队协作工具

### 本地开发

```
npm install
npm run build
```

然后打开工作台
然后用 Requestly 映射线上资源到本地进行开发（[Requestly规则](https://github.com/Muxi-X/muxi_workbench_fe/blob/master/requestly_rules.txt)）

### 部署

```
git tag release-xxx // 打一个 release 开头的 tag
```

然后等镜像构建完成，更新集群的镜像版本号就行（版本号就是刚才打的 tag）
