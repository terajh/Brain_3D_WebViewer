
// Minimum supported browsers
var PAPAYA_BROWSER_MIN_FIREFOX = 7,
    PAPAYA_BROWSER_MIN_CHROME = 7,
    PAPAYA_BROWSER_MIN_SAFARI = 6,
    PAPAYA_BROWSER_MIN_IE = 10,
    PAPAYA_BROWSER_MIN_OPERA = 12;

var PAPAYA_SURFACE_BROWSER_MIN_FIREFOX = 7,
    PAPAYA_SURFACE_BROWSER_MIN_CHROME = 8,
    PAPAYA_SURFACE_BROWSER_MIN_SAFARI = 6,
    PAPAYA_SURFACE_BROWSER_MIN_IE = 11,
    PAPAYA_SURFACE_BROWSER_MIN_OPERA = 12;

// Base CSS classes
var PAPAYA_CONTAINER_CLASS_NAME = "papaya",
    PAPAYA_CONTAINER_COLLAPSABLE = "papaya-collapsable",
    PAPAYA_CONTAINER_COLLAPSABLE_EXEMPT = "papaya-collapsable-exempt",
    PAPAYA_CONTAINER_FULLSCREEN = "papaya-fullscreen";


// Viewer CSS classes
var PAPAYA_VIEWER_CSS = "papaya-viewer";


// Toolbar CSS classes
var PAPAYA_TOOLBAR_CSS = "papaya-toolbar",
    PAPAYA_TITLEBAR_CSS = "papaya-titlebar",
    PAPAYA_SLIDER_CSS = "papaya-slider-slice",
    PAPAYA_KIOSK_CONTROLS_CSS = "papaya-kiosk-controls";


// Display CSS classes
var PAPAYA_DISPLAY_CSS = "papaya-display";


// Dialog CSS classes
var PAPAYA_DIALOG_CSS = "papaya-dialog",
    PAPAYA_DIALOG_CONTENT_CSS = "papaya-dialog-content",
    PAPAYA_DIALOG_CONTENT_NOWRAP_CSS = "papaya-dialog-content-nowrap",
    PAPAYA_DIALOG_CONTENT_LABEL_CSS = "papaya-dialog-content-label",
    PAPAYA_DIALOG_CONTENT_CONTROL_CSS = "papaya-dialog-content-control",
    PAPAYA_DIALOG_TITLE_CSS = "papaya-dialog-title",
    PAPAYA_DIALOG_BUTTON_CSS = "papaya-dialog-button",
    PAPAYA_DIALOG_BACKGROUND = "papaya-dialog-background",
    PAPAYA_DIALOG_STOPSCROLL = "papaya-dialog-stopscroll",
    PAPAYA_DIALOG_CONTENT_HELP = "papaya-dialog-content-help";


// Menu CSS classes
var PAPAYA_MENU_CSS = "papaya-menu",
    PAPAYA_MENU_LABEL_CSS = "papaya-menu-label",
    PAPAYA_MENU_TITLEBAR_CSS = "papaya-menu-titlebar",
    PAPAYA_MENU_ICON_CSS = "papaya-menu-icon",
    PAPAYA_MENU_HOVERING_CSS = "papaya-menu-hovering",
    PAPAYA_MENU_SPACER_CSS = "papaya-menu-spacer",
    PAPAYA_MENU_UNSELECTABLE = "papaya-menu-unselectable",
    PAPAYA_MENU_FILECHOOSER = "papaya-menu-filechooser",
    PAPAYA_MENU_BUTTON_CSS = "papaya-menu-button",
    PAPAYA_MENU_BUTTON_HOVERING_CSS = "papaya-menu-button-hovering",
    PAPAYA_MENU_COLORTABLE_CSS = "papaya-menu-colortable",
    PAPAYA_MENU_INPUT_FIELD = "papaya-menu-input",
    PAPAYA_MENU_SLIDER = "papaya-menu-slider";


// Control CSS classes
var PAPAYA_CONTROL_INCREMENT_BUTTON_CSS = "papaya-control-increment",
    PAPAYA_CONTROL_GOTO_CENTER_BUTTON_CSS = "papaya-control-goto-center",
    PAPAYA_CONTROL_GOTO_ORIGIN_BUTTON_CSS = "papaya-control-goto-origin",
    PAPAYA_CONTROL_SWAP_BUTTON_CSS = "papaya-control-swap",
    PAPAYA_CONTROL_DIRECTION_SLIDER = "papaya-direction-slider",
    PAPAYA_CONTROL_MAIN_SLIDER = "papaya-main-slider",
    PAPAYA_CONTROL_MAIN_INCREMENT_BUTTON_CSS = "papaya-main-increment",
    PAPAYA_CONTROL_MAIN_DECREMENT_BUTTON_CSS = "papaya-main-decrement",
    PAPAYA_CONTROL_MAIN_SWAP_BUTTON_CSS = "papaya-main-swap",
    PAPAYA_CONTROL_MAIN_GOTO_CENTER_BUTTON_CSS = "papaya-main-goto-center",
    PAPAYA_CONTROL_MAIN_GOTO_ORIGIN_BUTTON_CSS = "papaya-main-goto-origin",
    PAPAYA_CONTROL_BAR_LABELS_CSS = "papaya-controlbar-label";



