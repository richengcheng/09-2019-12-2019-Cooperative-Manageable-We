import React from 'react';

import {
  Form, Input, Alert, Button, Checkbox,
  Select,
  InputNumber,
  Switch,
  Radio,
  Slider,
  message,
  Upload,
  Icon,
  Rate,

  Row,
  Col,
} from 'antd';

const { TextArea } = Input;
let id = 0;

var query = ""

const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 8 },
};

const formTailLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 8, offset: 4 },
};


const fileList = [
];


class ComposerPage extends React.Component {

  

  remove = k => {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    // We need at least one passenger
    if (keys.length === 1) {
      return;
    }
    // can use data-binding to set
    form.setFieldsValue({
      keys: keys.filter(key => key !== k),
    });
  };


  onChange = ({ target: { value } }) => {
    this.setState({ value });
  };


  state = {
    confirmDirty: false,
    addedSucessfully: false, //if the user is added successfully
    showSuccess: false, //if should we show a successful feedback message after adding a user
    showError: false, //if should we show an error feedback message after adding a user
    errorCode: 400,  //to save the errorCode we recieved from the api server
    responseStatus: "nothing",  //the validation status of the email
    errorMessage: "",  //the error message to display to the user after server rejects action
    checkNick: false,
  };


  check = () => {
    this.props.form.validateFields(err => {
      if (!err) {
        console.info('success');
      }
    });
  };


  handleChange = e => {
    this.setState(
      {
        checkNick: e.target.checked,
      },
      () => {
        this.props.form.validateFields(['recipeDescription'], { force: true });
      },
    );
  };

  // use it atomatically
  componentDidMount() {
    // this.props.form.validateFields();
    console.log('propsssssssssssssssssss', this.props.location.search)
    query = this.props.location.search;
    //console.log(query)
    //this.fetch();
  }

  handleSubmit = e => {
    e.preventDefault();

    this.props.form.validateFields((err, values) => {
      const realdata = JSON.stringify({ values });
      console.log("11111111111111 realdata =", realdata)
      if (!err) {
        console.log('Received values of form: 111111111', values);

        //use fetch API to post the user data
        fetch(`http://localhost:3000/api/v1.0/recipes/addrecipes${query}`, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: realdata
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


  add = () => {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    const nextKeys = keys.concat(id++);
    // can use data-binding to set
    // important! notify form to detect changes
    form.setFieldsValue({
      keys: nextKeys,
    });
  };


  stepSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { keys, names } = values;
        console.log('Received values of form: ', values);
        console.log('Merged values:', keys.map(key => names[key]));
      }
    });
  };

  render() {

    const props2 = {
      name: 'file',
      action: `https://www.mocky.io/v2/5cc8019d300000980a055e76`,
      headers: {
        authorization: 'authorization-text',
      },
      onChange(info) {
        if (info.file.status !== 'uploading') {
          console.log("111111111111121212221111111111111111111", info.file, info.fileList);
        }
        if (info.file.status === 'done') {
          message.success(`${info.file.name} file uploaded successfully`);
        } else if (info.file.status === 'error') {
          message.error(`${info.file.name} file upload failed.`);
        }
      },
    };

    
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
      },
    };
    const formItemLayoutWithOutLabel = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 20, offset: 4 },
      },
    };

    getFieldDecorator('keys', { initialValue: [] });
    const keys = getFieldValue('keys');



    const formItems = keys.map((k, index) => (

      <Form>

        <Form.Item
          {...formItemLayout}
          label={`steps[${k + 1}]`}
          required={false}
          key={k - 1}
        >

          {getFieldDecorator(`steps[${k}]`, {
            validateTrigger: ['onChange', 'onBlur'],
            rules: [
              {
                required: true,
                whitespace: true,
                message: "Please input passenger's name or delete this field.",
              },
            ],
          })(<Input placeholder="passenger name" style={{ width: '60%', marginRight: 8 }} />)}
          {keys.length > 1 ? (
            <Icon
              className="dynamic-delete-button"
              type="minus-circle-o"
              onClick={() => this.remove(k)}
            />
          ) : null}
        </Form.Item>




        <Form.Item 
          {...formItemLayout}
          label={`pciture[${k + 1}]`}
          required={false}
          key={k}   >
          {getFieldDecorator(`pcitures[${k}]`, {
            validateTrigger: ['onChange', 'onBlur'],
          })(<Upload  {...props2}>
            <Button  >
              <Icon type="upload" /> Upload pciture
              </Button>
          </Upload>)}

        </Form.Item>
      </Form>



    ));

    return (
      <div>

        <Form onSubmit={this.handleSubmit}>

          <Form.Item  {...formItemLayout} label="category">
            {getFieldDecorator('category', {
            })(
              <Radio.Group    >
                <Radio value="chinese food">chinese food </Radio>
                <Radio value="english food">english food</Radio>
                <Radio value="american food">american food </Radio>
              </Radio.Group>
            )}
          </Form.Item>

          <Form.Item {...formItemLayout} label="recipeTitle">
            {getFieldDecorator('recipeTitle', {
              rules: [
                {
                  required: true,
                  message: 'Please input recipeTitle',
                },
              ],
            })(<Input placeholder="Please inpu recipeTitle" />)}
          </Form.Item>

          <Form.Item {...formItemLayout} label="recipeSubTitle">
            {getFieldDecorator('recipeSubTitle', {
              rules: [
                {
                  required: true,
                  message: 'Please input recipeSubTitle',
                },
              ],
            })(<Input placeholder="Please inpu recipeSubTitle" />)}
          </Form.Item>


          <Form.Item {...formItemLayout} label="recipeDescription">
            {getFieldDecorator('recipeDescription', {
              rules: [
                {
                  required: this.state.checkNick,
                  message: 'Please input recipeDescription',
                },
              ],
            })(<TextArea placeholder="Please input recipeDescription" autosize={{ minRows: 5, maxRows: 7 }} />)}
          </Form.Item>

          
          <Form.Item {...formItemLayout} label="ingredients title">
            {getFieldDecorator('ingredientsTitle', {
              rules: [
                {
                  required: this.state.checkNick,
                  message: 'Please input ingredients title',
                },
              ],
            })(<TextArea placeholder="Please input ingredients title" autosize={{ minRows: 5, maxRows: 7 }} />)}
          </Form.Item>


          <Form.Item {...formItemLayout} label="ingredients description">
            {getFieldDecorator('ingredientsDescription', {
              rules: [
                {
                  required: this.state.checkNick,
                  message: 'Please input ingredients description',
                },
              ],
            })(<TextArea placeholder="Please input ingredients description" autosize={{ minRows: 5, maxRows: 7 }} />)}
          </Form.Item>


          {formItems}

          <Form.Item {...formItemLayoutWithOutLabel}>
            <Button type="dashed" onClick={this.add} style={{ width: '60%' }}>
              <Icon type="plus" /> Add steps
            </Button>
          </Form.Item>


          <Form.Item {...formTailLayout}>
            <Button type="primary" htmlType="submit" onClick={this.check}>
              submit
          </Button>
          </Form.Item>

        </Form>

      </div>
    );
  }
}

const composerPage = Form.create({ name: 'register' })(ComposerPage);

export default composerPage;

