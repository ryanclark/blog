import Typography from 'typography';

const typography = new Typography({
  baseFontSize: '16px',
  baseLineHeight: '26px',
  bodyFontFamily: ['Open Sans', 'sans-serif'],
  overrideStyles: ({ adjustFontSizeTo, scale, rhythm }, options) => ({
    a: {
      color: "#007acc",
      textDecoration: "none",
    },
  }),
});

// Hot reload typography in development.
if (process.env.NODE_ENV !== `production`) {
  typography.injectStyles();
}

export const rhythm = typography.rhythm;
export const scale = typography.scale;

export default typography;
