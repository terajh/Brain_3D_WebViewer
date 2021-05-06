
/*jslint browser: true, node: true */
/*global $, PAPAYA_VIEWER_CSS, PAPAYA_DEFAULT_TOOLBAR_ID, PAPAYA_DEFAULT_VIEWER_ID, PAPAYA_DEFAULT_DISPLAY_ID,
 PAPAYA_TOOLBAR_CSS, PAPAYA_DISPLAY_CSS, PAPAYA_DEFAULT_SLIDER_ID, PAPAYA_DEFAULT_CONTAINER_ID, PAPAYA_SLIDER_CSS,
 PAPAYA_UTILS_UNSUPPORTED_CSS, PAPAYA_UTILS_UNSUPPORTED_MESSAGE_CSS, PAPAYA_CONTAINER_CLASS_NAME,
 PAPAYA_CONTAINER_FULLSCREEN, PAPAYA_CONTAINER_CLASS_NAME, PAPAYA_UTILS_CHECKFORJS_CSS, PAPAYA_SPACING,
 papayaRoundFast, PAPAYA_PADDING, PAPAYA_CONTAINER_PADDING_TOP, PAPAYA_CONTAINER_COLLAPSABLE_EXEMPT,
 PAPAYA_CONTAINER_COLLAPSABLE, PAPAYA_MANGO_INSTALLED, PAPAYA_KIOSK_CONTROLS_CSS, PAPAYA_CONTROL_INCREMENT_BUTTON_CSS,
 PAPAYA_CONTROL_SLIDER_CSS, PAPAYA_CONTROL_GOTO_CENTER_BUTTON_CSS, PAPAYA_CONTROL_GOTO_ORIGIN_BUTTON_CSS,
 PAPAYA_CONTROL_SWAP_BUTTON_CSS, PAPAYA_CONTROL_DIRECTION_SLIDER, PAPAYA_CONTROL_MAIN_SLIDER,
 PAPAYA_CONTROL_MAIN_INCREMENT_BUTTON_CSS, PAPAYA_CONTROL_MAIN_INCREMENT_BUTTON_CSS,
 PAPAYA_CONTROL_MAIN_DECREMENT_BUTTON_CSS, PAPAYA_CONTROL_MAIN_SWAP_BUTTON_CSS, PAPAYA_CONTROL_BAR_LABELS_CSS,
 PAPAYA_CONTROL_MAIN_GOTO_CENTER_BUTTON_CSS, PAPAYA_CONTROL_MAIN_GOTO_ORIGIN_BUTTON_CSS
 */

"use strict";

/*** Imports ***/
var papaya = papaya || {};


/*** Global Fields ***/
var papayaContainers = [];
var papayaLoadableImages = papayaLoadableImages || [];
var papayaDroppedFiles = [];


/*** Constructor ***/
papaya.Container = papaya.Container || function (containerHtml) {
    this.containerHtml = containerHtml;
    this.headerHtml = null;
    this.containerIndex = null;
    this.toolbarHtml = null;
    this.viewerHtml = null;
    this.displayHtml = null;
    this.titlebarHtml = null;
    this.sliderControlHtml = null;
    this.viewer = null;
    this.display = null;
    this.toolbar = null;
    this.preferences = null;
    this.params = [];
    this.loadingImageIndex = 0;
    this.loadingSurfaceIndex = 0;
    this.nestedViewer = false;
    this.collapsable = false;
    this.orthogonal = true;
    this.orthogonalTall = false;
    this.orthogonalDynamic = false;
    this.kioskMode = false;
    this.noNewFiles = false;
    this.showControls = true;
    this.showControlBar = false;
    this.showImageButtons = true;
    this.fullScreenPadding = true;
    this.combineParametric = false;
    this.dropTimeout = null;
    this.showRuler = false;
    this.syncOverlaySeries = true;
    this.surfaceParams = {};
    this.contextManager = null;
    this.allowScroll = true;
    this.loadingComplete = null;
    this.resetComponents();
};


/*** Static Pseudo-constants ***/

papaya.Container.LICENSE_TEXT = "<p>THIS PRODUCT IS NOT FOR CLINICAL USE.<br /><br />" +
    "This software is available for use, as is, free of charge.  The software and data derived from this software " +
    "may not be used for clinical purposes.<br /><br />" +
    "The authors of this software make no representations or warranties about the suitability of the software, " +
    "either express or implied, including but not limited to the implied warranties of merchantability, fitness for a " +
    "particular purpose, non-infringement, or conformance to a specification or standard. The authors of this software " +
    "shall not be liable for any damages suffered by licensee as a result of using or modifying this software or its " +
    "derivatives.<br /><br />" +
    "By using this software, you agree to be bounded by the terms of this license.  If you do not agree to the terms " +
    "of this license, do not use this software.</p>";

papaya.Container.KEYBOARD_REF_TEXT = "<span style='color:#B5CBD3'>[Spacebar]</span> Cycle the main slice view in a clockwise rotation.<br /><br />" +
    "<span style='color:#B5CBD3'>[Page Up]</span> or <span style='color:#B5CBD3'>[']</span> Increment the axial slice.<br /><br />" +
    "<span style='color:#B5CBD3'>[Page Down]</span> or <span style='color:#B5CBD3'>[/]</span> Decrement the axial slice.<br /><br />" +
    "<span style='color:#B5CBD3'>[Arrow Up]</span> and <span style='color:#B5CBD3'>[Arrow Down]</span> Increment/decrement the coronal slice.<br /><br />" +
    "<span style='color:#B5CBD3'>[Arrow Right]</span> and <span style='color:#B5CBD3'>[Arrow Left]</span> Increment/decrement the sagittal slice.<br /><br />" +
    "<span style='color:#B5CBD3'>[g]</span> and <span style='color:#B5CBD3'>[v]</span> Increment/decrement main slice.<br /><br />" +
    "<span style='color:#B5CBD3'>[<]</span> or <span style='color:#B5CBD3'>[,]</span> Decrement the series point.<br /><br />" +
    "<span style='color:#B5CBD3'>[>]</span> or <span style='color:#B5CBD3'>[.]</span> Increment the series point.<br /><br />" +
    "<span style='color:#B5CBD3'>[o]</span> Navigate viewer to the image origin.<br /><br />" +
    "<span style='color:#B5CBD3'>[c]</span> Navigate viewer to the center of the image.<br /><br />" +
    "<span style='color:#B5CBD3'>[a]</span> Toggle main crosshairs on/off.";

papaya.Container.MOUSE_REF_TEXT = "<span style='color:#B5CBD3'>(Left-click and drag)</span> Change current coordinate.<br /><br />" +
    "<span style='color:#B5CBD3'>[Alt](Left-click and drag)</span> Zoom in and out.<br /><br />" +
    "<span style='color:#B5CBD3'>[Alt](Double left-click)</span> Reset zoom.<br /><br />" +
    "<span style='color:#B5CBD3'>[Alt][Shift](Left-click and drag)</span> Pan zoomed image.<br /><br />" +
    "<span style='color:#B5CBD3'>(Right-click and drag)</span> Window level controls.<br /><br />" +
    "<span style='color:#B5CBD3'>(Scroll wheel)</span> See Preferences.<br /><br />";

papaya.Container.DICOM_SUPPORT = true;


/*** Static Fields ***/

papaya.Container.syncViewers = false;
papaya.Container.syncViewersWorld = false;
papaya.Container.allowPropagation = false;
papaya.Container.papayaLastHoveredViewer = null;
papaya.Container.ignorePatterns = [/^[.]/];
papaya.Container.atlas = null;
papaya.Container.atlasWorldSpace = true;


/*** Static Methods ***/

papaya.Container.restartViewer = function (index, refs, forceUrl, forceEncode, forceBinary) {
    papayaContainers[index].viewer.restart(refs, forceUrl, forceEncode, forceBinary);
};



papaya.Container.resetViewer = function (index, params) {
    if (!params) {
        params = papayaContainers[index].params;

        if (params.loadedImages) {
            params.images = params.loadedImages;
        }

        if (params.loadedEncodedImages) {
            params.encodedImages = params.loadedEncodedImages;
        }

        if (params.loadedBinaryImages) {
            params.binaryImages = params.loadedBinaryImages;
        }


        if (params.loadedSurfaces) {
            params.surfaces = params.loadedSurfaces;
        }

        if (params.loadedEncodedSurfaces) {
            params.encodedSurfaces = params.loadedEncodedSurfaces;
        }

        if (params.loadedFiles) {
            params.files = params.loadedFiles;
        }
    }

    papayaContainers[index].viewer.resetViewer();
    papayaContainers[index].toolbar.updateImageButtons();
    papayaContainers[index].reset();
    papayaContainers[index].params = params;
    papayaContainers[index].readGlobalParams();
    papayaContainers[index].rebuildContainer(params, index);
    papayaContainers[index].viewer.processParams(params);
};



papaya.Container.removeImage = function (index, imageIndex) {
    if (imageIndex < 1) {
        console.log("Cannot remove the base image.  Try papaya.Container.resetViewer() instead.");
    }

    papayaContainers[index].viewer.removeOverlay(imageIndex);
};



papaya.Container.hideImage = function (index, imageIndex) {
    papayaContainers[index].viewer.screenVolumes[imageIndex].hidden = true;
    papayaContainers[index].viewer.drawViewer(true, false);
};



papaya.Container.showImage = function (index, imageIndex) {
    papayaContainers[index].viewer.screenVolumes[imageIndex].hidden = false;
    papayaContainers[index].viewer.drawViewer(true, false);
};


papaya.Container.getObject = function (index) {
    return papayaContainers[index];
}
papaya.Container.addImage = function (index, imageRef, imageParams) {
    var imageRefs;

    if (imageParams) {
        papayaContainers[index].params = $.extend({}, papayaContainers[index].params, imageParams);
    }

    if (!(imageRef instanceof Array)) {
        imageRefs = [];
        imageRefs[0] = imageRef;
    } else {
        imageRefs = imageRef;
    }

    if (papayaContainers[index].params.images) {
        papayaContainers[index].viewer.loadImage(imageRefs, true, false, false);
    } else if (papayaContainers[index].params.binaryImages) {
        papayaContainers[index].viewer.loadImage(imageRefs, false, false, true);
    } else if (papayaContainers[index].params.encodedImages) {
        papayaContainers[index].viewer.loadImage(imageRefs, false, true, false);
    }
};



