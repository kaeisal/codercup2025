TLN.append_line_numbers("textarea");
const Textarea = document.getElementById("textarea");
window.addEventListener('keydown', function (e) {
    if ((e.ctrlKey || e.key === 'Meta') && e.key == 'n') {
        newfile();
    } else if ((e.ctrlKey || e.key === 'Meta') && e.key == 'o') {
        e.preventDefault();
        openfile();
    } else if ((e.ctrlKey || e.key === 'Meta') && e.key == 's') {
        e.preventDefault();
        savefile();
    } else if ((e.ctrlKey || e.key === 'Meta') && e.key == 'd') {
        e.preventDefault();
        downloadfile();
    } else if ((e.ctrlKey || e.key === 'Meta') && e.key == 'p') {
        e.preventDefault();
        openlocalfile();
    }else if(e.key == 'Tab'){
        e.preventDefault();
        Textarea.value += "    ";
    }
});
function newfile() {
    console.log("ok");
    const save = window.confirm("終了する前に保存しますか？");
    if (save) {
        const method = window.confirm(
            "ダウンロードするならOKをツールに保存するならキャンセルを押してください"
        );
        const filename = prompt(
            "ファイル名を入力してください(txtファイルとして保存します)"
        );
        if (method) {
            const a = document.createElement("a");
            a.href = "data:text/plain," + encodeURIComponent(Textarea.value);
            a.download = filename + ".txt";
            a.click();
        } else {
            if (!window.localStorage) {
                alert(
                    "ローカルストレージが利用できない環境のため保存に失敗しました"
                );
            } else {
                window.localStorage.setItem("file", Textarea.value);
            }
        }
    }
}
function openfile() {
    const data = localStorage.getItem("file");
    Textarea.value = data;
}
function savefile() {
    localStorage.clear();
    window.localStorage.setItem("file", Textarea.value);
}
function downloadfile() {
    const filename = prompt(
        "ファイル名を入力してください(txtファイルとして保存します)"
    );
    const a = document.createElement("a");
    a.href = "data:text/plain," + encodeURIComponent(Textarea.value);
    a.download = filename + ".txt";
    a.click();
}
function openlocalfile() {
    const showOpenFileDialog = () => new Promise(resolve => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'text/plain';
        input.onchange = () => { resolve(input.files); };
        input.click();
    });

    (async () => {

        const files = await showOpenFileDialog();

        const content = await files[0].text();
        console.log(content);
        Textarea.value = content;
    })();
}
const DDB1 = document.getElementById("btn");
const DDM1 = document.getElementById("dropdown");
const DDB2 = document.getElementById("btn-2");
const DDM2 = document.getElementById("dropdown-2");
const DDB3 = document.getElementById("btn-3");
const DDM3 = document.getElementById("dropdown-3");
function ddmenu(ddb, ddm) {
    // ドロップダウン機能の切り替え
    const toggleDropdown = function () {
        ddm.classList.toggle("show");
    };

    // ドロップダウンボタンがクリックされた際に、ドロップダウンの開閉を切り替える
    ddb.addEventListener("click", function (e) {
        e.stopPropagation();

        if (ddm === DDM1) {
            DDM2.classList.remove("show");
        } else if (ddm === DDB2) {
            DDM1.classList.remove("show");
        } else {
            DDM1.classList.remove("show");
            DDM2.classList.remove("show");
        }
        toggleDropdown();
    });

    // DOM要素がクリックされた際にドロップダウンを閉じる
    document.documentElement.addEventListener("click", function () {
        if (ddm.classList.contains("show")) {
            toggleDropdown();
        }
    });
}
ddmenu(DDB1, DDM1);
ddmenu(DDB2, DDM2);