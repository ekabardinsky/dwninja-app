const hexRgb = require('hex-rgb');
const rgbHex = require('rgb-hex');

export const getVariableFullName = (variable, project) => {
    const evaluator = project.selectedProject.configs.evaluator;
    const variableTypes = project.evaluators.find(item => item.name === evaluator).variableTypes;
    const selectedVariableType = variableTypes.find(type => type.name === variable.type);

    if (!selectedVariableType.supportNestedNames) {
        return variable.type;
    } else if (selectedVariableType.isFunction) {
        return `${variable.type}('${variable.name}')`;
    } else {
        return `${variable.type}.${variable.name}`;
    }
};

export const getTheme = (name) => {
    const getColor = (number) => number <= 0 ? 0 : Math.min(255, Math.round(number));
    const {isDark, cssText} = require(`ace-builds/src-noconflict/theme-${name}`);
    const gutterColorHex = cssText.match(/\.ace_gutter(-active-line)?\s?{background(-color)?\s?[^;]+;/g)[0].match(/#[^;]+;/g)[0].replace(";", "");
    const step = isDark ? 30 : -30;

    const mainColor = hexRgb(gutterColorHex);
    const mainIntensiveColor = {
        red: getColor(mainColor.red + step),
        green: getColor(mainColor.green + step),
        blue: getColor(mainColor.blue + step)
    };
    const mainNegativeColor = {
        red: getColor(mainColor.red - step),
        green: getColor(mainColor.green - step),
        blue: getColor(mainColor.blue - step)
    };


    const primary = {
        main: `#${rgbHex(mainColor.red, mainColor.green, mainColor.blue)}`,
        light: `#${rgbHex(mainIntensiveColor.red, mainIntensiveColor.green, mainIntensiveColor.blue)}`,
        dark: `#${rgbHex(mainNegativeColor.red, mainNegativeColor.green, mainNegativeColor.blue)}`
    };

    return {
        palette: {
            type: isDark ? "dark" : "light",
            primary,
            background: {
                paper: `#${rgbHex(mainIntensiveColor.red, mainIntensiveColor.green, mainIntensiveColor.blue)}`
            }
        }
    }
};