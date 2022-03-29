#!/usr/bin/env node

const hasbin = require("hasbin");
const child_process = require("child_process");
const fs = require("fs");
const path = require("path");

let mobileCheck = true
let androidCheck = mobileCheck && true

CheckExecs();

async function CheckExecs() {
    console.log("Checking for executables...");

    if (NotFound("node") || NotFound("npm")) {
        console.log("Install Node from https://nodejs.org/en/");
        console.log("If it's already installed, make sure it's in your PATH. See https://www.tutorialspoint.com/nodejs/nodejs_environment_setup.htm");
    } else {
        Exec(`npm version`).then(() => {
            console.log("✅ OK node and npm are installed.");
        }).catch(() => {
            console.log("❌ ERROR npm is present, but not working. Try running 'npm version' to see if it's working.");
        });
    }



    if (NotFound("git")) {
        console.log("Install git from https://git-scm.com/");
        console.log("If it's already installed, make sure it's in your PATH. See https://stackoverflow.com/questions/26620312/git-installing-git-in-path-with-github-client-for-windows");

    } else {
        Exec(`git --version`).then(() => {
            console.log("✅ OK git is installed.");
        }).catch(() => {
            console.log("❌ ERROR git is present, but not working. Try running 'git --version' to see if it's working.");
        });
    }

    if (NotFound("go")) {
        console.log("Install Go from https://go.dev/doc/install");
        console.log("If it's already installed, make sure it's in your PATH.");

    } else {
        Exec(`go version`).then(() => {
            console.log("✅ OK go is installed.");
        }).catch(() => {
            console.log("❌ ERROR go is present, but not working. Try running 'go version' to see if it's working.");
        });

        if (mobileCheck) {
            if (NotFound("gomobile")) {
                console.log("Trying to install gomobile...");

                Exec(`go install golang.org/x/mobile/cmd/gomobile@latest`).then(() => {
                    if (Found("gomobile")) {
                        Exec(`gomobile init`).then(() => {
                            console.log("✅ OK Installed gomobile.");
                        }).catch(() => {
                            console.log("❌ ERROR gomobile is present, but not working. Try running 'gomobile init' to see if it's working.");
                        });

                    } else {
                        console.log("❌ ERROR Go is installed, but go bin is not in your PATH. Please add it to your PATH. See https://stackoverflow.com/questions/42965673/cant-run-go-bin-in-terminal");
                    }
                });

            } else {
                console.log("✅ OK gomobile is installed.");
            }
        }
    }

    const howToSetEnvVars = `
            To learn how to set environment variables see,
                window: https://phoenixnap.com/kb/windows-set-environment-variable
                linux: https://linuxize.com/post/how-to-set-and-list-environment-variables-in-linux/
                mac: https://medium.com/@himanshuagarwal1395/setting-up-environment-variables-in-macos-sierra-f5978369b255
    `;

    if (androidCheck) {
        let ANDROID_HOME_info = process.env.ANDROID_HOME;

        if (!process.env.ANDROID_HOME) {
            console.log(`❌ ERROR ANDROID_HOME environment variable is not set.
            If you don't have an Android studio or SDK, you can download it from https://developer.android.com/studio
            If you have an Android SDK installed, please set the ANDROID_HOME environment variable to the path of your Android SDK.
            See https://developer.android.com/studio/command-line/variables

            ${howToSetEnvVars}`);

            ANDROID_HOME_info = "'ndk' folder in your android sdk folder."

        } else {

            // Check if directory exists
            if (fs.existsSync(process.env.ANDROID_HOME)) {
                console.log("✅ OK ANDROID_HOME is set : " + process.env.ANDROID_HOME);
            } else {
                console.log(`❌ ERROR ANDROID_HOME is set, but the directory does not exist. Please check the path '${process.env.ANDROID_HOME}' and try again.`);
            }

        }


        const ndkNotFoundWarning = `Android NDK (Native development kit) is different from Android SDK. It is used to build native code for Android.
                Spindly uses Android NDK version r19c for better compatibility with Gomobile.
                Download the NDK version r19c from https://github.com/android/ndk/wiki/Unsupported-Downloads#r19c and extract it to ${ANDROID_HOME_info}

                You can also install the NDK using Android Studio. But make sure that you are installing a version that's starting with '19.2'. See https://developer.android.com/studio/projects/install-ndk#specific-version

                If you have an Android NDK installed, please set the ANDROID_NDK_HOME environment variable to the path of your Android NDK, including the folder named after the version. Example : 'AndroidSDK/ndk/19.2.5345600/'

                ${howToSetEnvVars}`;

        if (!process.env.ANDROID_NDK_HOME) {
            console.log(`❌ ERROR ANDROID_NDK_HOME environment variable is not set. ${ndkNotFoundWarning}`);

        } else {
            // Check if directory exists
            let nkdCheckPath = path.join(process.env.ANDROID_NDK_HOME, `toolchains/llvm/prebuilt/`)
            if (fs.existsSync(nkdCheckPath)) {
                console.log("✅ OK ANDROID_NDK_HOME is set : " + process.env.ANDROID_NDK_HOME);

            } else {
                console.log(`❌ ERROR ANDROID_NDK_HOME is set, but the directory does not contain necessary files. Please check the path '${process.env.ANDROID_NDK_HOME}' and try again.
                
                This directory should exist : ${nkdCheckPath}
                Check the path and try again.

                ${ndkNotFoundWarning}`);
            }
        }
    }

}

function Found(name) {
    return hasbin.sync(name);
}

function NotFound(name) {
    let found = Found(name)
    if (!found) {
        console.log(`Executable '${name}' not found.`);
    }
    return !found;
}


function Exec(file, envVars) {
    var exec = child_process.exec;

    return new Promise((resolve, reject) => {
        exec(file, { env: { ...process.env, ...envVars } }, function execcallback(error, stdout, stderr) {
            if (stdout) console.log(file + ': ' + stdout);
            if (stderr) console.log(file + ': Erro : ' + stderr);
            if (error) { console.error(error); reject(error); }

            resolve();
        });
    });

}
