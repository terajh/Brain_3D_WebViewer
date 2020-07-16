

function readNIFTI(name, data) {
    var canvasX = document.getElementById('region_canvas');
    var canvasY = document.getElementById('region_canvas2');
    var canvasZ = document.getElementById('region_canvas3');

    var sliderX = document.getElementById('myRangeX');
    var sliderY = document.getElementById('myRangeY');
    var sliderZ = document.getElementById('myRangeZ');

    var niftiHeader, niftiImage;

    // parse nifti
    // nifti 관련 함수는 가져다 쓰는 걸로.
    if (nifti.isCompressed(data)) {
        data = nifti.decompress(data);
    }

    if (nifti.isNIFTI(data)) {
        niftiHeader = nifti.readHeader(data);
        niftiImage = nifti.readImage(niftiHeader, data);
    }

    // set up slider
    var slicesX = niftiHeader.dims[1];
    console.log(niftiHeader.dims);
    sliderX.max = slicesX - 1;
    sliderX.value = Math.round(slicesX / 2);
    sliderX.oninput = function() {
        drawCanvas(canvasX, sliderX.value, niftiHeader, niftiImage, 'x');
    };

    var slicesY = niftiHeader.dims[2];
    console.log(niftiHeader.dims);
    sliderY.max = slicesY - 1;
    sliderY.value = Math.round(slicesY / 2);
    sliderY.oninput = function() {
        drawCanvas(canvasY, sliderY.value, niftiHeader, niftiImage, 'y');
    };

    var slicesZ = niftiHeader.dims[3];
    console.log(niftiHeader.dims);
    sliderZ.max = slicesZ - 1;
    sliderZ.value = Math.round(slicesZ / 2);
    sliderZ.oninput = function() {
        drawCanvas(canvasZ, sliderZ.value, niftiHeader, niftiImage, 'z');
    };

    // draw slice
    drawCanvas(canvasX, sliderX.value, niftiHeader, niftiImage, 'x');
    drawCanvas(canvasY, sliderY.value, niftiHeader, niftiImage, 'y');
    drawCanvas(canvasZ, sliderZ.value, niftiHeader, niftiImage, 'z');
}

function drawCanvas(canvas, slice, niftiHeader, niftiImage, direction) {
    // get nifti dimensions
    var cols = niftiHeader.dims[1];
    var rows = niftiHeader.dims[2];

    // set canvas dimensions to nifti slice dimensions
    canvas.width = cols;
    canvas.height = rows;

    // make canvas image data
    var ctx = canvas.getContext("2d");
    var canvasImageData = ctx.createImageData(canvas.width, canvas.height);

    // convert raw data to typed array based on nifti datatype
    var typedData;
    if (niftiHeader.datatypeCode === nifti.NIFTI1.TYPE_UINT8) {
        typedData = new Uint8Array(niftiImage);
    } else if (niftiHeader.datatypeCode === nifti.NIFTI1.TYPE_INT16) {
        typedData = new Int16Array(niftiImage);
    } else if (niftiHeader.datatypeCode === nifti.NIFTI1.TYPE_INT32) {
        typedData = new Int32Array(niftiImage);
    } else if (niftiHeader.datatypeCode === nifti.NIFTI1.TYPE_FLOAT32) {
        typedData = new Float32Array(niftiImage);
    } else if (niftiHeader.datatypeCode === nifti.NIFTI1.TYPE_FLOAT64) {
        typedData = new Float64Array(niftiImage);
    } else if (niftiHeader.datatypeCode === nifti.NIFTI1.TYPE_INT8) {
        typedData = new Int8Array(niftiImage);
    } else if (niftiHeader.datatypeCode === nifti.NIFTI1.TYPE_UINT16) {
        typedData = new Uint16Array(niftiImage);
    } else if (niftiHeader.datatypeCode === nifti.NIFTI1.TYPE_UINT32) {
        typedData = new Uint32Array(niftiImage);
    } else {
        return;
    }

    // offset to specified slice
    switch(direction){
        case 'x':
                    // draw pixels => slice : x축
            for (var row = 0; row < rows; row++) {
                var rowOffset = (rows-row)*cols*cols;
                for (var col = 0; col < cols; col++) {
                    var offset = Number(slice) + Number(rowOffset) + Number(col*512);
                    var value = typedData[offset];
                    canvasImageData.data[(row*cols + col) * 4] = value & 0xFF; // R
                    canvasImageData.data[(row*cols + col) * 4 + 1] = value & 0xFF; // G
                    canvasImageData.data[(row*cols + col) * 4 + 2] = value & 0xFF; // B
                    canvasImageData.data[(row*cols + col) * 4 + 3] = 0xFF; // A
                }
            }
            break;
        case 'y':
                    // draw pixels => slice : y축
            for (var row = 0; row < rows; row++) {
                var rowOffset = (rows - row) * cols * cols;
                for (var col = 0; col < cols; col++) {
                    var offset = Number(slice * 512) + Number(rowOffset) + col;
                    var value = typedData[offset];
                    canvasImageData.data[(row*cols + col) * 4] = value & 0xFF;
                    canvasImageData.data[(row*cols + col) * 4 + 1] = value & 0xFF;
                    canvasImageData.data[(row*cols + col) * 4 + 2] = value & 0xFF;
                    canvasImageData.data[(row*cols + col) * 4 + 3] = 0xFF;
                }
            }
            break;
        case 'z':
            var sliceSize = cols * rows;
            var sliceOffset = sliceSize * slice;
            
            // draw pixels => slice : z축
            for (var row = 0; row < rows; row++) {
                var rowOffset = row * cols;
                for (var col = 0; col < cols; col++) {
                    var offset = Number(sliceOffset) + Number(rowOffset) + col;
                    var value = typedData[offset];
                    canvasImageData.data[(row*cols + col) * 4] = value & 0xFF;
                    canvasImageData.data[(row*cols + col) * 4 + 1] = value & 0xFF;
                    canvasImageData.data[(row*cols + col) * 4 + 2] = value & 0xFF;
                    canvasImageData.data[(row*cols + col) * 4 + 3] = 0xFF;
                }
            }
            break;
        default:
            break;
    }
    ctx.putImageData(canvasImageData, 0, 0);
}

function makeSlice(file, start, length) {
    var fileType = (typeof File);

    if (fileType === 'undefined') {
        return function () {};
    }

    if (File.prototype.slice) {
        return file.slice(start, start + length);
    }

    if (File.prototype.mozSlice) {
        return file.mozSlice(start, length);
    }

    if (File.prototype.webkitSlice) {
        return file.webkitSlice(start, length);
    }

    return null;
}

function readFile(file) {
    var blob = makeSlice(file, 0, file.size);
    var reader = new FileReader();
    
    // onload 는 비동기로 수행되므로
    // readAsArrayBuffer로 데이터 읽으면 바로 비동기적으로 실행된다.
    reader.onloadend = function (evt) {
        if (evt.target.readyState === FileReader.DONE) {
            readNIFTI(file.name, evt.target.result);
        }
    };

    reader.readAsArrayBuffer(blob);
    // reader로 객체를 읽는다.

}

function handleFileSelect(evt) {
    var files = evt.target.files;
    readFile(files[0]);
}