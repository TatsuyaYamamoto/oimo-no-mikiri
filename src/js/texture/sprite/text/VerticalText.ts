import {TextStyleOptions} from 'pixi.js';

import {getCurrentLanguage} from '../../../../framework/i18n';

import Text from "../../internal/Text";

const VERTICAL_SUPPORT_LANGUAGES = ['ja'];

const VERTICAL_DEFAULT_STYLE: TextStyleOptions = {
    align: 'center'
};

class VerticalText extends Text {
    constructor(text: string, style: TextStyleOptions = {}) {
        const currentLang = getCurrentLanguage();
        const isVerticalSupportLang = VERTICAL_SUPPORT_LANGUAGES.some(l => l === currentLang);

        const verticalText = isVerticalSupportLang ?
            // insert newline character in character spacing.
            text.replace(/(.)(?=.)/g, "$1\n") :
            text;

        const verticalStyle = isVerticalSupportLang ?
            Object.assign(style, VERTICAL_DEFAULT_STYLE) :
            style;

        super(verticalText, verticalStyle)
    }
}

export default VerticalText;
