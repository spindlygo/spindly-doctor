# spindly-doctor
Check whether the tools needed for development with Spindly are correctly installed

# Usage

- Install NodeJS and NPM
- To check all tools needed for desktop and mobile development, run `npx spindly-doctor`
- To check only the tools needed for desktop development, run `npx spindly-doctor desktop`
- To check only the tools needed for mobile development, run `npx spindly-doctor mobile`
- To check only the tools needed for android development, run `npx spindly-doctor android`

If all tools are installed and configured correctly, `npx spindly-doctor` will output a report similar to this :

```
Checking for executables...
✅ OK gomobile is installed.
✅ OK ANDROID_HOME is set : /home/USERNAME/AndroidSDK
✅ OK ANDROID_NDK_HOME is set : /home/USERNAME/AndroidSDK/ndk/23.1.7779620/
git --version: git version 2.35.1

✅ OK git is installed.
node --version: v17.7.1

✅ OK node and npm are installed.
go version: go version go1.17.8 linux/amd64

✅ OK go is installed.
6/6 tasks completed.



✅ All tasks completed.

📝 Report : 
{
  gomobile: true,
  androidHome: true,
  androidNDKHome: true,
  git: true,
  node: true,
  go: true
}
```

If there's any errors, spindly-doctor will guide you to resolve them.
