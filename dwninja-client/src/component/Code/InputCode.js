import React, {Component} from 'react';
import {changeValueCurrentVariable} from "../../redux/actions";
import {connect} from "react-redux";
import AceEditor from "react-ace";
import {calculateHeight} from "../../utils/Utils";

class InputCode extends Component {

    render() {
        let mode = this.props.project.selectedVariable.mimeType.match(/\/(.*)/)[1];
        const finalOffset = calculateHeight(this.props.project);


        return <AceEditor
            mode={mode}
            theme={this.props.project.selectedTheme}
            name="INPUT_CODE"
            value={this.props.project.selectedVariable.value}
            width={"100%"}
            wrapEnabled={true}
            debounceChangePeriod={500}
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