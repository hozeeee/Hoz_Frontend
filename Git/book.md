
blob 是“二进制大对象”（binary large object）的缩写，用来指代某些可以包含任意数据的变量或文件，同时其内部结构会被程序忽略。

![图例](./图片/基本图例(二次提交).png)



`git checkout <branch-name>` 可以**检出**某个分支，通俗说就是“切换分支”。

有这么一个场景，如果你在 `master` 分支上修改了一些内容，但实际你期望在 `bug/*` 的某个分支上修改，你带着工作区的修改去执行检出操作默认会被 Git 阻止，此时你可以使用 `-m` 选项，Git 通过在你的啊本地修改和对目标分支之间进行一次合并操作，尝试将你的本地修改加入到新的工作目录中（如果存在冲突记得处理）。



Git 创建分离的 HEAD 的情况：

- 检出的提交不是分支的头部。
- 检出一个远程追踪分支。
- 检出标签引用的提交。
- 启动一个 `git bisect` 的操作。
- 使用 `git submodule update` 命令。  (TODO:作用???)

使用 `git branch` 可以判断目前是否在一个分离的分支上，如果你想在该点用新的提交留住它们，你必选先创建一个新的分支（`git checkout -b <new-branch-name>`）。



# ——

在指定目录下，执行 `git init` 可以将该目录转化成 Git 版本库。创建成功后，在该项目的顶层目录会创建名为 .git 的隐藏目录。



`git add <filename>` 将 `<filename>` 添加到版本库中。

`git status` 查看文件修改状态。





`git log` 查看提交历史（从新到旧罗列）。


`git show <commit-hash>?` 查看特定提交的详细信息。其中 `<commit-hash>` 参数，默认是最近一次提交。


`git diff` ：

- 用途：
  - 可以查看两个提交的差异
  - 可以查看两个文件的差异
  - ....
- 4 种基本比较：
  - `git diff` 会显示**工作目录**和**索引**之间的差异，如果索引是空，会跟 `HEAD` 比较。
  - `git diff <commit-hash>` 会显示**工作目录**和**给定提交**之间的差异。
  - `git diff --cached <commit-hash>` 会显示**索引**和**给定提交**之间的差异。
  - `git diff <commit-1-hash> <commit-2-hash>` 会显示**任意两个提交**之间的差异。
- 比较有用的选项：
  - `--M` 可以查找重命名的文件，包括重命名后修改其内部内容的。
  - `--w`/`--ignore-all-space` 比较时忽略空白字符。
  - `--stat` 用于显示针对两个树状态之间差异的统计数据。
  - `--color` 使输出结果使用多种颜色演示。




`git ls-files -s` 查看文件列表。

<!-- `git write-tree` 查看索引当前信息的快照。 -->

`git cat-file` TODO: ???


`git rm <filename>` 是与 `git add` 相反的一个命令，删除特定文件，带上 `--cached` 命令则只删除索引中的该文件，工作区保留该文件。

`git mv <old-path> <new-path>` 移动/重命名文件。

`git show-branch --more=20` TODO:

`git rev-parse master` TODO:

`git rev-list ...` TODO:

`git blame` TODO:

`git merge-base original-branch new-branch` TODO:

`git reflog`








## 配置文件

### 配置当前仓库提交作者

- `git config user.name <username>` 和 `git config user.email <email>`
- 也可以使用 `GIT_AUTHOR_NAME` 和 `GIT_AUTHOR_EMAIL`


### 作用范围(优先级从高到低)

1. `.git/config`:
    - 版本库特定的配置。可以用 `--file` 选项修改，也是默认选项。

2. `~/.gitconfig`:
    - 用户特定的配置。可以用 `--global` 选项修改。

3. `/etc/gitconfig`:
    - 系统他而定的配置。可以用 `--system` 选项修改。
    - 位置也可能在 `/usr/local/etc/gitconfig` ，也可能不存在。

### 其他

`git config -l` 可以查看所有变量的设置值。

`--unset` 选项可以移除设置，如 `git config --unset --global user.name` 。





## 怎么"阅读"有效信息

关于  `^` 和 `~` ：

