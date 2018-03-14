import React from 'react';

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  searchItems(e) {
    e.preventDefault();

    console.error('@ test hdhdh');
  }

  render() {

    return (
      <div className="container">
        <h1>Search functionality</h1>
        <form action="" noValidate="novalidate" onSubmit={e => this.searchItems(e)}>
          <fieldset>
            <div className="form-group">
              <input
                className="form-control"
                type='text'
                placeholder='Enter search text'
                onChange={e => this.searchItems(e)
                }
              />
              <button className="btn btn-primary" type="submit">
                Go
              </button>
            </div>
          </fieldset>
        </form>
      </div>
    );
  }
}

export default Search;