// Utils CSS classes
var PAPAYA_UTILS_CHECKFORJS_CSS = "checkForJS",
    PAPAYA_UTILS_UNSUPPORTED_CSS = "papaya-utils-unsupported",
    PAPAYA_UTILS_UNSUPPORTED_MESSAGE_CSS = "papaya-utils-unsupported-message";


// Deprecated IDs
var PAPAYA_DEFAULT_VIEWER_ID  = "papayaViewer",
    PAPAYA_DEFAULT_DISPLAY_ID = "papayaDisplay",
    PAPAYA_DEFAULT_TOOLBAR_ID = "papayaToolbar",
    PAPAYA_DEFAULT_CONTAINER_ID = "papayaContainer",
    PAPAYA_DEFAULT_SLIDER_ID = "papayaSliceSlider";


// Misc constants
var PAPAYA_SPACING = 3,
    PAPAYA_PADDING = 8,
    PAPAYA_CONTAINER_PADDING = 20,
    PAPAYA_CONTAINER_PADDING_TOP = PAPAYA_CONTAINER_PADDING,
    PAPAYA_MANGO_INSTALLED = "mangoinstalled",
    PAPAYA_CUSTOM_PROTOCOL = "mango";

// GZIP constants
var GUNZIP_MAGIC_COOKIE1 = 31,
    GUNZIP_MAGIC_COOKIE2 = 139;



var VIA_VERSION = '2.0.8';
var VIA_NAME = 'VGG Image Annotator';
var VIA_SHORT_NAME = 'VIA';
var VIA_REGION_SHAPE = {
    RECT: 'rect',
    CUBE: 'cube'
};

var VIA_ATTRIBUTE_TYPE = {
    TEXT: 'text',
    CHECKBOX: 'checkbox',
    RADIO: 'radio',
    IMAGE: 'image',
    DROPDOWN: 'dropdown'
};

var VIA_DISPLAY_AREA_CONTENT_NAME = {
    IMAGE: 'image_panel',
    IMAGE_GRID: 'image_grid_panel',
    SETTINGS: 'settings_panel',
    PAGE_404: 'page_404',
    PAGE_GETTING_STARTED: 'page_getting_started',
    PAGE_ABOUT: 'page_about',
    PAGE_START_INFO: 'page_start_info',
    PAGE_LICENSE: 'page_license'
};

var VIA_ANNOTATION_EDITOR_MODE = {
    SINGLE_REGION: 'single_region',
    ALL_REGIONS: 'all_regions'
};
var VIA_ANNOTATION_EDITOR_PLACEMENT = {
    NEAR_REGION: 'NEAR_REGION',
    IMAGE_BOTTOM: 'IMAGE_BOTTOM',
    DISABLE: 'DISABLE'
};

var VIA_REGION_EDGE_TOL = 5;   // pixel
var VIA_REGION_CONTROL_POINT_SIZE = 2;
var VIA_REGION_POINT_RADIUS = 3;
var VIA_POLYGON_VERTEX_MATCH_TOL = 5;
var VIA_REGION_MIN_DIM = 3;
var VIA_MOUSE_CLICK_TOL = 2;
var VIA_ELLIPSE_EDGE_TOL = 0.2; // euclidean distance
var VIA_THETA_TOL = Math.PI / 18; // 10 degrees
var VIA_POLYGON_RESIZE_VERTEX_OFFSET = 100;
var VIA_CANVAS_DEFAULT_ZOOM_LEVEL_INDEX = 3;
var VIA_CANVAS_ZOOM_LEVELS = [0.25, 0.5, 0.75, 1.0, 1.5, 2.0, 2.5, 3.0, 4, 5, 6, 7, 8, 9, 10];
var VIA_REGION_COLOR_LIST = ["#E69F00", "#56B4E9", "#009E73", "#D55E00", "#CC79A7", "#F0E442", "#ffffff"];

var VIA_THEME_REGION_BOUNDARY_WIDTH = 3;
var VIA_THEME_BOUNDARY_LINE_COLOR = "black";
var VIA_THEME_BOUNDARY_FILL_COLOR = "yellow";
var VIA_THEME_SEL_REGION_FILL_COLOR = "#808080";
var VIA_THEME_SEL_REGION_FILL_BOUNDARY_COLOR = "yellow";
var VIA_THEME_SEL_REGION_OPACITY = 0.5;
var VIA_THEME_MESSAGE_TIMEOUT_MS = 6000;
var VIA_THEME_CONTROL_POINT_COLOR = '#ff0000';