- `^` 表示上一个父提交；`^2` 则表示第三个父提交。一般用于合并的节点上，因为对于它有多个父提交。
  - （注意，如果在 cmd 控制台中换行符默认是 `^`，而不是 `\`，建议使用 `"` 包裹，如 `git show "HEAD^2"`）
- `~` 表示上一个提交；`~2` 则表示近第三个提交。
- 对于没有分支的“提交线”上， `HEAD^` 等效于 `HEAD~` 。
- `^` 和 `~` 能组合使用多个，例如 `HEAD^2~5` ，甚至 `HEAD^2~2^2^2~3`。
- 对于一个分支名，例如 master， `master~` 表示 master 分支的近第二个提交。


关于 `git show-branch` ：

- 示例：

  ``` shell
  ! [baz] baz
   ! [foo] foo
    * [master] Merge branches 'foo', 'baz' and 'ttt'
     ! [ttt] ttt
  ----
    -  [master] Merge branches 'foo', 'baz' and 'ttt'
    *+ [ttt] ttt
  + *  [baz] baz
   +*  [foo] foo
  ++*+ [ttt^] 2
  ```

- `----` 分割成两部分：
  - **上方的部分**列出所有分支。
    - `[]` 包裹的是分支名；
    - `*` 表示当前分支，否则是 `!`；
    - 每行末尾都列出该分支最近提交的日志消息。
  - **下方的部分**表示每个分支提交的矩阵。
    - `+` 表示该提交**存在于指定的分支**上；
    - `*` 突出显示**存在于活动分支**上；
    - `-` 表示一个**合并提交**；
    - 每个符号都对应正上方的分支。

- 结合示例说明：
  - `* [master] ....` 表示当前在 `master` 分支上；
  - `++*+ [ttt^] 2` 表示 `ttt` 的近第二次提交存在于所有分支，该次提交的信息是 `2`；
  - `-  [master] ....` 表示该提交是一次合并提交；
  - “下部分”的所有 `*` 都正对着“上部分”的 `*`，只是突出当前分支。


关于 `git diff` ：

- 修改前的文件内容：

  ``` txt
  Now is the time
  For all good men
  To come to the aid
  Of their country.
  ```

- 修改后的文件内容：

  ``` txt
  Today is the time
  For all good men
  And women
  To come to the aid
  Of their country.
  ```

- 先简单比较上面两个文件的内容，可以看出，修改了第一行，增加了第三行。

- 运行 `git diff ....` 可以得到如下主要内容：

  ``` shell
  diff --git a/file.txt b/file.txt
  index 4c87407..514a1f7 100644
  --- a/file.txt
  +++ b/file.txt
  @@ -1,4 +1,5 @@
  -Now is the time
  +Today is the time
  For all good men
  +And women
  To come to the aid
  Of their country.
  ```

- 我们先看 `@@ -1,4 +1,5 @@` :
  - `@@` 之间描述了改变的内容范围；
  - `-1,4` 是一个整体，`-` 表示改变前的文件，`1,4` 表示下面描述的信息包含 1 到 4 行；
  - `+1,5` 也是类似，`+` 表示改变后的文件， `1,5` 表示下面描述的信息包含  1 到 5 行；
  - 从两组数字可以看出，内容总共增加了一行，变动涉及原文件的 1 到 4 行。

- 后面的内容就容易看了，每行前面：
  - 如果有 `+` 表示该行是新增的；
  - 如果有 `-` 表示该行是被删除；
  - 如果都没有，就是没有变动。




TODO:





## 基本概念

Git 版本库只是一个简单的数据库，其中包含所有用来维护与管理项目的修订版本和历史的信息。

Git 版本库不仅仅提供版本库所有文件的完善副本，还提供版本库本身的副本。

Git 对每个网站、每个用户和每个版本库的配置和设置信息都进行管理与检查。

在版本库中，Git 维护两个主要的数据结构：对象库（object store）和索引（index）。


对象库是 Git 版本库实现的心脏。它包含你的原始数据文件和所有日志消息、作者信息、日期，以及其他用来重建项目任意版本或分支的信息。

对象只有 4 种类型：

