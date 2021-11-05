import React from 'react'
import { Table, Form } from 'antd';
import reqwest from 'reqwest';

let query;
const columns = [
    {
      title: 'Nutrition Name',
      dataIndex: 'nutritionName',
      key: 'nutritionName',
      width: '20%',
    },
    {
      title: 'Nutrition Quantity',
      dataIndex: 'totalNutrients',
      key: 'totalNutrients',
      width: '20%',
    },
    {
      title: 'Daily Value',
      dataIndex: 'totalDaily',
      key: 'totalDaily',
      width: '20%',
    },
];

class NutritionValue extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      loading: false,
    };
  };

  componentDidMount() {
    console.log('props', this.props.location.search)
    query = this.props.location.search;
    console.log(query)
    this.fetch();
  }

  fetch = (params = {}) => {
    console.log('params:', params);
    this.setState({ loading: true });
    reqwest({
      url: `http://localhost:3000/api/v1.0/nutrition/${query}`,
      method: 'get',
      data: {
      },
      type: 'json',
    }).then(data => {
      this.setState({
        loading: false,
        data: data,
      });
    });
  };

  render() {
    return (
        <Table
          bordered
          dataSource={this.state.data}
          columns={columns}
          rowClassName="editable-row"
          rowKey={record => record.nutritionName }          
          loading={this.state.loading}
          title={() => 'Nutrition Value'}
          footer={() => '*Percent Daily Values are based on a 2000 calorie diet'}
        />
    );
  }
}

const NutritionValueForm = Form.create()(NutritionValue)
export default NutritionValueForm;