import React, {Component} from 'react';
import {changeValueCurrentVariable} from "../../redux/actions";
import {connect} from "react-redux";
import AceEditor from "react-ace";

class InputCode extends Component {

    render() {
        let mode = this.props.project.selectedVariable.mimeType.match(/\/(.*)/)[1];
        const bottomElementsCount = this.props.project.selectedProject.configs.variables.length + 1;
        const bottomLines = Math.min(Math.ceil(bottomElementsCount / 4), 3);
        const offset = 10;
        const topBarOffset = 64;
        const bottomBarSize = 56;
        const finalOffset = topBarOffset + offset + bottomBarSize * bottomLines;

        return <AceEditor
            mode={mode}
            theme="monokai"
            name="INPUT_CODE"
            value={this.props.project.selectedVariable.value}
            width={"100%"}
            wrapEnabled={true}
            height={`calc(100vh - ${finalOffset}px)`}
            onChange={this.props.changeValueCurrentVariable}
            editorProps={{$blockScrolling: Infinity}}
        />
    }
}

const mapStateToProps = state => {
    return {
        project: state.project
    }
};

const mapDispatchToProps = {changeValueCurrentVariable};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(InputCode);