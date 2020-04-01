import React, {Component} from 'react';
import {changeExpression} from "../../redux/actions";
import {connect} from "react-redux";
import AceEditor from "react-ace";

class InputCode extends Component {
    render() {
        const bottomElementsCount = this.props.project.selectedProject.configs.variables.length + 1;
        const bottomLines = Math.min(Math.ceil(bottomElementsCount / 4), 3);
        const offset = 10;
        const topBarOffset = 64;
        const bottomBarSize = 56;
        const finalOffset = topBarOffset + offset + bottomBarSize * bottomLines;

        return <AceEditor
            mode={this.props.project.selectedProject.configs.evaluator}
            theme="monokai"
            name="EVALUATOR_CODE"
            width={"100%"}
            wrapEnabled={true}
            height={`calc(100vh - ${finalOffset}px)`}
            onChange={this.props.changeExpression}
            value={this.props.project.selectedProject.configs.expression}
            editorProps={{ $blockScrolling: Infinity }}
        />
    }
}

const mapStateToProps = state => {
    return {
        project: state.project
    }
};

const mapDispatchToProps = {changeExpression};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(InputCode);