papaya.Container.findParameters = function (containerHTML) {
    var viewerHTML, paramsName, loadedParams = null;

    paramsName = containerHTML.data("params");

    if (!paramsName) {
        viewerHTML = containerHTML.find("." + PAPAYA_VIEWER_CSS);

        if (viewerHTML) {
            paramsName = viewerHTML.data("params");
        }
    }

    /*
     if (paramsName) {
     loadedParams = window[paramsName];
     }
     */

    if (paramsName) {
        if (typeof paramsName === 'object') {
            loadedParams = paramsName;
        }
        else if (window[paramsName]) {
            loadedParams = window[paramsName];
        }
    }

    if (loadedParams) {
        papaya.utilities.UrlUtils.getQueryParams(loadedParams);
    }

    return loadedParams;
};



papaya.Container.fillContainerHTML = function (containerHTML, isDefault, params, replaceIndex) {
    var toolbarHTML, viewerHTML, displayHTML, index;

    if (isDefault) {
        toolbarHTML = containerHTML.find("#" + PAPAYA_DEFAULT_TOOLBAR_ID);
        viewerHTML = containerHTML.find("#" + PAPAYA_DEFAULT_VIEWER_ID);
        displayHTML = containerHTML.find("#" + PAPAYA_DEFAULT_DISPLAY_ID);

        if (toolbarHTML) {
            toolbarHTML.addClass(PAPAYA_TOOLBAR_CSS);
        } else {
            containerHTML.prepend("<div class='" + PAPAYA_TOOLBAR_CSS + "' id='" +
                PAPAYA_DEFAULT_TOOLBAR_ID + "'></div>");
        }

        if (viewerHTML) {
            viewerHTML.addClass(PAPAYA_VIEWER_CSS);
        } else {
            $("<div class='" + PAPAYA_VIEWER_CSS + "' id='" +
                PAPAYA_DEFAULT_VIEWER_ID + "'></div>").insertAfter($("#" + PAPAYA_DEFAULT_TOOLBAR_ID));
        }

        if (displayHTML) {
            displayHTML.addClass(PAPAYA_DISPLAY_CSS);
        } else {
            $("<div class='" + PAPAYA_DISPLAY_CSS + "' id='" +
                PAPAYA_DEFAULT_DISPLAY_ID + "'></div>").insertAfter($("#" + PAPAYA_DEFAULT_VIEWER_ID));
        }

        console.log("This method of adding a Papaya container is deprecated.  " +
            "Try simply <div class='papaya' data-params='params'></div> instead...");
    } else {
        if (replaceIndex !== undefined) {
            index = replaceIndex;
        } else {
            index = papayaContainers.length;
        }

        containerHTML.attr("id", PAPAYA_DEFAULT_CONTAINER_ID + index);
        containerHTML.attr('slice', 'z');

        if (!params || (params.kioskMode === undefined) || !params.kioskMode) {
            containerHTML.append("<div id='" + (PAPAYA_DEFAULT_TOOLBAR_ID + index) +
                "' class='" + PAPAYA_TOOLBAR_CSS + "'></div>");
        }

        containerHTML.append("<div id='" + (PAPAYA_DEFAULT_VIEWER_ID + index) +
            "' class='" + PAPAYA_VIEWER_CSS + "'></div>");
        containerHTML.append("<div id='" + (PAPAYA_DEFAULT_DISPLAY_ID + index) +
            "' class='" + PAPAYA_DISPLAY_CSS + "'></div>");

        if (params && params.showControlBar && ((params.showControls === undefined) || params.showControls)) {
            containerHTML.append(
                "<div id='" + PAPAYA_KIOSK_CONTROLS_CSS + index + "' class='" + PAPAYA_KIOSK_CONTROLS_CSS + "'>" +
                "<div id='" + (PAPAYA_DEFAULT_SLIDER_ID + index) + "main" + "' class='" + PAPAYA_SLIDER_CSS + " " + PAPAYA_CONTROL_MAIN_SLIDER + "'>" +
                "<span class='" + PAPAYA_CONTROL_BAR_LABELS_CSS + "'>Slice: </span>" + " <button type='button' class='" + PAPAYA_CONTROL_INCREMENT_BUTTON_CSS + "'>+</button>" + " <button type='button' class='" + PAPAYA_CONTROL_INCREMENT_BUTTON_CSS + "'>-</button> " +
                "</div>" +

                "<div id='" + (PAPAYA_DEFAULT_SLIDER_ID + index) + "axial" + "' class='" + PAPAYA_SLIDER_CSS + " " + PAPAYA_CONTROL_DIRECTION_SLIDER + "'>" +
                "<span class='" + PAPAYA_CONTROL_BAR_LABELS_CSS + "'>Axial: </span>" + " <button type='button' class='" + PAPAYA_CONTROL_INCREMENT_BUTTON_CSS + "'>+</button>" + " <button type='button' class='" + PAPAYA_CONTROL_INCREMENT_BUTTON_CSS + "'>-</button> " +
                "</div>" +

                "<div id='" + (PAPAYA_DEFAULT_SLIDER_ID + index) + "coronal" + "' class='" + PAPAYA_SLIDER_CSS + " " + PAPAYA_CONTROL_DIRECTION_SLIDER + "'>" +
                "<span class='" + PAPAYA_CONTROL_BAR_LABELS_CSS + "'>Coronal: </span>" + " <button type='button' class='" + PAPAYA_CONTROL_INCREMENT_BUTTON_CSS + "'>+</button>" + " <button type='button' class='" + PAPAYA_CONTROL_INCREMENT_BUTTON_CSS + "'>-</button> " +
                "</div>" +

                "<div id='" + (PAPAYA_DEFAULT_SLIDER_ID + index) + "sagittal" + "' class='" + PAPAYA_SLIDER_CSS + " " + PAPAYA_CONTROL_DIRECTION_SLIDER + "'>" +
                "<span class='" + PAPAYA_CONTROL_BAR_LABELS_CSS + "'>Sagittal: </span>" + " <button type='button' class='" + PAPAYA_CONTROL_INCREMENT_BUTTON_CSS + "'>+</button>" + " <button type='button' class='" + PAPAYA_CONTROL_INCREMENT_BUTTON_CSS + "'>-</button> " +
                "</div>" +

                "<div id='" + (PAPAYA_DEFAULT_SLIDER_ID + index) + "series" + "' class='" + PAPAYA_SLIDER_CSS + " " + PAPAYA_CONTROL_DIRECTION_SLIDER + "'>" +
                "<span class='" + PAPAYA_CONTROL_BAR_LABELS_CSS + "'>Series: </span>" + " <button type='button' class='" + PAPAYA_CONTROL_INCREMENT_BUTTON_CSS + "'>&lt;</button>" + " <button type='button' class='" + PAPAYA_CONTROL_INCREMENT_BUTTON_CSS + "'>&gt;</button> " +
                "</div>" +
                "&nbsp;&nbsp;&nbsp;" +
                "<button type='button' " + ((params.kioskMode && ((params.showImageButtons === undefined) || params.showImageButtons)) ? "" : "style='float:right;margin-left:5px;' ") + "class='" + PAPAYA_CONTROL_SWAP_BUTTON_CSS + "'>Swap View</button> " +
                "<button type='button' " + ((params.kioskMode && ((params.showImageButtons === undefined) || params.showImageButtons)) ? "" : "style='float:right;margin-left:5px;' ") + "class='" + PAPAYA_CONTROL_GOTO_CENTER_BUTTON_CSS + "'>Go To Center</button> " +
                "<button type='button' " + ((params.kioskMode && ((params.showImageButtons === undefined) || params.showImageButtons)) ? "" : "style='float:right;margin-left:5px;' ") + "class='" + PAPAYA_CONTROL_GOTO_ORIGIN_BUTTON_CSS + "'>Go To Origin</button> " +
                "</div>");

            $("." + PAPAYA_CONTROL_INCREMENT_BUTTON_CSS).prop('disabled', true);
            $("." + PAPAYA_CONTROL_SWAP_BUTTON_CSS).prop('disabled', true);
            $("." + PAPAYA_CONTROL_GOTO_CENTER_BUTTON_CSS).prop('disabled', true);
            $("." + PAPAYA_CONTROL_GOTO_ORIGIN_BUTTON_CSS).prop('disabled', true);
        } else if (params && ((params.showControls === undefined) || params.showControls)) {
            containerHTML.append("<button type='button' id='" + (PAPAYA_CONTROL_MAIN_INCREMENT_BUTTON_CSS + index) + "' class='" + PAPAYA_CONTROL_MAIN_INCREMENT_BUTTON_CSS + "'>+</button> ");
            containerHTML.append("<button type='button' id='" + (PAPAYA_CONTROL_MAIN_DECREMENT_BUTTON_CSS + index) + "' class='" + PAPAYA_CONTROL_MAIN_DECREMENT_BUTTON_CSS + "'>-</button> ");
            containerHTML.append("<button type='button' id='" + (PAPAYA_CONTROL_MAIN_SWAP_BUTTON_CSS + index) + "' class='" + PAPAYA_CONTROL_MAIN_SWAP_BUTTON_CSS + "'>Swap View</button> ");
            containerHTML.append("<button type='button' id='" + (PAPAYA_CONTROL_MAIN_GOTO_CENTER_BUTTON_CSS + index) + "' class='" + PAPAYA_CONTROL_MAIN_GOTO_CENTER_BUTTON_CSS + "'>Go To Center</button> ");
            containerHTML.append("<button type='button' id='" + (PAPAYA_CONTROL_MAIN_GOTO_ORIGIN_BUTTON_CSS + index) + "' class='" + PAPAYA_CONTROL_MAIN_GOTO_ORIGIN_BUTTON_CSS + "'>Go To Origin</button> ");

            $("#" + PAPAYA_CONTROL_MAIN_INCREMENT_BUTTON_CSS + index).css({ display: "none" });
            $("#" + PAPAYA_CONTROL_MAIN_DECREMENT_BUTTON_CSS + index).css({ display: "none" });
            $("#" + PAPAYA_CONTROL_MAIN_SWAP_BUTTON_CSS + index).css({ display: "none" });
            $("#" + PAPAYA_CONTROL_MAIN_GOTO_CENTER_BUTTON_CSS + index).css({ display: "none" });
            $("#" + PAPAYA_CONTROL_MAIN_GOTO_ORIGIN_BUTTON_CSS + index).css({ display: "none" });
        }
    }

    return viewerHTML;
};



