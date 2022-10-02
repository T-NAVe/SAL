# SAL 🐱‍👤

**_STOP ANNOYING LEVELS_**

## SAL Extension 🐱‍🐉

**_This extension focuses on fixing those audio level differences via a compressor_**

A few things you should know:

* This uses a dynamic comp and a node gain, even tho' it's a very simple extension, it does not have the approach i would like. At the moment you can only "improve" the audio in videos since currently you cannot capture the audio directly fromt the tab due to a bug in the tabCapture API on manifest V3 apps.
The issue mentioned can be followed in this thread [Chrome issue](https://bugs.chromium.org/p/chromium/issues/detail?id=1214847) I will keep working on this extension from time to time, but until this issue is not successfully resolved I will have to work with the current aproach or with another workarround.
This issues does not happend with MV2, but currently you can't publish your extension in that format, it needs to be MV3, so there is no point working on an extension in a format that cannot be published.
* I know that the extension is currently a mess due to the multiple solutions I had to check due to the bug, but feel free to contribute.
* The extension wont work in HBO, the solution implemented is to capture the audio from the first video element on the page, in HBO the first video element will be a trailer, this is true even when you open a video, the trailer element is always in the background. This also mean that the extension wont work on other sites with similar structures.
* Currenty the only features working are the TURN ON button and the gain range input.

## Starting 🚀

_Load the extension_
Follow this steps:

* Download/copy this repo in your computer.
* Load the unpacked extension via chrome extension manager (Dev mode needs to be enabled).
* Open a video and press Turn on SAL button. (You will notice a change in gain, this means that the extension is active, if this does not happen refresh the page and try again!)
* Done!

## Developers ✒️

* **Luca de Acha** - [Github](https://github.com/T-NAVe) - [LinkedIn](https://www.linkedin.com/in/luca-de-acha/)
* **Ismael Barea Insua** - [Github](https://github.com/quantosh) - [LinkedIn](https://www.linkedin.com/in/ismaelbareainsua/)

## License 📄

This project is under MIT-license check [MIT-LICENSE.txt](MIT-LICENSE.txt) for details.
