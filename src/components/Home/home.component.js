import React from 'react';
import Search from '../Search/search.component';


class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  render() {

    const {email, password} = this.state;

    return (
      <div className="container">
        <h1>Welcome to the Rype Website!</h1>
        <Search/>
      </div>
    );
  }
}

export default Home;