papaya.Container.buildContainer = function (containerHTML, params, replaceIndex) {

    var container, message, viewerHtml, loadUrl, index, imageRefs = null;

    message = papaya.utilities.PlatformUtils.checkForBrowserCompatibility();
    viewerHtml = containerHTML.find("." + PAPAYA_VIEWER_CSS);

    if (message !== null) {
        papaya.Container.removeCheckForJSClasses(containerHTML, viewerHtml);
        containerHTML.addClass(PAPAYA_UTILS_UNSUPPORTED_CSS);
        viewerHtml.addClass(PAPAYA_UTILS_UNSUPPORTED_MESSAGE_CSS);
        viewerHtml.html(message);
    } else {
        if (replaceIndex !== undefined) {
            index = replaceIndex;
        } else {
            index = papayaContainers.length;
        }

        container = new papaya.Container(containerHTML);
        container.containerIndex = index;
        container.preferences = new papaya.viewer.Preferences();
        papaya.Container.removeCheckForJSClasses(containerHTML, viewerHtml);

        if (params) {
            container.params = $.extend(container.params, params);
        }

        container.nestedViewer = (containerHTML.parent()[0].tagName.toUpperCase() !== 'BODY');
        container.readGlobalParams();

        if (container.isDesktopMode()) {
            container.preferences.readPreferences();
        }

        container.buildViewer(container.params);
        container.buildDisplay();

        if (container.showControlBar) {
            container.buildSliderControl();
        }

        container.buildToolbar();

        container.setUpDnD();

        loadUrl = viewerHtml.data("load-url");

        if (loadUrl) {
            imageRefs = loadUrl;
            if (!(imageRefs instanceof Array)) {
                imageRefs = [];
                imageRefs[0] = loadUrl;
            }

            container.viewer.loadImage(imageRefs, true, false, false);
        } else if (container.params.images) {
            imageRefs = container.params.images[0];
            if (!(imageRefs instanceof Array)) {
                imageRefs = [];
                imageRefs[0] = container.params.images[0];
            }

            container.viewer.loadImage(imageRefs, true, false, false);
        } else if (container.params.encodedImages) {
            imageRefs = container.params.encodedImages[0];
            if (!(imageRefs instanceof Array)) {
                imageRefs = [];
                imageRefs[0] = container.params.encodedImages[0];
            }

            container.viewer.loadImage(imageRefs, false, true, false);
        } else if (container.params.binaryImages) {
            imageRefs = container.params.binaryImages[0];
            container.viewer.loadImage(imageRefs, false, false, true);
        } else if (container.params.files) {
            imageRefs = container.params.files[0];
            if (!(imageRefs instanceof Array)) {
                imageRefs = [];
                imageRefs[0] = container.params.files[0];
            }

            container.viewer.loadImage(imageRefs, false, false, false);
        } else {
            container.viewer.finishedLoading();
        }

        container.resizeViewerComponents(false);

        if (!container.nestedViewer) {
            containerHTML.parent().height("100%");
            containerHTML.parent().width("100%");
        }

        papayaContainers[index] = container;

        papaya.Container.showLicense(container, params);
    }
};
papaya.Container.buildPanel = function () {
    var panels = $('#settings_panel');
    var panelsHtml = null;
    panelsHtml = "<h2>Settings</h2>\
                <div class='row'>\
                    <div class='variable'>\
                        <div class='name'>Project Name</div>\
                    </div>\
                    <div class='value'>\
                        <input type='text' id='_via_settings.project.name' />\
                    </div>\
                </div>\
                <div class='row'>\
                    <div class='variable'>\
                        <div class='name'>Default Path</div>\
                        <div class='desc'>If all images in your project are saved in a single folder, set the default path to the\
                        location of this folder. The VIA application will load images from this folder by default. Note: a default\
                        path of <code>'./'</code> indicates that the folder containing <code>via.html</code> application file also\
                        contains the images in this project. For example: <code>/datasets/VOC2012/JPEGImages/</code> or\
                        <code>C:\Documents\data\</code>&nbsp;<strong>(note the trailing <code>/</code> and\
                            <code>\</code></strong>)</div>\
                    </div>\
                    <div class='value'>\
                        <input type='text' id='_via_settings.core.default_filepath' placeholder='./statics/GMPtest/' />\
                    </div>\
                </div>\
                <div class='row'>\
                    <div class='variable'>\
                        <div class='name'>Search Path List</div>\
                        <div class='desc'>If you define multiple paths, all these folders will be searched to find images in this\
                        project. We do not recommend this approach as it is computationally expensive to search for images in\
                        multiple folders. <ol id='_via_settings.core.filepath'></ol>\
                        </div>\
                    </div>\
                    <div class='value'>\
                        <input type='text' id='settings_input_new_filepath'\
                        placeholder='/datasets/pascal/voc2012/VOCdevkit/VOC2012/JPEGImages' />\
                    </div>\
                </div>\
                    <div class='row'>\
                    <div class='variable'>\
                        <div class='name'>Region Label</div>\
                        <div class='desc'>By default, each region in an image is labelled using the region-id. Here, you can select\
                        a more descriptive labelling of regions.</div>\
                    </div>\
                    <div class='value'>\
                        <select id='_via_settings.ui.image.region_label'></select>\
                    </div>\
                </div>\
                <div class='row'>\
                    <div class='variable'>\
                        <div class='name'>Region Colour</div>\
                        <div class='desc'>By default, each region is drawn using a single colour. Using this setting, you can assign\
                        a unique colour to regions grouped according to a region attribute.</div>\
                    </div>\
                    <div class='value'>\
                        <select id='_via_settings.ui.image.region_color'></select>\
                    </div>\
                </div>\
                <div class='row'>\
                    <div class='variable'>\
                        <div class='name'>Region Label Font</div>\
                        <div class='desc'>Font size and font family for showing region labels.</div>\
                    </div>\
                    <div class='value'>\
                        <input id='_via_settings.ui.image.region_label_font' placeholder='12px Arial' />\
                    </div>\
                </div>\
                <div class='row'>\
                    <div class='variable'>\
                        <div class='name'>Preload Buffer Size</div>\
                        <div class='desc'>Images are preloaded in buffer to allow smoother navigation of next/prev images. A large\
                        buffer size may slow down the overall browser performance. To disable preloading, set buffer size to 0.\
                        </div>\
                    </div>\
                    <div class='value'>\
                        <input type='text' id='_via_settings.core.buffer_size' />\
                    </div>\
                </div>\
                <div class='row'>\
                    <div class='variable'>\
                        <div class='name'>On-image Annotation Editor</div>\
                        <div class='desc'>When a single region is selected, the on-image annotation editor is gets activated which\
                        the user to update annotations of this region. By default, this on-image annotation editor is placed near\
                        the selected region.</div>\
                    </div>\
                    <div class='value'>\
                        <select id='_via_settings.ui.image.on_image_annotation_editor_placement'>\
                        <option value='NEAR_REGION'>close to selected region</option>\
                        <option value='IMAGE_BOTTOM'>at the bottom of image being annotated</option>\
                        <option value='DISABLE'>DISABLE on-image annotation editor</option>\
                        </select>\
                    </div>\
                </div>\
                <div class='row' style='border:none;'>\
                    <button onclick='settings_save()' value='save_settings' style='margin-top:2rem'>Save</button>\
                    <button onclick='settings_panel_toggle()' value='cancel_settings' style='margin-left:2rem;'>Cancel</button>\
                </div>";
    panels.append(panelsHtml);
}
papaya.Container.buildHeader = function () {
    var headers = $('#ui_top_panel');
    this.headerHtml = `<div class="top_header row" id="ui_top_panel">
                            <a href="/" class="logo" style="width:14%; color: gold; justify-content: flex-start;">CRESCOM</a>
                            <div class="float-right row top_header_button_panel" id="img_size" style="width:83%;">
                                <div id="menubar" class="menubar" id="tools_fn_list_panel">
                                    <span style="cursor:pointer" onclick="sel_local_images()" title="Add new file from local disk">
                                        <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-file-earmark-plus" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M4 0h5.5v1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4.5h1V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2z"/>
                                            <path d="M9.5 3V0L14 4.5h-3A1.5 1.5 0 0 1 9.5 3z"/>
                                            <path fill-rule="evenodd" d="M8 6.5a.5.5 0 0 1 .5.5v1.5H10a.5.5 0 0 1 0 1H8.5V11a.5.5 0 0 1-1 0V9.5H6a.5.5 0 0 1 0-1h1.5V7a.5.5 0 0 1 .5-.5z"/>
                                        </svg>
                                    </span>
                                    <span style="cursor:pointer" onclick="project_file_remove_with_confirm()" title="Remove selected file (i.e. file currently being shown) from project">
                                        <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-file-earmark-minus" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M4 0h5.5v1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4.5h1V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2z"/>
                                            <path d="M9.5 3V0L14 4.5h-3A1.5 1.5 0 0 1 9.5 3z"/>
                                            <path fill-rule="evenodd" d="M5.5 9a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1H6a.5.5 0 0 1-.5-.5z"/>
                                        </svg>
                                    </span>
                                    <span onclick="project_save_with_confirm()" title="save project" style="cursor:pointer">
                                        <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-upload" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                            <path fill-rule="evenodd" d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
                                            <path fill-rule="evenodd" d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708l3-3z"/>
                                        </svg>
                                    </span>
                                    <span style="cursor:pointer" onclick="toggle_show_label_list()" title="draw label">
                                        <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-pencil" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                            <path fill-rule="evenodd" d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5L13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175l-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
                                        </svg>
                                    </span>
                                    <span style="cursor:pointer" onclick="rotateViews()"  title="rotate canvas">
                                        <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-shuffle" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                            <path fill-rule="evenodd" d="M0 3.5A.5.5 0 0 1 .5 3H1c2.202 0 3.827 1.24 4.874 2.418.49.552.865 1.102 1.126 1.532.26-.43.636-.98 1.126-1.532C9.173 4.24 10.798 3 13 3v1c-1.798 0-3.173 1.01-4.126 2.082A9.624 9.624 0 0 0 7.556 8a9.624 9.624 0 0 0 1.317 1.918C9.828 10.99 11.204 12 13 12v1c-2.202 0-3.827-1.24-4.874-2.418A10.595 10.595 0 0 1 7 9.05c-.26.43-.636.98-1.126 1.532C4.827 11.76 3.202 13 1 13H.5a.5.5 0 0 1 0-1H1c1.798 0 3.173-1.01 4.126-2.082A9.624 9.624 0 0 0 6.444 8a9.624 9.624 0 0 0-1.317-1.918C4.172 5.01 2.796 4 1 4H.5a.5.5 0 0 1-.5-.5z"/>
                                            <path d="M13 5.466V1.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384l-2.36 1.966a.25.25 0 0 1-.41-.192zm0 9v-3.932a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384l-2.36 1.966a.25.25 0 0 1-.41-.192z"/>
                                        </svg>
                                    </span>
                                    <ul id="select_shape" class="region_shape display_none">
                                        <li id="region_shape_polygon" onclick="via_canvas_toggle('polygon')" title="Polygon">
                                            <svg height="32" viewbox="0 0 32 32">
                                                <use xlink:href="#shape_polygon"></use>
                                            </svg>
                                        </li>                                        
                                        <li id="region_shape_cube" onclick="via_canvas_toggle('cube')" title="cube">
                                            <svg height="32" viewbox="0 0 32 32">
                                                <use xlink:href="#shape_rectangle"></use>
                                            </svg>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div id="logout_button" class="top_header_button button" title="Logout" onClick="location.href='/authen/logout'">
                                <img src=statics/image/power.png />
                            </div>
                        </div>`;
    headers.append(this.headerHtml);
}

