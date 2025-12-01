const inputText = document.getElementById('inp');
const Btn = document.getElementById('btn');
//生成関数
function qrcode() {
    document.getElementById('QR').textContent = '';
    const qrcode = new QRCode('QR', {
        text: inputText.value,
        width: 500,
        height: 500,
        correctLevel: QRCode.CorrectLevel.H
    });
}
function download() {
    qrcode();
    //HTMLにあるすべてのimgをdownloadほかにimgはないしobjectで表示すればokだから
    const imgs = document.querySelectorAll('img');
    if (imgs.length === 0) {
        alert('QRcodeが生成されていません');
        return;
    }
    imgs.forEach((img) => {
        const link = document.createElement('a');
        link.href = img.src;
        link.download = `qr-code.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
}
