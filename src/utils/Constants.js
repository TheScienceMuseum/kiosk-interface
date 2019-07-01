export const ArticleTypes = {
    TITLE: 'title',
    VIDEO: 'video',
    MIXED: 'mixed',
    MODEL: 'model',
    TIMELINE: 'timeline',
};

export const PageTypes = {
    TEXT_IMAGE: 'textImage',
    TITLE: 'title',
    IMAGE: 'image',
    AUDIO: 'audio',
    VIDEO: 'video',
    VIDEO_TEXT: 'textVideo',
    TEXT_AUDIO: 'textAudio',
};

export const AssetTypes = {
    VIDEO: 'video',
    IMAGE: 'image',
    MODEL: 'model',
};

export const Orientations = {
    HORIZONTAL: 'horiziontal',
    VERTICAL: 'vertical',
    EXACT: 'exact',
};

export const Layouts = {
    LEFT: 'left',
    RIGHT: 'right',
};

export const Environments = {
    TESTING: 'testing',
    BROWSER: 'browser',
    DEVELOPMENT: 'development',
    STAGING: 'staging',
    PRODUCTION: 'production',
};

export const ScreenSize = {
    '16:9': {
        width: 1920,
        height: 1080,
    },
    '9:16': {
        width: 800,
        height: 1280,
    },
};

export const Dimensions = {
    landscape: {
        MENU_ITEM_WIDTH: 1422,
        MENU_ITEM_SPACING: 20,
        MENU_ITEM_PADDING: 100,
        TITLE_ITEM_WIDTH: 800,
        ASPECT_RATIO: '16:9',
    },
    portrait: {
        MENU_ITEM_WIDTH: 500,
        MENU_ITEM_SPACING: 20,
        MENU_ITEM_PADDING: 100,
        TITLE_ITEM_WIDTH: 500,
        ASPECT_RATIO: '9:16',
    },
};

export const AppStates = {
    ATTRACTOR: 'attractor',
    MENU: 'menu',
};

export const MoveDirections = {
    LEFT: 'left',
    RIGHT: 'right',
};