papaya.Container.buildtoolbars = function () {
    var toolbars = $('#toolbar');
    var toolbars_hidden_html = "<svg onclick='project_save_with_confirm()' viewbox='0 0 24 24'>\
                                    <use xlink:href='#icon_save'></use>\
                                    <title>Save Project</title>\
                                </svg>\
                                <svg onclick='settings_panel_toggle()' viewbox='0 0 24 24'>\
                                    use xlink:href='#icon_settings'></use>\
                                    <title>Update Project Settings</title>\
                                </svg>\
                                <svg onclick='sel_local_data_file('annotations')' style='margin-left:1rem;' viewbox='0 0 24 24'>\
                                    <use xlink:href='#icon_fileupload'></use>\
                                    <title>Import Annotations from CSV</title>\
                                </svg>\
                                    <svg onclick='download_all_region_data('csv')' viewbox='0 0 24 24'>\
                                    <use xlink:href='#icon_filedownload'></use>\
                                    <title>Download Annotations as CSV</title>\
                                </svg>\
                                <svg onclick='image_grid_toggle()' id='toolbar_image_grid_toggle' style='margin-left:1rem;' viewbox='0 0 24 24'>\
                                    <use xlink:href='#icon_gridon'></use>\
                                    <title>Switch to Image Grid View</title>\
                                </svg>\
                                <svg onclick='annotation_editor_toggle_all_regions_editor()' viewbox='0 0 24 24'>\
                                    <use xlink:href='#icon_insertcomment'></use>\
                                    <title>Toggle Annotation Editor</title>\
                                </svg>\
                                <svg onclick='move_to_prev_image()' style='margin-left:1rem;' viewbox='0 0 24 24'>\
                                    <use xlink:href='#icon_prev'></use>\
                                    <title>Previous</title>\
                                </svg>\
                                <svg onclick='toggle_img_fn_list_visibility()' viewbox='0 0 24 24'>\
                                    <use xlink:href='#icon_list'></use>\
                                    <title>Toggle Filename List</title>\
                                </svg>\
                                <svg onclick='move_to_next_image()' viewbox='0 0 24 24'>\
                                    <use xlink:href='#icon_next'></use>\
                                    <title>Next</title>\
                                </svg>\
                                <svg onclick='zoom_in()' style='margin-left:1rem;' viewbox='0 0 24 24'>\
                                    <use xlink:href='#icon_zoomin'></use>\
                                    <title>Zoom In</title>\
                                </svg>\
                                <svg onclick='zoom_out()' viewbox='0 0 24 24'>\
                                    <use xlink:href='#icon_zoomout'></use>\
                                    <title>Zoom Out</title>\
                                </svg>\
                                <svg onclick='sel_all_regions()' viewbox='0 0 24 24' style='margin-left:1rem;'>\
                                    <use xlink:href='#icon_selectall'></use>\
                                    <title>Select All Regions</title>\
                                </svg>\
                                <svg onclick='copy_sel_regions()' viewbox='0 0 24 24'>\
                                    <use xlink:href='#icon_copy'></use>\
                                    <title>Copy Regions</title>\
                                </svg>\
                                <svg onclick='paste_sel_regions_in_current_image()' viewbox='0 0 24 24'>\
                                    <use xlink:href='#icon_paste'></use>\
                                    <title>Paste Regions</title>\
                                </svg>\
                                <svg onclick='paste_to_multiple_images_with_confirm()' viewbox='0 0 24 24'>\
                                    <use xlink:href='#icon_pasten'></use>\
                                    <title>Paste Region in Multiple Images</title>\
                                </svg>\
                                <svg onclick='del_sel_regions_with_confirm()' viewbox='0 0 24 24'>\
                                    <use xlink:href='#icon_pasteundo'></use>\
                                    <title>Undo Regions Pasted in Multiple Images</title>\
                                </svg>\
                                <svg onclick='del_sel_regions()' viewbox='0 0 24 24'>\
                                    <use xlink:href='#icon_close'></use>\
                                    <title>Delete Region</title>\
                                </svg>";
    toolbars.append(toolbars_hidden_html);
}

papaya.Container.buildAnnotation = function () {
    var annot = $('#annotation_editor_panel');
    var annotHtml = null;
    annotHtml = "<div class='button_panel'>\
                    <span class='text_button' onclick='edit_region_metadata_in_annotation_editor()' id='button_edit_region_metadata'\
                        title='Manual annotations of regions'>Region Annotations</span>\
                    <span class='text_button' onclick='edit_file_metadata_in_annotation_editor()' id='button_edit_file_metadata'\
                        title='Manual annotations of a file'>File Annotations</span>\
                    <span class='button' style='float:right;margin-right:0.2rem;'\
                        onclick='annotation_editor_toggle_all_regions_editor()'\
                        title='Close this window of annotation editor'>&times;</span>\
                    <span class='button' style='float:right;margin-right:0.2rem;' onclick='annotation_editor_increase_panel_height()'\
                        title='Increase the height of this panel'>&uarr;</span>\
                    <span class='button' style='float:right;margin-right:0.2rem;' onclick='annotation_editor_decrease_panel_height()'\
                        title='Decrease the height of this panel'>&darr;</span>\
                    <span class='button' style='float:right;margin-right:0.2rem;' onclick='annotation_editor_increase_content_size()'\
                        title='Increase size of contents in annotation editor'>&plus;</span>\
                    <span class='button' style='float:right;margin-right:0.2rem;' onclick='annotation_editor_decrease_content_size()'\
                        title='Decrease size of contents in annotation editor'>&minus;</span>\
                </div>";
    annot.append(annotHtml);
}
papaya.Container.buildLeftsidebar = function () {
    var leftsidebar1 = $('#leftsidebar1');
    // var leftsideHtml1 = null;




    // var leftsidebar = $('#leftsidebar');
    var leftsideHtml = null;
    leftsideHtml = `
                    <button class="leftsidebar_accordion active" id="project_panel_title">Project</button>
                    <div class="leftsidebar_accordion_panel show" id="img_fn_list_panel">
                        <div id="project_info_panel">
                            <div class="row">
                                <span class="col"><label for="project_name">Name: </label></span>
                                <span class="col"><input type="text" value="" onchange="project_on_name_update(this)" id="project_name" title="VIA project name"></span>    
                            </div>
                        </div>
                        <div id="project_tools_panel">
                            <div class="button_panel" style="margin:0.1rem 0;">
                                <select style="width:48%" id="filelist_preset_filters_list" onchange="img_fn_list_onpresetfilter_select()" title="Filter file list using predefined filters">
                                    <option value="all">All files</option>
                                    <option value="files_without_region">Show files without regions</option>
                                    <option value="files_missing_region_annotations">Show files missing region annotations</option>
                                    <option value="files_missing_file_annotations">Show files missing file annotations</option>
                                    <option value="files_error_loading">Files that could not be loaded</option>
                                    <option value="regex">Regular Expression</option>
                                </select>
                                <input style="width:50%" type="text" placeholder="regular expression" oninput="img_fn_list_onregex()" id="img_fn_list_regex" title="Filter using regular expression">
                            </div>
                        </div>
                        
                        <div id="img_fn_list"></div>
                    </div>
                    <!-- Attributes -->
                    <button class="leftsidebar_accordion" id="attributes_editor_panel_title" style="display:none">Attributes</button>
                    <div class="leftsidebar_accordion_panel" id="attributes_editor_panel" style="display:none">
                        <div class="button_panel" style="padding:1rem 0;">
                            <span class="text_button" onclick="show_region_attributes_update_panel()" id="button_show_region_attributes" title="Show region attributes">Region Attributes</span>
                            <span class="text_button" onclick="show_file_attributes_update_panel()" id="button_show_file_attributes" title="Show file attributes">File Attributes</span>
                        </div>
                        <div id="attributes_update_panel">
                            <div class="button_panel">
                                <input style="width:70%" type="text" placeholder="attribute name" id="user_input_attribute_id" value="">
                                <span id="button_add_new_attribute" class="button" onclick="add_new_attribute_from_user_input()" title="Add new attribute">&plus;</span>
                                <span id="button_del_attribute" class="button" onclick="delete_existing_attribute_with_confirm()" title="Delete existing attribute">&minus;</span>
                            </div>
                            <div class="button_panel" style="margin:0.1rem 0;">
                                <select style="width:100%" id="attributes_name_list" onchange="update_current_attribute_id(this)" title="List of existing attributes"></select>
                            </div>
                            <div id="attribute_properties"></div>
                            <div id="attribute_options"></div>
                            <p style="text-align:center">
                                <span class="text_button" style="display:none"  title="Show a spreadsheet like editor for all manual annotations" onclick="annotation_editor_toggle_all_regions_editor()">Toggle Annotation Editor</span>
                            </p>
                        </div>
                    </div>

                    <!-- tools-->
                    <button class="leftsidebar_accordion"  id="project_panel_tools">Tools</button>
                    
                    <!--tools end-->

                    <button id="hidden02" class="leftsidebar_accordion" style="display:none" onclick="annotation_editor_toggle_all_regions_editor()">Toggle Annotation Editor</button>
                    <button id="hidden03" class="leftsidebar_accordion" style="display:none">Keyboard Shortcuts</button>
                    <div id="hidden04" class="leftsidebar_accordion_panel">
                        <div style="display:block; text-align:center; padding:1rem;">Available only on image focus</div>
                        <table>
                            <tr>
                                <td style="width:8em;"><span class="key">&larr;</span>&nbsp;<span class="key">&uarr;</span>&nbsp;<span class="key">&rarr;</span>&nbsp;<span class="key">&darr;</span></td>
                                <td>Move selected region by 1 px (Shift to jump)</td>
                            </tr>
                            <tr>
                                <td><span class="key">a</span></td>
                                <td>Select all regions</td>
                            </tr>

                            <tr>
                                <td><span class="key">c</span></td>
                                <td>Copy selected regions</td>
                            </tr>
                            <tr>
                                <td><span class="key">v</span></td>
                                <td>Paste selected regions</td>
                            </tr>
                            <tr>
                                <td><span class="key">d</span></td>
                                <td>Delete selected regions</td>
                            </tr>
                            <tr>
                                <td><span class="key">Ctrl</span> + Wheel</td>
                                <td>Zoom in/out (mouse cursor is over image)</td>
                            </tr>
                            <tr>
                                <td><span class="key">l</span></td>
                                <td>Toggle region label</td>
                            </tr>
                            <tr>
                                <td><span class="key">b</span></td>
                                <td>Toggle region boundary</td>
                            </tr>
                            <tr>
                                <td><span class="key">Enter</span></td>
                                <td>Finish drawing polyshape</td>
                            </tr>
                            <tr>
                                <td><span class="key">Backspace</span></td>
                                <td>Delete last polyshape vertex</td>
                            </tr>
                        </table>

                        <div style="display:block; text-align:center; padding:1rem;">Always Available</div>
                        <table>
                            <tr>
                                <td style="width:8em;"><span class="key">&larr;</span>&nbsp;<span class="key">&rarr;</span></td>
                                <td>Move to next/previous image</td>
                            </tr>
                            <tr>
                                <td><span class="key">+</span>&nbsp;<span class="key">-</span>&nbsp;<span class="key">=</span></td>
                                <td>Zoom in/out/reset</td>
                            </tr>
                            <tr>
                                <td><span class="key">&uarr;</span></td>
                                <td>Update region label</td>
                            </tr>
                            <tr>
                                <td><span class="key">&darr;</span></td>
                                <td>Update region colour</td>
                            </tr>
                            <tr>
                                <td><span class="key">Spacebar</span></td>
                                <td>Toggle annotation editor (Ctrl to toggle on image editor)</td>
                            </tr>
                            <tr>
                                <td><span class="key">Home</span> / <span class="key">h</span></td>
                                <td>Jump to first image</td>
                            </tr>
                            <tr>
                                <td><span class="key">End</span> / <span class="key">e</span></td>
                                <td>Jump to last image</td>
                            </tr>
                            <tr>
                                <td><span class="key">PgUp</span> / <span class="key">u</span></td>
                                <td>Jump several images</td>
                            </tr>
                            <tr>
                                <td><span class="key">PgDown</span> / <span class="key">d</span></td>
                                <td>Jump several images</td>
                            </tr>

                            <tr>
                                <td><span class="key">Esc</span></td>
                                <td>Cancel ongoing task</td>
                            </tr>
                        </table>
                    </div> 
                    `;
    // leftsidebar.append(leftsideHtml);
    leftsidebar1.append(leftsideHtml);
}
papaya.Container.build404 = function () {
    var page404 = $('#page_404');
    var page404Html = null;
    page404Html = "<h2>File Not Found</h2>\
                    <p>Filename: <span style='font-family:Mono;' id='page_404_filename'></span></p>\
                    <p>We recommend that you update the default path in <span class='text_button' title='Show Project Settings'\
                        onclick='settings_panel_toggle()'>project settings</span> to the folder which contains this image.</p>\
                    <p>A temporary fix is to use <span class='text_button' title='Load or Add Images'\
                        onclick='sel_local_images()'>browser's file selector</span> to manually locate and add this file. We do not\
                    recommend this approach because it requires you to repeat this process every time your load this project in\
                    the VIA application.</p>";
    page404.append(page404Html);
}

