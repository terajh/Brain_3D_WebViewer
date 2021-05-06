NewJack 3D Viewer
======
NewJack is a pure JavaScript medical research image viewer, supporting [DICOM and NIFTI formats] compatible across a [range of web browsers].  The NewJack UI is [crescom](http://www.crescom.co/company.html)'s design with many display, menu and control options and can be run on a web server or as a local, shareable file.
![ScreenShot]


#### Basic usage (loads a blank viewer)
```html
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
    <head>
        <link rel="stylesheet" type="text/css" href="newjack.css" />
        <script type="text/javascript" src="newjack.js"></script>
        <title>NewJack 3D Viewer</title>
    </head>

    <body>
        <div class="NewJack"></div>
    </body>
</html>
```

#### To automatically load images and configure other options
```html
<head>
    ...
    <script type="text/javascript">
        var params = [];
        params["worldSpace"] = true;
        params["images"] = ["data/myBaseImage.nii.gz", "data/myOverlayImage.nii.gz"];
        params["surfaces"] = ["data/mySurface.surf.gii"];
        params["myOverlayImage.nii.gz"] = {"min": 4, "max": 10};
    </script>
</head>

...

<div class="newjack" data-params="params"></div>

```

Acknowledgments
-----

### ... Currently in Progress
---

## Pages
![https://s3.us-west-2.amazonaws.com/secure.notion-static.com/1162e4ac-997e-439d-b013-e9f2e6ab21ac/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAT73L2G45O3KS52Y5%2F20210506%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20210506T044638Z&X-Amz-Expires=86400&X-Amz-Signature=f6ea79d8327c0b52ebc60e9c71b5598430499a4b457cf32aea907079d8ba13cf&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22Untitled.png%22](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/1162e4ac-997e-439d-b013-e9f2e6ab21ac/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAT73L2G45O3KS52Y5%2F20210506%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20210506T044638Z&X-Amz-Expires=86400&X-Amz-Signature=f6ea79d8327c0b52ebc60e9c71b5598430499a4b457cf32aea907079d8ba13cf&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22Untitled.png%22)

![https://s3.us-west-2.amazonaws.com/secure.notion-static.com/805f5e3b-d4ee-4ca7-a8dd-dfb6824268f4/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAT73L2G45O3KS52Y5%2F20210506%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20210506T044708Z&X-Amz-Expires=86400&X-Amz-Signature=10ab42e1967d1cd7524a9801664b73b733ea2947e595293e16dd2704d04747b2&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22Untitled.png%22](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/805f5e3b-d4ee-4ca7-a8dd-dfb6824268f4/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAT73L2G45O3KS52Y5%2F20210506%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20210506T044708Z&X-Amz-Expires=86400&X-Amz-Signature=10ab42e1967d1cd7524a9801664b73b733ea2947e595293e16dd2704d04747b2&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22Untitled.png%22)

![https://s3.us-west-2.amazonaws.com/secure.notion-static.com/83273076-cd25-4aaa-ad61-87102566ce52/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAT73L2G45O3KS52Y5%2F20210506%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20210506T044717Z&X-Amz-Expires=86400&X-Amz-Signature=8f4cf61ed65e731fb0a334150bda0bf134958d3308305046809c33f89bb1867c&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22Untitled.png%22](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/83273076-cd25-4aaa-ad61-87102566ce52/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAT73L2G45O3KS52Y5%2F20210506%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20210506T044717Z&X-Amz-Expires=86400&X-Amz-Signature=8f4cf61ed65e731fb0a334150bda0bf134958d3308305046809c33f89bb1867c&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22Untitled.png%22)