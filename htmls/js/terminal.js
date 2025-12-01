
const out = document.getElementById("shell");
const mode = document.getElementById("mode");
const textFrom = document.getElementById("command");
const sleep = (time) => new Promise((resolve) => setTimeout(resolve, time));//timeはミリ秒
let shutdown = false;
let defaultmode = true;
let isDirectory;
let directories;
let copytext;
let vicmdend;
let delrow;
let path;
let viend;
let number = [];
let idx = 0;
let curtLines;
let filedata;
let currentDir;
let vicount;
let year;
let month;
//directory Set
let CommandHistory = [];
let curtDir = "/user/";
let savefiles = `
{
  "user": {
    "memo.txt": "メモ\\nこれはメモ!",
    "hello.sh": "ehco'hello'",
    "directory": {
      "hello.js": "console.log('hello')"
    }
  }
}
            `;
savefiles = JSON.parse(savefiles);
let Keys = [curtDir.replace(/\//g, '')]
let i = 0;

document.addEventListener('DOMContentLoaded', function () {
    const power = document.getElementById("powerButton");
    if (power) {
        power.addEventListener('click', function () {
            shutdown = false;
            defaultmode = true;
            curtDir = "/user/";
            out.textContent = ""
        });
    }
});
if (shutdown) {
    defaultmode = false
} else {
    defaultmode = true
}
if (defaultmode) {
    // コマンド入力欄のEnterキーで実行
    textFrom.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            terminal();
            //コマンド履歴を呼び出す
        } else if (event.key === "ArrowUp" && viend === true) {
            event.preventDefault();
            textFrom.value = CommandHistory;
        }
    });
}




