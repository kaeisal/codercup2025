import webview
import time

def Maxwindow(window):
    window.maximize()

if __name__ == '__main__':
    webview.settings['ALLOW_DOWNLOADS'] = True
    window = webview.create_window(
        'みんなのゲームとツール',
        url="setting.html",
        minimized=True,
    )
    webview.start(Maxwindow, window,private_mode=False)
    
