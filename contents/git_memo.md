---
date: '2024-02-02'
title: '자주쓰는 Git 명령어 정리'
categories: ['Tip']
summary: '평소 vscode에서 Gui로 많이 쓰던 Git 기능을 실제 명령어로 정리해 봅니다'
thumbnail: './common/git.jpg'
---
## vscode의 git source control
vscode에는 git 명령어를 간편히 GUI로 사용할 수 있는 source control 확장이 따로 설치되어 있습니다. 필자도 해당 기능을 자주 사용하다 보니 어느순간부터 git 명령어는 거의 사용하지 않게 되었습니다. 그러나 항상 vscode를 사용할수는 없고, 복습도 할겸 자주 쓰는 명령어를 정리해보았습니다.

### add 와 commit
```bash
# 변화 사항을 스테이징
git add .\k8s\dev-room-k8s\Chart.yaml

# 스테이징된 것들을 커밋
git commit -m ":sparkles: chart 매니페스트 파일 추가"

git log

  commit 26a644106f3f09fdfa098e554cc8cc0ea63c7f01 (HEAD -> feature/k8s-boilerplate)
  Author: Yanghyeondong <hdyang0686@naver.com>
  Date:   Tue Jan 30 16:28:48 2024 +0900

      :sparkles: chart 매니페스트 파일 추가

  commit c13d28b166ea025e7056fa2077a599241b1fc313
  Author: Yanghyeondong <hdyang0686@naver.com>
  Date:   Tue Jan 30 16:14:59 2024 +0900
  #q 입력으로 종료
```

### revert 와 reset
```bash
# commit-hash는 앞자리 7자리 정도 활용
# revert는 revert 자체 기록도 남는다
git revert 26a644

# reset은 기록을 남기지 않고 이전으로 되돌린다
# --hard의 경우 디렉토리, 스테이징 영역의 변경을 모두 지운다
# --mixed의 경우 스테이징 영역의 변경을 제거하고 디렉토리의 변경은 유지한 채로 브랜치를 이동한다.
# --soft의 경우 스테이징 영역도 남아있다.
git reset --hard 26a644
  HEAD is now at 26a6441 :sparkles: chart 매니페스트 파일 추가
```

### branch 와 checkout, status
```bash
# 모든 브랜치 확인. remote는 원격 저장소이다.
# 단, remote brach도 매번 원격 저장소를 반영하지는 않다. 따라서 git fetch가 필요하다.
git branch -a
  develop
* feature/k8s-boilerplate
  main
  remotes/origin/HEAD -> origin/main
  remotes/origin/develop
  remotes/origin/feature/k8s-boilerplate
  remotes/origin/main

# 원하는 브랜치로 변경. origin과 비교해준다
git checkout develop
  Switched to branch 'develop'
  Your branch is behind 'origin/develop' by 6 commits, and can be fast-forwarded.
    (use "git pull" to update your local branch)

# 현재 상태 확인. origin과 비교해준다
git status
  On branch develop
  Your branch is behind 'origin/develop' by 6 commits, and can be fast-forwarded.
    (use "git pull" to update your local branch)

# 리모트 브랜치로 checkout 할 경우 detached HEAD 가 된다.
git checkout remotes/origin/develop
  Note: switching to 'remotes/origin/develop'.

  You are in 'detached HEAD' state. You can look around, make experimental
  changes and commit them, and you can discard any commits you make in this
  state without impacting any branches by switching back to a branch.
```

### fetch와 merge, rebase
```bash
# remote 브랜치를 원격 저장소의 최신 정보로 업데이트
git fetch

# 사라진 브랜치를 반영할 경우
git fetch --prune

# merge를 하고자 하는 브랜치로 이동
git checkout feature/k8s-boilerplate

# 대상이 되는 브랜치로 merge. 위의 일련의 과정은 git pull과 동일
git merge remotes/origin/feature/k8s-boilerplate

# rebase를 하고자 하는 브랜치로 이동
git checkout feature/k8s-boilerplate

# 대상이 되는 브랜치로 rebase
git rebase remotes/origin/develop
  Auto-merging k8s/README.md
  CONFLICT (content): Merge conflict in k8s/README.md
  error: could not apply 2141f7c... 📝 readme 생성
  hint: Resolve all conflicts manually, mark them as resolved with
  hint: "git add/rm <conflicted_files>", then run "git rebase --continue".
  hint: You can instead skip this commit: run "git rebase --skip".
  hint: To abort and get back to the state before "git rebase", run "git rebase --abort".
  Could not apply 2141f7c... 📝 readme 생성

# 충돌 발생시 해결
```