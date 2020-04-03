import React, {Component} from 'react';
import {connect} from "react-redux";
import AceEditor from "react-ace";
import {calculateHeight} from "../../utils/Utils";

class OutputCode extends Component {
    render() {
        let mode = this.props.project.lastOutput.mimeType.match(/\/(.*)/)[1];
        const finalOffset = calculateHeight(this.props.project);

        return <AceEditor
            mode={mode}
            theme={this.props.project.selectedTheme}
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