papaya.Container.buildGrid = function () {
    var grid_panel = $('#image_grid_panel');
    var gridHtml = null;
    gridHtml = "<div id='image_grid_group_panel'>\
                    <span class='tool'>Group by&nbsp; <select id='image_grid_toolbar_group_by_select'\
                        onchange='image_grid_toolbar_onchange_group_by_select(this)'></select></span>\
                    </div>\
                    <div id='image_grid_toolbar'>\
                    <span>Selected</span>\
                    <span id='image_grid_group_by_sel_img_count'>0</span>\
                    <span>of</span>\
                    <span id='image_grid_group_by_img_count'>0</span>\
                    <span>images in current group, show</span>\
                    <span>\
                        <select id='image_grid_show_image_policy' onchange='image_grid_onchange_show_image_policy(this)'>\
                        <option value='all'>all images (paginated)</option>\
                        <option value='first_mid_last'>only first, middle and last image</option>\
                        <option value='even_indexed'>even indexed images (i.e. 0,2,4,...)</option>\
                        <option value='odd_indexed'>odd indexed images (i.e. 1,3,5,...)</option>\
                        <option value='gap5'>images 1, 5, 10, 15,...</option>\
                        <option value='gap25'>images 1, 25, 50, 75, ...</option>\
                        <option value='gap50'>images 1, 50, 100, 150, ...</option>\
                        </select>\
                    </span>\
                    <div id='image_grid_nav'></div>\
                    </div>\
                    <div id='image_grid_content'>\
                    <div id='image_grid_content_img'></div>\
                    <svg xmlns:xlink='http://www.w3.org/2000/svg' id='image_grid_content_rshape'></svg>\
                    </div>\
                    <div id='image_grid_info'>\
                </div>";
    grid_panel.append(gridHtml);
}
papaya.Container.buildRightsidebar = function () {
    var rightsidebar = $('#labelling_sidebar');
    var rightsidebarHtml = null;
    rightsidebarHtml = `
                        <button class='leftsidebar_accordion active' id='labelling_panel_title'>Labelling List</button>\
                        <div class='leftsidebar_accordion_panel show' id='labelling_fn_list_panel'>\
                        <div id='labelling_list'></div>`;
    rightsidebar.append(rightsidebarHtml);
}
papaya.Container.buildPlusContainer = function () {
    var plusContainer = $('#plus_container');
    var plusContainerHtml = null;
    plusContainerHtml = "<form id='img_form' method='post' enctype='multipart/form-data'>\
                            <div id='change'><input type='file' id='invisible_file_input' name='files[]' style='display:none'></div>\
                            <input type='button' id='invisible_submit' onclick='uploadImg()' style='display:none'>\
                        </form>";
    plusContainer.append(plusContainerHtml);
}
papaya.Container.prototype.rebuildContainer = function (params, index) {
    this.containerHtml.empty();
    papaya.Container.fillContainerHTML(this.containerHtml, false, params, index);
    papaya.Container.buildContainer(this.containerHtml, params, index);

    if ((papayaContainers.length === 1) && !papayaContainers[0].nestedViewer) {
        $("html").addClass(PAPAYA_CONTAINER_FULLSCREEN);
        $("body").addClass(PAPAYA_CONTAINER_FULLSCREEN);
        papaya.Container.setToFullPage();
    }
};

papaya.Container.buildAllContainers = function () {
    var defaultContainer, params;
    defaultContainer = $("#" + PAPAYA_DEFAULT_CONTAINER_ID);
    if (defaultContainer.length > 0) {
        papaya.Container.fillContainerHTML(defaultContainer, true);
        params = papaya.Container.findParameters(defaultContainer);
        papaya.Container.buildContainer(defaultContainer, params);
    } else {
        $("." + PAPAYA_CONTAINER_CLASS_NAME).each(function () {
            params = papaya.Container.findParameters($(this));
            if (params === null) {
                params = [];
            }
            if (params.fullScreen === true) {
                params.fullScreenPadding = false;
                params.kioskMode = true;
                params.showControlBar = false;
                $('body').css({ "background-color": "black" });
            }
            papaya.Container.fillContainerHTML($(this), false, params);
            papaya.Container.buildContainer($(this), params);
        });
    }
    if ((papayaContainers.length === 1) && !papayaContainers[0].nestedViewer) {
        $("html").addClass(PAPAYA_CONTAINER_FULLSCREEN);
        $("body").addClass(PAPAYA_CONTAINER_FULLSCREEN);
        papaya.Container.setToFullPage();
        papayaContainers[0].resizeViewerComponents(true);
    }
};

papaya.Container.startPapaya = function () {
    setTimeout(function () {  // setTimeout necessary in Chrome
        window.scrollTo(0, 0);
    }, 0);
    papaya.Container.buildHeader();
    papaya.Container.buildtoolbars();
    papaya.Container.buildPanel();
    papaya.Container.buildLeftsidebar();
    papaya.Container.buildAnnotation();
    papaya.Container.buildGrid();
    papaya.Container.build404();
    papaya.Container.buildRightsidebar();
    papaya.Container.buildPlusContainer();
    papaya.Container.DICOM_SUPPORT = (typeof (daikon) !== "undefined");
    papaya.Container.buildAllContainers();

    _via_init();
    (function () {
        $('#papayaToolbar0').attr('class', 'display_none');
    }());
};

papaya.Container.resizePapaya = function (ev, force) {
    var ctr;

    papaya.Container.updateOrthogonalState();

    if ((papayaContainers.length === 1) && !papayaContainers[0].nestedViewer) {
        if (!papaya.utilities.PlatformUtils.smallScreen || force) {
            papayaContainers[0].resizeViewerComponents(true);
        }
    } else {
        for (ctr = 0; ctr < papayaContainers.length; ctr += 1) {
            papayaContainers[ctr].resizeViewerComponents(true);
        }
    }

    setTimeout(function () {  // setTimeout necessary in Chrome
        window.scrollTo(0, 0);
    }, 0);
};



papaya.Container.addViewer = function (parentName, params, callback) {
    var container, parent;

    parent = $("#" + parentName);
    container = $('<div class="papaya"></div>');

    parent.html(container);

    // remove parent click handler
    parent[0].onclick = '';
    parent.off("click");

    papaya.Container.fillContainerHTML(container, false, params);
    papaya.Container.buildContainer(container, params);

    if (callback) {
        callback();
    }
};



papaya.Container.removeCheckForJSClasses = function (containerHtml, viewerHtml) {
    // old way, here for backwards compatibility
    viewerHtml.removeClass(PAPAYA_CONTAINER_CLASS_NAME);
    viewerHtml.removeClass(PAPAYA_UTILS_CHECKFORJS_CSS);

    // new way
    containerHtml.removeClass(PAPAYA_CONTAINER_CLASS_NAME);
    containerHtml.removeClass(PAPAYA_UTILS_CHECKFORJS_CSS);
};



