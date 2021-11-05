import React from 'react';
import { Form, Icon, Input, Alert, Button } from 'antd';
import { Redirect } from "react-router"


var username = ""

function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class HorizontalLoginForm extends React.Component {

    state = {
        confirmDirty: false,
        addedSucessfully: false, //if the user is added successfully
        showSuccess: false, //if should we show a successful feedback message after adding a user
        showError: false, //if should we show an error feedback message after adding a user
        errorCode: 400,  //to save the errorCode we recieved from the api server
        responseStatus: "nothing",  //the validation status of the email
        errorMessage: ""   //the error message to display to the user after server rejects action
    };

    componentDidMount() {
        // To disabled submit button at the beginning.
        this.props.form.validateFields();
    }

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);

                //use fetch API to post the user data
                fetch('http://localhost:3000/api/v1.0/users/login', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ values })
                }).then(res => {
                    // if there is a request from back
                    if (res.ok)
                        this.setState({ addedSucessfully: true })
                    else
                        this.setState({
                            addedSucessfully: false,
                            errorCode: res.status
                        });
                    return res.json()
                }).then(data => this.checkResponse(data))
                    .catch(err => console.log(`error :$(err.message}`))
            }
        });
    };


    checkResponse = (data) => {

        if (this.state.addedSucessfully) {
            
            this.props.form.resetFields('password');
            this.setState({
                showSuccess: true,
                showError: false
            });
        }

        else {
            //handle errors
            this.setState({
                errorMessage: data.message,
                showSuccess: false,
                showError: true,
                responseStatus: "error"
            });
        }
    }

    render() {
        const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched,getFieldValue } = this.props.form;

        // Only show error after a field is touched.
        const usernameError = isFieldTouched('username') && getFieldError('username');
        const passwordError = isFieldTouched('password') && getFieldError('password');
        username = getFieldValue('username')
       

        return (
            <Form layout="inline" onSubmit={this.handleSubmit}>
                <Form.Item validateStatus={usernameError ? 'error' : ''} help={usernameError || ''}>
                    {getFieldDecorator('username', {
                        rules: [{ required: true, message: 'Please input your username!' }],
                    })(
                        <Input
                            prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                            placeholder="Username"
                        />,
                    )}
                </Form.Item>


                <Form.Item validateStatus={passwordError ? 'error' : ''} help={passwordError || ''}>
                    {getFieldDecorator('password', {
                        rules: [{ required: true, message: 'Please input your Password!' }],
                    })(
                        <Input
                            prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                            type="password"
                            placeholder="Password"
                        />,
                    )}
                </Form.Item>


                <Form.Item>
                    <Button type="primary" htmlType="submit" disabled={hasErrors(getFieldsError())}>
                        Log in
                    </Button>
                </Form.Item>
            
                {this.state.showSuccess ? <Redirect to={{ pathname: "/ComposerPage", search:  'username=' + username , }} /> : null}
                {this.state.showError ? <Alert message={this.state.errorMessage} type="error" /> : null}
            </Form>
        );
    }
}


const Signin/*WrappedHorizontalLoginForm*/ = Form.create({ name: 'horizontal_login' })(HorizontalLoginForm);

export default Signin;