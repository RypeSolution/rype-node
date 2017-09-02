import React from 'react';
import axios from 'axios';
import './Main.css';
import text from '../../text';

class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: '',
            lastName: ''
        }
    }

    handleSubmit(e) {
		e.preventDefault();
        const { firstName, lastName } = this.state;

        //drop the api URL here
        axios({
            method: 'post',
            url: 'http://localhost:8081/signup',
            data: {
                firstName,
                lastName
            }
        })
        .then(function (response) {
            //on success of POST, do something here...
            console.log('response:', response)
        })
        .catch(function (error) {
            //do somethign here with error (http or api error)
            console.error(error)
        });
    }

    render() {
        const { firstName, lastName } = this.state;

        return (
            <div className="container">
                <div className="row">
                    <div className="col-lg-6">
                        <h1 className="test">{text.header}</h1>
                        <form action="" noValidate="novalidate" onSubmit={e => this.handleSubmit(e)}>
                            <fieldset>
                                <div className="form-group">
                                    <label>{text.form.labelName}</label>
                                    <input
                                        className="form-control"
                                        placeholder={text.form.inputFirstNameText}
                                        value={firstName}
                                        onChange={e => this.setState({
                                            firstName: e.target.value
                                        })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>{text.form.labelLastName}</label>
                                    <input
                                        className="form-control"
                                        placeholder={text.form.inputLastNameText}
                                        value={lastName}
                                        onChange={e => this.setState({
                                            lastName: e.target.value
                                        })}
                                    />
                                </div>
                                <button className="btn btn-primary" type="submit">
                                {text.form.button}
                                </button>
                            </fieldset>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

export default Main;