papaya.Container.setToFullPage = function () {
    document.body.style.marginTop = 0;
    document.body.style.marginBottom = 0;
    document.body.style.marginLeft = 'auto';
    document.body.style.marginRight = 'auto';
    document.body.style.padding = 0;
    document.body.style.overflow = 'hidden';
    document.body.style.width = "100%";
    document.body.style.height = "100%";
};



papaya.Container.getLicense = function () {
    return papaya.Container.LICENSE_TEXT;
};



papaya.Container.getKeyboardReference = function () {
    return papaya.Container.KEYBOARD_REF_TEXT;
};



papaya.Container.getMouseReference = function () {
    return papaya.Container.MOUSE_REF_TEXT;
};



papaya.Container.setLicenseRead = function () {
    papaya.utilities.UrlUtils.createCookie(papaya.viewer.Preferences.COOKIE_PREFIX + "eula", "Yes",
        papaya.viewer.Preferences.COOKIE_EXPIRY_DAYS);
};



papaya.Container.isLicenseRead = function () {
    var value = papaya.utilities.UrlUtils.readCookie(papaya.viewer.Preferences.COOKIE_PREFIX + "eula");
    return (value && (value === 'Yes'));
};



papaya.Container.showLicense = function (container, params) {
    var showEula = (params && params.showEULA !== undefined) && params.showEULA;

    if (showEula && !papaya.Container.isLicenseRead()) {
        var dialog = new papaya.ui.Dialog(container, "License", papaya.ui.Toolbar.LICENSE_DATA,
            papaya.Container, null, papaya.Container.setLicenseRead, null, true);
        dialog.showDialog();
    }
};



papaya.Container.updateOrthogonalState = function () {
    var ctr;

    for (ctr = 0; ctr < papayaContainers.length; ctr += 1) {
        if (papayaContainers[ctr].orthogonal &&
            ((papaya.utilities.PlatformUtils.mobile || papayaContainers[ctr].orthogonalDynamic))) {
            if ($(window).height() > $(window).width()) {
                papayaContainers[ctr].orthogonalTall = true;
            } else {
                papayaContainers[ctr].orthogonalTall = false;
            }
        }
    }
};



papaya.Container.reorientPapaya = function () {
    var ctr;

    for (ctr = 0; ctr < papayaContainers.length; ctr += 1) {
        papayaContainers[ctr].toolbar.closeAllMenus();
    }

    papaya.Container.updateOrthogonalState();
    papaya.Container.resizePapaya(null, true);
};



/*** Prototype Methods ***/

papaya.Container.prototype.resetComponents = function () {
    this.containerHtml.css({ height: "auto" });
    this.containerHtml.css({ width: "auto" });
    this.containerHtml.css({ margin: "auto" });
    $('head').append("<style>div#papayaViewer:before{ content:'' }</style>");
};



papaya.Container.prototype.hasSurface = function () {
    return (this.viewer && (this.viewer.surfaces.length > 0));
};




papaya.Container.prototype.getViewerDimensions = function () {
    var parentWidth, height, width, ratio, maxHeight, maxWidth;

    parentWidth = this.containerHtml.parent().width() - (this.fullScreenPadding ? (2 * PAPAYA_PADDING) : 0);
    ratio = (this.orthogonal ? (this.hasSurface() ? 1.333 : 1.5) : 1);

    if (this.orthogonalTall || !this.orthogonal) {
        height = (this.collapsable ? window.innerHeight : this.containerHtml.parent().height()) - (papaya.viewer.Display.SIZE + (this.kioskMode ? 0 : (papaya.ui.Toolbar.SIZE +
            PAPAYA_SPACING)) + PAPAYA_SPACING + (this.fullScreenPadding && !this.nestedViewer ? (2 * PAPAYA_CONTAINER_PADDING_TOP) : 0)) -
            (this.showControlBar ? 2 * papaya.ui.Toolbar.SIZE : 0);

        width = papayaRoundFast(height / ratio);
    } else {

        width = parentWidth;
        height = papayaRoundFast(width / ratio);
    }

    if (!this.nestedViewer || this.collapsable) {

        if (this.orthogonalTall) {

            maxWidth = window.innerWidth - (this.fullScreenPadding ? (2 * PAPAYA_PADDING) : 0);
            if (width > maxWidth) {
                width = maxWidth;
                height = papayaRoundFast(width * ratio);
            }
        } else {

            maxHeight = window.innerHeight - (papaya.viewer.Display.SIZE + (this.kioskMode ? 0 : (papaya.ui.Toolbar.SIZE +
                PAPAYA_SPACING)) + PAPAYA_SPACING + (this.fullScreenPadding ? (2 * PAPAYA_CONTAINER_PADDING_TOP) : 0)) -
                (this.showControlBar ? 2 * papaya.ui.Toolbar.SIZE : 0);
            if (height > maxHeight) {
                height = maxHeight;
                width = papayaRoundFast(height * ratio);
            }

        }
    }

    return [width, height];
};



papaya.Container.prototype.getViewerPadding = function () {
    var parentWidth, viewerDims, padding;

    parentWidth = this.containerHtml.parent().width() - (this.fullScreenPadding ? (2 * PAPAYA_PADDING) : 0);
    viewerDims = this.getViewerDimensions();
    padding = ((parentWidth - viewerDims[0]) / 2);

    return padding;
};



papaya.Container.prototype.readGlobalParams = function () {
    this.kioskMode = (this.params.kioskMode === true) || papaya.utilities.PlatformUtils.smallScreen;
    this.combineParametric = (this.params.combineParametric === true);

    if (this.params.loadingComplete) {
        this.loadingComplete = this.params.loadingComplete;
    }

    if (this.params.showControls !== undefined) {  // default is true
        this.showControls = this.params.showControls;
    }

    if (this.params.noNewFiles !== undefined) {  // default is false
        this.noNewFiles = this.params.noNewFiles;
    }

    if (this.params.showImageButtons !== undefined) {  // default is true
        this.showImageButtons = this.params.showImageButtons;
    }

    if (papaya.utilities.PlatformUtils.smallScreen) {
        this.showImageButtons = false;
    }

    if (this.params.fullScreenPadding !== undefined) {  // default is true
        this.fullScreenPadding = this.params.fullScreenPadding;
    }

    if (this.params.orthogonal !== undefined) {  // default is true
        this.orthogonal = this.params.orthogonal;
    }

    this.surfaceParams.showSurfacePlanes = (this.params.showSurfacePlanes === true);
    this.surfaceParams.showSurfaceCrosshairs = (this.params.showSurfaceCrosshairs === true);
    this.surfaceParams.surfaceBackground = this.params.surfaceBackground;

    this.orthogonalTall = this.orthogonal && (this.params.orthogonalTall === true);
    this.orthogonalDynamic = this.orthogonal && (this.params.orthogonalDynamic === true);

    if (this.params.allowScroll !== undefined) {  // default is true
        this.allowScroll = this.params.allowScroll;
    }

    if (papaya.utilities.PlatformUtils.mobile || this.orthogonalDynamic) {
        if (this.orthogonal) {
            if ($(window).height() > $(window).width()) {
                this.orthogonalTall = true;
            } else {
                this.orthogonalTall = false;
            }
        }
    }

    if (this.params.syncOverlaySeries !== undefined) {  // default is true
        this.syncOverlaySeries = this.params.syncOverlaySeries;
    }

    if (this.params.showControlBar !== undefined) {  // default is true
        this.showControlBar = this.showControls && this.params.showControlBar;
    }

    if (this.params.contextManager !== undefined) {
        this.contextManager = this.params.contextManager;
    }

    if (this.params.fullScreen === true) {
        this.fullScreenPadding = this.params.fullScreenPadding = false;
        this.kioskMode = this.params.kioskMode = true;
        this.showControlBar = this.params.showControlBar = false;
        $('body').css("background-color:'black'");
    }
};



papaya.Container.prototype.reset = function () {
    this.loadingImageIndex = 0;
    this.loadingSurfaceIndex = 0;
    this.nestedViewer = false;
    this.collapsable = false;
    this.orthogonal = true;
    this.orthogonalTall = false;
    this.orthogonalDynamic = false;
    this.kioskMode = false;
    this.noNewFiles = false;
    this.showControls = true;
    this.showControlBar = false;
    this.fullScreenPadding = true;
    this.combineParametric = false;
    this.showRuler = false;
};