var VIA_CSV_SEP = ',';
var VIA_CSV_QUOTE_CHAR = '"';
var VIA_CSV_KEYVAL_SEP = ':';

var _via_img_metadata = {};   // data structure to store loaded images metadata
var _via_img_src = {};   // image content {abs. path, url, base64 data, etc}
var _via_img_fileref = {};   // reference to local images selected by using browser file selector
var _via_img_count = 0;    // count of the loaded images
var _via_canvas_regions = []; // image regions spec. in canvas space
var _via_canvas_scale = 1.0;// current scale of canvas image

var _via_image_id = ''; // id={filename+length} of current image
var _via_image_index = -1; // index

var _via_current_image_filename;
var _via_current_image;
var _via_current_image_width;
var _via_current_image_height;

// a record of image statistics (e.g. width, height)
var _via_img_stat = {};
var _via_is_all_img_stat_read_ongoing = false;
var _via_img_stat_current_img_index = false;



var _via_reg_position = {'x':0,'y':0,'z':0}; // for show NIFTI images


var _via_reg_ctx; // initialized in _via_init()
var _via_canvas_width, _via_canvas_height;

// canvas zoom
var _via_canvas_zoom_level_index = VIA_CANVAS_DEFAULT_ZOOM_LEVEL_INDEX; // 1.0
var _via_canvas_scale_without_zoom = 1.0;

// state of the application
var _via_is_user_drawing_region = false;
var _via_current_image_loaded = false;
var _via_is_window_resized = false;
var _via_is_user_resizing_region = false;
var _via_is_user_moving_region = false;
var _via_is_region_selected = false;
var _via_is_all_region_selected = false;
var _via_is_loaded_img_list_visible = false;
var _via_is_attributes_panel_visible = false;
var _via_is_reg_attr_panel_visible = false;
var _via_is_file_attr_panel_visible = false;
var _via_is_canvas_zoomed = false;
var _via_is_loading_current_image = false;
var _via_is_region_id_visible = true;
var _via_is_region_boundary_visible = true;
var _via_is_region_info_visible = false;
var _via_is_ctrl_pressed = false;
var _via_is_debug_mode = false;

// region
var _via_current_shape = VIA_REGION_SHAPE.RECT;
var _via_current_polygon_region_id = -1;
var _via_user_sel_region_id = -1;
var _via_click_x0 = 0; var _via_click_y0 = 0;
var _via_click_x1 = 0; var _via_click_y1 = 0;
var _via_region_click_x, _via_region_click_y;
var _via_region_edge = [-1, -1];
var _via_current_x = 0; var _via_current_y = 0;

// region copy/paste
var _via_region_selected_flag = []; // region select flag for current image
var _via_copied_image_regions = [];
var _via_paste_to_multiple_images_input;

// message
var _via_message_clear_timer;

// attributes
var _via_attribute_being_updated = 'region'; // {region, file}
// var _via_attributes = { 'region' : {'osteophytes':['0 (None or doubtful)','1 (Obvioust)','2 (Obviouse and big)']}, 
//                         'file' : {'filename':1, 'KL-grade':[1,2,3], 'Sclerosis':[1,2,3], 'Joint Space Width':[1,2,3], 'gender':[1,2,3], 'age':-1}};
var _via_attributes = {'region':{},'file':{}};
var _via_current_attribute_id = '';

// region group color
var _via_canvas_regions_group_color = {}; // color of each region

// invoke a method after receiving user input
var _via_user_input_ok_handler = null;
var _via_user_input_cancel_handler = null;
var _via_user_input_data = {};

// annotation editor
var _via_annotaion_editor_panel = document.getElementById('annotation_editor_panel');
var _via_metadata_being_updated = 'region'; // {region, file}
var _via_annotation_editor_mode = VIA_ANNOTATION_EDITOR_MODE.SINGLE_REGION;

// persistence to local storage
var _via_is_local_storage_available = false;
var _via_is_save_ongoing = false;

// all the image_id and image_filename of images added by the user is
// stored in _via_image_id_list and _via_image_filename_list
//
// Image filename list (img_fn_list) contains a filtered list of images
// currently accessible by the user. The img_fn_list is visible in the
// left side toolbar. image_grid, next/prev, etc operations depend on
// the contents of _via_img_fn_list_img_index_list.
var _via_image_id_list = []; // array of all image id (in order they were added by user)
var _via_image_filename_list = []; // array of all image filename
var _via_image_load_error = []; // {true, false}
var _via_image_filepath_resolved = []; // {true, false}
var _via_image_filepath_id_list = []; // path for each file