- 块（blob）：文件的每一个版本都表示一个快（blob）

- 目录树（tree）：一个目录树对象代表一层目录信息。它记录 blob 标识符、路径名和一个目录里所有文件的一些元数据，也可以递归引用其他目录树或子树对象。

- 提交（commit）：一个提交对象保存版本库中每一次变化的元素据，包括作者、提交者、提交日期和日志消息。

- 标签（tag）：一个标签对象分配一个任意的且人类可读的名字给一个特定对象，通常是一个提交对象。虽然 Git只实现了一种标签对象，但有两种基本的标签类型：
  - 轻量级的（lightweight）：它只是一个提交对象的引用，通常被版本库是为私有的。这些标签并不在版本库里创建永久对象。
  - 带附注的（annotated）：它会创建一个对象，包含你提供的一条消息。例如通过 `git tag -m "Tag version 1.0" V1.0 32d234` 创建。
  - 通过 `git arevparse V1.0` 查看名为 `V1.0` 的标签对象的 SHA1 值。
  - 通过 `git cat-file -p <tag-sha1>` 找到对应的标签对象。



索引：

当我们执行 `git add` 的时候，就是把修改的文件添加到“索引”。

索引是一个临时的、动态的二进制文件，它描述整个版本库的目录结构。更具体地说，索引捕获项目在某个时刻的整体结构的一个版本。



Git 追踪内容

Git 追踪的是内容，不是文件。

如果两个文件的内容完全一样，无论是否在相同的鲁姆，Git 在对象库里只保存一份 blob 形式的内容副本，用内容生成唯一的 SHA1 值所谓索引。

如果这些文件中的一个发生变化，Git 会为它计算一个新的 SHA1 值，然后把这个新的 blob 加到对象库里，原来的 blob 在对象库保持不变。

所以，你每对文件进行修改（即使只加了一个字符），都会生成一个新的 blob 存到版本库中。

可能你会想，每次都存储整个文件，效率会不会太低？

实际不是，Git 使用了一种叫 **打包文件（pack file）** 的更有效存储机制。Git 会先定位内容非常相似的全部文件，存储相同部分，之后计算差异并只存储差异。

- 举个例说，例如你修改了文件的一行，新增的一行所谓差异，单独存在包里。




Git 中文件可以分成三类：

- 已追踪的（Tracked）：是指已经在版本库中的文件，或者是已暂存到索引中的文件。如执行 `git add <filename>` 后添加的文件。
- 被忽略的（Ignored）：被明确指出忽略的文件。即 `.gitignore` 中指定的文件。
- 未追踪的（Untracked）：是指那些不在前两类的文件。





## .gitignore

文件格式：

- 以井号（`#`）开头的行用于注释。
- 其实的感叹号（`!`）会对该行的其余部分的模式进行取反。
- 目录名以反斜线（`/`）结尾。
- 字面文件名会匹配任何目录中的同名文件。
- 包含 shell 通配符，如星号（`*`）。


优先顺序（从高到低）：

- 在命令行上指定的模式；
- 当前目录的 `.gitignore` 文件中读取的模式；
- 上层目录中的模式（越远优先级越低）；
- 来自 `.git/info/exclude` 文件的模式；
- 来之配置变量 `core.excludefile` 指定的文件中的模式。



## 提交

在 Git 中，提交（commit）是用来记录版本库的变更的。

当提交时，Git 会记录索引的快照并把快照放进对象库。这个快照不包含该索引中任何文件或目录的副本，因为这样会需要巨大的存储空间。


引用（ref）是一个 SHA1 散列值，可以指向任意 Git 对象，但一般通常指向提交对象。符号引用（symbolic reference / symref）间接指向 Git 对象，但它仍然是一个引用。

**每个符号**引用都有一个以 `ref/` 开始的明确全称，并且都分层存储在版本库的 `./git/refs/` 目录中。有三种：

- `/refs/heads/ref` 代表本地分支；
- `/refs/remotes/ref` 代表远程分支；
- `/refs/tags/ref` 代表标签。


Git 自动维护几个特定目的的**特殊符号引用**，它们可以在使用提交的任何地方使用：（都可以通过 `git symbolic-ref` 进行管理）

