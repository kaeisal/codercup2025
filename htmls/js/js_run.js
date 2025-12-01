function runCode() {
    const output = document.getElementById("console");
    //ログを記録
    const memoryLog = console.log;
    let consoleMemory = []
    console.log = function (...args) { consoleMemory += args + "\n"; console.info(args); };
    console.error = function (...args) { consoleMemory += "**[Error]**  " + args + "\n"; console.info(args); };

    try {
        let code = document.getElementById("codeInput").value;
        eval(code);
    } catch (e) {
        //エラーが発生した場合
        output.textContent += "**[Error]**  " + e + "\n";
    }
    //ログを出力しログの一番下までスクロールする。
    output.textContent += "\n" + consoleMemory
    output.scrollTop = output.scrollHeight;
}