papaya.Container.prototype.resizeViewerComponents = function (resize) {
    var dims, padding, diff = 0;

    this.toolbar.closeAllMenus();

    dims = this.getViewerDimensions();
    padding = this.getViewerPadding();

    // this.toolbarHtml.css({width: dims[0] + "px"});
    // this.toolbarHtml.css({height: "0px"});
    this.toolbarHtml.css({ paddingLeft: "0px" });
    this.toolbarHtml.css({ paddingBottom: PAPAYA_SPACING + "px" });

    this.viewerHtml.css({ width: dims[0] + "px" });
    this.viewerHtml.css({ height: dims[1] + "px" });
    this.viewerHtml.css({ paddingLeft: "0px" });

    if (resize) {
        this.viewer.resizeViewer(dims);
    }

    this.displayHtml.css({ height: papaya.viewer.Display.SIZE + "px" });
    this.displayHtml.css({ paddingLeft: "0px" });
    this.displayHtml.css({ paddingTop: PAPAYA_SPACING + "px" });
    this.display.canvas.width = dims[0];

    if (this.showControls && this.showControlBar) {
        this.sliderControlHtml.css({ width: dims[0] + "px" });
        this.sliderControlHtml.css({ height: papaya.viewer.Display.SIZE + "px" });

        if (this.kioskMode) {
            diff += 0;
        } else {
            diff += -50;
        }

        if (this.viewer.hasSeries) {
            diff += 200;
        } else {
            diff += 0;
        }

        if (dims[0] < (775 + diff)) {
            $("." + PAPAYA_CONTROL_GOTO_CENTER_BUTTON_CSS).css({ display: "none" });
            $("." + PAPAYA_CONTROL_GOTO_ORIGIN_BUTTON_CSS).css({ display: "none" });
        } else {
            $("." + PAPAYA_CONTROL_GOTO_CENTER_BUTTON_CSS).css({ display: "inline" });
            $("." + PAPAYA_CONTROL_GOTO_ORIGIN_BUTTON_CSS).css({ display: "inline" });
        }

        if (dims[0] < (600 + diff)) {
            $("." + PAPAYA_CONTROL_DIRECTION_SLIDER).css({ display: "none" });
            $("." + PAPAYA_CONTROL_MAIN_SLIDER).css({ display: "inline" });
        } else {
            $("." + PAPAYA_CONTROL_DIRECTION_SLIDER).css({ display: "inline" });
            $("." + PAPAYA_CONTROL_MAIN_SLIDER).css({ display: "none" });
        }

        if (this.viewer.hasSeries && (dims[0] < (450 + diff))) {
            $("." + PAPAYA_CONTROL_MAIN_SLIDER).css({ display: "none" });
        }

        if (dims[0] < 200) {
            $("." + PAPAYA_CONTROL_SWAP_BUTTON_CSS).css({ display: "none" });
        } else {
            $("." + PAPAYA_CONTROL_SWAP_BUTTON_CSS).css({ display: "inline" });
        }

        if (this.viewer.hasSeries) {
            $("." + PAPAYA_CONTROL_DIRECTION_SLIDER).eq(3).css({ display: "inline" });
        } else {
            $("." + PAPAYA_CONTROL_DIRECTION_SLIDER).eq(3).css({ display: "none" });
        }
    } else if (this.showControls && this.viewer.initialized) {
        if (dims[0] < 600) {
            $("#" + PAPAYA_CONTROL_MAIN_GOTO_CENTER_BUTTON_CSS + this.containerIndex).css({ display: "none" });
            $("#" + PAPAYA_CONTROL_MAIN_GOTO_ORIGIN_BUTTON_CSS + this.containerIndex).css({ display: "none" });
        } else if (!this.viewer.controlsHidden) {
            $("#" + PAPAYA_CONTROL_MAIN_GOTO_CENTER_BUTTON_CSS + this.containerIndex).css({ display: "inline" });
            $("#" + PAPAYA_CONTROL_MAIN_GOTO_ORIGIN_BUTTON_CSS + this.containerIndex).css({ display: "inline" });
        }
    }

    if (this.isDesktopMode()) {
        if (dims[0] < 600) {
            this.titlebarHtml.css({ visibility: "hidden" });
        } else {
            this.titlebarHtml.css({ visibility: "visible" });
        }
    }

    if ((!this.nestedViewer || this.collapsable) && this.fullScreenPadding) {
        this.containerHtml.css({ paddingTop: "0px" });
        this.containerHtml.css({ width: 'auto' });
        this.containerHtml.css({ float: 'left' });

    } else {
        this.containerHtml.css({ paddingTop: "0" });
    }

    if (this.fullScreenPadding) {
        this.containerHtml.css({ paddingLeft: PAPAYA_PADDING + "px" });
        this.containerHtml.css({ paddingRight: PAPAYA_PADDING + "px" });
    }

    if (this.viewer.initialized) {
        this.viewer.drawViewer(false, true);
    } else {
        this.viewer.drawEmptyViewer();
        this.display.drawEmptyDisplay();
    }

    this.titlebarHtml.css({ width: dims[0] + "px", top: (0) });
};



papaya.Container.prototype.updateViewerSize = function () {
    this.toolbar.closeAllMenus();
    this.viewer.resizeViewer(this.getViewerDimensions());
    this.viewer.updateOffsetRect();
};



papaya.Container.prototype.buildViewer = function (params) {
    var dims;

    this.viewerHtml = this.containerHtml.find("." + PAPAYA_VIEWER_CSS);
    papaya.Container.removeCheckForJSClasses(this.containerHtml, this.viewerHtml);
    this.viewerHtml.html("");  // remove noscript message
    dims = this.getViewerDimensions();
    this.viewer = new papaya.viewer.Viewer(this, dims[0], dims[1], params);
    this.viewerHtml.append($(this.viewer.canvas));
    this.preferences.viewer = this.viewer;
};



papaya.Container.prototype.buildDisplay = function () {
    var dims;

    this.displayHtml = this.containerHtml.find("." + PAPAYA_DISPLAY_CSS);
    dims = this.getViewerDimensions();
    this.display = new papaya.viewer.Display(this, dims[0]);
    this.displayHtml.append($(this.display.canvas));
};



papaya.Container.prototype.buildSliderControl = function () {
    this.sliderControlHtml = this.containerHtml.find("." + PAPAYA_KIOSK_CONTROLS_CSS);
};



papaya.Container.prototype.buildToolbar = function () {
    this.toolbarHtml = this.containerHtml.find("." + PAPAYA_TOOLBAR_CSS);
    this.toolbar = new papaya.ui.Toolbar(this);
    this.toolbar.buildToolbar();
    this.toolbar.updateImageButtons();
};



papaya.Container.prototype.readFile = function (fileEntry, callback) {
    fileEntry.file(function (callback, file) {
        if (callback) {
            if (file.name.charAt(0) !== '.') {
                callback(file);
            }
        }
    }.bind(this, callback));
};



papaya.Container.prototype.readDir = function (itemEntry) {
    this.readDirNextEntries(itemEntry.createReader());
};



papaya.Container.prototype.readDirNextEntries = function (dirReader) {
    var container = this;

    dirReader.readEntries(function (entries) {
        var len = entries.length,
            ctr, entry;

        if (len > 0) {
            for (ctr = 0; ctr < len; ctr += 1) {
                entry = entries[ctr];
                if (entry.isFile) {
                    container.readFile(entry, papaya.utilities.ObjectUtils.bind(container, container.addDroppedFile));
                }
            }

            container.readDirNextEntries(dirReader);
        }
    });
};



papaya.Container.prototype.setUpDnD = function () {
    var container = this;

    this.containerHtml[0].ondragover = function () {
        container.viewer.draggingOver = true;
        if (!container.viewer.initialized) {
            container.viewer.drawEmptyViewer();
        }

        return false;
    };

    this.containerHtml[0].ondragleave = function () {
        container.viewer.draggingOver = false;
        if (!container.viewer.initialized) {
            container.viewer.drawEmptyViewer();
        }
        return false;
    };

    this.containerHtml[0].ondragend = function () {
        container.viewer.draggingOver = false;
        if (!container.viewer.initialized) {
            container.viewer.drawEmptyViewer();
        }
        return false;
    };

    this.containerHtml[0].ondrop = function (evt) {
        evt.preventDefault();

        var dataTransfer = evt.dataTransfer;

        container.display.drawProgress(0.1, "Loading");

        if (dataTransfer) {
            if (dataTransfer.items && (dataTransfer.items.length > 0)) {
                var items = dataTransfer.items,
                    len = items.length,
                    ctr, entry;

                for (ctr = 0; ctr < len; ctr += 1) {
                    entry = items[ctr];

                    if (entry.getAsEntry) {
                        entry = entry.getAsEntry();
                    } else if (entry.webkitGetAsEntry) {
                        entry = entry.webkitGetAsEntry();
                    }

                    if (entry.isFile) {
                        container.readFile(entry, papaya.utilities.ObjectUtils.bind(container,
                            container.addDroppedFile));
                    } else if (entry.isDirectory) {
                        container.readDir(entry);
                    }
                }
            }

            else if (dataTransfer.files && (dataTransfer.files.length > 0)) {
                container.viewer.loadImage(evt.dataTransfer.files);
            }
        }

        return false;
    };
};



papaya.Container.prototype.addDroppedFile = function (file) {
    clearTimeout(this.dropTimeout);
    papayaDroppedFiles.push(file);
    this.dropTimeout = setTimeout(papaya.utilities.ObjectUtils.bind(this, this.droppedFilesFinishedLoading), 100);
};



papaya.Container.prototype.droppedFilesFinishedLoading = function () {
    if (papaya.surface.Surface.findSurfaceType(papayaDroppedFiles[0].name) !== papaya.surface.Surface.SURFACE_TYPE_UNKNOWN) {
        this.viewer.loadSurface(papayaDroppedFiles);
    } else {
        this.viewer.loadImage(papayaDroppedFiles);
    }

    papayaDroppedFiles = [];
};



papaya.Container.prototype.clearParams = function () {
    this.params = [];
};



papaya.Container.prototype.loadNext = function () {
    if (this.hasImageToLoad()) {
        this.loadNextImage();
    } else if (this.hasSurfaceToLoad()) {
        this.loadNextSurface();
    } else if (this.hasAtlasToLoad()) {
        this.viewer.loadAtlas();
    }
};



papaya.Container.prototype.hasMoreToLoad = function () {
    return (this.hasImageToLoad() || this.hasSurfaceToLoad() || this.hasAtlasToLoad());
};



papaya.Container.prototype.hasImageToLoad = function () {
    if (this.params.images) {
        return (this.loadingImageIndex < this.params.images.length);
    } else if (this.params.binaryImages) {
        return (this.loadingImageIndex < this.params.binaryImages.length);
    } else if (this.params.encodedImages) {
        return (this.loadingImageIndex < this.params.encodedImages.length);
    } else if (this.params.files) {
        return (this.loadingImageIndex < this.params.files.length);
    }

    return false;
};



papaya.Container.prototype.hasAtlasToLoad = function () {
    return (papaya.Container.atlas == null) && this.viewer.hasDefinedAtlas();
};


papaya.Container.prototype.hasSurfaceToLoad = function () {
    if (!papaya.utilities.PlatformUtils.isWebGLSupported()) {
        console.log("Warning: This browser version is not able to load surfaces.");
        return false;
    }

    if (this.params.surfaces) {
        return (this.loadingSurfaceIndex < this.params.surfaces.length);
    } else if (this.params.encodedSurfaces) {
        return (this.loadingSurfaceIndex < this.params.encodedSurfaces.length);
    }

    return false;
};



papaya.Container.prototype.loadNextSurface = function () {
    var loadingNext = false, imageRefs;

    if (this.params.surfaces) {
        if (this.loadingSurfaceIndex < this.params.surfaces.length) {
            loadingNext = true;
            imageRefs = this.params.surfaces[this.loadingSurfaceIndex];
            this.loadingSurfaceIndex += 1;
            this.viewer.loadSurface(imageRefs, true, false);
        } else {
            this.params.loadedSurfaces = this.params.surfaces;
            this.params.surfaces = [];
        }
    } else if (this.params.encodedSurfaces) {
        if (this.loadingSurfaceIndex < this.params.encodedSurfaces.length) {
            loadingNext = true;
            imageRefs = this.params.encodedSurfaces[this.loadingSurfaceIndex];

            if (!(imageRefs instanceof Array)) {
                imageRefs = [];
                imageRefs[0] = this.params.encodedSurfaces[this.loadingSurfaceIndex];
            }

            this.viewer.loadSurface(imageRefs, false, true);
            this.loadingSurfaceIndex += 1;
        } else {
            this.params.loadedEncodedSurfaces = this.params.encodedSurfaces;
            this.params.encodedSurfaces = [];
        }
    }

    return loadingNext;
};