- `HEAD`: 始终指向当前分支的最近一次提交。
- `ORIG_HEAD`: 某些操作，例如合并（merge）和复位（reset），会把调整为新值之前的先前版本的 `HEAD` 记录到 `ORIG_HEAD` 中。可以使用 `ORIG_HEAD` 回滚到之前的状态或仅仅做一个比较。
- `FEATCH_HEAD`: 最近抓取（fetch）的分支的 `HEAD`，并且尽在刚刚抓取操作后才有效。
- `MERGE_HEAD`: 当进行合并操作是，其他分支的 `HEAD` 就会记录到 `MERGE_HEAD` 中。


查找提交：（不太常用）

这功能一般用于寻找历史中某个“坏”的提交。Git 默认使用的是“二分法”。

- 运行 `git bisect start`；
- 然后运行 `git bisect bad <bad-commit-hash>?` 指定一个“坏”提交；
- 接着运行 `git bisect good <good-commit-hash>` 指定一个“好”提交；
- 当执行完上两步时，此时已经进入了二分模式；
  - 运行 `git branch` 可以看到 `(no branch, bisect started on ***)` ，表示当前不处于任何一个分支。
  - 因为 Git 会使用一个分离的 HEAD 来管理，这个分离的 HEAD 本质是一个匿名分支。
- 此时，我们的 HEAD 会落在“好”和“坏”提交的中间，你需要执行 `git bisect good` 或 `git bisect bad` 标记其好坏。
  - 如果你标记该提交为“好”的，Git 继续使用二分法，将 HEAD 定位到“好”和“坏”提交的中间；
  - 直到你指定某个提交为“坏”提交，或只剩下唯一一个“坏”提交时结束。

在查找期间：

- 运行 `git log --graph --all --oneline` 可以看到你标记的“好”或“坏”的提交。
- 如果想结束查找，运行 `git bisect reset` 可以退出此模式。


使用 `git -S<string>` 可以根据给定的 `<string>` 沿着文件的差异历史搜索。




## 分支

可以创建带层次的分支名，例如 `bug/pr-1024`，`feat/newPage` 。

查询分支也是可以指定“目录”的，如 `git show-branch bug/*` 。

分支命名规则：

- 不能以 `/` 结尾。
- 不能以 `-` 开头。
- 不能以 `.` 开头。
- 不能包含连续的两个点（`..`）。
- 不能包含任何空格或空白字符。
- 不能包含在 Git 中具有特殊意义的符号，包括 `~`、`^`、`:`、`?`、`*`、`[` 。
- 不能包含 ASCII 码控制字符。


创建分支使用 `git branch <branch-name> <starting-commit-hash>?`，其中 `<starting-commit-hash>` 默认是 `HEAD` 。

`git show-branch` 命令提供比 `git branch` 更详细的输出。和 `git branch` 一样，`-r` 显示远程追踪分支，`-a` 显示所有分支。

`git checkout -b <old-branch-name> --track <new-branch-name>` 可以重命名分支。




## 合并

当合并分支存在冲突时，Git 并不解决冲突，Git 只会把这种争议性的修改在索引中标记为“未合并”（unmerged），留给开发人员来处理。

如果已经修改了工作目录，或通过 `git add`/`git rm` 修改了索引，那么版本库就有了一个脏的工作目录或索引。如果在脏的状态下开始合并，Git 可能无法一次合并。如果*脏文件*与*合并操作所影响的文件*无关时，Git 能够进行合并。


`git merge` 的目标分支始终是当前分支。

如果处于未解决冲突的状态，使用 `git diff` ，第一行会以 `diff --cc` 开头，如下：

``` shell
$ git diff
diff --cc 1.txt
index 4911c7b,989d44e..0000000
--- a/1.txt
+++ b/1.txt
@@@ -1,2 -1,2 +1,6 @@@
  line_one
- master_change_line2
 -foo_change_line2
++<<<<<<< HEAD
++master_change_line2
++=======
++foo_change_line2
++>>>>>>> foo
```

当前内容会在 `<<<<<<<` 和 `=======` 之间；传入内容会在 `=======` 和 `>>>>>>>` 之间。

