// 反映
function updatePreview(editorHTML, editorCSS, editorJS, previewId) {
	const preview = document.getElementById(previewId);
	if (!preview) return;

	// HTMLを挿入
	preview.innerHTML = editorHTML.getValue();
	// CSSを反映
	const oldStyle = document.getElementById('dynamic-style');
	if (oldStyle) oldStyle.remove();
	const styleTag = document.createElement('style');
	styleTag.id = 'dynamic-style';
	styleTag.textContent = editorCSS.getValue();
	document.head.appendChild(styleTag);
	// JavaScriptを実行
	const oldScript = document.getElementById('dynamic-script');
	if (oldScript) oldScript.remove();
	const scriptTag = document.createElement('script');
	scriptTag.id = 'dynamic-script';
	scriptTag.textContent = editorJS.getValue();
	preview.appendChild(scriptTag);
}
