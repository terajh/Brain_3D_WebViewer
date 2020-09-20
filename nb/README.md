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