当处于为解决冲突的状态，目标分支的 `HEAD` 有特定的名字：`MERGE_HEAD`。


在未解决冲突的状态下，使用 `git log --merge --left-right -p`，可以帮助你找到冲突的原因：

- `--merge`: 只显示跟产生冲突的文件相关的提交。
- `--left-right`: 当前提交用 `<` 表示；传入提交用 `>` 表示。
- `-p`: 显示提交消息和每个提交相关的补丁。


中止或回到合并前：

- 合并有冲突，未提交解决冲突，运行 `git reset HEAD --hard` 还原到 `git merge` 命令之前。
- 合并无冲突，运行 `git reset "HEAD^" --hard` 或 `git reset ORIG_HEAD --hard` 还原到 `git merge` 命令之前。在 `cmd` 中 `"` 是必须的。



## 修改提交

使用 `git reset` 可以把版本库和工作目录改变到已知状态。但需要谨慎使用，因为可能会丢失数据。

`git reset` 的主要选项有三个：

- `--mixed`: 会将目标提交的内容都还原到*工作目录*，如果当前*工作目录*与目标提交的修改有冲突，以当前*工作目录*为准。这是默认值。
- `--soft`: 会将目标提交的内容都还原到*索引（暂存区）*，如果当前*索引*与目标提交的修改有冲突，以当前*索引*为准。
- `--hard`: 只会把 `HEAD` 指向目标提交，*工作目录*和*索引*都不会被影响。

如果想还原 `git reset`：

1. 使用 `git reflog` 查看 `HEAD` 的变更记录。一般会有如下类似的记录：
    - `efe4150 (HEAD) HEAD@{0}: reset: moving to HEAD~`
    - `efe4150` 就是变更前的 `HEAD` 。
2. 保证当前*工作目录*和*索引*都是干净的。
3. 使用 `git checkout <commit-hash>` 即可还原。



使用 `git cherry-pick` 可以把版本库中**一个分支的特定提交**引入到**另一个分支**中：

- `git cherry-pick <commit-hash>` 把单个提交拉到当前分支的头部；
- `git cherry-pick <commit-hash-1>..<commit-hash-n>` 可以把连续的提交拉到当前分支的头部。


使用 `git revert` 与 `git cherry-pick` 类似，但它的作用是消除某个提交的影响：

- 例如，有这么一条提交链 `A - B - C - D - E - F - G`，但发现 `D` 提交有问题，想要消除它对代码的影响。
- 可以运行 `git revert D` ，就等同于在当前分支增加一个“相反”的 `D` ，我们称它为 `D'` 。
- 整个提交链就变成了 `A - B - C - D - E - F - G - D'` 。
- 假如 `D` 的内容是添加了某个文件，那么 `D'` 的内容就是删除该文件。



使用 `git commit --amend` 可以对刚**提交的**信息修改。




## 变基

`git rebase` 命令是用来改变一串提交以什么为基础。

`git rebase` 命令也可以用 `--onto` 选项把一条分支上的开发线整个移植到**另一条分支**上。

使用变基命令，很大程度会有冲突：

- 因为 Git 是一个个提交移动，所以可能需要解决多个冲突。
- 当解决了一个提交的冲突，就可以使用 `git rebase --continue` 命令，继续变基下一个提交。
- 假如你觉得该冲突没必要在此提交中解决，可以使用 `git rebase --skip` 跳过冲突，留给下一个提交去解决。但这做法并不推荐。

若想中止变基，可以使用 `git rebase --abort` 命令，执行后会还原到变基前。

// TODO: 未验证：
`git rebase` 的 `-i`/`-interactive` 选项可以对提交进行**重新排序**、**编辑**、**删除**，把多个提交**合并成一个**，把一个提交**分离成多个**。


假如需要变基操作的分支还有子分支，这时候你要注意了，子分支或某些提交可能不会完全“跟过去”，例子如下：

- 假设有这么一个情况：

    ``` txt
    A---B---C---D             master
         \---X---Y---Z        dev
                  \---P---Q   dev2
    ```

