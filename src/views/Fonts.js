import { createGlobalStyle } from 'styled-components';

import C64Font from '../assets/fonts/c64.ttf'

const Fonts =  createGlobalStyle`
    @font-face {
        font-family: 'C64Font';
        src: url(${C64Font}) format('truetype');
    }
`;

export default Fonts