var _via_reload_img_fn_list_table = true;
var _via_img_fn_list_img_index_list = []; // image index list of images show in img_fn_list
var _via_img_fn_list_html = []; // html representation of image filename list

// image grid
var image_grid_panel = document.getElementById('image_grid_panel');
var _via_display_area_content_name = ''; // describes what is currently shown in display area
var _via_display_area_content_name_prev = '';
var _via_image_grid_requires_update = false;
var _via_image_grid_content_overflow = false;
var _via_image_grid_load_ongoing = false;
var _via_image_grid_page_first_index = 0; // array index in _via_img_fn_list_img_index_list[]
var _via_image_grid_page_last_index = -1;
var _via_image_grid_selected_img_index_list = [];
var _via_image_grid_page_img_index_list = []; // list of all image index in current page of image grid
var _via_image_grid_visible_img_index_list = []; // list of images currently visible in grid
var _via_image_grid_mousedown_img_index = -1;
var _via_image_grid_mouseup_img_index = -1;
var _via_image_grid_img_index_list = []; // list of all image index in the image grid
var _via_image_grid_region_index_list = []; // list of all image index in the image grid
var _via_image_grid_group = {}; // {'value':[image_index_list]}
var _via_image_grid_group_var = []; // {type, name, value}
var _via_image_grid_group_show_all = false;
var _via_image_grid_stack_prev_page = []; // stack of first img index of every page navigated so far

// image buffer
var VIA_IMG_PRELOAD_INDICES = [1, -1, 2, 3, -2, 4]; // for any image, preload previous 2 and next 4 images
var VIA_IMG_PRELOAD_COUNT = 4;
var _via_buffer_preload_img_index = -1;
var _via_buffer_img_index_list = [];
var _via_buffer_img_shown_timestamp = [];
var _via_preload_img_promise_list = [];

// via settings
var _via_settings = {};
_via_settings.ui = {};
_via_settings.ui.annotation_editor_height = 17; // in percent of the height of browser window
_via_settings.ui.annotation_editor_fontsize = 0.8;// in rem
_via_settings.ui.leftsidebar_width = 18;  // in rem

_via_settings.ui.image_grid = {};
_via_settings.ui.image_grid.img_height = 80;  // in pixel
_via_settings.ui.image_grid.rshape_fill = 'none';
_via_settings.ui.image_grid.rshape_fill_opacity = 0.3;
_via_settings.ui.image_grid.rshape_stroke = 'yellow';
_via_settings.ui.image_grid.rshape_stroke_width = 2;
_via_settings.ui.image_grid.show_region_shape = true;
_via_settings.ui.image_grid.show_image_policy = 'all';

_via_settings.ui.image = {};
_via_settings.ui.image.region_label = '__via_region_id__'; // default: region_id
_via_settings.ui.image.region_color = '__via_default_region_color__'; // default color: yellow
_via_settings.ui.image.region_label_font = '10px Sans';
_via_settings.ui.image.on_image_annotation_editor_placement = VIA_ANNOTATION_EDITOR_PLACEMENT.NEAR_REGION;

_via_settings.core = {};
_via_settings.core.buffer_size = 4 * VIA_IMG_PRELOAD_COUNT + 2;
_via_settings.core.filepath = {};
_via_settings.core.default_filepath = './statics/test_img/11/project_202007161644/';

_via_settings.project = {};
_via_settings.project.name = null;



var BBOX_LINE_WIDTH = 4;
var BBOX_SELECTED_OPACITY = 0.3;
var BBOX_BOUNDARY_FILL_COLOR_ANNOTATED = "#f2f2f2";
var BBOX_BOUNDARY_FILL_COLOR_NEW = "#aaeeff";
var BBOX_BOUNDARY_LINE_COLOR = "#1a1a1a";
var BBOX_SELECTED_FILL_COLOR = "#ffffff";

var VIA_ANNOTATION_EDITOR_HEIGHT_CHANGE = 3;   // in percent
var VIA_ANNOTATION_EDITOR_FONTSIZE_CHANGE = 0.1; // in rem
var VIA_IMAGE_GRID_IMG_HEIGHT_CHANGE = 20;  // in percent
var VIA_LEFTSIDEBAR_WIDTH_CHANGE = 1;   // in rem
var VIA_POLYGON_SEGMENT_SUBTENDED_ANGLE = 5;   // in degree (used to approximate shapes using polygon)
var VIA_FLOAT_PRECISION = 3; // number of decimal places to include in float values

var _via_wrong_img_list = [];
var _via_global_index = 0;
var _via_mouse_position = {x:0, y:0};
var _via_canvas_position = false;
var _via_mouse_down = false;
var _via_draw1_mouse_position = {x:250, y:290};
var _via_draw2_mouse_position = {x:250, y:290};
var _via_draw3_mouse_position = {x:250, y:290};



var niftiHeader, niftiImage;
  