//\\
// コマンド実行関数 \\
//\\
function runcommand(inputCommand) {
    if (shutdown === false) {
        //ディレクトリとコマンドを分ける処理
        const result = inputCommand.split(" ");
        console.log(result);
        const command = result[0];
        switch (command) {
            case "ls":
                console.log(savefiles)
                path = Path();
                let dcy = Object.keys(getProperty(savefiles, path));
                dcy = dcy.join("\n");
                console.log(dcy);
                out.textContent += dcy + "\n\n";
                break;
            case "pwd":
                out.textContent += "C:" + curtDir + "\n";
                break;
            case "date":
                out.textContent += new Date().toLocaleString() + "\n";
                break;
            case "cal":
                if (result.length === 3) {
                    year = result[1];
                    month = result[2];
                    cal(year, month)
                } else if (result.length === 1) {
                    cal(null, null)
                }
                function cal(year, month) {
                    const today = month === null ? new Date() : new Date(year, month);
                    console.log(today)
                    let day = new Date(today.getFullYear(), today.getMonth(), 1);
                    let data = [];
                    for (let i = 1; i <= day.getDay(); i++) {
                        data.push(" ");
                    }
                    while (day.getMonth() === today.getMonth()) {
                        if (String(day.getDate()).length === 1) {
                            data.push(" " + String(day.getDate()));
                        } else {
                            data.push(day.getDate());
                        }
                        day = new Date(day.getFullYear(), day.getMonth(), day.getDate() + 1);
                    }
                    console.log(data)
                    data = data.map((item) => {
                        return item.length === 1 ? "  " : item;
                    });
                    console.log(data)

                    const resultDay = [];
                    for (i = 0; i < data.length; i += 7) {
                        resultDay.push(data.slice(i, i + 7));
                    }
                    data = resultDay.map(group => group.join(" "));
                    console.log(data)
                    out.textContent += "Su Mo Tu We Th Fr Sa\n" + data.join("\n") + "\n\n";

                }

                break;
            case "cd":
                isDirectory = false;
                //..のチェック
                if (result[1] == "..") {
                    Keys = curtDir.slice(1);
                    Keys = Keys.slice(0, -1);
                    Keys = Keys.split("/")
                    if (Keys.length != 1) {
                        Keys.pop();
                        Keys.join("/");
                        Keys = "/" + Keys;
                        Keys = Keys + "/";
                        curtDir = Keys;
                        out.textContent += "移動できました。\n\n";
                    } else {
                        out.textContent += "ここがホームディレクトリです。これ以上親ディレクトリはありません。"
                    }
                } else {
                    //指定されたディレクトリがあるか確認する。
                    Keys = curtDir.slice(1);
                    Keys = Keys.slice(0, -1);
                    Keys = Keys.split("/")
                    let directories = Object.values(getProperty(savefiles, Keys));
                    number = [];
                    for (i; i < directories.length; i++) {
                        if (typeof directories[i] === "object" && directories[i] !== null) {
                            number.push(i);
                        }
                    }
                    directories = Object.keys(getProperty(savefiles, Keys));
                    for (i = 0; i < number.length; i++) {
                        if (directories[number[i]] === result[1]) {
                            console.log(curtDir)
                            curtDir += result[1] + "/";
                            console.log(curtDir)
                            console.log(curtDir + result[1])
                            isDirectory = true;
                            break;
                        }
                    }

                    if (isDirectory) {
                        out.textContent += "\n移動できましした。\n\n";
                    } else {
                        out.textContent += "\n" + result[1] + "が見つかりません\n\n";
                    }

                }
                break;
            case "echo":
                out.textContent += result[1]
                break;
            case "rm":
                path = Path();
                directories = Object.values(getProperty(savefiles, path));
                console.log(directories)
                for (i = 0; i < directories.length; i++) {
                    if (typeof directories[i] === "object" && directories[i] !== null) {
                        number.push(i);
                    }
                }
                console.log(number)
                directories = Object.keys(getProperty(savefiles, path))
                console.log(directories)
                for (i = 0; i < number.length; i++) {
                    if (directories[i] === result[1] && i != number) {
                        delObject(savefiles, path.concat(result[1]));
                        out.textContent += result[1] + "を削除しました\n\n"
                        break;
                    } else if (i === number.length-1) {
                        out.textContent += result[1] + "が見つかりませんでした\n\n"
                    }
                }
                break;
            case "rmdir":
                path = Path();
                // ディレクトリが存在するか確認
                if (Object.keys(getProperty(savefiles, path)).includes(result[1]) && typeof getProperty(savefiles, path.concat(result[1])) == "object") {
                    delObject(savefiles, path.concat(result[1]));
                    out.textContent += result[1] + "を削除しました\n\n";
                } else {
                    out.textContent += result[1] + "が見つかりませんでした\n\n";
                }
                break;
            case "mkdir":
                path = Path();
                currentDir = getProperty(savefiles, path);
                if (!Object.keys(currentDir).includes(result[1])) {
                    currentDir[result[1]] = {}; // ディレクトリを追加
                    out.textContent += result[1] + "を作成しました\n\n";
                } else {
                    out.textContent += result[1] + "は既にあります\n\n";
                }
                break;
            case "mv":
                path = Path();
                currentDir = getProperty(savefiles, path);
                path = path.slice();
                let destName = result[2];

                if (result[2] === ".." || result[2] === "../") {
                    // 親ディレクトリに移動
                    path.pop();
                    destName = result[1];
                } else if (result[2].startsWith("../")) {
                    // ../の場合
                    path.pop();
                    destName = result[2].replace("../", "");//置き換え
                }
                if (currentDir && currentDir.hasOwnProperty(result[1])) {
                    let fileContent = currentDir[result[1]];
                    delObject(savefiles, path.concat(result[1]));//パスと入力されたファイルを結合&削除
                    setProperty(savefiles, path.concat(destName).concat(result[1]), fileContent);//パスと入力されたファイルを結合&削除
                    out.textContent += result[1] + "を" + destName + "に移動しました\n\n";
                } else {
                    out.textContent += result[1] + "は見つかりませんでした\n\n";
                }
                break;
            case "screenfetch":
                //OSの判定
                let os;
                const userAgent = navigator.userAgent;
                console.log(userAgent.includes("Windows"));
                if (userAgent.includes("Windows")) {
                    os = "Windows";
                } else if (userAgent.includes("Mac")) {
                    os = "Mac";
                } else if (userAgent.includes("iPhone")) {
                    os = "iPhone";
                } else if (userAgent.includes("iPad")) {
                    os = "iPad"
                } else if (userAgent.includes("Linux")) {
                    if (userAgent.includes("Debian")) {
                        os = "Debian Linux";
                    } else if (userAgent.includes("MX")) {
                        os = "MX Linux";
                    } else if (userAgent.includes("Kali")) {
                        os = "Kali Linux";
                    } else if (userAgent.includes("Ubuntu")) {
                        os = "Ubuntu Linux";
                    } else if (userAgent.includes("Mint")) {
                        os = "Linux Mint";
                    } else if (userAgent.includes("Redhat")) {
                        os = "Redhat";
                    } else if (userAgent.includes("Cent")) {
                        os = "CentOS";
                    } else if (userAgent.includes("Rocky")) {
                        os = "Rocky Linux";
                    } else if (userAgent.includes("Alama")) {
                        os = "Alama Linux";
                    } else if (userAgent.includes("Arch")) {
                        os = "Arch Linux";
                    } else if (userAgent.includes("Manjaro")) {
                        os = "Manjaro";
                    } else if (userAgent.includes("Black")) {
                        os = "Black Arch Linux";
                    } else if (userAgent.includes("Steam")) {
                        os = "Steam OS";
                    } else if (userAgent.includes("CrOS")) {
                        os = "Chrome OS";
                    } else if (userAgent.includes("Android")) {
                        os = "Android";
                    }
                } else if (userAgent.includes("BSD")) {
                    if (userAgent.includes("FreeBSD")) {
                        os = "FreeBSD";
                    } else if (userAgent.includes("OpenBSD")) {
                        os = "openBSD";
                    } else if (userAgent.includes("NetBSD")) {
                        os = "NetBSD";
                    }
                }
                const lang = window.navigator.language;
                const cpuCore = navigator.hardwareConcurrency;
                const windowsize = window.screen.width + "×" + window.screen.height;
                const logo = `
                                                |
                    jjj            sssss        | Shell           : JTE
                                sss     ssss    |
                    jjj        sss              | Language        : ${lang}
                    jjj         sss             |
                    jjj             sssss       | HostOS          : ${os} 
                    jjj                  sss    |
                    jjj                   sss   | Window Size     : ${windowsize}
                    jjj         ssss     sss    |
                    jjj             sssss       | CPU Logic Core  : ${cpuCore} 
                   jjj                          |
                jjjj                            | Creator         : Haruki
                                                |
`;
                out.textContent += logo;
                break;
            case "vi":
                path = Path();
                path.push(result[1]);
                defaultmode = false;
                curtLines = 0;
                console.log(path)
                console.log()
                if (getProperty(savefiles, path) === undefined) {
                    setProperty(savefiles, path, " ")
                    console.log(savefiles);
                }
                filedata = getProperty(savefiles, path).split("\n");
                shutdown = true;
                vicmdend = true;
                vicount = 0;
                viend = false;
                textFrom.value = filedata[curtLines];
                (async () => {
                    while (!viend) {
                        if (vicmdend) {
                            textFrom.value = filedata[curtLines];
                        }
                        await keydownWait();
                        vicount++;
                        console.log(String(vicount))
                        const operation = () => {
                            switch (event.key) {
                                case "ArrowUp":
                                    if (curtLines > 0) {
                                        curtLines -= 1;
                                        textFrom.value = filedata[curtLines];
                                    }
                                    break;
                                case "ArrowDown":
                                    if (curtLines + 1 != filedata.length) {
                                        curtLines += 1;
                                        textFrom.value = filedata[curtLines];
                                    }
                                    break;
                                case "Enter":
                                    //二つに分ける
                                    if (textFrom.selectionStart != textFrom.value.length) {
                                        const header = textFrom.value.slice(0, textFrom.selectionStart);
                                        const footer = textFrom.value.slice(textFrom.selectionStart);
                                        //今の行に残す文字を次の行に改行する文字を追加
                                        filedata[curtLines] = header;
                                        filedata.splice(curtLines + 1, 0, footer);
                                        curtLines += 1;
                                        textFrom.value = footer;
                                        textFrom.focus();
                                        textFrom.setSelectionRange(textFrom.value, textFrom.value);
                                    } else {
                                        const header = textFrom.value.slice(0, textFrom.selectionStart);
                                        const footer = " "
                                        //今の行に残す文字を次の行に改行する文字を追加
                                        filedata[curtLines] = header;
                                        filedata.splice(curtLines + 1, 0, footer);
                                        curtLines += 1;
                                        textFrom.value = footer;
                                        textFrom.focus();
                                        textFrom.setSelectionRange(0, 0);
                                    }
                                    break;
                                case "Backspace":
                                    if (textFrom.selectionStart === 0 && curtLines > 0) {
                                        const header = filedata[curtLines - 1];
                                        const footer = filedata[curtLines];
                                        filedata[curtLines - 1] = header + footer;
                                        filedata.splice(curtLines, 1);
                                        curtLines--;
                                        setTimeout(() => {
                                            textFrom.value = filedata[curtLines];
                                            textFrom.focus();
                                            textFrom.setSelectionRange(header.length, header.length);
                                        }, 1);
                                        console.log(textFrom.value)
                                    } else if (textFrom.selectionStart === 0 && filedata.length != 1) {
                                        filedata[curtLines] = filedata.slice(curtLines, 2).join("");
                                        if (filedata[curtLines] === null) {
                                            filedata[curtLines] = filedata.slice(curtLines, 1)
                                        }
                                        console.log(filedata[curtLines])
                                        filedata.splice(curtLines, 1)
                                        textFrom.value = filedata[curtLines]
                                    }

                                    break;
                                case "Escape":
                                    textFrom.value = "";
                                    vicmdend = false;
                                    mode.textContent = "Command Mode";
                                    function vicmd() {
                                        console.log("cmd")
                                        switch (textFrom.value) {
                                            case "i":
                                                textFrom.value = filedata[curtLines];
                                                mode.textContent = "---INSERT---"
                                                vicmdend = true;
                                                clearInterval(vicmd);
                                                break;
                                            case "yy":
                                                textFrom.value = "";
                                                copytext = filedata[curtLines];
                                                break;
                                            case "p":
                                                textFrom.value = "";
                                                curtLines += 1;
                                                //今の行に残す文字を次の行に改行する文字を追加
                                                filedata.splice(curtLines, 0, copytext);
                                                out.textContent = filedata.join("\n");
                                                break;
                                            case "dd":
                                                textFrom.value = "";
                                                filedata.splice(curtLines, 1,);
                                                filedata = filedata.join("\n");
                                                out.textContent = filedata;
                                                const count = (filedata.match(/\n/g) || []).length;
                                                for (i = 0; i < 23 - count; i++) {
                                                    if (i === 0) {
                                                        out.textContent += "\n~\n"
                                                    } else if (i != 23) {
                                                        out.textContent += "~\n"
                                                    } else {
                                                        out.textContent += "~"
                                                    }
                                                }
                                                filedata = filedata.split("\n");
                                                console.log((curtLines + 1) * 20)
                                                out.scrollTop = (curtLines + 1) * 20;
                                                break;
                                            case "gg":
                                                textFrom.value = "";
                                                curtLines = 0;
                                                break;
                                            case "G":
                                                textFrom.value = "";
                                                curtLines = filedata.length - 1;
                                                break;
                                            case "ZZ":
                                                textFrom.value = "";
                                                if (getProperty(savefiles, path) != filedata.join("\n")) {
                                                    setProperty(savefiles, path, filedata.join("\n"));
                                                }
                                                console.log(getProperty(savefiles, path))
                                                out.textContent = ""
                                                mode.textContent = ""
                                                viend = true;
                                                vicmdend = true;
                                                clearInterval(vicmd);
                                                break;
                                        }
                                        const excmd = () => {
                                            if (event.key === "Enter") {
                                                switch (textFrom.value) {
                                                    case ":q!":
                                                    case ":q":
                                                        textFrom.value = "";
                                                        out.textContent = ""
                                                        mode.textContent = ""
                                                        viend = true;
                                                        vicmdend = true;
                                                        clearInterval(vicmd);
                                                        break;
                                                    case ":wq":
                                                        textFrom.value = "";
                                                        setProperty(savefiles, path, filedata.join("\n"));
                                                        out.textContent = ""
                                                        mode.textContent = ""
                                                        viend = true;
                                                        vicmdend = true;
                                                        clearInterval(vicmd);
                                                        break;
                                                    case ":w":
                                                        textFrom.value = "";
                                                        setProperty(savefiles, path, filedata.join("\n"));
                                                        clearInterval(vicmd);
                                                        break;
                                                    case ":num":
                                                        textFrom.value = "";
                                                        mode.textContent = curtLines + 1 + "行目";
                                                        break;
                                                    default:
                                                        break;

                                                }
                                                console.log(event.key)
                                                textFrom.removeEventListener("keydown", excmd)
                                            }
                                        }
                                        textFrom.addEventListener("keydown", excmd)

                                        if (!vicmdend) {
                                            setTimeout(vicmd, 100);
                                        }
                                    }
                                    vicmd()
                                    break;
                            }

                            textFrom.removeEventListener("keydown", operation)
                        }
                        if (vicmdend) {
                            textFrom.addEventListener("keydown", operation);
                        }
                        //キーが押されてtextFromの内容が変化するのに合間があるのでsettimeoutを使う.
                        //描画処理
                        if (!viend) {
                            setTimeout(() => {
                                if (vicmdend) {
                                    mode.textContent = "---INSERT---";
                                    if (delrow) {
                                        text.split("\n")[curtLines] = textFrom.value
                                    } else if (vicount != 1) {
                                        filedata[curtLines] = textFrom.value;
                                    }
                                }//24行
                                filedata = filedata.join("\n");
                                out.textContent = filedata;

                                const count = (filedata.match(/\n/g) || []).length;
                                for (i = 0; i < 23 - count; i++) {
                                    if (i === 0) {
                                        out.textContent += "\n~\n"
                                    } else if (i != 23) {
                                        out.textContent += "~\n"
                                    } else {
                                        out.textContent += "~"
                                    }
                                }
                                filedata = filedata.split("\n");
                                out.scrollTop = (curtLines + 1) * 20;
                            }, 1);
                        }
                    }
                    shutdown = false;
                    defaultmode = true;
                    out.textContent = ""
                    return;
                })();

                break;
            case "cat":
                path = Path();
                currentDir = getProperty(savefiles, path);
                if (currentDir && currentDir.hasOwnProperty(result[1])) {
                    out.textContent += currentDir[result[1]] + "\n\n";
                } else {
                    out.textContent += result[1] + "は見つかりませんでした\n\n";
                }
                break;
            case "help":
                out.textContent += `
        ☆ls                                    今いるディレクトリのファイルを表示
        

        ☆cd ディレクトリ名                      ディレクトリに移動する
      
      
        ☆pwd                                   今いるディレクトリのパスを表示
      
      
        ☆date                                  現在の日時を表示
      
      
        ☆echo "メッセージ"                      メッセージを表示
      
      
        ☆cat ファイル名                         ファイルの内容を表示
        

        ☆rm ファイル名                          ファイルを削除
        

        ☆mkdir ディレクトリ名                   ディレクトリを作成
        

        ☆rmdir ディレクトリ名                   ディレクトリを削除
      
        
        ☆mv 元ファイル名 移動先ファイル名        ファイルを移動
        
        
        ☆vi ファイル名                         ファイルを移動      i yy p dd gg G ZZ :q :wq :w :numに対応


        ☆shutdown                              シャットダウン

                    `;
                break;
            case "poweroff":
            case "shutdown":
                const doshutdown = prompt("本当にシャットダウンしますか？ \n 「はい」なら「y」\n「いいえ」 なら 「n」");
                if (doshutdown === "y") {
                    out.textContent += "また遊んでくださいね\n\nシャットダウン中";
                    out.textContent += "[=";
                    function ramdom(x) {
                        return (Math.round(Math.random() * x));
                    }
                    (async () => {
                        for (i = 0; i < 35; i++) {

                            await sleep(ramdom(4) * 100);
                            out.textContent += "=";

                        }
                        out.textContent += "]"
                        await sleep(1000);
                        out.textContent = ""
                        await sleep(1000);
                        out.textContent = "shutdown"
                        shutdown = true;
                    })();
                }
                break;
            default:
                out.textContent += "[Error] コマンドが見つかりません: " + command + "\n\n何かわからないことがありますか？\n help コマンドを使うとコマンドと使い方の一覧が表示されます。\n\n";
        }
        out.scrollTop = out.scrollHeight;
    }
}
//ターミナル表示関数
function terminal() {
    if (shutdown === false) {
        const inputText = document.getElementById("command").value;
        out.textContent += ">>" + inputText + "\n";
        runcommand(inputText);
        textFrom.value = "";
    }
}