- 我们想把 `dev` 分支从 `B` 变基到 `D`。我们可能会觉得，`dev2` 与 `dev` 的结构还是跟原来一样：

    ``` txt
    A---B---C---D                        master
                 \---X'---Y'---Z'        dev
                           \---P'---Q'   dev2
    ```

- 其实**上面**的想法**是错误的**。实际你得到的是下面的：

    ``` txt
         /---X---Y---P---Q          dev2
    A---B---C---D                   master
                 \---X'---Y'---Z'   dev
    ```

- 因为我们对 `dev` 变基，所以 `dev` 的表现是符合预期的。
- 但原本以 `Y` 提交上为基点的 `dev2` 分支并没有一起变基，它对于 `master` 的基点实际是 `B`，所以出现了 `---X---Y---P---Q`。

- TODO: 验证更复杂的情况，p166 变基带合并的




## 储藏

在开发过程中，经常会有这么一个情况：我专心的开发某项功能，可(ke)爱(wu)的领导突然说加急做另一个功能，但当前的开发已经进行了一半了，提交修改都不知道写什么信息。这时候就可以用“储藏”功能。

**储藏**可以捕获你的工作进度，允许你保存工作进度，并且当你方便时再回到该进度。该命令可以完全**还原工作目录和索引**。

需要注意，储藏是**纯本地**的概念，它不会提交到远程仓库。

储藏使用的命令是 `git stash save <msg>?`，其实 `save` 是默认值，可以忽略，`<msg>` 是可选参数，用于描述该工作状态。

相反的，想要**取出**储藏的内容，使用的命令是 `git stash pop`，意思是从**储存状态栈中**推出最新的：

- 这里涉及到“栈”的概念，就是说，Git 可以储存多个状态。
- 状态被推出栈，也就是它在栈中被删除。
- 如果不想把状态从栈中删除，可以使用 `git stash apply`。
- 如果只是想把状态从栈中删除，但不提取，可以使用 `git stash drop`。

使用 `git stash list` 命令可以查看储藏栈，顺序按保存时间由近及远：

- 结果示例 `stash@{0}: WIP on master: 8e00289 Revert "commit_msg....."`。
- 最新的编号必定是 `0`。
- 默认每个状态只有一行信息，带上 `-p` 参数可以获取到更详细的。

使用 `git stash show <stash_item>` 命令可以显示给定**存储条目**点对于它的**父提交的索引和文件**变更记录。



## 远程版本库

一个 Git 要么是一个**裸（bare）版本库**，要么是一个**开发（非裸）（development，nonbare）版本库**：

- **开发版本库**用于常规的日常开发。
- **裸版本库**没有工作目录，且不应该用于正常开发，可以简单地看做 `.git` 目录的内容。

如果 `git clone` 带有 **`--bare`** 选项，Git 就会创建一个**裸版本库**。

默认情况下，Git 在**开发版本库**中可以使用**引用日志（reflog）**，但在**裸版本库**中不行。

**裸版本库**中不能创建远程版本库，即，如果你要创建一个版本库供开发人员推送修改，那么它应该是裸版本库。

除了 `git clone` 之外，跟远程版本库有关的其他常见命令有：

- `git fetch`: 从远程版本库抓取对象及其相关元素据（但不合并到本地仓库）。下面简单介绍如何使用 `git fetch` 替代 `git pull`：
  - 使用 `git init` 初始化仓库。
  - 使用 `git remote add origin <远程仓库地址>` 关联远程仓库。如果已经关联，忽略这两步。
  - 使用 `git checkout -b <branch-name>` 创建本地分支，用于关联远程分支。
  - 使用 `git fetch origin? <远程分支名>?` 拉取特定分支的内容。`origin` 和 `<远程分支名>` 都是可选参数，默认拉取整个仓库。
  - 执行完上一步之后，远程分支的内容会存放在 `FETCH_HEAD` 中。
  - 使用 `git merge FETCH_HEAD` 会把内容合并当前分支。