papaya.Container.prototype.loadNextImage = function () {
    var loadingNext = false, imageRefs;

    if (this.params.images) {
        if (this.loadingImageIndex < this.params.images.length) {
            loadingNext = true;
            imageRefs = this.params.images[this.loadingImageIndex];

            if (!(imageRefs instanceof Array)) {
                imageRefs = [];
                imageRefs[0] = this.params.images[this.loadingImageIndex];
            }

            this.viewer.loadImage(imageRefs, true, false, false);
            this.loadingImageIndex += 1;
        } else {
            this.params.loadedImages = this.params.images;
            this.params.images = [];
        }
    } else if (this.params.binaryImages) {
        if (this.loadingImageIndex < this.params.binaryImages.length) {
            loadingNext = true;
            imageRefs = this.params.binaryImages[this.loadingImageIndex];

            if (!(imageRefs instanceof Array)) {
                imageRefs = [];
                imageRefs[0] = this.params.binaryImages[this.loadingImageIndex];
            }

            this.viewer.loadImage(imageRefs, false, false, true);
            this.loadingImageIndex += 1;
        } else {
            this.params.loadedEncodedImages = this.params.binaryImages;
            this.params.binaryImages = [];
        }
    } else if (this.params.encodedImages) {
        if (this.loadingImageIndex < this.params.encodedImages.length) {
            loadingNext = true;
            imageRefs = this.params.encodedImages[this.loadingImageIndex];

            if (!(imageRefs instanceof Array)) {
                imageRefs = [];
                imageRefs[0] = this.params.encodedImages[this.loadingImageIndex];
            }

            this.viewer.loadImage(imageRefs, false, true, false);
            this.loadingImageIndex += 1;
        } else {
            this.params.loadedEncodedImages = this.params.encodedImages;
            this.params.encodedImages = [];
        }
    } else if (this.params.files) {
        if (this.loadingImageIndex < this.params.files.length) {
            loadingNext = true;
            imageRefs = this.params.files[this.loadingImageIndex];

            if (!(imageRefs instanceof Array)) {
                imageRefs = [];
                imageRefs[0] = this.params.files[this.loadingImageIndex];
            }

            this.viewer.loadImage(imageRefs, false, false, false);
            this.loadingImageIndex += 1;
        } else {
            this.params.loadedFiles = this.params.files;
            this.params.files = [];
        }
    }

    return loadingNext;
};



papaya.Container.prototype.readyForDnD = function () {
    return !this.kioskMode && ((this.params.images === undefined) ||
        (this.loadingImageIndex >= this.params.images.length)) &&
        ((this.params.binaryImages === undefined) ||
            (this.loadingImageIndex >= this.params.binaryImages.length)) &&
        ((this.params.encodedImages === undefined) ||
            (this.loadingImageIndex >= this.params.encodedImages.length)) &&
        ((this.params.encodedSurfaces === undefined) ||
            (this.loadingSurfaceIndex >= this.params.encodedSurfaces.length));
};



papaya.Container.prototype.findLoadableImage = function (name, surface) {
    var ctr;

    for (ctr = 0; ctr < papayaLoadableImages.length; ctr += 1) {
        if (surface) {
            if (papayaLoadableImages[ctr].surface) {
                if (papayaLoadableImages[ctr].name == name) {  // needs to be ==, not ===
                    return papayaLoadableImages[ctr];
                }
            }
        } else {
            if (papayaLoadableImages[ctr].name == name) {  // needs to be ==, not ===
                return papayaLoadableImages[ctr];
            }
        }
    }

    if (window[name] !== undefined) {
        return { encode: name };
    }

    return null;
};



papaya.Container.prototype.findLoadableImages = function (refs, surface) {
    var ctr, loadable, loadables = [];

    if (!Array.isArray(refs)) {
        refs = [refs];
    }

    if (refs) {
        for (ctr = 0; ctr < refs.length; ctr++) {
            loadable = this.findLoadableImage(refs[ctr], surface);

            if (loadable) {
                loadables.push(loadable);
            }
        }
    }

    if (loadables.length > 0) {
        return loadables;
    }

    return null;
};



papaya.Container.prototype.expandViewer = function () {
    var container = this;

    if (this.nestedViewer) {
        this.nestedViewer = false;
        this.collapsable = true;
        this.tempScrollTop = $(window).scrollTop();

        $(":hidden").addClass(PAPAYA_CONTAINER_COLLAPSABLE_EXEMPT);
        $(document.body).children().hide();
        this.containerHtml.show();

        this.originalStyle = {};
        this.originalStyle.width = document.body.style.width;
        this.originalStyle.height = document.body.style.height;
        this.originalStyle.marginTop = document.body.style.marginTop;
        this.originalStyle.marginRight = document.body.style.marginRight;
        this.originalStyle.marginBottom = document.body.style.marginBottom;
        this.originalStyle.marginLeft = document.body.style.marginLeft;
        this.originalStyle.paddingTop = document.body.style.paddingTop;
        this.originalStyle.paddingRight = document.body.style.paddingRight;
        this.originalStyle.paddingBottom = document.body.style.paddingBottom;
        this.originalStyle.paddingLeft = document.body.style.paddingLeft;
        this.originalStyle.overflow = document.body.style.overflow;

        papaya.Container.setToFullPage();

        this.containerHtml.after('<div style="display:none" class="' + PAPAYA_CONTAINER_COLLAPSABLE + '"></div>');
        $(document.body).prepend(this.containerHtml);

        this.resizeViewerComponents(true);
        this.viewer.updateOffsetRect();
        this.updateViewerSize();

        setTimeout(function () {
            window.scrollTo(0, 0);
            container.viewer.addScroll();
        }, 0);
    }
};


papaya.Container.prototype.collapseViewer = function () {
    var ctr, container;

    container = this;

    if (this.collapsable) {
        this.nestedViewer = true;
        this.collapsable = false;

        document.body.style.width = this.originalStyle.width;
        document.body.style.height = this.originalStyle.height;
        document.body.style.marginTop = this.originalStyle.marginTop;
        document.body.style.marginRight = this.originalStyle.marginRight;
        document.body.style.marginBottom = this.originalStyle.marginBottom;
        document.body.style.marginLeft = this.originalStyle.marginLeft;
        document.body.style.paddingTop = this.originalStyle.paddingTop;
        document.body.style.paddingRight = this.originalStyle.paddingRight;
        document.body.style.paddingBottom = this.originalStyle.paddingBottom;
        document.body.style.paddingLeft = this.originalStyle.paddingLeft;
        document.body.style.overflow = this.originalStyle.overflow;

        $("." + PAPAYA_CONTAINER_COLLAPSABLE).replaceWith(this.containerHtml);
        $(document.body).children(":not(." + PAPAYA_CONTAINER_COLLAPSABLE_EXEMPT + ")").show();
        $("." + PAPAYA_CONTAINER_COLLAPSABLE_EXEMPT).removeClass(PAPAYA_CONTAINER_COLLAPSABLE_EXEMPT);

        this.resizeViewerComponents(true);

        for (ctr = 0; ctr < papayaContainers.length; ctr += 1) {
            papayaContainers[ctr].updateViewerSize();
            papayaContainers[ctr].viewer.drawViewer(true);
        }

        setTimeout(function () {
            $(window).scrollTop(container.tempScrollTop);
            container.viewer.removeScroll();
        }, 0);
    }
};



papaya.Container.prototype.isNestedViewer = function () {
    return (this.nestedViewer || this.collapsable);
};



papaya.Container.prototype.isDesktopMode = function () {
    return !this.kioskMode;
};



papaya.Container.prototype.hasLoadedDTI = function () {
    return this.viewer.hasLoadedDTI();
};



papaya.Container.prototype.disableScrollWheel = function () {
    return (this.isNestedViewer() || papaya.utilities.PlatformUtils.ios);
};



papaya.Container.prototype.canOpenInMango = function () {
    return this.params.canOpenInMango;
};



papaya.Container.prototype.isExpandable = function () {
    return this.params.expandable && this.isNestedViewer();
};



papaya.Container.prototype.isParametricCombined = function (index) {
    return this.combineParametric && this.viewer.hasParametricPair(index);
};



papaya.Container.prototype.isNonParametricCombined = function (index) {
    return !this.isParametricCombined(index);
};



papaya.Container.prototype.coordinateChanged = function (viewer) {
    var ctr, coorWorld,
        coor = viewer.currentCoord;

    if (!viewer.ignoreSync) {
        if (papaya.Container.syncViewersWorld) {
            for (ctr = 0; ctr < papayaContainers.length; ctr += 1) {
                if ((papayaContainers[ctr].viewer !== viewer) && !papayaContainers[ctr].viewer.ignoreSync) {
                    coorWorld = new papaya.core.Coordinate();
                    papayaContainers[ctr].viewer.gotoWorldCoordinate(viewer.getWorldCoordinateAtIndex(coor.x, coor.y, coor.z, coorWorld), true);
                }
            }
        } else if (papaya.Container.syncViewers) {
            for (ctr = 0; ctr < papayaContainers.length; ctr += 1) {
                if ((papayaContainers[ctr].viewer !== viewer) && !papayaContainers[ctr].viewer.ignoreSync) {
                    papayaContainers[ctr].viewer.gotoCoordinate(coor, true);
                }
            }
        }
    }

    if (viewer.surfaceView) {
        viewer.surfaceView.updateActivePlanes();
    }

    if (this.contextManager && this.contextManager.clearContext) {
        this.contextManager.clearContext();
    }
};



papaya.Container.prototype.canCurrentOverlayLoadNegatives = function () {
    var overlay = this.viewer.currentScreenVolume;
    return (!overlay.negative && (overlay.negativeScreenVol === null));
};



papaya.Container.prototype.canCurrentOverlayLoadMod = function () {
    var overlay = this.viewer.currentScreenVolume;
    return (overlay.dti && (overlay.dtiVolumeMod === null));
};



papaya.Container.prototype.canCurrentOverlayModulate = function () {
    var overlay = this.viewer.currentScreenVolume;
    return (overlay.dti && (overlay.dtiVolumeMod !== null));
};



/*** Window Events ***/

window.addEventListener('resize', papaya.Container.resizePapaya, false);
window.addEventListener("orientationchange", papaya.Container.reorientPapaya, false);
window.addEventListener("load", papaya.Container.startPapaya, false);
window.addEventListener('message', function (msg) {
    if (msg.data === PAPAYA_MANGO_INSTALLED) {
        papaya.mangoinstalled = true;
    }
}, false);
