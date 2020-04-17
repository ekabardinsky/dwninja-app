import React, {Component} from 'react';
import {connect} from "react-redux";
import AceEditor from "react-ace";
import {calculateHeight} from "../../utils/Utils";
import DoubleArrow from '@material-ui/icons/DoubleArrow';
import IconButton from "@material-ui/core/IconButton";
import {
    evaluationEnd,
    evaluationStarted,
    updateLastOutput,
} from "../../redux/actions";

class OutputCode extends Component {
    handleHiyah() {
        this.props.evaluationStarted({
            evaluationEnd: this.props.evaluationEnd,
            updateLastOutput: this.props.updateLastOutput
        });
    }

    render() {
        let mode = this.props.project.lastOutput.mimeType.match(/\/(.*)/)[1];
        const finalOffset = calculateHeight(this.props.project);

        return <React.Fragment>
            <AceEditor
                mode={mode}
                theme={this.props.project.selectedTheme}
                name="OUTPUT_CODE"
                value={this.props.project.lastOutput.result}
                width={"100%"}
                wrapEnabled={true}
                debounceChangePeriod={1000}
                height={`calc(100vh - ${finalOffset}px)`}
                editorProps={{$blockScrolling: Infinity}}
            />
            <div style={{position: 'absolute', marginLeft: '-10px', marginTop: '-50vh', zIndex: '1000'}}>
                <IconButton onClick={this.handleHiyah.bind(this)}><DoubleArrow fontSize="medium"/></IconButton></div>
        </React.Fragment>
    }
}

const mapStateToProps = state => {
    return {
        project: state.project
    }
};

const mapDispatchToProps = {
    evaluationEnd,
    evaluationStarted,
    updateLastOutput,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(OutputCode);