- `git pull`: 与 `git fetch` 类似，且会合并到相应的本地分支。即 `git pull`=`git fetch`+`git merge`。
  - 使用 `git pull <远程主机名> <远程分支名>:<本地分支名>` 可以拉取特定的远程分支到本地，且重命名。
  - 使用 `git pull --rebase` 会将本地分支**变基**到远程分支，而非合并。
  - 使用 `-f` 选项可以**强制覆盖**远程分支的内容，但请**慎用**。
- `git push`: 将本地对象及其相关元数据推动到远程版本库。
- `git ls-remote`: 用列表显示所有的远程仓库分支。


运行 `git remote show origin` 命令获取关于 `origin` 远程版本库的所有信息。

运行 `git remote rm <name>` 命令会从本地版本库删除给定的远程版本库及其关联的远程追踪分支。

运行 `git branch -r -d origin/dev` 命令会从本地版本库删除一个远程追踪分支，但不建议这么做，除非远程仓库也删除了此分支，否则下次抓取的时候还是会把该分支拉下来。

运行 `git remote prune` 命令可以删除本地版本库中那些陈旧的（相对于远程版本库）远程追踪分支。

运行 `git remote rename <old-name> <new-name>` 可以重命名一个远程版本库及其所有引用。



关于推送到远程仓库：

- `git checkout -b foo` + `git push origin foo`: 远程仓库 `origin` 添加 `foo` 分支。
- `git push origin local_branch:origin_branch`: 将本地的 `local_branch` 分支推送到远程仓库 `origin` 的 `origin_branch` 中。
- `git push origin :origin_branch` / `git push origin --delete origin_branch`: 都是删除远程仓库 `origin` 的 `origin_branch`。
- 需要注意，没有办法重命名远程仓库的分支，只能先添加后删除。






## 补丁

为什么要使用补丁：

- 有些情况下，无论是推动还是拉取，Git 原生协议和 HTTP 协议都不能用来在版本库间交换数据。例如被防火墙拦截。
- 对等开发模型的一个巨大优势就是合作。补丁（尤其是发送到公共邮件列表中的补丁）是一种向同行评审（peer review）公开分发修改建议的手段。

首先需要生成补丁：

- 使用 `git format-patch` 命令会以邮件消息的形式生成一个补丁。
- 可以使用 `git format-patch master..master~4` 为 `master` 分支的前 4 个提交生成补丁，其他同理。
- 也可以使用 `git format-patch -4` 为当前分支的最近 4 次提交生成补丁，其他次数同理。
- 还可以使用 `git format-patch origin/master` 为 `origin/master` 的最近一次分支生成补丁。
- 生成完成后，会输出类似 `0001-D.patch` 的信息。

邮递补丁：

- 执行 `git send-email` 命令可以把补丁以邮件的形式发送给另一个开发者。
- 例如 `git send-email -to 123456@qq.com 0001-D.patch`。
- 但发送之前，需要配置 `sendemail.`，更多选项请查阅资料。（TODO: 我也没发送成功）

应用补丁：

- 使用的命令是 `git am`，其一部分是有底层命令 `git apply` 实现的。
- `git am` 会在当前分支上创建提交。
- 假设你已经把补丁下载到 `path/patches/0001-D.patch`，那么你可以运行 `git am path/patches/0001-D.patch` 来应用补丁。
- 假设你搞砸了，可以使用 `git am --abort` 恢复到应用补丁前。



## 钩子

任何时候，当版本库中出现如提交或补丁这样的特殊事件时，都会出发执行一个或多个任意的脚本。

钩子只属于并作用域一个特定的版本库，在克隆操作的时候不会复制。钩子集合都在 `.git/hooks` 目录下存放。

每个钩子都以它相关的事件来命名。例如，在 `git commit` 操作前执行的钩子成为 `./git/hooks/pre-commit`。

一个钩子既可以在当前本地版本库的上下文中运行，也可以在远程版本库的上下文中运行。

大多数 Git 钩子属于这两类：

- 前置（pre）钩子，会在动作完成前调用。例如，代码审核、代码格式化等。
- 后置（post）钩子，会在动作完成后调用。例如，触发通知、执行构建、关闭bug等。

使用 `git help hooks` 来查看在当前版本库的 Git 中可用的钩子。

前端主流的两大 Git 插件是 **`pre-commit`** 和 **`husky`**。




















