import {createGlobalStyle} from 'styled-components';

import C64Font from '../assets/fonts/c64.ttf'
import AmigaFont from '../assets/fonts/amiga4ever.ttf'

const Fonts = createGlobalStyle`
    @font-face {
        font-family: 'EightBit';
        src: url(${C64Font}) format('truetype');
    }
`;

export default Fonts
