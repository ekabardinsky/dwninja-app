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