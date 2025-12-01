// script.js
const markdownInput = document.getElementById('markdown-input');
const htmlPreview = document.getElementById('html-preview');
const downloadBtn = document.getElementById('download-btn');
const converter = new showdown.Converter();
document.addEventListener('DOMContentLoaded', () => {
    //変換関数
    function convertMarkdownToHtml(markdown) {
        return converter.makeHtml(markdown);
    }
    // プレビューを更新する処理
    function updatePreview() {
        const markdown = markdownInput.value;
        const html = convertMarkdownToHtml(markdown);

        htmlPreview.textContent = html;
        return html;
    }
    // 入力エリアでの変更を監視
    markdownInput.addEventListener('input', updatePreview);
    // 初期表示時のプレビュー更新
    updatePreview();

});
//コピー関数
function textcopy() {
    navigator.clipboard.writeText(htmlPreview.textContent);
}
function download() {
    const txt = htmlPreview.textContent;
    if (!txt) { return; }
    // 文字列をバイナリ化
    const blob = new Blob([txt], { type: 'text/plain' });
    // ダウンロード用のaタグ生成
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'text.html';
    a.click();
}
