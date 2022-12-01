#1 clone the repo

```
git clone https://github.com/524c/houdini-issue-twoOperations
```

then

```
# compile houdini package
cd houdini-issue-twoOperations/packages/houdini
git submodule update --init --recursive && git checkout main
pnpm i && pnpm build

# compile issue-repro apps
cd ../..
pnpm i
pnpm dev
```

check there

http://localhost:3000/twoOperations
