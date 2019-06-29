import React from 'react';

class Loading extends React.Component {
  render() {
    if(!this.props.isLoading)
      return null;
    return(
      <div className="d-flex justify-content-center">
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }
}

export default Loading

