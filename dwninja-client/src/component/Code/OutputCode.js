import React, {Component} from 'react';
import {connect} from "react-redux";
import AceEditor from "react-ace";

class OutputCode extends Component {

    render() {
        let mode = this.props.project.lastOutput.mimeType.match(/\/(.*)/)[1];
        const bottomElementsCount = this.props.project.selectedProject.configs.variables.length + 1;
        const bottomLines = Math.min(Math.ceil(bottomElementsCount / 4), 3);
        const offset = 10;
        const topBarOffset = 64;
        const bottomBarSize = 56;
        const finalOffset = topBarOffset + offset + bottomBarSize * bottomLines;

        return <AceEditor
            mode={mode}
            theme="monokai"
            name="OUTPUT_CODE"
            value={this.props.project.lastOutput.result}
            width={"100%"}
            wrapEnabled={true}
            readOnly={true}
            height={`calc(100vh - ${finalOffset}px)`}
            editorProps={{$blockScrolling: Infinity}}
        />
    }
}

const mapStateToProps = state => {
    return {
        project: state.project
    }
};

const mapDispatchToProps = {};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(OutputCode);