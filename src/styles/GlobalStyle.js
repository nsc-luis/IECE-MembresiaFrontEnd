import { createGlobalStyle } from 'styled-components';

export default createGlobalStyle`
    *{
        margin: o;
        padding: 0;
        outline: 0;
        box-sizing: border-box;
    }

    html, body, #root {
        height: 100%;
    }

    h1, h2, h3, h4, h5 {
        margin: 0;
    }

    input {
        &::placeholder {
            color: rgba(0,0,0,0.3)
        }
    }
`